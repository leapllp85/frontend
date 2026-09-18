"use client";

import { useState } from "react";
import { Box, Flex, VStack } from "@chakra-ui/react";
import { TopNavLayout } from "@/components/layouts/TopNavLayout";
import { OrganizationActiveProjects } from "./OrganizationActiveProjects";
import { OrganizationChartPanel } from "./OrganizationChartPanel";
import { OrganizationInfoHeader } from "./OrganizationInfoHeader";
import { OrganizationProfilePanel } from "./OrganizationProfilePanel";
import { OrganizationScopeTabs } from "./OrganizationScopeTabs";
import { OrganizationStats } from "./OrganizationStats";
import {
  organizationChartRoot,
  type OrganizationPerson,
  type OrganizationScope,
} from "./organizationInfoData";

export function OrganizationInfoPage() {
  const [activeScope, setActiveScope] = useState<OrganizationScope["value"]>("my-team");
  const [selectedEmployee, setSelectedEmployee] = useState<OrganizationPerson | null>(
    organizationChartRoot,
  );
  const isProfileOpen = Boolean(selectedEmployee);

  return (
    <TopNavLayout>
      <VStack align="stretch" gap={{ base: "24px", md: "28px" }} minW={0}>
        <OrganizationInfoHeader />

        <Flex
          align={{ base: "stretch", xl: "center" }}
          gap={{ base: "16px", xl: "20px" }}
          flexDir={{ base: "column", xl: "row" }}
        >
          <OrganizationScopeTabs activeScope={activeScope} onScopeChange={setActiveScope} />
          <OrganizationStats />
        </Flex>

        <Box position="relative" minW={0} overflowX="hidden">
          <VStack
            align="stretch"
            gap="12px"
            pr={{ base: 0, xl: isProfileOpen ? "444px" : 0 }}
            transition="padding-right 180ms ease"
            minW={0}
          >
            <OrganizationChartPanel
              selectedEmployeeId={selectedEmployee?.id ?? null}
              onEmployeeSelect={setSelectedEmployee}
            />
            <OrganizationActiveProjects />
          </VStack>

          {selectedEmployee && (
            <>
              <Box
                display={{ base: "block", xl: "none" }}
                position="fixed"
                inset={0}
                bg="rgba(11, 12, 28, 0.26)"
                zIndex={20}
                onClick={() => setSelectedEmployee(null)}
              />
              <Box
                position={{ base: "fixed", xl: "absolute" }}
                top={{ base: "84px", xl: 0 }}
                right={{ base: "16px", xl: 0 }}
                bottom={{ base: "16px", xl: 0 }}
                w={{ base: "calc(100vw - 32px)", sm: "420px", xl: "420px" }}
                maxW="420px"
                zIndex={{ base: 21, xl: 4 }}
              >
                <OrganizationProfilePanel
                  employee={selectedEmployee}
                  root={organizationChartRoot}
                  onClose={() => setSelectedEmployee(null)}
                />
              </Box>
            </>
          )}
        </Box>
      </VStack>
    </TopNavLayout>
  );
}
