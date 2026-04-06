const fs = require('fs');

const content = fs.readFileSync('src/app/team-member-view/page.tsx', 'utf8');
const lines = content.split('\n');

let braces = 0;
let parens = 0;
let brackets = 0;
let inString = false;
let inTemplate = false;
let stringChar = '';

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const prevChar = j > 0 ? line[j-1] : '';
        
        // Skip escaped characters
        if (prevChar === '\\') continue;
        
        // Handle strings
        if ((char === '"' || char === "'") && !inTemplate) {
            if (!inString) {
                inString = true;
                stringChar = char;
            } else if (char === stringChar) {
                inString = false;
            }
            continue;
        }
        
        // Handle template literals
        if (char === '`' && !inString) {
            inTemplate = !inTemplate;
            continue;
        }
        
        // Skip if in string or template
        if (inString || inTemplate) continue;
        
        // Count braces, parens, brackets
        if (char === '{') braces++;
        if (char === '}') braces--;
        if (char === '(') parens++;
        if (char === ')') parens--;
        if (char === '[') brackets++;
        if (char === ']') brackets--;
    }
    
    // Check around line 820
    if (i >= 815 && i <= 825) {
        console.log(`Line ${i+1}: braces=${braces}, parens=${parens}, brackets=${brackets} | ${line.substring(0, 80)}`);
    }
}

console.log('\nFinal counts:');
console.log(`Braces: ${braces}`);
console.log(`Parens: ${parens}`);
console.log(`Brackets: ${brackets}`);
