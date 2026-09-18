"use client";

import { HStack, Text, VStack } from "@chakra-ui/react";
import { Mail, ShieldCheck, Sparkles } from "lucide-react";
import { colors } from "@/types/styles";
import { feedbackMatters, surveyInfoLinks } from "./surveyInfoData";
import { ActionLink, IconTile, SurveyCard } from "./shared";

const feedbackIconByName = {
  mail: Mail,
  sparkle: Sparkles,
  shield: ShieldCheck,
} as const;

export function FeedbackMattersCard() {
  return (
    <SurveyCard>
      <HStack gap="10px" mb="24px">
        <Sparkles size={18} color={colors.primary} strokeWidth={2.2} />
        <Text color={colors.primaryText} fontSize="15px" fontWeight="800" lineHeight="1.1">
          Why your feedback matters
        </Text>
      </HStack>

      <VStack align="stretch" gap="22px">
        {feedbackMatters.map((item) => {
          const Icon = feedbackIconByName[item.icon];

          return (
            <HStack key={item.id} gap="18px" align="center">
              <IconTile tone="primary" size="44px">
                <Icon size={18} strokeWidth={2.1} />
              </IconTile>
              <Text color={colors.secondaryText} fontSize="13px" fontWeight="600" lineHeight="1.55">
                {item.text}
              </Text>
            </HStack>
          );
        })}
      </VStack>

      <HStack mt="28px">
        <ActionLink href={surveyInfoLinks.surveyProcess}>Learn more about our survey process</ActionLink>
      </HStack>
    </SurveyCard>
  );
}
