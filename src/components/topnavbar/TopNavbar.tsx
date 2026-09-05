"use client";

import { useMemo, useState } from "react";
import { Box, Button, Flex, HStack, IconButton, Input, Text } from "@chakra-ui/react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, LogOut, Search } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { logout as logoutFromApi } from "@/lib/apis/auth";
import { LogoMark } from "../manager-overview/shared";
import { colors } from "../../types/styles";
import { NotificationBell, type NavbarNotification } from "./NotificationBell";

const navItems = [
  { label: "Overview", href: "/manager-overview" },
  { label: "Team", href: "/teams-info" },
  { label: "Projects", href: "/projects-info" },
  { label: "Talent", href: "/talent-management" },
  { label: "Organization", href: "/organization-info" },
  { label: "Analytics", href: "/talent-analytics" },
  { label: "Survey", href: "/action-survey" },
  { label: "Survey", href: "/survey-info" },
  { label: "Action Items", href: "/action-item" },
] as const;

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type ManagerNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
};

const mockNotifications: readonly ManagerNotification[] = [
  {
    id: "risk-spike",
    title: "Attrition risk increased",
    message: "Alice Brown moved into the high-risk segment.",
    time: "5 min ago",
    isUnread: true,
  },
  {
    id: "deadline-alert",
    title: "Deadline approaching",
    message: "E-Commerce Platform Redesign is due in 8 days.",
    time: "22 min ago",
    isUnread: true,
  },
  {
    id: "survey-update",
    title: "New survey response",
    message: "A team member submitted the weekly pulse survey.",
    time: "1 hr ago",
    isUnread: true,
  },
  {
    id: "report-ready",
    title: "Report generated",
    message: "Your weekly team health summary is ready.",
    time: "Yesterday",
    isUnread: false,
  },
  {
    id: "deadline-alert",
    title: "Deadline approaching",
    message: "E-Commerce Platform Redesign is due in 8 days.",
    time: "22 min ago",
    isUnread: true,
  },
  {
    id: "survey-update",
    title: "New survey response",
    message: "A team member submitted the weekly pulse survey.",
    time: "1 hr ago",
    isUnread: true,
  },
  {
    id: "report-ready",
    title: "Report generated",
    message: "Your weekly team health summary is ready.",
    time: "Yesterday",
    isUnread: false,
  },
];

