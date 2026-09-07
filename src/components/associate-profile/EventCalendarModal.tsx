"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Filter,
  Info,
  MapPin,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cardBorder, cardRadius, cardShadow, colors } from "@/types/styles";

type AssociateCalendarCategory = "csr" | "yoga" | "wellness";

type AssociateCalendarEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  dayLabel: string;
  time: string;
  location: string;
  category: AssociateCalendarCategory;
  spots: number;
  spotsAvailable: number;
  organizer: string;
  recommended?: boolean;
  image: string;
};

type CalendarFilter = "for-you" | "all" | AssociateCalendarCategory;

type EventCalendarModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const associateCalendarEvents: AssociateCalendarEvent[] = [
  {
    id: "e1",
    title: "Beach Cleanup Drive",
    description:
      "Join us for a community beach cleanup initiative. Help preserve our coastline and marine life for a cleaner and greener future.",
    date: "Nov 10, 2025",
    dayLabel: "Monday",
    time: "9:00 AM - 12:00 PM",
    location: "Marina Beach",
    category: "csr",
    spots: 50,
    spotsAvailable: 23,
    organizer: "CSR Committee",
    recommended: true,
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=1200&q=80",
  },
  {
    id: "e2",
    title: "Morning Yoga Session",
    description: "Start your day with energizing yoga poses and breathing exercises. Perfect for desk workers!",
    date: "Nov 5, 2025",
    dayLabel: "Wednesday",
    time: "7:00 AM - 8:00 AM",
    location: "Office Wellness Center",
    category: "yoga",
    spots: 30,
    spotsAvailable: 12,
    organizer: "Wellness Team",
    recommended: true,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&q=80",
  },
  {
    id: "e3",
    title: "Mental Wellness Workshop",
    description: "Learn practical techniques for managing stress and maintaining mental health in tech roles.",
    date: "Nov 8, 2025",
    dayLabel: "Saturday",
    time: "2:00 PM - 4:00 PM",
    location: "Conference Room A",
    category: "wellness",
    spots: 40,
    spotsAvailable: 18,
    organizer: "People Success",
    recommended: true,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80",
  },
  {
    id: "e4",
    title: "Tree Plantation Drive",
    description: "Be part of our green initiative. Plant trees and contribute to a sustainable future.",
    date: "Nov 12, 2025",
    dayLabel: "Wednesday",
    time: "8:00 AM - 11:00 AM",
    location: "City Park",
    category: "csr",
    spots: 60,
    spotsAvailable: 35,
    organizer: "CSR Committee",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
  },
  {
    id: "e5",
    title: "Power Yoga for Strength",
    description: "Build strength and flexibility with this intensive power yoga session.",
    date: "Nov 7, 2025",
    dayLabel: "Friday",
    time: "6:00 PM - 7:00 PM",
    location: "Office Wellness Center",
    category: "yoga",
    spots: 25,
    spotsAvailable: 8,
    organizer: "Wellness Team",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80",
  },
  {
    id: "e6",
    title: "Nutrition & Wellness Talk",
    description: "Expert nutritionist shares tips for healthy eating and lifestyle choices for busy professionals.",
    date: "Nov 15, 2025",
    dayLabel: "Saturday",
    time: "1:00 PM - 2:30 PM",
    location: "Virtual - Teams",
    category: "wellness",
    spots: 100,
    spotsAvailable: 67,
    organizer: "Wellness Team",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80",
  },
  {
    id: "e7",
    title: "Orphanage Visit & Donation",
    description: "Spend time with children and contribute to their education and wellbeing.",
    date: "Nov 18, 2025",
    dayLabel: "Tuesday",
    time: "10:00 AM - 3:00 PM",
    location: "Rainbow Orphanage",
    category: "csr",
    spots: 30,
    spotsAvailable: 15,
    organizer: "CSR Committee",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80",
  },
  {
    id: "e8",
    title: "Meditation & Mindfulness",
    description: "Guided meditation session to enhance focus and inner peace. Great for developers!",
    date: "Nov 9, 2025",
    dayLabel: "Sunday",
    time: "5:30 PM - 6:30 PM",
    location: "Office Wellness Center",
    category: "wellness",
    spots: 35,
    spotsAvailable: 20,
    organizer: "Wellness Team",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
  },
];

