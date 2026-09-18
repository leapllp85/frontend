"use client";

import {
  surveyActionItems,
  surveyResponses,
  surveyTemplates,
} from "./actionSurveyData";

type WorkbookCellValue = string | number | boolean | null | undefined;
type WorkbookRow = Record<string, WorkbookCellValue>;

type WorkbookSheet = {
  name: string;
  rows: readonly WorkbookRow[];
};

type ZipFile = {
  path: string;
  content: Uint8Array;
};

const encoder = new TextEncoder();
const crcTable = new Uint32Array(256);

for (let tableIndex = 0; tableIndex < 256; tableIndex += 1) {
  let crc = tableIndex;
  for (let bitIndex = 0; bitIndex < 8; bitIndex += 1) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  crcTable[tableIndex] = crc >>> 0;
}

function escapeXml(value: WorkbookCellValue) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getColumnName(index: number) {
  let columnName = "";
  let remaining = index + 1;

  while (remaining > 0) {
    const modulo = (remaining - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    remaining = Math.floor((remaining - modulo) / 26);
  }

  return columnName;
}

function buildCell(value: WorkbookCellValue, rowIndex: number, columnIndex: number) {
  const reference = `${getColumnName(columnIndex)}${rowIndex + 1}`;

  if (typeof value === "number") {
    return `<c r="${reference}"><v>${value}</v></c>`;
  }

  return `<c r="${reference}" t="inlineStr"><is><t>${escapeXml(value)}</t></is></c>`;
}

function buildSheetXml(sheet: WorkbookSheet) {
  const columns = sheet.rows.length > 0 ? Object.keys(sheet.rows[0]) : [];
  const headerRow = `<row r="1">${columns.map((column, columnIndex) => buildCell(column, 0, columnIndex)).join("")}</row>`;
  const dataRows = sheet.rows
    .map((row, rowIndex) => {
      const actualRowIndex = rowIndex + 1;
      return `<row r="${actualRowIndex + 1}">${columns.map((column, columnIndex) => buildCell(row[column], actualRowIndex, columnIndex)).join("")}</row>`;
    })
    .join("");
  const columnDefinitions = columns
    .map((_, index) => `<col min="${index + 1}" max="${index + 1}" width="${index === 0 ? 18 : 28}" customWidth="1"/>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>${columnDefinitions}</cols>
  <sheetData>${headerRow}${dataRows}</sheetData>
</worksheet>`;
}

function buildContentTypes(sheetCount: number) {
  const sheetOverrides = Array.from({ length: sheetCount }, (_, index) => (
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  )).join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  ${sheetOverrides}
</Types>`;
}

function buildWorkbookXml(sheets: readonly WorkbookSheet[]) {
  const sheetEntries = sheets
    .map((sheet, index) => `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>${sheetEntries}</sheets>
</workbook>`;
}

function buildWorkbookRels(sheetCount: number) {
  const sheetRelationships = Array.from({ length: sheetCount }, (_, index) => (
    `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
  )).join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheetRelationships}
  <Relationship Id="rId${sheetCount + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
}

