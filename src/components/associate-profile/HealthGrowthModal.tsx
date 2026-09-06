"use client";

import type { ReactNode } from "react";
import { Box, Flex, Grid, HStack, IconButton, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  CirclePlay,
  Droplet,
  Dumbbell,
  Eye,
  Heart,
  Moon,
  Sparkles,
  Utensils,
  Users,
  Waves,
  X,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cardBorder, colors } from "@/types/styles";

type HealthGrowthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type Tone = "primary" | "success" | "warning" | "purple" | "orange";

type ActionTile = {
  title: string;
  detail: string;
  icon: LucideIcon;
  tone: Tone;
};

type ScheduleItem = {
  time: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  tone: Tone;
  bg: string;
};

type ResourceItem = {
  title: string;
  detail: string;
  image: string;
};

const actionTiles: ActionTile[] = [
  { title: "5-Min Meditation", detail: "Start now", icon: Users, tone: "primary" },
  { title: "Desk Stretches", detail: "3 exercises", icon: Dumbbell, tone: "success" },
  { title: "Sleep Tracker", detail: "7.5h avg", icon: Moon, tone: "purple" },
  { title: "Water Reminder", detail: "6/8 glasses", icon: Droplet, tone: "primary" },
];

const scheduleItems: ScheduleItem[] = [
  { time: "9:00 AM", title: "Morning Stretch", detail: "5 min desk exercises", icon: Dumbbell, tone: "success", bg: "#EAF9F3" },
  { time: "11:00 AM", title: "Hydration Break", detail: "Drink water", icon: Droplet, tone: "primary", bg: "#EBF4FF" },
  { time: "1:00 PM", title: "Lunch & Walk", detail: "15 min outdoor", icon: Utensils, tone: "purple", bg: "#F5F0FF" },
  { time: "3:00 PM", title: "Eye Rest", detail: "20-20-20 rule", icon: Eye, tone: "orange", bg: "#FFF2E8" },
  { time: "5:00 PM", title: "Mindful Moment", detail: "5 min breathing exercise", icon: Moon, tone: "primary", bg: "#EAF5FF" },
];

const wellnessTips: ActionTile[] = [
  { title: "Practice Mindfulness", detail: "5 min daily meditation", icon: Users, tone: "primary" },
  { title: "Desk Yoga", detail: "Stretch at your desk", icon: Dumbbell, tone: "success" },
  { title: "Eye Rest", detail: "20-20-20 rule", icon: Sparkles, tone: "purple" },
  { title: "Quick Walk", detail: "15-min walk boosts mood", icon: Dumbbell, tone: "orange" },
];

const stressResources: ResourceItem[] = [
  {
    title: "Deep Breathing",
    detail: "4-7-8 technique",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
  },
  {
    title: "Muscle Relaxation",
    detail: "Progressive technique",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
  },
  {
    title: "Nature Therapy",
    detail: "20 min outdoors",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
  },
  {
    title: "Music Therapy",
    detail: "Calming sounds",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
  },
];

const toneStyles: Record<Tone, { bg: string; color: string; border?: string }> = {
  primary: { bg: colors.primarySoft, color: colors.primary },
  success: { bg: "#E8F8F0", color: colors.success },
  warning: { bg: "#FFF3DE", color: colors.warning },
  purple: { bg: "#F0EAFF", color: "#7658D5" },
  orange: { bg: "#FFF0E5", color: "#D86B2B" },
};

