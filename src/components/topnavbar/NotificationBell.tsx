"use client";

import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { Bell } from "lucide-react";
import { colors } from "@/types/styles";

export type NavbarNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  isUnread?: boolean;
};

type NotificationBellProps = {
  notifications: readonly NavbarNotification[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  summaryLabel?: string;
  emptyLabel?: string;
  size?: "sm" | "md";
};

export function NotificationBell({
  notifications,
  isOpen,
  onOpenChange,
  title = "Notifications",
  summaryLabel,
  emptyLabel = "No updates available.",
  size = "md",
}: NotificationBellProps) {
  const unreadCount = notifications.filter((notification) => notification.isUnread !== false).length;
  const buttonSize = size === "sm" ? "40px" : "44px";
  const badgeOffset = size === "sm" ? "1px" : "4px";
  const panelTop = size === "sm" ? "calc(100% + 10px)" : "calc(100% + 8px)";
  const panelWidth = size === "sm" ? "360px" : "352px";
  const summary = summaryLabel || `${unreadCount} unread updates`;

  return (
    <Box position="relative" flexShrink={0}>
      <IconButton
        aria-label={title}
        h={buttonSize}
        w={buttonSize}
        minW={buttonSize}
        bg={isOpen ? colors.primarySoft : "transparent"}
        color={colors.primaryText}
        borderRadius="full"
        _hover={{ bg: colors.primarySoft }}
        onClick={() => onOpenChange(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell size={20} />
      </IconButton>

      {unreadCount > 0 && (
        <Box
          position="absolute"
          top={badgeOffset}
          right={badgeOffset}
          minW="17px"
          h="17px"
          px="3px"
          borderRadius="999px"
          bg={colors.primary}
          color={colors.surface}
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="10px"
          fontWeight="800"
          lineHeight="1"
          border="2px solid"
          borderColor={colors.surface}
        >
          {unreadCount}
        </Box>
      )}

      {isOpen && (
        <Box
          position="absolute"
          right="0"
          top={panelTop}
          zIndex={30}
          w={{ base: "calc(100vw - 32px)", sm: panelWidth }}
          maxW={panelWidth}
          bg={colors.surface}
          border="1px solid"
          borderColor={colors.border}
          borderRadius="10px"
          boxShadow="0 14px 34px rgba(11, 12, 28, 0.14)"
          overflow="hidden"
        >
          <HStack
            justify="space-between"
            px="16px"
            py="14px"
            borderBottom="1px solid"
            borderColor={colors.lightBorder}
          >
            <Box>
              <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                {title}
              </Text>
              <Text color={colors.mutedText} fontSize="12px" fontWeight="600" mt="2px">
                {summary}
              </Text>
            </Box>
            {unreadCount > 0 && (
              <Box
                px="8px"
                h="24px"
                borderRadius="999px"
                bg={colors.primarySoft}
                color={colors.primary}
                display="flex"
                alignItems="center"
                fontSize="12px"
                fontWeight="800"
              >
                New
              </Box>
            )}
          </HStack>

          {notifications.length === 0 ? (
            <Box px="16px" py="20px">
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="700">
                {emptyLabel}
              </Text>
            </Box>
          ) : (
            <VStack align="stretch" gap={0} maxH="332px" overflowY="auto">
              {notifications.map((notification) => {
                const isUnread = notification.isUnread !== false;

                return (
                  <Box
                    key={notification.id}
                    px="16px"
                    py="13px"
                    bg={isUnread ? "#F4F8FE" : colors.surface}
                    borderBottom="1px solid"
                    borderColor={colors.lightBorder}
                    _last={{ borderBottom: "0" }}
                  >
                    <HStack align="flex-start" gap="10px">
                      <Box
                        mt="5px"
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={isUnread ? colors.primary : "transparent"}
                        border={isUnread ? "0" : "1px solid"}
                        borderColor={colors.lightBorder}
                        flexShrink={0}
                      />
                      <Box minW={0} flex="1">
                        <HStack justify="space-between" align="flex-start" gap="10px">
                          <Text
                            color={colors.primaryText}
                            fontSize="13px"
                            fontWeight={isUnread ? "800" : "700"}
                            lineHeight="1.25"
                          >
                            {notification.title}
                          </Text>
                          <Text
                            color={colors.mutedText}
                            fontSize="11px"
                            fontWeight="700"
                            lineHeight="1.2"
                            whiteSpace="nowrap"
                          >
                            {notification.time}
                          </Text>
                        </HStack>
                        <Text
                          color={colors.secondaryText}
                          fontSize="12px"
                          fontWeight="600"
                          lineHeight="1.35"
                          mt="5px"
                        >
                          {notification.message}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
}
