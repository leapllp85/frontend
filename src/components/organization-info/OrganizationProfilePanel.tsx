"use client";

import type { ReactNode } from "react";
import { Box, Button, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  IdCard,
  MapPin,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  organizationEmployeeProfileDetails,
  organizationExternalManager,
  organizationProfileTabs,
  organizationRiskStyles,
  type OrganizationEmployeeProfileDetails,
  type OrganizationExternalManager,
  type OrganizationPerson,
} from "./organizationInfoData";
import { cardBorder, cardRadius, colors } from "@/types/styles";

type ProfilePerson = Pick<OrganizationPerson, "name" | "role" | "avatarUrl"> | OrganizationExternalManager;

type OrganizationProfilePanelProps = {
  employee: OrganizationPerson;
  root: OrganizationPerson;
  onClose: () => void;
};

function Avatar({
  name,
  src,
  size,
}: {
  name: string;
  src: string;
  size: string;
}) {
  return (
    <Box
      aria-label={name}
      w={size}
      h={size}
      borderRadius="full"
      bg={colors.primarySoft}
      bgImage={`url(${src})`}
      bgSize="cover"
      backgroundPosition="center"
      border="1px solid"
      borderColor={colors.lightBorder}
      flexShrink={0}
    />
  );
}

function findParent(
  current: OrganizationPerson,
  employeeId: string,
  parent: OrganizationPerson | null = null,
): OrganizationPerson | null {
  if (current.id === employeeId) {
    return parent;
  }

  for (const report of current.reports ?? []) {
    const match = findParent(report, employeeId, current);

    if (match) {
      return match;
    }
  }

  return null;
}

function getProfileDetails(employee: OrganizationPerson): OrganizationEmployeeProfileDetails {
  return (
    organizationEmployeeProfileDetails[employee.id] ?? {
      department: "Engineering",
      location: "New York, USA",
      employeeId: employee.id.toUpperCase(),
      experience: "2.0 years",
      level: "Level 1",
      tenure: "1.0 years",
      projects: "1",
      spanOfControl: String(employee.reports?.length ?? 0),
    }
  );
}

function ProfileRiskBadge({ riskLevel }: { riskLevel: OrganizationPerson["riskLevel"] }) {
  const riskStyle = organizationRiskStyles[riskLevel];

  return (
    <Box
      h="23px"
      px="9px"
      bg={riskStyle.bg}
      color={riskStyle.color}
      borderRadius="5px"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      fontSize="11px"
      fontWeight="800"
      lineHeight="1"
      textTransform="uppercase"
      whiteSpace="nowrap"
    >
      {riskStyle.label}
    </Box>
  );
}

function PanelSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box
      bg={colors.surface}
      border="1px solid"
      borderColor={colors.border}
      borderRadius="10px"
      p="18px"
    >
      <HStack justify="space-between" align="center" mb="16px" gap="12px">
        <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.2">
          {title}
        </Text>
        {action}
      </HStack>
      {children}
    </Box>
  );
}

function ReportsToSection({ reportsTo }: { reportsTo: ProfilePerson }) {
  return (
    <PanelSection title="Reports To">
      <HStack justify="space-between" gap="14px">
        <HStack gap="12px" minW={0}>
          <Avatar name={reportsTo.name} src={reportsTo.avatarUrl} size="42px" />
          <VStack align="flex-start" gap="4px" minW={0}>
            <Text color={colors.primaryText} fontSize="13px" fontWeight="800" lineHeight="1.15" truncate>
              {reportsTo.name}
            </Text>
            <Text color={colors.secondaryText} fontSize="11px" fontWeight="600" lineHeight="1.2" truncate>
              {reportsTo.role}
            </Text>
          </VStack>
        </HStack>

        <Box color={colors.secondaryText} flexShrink={0}>
          <ChevronRight size={18} />
        </Box>
      </HStack>
    </PanelSection>
  );
}

function KeyMetricsSection({
  directReportCount,
  details,
}: {
  directReportCount: number;
  details: OrganizationEmployeeProfileDetails;
}) {
  const metrics = [
    {
      label: "Direct Reports",
      value: String(directReportCount),
      icon: UsersRound,
      color: colors.primary,
      bg: colors.primarySoft,
    },
    {
      label: "Projects",
      value: details.projects,
      icon: UsersRound,
      color: colors.primary,
      bg: colors.primarySoft,
    },
    {
      label: "Avg. Span of Control",
      value: details.spanOfControl,
      icon: UsersRound,
      color: colors.success,
      bg: "#E8F8F0",
    },
  ];

  return (
    <PanelSection title="Key Metrics">
      <SimpleGrid columns={3} gap={0}>
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <VStack
              key={metric.label}
              align="center"
              gap="8px"
              px="8px"
              borderRight={index === metrics.length - 1 ? "0" : "1px solid"}
              borderColor={colors.lightBorder}
              minW={0}
            >
              <Box
                w="34px"
                h="34px"
                borderRadius="10px"
                bg={metric.bg}
                color={metric.color}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon size={16} strokeWidth={2.2} />
              </Box>
              <Text
                color={colors.secondaryText}
                fontSize="10px"
                fontWeight="600"
                lineHeight="1.2"
                textAlign="center"
              >
                {metric.label}
              </Text>
              <Text color={colors.primaryText} fontSize="18px" fontWeight="800" lineHeight="1">
                {metric.value}
              </Text>
            </VStack>
          );
        })}
      </SimpleGrid>
    </PanelSection>
  );
}