const filterItems: Array<{ label: string; value: CalendarFilter }> = [
  { label: "For You", value: "for-you" },
  { label: "All Events", value: "all" },
  { label: "CSR", value: "csr" },
  { label: "Wellness", value: "wellness" },
  { label: "Yoga", value: "yoga" },
];

const categoryCopy: Record<AssociateCalendarCategory, { label: string; color: string; bg: string }> = {
  csr: { label: "CSR Activity", color: "#16A768", bg: "#DDF8EC" },
  yoga: { label: "Yoga Class", color: "#8953D8", bg: "#F0E7FF" },
  wellness: { label: "Wellness Session", color: "#1D7FE3", bg: "#E7F0FC" },
};

export function EventCalendarModal({ isOpen, onClose }: EventCalendarModalProps) {
  const [activeFilter, setActiveFilter] = useState<CalendarFilter>("for-you");
  const [selectedEventId, setSelectedEventId] = useState("e1");
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(() => new Set());

  const recommendedEvents = useMemo(() => associateCalendarEvents.filter((event) => event.recommended), []);
  const selectedEvent = associateCalendarEvents.find((event) => event.id === selectedEventId) || associateCalendarEvents[0];
  const filteredEvents = useMemo(() => {
    if (activeFilter === "for-you") {
      return recommendedEvents;
    }

    if (activeFilter === "all") {
      return associateCalendarEvents;
    }

    return associateCalendarEvents.filter((event) => event.category === activeFilter);
  }, [activeFilter, recommendedEvents]);
  const upcomingEvents = associateCalendarEvents.slice(3, 5);
  const handleRegister = (eventId: string) => {
    setRegisteredEventIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(eventId)) {
        nextIds.delete(eventId);
      } else {
        nextIds.add(eventId);
      }
      return nextIds;
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={1200}
      bg="rgba(15, 27, 46, 0.76)"
      backdropFilter="blur(8px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "14px", lg: "22px", "2xl": "28px" }}
      py={{ base: "18px", lg: "22px", "2xl": "34px" }}
      onClick={onClose}
    >
      <Box
        bg={colors.surface}
        border="1px solid rgba(230, 234, 240, 0.88)"
        borderRadius="10px"
        boxShadow="0 28px 90px rgba(7, 15, 31, 0.34)"
        w="full"
        maxW={{ base: "100%", xl: "1200px", "2xl": "1500px" }}
        maxH="92vh"
        overflow="hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <Box px={{ base: "18px", md: "24px", xl: "20px", "2xl": "26px" }} py={{ base: "18px", md: "22px", xl: "18px", "2xl": "24px" }} maxH="92vh" overflowY="auto">
          <Flex align="flex-start" justify="space-between" gap="16px" mb={{ base: "22px", xl: "16px", "2xl": "22px" }}>
            <HStack align="flex-start" gap={{ base: "16px", xl: "13px", "2xl": "16px" }}>
              <Flex
                w={{ base: "50px", xl: "42px", "2xl": "52px" }}
                h={{ base: "50px", xl: "42px", "2xl": "52px" }}
                align="center"
                justify="center"
                borderRadius="14px"
                bg={colors.primarySoft}
                color={colors.primary}
                flexShrink={0}
              >
                <CalendarDays size={22} strokeWidth={2.2} />
              </Flex>
              <Box>
                <Text as="h2" fontSize={{ base: "20px", md: "23px", xl: "21px", "2xl": "25px" }} fontWeight="800" lineHeight="1.1">
                  Event Calendar
                </Text>
                <Text mt={{ base: "8px", xl: "6px", "2xl": "8px" }} color={colors.secondaryText} fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="600">
                  Discover activities tailored for you
                </Text>
              </Box>
            </HStack>

            <IconButton
              aria-label="Close event calendar"
              variant="ghost"
              color={colors.secondaryText}
              borderRadius="8px"
              onClick={onClose}
              _hover={{ bg: "#F6F8FC", color: colors.primaryText }}
            >
              <X size={24} />
            </IconButton>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: "14px", xl: "12px", "2xl": "14px" }} mb={{ base: "24px", xl: "16px", "2xl": "24px" }}>
            <SummaryStat icon={Star} value={recommendedEvents.length} label="Recommended for you" helper="Based on your role and interests" />
            <SummaryStat icon={CalendarDays} value={associateCalendarEvents.length} label="Upcoming Events" helper="Happening soon" />
            <SummaryStat icon={CalendarDays} value={2} label="This Week" helper="Don't miss out" tone="green" />
          </SimpleGrid>

          <Grid templateColumns={{ base: "1fr", xl: "minmax(0, 1fr) minmax(390px, 0.92fr)", "2xl": "minmax(0, 1fr) minmax(440px, 1fr)" }} gap={{ base: "18px", xl: "14px", "2xl": "18px" }} alignItems="stretch">
            <Box minW={0}>
              <Flex align={{ base: "stretch", md: "center" }} justify="space-between" gap="12px" mb={{ base: "24px", xl: "14px", "2xl": "24px" }} direction={{ base: "column", md: "row" }}>
                <HStack gap="10px" overflowX="auto" pb="2px">
                  {filterItems.map((item) => {
                    const isActive = activeFilter === item.value;

                    return (
                      <Button
                        key={item.value}
                        h={{ base: "40px", xl: "34px", "2xl": "40px" }}
                        px={{ base: "22px", xl: "16px", "2xl": "22px" }}
                        flexShrink={0}
                        borderRadius="999px"
                        bg={isActive ? "linear-gradient(135deg, #1D7FE3 0%, #246DFF 100%)" : "#F5F7FB"}
                        color={isActive ? "white" : colors.secondaryText}
                        border={isActive ? "0" : "1px solid transparent"}
                        fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }}
                        fontWeight="700"
                        boxShadow={isActive ? "0 10px 24px rgba(29, 127, 227, 0.25)" : "none"}
                        onClick={() => setActiveFilter(item.value)}
                        _hover={{ bg: isActive ? "linear-gradient(135deg, #1D7FE3 0%, #246DFF 100%)" : "#EEF3FA" }}
                      >
                        {item.label}
                        {item.value === "for-you" ? <Sparkles size={13} /> : null}
                      </Button>
                    );
                  })}
                </HStack>

                {/* <Button
                  h={{ base: "40px", xl: "34px", "2xl": "40px" }}
                  px={{ base: "18px", xl: "14px", "2xl": "18px" }}
                  borderRadius="999px"
                  bg={colors.surface}
                  border={cardBorder}
                  borderColor={colors.border}
                  color={colors.secondaryText}
                  fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }}
                  fontWeight="700"
                  _hover={{ bg: "#F8FAFD" }}
                >
                  <Filter size={15} />
                  Filters
                </Button> */}
              </Flex>

              <Box
                bg={colors.surface}
                border={cardBorder}
                borderColor={colors.lightBorder}
                borderRadius={cardRadius}
                boxShadow="0 12px 34px rgba(11, 12, 28, 0.025)"
                overflow="hidden"
              >
                <VStack align="stretch" gap="0" p={{ base: "10px", md: "14px" }}>
                  <SectionLabel label={activeFilter === "for-you" ? `Recommended for you (${recommendedEvents.length})` : "Matching events"} />
                  {filteredEvents.slice(0, activeFilter === "for-you" ? 3 : 5).map((event) => (
                    <EventListItem
                      key={event.id}
                      event={event}
                      isSelected={selectedEvent.id === event.id}
                      isRegistered={registeredEventIds.has(event.id)}
                      onSelect={() => setSelectedEventId(event.id)}
                    />
                  ))}

                  <Box pt="18px">
                    <Text fontSize="14px" fontWeight="800" color={colors.primaryText} mb="12px">
                      All upcoming events
                    </Text>
                    {upcomingEvents.map((event) => (
                      <EventListItem
                        key={event.id}
                        event={event}
                        isSelected={selectedEvent.id === event.id}
                        isRegistered={registeredEventIds.has(event.id)}
                        onSelect={() => setSelectedEventId(event.id)}
                        compact
                      />
                    ))}
                  </Box>
                </VStack>
              </Box>
            </Box>

            <EventDetailCard event={selectedEvent} isRegistered={registeredEventIds.has(selectedEvent.id)} onRegister={() => handleRegister(selectedEvent.id)} />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