export function HealthGrowthModal({ isOpen, onClose }: HealthGrowthModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={1300}
      bg="rgba(20, 35, 58, 0.58)"
      backdropFilter="blur(7px)"
      display="flex"
      alignItems={{ base: "flex-start", xl: "center" }}
      justifyContent="center"
      px={{ base: "14px", md: "34px", xl: "58px" }}
      py={{ base: "18px", md: "36px", xl: "58px" }}
      overflowY="auto"
      onClick={onClose}
    >
      <Box
        w="full"
        maxW="1774px"
        maxH={{ base: "none", xl: "88vh" }}
        bg="rgba(255, 255, 255, 0.98)"
        border="1px solid rgba(222, 229, 240, 0.94)"
        borderRadius="8px"
        boxShadow="0 34px 86px rgba(14, 25, 44, 0.34)"
        overflow="hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <Box maxH={{ base: "none", xl: "88vh" }} overflowY="auto">
          <Flex
            px={{ base: "22px", lg: "32px" }}
            py={{ base: "22px", lg: "25px" }}
            align="center"
            justify="space-between"
            borderBottom="1px solid"
            borderColor="#DDE5F1"
            gap="18px"
          >
            <HStack gap="24px" minW={0}>
              <IconBadge icon={Waves} tone="primary" size="60px" iconSize={30} radius="13px" />
              <Box minW={0}>
                <Text as="h2" color="#071E54" fontSize={{ base: "22px", md: "25px" }} fontWeight="800" lineHeight="1.05">
                  Wellness Management
                </Text>
                <Text color="#6B81A9" fontSize={{ base: "13px", md: "16px" }} fontWeight="500" mt="10px">
                  Your mental health and wellness resources
                </Text>
              </Box>
            </HStack>

            <IconButton
              aria-label="Close health and growth"
              variant="ghost"
              h="40px"
              w="40px"
              minW="40px"
              borderRadius="6px"
              color="#355785"
              _hover={{ bg: "#F3F7FD" }}
              onClick={onClose}
            >
              <X size={24} strokeWidth={1.9} />
            </IconButton>
          </Flex>

          <Box px={{ base: "22px", lg: "30px" }} pt="22px" pb={{ base: "22px", lg: "24px" }}>
            <HStack
              as="nav"
              aria-label="Health and growth tabs"
              h="42px"
              gap={{ base: "24px", md: "56px" }}
              borderBottom="1px solid"
              borderColor="#DDE5F1"
            >
              <TabButton icon={Users} label="Skill Analysis & Growth" />
              <TabButton icon={Waves} label="Wellness Management" active />
            </HStack>

            <Grid templateColumns={{ base: "1fr", xl: "minmax(0, 1.5fr) minmax(390px, 0.98fr)" }} gap="28px" mt="18px">
              <VStack align="stretch" gap="18px" minW={0}>
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="14px">
                  {actionTiles.map((item) => (
                    <ActionCard key={item.title} item={item} />
                  ))}
                </SimpleGrid>

                <ScheduleCard />
                <WellnessTipsCard />
              </VStack>

              <VStack align="stretch" gap="18px" minW={0}>
                <StressReliefCard />
                <SupportCard />
                <ExpertBanner />
              </VStack>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function TabButton({ icon: Icon, label, active }: { icon: LucideIcon; label: string; active?: boolean }) {
  return (
    <HStack
      as="button"
      h="42px"
      gap="12px"
      color={active ? "#165DFB" : "#49658D"}
      fontSize={{ base: "13px", md: "16px" }}
      fontWeight={active ? "800" : "700"}
      lineHeight="1"
      borderBottom="2px solid"
      borderColor={active ? "#165DFB" : "transparent"}
      px="4px"
      whiteSpace="nowrap"
      _hover={{ color: "#165DFB" }}
    >
      <Icon size={21} strokeWidth={active ? 2.2 : 2} />
      <Text as="span">{label}</Text>
    </HStack>
  );
}

function ActionCard({ item }: { item: ActionTile }) {
  const Icon = item.icon;

  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor="#DCE6F4"
      borderRadius="8px"
      minH="146px"
      px="20px"
      py="19px"
      boxShadow="0 8px 22px rgba(29, 66, 117, 0.035)"
      cursor="pointer"
      _hover={{ borderColor: "#BFD4F2", boxShadow: "0 12px 28px rgba(29, 66, 117, 0.06)" }}
    >
      <Flex direction="column" h="full" justify="space-between" gap="22px">
        <IconBadge icon={Icon} tone={item.tone} size="49px" iconSize={24} />
        <HStack justify="space-between" gap="10px">
          <Box minW={0}>
            <Text color="#092558" fontSize="14px" fontWeight="800" lineHeight="1.1">
              {item.title}
            </Text>
            <Text color="#6D83AA" fontSize="12px" fontWeight="600" mt="11px">
              {item.detail}
            </Text>
          </Box>
          <RoundArrowButton label={`Open ${item.title}`} />
        </HStack>
      </Flex>
    </Box>
  );
}