function crc32(content: Uint8Array) {
  let crc = 0xffffffff;

  for (let index = 0; index < content.length; index += 1) {
    crc = crcTable[(crc ^ content[index]) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(target: Uint8Array, offset: number, value: number) {
  target[offset] = value & 0xff;
  target[offset + 1] = (value >>> 8) & 0xff;
}

function writeUint32(target: Uint8Array, offset: number, value: number) {
  target[offset] = value & 0xff;
  target[offset + 1] = (value >>> 8) & 0xff;
  target[offset + 2] = (value >>> 16) & 0xff;
  target[offset + 3] = (value >>> 24) & 0xff;
}

function createZip(files: readonly ZipFile[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  files.forEach((file) => {
    const name = encoder.encode(file.path);
    const checksum = crc32(file.content);
    const localHeader = new Uint8Array(30 + name.length);

    writeUint32(localHeader, 0, 0x04034b50);
    writeUint16(localHeader, 4, 20);
    writeUint16(localHeader, 6, 0);
    writeUint16(localHeader, 8, 0);
    writeUint16(localHeader, 10, 0);
    writeUint16(localHeader, 12, 0);
    writeUint32(localHeader, 14, checksum);
    writeUint32(localHeader, 18, file.content.length);
    writeUint32(localHeader, 22, file.content.length);
    writeUint16(localHeader, 26, name.length);
    writeUint16(localHeader, 28, 0);
    localHeader.set(name, 30);

    localParts.push(localHeader, file.content);

    const centralHeader = new Uint8Array(46 + name.length);
    writeUint32(centralHeader, 0, 0x02014b50);
    writeUint16(centralHeader, 4, 20);
    writeUint16(centralHeader, 6, 20);
    writeUint16(centralHeader, 8, 0);
    writeUint16(centralHeader, 10, 0);
    writeUint16(centralHeader, 12, 0);
    writeUint16(centralHeader, 14, 0);
    writeUint32(centralHeader, 16, checksum);
    writeUint32(centralHeader, 20, file.content.length);
    writeUint32(centralHeader, 24, file.content.length);
    writeUint16(centralHeader, 28, name.length);
    writeUint16(centralHeader, 30, 0);
    writeUint16(centralHeader, 32, 0);
    writeUint16(centralHeader, 34, 0);
    writeUint16(centralHeader, 36, 0);
    writeUint32(centralHeader, 38, 0);
    writeUint32(centralHeader, 42, offset);
    centralHeader.set(name, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + file.content.length;
  });

  const centralOffset = offset;
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const endRecord = new Uint8Array(22);

  writeUint32(endRecord, 0, 0x06054b50);
  writeUint16(endRecord, 4, 0);
  writeUint16(endRecord, 6, 0);
  writeUint16(endRecord, 8, files.length);
  writeUint16(endRecord, 10, files.length);
  writeUint32(endRecord, 12, centralSize);
  writeUint32(endRecord, 16, centralOffset);
  writeUint16(endRecord, 20, 0);

  return new Blob([...localParts, ...centralParts, endRecord], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function textFile(path: string, content: string): ZipFile {
  return {
    path,
    content: encoder.encode(content),
  };
}

function buildWorkbookBlob(sheets: readonly WorkbookSheet[]) {
  const files: ZipFile[] = [
    textFile("[Content_Types].xml", buildContentTypes(sheets.length)),
    textFile("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`),
    textFile("docProps/core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>Manager Survey Dashboard Export</dc:title>
  <dc:creator>CLYRA</dc:creator>
  <dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created>
</cp:coreProperties>`),
    textFile("docProps/app.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">
  <Application>CLYRA</Application>
</Properties>`),
    textFile("xl/workbook.xml", buildWorkbookXml(sheets)),
    textFile("xl/_rels/workbook.xml.rels", buildWorkbookRels(sheets.length)),
    textFile("xl/styles.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Arial"/></font></fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border/></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
</styleSheet>`),
    ...sheets.map((sheet, index) => textFile(`xl/worksheets/sheet${index + 1}.xml`, buildSheetXml(sheet))),
  ];

  return createZip(files);
}

function buildActionSurveySheets(): WorkbookSheet[] {
  return [
    {
      name: "Survey Templates",
      rows: surveyTemplates.map((template) => ({
        ID: template.id,
        Title: template.title,
        Description: template.description,
        Type: template.type,
        Status: template.status,
        Responses: template.responses ?? "Not published",
        "Response Rate": template.responseRate === null ? "Not published" : `${template.responseRate}%`,
        "Question Count": template.questionCount,
        Published: template.published ? "Yes" : "No",
        Updated: template.updatedLabel,
      })),
    },
    {
      name: "Survey Responses",
      rows: surveyResponses.map((response) => ({
        ID: response.id,
        Title: response.title,
        Type: response.type,
        Status: response.status,
        Submitted: response.submittedLabel,
        Reviewed: response.reviewedLabel ?? "Pending",
        Questions: response.overview.questions,
        Duration: response.overview.duration,
        Anonymous: response.overview.anonymous ? "Yes" : "No",
        Overview: response.overview.description,
        "Key Feedback": response.keyFeedback.map((feedback) => `${feedback.title}: ${feedback.description}`).join(" | "),
        "User Answers": response.userAnswers?.map((answer) => `${answer.question}: ${answer.answer}`).join(" | ") ?? "",
        "Manager Response": response.managerResponse.message,
        "Manager Responded": response.managerResponse.respondedLabel,
        Timeline: response.timeline.map((step) => `${step.label} (${step.timestamp})`).join(" | "),
        Actions: response.actions.map((action) => `${action.title} - ${action.status} - ${action.dueLabel}`).join(" | "),
      })),
    },
    {
      name: "Action Items",
      rows: surveyActionItems.map((item) => ({
        ID: item.id,
        Title: item.title,
        Source: item.source,
        "Source Survey": item.sourceSurvey,
        Description: item.description,
        Priority: item.priority,
        Status: item.status,
        "Due Date": item.dueDate,
        "Due Label": item.dueLabel,
        CTA: item.ctaLabel,
        "Insight Mentions": item.insightMentions,
        "Sentiment Insight": item.sentimentInsight,
      })),
    },
  ];
}

export function downloadActionSurveyWorkbook() {
  const workbookBlob = buildWorkbookBlob(buildActionSurveySheets());
  const url = URL.createObjectURL(workbookBlob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "manager-survey-dashboard-export.xlsx";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