function SummaryStat({
  icon: Icon,
  value,
  label,
  helper,
  tone = "blue",
}: {
  icon: LucideIcon;
  value: number;
  label: string;
  helper: string;
  tone?: "blue" | "green";
}) {
  const bg = tone === "green" ? "#DDF8EC" : colors.primarySoft;
  const iconColor = tone === "green" ? colors.success : colors.primary;

  return (
    <Flex
      align="center"
      justify="space-between"
      minH={{ base: "92px", xl: "74px", "2xl": "96px" }}
      px={{ base: "18px", md: "20px", xl: "15px", "2xl": "22px" }}
      py={{ base: "18px", xl: "13px", "2xl": "18px" }}
      border={cardBorder}
      borderColor={colors.border}
      borderRadius={cardRadius}
      boxShadow={cardShadow}
      bg={colors.surface}
    >
      <HStack gap={{ base: "18px", xl: "12px", "2xl": "18px" }}>
        <Flex w={{ base: "50px", xl: "38px", "2xl": "54px" }} h={{ base: "50px", xl: "38px", "2xl": "54px" }} borderRadius="full" bg={bg} color={iconColor} align="center" justify="center">
          <Icon size={20} strokeWidth={2.1} />
        </Flex>
        <Box>
          <Text fontSize={{ base: "23px", xl: "18px", "2xl": "23px" }} fontWeight="800" lineHeight="1" color={colors.primaryText}>
            {value}
          </Text>
          <Text mt={{ base: "6px", xl: "5px", "2xl": "6px" }} fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="700" color={colors.primaryText}>
            {label}
          </Text>
          <Text mt={{ base: "7px", xl: "5px", "2xl": "7px" }} fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" color={colors.secondaryText}>
            {helper}
          </Text>
        </Box>
      </HStack>
      {/* <ChevronRight size={20} color={colors.primaryLight} /> */}
    </Flex>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <HStack gap="8px" mb="12px">
      <Sparkles size={14} color={colors.primary} />
      <Text fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="800" color={colors.primaryText}>
        {label}
      </Text>
    </HStack>
  );
}