function ScheduleCard() {
  return (
    <Panel px={{ base: "18px", md: "26px" }} py="19px">
      <Flex justify="space-between" align="flex-start" gap="14px" mb="24px">
        <HStack gap="14px">
          <IconBadge icon={CalendarDays} tone="primary" size="38px" iconSize={20} radius="10px" />
          <Box>
            <Text color="#092558" fontSize="18px" fontWeight="800" lineHeight="1">
              Today's Schedule
            </Text>
            <Text color="#6D83AA" fontSize="13px" fontWeight="600" mt="9px">
              Your wellness activities for today
            </Text>
          </Box>
        </HStack>
        <Box bg="#F0EDFF" color="#174DF1" borderRadius="999px" px="18px" py="9px" fontSize="14px" fontWeight="800" lineHeight="1">
          12:15 PM
        </Box>
      </Flex>

      <VStack align="stretch" gap="13px" position="relative">
        <Box position="absolute" left={{ base: "63px", md: "108px" }} top="0" bottom="0" w="2px" bg="#DDE8F6" />
        {scheduleItems.map((item, index) => (
          <ScheduleRow key={item.title} item={item} index={index} />
        ))}
      </VStack>
    </Panel>
  );
}

function ScheduleRow({ item, index }: { item: ScheduleItem; index: number }) {
  const dotColors = ["#38CFA0", "#4298F4", "#8C65F5", "#8C65F5", "#4298F4"];
  const Icon = item.icon;

  return (
    <Grid templateColumns={{ base: "70px 20px minmax(0, 1fr)", md: "96px 24px minmax(0, 1fr)" }} alignItems="center" gap={{ base: "8px", md: "18px" }} position="relative">
      <Text color="#49658D" fontSize="14px" fontWeight="600" textAlign="right">
        {item.time}
      </Text>
      <Box w="9px" h="9px" borderRadius="full" bg={dotColors[index]} border="2px solid" borderColor={colors.surface} boxShadow="0 0 0 2px #DDE8F6" zIndex={1} />
      <HStack bg={item.bg} borderRadius="12px" minH="60px" px={{ base: "13px", md: "21px" }} py="10px" justify="space-between" gap="12px">
        <HStack gap="18px" minW={0}>
          <IconBadge icon={Icon} tone={item.tone} size="42px" iconSize={21} />
          <Box minW={0}>
            <Text color="#092558" fontSize="14px" fontWeight="800" lineHeight="1.1">
              {item.title}
            </Text>
            <Text color="#5F79A3" fontSize="12px" fontWeight="600" mt="7px">
              {item.detail}
            </Text>
          </Box>
        </HStack>
        <ChevronRight size={18} color="#174A89" strokeWidth={2} />
      </HStack>
    </Grid>
  );
}

function WellnessTipsCard() {
  return (
    <Panel px={{ base: "16px", md: "24px" }} py="17px">
      <HStack gap="14px" mb="19px">
        <IconBadge icon={Sparkles} tone="primary" size="38px" iconSize={20} radius="10px" />
        <Box>
          <Text color="#092558" fontSize="18px" fontWeight="800" lineHeight="1">
            Wellness Tips
          </Text>
          <Text color="#6D83AA" fontSize="13px" fontWeight="600" mt="9px">
            Small changes, big impact
          </Text>
        </Box>
      </HStack>

      <Grid templateColumns={{ base: "1fr", md: "28px minmax(0, 1fr) 28px" }} gap="14px" alignItems="center">
        <RoundArrowButton label="Previous wellness tip" direction="left" display={{ base: "none", md: "inline-flex" }} />
        <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="13px">
          {wellnessTips.map((tip) => (
            <TipCard key={tip.title} tip={tip} />
          ))}
        </SimpleGrid>
        <RoundArrowButton label="Next wellness tip" display={{ base: "none", md: "inline-flex" }} />
      </Grid>
    </Panel>
  );
}