const navbarNotifications: readonly NavbarNotification[] = mockNotifications.map((notification, index) => ({
  id: `${notification.id}-${index}`,
  title: notification.title,
  message: notification.message,
  time: notification.time,
  isUnread: notification.isUnread,
}));

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function parseDateValue(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isSameDate(firstDate: Date, secondDate: Date) {
  return toDateInputValue(firstDate) === toDateInputValue(secondDate);
}

function isAfterDate(firstDate: Date, secondDate: Date) {
  return startOfDay(firstDate).getTime() > startOfDay(secondDate).getTime();
}

function formatDisplayDate(dateValue: string) {
  const date = parseDateValue(dateValue);

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Array<Date | null> = Array.from({ length: firstDay.getDay() }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, month, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

export function TopNavbar() {
  const pathname = usePathname();
  const { logout: clearAuthContext } = useAuth();
  const today = useMemo(() => startOfDay(new Date()), []);
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(today));
  const selectedDateObject = useMemo(() => parseDateValue(selectedDate), [selectedDate]);
  const [calendarMonth, setCalendarMonth] = useState(() => startOfMonth(today));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const displayDate = useMemo(() => formatDisplayDate(selectedDate), [selectedDate]);
  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);
  const unreadNotificationCount = useMemo(
    () => navbarNotifications.filter((notification) => notification.isUnread).length,
    [],
  );
  const canGoNextMonth = addMonths(calendarMonth, 1).getTime() <= startOfMonth(today).getTime();
  const isActivePath = (href: string) =>
    pathname === href || (href !== "/manager-overview" && pathname.startsWith(`${href}/`));
  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    clearAuthContext();
    await logoutFromApi();
  };

  return (
    <Box
      as="header"
      bg={colors.surface}
      borderBottom="1px solid"
      borderColor={colors.border}
      boxShadow="0 1px 8px rgba(11, 12, 28, 0.04)"
    >
      <Flex
        minH={{ base: "68px", xl: "68px" }}
        px={{ base: "16px", md: "24px" }}
        py={{ base: "10px", lg: 0 }}
        align="center"
        justify="space-between"
        gap={{ base: 4, xl: 8 }}
        flexWrap={{ base: "wrap", xl: "nowrap" }}
      >
        <HStack gap={{ base: 3, md: 4 }} flexShrink={0}>
          <LogoMark />
          <Text
            color={colors.primaryText}
            fontSize={{ base: "17px", md: "18px" }}
            fontWeight="800"
            letterSpacing="0"
            whiteSpace="nowrap"
          >
            CLYRA
          </Text>
        </HStack>

        <HStack
          as="nav"
          aria-label="Manager overview sections"
          gap={{ base: 4, lg: 8, xl: 10 }}
          display={{ base: "none", md: "flex" }}
          flex="1"
          justify={{ md: "center", xl: "flex-start" }}
          minW={0}
        >
          {navItems.map((item) => {
            const isActive = isActivePath(item.href);

            return (
              <NextLink
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{ textDecoration: "none" }}
              >
                <Box
                  position="relative"
                  h="68px"
                  display="flex"
                  alignItems="center"
                  cursor="pointer"
                >
                  <Text
                    color={isActive ? colors.primaryText : colors.primaryText}
                    fontSize="14px"
                    fontWeight={isActive ? "800" : "700"}
                    lineHeight="1"
                    whiteSpace="nowrap"
                  >
                    {item.label}
                  </Text>
                  {isActive && (
                    <Box
                      position="absolute"
                      left="0"
                      right="0"
                      bottom="4px"
                      h="3px"
                      bg={colors.primary}
                      borderRadius="999px"
                    />
                  )}
                </Box>
              </NextLink>
            );
          })}
        </HStack>

        <HStack
          as="nav"
          aria-label="Manager overview sections mobile"
          display={{ base: "flex", md: "none" }}
          order={{ base: 3, xl: 0 }}
          w="full"
          overflowX="auto"
          gap={6}
          pt={1}
          pb={0.5}
        >
          {navItems.map((item) => {
            const isActive = isActivePath(item.href);

            return (
              <NextLink
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{ textDecoration: "none", flexShrink: 0 }}
              >
                <Box
                  position="relative"
                  pb={2}
                  flexShrink={0}
                  cursor="pointer"
                >
                  <Text
                    color={colors.primaryText}
                    fontSize="13px"
                    fontWeight={isActive ? "800" : "700"}
                  >
                    {item.label}
                  </Text>
                  {isActive && (
                    <Box
                      position="absolute"
                      left="0"
                      right="0"
                      bottom="0"
                      h="3px"
                      bg={colors.primary}
                      borderRadius="999px"
                    />
                  )}
                </Box>
              </NextLink>
            );
          })}
        </HStack>

        <HStack
          gap={{ base: 2.5, md: 3, xl: 4 }}
          flex={{ base: "1 1 100%", xl: "0 0 auto" }}
          justify={{ base: "flex-end", xl: "flex-start" }}
          minW={0}
        >
          <Box
            position="relative"
            w={{ base: "100%", sm: "288px", lg: "320px" }}
            maxW={{ base: "100%", xl: "320px" }}
            display={{ base: "none", sm: "block" }}
          >
            <Box
              position="absolute"
              left="14px"
              top="50%"
              transform="translateY(-50%)"
              color={colors.secondaryText}
              zIndex={1}
              pointerEvents="none"
            >
              <Search size={17} strokeWidth={2} />
            </Box>
            <Input
              aria-label="Search"
              placeholder="Search anything..."
              h="44px"
              pl="44px"
              pr="16px"
              bg="#F8FAFD"
              border="1px solid"
              borderColor={colors.lightBorder}
              borderRadius="6px"
              color={colors.secondaryText}
              fontSize="13px"
              _placeholder={{ color: colors.mutedText }}
              _focus={{
                borderColor: colors.primaryLight,
                boxShadow: "0 0 0 1px #6EA0E6",
              }}
            />
          </Box>

          <Box position="relative" flexShrink={0}>
            <Button
              h="44px"
              px={{ base: 3, md: 4 }}
              bg={colors.surface}
              border="1px solid"
              borderColor={isCalendarOpen ? colors.primaryLight : colors.border}
              borderRadius="6px"
              color={colors.primaryText}
              fontSize="13px"
              fontWeight="700"
              _hover={{ bg: "#F8FAFD" }}
              onClick={() => {
                if (!isCalendarOpen) {
                  setCalendarMonth(startOfMonth(selectedDateObject));
                }

                setIsNotificationsOpen(false);
                setIsUserMenuOpen(false);
                setIsCalendarOpen((isOpen) => !isOpen);
              }}
              aria-expanded={isCalendarOpen}
              aria-haspopup="dialog"
            >
              <HStack gap={2}>
                <CalendarDays size={16} color={colors.secondaryText} />
                <Text display={{ base: "none", md: "block" }} whiteSpace="nowrap">
                  {displayDate}
                </Text>
                <ChevronDown size={15} color={colors.secondaryText} />
              </HStack>
            </Button>

            {isCalendarOpen && (
              <Box
                position="absolute"
                right="0"
                top="calc(100% + 8px)"
                zIndex={20}
                w="296px"
                p="16px"
                bg={colors.surface}
                border="1px solid"
                borderColor={colors.border}
                borderRadius="8px"
                boxShadow="0 12px 30px rgba(11, 12, 28, 0.12)"
              >
                <HStack justify="space-between" mb="14px">
                  <IconButton
                    aria-label="Previous month"
                    h="32px"
                    w="32px"
                    minW="32px"
                    bg="#F8FAFD"
                    border="1px solid"
                    borderColor={colors.lightBorder}
                    color={colors.secondaryText}
                    _hover={{ bg: colors.primarySoft }}
                    onClick={() => setCalendarMonth((month) => addMonths(month, -1))}
                  >
                    <ChevronLeft size={16} />
                  </IconButton>

                  <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                    {formatMonthLabel(calendarMonth)}
                  </Text>

                  <IconButton
                    aria-label="Next month"
                    h="32px"
                    w="32px"
                    minW="32px"
                    bg="#F8FAFD"
                    border="1px solid"
                    borderColor={colors.lightBorder}
                    color={colors.secondaryText}
                    disabled={!canGoNextMonth}
                    _hover={{ bg: canGoNextMonth ? colors.primarySoft : "#F8FAFD" }}
                    _disabled={{
                      opacity: 0.35,
                      cursor: "not-allowed",
                    }}
                    onClick={() => {
                      if (canGoNextMonth) {
                        setCalendarMonth((month) => addMonths(month, 1));
                      }
                    }}
                  >
                    <ChevronRight size={16} />
                  </IconButton>
                </HStack>

                <Box
                  display="grid"
                  gridTemplateColumns="repeat(7, minmax(0, 1fr))"
                  gap="6px"
                >
                  {weekDays.map((day) => (
                    <Text
                      key={day}
                      color={colors.mutedText}
                      fontSize="11px"
                      fontWeight="800"
                      textAlign="center"
                    >
                      {day}
                    </Text>
                  ))}

                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return <Box key={`empty-${index}`} h="34px" />;
                    }

                    const isSelected = isSameDate(date, selectedDateObject);
                    const isToday = isSameDate(date, today);
                    const isFutureDate = isAfterDate(date, today);

                    return (
                      <Button
                        key={toDateInputValue(date)}
                        h="34px"
                        minW="0"
                        px="0"
                        borderRadius="8px"
                        bg={isSelected ? colors.primary : colors.surface}
                        border="1px solid"
                        borderColor={
                          isSelected
                            ? colors.primary
                            : isToday
                              ? colors.primaryLight
                              : colors.lightBorder
                        }
                        color={
                          isSelected
                            ? colors.surface
                            : isFutureDate
                              ? colors.mutedText
                              : colors.primaryText
                        }
                        fontSize="13px"
                        fontWeight={isSelected || isToday ? "800" : "700"}
                        disabled={isFutureDate}
                        _hover={{
                          bg: isFutureDate
                            ? colors.surface
                            : isSelected
                              ? colors.primary
                              : colors.primarySoft,
                        }}
                        _disabled={{
                          opacity: 0.35,
                          cursor: "not-allowed",
                        }}
                        onClick={() => {
                          if (!isFutureDate) {
                            setSelectedDate(toDateInputValue(date));
                            setIsCalendarOpen(false);
                          }
                        }}
                      >
                        {date.getDate()}
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Box>

          <NotificationBell
            notifications={navbarNotifications}
            isOpen={isNotificationsOpen}
            onOpenChange={(isOpen) => {
              setIsCalendarOpen(false);
              setIsUserMenuOpen(false);
              setIsNotificationsOpen(isOpen);
            }}
            summaryLabel={`${unreadNotificationCount} unread updates`}
          />

          <Box position="relative" flexShrink={0}>
            <Button
              h="44px"
              px="0"
              bg={isUserMenuOpen ? colors.primarySoft : "transparent"}
              borderRadius="999px"
              _hover={{ bg: colors.primarySoft }}
              onClick={() => {
                setIsCalendarOpen(false);
                setIsNotificationsOpen(false);
                setIsUserMenuOpen((isOpen) => !isOpen);
              }}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
            >
              <HStack gap={2.5} flexShrink={0}>
                <Box
                  w="44px"
                  h="44px"
                  borderRadius="full"
                  bg="linear-gradient(135deg, #D7E9F8 0%, #F2D6BE 100%)"
                  border="1px solid"
                  borderColor={colors.lightBorder}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  overflow="hidden"
                >
                  <Text color={colors.primaryText} fontSize="14px" fontWeight="800">
                    MU
                  </Text>
                </Box>
                <HStack gap={1.5} display={{ base: "none", md: "flex" }} pr="2px">
                  <Text
                    color={colors.primaryText}
                    fontSize="13px"
                    fontWeight="800"
                    whiteSpace="nowrap"
                  >
                    Manager User
                  </Text>
                  <ChevronDown size={15} color={colors.secondaryText} />
                </HStack>
              </HStack>
            </Button>

            {isUserMenuOpen && (
              <Box
                position="absolute"
                right="0"
                top="calc(100% + 8px)"
                zIndex={30}
                w="188px"
                bg={colors.surface}
                border="1px solid"
                borderColor={colors.border}
                borderRadius="10px"
                boxShadow="0 14px 34px rgba(11, 12, 28, 0.14)"
                overflow="hidden"
              >
                <Box px="14px" py="12px" borderBottom="1px solid" borderColor={colors.lightBorder}>
                  <Text color={colors.primaryText} fontSize="13px" fontWeight="800">
                    Manager User
                  </Text>
                  <Text color={colors.mutedText} fontSize="12px" fontWeight="600" mt="2px">
                    Manager
                  </Text>
                </Box>

                <Button
                  w="full"
                  h="42px"
                  px="14px"
                  justifyContent="flex-start"
                  bg={colors.surface}
                  color={colors.danger}
                  borderRadius="0"
                  fontSize="13px"
                  fontWeight="800"
                  _hover={{ bg: "#FDEDEA" }}
                  onClick={handleLogout}
                >
                  <HStack gap="10px">
                    <LogOut size={16} />
                    <Text>Logout</Text>
                  </HStack>
                </Button>
              </Box>
            )}
          </Box>
        </HStack>
      </Flex>
    </Box>
  );
}
