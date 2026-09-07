"use client";

import { useState } from "react";
import { Box, Button, Flex, Grid, HStack, IconButton, Text, Textarea, VStack } from "@chakra-ui/react";
import { ArrowRight, Check, ClipboardCheck, FileWarning, Heart, MessageSquareText, Moon, Smile, Sun, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "@/types/styles";

type DailyCheckInModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { energy: string; workload: string }) => void;
};

type EnergyOption = {
  value: "low" | "medium" | "high";
  label: string;
  description: string;
  icon: LucideIcon;
};

type WorkloadOption = {
  value: "yes" | "no";
  label: string;
  description: string;
  icon: LucideIcon;
};

const energyOptions: EnergyOption[] = [
  { value: "low", label: "Low Energy", description: "Feeling drained or tired.", icon: Moon },
  { value: "medium", label: "Medium Energy", description: "Stable and steady.", icon: Smile },
  { value: "high", label: "High Energy", description: "Feeling energetic and focused.", icon: Sun },
];

const workloadOptions: WorkloadOption[] = [
  { value: "yes", label: "Yes, Manageable", description: "I feel in control.", icon: ClipboardCheck },
  { value: "no", label: "No, Overwhelming", description: "I have too much on my plate.", icon: FileWarning },
];

export function DailyCheckInModal({ isOpen, onClose, onComplete }: DailyCheckInModalProps) {
  const [energy, setEnergy] = useState<string | null>("medium");
  const [workload, setWorkload] = useState<string | null>("yes");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (!energy || !workload) {
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      onComplete({ energy, workload });
      setIsSubmitting(false);
      setNote("");
    }, 800);
  };

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={1500}
      bg="rgba(18, 31, 50, 0.72)"
      backdropFilter="blur(7px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: "14px", md: "26px" }}
      py={{ base: "18px", md: "30px" }}
    >
      <Grid
        bg={colors.surface}
        border="1px solid rgba(220, 229, 242, 0.92)"
        borderRadius="18px"
        boxShadow="0 30px 90px rgba(12, 24, 40, 0.36)"
        w="full"
        maxW={{ base: "100%", xl: "1180px", "2xl": "1320px" }}
        maxH="90vh"
        overflow="hidden"
        templateColumns={{ base: "1fr", lg: "360px minmax(0, 1fr)", "2xl": "390px minmax(0, 1fr)" }}
      >
        <Sidebar />

        <Flex direction="column" minH={0} maxH="90vh">
          <Box position="relative" flex="1" overflowY="auto" px={{ base: "22px", xl: "30px", "2xl": "34px" }} pt={{ base: "24px", xl: "38px", "2xl": "48px" }} pb={{ base: "18px", xl: "24px" }}>
            <IconButton
              aria-label="Close daily check-in"
              position="absolute"
              top={{ base: "14px", xl: "24px" }}
              right={{ base: "14px", xl: "24px" }}
              variant="ghost"
              color="#53698F"
              borderRadius="8px"
              _hover={{ bg: "#F4F8FD" }}
              onClick={onClose}
            >
              <X size={22} />
            </IconButton>

            <Box pr={{ base: "34px", md: "44px" }}>
              <Text color="#092558" fontSize={{ base: "22px", xl: "23px", "2xl": "27px" }} fontWeight="800" lineHeight="1.05">
                How's your energy today?
              </Text>
              <Text color="#53698F" fontSize={{ base: "14px", xl: "14px", "2xl": "16px" }} fontWeight="600" mt="12px">
                It helps us understand how you're feeling and support you better.
              </Text>
            </Box>

            <Grid templateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }} gap={{ base: "14px", xl: "18px", "2xl": "22px" }} mt={{ base: "22px", xl: "28px" }}>
              {energyOptions.map((option) => (
                <ChoiceCard key={option.value} option={option} isSelected={energy === option.value} onClick={() => setEnergy(option.value)} />
              ))}
            </Grid>

            <Text color="#092558" fontSize={{ base: "19px", xl: "20px", "2xl": "22px" }} fontWeight="800" mt={{ base: "26px", xl: "30px", "2xl": "34px" }}>
              Is your workload manageable?
            </Text>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap={{ base: "14px", xl: "18px", "2xl": "22px" }} mt="16px">
              {workloadOptions.map((option) => (
                <ChoiceCard key={option.value} option={option} isSelected={workload === option.value} onClick={() => setWorkload(option.value)} wide />
              ))}
            </Grid>

            <Text color="#092558" fontSize={{ base: "19px", xl: "20px", "2xl": "22px" }} fontWeight="800" mt={{ base: "26px", xl: "30px" }}>
              Anything on your mind?
            </Text>
            <Box position="relative" mt="14px">
              <Box position="absolute" left="17px" top="18px" color="#53698F">
                <MessageSquareText size={18} />
              </Box>
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value.slice(0, 500))}
                placeholder="Share a quick note (optional)..."
                minH={{ base: "90px", xl: "96px" }}
                resize="none"
                pl="52px"
                pr="64px"
                pt="17px"
                bg={colors.surface}
                border="1px solid"
                borderColor="#DCE6F4"
                borderRadius="10px"
                color="#092558"
                fontSize={{ base: "13px", xl: "14px" }}
                fontWeight="600"
                _placeholder={{ color: "#7F93B4" }}
                _focus={{ borderColor: colors.primary, boxShadow: "0 0 0 3px rgba(29, 127, 227, 0.08)" }}
              />
              <Text position="absolute" right="17px" bottom="12px" color="#7F93B4" fontSize="12px" fontWeight="700">
                {note.length}/500
              </Text>
            </Box>
          </Box>

          <Flex
            align="center"
            justify="space-between"
            gap="18px"
            bg="#F1F7FF"
            px={{ base: "22px", xl: "30px", "2xl": "34px" }}
            py={{ base: "16px", xl: "20px", "2xl": "24px" }}
            flexWrap={{ base: "wrap", md: "nowrap" }}
          >
            <HStack gap="14px">
              <Flex w="38px" h="38px" borderRadius="full" bg={colors.primarySoft} color={colors.primary} align="center" justify="center">
                <Heart size={18} />
              </Flex>
              <Box>
                <Text color="#092558" fontSize="13px" fontWeight="800">
                  Your wellbeing matters
                </Text>
                <Text color="#53698F" fontSize="12px" fontWeight="600" mt="4px">
                  This check-in helps us support you better.
                </Text>
              </Box>
            </HStack>

            <Button
              h={{ base: "46px", xl: "50px" }}
              minW={{ base: "100%", md: "214px" }}
              bg="#2F75F6"
              color={colors.surface}
              borderRadius="8px"
              fontSize={{ base: "14px", xl: "15px" }}
              fontWeight="800"
              loading={isSubmitting}
              disabled={!energy || !workload || isSubmitting}
              _hover={{ bg: "#2467DD" }}
              _disabled={{ opacity: 0.55, cursor: "not-allowed" }}
              onClick={handleSubmit}
            >
              Submit Check-In
              <ArrowRight size={18} />
            </Button>
          </Flex>
        </Flex>
      </Grid>
    </Box>
  );
}