function TipCard({ tip }: { tip: ActionTile }) {
  const gradients: Record<Tone, string> = {
    primary: "linear-gradient(135deg, #F8FBFF 0%, #EAF4FF 100%)",
    success: "linear-gradient(135deg, #F8FFFC 0%, #E6FAF1 100%)",
    warning: "linear-gradient(135deg, #FFFBF4 0%, #FFF1D8 100%)",
    purple: "linear-gradient(135deg, #FCFAFF 0%, #F1ECFF 100%)",
    orange: "linear-gradient(135deg, #FFFBF7 0%, #FFF0E4 100%)",
  };
  const Icon = tip.icon;

  return (
    <Box bg={gradients[tip.tone]} border="1px solid" borderColor={toneStyles[tip.tone].border || "#DDE8F6"} borderRadius="8px" minH="116px" px="18px" py="16px">
      <IconBadge icon={Icon} tone={tip.tone} size="38px" iconSize={20} />
      <Text color="#092558" fontSize="13px" fontWeight="800" lineHeight="1.15" mt="16px">
        {tip.title}
      </Text>
      <Text color="#6D83AA" fontSize="12px" fontWeight="600" mt="10px">
        {tip.detail}
      </Text>
    </Box>
  );
}

function StressReliefCard() {
  return (
    <Panel px={{ base: "18px", md: "22px" }} py="18px">
      <Flex justify="space-between" align="center" gap="14px" mb="16px">
        <HStack gap="14px">
          <IconBadge icon={Zap} tone="primary" size="36px" iconSize={21} radius="10px" />
          <Text color="#092558" fontSize="18px" fontWeight="800" lineHeight="1">
            Quick Stress Relief
          </Text>
        </HStack>
        <HStack as="button" color="#0E5AFF" gap="7px" fontSize="12px" fontWeight="800" _hover={{ color: "#164FCB" }}>
          <Text as="span">View all</Text>
          <ChevronRight size={15} />
        </HStack>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="16px">
        {stressResources.map((resource) => (
          <ResourceCard key={resource.title} resource={resource} />
        ))}
      </SimpleGrid>
    </Panel>
  );
}

function ResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <Box border="1px solid" borderColor="#DCE6F4" borderRadius="8px" overflow="hidden" bg={colors.surface}>
      <Image src={resource.image} alt="" h="98px" w="full" objectFit="cover" />
      <HStack justify="space-between" gap="10px" px="16px" py="13px">
        <Box minW={0}>
          <Text color="#092558" fontSize="13px" fontWeight="800" lineHeight="1.15">
            {resource.title}
          </Text>
          <Text color="#6D83AA" fontSize="12px" fontWeight="600" mt="8px">
            {resource.detail}
          </Text>
        </Box>
        <IconButton
          aria-label={`Play ${resource.title}`}
          h="32px"
          w="32px"
          minW="32px"
          borderRadius="full"
          bg="#EAF4FF"
          color="#225FAE"
          _hover={{ bg: "#DCEEFF" }}
        >
          <CirclePlay size={15} fill="#225FAE" color="#225FAE" strokeWidth={1.6} />
        </IconButton>
      </HStack>
    </Box>
  );
}