function EventListItem({
  event,
  isSelected,
  isRegistered,
  onSelect,
  compact = false,
}: {
  event: AssociateCalendarEvent;
  isSelected: boolean;
  isRegistered: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  const category = categoryCopy[event.category];
  const scarcityColor = event.spotsAvailable <= 10 ? colors.warning : colors.success;
  const displayedSpotsAvailable = event.spotsAvailable + (isRegistered ? 1 : 0);

  return (
    <Box
      as="button"
      width="full"
      textAlign="left"
      onClick={onSelect}
      border="1px solid"
      borderColor={isSelected ? "#D9E8FF" : "transparent"}
      borderLeftWidth={isSelected ? "4px" : "1px"}
      borderLeftColor={isSelected ? colors.primary : "transparent"}
      borderRadius="9px"
      bg={isSelected ? "#F4F8FF" : colors.surface}
      px={{ base: "10px", md: "14px" }}
      py={compact ? { base: "10px", xl: "8px", "2xl": "10px" } : { base: "13px", xl: "10px", "2xl": "13px" }}
      mb="8px"
      cursor="pointer"
      _hover={{ bg: "#F7FAFF", borderColor: "#DDE8F7" }}
    >
      <Flex align="center" gap={{ base: "12px", md: "18px" }}>
        <Image
          src={event.image}
          alt={event.title}
          w={{ base: "86px", md: "112px", xl: "92px", "2xl": "122px" }}
          h={{ base: "62px", md: compact ? "68px" : "78px", xl: compact ? "58px" : "64px", "2xl": compact ? "70px" : "82px" }}
          borderRadius="7px"
          objectFit="cover"
          flexShrink={0}
        />
        <Box minW={0} flex="1">
          <HStack gap="10px" mb="9px" minW={0}>
            <Text fontSize={{ base: "13px", md: "14px", xl: "12px", "2xl": "14px" }} fontWeight="800" color={colors.primaryText} truncate>
              {event.title}
            </Text>
            <Badge
              px="10px"
              py="3px"
              borderRadius="999px"
              bg={category.bg}
              color={category.color}
              fontSize={{ base: "11px", xl: "10px", "2xl": "11px" }}
              fontWeight="700"
              textTransform="none"
              flexShrink={0}
            >
              {category.label}
            </Badge>
          </HStack>

          <Flex gap={{ base: "8px", md: "16px" }} align="center" flexWrap="wrap" color={colors.secondaryText}>
            <MetaText icon={CalendarDays} label={event.date} />
            <Text display={{ base: "none", md: "block" }} color={colors.secondaryText}>
              •
            </Text>
            <MetaText icon={Clock} label={event.time} />
            <MetaText icon={MapPin} label={event.location} />
          </Flex>
          <HStack mt="8px" gap="6px" color={scarcityColor}>
            <Users size={14} />
            <Text fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="800">
              {displayedSpotsAvailable} / {event.spots} spots left
            </Text>
            {isRegistered ? (
              <Badge bg="#E8F8F0" color={colors.success} borderRadius="999px" px="7px" py="2px" fontSize="10px" fontWeight="800">
                +1
              </Badge>
            ) : null}
          </HStack>
        </Box>
        <ChevronRight size={22} color={colors.primary} />
      </Flex>
    </Box>
  );
}

function EventDetailCard({
  event,
  isRegistered,
  onRegister,
}: {
  event: AssociateCalendarEvent;
  isRegistered: boolean;
  onRegister: () => void;
}) {
  const category = categoryCopy[event.category];
  const displayedSpotsAvailable = event.spotsAvailable + (isRegistered ? 1 : 0);
  const progress = Math.round((displayedSpotsAvailable / event.spots) * 100);

  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor={colors.lightBorder}
      borderRadius={cardRadius}
      boxShadow="0 12px 34px rgba(11, 12, 28, 0.025)"
      overflow="hidden"
      minW={0}
    >
      <Box position="relative">
        <Image src={event.image} alt={event.title} w="full" h={{ base: "220px", md: "260px", xl: "190px", "2xl": "288px" }} objectFit="cover" />
        {event.recommended ? (
          <HStack
            position="absolute"
            top="18px"
            right="16px"
            px="16px"
            py="9px"
            borderRadius="999px"
            bg="rgba(24, 34, 52, 0.78)"
            color="white"
            gap="7px"
          >
            <Star size={13} fill={colors.warning} color={colors.warning} />
            <Text fontSize="12px" fontWeight="700">
              Recommended for you
            </Text>
          </HStack>
        ) : null}
      </Box>

      <Box p={{ base: "18px", md: "22px", xl: "18px", "2xl": "24px" }}>
        <Text as="h3" fontSize={{ base: "22px", md: "24px", xl: "20px", "2xl": "27px" }} fontWeight="800" lineHeight="1.15" color={colors.primaryText}>
          {event.title}
        </Text>
        <Badge
          mt="12px"
          px="12px"
          py="5px"
          borderRadius="999px"
          bg={category.bg}
          color={category.color}
          fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }}
          fontWeight="700"
          textTransform="none"
        >
          {category.label}
        </Badge>

        <Text mt={{ base: "18px", xl: "12px", "2xl": "18px" }} color={colors.secondaryText} fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="500" lineHeight="1.55">
          {event.description}
        </Text>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="0" mt={{ base: "24px", xl: "16px", "2xl": "24px" }} py={{ base: "18px", xl: "12px", "2xl": "18px" }} borderTop={cardBorder} borderBottom={cardBorder} borderColor={colors.lightBorder}>
          <DetailMeta icon={CalendarDays} label={`${event.date} (${event.dayLabel})`} />
          <DetailMeta icon={Clock} label={event.time} />
          <DetailMeta icon={MapPin} label={event.location} />
          <DetailMeta icon={Users} label={`Organized by ${event.organizer}`} />
        </SimpleGrid>

        <Box mt={{ base: "24px", xl: "16px", "2xl": "24px" }}>
          <Text color={colors.secondaryText} fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="600">
            Spots available
          </Text>
          <Flex justify="space-between" align="center" mt="8px" gap="14px">
            <HStack gap="8px">
              <Text color={colors.success} fontSize={{ base: "16px", xl: "13px", "2xl": "16px" }} fontWeight="800">
                {displayedSpotsAvailable} / {event.spots} spots left
              </Text>
              {isRegistered ? (
                <Badge bg="#E8F8F0" color={colors.success} borderRadius="999px" px="8px" py="3px" fontSize="10px" fontWeight="800">
                  +1
                </Badge>
              ) : null}
            </HStack>
            <Text color={colors.secondaryText} fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }} fontWeight="700">
              {progress}%
            </Text>
          </Flex>
          <Box h="10px" bg="#EAF0F7" borderRadius="999px" overflow="hidden" mt="10px">
            <Box h="full" w={`${progress}%`} bg={colors.success} borderRadius="999px" />
          </Box>
        </Box>

        <HStack align="flex-start" gap="12px" mt={{ base: "28px", xl: "18px", "2xl": "28px" }} p={{ base: "16px", xl: "12px", "2xl": "16px" }} borderRadius="8px" bg="#F2F7FF">
          <Info size={19} color={colors.primary} />
          <Box>
            <Text color={colors.primary} fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="800">
              Please Note
            </Text>
            <Text color={colors.secondaryText} fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" lineHeight="1.45" mt="4px">
              Carry your water bottle, wear comfortable clothes and let&apos;s make a positive impact together!
            </Text>
          </Box>
        </HStack>

        <Button
          mt={{ base: "24px", xl: "18px", "2xl": "24px" }}
          w="full"
          h={{ base: "46px", xl: "40px", "2xl": "46px" }}
          borderRadius="6px"
          bg={isRegistered ? "#E8F8F0" : "linear-gradient(135deg, #246DFF 0%, #1D7FE3 100%)"}
          color={isRegistered ? colors.success : "white"}
          border={isRegistered ? "1px solid" : "0"}
          borderColor={isRegistered ? "#BFEBD6" : "transparent"}
          fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }}
          fontWeight="800"
          _hover={{ bg: isRegistered ? "#DDF8EC" : "linear-gradient(135deg, #176BE0 0%, #176BE0 100%)" }}
          onClick={onRegister}
        >
          {isRegistered ? (
            <>
              <Check size={18} />
              Registered
            </>
          ) : (
            <>
              Register Now
              <ChevronRight size={18} />
            </>
          )}
        </Button>
      </Box>
    </Box>
  );
}

function MetaText({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <HStack gap="6px" minW={0}>
      <Icon size={13} color={colors.primaryLight} />
      <Text fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" color={colors.secondaryText} truncate>
        {label}
      </Text>
    </HStack>
  );
}

function DetailMeta({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <HStack
      gap="10px"
      minW={0}
      px={{ base: "0", lg: "14px" }}
      py={{ base: "8px", lg: "0" }}
      borderRight={{ base: "0", lg: cardBorder }}
      borderColor={colors.lightBorder}
      _last={{ borderRight: "0" }}
    >
      <Flex w={{ base: "32px", xl: "28px", "2xl": "32px" }} h={{ base: "32px", xl: "28px", "2xl": "32px" }} align="center" justify="center" borderRadius="9px" bg={colors.primarySoft} color={colors.primary} flexShrink={0}>
        <Icon size={18} />
      </Flex>
      <Text fontSize={{ base: "12px", xl: "10px", "2xl": "12px" }} fontWeight="600" lineHeight="1.35" color={colors.secondaryText}>
        {label}
      </Text>
    </HStack>
  );
}
