"use client";

import { Box, Button, Flex, Grid, HStack, IconButton, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import {
  ArrowRight,
  Clock3,
  Eye,
  FileText,
  HandHeart,
  Heart,
  LockKeyhole,
  Play,
  Star,
  UserRound,
  UsersRound,
  Video,
  X,
} from "lucide-react";
import { cardBorder, colors } from "@/types/styles";

type ContentArticle = {
  category: string;
  tone: "primary" | "success" | "warning";
  title: string;
  description: string;
  readTime: string;
  views: string;
  illustration: "mental-health" | "career-growth" | "nutrition";
};

type ContentVideo = {
  category: string;
  tone: "primary" | "success" | "warning";
  title: string;
  description: string;
  duration: string;
  views: string;
  rating: string;
  image: string;
};

const articles: ContentArticle[] = [
  {
    category: "Mental Health",
    tone: "primary",
    title: "Mental Health in the Workplace",
    description: "Practical strategies to manage stress, build resilience, and maintain a healthy mind at work.",
    readTime: "5 min read",
    views: "1.2k views",
    illustration: "mental-health",
  },
  {
    category: "Career Growth",
    tone: "success",
    title: "Setting Career Goals for 2025",
    description: "A step-by-step guide to set meaningful career goals and achieve milestones this year.",
    readTime: "6 min read",
    views: "980 views",
    illustration: "career-growth",
  },
  {
    category: "Nutrition",
    tone: "warning",
    title: "Nutrition Tips for Busy Professionals",
    description: "Simple nutrition tips to boost energy, improve focus, and stay healthy through your busy day.",
    readTime: "4 min read",
    views: "850 views",
    illustration: "nutrition",
  },
];

const videos: ContentVideo[] = [
  {
    category: "Mindfulness",
    tone: "primary",
    title: "Guided Meditation for Stress Relief",
    description: "A calming guided meditation to help you relax, focus, and find balance.",
    duration: "12:45",
    views: "1.4k views",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80",
  },
  {
    category: "Fitness",
    tone: "primary",
    title: "Morning Yoga for Beginners",
    description: "Start your day with this energizing yoga routine designed for all levels.",
    duration: "15:30",
    views: "1.1k views",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80",
  },
  {
    category: "Nutrition",
    tone: "primary",
    title: "Healthy Eating for Busy Professionals",
    description: "Easy and nutritious meal ideas to fuel your body and mind.",
    duration: "10:20",
    views: "890 views",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80",
  },
];

const toneStyles = {
  primary: { bg: colors.primarySoft, color: colors.primary },
  success: { bg: "#E8F8F0", color: colors.success },
  warning: { bg: "#FFF3DE", color: "#F97316" },
};

export function ContentLibraryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) {
    return null;
  }

  return (
    <Box
      position="fixed"
      inset="0"
      zIndex={1000}
      bg="rgba(15, 23, 42, 0.72)"
      backdropFilter="blur(5px)"
      display="flex"
      alignItems={{ base: "flex-start", lg: "center" }}
      justifyContent="center"
      p={{ base: "18px", md: "22px", "2xl": "28px" }}
      overflowY="auto"
      onClick={onClose}
    >
      <Box
        bg={colors.surface}
        borderRadius="10px"
        border="1px solid"
        borderColor={colors.border}
        boxShadow="0 28px 70px rgba(11, 12, 28, 0.28)"
        w="full"
        maxW={{ base: "100%", xl: "960px", "2xl": "1060px" }}
        maxH={{ base: "none", lg: "92vh" }}
        overflow="hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <Box px={{ base: "22px", md: "30px", xl: "28px", "2xl": "40px" }} py={{ base: "22px", md: "26px", xl: "22px", "2xl": "34px" }} overflowY="auto" maxH={{ base: "none", lg: "92vh" }}>
          <Flex justify="space-between" align="flex-start" gap={{ base: "18px", "2xl": "24px" }}>
            <HStack align="center" gap={{ base: "18px", xl: "16px", "2xl": "22px" }}>
              <Box
                w={{ base: "58px", xl: "50px", "2xl": "66px" }}
                h={{ base: "58px", xl: "50px", "2xl": "66px" }}
                borderRadius="full"
                bg="linear-gradient(135deg, #2F7CF6 0%, #164AF5 100%)"
                color={colors.surface}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 16px 30px rgba(29, 127, 227, 0.2)"
                flexShrink={0}
              >
                <HandHeart size={26} strokeWidth={1.8} />
              </Box>
              <Box>
                <Text as="h2" color={colors.primaryText} fontSize={{ base: "22px", md: "24px", xl: "22px", "2xl": "27px" }} fontWeight="800" lineHeight="1.1">
                  Wellness Offerings
                </Text>
                <Text color={colors.secondaryText} fontSize={{ base: "14px", xl: "13px", "2xl": "15px" }} fontWeight="600" lineHeight="1.5" mt={{ base: "8px", xl: "6px", "2xl": "8px" }} maxW="500px">
                  Explore resources, events, and support programs to support your well-being and growth.
                </Text>
              </Box>
            </HStack>

            <IconButton
              aria-label="Close content library"
              h={{ base: "44px", xl: "38px", "2xl": "48px" }}
              w={{ base: "44px", xl: "38px", "2xl": "48px" }}
              minW={{ base: "44px", xl: "38px", "2xl": "48px" }}
              bg={colors.surface}
              border={cardBorder}
              borderColor={colors.border}
              borderRadius="8px"
              color={colors.primaryText}
              _hover={{ bg: "#F8FAFD" }}
              onClick={onClose}
            >
              <X size={24} />
            </IconButton>
          </Flex>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap={{ base: "18px", xl: "14px", "2xl": "24px" }} mt={{ base: "28px", xl: "22px", "2xl": "34px" }}>
            <StatTile icon={FileText} iconTone="primary" value="24" label="Wellness Articles" />
            <StatTile icon={Video} iconTone="success" value="18" label="Video Resources" />
            <StatTile icon={Eye} iconTone="warning" value="2.5k+" label="Total Views" />
          </SimpleGrid>

          <Box h="1px" bg={colors.lightBorder} my={{ base: "22px", xl: "18px", "2xl": "24px" }} />

          <SectionHeader title="Featured Articles" meta="24 Available" />
          <SimpleGrid columns={{ base: 1, lg: 3 }} gap={{ base: "18px", xl: "14px", "2xl": "20px" }} mt={{ base: "16px", xl: "12px", "2xl": "16px" }}>
            {articles.map((article) => (
              <ArticleCard key={article.title} article={article} />
            ))}
          </SimpleGrid>

          <Box mt={{ base: "30px", xl: "24px", "2xl": "34px" }}>
            <SectionHeader title="Wellness Videos" meta="18 Available" />
            <SimpleGrid columns={{ base: 1, lg: 3 }} gap={{ base: "18px", xl: "14px", "2xl": "20px" }} mt={{ base: "16px", xl: "12px", "2xl": "16px" }}>
              {videos.map((video) => (
                <VideoCard key={video.title} video={video} />
              ))}
            </SimpleGrid>
          </Box>

          <SupportBanner />
        </Box>
      </Box>
    </Box>
  );
}