function Sidebar() {
  return (
    <Box
      display={{ base: "none", lg: "block" }}
      bg="linear-gradient(180deg, #F0F7FF 0%, #EAF5FF 100%)"
      borderRight="1px solid"
      borderColor="#DCE8F7"
      px={{ lg: "34px", "2xl": "38px" }}
      py={{ lg: "50px", "2xl": "58px" }}
      position="relative"
      overflow="hidden"
    >
      <HStack align="flex-start" gap="18px">
        <Flex w="54px" h="54px" borderRadius="full" bg={colors.primarySoft} color={colors.primary} align="center" justify="center" flexShrink={0}>
          <Heart size={23} fill={colors.primary} />
        </Flex>
        <Box>
          <Text color="#092558" fontSize={{ lg: "22px", "2xl": "24px" }} fontWeight="800" lineHeight="1.05">
            Daily Check-In
          </Text>
          <Text color="#53698F" fontSize={{ lg: "15px", "2xl": "16px" }} fontWeight="500" lineHeight="1.5" mt="20px">
            Take a moment to reflect on your day, your wellbeing and your goals.
          </Text>
        </Box>
      </HStack>

      <Box bg="rgba(255,255,255,0.62)" border="1px solid" borderColor="#D8E6F7" borderRadius="13px" boxShadow="0 18px 42px rgba(35, 91, 155, 0.08)" p="28px" mt="68px">
        <Text color="#8DBBF5" fontSize="34px" fontWeight="800" lineHeight="1">
          "
        </Text>
        <Text color="#24436E" fontSize="17px" fontWeight="800" lineHeight="1.45" mt="4px">
          Small check-ins lead to big changes.
        </Text>
      </Box>

      <Box position="absolute" left="-18px" right="-10px" bottom="18px" h="330px">
        <Box position="absolute" left="44px" bottom="48px" w="86px" h="154px" bg="#78B4F5" borderRadius="80px 80px 12px 80px" transform="rotate(27deg)" opacity={0.65} />
        <Box position="absolute" left="118px" bottom="66px" w="118px" h="118px" bg="#D8EAFF" borderRadius="full" />
        <Box position="absolute" right="48px" bottom="62px" w="48px" h="86px" bg="#8AC3FF" borderRadius="60px 60px 0 60px" transform="rotate(31deg)" opacity={0.72} />
        <Box position="absolute" right="66px" bottom="32px" w="70px" h="16px" bg="#7CB8F0" borderRadius="full" opacity={0.72} />
        <Box position="absolute" left="74px" bottom="22px" w="250px" h="22px" bg="#D7E9FD" borderRadius="full" opacity={0.9} />
        <Box position="absolute" left="116px" bottom="84px" w="160px" h="84px" bg="#1F3E6E" borderRadius="999px 999px 22px 22px" transform="rotate(-5deg)" />
        <Box position="absolute" left="160px" bottom="156px" w="58px" h="70px" bg="#FFD8CC" borderRadius="26px 26px 22px 22px" />
        <Box position="absolute" left="143px" bottom="180px" w="75px" h="76px" bg="#203C68" borderRadius="55% 45% 42% 58%" />
        <Box position="absolute" left="140px" bottom="128px" w="74px" h="96px" bg="#5A9BEA" borderRadius="22px 22px 10px 10px" transform="rotate(8deg)" />
        <Box position="absolute" left="202px" bottom="131px" w="35px" h="48px" bg="#75AEF4" borderRadius="18px" />
        <Box position="absolute" left="233px" bottom="139px" w="24px" h="28px" bg="#2E6EBD" borderRadius="4px" />
        <Box position="absolute" right="56px" bottom="18px" w="46px" h="122px" borderLeft="6px solid #BAD9F8" />
        <Box position="absolute" right="28px" bottom="136px" w="66px" h="8px" bg="#B8D9F9" borderRadius="999px" />
        <Box position="absolute" right="18px" bottom="84px" w="112px" h="42px" bg="#B8D9F9" borderRadius="50%" opacity={0.8} />
      </Box>
    </Box>
  );
}