function SupportCard() {
  return (
    <Panel px={{ base: "18px", md: "22px" }} py="20px">
      <HStack align="flex-start" gap="14px">
        <IconBadge icon={Heart} tone="primary" size="36px" iconSize={22} radius="10px" />
        <Box flex="1" minW={0}>
          <Text color="#092558" fontSize="18px" fontWeight="800" lineHeight="1">
            Need Support?
          </Text>
          <Text color="#6D83AA" fontSize="13px" fontWeight="600" mt="12px">
            Reach out if experiencing:
          </Text>
          <VStack align="stretch" gap="8px" mt="14px" color="#6D83AA" fontSize="12px" fontWeight="600">
            {["Persistent sadness", "Sleep/appetite changes", "Anxiety or panic attacks"].map((item) => (
              <HStack key={item} gap="10px">
                <Box w="5px" h="5px" borderRadius="full" bg="#1F71FF" />
                <Text>{item}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </HStack>

      <HStack
        as="button"
        mt="20px"
        w="full"
        justify="space-between"
        bg="#EAF5FF"
        borderRadius="10px"
        px="15px"
        py="12px"
        _hover={{ bg: "#E1F0FF" }}
      >
        <HStack gap="14px">
          <IconBadge icon={Building2} tone="primary" size="38px" iconSize={20} radius="9px" />
          <Box textAlign="left">
            <Text color="#092558" fontSize="12px" fontWeight="800">
              Company Resources
            </Text>
            <Text color="#6D83AA" fontSize="12px" fontWeight="600" mt="5px">
              Contact HR for EAP & counselling
            </Text>
          </Box>
        </HStack>
        <ChevronRight size={18} color="#0E5AFF" />
      </HStack>
    </Panel>
  );
}

function ExpertBanner() {
  return (
    <HStack
      minH="137px"
      bg="linear-gradient(135deg, #EEF7FF 0%, #DCEEFF 100%)"
      border="1px solid"
      borderColor="#D7E8FA"
      borderRadius="8px"
      px={{ base: "18px", md: "34px" }}
      py="20px"
      justify="space-between"
      gap="18px"
      overflow="hidden"
      position="relative"
    >
      <Box position="absolute" right="-44px" bottom="-64px" w="230px" h="170px" borderRadius="full" bg="rgba(255,255,255,0.32)" transform="rotate(-18deg)" />
      <HStack gap="24px" position="relative" zIndex={1}>
        <IconBadge icon={BookOpen} tone="primary" size="58px" iconSize={26} radius="full" />
        <Box>
          <Text color="#174A89" fontSize="15px" fontWeight="800">
            Talk to Expert
          </Text>
          <Text color="#6D83AA" fontSize="13px" fontWeight="600" mt="7px">
            Get confidential support from our wellness team
          </Text>
        </Box>
      </HStack>
      <ChevronRight size={19} color="#0E5AFF" />
    </HStack>
  );
}

function Panel({
  children,
  px,
  py,
}: {
  children: ReactNode;
  px: string | Record<string, string>;
  py: string;
}) {
  return (
    <Box bg={colors.surface} border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" boxShadow="0 8px 22px rgba(29, 66, 117, 0.035)" px={px} py={py}>
      {children}
    </Box>
  );
}

function IconBadge({
  icon: Icon,
  tone,
  size,
  iconSize,
  radius = "full",
}: {
  icon: LucideIcon;
  tone: Tone;
  size: string;
  iconSize: number;
  radius?: string;
}) {
  const style = toneStyles[tone];

  return (
    <Box
      w={size}
      h={size}
      minW={size}
      borderRadius={radius}
      bg={style.bg}
      color={style.color}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Icon size={iconSize} strokeWidth={2.1} />
    </Box>
  );
}

function RoundArrowButton({
  label,
  direction = "right",
  display,
}: {
  label: string;
  direction?: "left" | "right";
  display?: Record<string, string>;
}) {
  return (
    <IconButton
      aria-label={label}
      display={display}
      h="30px"
      w="30px"
      minW="30px"
      borderRadius="full"
      bg="#EAF4FF"
      color="#225FAE"
      _hover={{ bg: "#DCEEFF" }}
    >
      <ChevronRight size={16} strokeWidth={2.1} style={{ transform: direction === "left" ? "rotate(180deg)" : undefined }} />
    </IconButton>
  );
}