function StatTile({
  icon: Icon,
  iconTone,
  value,
  label,
}: {
  icon: typeof FileText;
  iconTone: keyof typeof toneStyles;
  value: string;
  label: string;
}) {
  const tone = toneStyles[iconTone];

  return (
    <HStack h={{ base: "108px", xl: "86px", "2xl": "118px" }} border={cardBorder} borderColor={colors.border} borderRadius="8px" px={{ base: "24px", xl: "18px", "2xl": "28px" }} gap={{ base: "22px", xl: "16px", "2xl": "26px" }}>
      <Box w={{ base: "54px", xl: "42px", "2xl": "58px" }} h={{ base: "54px", xl: "42px", "2xl": "58px" }} borderRadius="14px" bg={tone.bg} color={tone.color} display="flex" alignItems="center" justifyContent="center">
        <Icon size={22} strokeWidth={2} />
      </Box>
      <Box borderLeft="1px solid" borderColor={colors.lightBorder} pl={{ base: "20px", xl: "14px", "2xl": "22px" }}>
        <Text color={colors.primaryText} fontSize={{ base: "30px", xl: "24px", "2xl": "33px" }} fontWeight="800" lineHeight="1">
          {value}
        </Text>
        <Text color={colors.secondaryText} fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="600" mt={{ base: "10px", xl: "7px", "2xl": "10px" }}>
          {label}
        </Text>
      </Box>
    </HStack>
  );
}

