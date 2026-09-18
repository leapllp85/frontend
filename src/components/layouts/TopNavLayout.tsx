"use client";

import type { ReactNode } from "react";
import { Box } from "@chakra-ui/react";
import { TopNavbar } from "@/components/topnavbar/TopNavbar";
import { colors } from "@/types/styles";

type TopNavLayoutProps = {
  children: ReactNode;
};

export function TopNavLayout({ children }: TopNavLayoutProps) {
  return (
    <Box
      minH="100vh"
      bg={colors.background}
      color={colors.primaryText}
      fontFamily="Arial, Helvetica, sans-serif"
    >
      <TopNavbar />

      <Box
        as="main"
        px={{ base: "16px", md: "28px", xl: "46px" }}
        pt={{ base: "28px", md: "34px", xl: "36px" }}
        pb={{ base: "40px", md: "48px" }}
      >
        {children}
      </Box>
    </Box>
  );
}