function AboutSection({
  employee,
  details,
}: {
  employee: OrganizationPerson;
  details: OrganizationEmployeeProfileDetails;
}) {
  const firstName = employee.name === "You" ? "You" : employee.name.split(" ")[0];
  const aboutItems = [
    { label: "Department", value: details.department, icon: BriefcaseBusiness },
    { label: "Location", value: details.location, icon: MapPin },
    { label: "Employee ID", value: details.employeeId, icon: IdCard },
    { label: "Experience", value: details.experience, icon: CalendarDays },
    { label: "Level", value: details.level, icon: ShieldCheck },
    { label: "Tenure", value: details.tenure, icon: UserRound },
  ];

  return (
    <PanelSection title={`About ${firstName}`}>
      <VStack align="stretch" gap="12px">
        {aboutItems.map((item) => {
          const Icon = item.icon;

          return (
            <HStack key={item.label} justify="space-between" gap="18px">
              <HStack gap="11px" minW={0}>
                <Box color={colors.secondaryText} flexShrink={0}>
                  <Icon size={15} strokeWidth={2} />
                </Box>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" truncate>
                  {item.label}
                </Text>
              </HStack>
              <Text
                color={colors.primaryText}
                fontSize="12px"
                fontWeight="800"
                textAlign="right"
                whiteSpace="nowrap"
              >
                {item.value}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </PanelSection>
  );
}

function DirectReportsSection({ reports }: { reports: readonly OrganizationPerson[] }) {
  return (
    <PanelSection
      title="Direct Reports"
      action={
        reports.length > 0 ? (
          <Text color={colors.primary} fontSize="11px" fontWeight="800">
            View all
          </Text>
        ) : undefined
      }
    >
      {reports.length > 0 ? (
        <HStack gap="11px" overflow="hidden">
          {reports.map((report) => (
            <Avatar key={report.id} name={report.name} src={report.avatarUrl} size="38px" />
          ))}
        </HStack>
      ) : (
        <Text color={colors.mutedText} fontSize="12px" fontWeight="600">
          No direct reports
        </Text>
      )}
    </PanelSection>
  );
}

export function OrganizationProfilePanel({ employee, root, onClose }: OrganizationProfilePanelProps) {
  const details = getProfileDetails(employee);
  const reportsTo = findParent(root, employee.id) ?? organizationExternalManager;
  const directReports = employee.reports ?? [];

  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow="0 18px 44px rgba(11, 12, 28, 0.08)"
      overflow="hidden"
      alignSelf="start"
      w="full"
      h="full"
      minH={0}
      display="flex"
      flexDir="column"
    >
      <VStack align="stretch" gap={0} h="full" minH={0}>
        <Box p="18px 18px 0" flexShrink={0}>
          <HStack align="flex-start" justify="space-between" gap="16px">
            <HStack align="center" gap="16px" minW={0}>
              <Avatar name={employee.name} src={employee.avatarUrl} size="74px" />
              <VStack align="flex-start" gap="8px" minW={0}>
                <Text color={colors.primaryText} fontSize="20px" fontWeight="800" lineHeight="1.1" truncate>
                  {employee.name}
                </Text>
                <Text color={colors.secondaryText} fontSize="12px" fontWeight="600" lineHeight="1.2" truncate>
                  {employee.role}
                </Text>
                <ProfileRiskBadge riskLevel={employee.riskLevel} />
              </VStack>
            </HStack>

            <Box
              as="button"
              aria-label="Close profile panel"
              color={colors.primaryText}
              h="28px"
              w="28px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="full"
              _hover={{ bg: colors.primarySoft }}
              onClick={onClose}
            >
              <X size={18} />
            </Box>
          </HStack>
        </Box>

        <HStack
          as="nav"
          aria-label="Organization profile sections"
          h="58px"
          px="18px"
          gap="24px"
          borderBottom="1px solid"
          borderColor={colors.lightBorder}
          overflowX="auto"
          flexShrink={0}
        >
          {organizationProfileTabs.map((tab, index) => {
            const isActive = index === 0;

            return (
              <Box
                key={tab}
                as="button"
                h="full"
                position="relative"
                color={isActive ? colors.primary : colors.primaryText}
                fontSize="12px"
                fontWeight="800"
                whiteSpace="nowrap"
                flexShrink={0}
              >
                {tab}
                {isActive && (
                  <Box
                    position="absolute"
                    left="0"
                    right="0"
                    bottom="0"
                    h="3px"
                    bg={colors.primary}
                    borderRadius="999px 999px 0 0"
                  />
                )}
              </Box>
            );
          })}
        </HStack>

        <VStack align="stretch" gap="12px" p="14px" flex="1" minH={0} overflowY="auto">
          <ReportsToSection reportsTo={reportsTo} />
          <KeyMetricsSection directReportCount={directReports.length} details={details} />
          <AboutSection employee={employee} details={details} />
          <DirectReportsSection reports={directReports} />

          <Button
            h="50px"
            mt="8px"
            bg={colors.surface}
            color={colors.primary}
            border="1.5px solid"
            borderColor={colors.primary}
            borderRadius="8px"
            fontSize="13px"
            fontWeight="800"
            flexShrink={0}
            _hover={{ bg: colors.primarySoft }}
          >
            <HStack gap="9px">
              <UserRound size={16} />
              <Text>View Full Profile</Text>
            </HStack>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}