function ChoiceCard({
  option,
  isSelected,
  onClick,
  wide,
}: {
  option: EnergyOption | WorkloadOption;
  isSelected: boolean;
  onClick: () => void;
  wide?: boolean;
}) {
  const Icon = option.icon;

  return (
    <Box
      as="button"
      position="relative"
      minH={{ base: "142px", xl: wide ? "150px" : "176px", "2xl": wide ? "154px" : "190px" }}
      bg={isSelected ? "#F2F8FF" : colors.surface}
      border="2px solid"
      borderColor={isSelected ? "#2F75F6" : "#DCE6F4"}
      borderRadius="10px"
      px={{ base: "18px", xl: "24px" }}
      py={{ base: "18px", xl: "24px" }}
      color="#092558"
      textAlign="center"
      cursor="pointer"
      transition="all 0.18s ease"
      _hover={{ borderColor: "#2F75F6", boxShadow: "0 14px 34px rgba(29, 127, 227, 0.09)" }}
      onClick={onClick}
    >
      {isSelected ? (
        <Flex position="absolute" top="12px" right="12px" w="24px" h="24px" borderRadius="full" bg="#2F75F6" color={colors.surface} align="center" justify="center">
          <Check size={14} strokeWidth={3} />
        </Flex>
      ) : null}
      <VStack gap={{ base: "14px", xl: "18px" }} align="center" justify="center" h="full">
        <Icon size={wide ? 38 : 44} strokeWidth={1.8} color="#2F75F6" />
        <Box>
          <Text fontSize={{ base: "14px", xl: "16px" }} fontWeight="800" lineHeight="1.2">
            {option.label}
          </Text>
          <Text color="#53698F" fontSize={{ base: "12px", xl: "14px" }} fontWeight="600" lineHeight="1.45" mt="10px">
            {option.description}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
