"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Box, Button, Checkbox, Flex, Grid, HStack, IconButton, Input, Text, Textarea, VStack } from "@chakra-ui/react";
import { CalendarDays, CheckCircle2, ClipboardList, Info, Plus, UserRound, X } from "lucide-react";
import { cardBorder, colors } from "@/types/styles";
import type { ActionItemApiEntry, ActionItemPriority, ActionItemStatus } from "./actionItemData";

type CreateActionPlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (actionItem: ActionItemApiEntry) => void;
};

type FormState = {
  title: string;
  details: string;
  assignee: string;
  email: string;
  priority: ActionItemPriority;
  dueDate: string;
  department: string;
  status: ActionItemStatus;
  hrAccess: boolean;
  employeeAccess: boolean;
};

const initialFormState: FormState = {
  title: "",
  details: "",
  assignee: "",
  email: "",
  priority: "Medium",
  dueDate: "",
  department: "",
  status: "Pending",
  hrAccess: false,
  employeeAccess: false,
};

const departments = ["Engineering", "People Success", "Product", "Design", "Operations", "Sales"];
const priorities: ActionItemPriority[] = ["High", "Medium", "Low"];
const statuses: ActionItemStatus[] = ["Pending", "In Progress", "Completed"];

export function CreateActionPlanModal({ isOpen, onClose, onCreate }: CreateActionPlanModalProps) {
  const [form, setForm] = useState<FormState>(initialFormState);

  const isComplete = useMemo(
    () =>
      Boolean(
        form.title.trim() &&
          form.details.trim() &&
          form.assignee.trim() &&
          form.email.trim() &&
          form.dueDate &&
          form.department,
      ),
    [form],
  );

  if (!isOpen) {
    return null;
  }

  const updateField = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const handleSubmit = () => {
    if (!isComplete) {
      return;
    }

    const dueDate = parseDate(form.dueDate);
    onCreate({
      id: `custom-action-${Date.now()}`,
      dateLabel: formatDateLabel(dueDate),
      dayLabel: formatDayLabel(dueDate),
      title: form.title.trim(),
      description: form.details.trim(),
      owner: form.assignee.trim(),
      source: "Other",
      priority: form.priority,
      status: form.status,
      dueLabel: buildDueLabel(dueDate),
      dueSort: form.dueDate,
    });
    setForm(initialFormState);
  };

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={1500}
      bg="rgba(20, 35, 58, 0.58)"
      backdropFilter="blur(7px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "14px", md: "24px" }}
      py={{ base: "18px", md: "28px" }}
      onClick={onClose}
    >
      <Box
        bg={colors.surface}
        border="1px solid"
        borderColor={colors.border}
        borderRadius="12px"
        boxShadow="0 30px 90px rgba(7, 15, 31, 0.3)"
        w="full"
        maxW="1180px"
        maxH="90vh"
        overflow="hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <Flex align="center" justify="space-between" gap="18px" px={{ base: "20px", md: "26px" }} py="20px" borderBottom={cardBorder} borderColor={colors.lightBorder}>
          <HStack gap="14px" minW={0}>
            <Flex w="46px" h="46px" borderRadius="12px" bg={colors.primarySoft} color={colors.primary} align="center" justify="center" flexShrink={0}>
              <ClipboardList size={22} />
            </Flex>
            <Box minW={0}>
              <Text color={colors.primaryText} fontSize={{ base: "18px", md: "20px" }} fontWeight="800" lineHeight="1.1">
                Create Plan of Action
              </Text>
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" mt="6px">
                Define actionable steps and assign responsibilities
              </Text>
            </Box>
          </HStack>
          <IconButton aria-label="Close create action plan" variant="ghost" color={colors.secondaryText} borderRadius="8px" _hover={{ bg: "#F8FAFD" }} onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Flex>

        <Box maxH="calc(90vh - 154px)" overflowY="auto" px={{ base: "20px", md: "26px" }} py="22px">
          <VStack align="stretch" gap="18px">
            <Field label="Action Title *">
              <Input value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="e.g., Improve Team Communication Process" {...inputProps} />
            </Field>

            <Field label="Action Details *">
              <Textarea
                value={form.details}
                onChange={(event) => updateField("details", event.target.value)}
                placeholder="Describe the specific steps, timeline, and expected outcomes..."
                minH="96px"
                resize="vertical"
                {...inputProps}
              />
            </Field>

            <Box border={cardBorder} borderColor={colors.border} borderRadius="10px" bg="#FBFCFE" p={{ base: "16px", md: "18px" }}>
              <HStack gap="8px" mb="16px">
                <UserRound size={16} color={colors.secondaryText} />
                <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                  Assignment Details
                </Text>
              </HStack>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap="16px">
                <Field label="Assign To *">
                  <Input value={form.assignee} onChange={(event) => updateField("assignee", event.target.value)} placeholder="Enter team member name" {...inputProps} />
                </Field>
                <Field label="Email Address *">
                  <Input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="assignee@company.com" {...inputProps} />
                </Field>
                <Field label="Priority Level">
                  <SelectField value={form.priority} onChange={(value) => updateField("priority", value as ActionItemPriority)} options={priorities} />
                </Field>
                <Field label="Due Date *">
                  <Input type="date" value={form.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} {...inputProps} />
                </Field>
                <Field label="Department *">
                  <SelectField placeholder="Select Department" value={form.department} onChange={(value) => updateField("department", value)} options={departments} />
                </Field>
                <Field label="Initial Status">
                  <SelectField value={form.status} onChange={(value) => updateField("status", value as ActionItemStatus)} options={statuses} />
                </Field>
              </Grid>
            </Box>

            <Box border={cardBorder} borderColor="#CFE1FA" borderRadius="10px" bg="#F2F7FF" p={{ base: "16px", md: "18px" }}>
              <HStack gap="8px" mb="14px">
                <CheckCircle2 size={16} color={colors.primary} />
                <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                  Access Permissions
                </Text>
              </HStack>
              <HStack gap={{ base: "14px", md: "34px" }} align="flex-start" flexWrap="wrap">
                <PermissionCheckbox
                  checked={form.hrAccess}
                  title="HR Team Access"
                  helper="Allow HR team to view this action plan"
                  onChange={(checked) => updateField("hrAccess", checked)}
                />
                <PermissionCheckbox
                  checked={form.employeeAccess}
                  title="Employee Access"
                  helper="Allow employee to view this action plan"
                  onChange={(checked) => updateField("employeeAccess", checked)}
                />
              </HStack>
              <HStack mt="16px" gap="8px" bg="#DDEBFF" borderRadius="7px" px="12px" py="10px" color="#315077">
                <Info size={15} />
                <Text fontSize="12px" fontWeight="600">
                  Managers always have full access to all action plans. These settings control additional visibility.
                </Text>
              </HStack>
            </Box>
          </VStack>
        </Box>

        <Flex justify="flex-end" gap="12px" px={{ base: "20px", md: "26px" }} py="18px" borderTop={cardBorder} borderColor={colors.lightBorder}>
          <Button h="40px" px="18px" bg={colors.surface} color={colors.secondaryText} border={cardBorder} borderRadius="6px" fontSize="13px" fontWeight="800" _hover={{ bg: "#F8FAFD" }} onClick={onClose}>
            Cancel
          </Button>
          <Button h="40px" px="20px" bg={colors.primary} color={colors.surface} borderRadius="6px" fontSize="13px" fontWeight="800" disabled={!isComplete} _hover={{ bg: "#1668BA" }} _disabled={{ opacity: 0.45, cursor: "not-allowed" }} onClick={handleSubmit}>
            <Plus size={16} />
            Create Action Plan
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Text color={colors.primaryText} fontSize="12px" fontWeight="800" mb="8px">
        {label}
      </Text>
      {children}
    </Box>
  );
}