function SectionHeader({ title, meta }: { title: string; meta: string }) {
  return (
    <HStack justify="space-between" align="center">
      <Text color={colors.primaryText} fontSize={{ base: "18px", xl: "15px", "2xl": "19px" }} fontWeight="800">
        {title}
      </Text>
      <HStack as="button" gap="9px" color={colors.primary} fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="800">
        <Text>{meta}</Text>
      </HStack>
    </HStack>
  );
}

function ArticleCard({ article }: { article: ContentArticle }) {
  const tone = toneStyles[article.tone];

  return (
    <Box border={cardBorder} borderColor={colors.border} borderRadius="8px" overflow="hidden" bg={colors.surface}>
      <Box h={{ base: "150px", xl: "122px", "2xl": "162px" }} position="relative" bg="linear-gradient(135deg, #F8FBFF 0%, #EFF6FF 100%)" overflow="hidden">
        <Box position="absolute" top={{ base: "18px", xl: "14px", "2xl": "18px" }} left={{ base: "18px", xl: "14px", "2xl": "18px" }} bg={tone.bg} color={tone.color} borderRadius="6px" px="10px" py="5px" fontSize={{ base: "12px", xl: "10px", "2xl": "12px" }} fontWeight="800">
          {article.category}
        </Box>
        <ArticleIllustration type={article.illustration} tone={article.tone} />
      </Box>
      <VStack align="stretch" gap="0" px={{ base: "18px", xl: "14px", "2xl": "18px" }} pb={{ base: "18px", xl: "14px", "2xl": "18px" }}>
        <Text color={colors.primaryText} fontSize={{ base: "16px", xl: "13px", "2xl": "16px" }} fontWeight="800" lineHeight="1.25" mt={{ base: "14px", xl: "11px", "2xl": "14px" }}>
          {article.title}
        </Text>
        <Text color={colors.secondaryText} fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="600" lineHeight="1.45" mt={{ base: "10px", xl: "8px", "2xl": "10px" }}>
          {article.description}
        </Text>
        <Box h="1px" bg={colors.lightBorder} my={{ base: "17px", xl: "12px", "2xl": "17px" }} />
        <HStack justify="space-between" color={colors.secondaryText} fontSize={{ base: "13px", xl: "11px", "2xl": "13px" }} fontWeight="600">
          <HStack gap="8px">
            <Clock3 size={17} />
            <Text>{article.readTime}</Text>
          </HStack>
          <HStack gap="8px">
            <Eye size={17} />
            <Text>{article.views}</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}

function ArticleIllustration({ type, tone }: { type: ContentArticle["illustration"]; tone: ContentArticle["tone"] }) {
  const color = toneStyles[tone].color;
  const content =
    type === "career-growth" ? (
      <TargetIllustration color={color} />
    ) : type === "nutrition" ? (
      <NutritionIllustration color={color} />
    ) : (
      <MentalHealthIllustration color={color} />
    );

  return (
    <Box position="absolute" inset="0" display="flex" alignItems="center" justifyContent="center" pt={{ base: "22px", xl: "16px", "2xl": "22px" }}>
      {content}
    </Box>
  );
}

function MentalHealthIllustration({ color }: { color: string }) {
  return (
    <Box w="190px" h="116px" position="relative">
      <Box position="absolute" left="28px" top="28px" w="76px" h="76px" borderRadius="full" bg="#DDEAFF" />
      <Box position="absolute" left="68px" top="34px">
        <Heart size={58} color={color} strokeWidth={2.5} />
      </Box>
      <Box position="absolute" right="12px" top="22px" w="60px" h="84px" borderRadius="50% 50% 0 50%" bg="#BFD4FF" transform="rotate(18deg)" opacity={0.75} />
    </Box>
  );
}

function TargetIllustration({ color }: { color: string }) {
  return (
    <Box w="190px" h="116px" position="relative">
      <Box position="absolute" inset="20px 8px 8px" borderRadius="full" bg="#E8F8F0" />
      <Box position="absolute" left="60px" top="18px" w="86px" h="86px" borderRadius="full" border="10px solid" borderColor={color} />
      <Box position="absolute" left="82px" top="40px" w="42px" h="42px" borderRadius="full" border="8px solid" borderColor={color} />
      <Box position="absolute" left="117px" top="8px" w="12px" h="88px" bg={color} transform="rotate(48deg)" borderRadius="999px" />
    </Box>
  );
}

function NutritionIllustration({ color }: { color: string }) {
  return (
    <Box w="198px" h="116px" position="relative">
      <Box position="absolute" left="32px" right="22px" bottom="16px" h="52px" bg="#F1F5FF" borderRadius="0 0 70px 70px" />
      {["#F97316", "#FDB83F", "#39BA85", "#E2493A", color].map((itemColor, index) => (
        <Box key={itemColor} position="absolute" left={`${54 + index * 22}px`} top={`${34 - (index % 2) * 10}px`} w="30px" h="30px" borderRadius="full" bg={itemColor} />
      ))}
      <Box position="absolute" right="36px" top="18px" w="22px" h="40px" bg="#77BE62" borderRadius="999px 999px 0 999px" transform="rotate(35deg)" />
    </Box>
  );
}

function VideoCard({ video }: { video: ContentVideo }) {
  const tone = toneStyles[video.tone];

  return (
    <Box border={cardBorder} borderColor={colors.border} borderRadius="8px" overflow="hidden" bg={colors.surface}>
      <Box h={{ base: "160px", xl: "128px", "2xl": "170px" }} position="relative" overflow="hidden">
        <Image src={video.image} alt="" w="full" h="full" objectFit="cover" />
        <Box position="absolute" inset="0" bg="rgba(11, 12, 28, 0.14)" />
        <Box
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          w={{ base: "52px", xl: "44px", "2xl": "56px" }}
          h={{ base: "52px", xl: "44px", "2xl": "56px" }}
          borderRadius="full"
          bg="rgba(255,255,255,0.9)"
          color={colors.primaryText}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 8px 22px rgba(11, 12, 28, 0.28)"
        >
          <Play size={26} fill={colors.primaryText} />
        </Box>
        <Box position="absolute" right="12px" bottom="10px" bg="rgba(11, 12, 28, 0.72)" color={colors.surface} borderRadius="5px" px="8px" py="4px" fontSize={{ base: "12px", xl: "10px", "2xl": "12px" }} fontWeight="800">
          {video.duration}
        </Box>
      </Box>
      <VStack align="stretch" gap="0" px={{ base: "18px", xl: "14px", "2xl": "18px" }} py={{ base: "18px", xl: "14px", "2xl": "18px" }}>
        <Box alignSelf="flex-start" bg={tone.bg} color={tone.color} borderRadius="6px" px="10px" py="5px" fontSize={{ base: "12px", xl: "10px", "2xl": "12px" }} fontWeight="800">
          {video.category}
        </Box>
        <Text color={colors.primaryText} fontSize={{ base: "16px", xl: "13px", "2xl": "16px" }} fontWeight="800" lineHeight="1.25" mt={{ base: "14px", xl: "11px", "2xl": "14px" }}>
          {video.title}
        </Text>
        <Text color={colors.secondaryText} fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="600" lineHeight="1.45" mt={{ base: "10px", xl: "8px", "2xl": "10px" }}>
          {video.description}
        </Text>
        <HStack justify="space-between" color={colors.secondaryText} fontSize={{ base: "13px", xl: "11px", "2xl": "13px" }} fontWeight="600" mt={{ base: "22px", xl: "16px", "2xl": "22px" }}>
          <HStack gap="8px">
            <Eye size={17} />
            <Text>{video.views}</Text>
          </HStack>
          <HStack gap="8px">
            <Star size={17} />
            <Text>{video.rating}</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  );
}

function SupportBanner() {
  return (
    <Grid
      templateColumns={{ base: "1fr", lg: "70px minmax(0, 1fr) 1px 118px 138px", "2xl": "92px minmax(0, 1fr) 1px 150px 170px" }}
      gap={{ base: "16px", lg: "16px", "2xl": "22px" }}
      alignItems="center"
      mt={{ base: "34px", xl: "26px", "2xl": "40px" }}
      border={cardBorder}
      borderColor="#CFE0FA"
      borderRadius="8px"
      bg="linear-gradient(135deg, #F8FBFF 0%, #EFF6FF 100%)"
      px={{ base: "18px", md: "22px", xl: "20px", "2xl": "26px" }}
      py={{ base: "20px", md: "20px", xl: "16px", "2xl": "24px" }}
    >
      <Box w={{ base: "70px", xl: "54px", "2xl": "74px" }} h={{ base: "70px", xl: "54px", "2xl": "74px" }} borderRadius="full" bg={colors.primarySoft} color={colors.primary} display="flex" alignItems="center" justifyContent="center">
        <HandHeart size={28} strokeWidth={1.8} />
      </Box>
      <Box minW={0}>
        <Text color={colors.primaryText} fontSize={{ base: "19px", xl: "15px", "2xl": "19px" }} fontWeight="800">
          24/7 Employee Assistance Program
        </Text>
        <Text color={colors.secondaryText} fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="600" lineHeight="1.45" mt={{ base: "8px", xl: "6px", "2xl": "8px" }}>
          Confidential support for you and your family. Get help for personal, professional, or emotional challenges from our trusted experts.
        </Text>
        <Flex gap={{ base: "18px", xl: "12px", "2xl": "18px" }} flexWrap="wrap" color={colors.secondaryText} fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="700" mt={{ base: "18px", xl: "12px", "2xl": "18px" }}>
          <HStack gap="7px">
            <LockKeyhole size={15} color={colors.primary} />
            <Text>100% Confidential</Text>
          </HStack>
          <HStack gap="7px">
            <Clock3 size={15} color={colors.primary} />
            <Text>Available 24/7</Text>
          </HStack>
          <HStack gap="7px">
            <UserRound size={15} color={colors.primary} />
            <Text>Free for all employees</Text>
          </HStack>
        </Flex>
      </Box>
      <Box display={{ base: "none", lg: "block" }} w="1px" h="78px" bg="#D7E3F4" />
      <HStack gap="12px">
        <UsersRound size={24} color={colors.primary} />
        <Box>
          <Text color={colors.primaryText} fontSize={{ base: "20px", xl: "16px", "2xl": "20px" }} fontWeight="800" lineHeight="1">
            1.2k+
          </Text>
          <Text color={colors.secondaryText} fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="600" mt={{ base: "7px", xl: "5px", "2xl": "7px" }}>
            Employees helped
          </Text>
        </Box>
      </HStack>
      <Button h={{ base: "48px", xl: "40px", "2xl": "48px" }} bg={colors.primary} color={colors.surface} borderRadius="7px" fontSize={{ base: "14px", xl: "12px", "2xl": "14px" }} fontWeight="800" _hover={{ bg: "#1668BA" }}>
        Get Support
        <ArrowRight size={17} />
      </Button>
    </Grid>
  );
}