const inputProps = {
  h: "38px",
  bg: colors.surface,
  border: "1px solid",
  borderColor: colors.border,
  borderRadius: "6px",
  color: colors.primaryText,
  fontSize: "13px",
  fontWeight: "600",
  _placeholder: { color: colors.mutedText },
  _focus: { borderColor: colors.primaryLight, boxShadow: "0 0 0 3px rgba(29, 127, 227, 0.08)" },
};

function SelectField({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Box
      as="select"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
      h="38px"
      w="full"
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="6px"
      color={value ? colors.primaryText : colors.mutedText}
      fontSize="13px"
      fontWeight="600"
      px="12px"
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Box>
  );
}

function PermissionCheckbox({
  checked,
  title,
  helper,
  onChange,
}: {
  checked: boolean;
  title: string;
  helper: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Checkbox.Root checked={checked} onCheckedChange={(details) => onChange(Boolean(details.checked))}>
      <Checkbox.HiddenInput />
      <Checkbox.Control borderColor={colors.border} />
      <Checkbox.Label>
        <Box>
          <Text color={colors.primaryText} fontSize="12px" fontWeight="800">
            {title}
          </Text>
          <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" mt="3px">
            {helper}
          </Text>
        </Box>
      </Checkbox.Label>
    </Checkbox.Root>
  );
}

function parseDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit" }).format(date).toUpperCase();
}

function formatDayLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
}

function buildDueLabel(date: Date) {
  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((due.getTime() - current.getTime()) / 86400000);

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return `${overdueDays} ${overdueDays === 1 ? "day" : "days"} overdue`;
  }
  if (diffDays === 0) {
    return "Due today";
  }
  return `Due in ${diffDays} ${diffDays === 1 ? "day" : "days"}`;
}
