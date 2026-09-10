"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { Badge, Box, Button, Flex, Grid, HStack, IconButton, Text, Textarea, VStack } from "@chakra-ui/react";
import {
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  HeartPulse,
  MessageCircle,
  Star,
  User,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cardBorder, colors } from "@/types/styles";

type ReportsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ReportStatus = "Reviewed" | "Pending";

type SurveyReport = {
  id: string;
  title: string;
  date: string;
  status: ReportStatus;
  icon: LucideIcon;
  response: {
    ratingQuestion: string;
    rating: string;
    ratingText: string;
    challengeQuestion: string;
    challengeText: string;
  };
  manager: {
    name: string;
    date: string;
    avatar: string;
    priority: "High Priority" | "Medium Priority" | "Low Priority";
    message: string;
    actionPlan: string[];
  };
};

type ReportComment = {
  id: string;
  text: string;
  timestamp: string;
};

const reports: SurveyReport[] = [
  {
    id: "q4-wellness",
    title: "Q4 2024 Wellness Check-in",
    date: "Oct 15, 2024",
    status: "Reviewed",
    icon: HeartPulse,
    response: {
      ratingQuestion: "How would you rate your current work-life balance?",
      rating: "2 / 5",
      ratingText: "Struggling with long hours and tight deadlines.",
      challengeQuestion: "What challenges are you facing?",
      challengeText: "Working late nights frequently due to project deadlines. Finding it difficult to disconnect after work hours.",
    },
    manager: {
      name: "Sarah Johnson",
      date: "Oct 18, 2024",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
      priority: "High Priority",
      message:
        "Thank you for sharing your concerns. I understand the pressure you've been under with the recent project deadlines. Your wellbeing is a priority, and we need to address this immediately.",
      actionPlan: [
        "Redistribute tasks within the team to balance workload",
        "Implement no-meeting Fridays for focused work",
        "Enroll you in stress management workshop",
        "Set up bi-weekly 1-on-1 check-ins",
      ],
    },
  },
  {
    id: "engagement",
    title: "Employee Engagement Survey",
    date: "Oct 20, 2024",
    status: "Reviewed",
    icon: Users,
    response: {
      ratingQuestion: "How engaged do you feel with your current projects?",
      rating: "4 / 5",
      ratingText: "Generally engaged and ready for more challenging work.",
      challengeQuestion: "What would increase your engagement at work?",
      challengeText: "More opportunities to work on innovative projects, learn new technologies, and take leadership responsibility.",
    },
    manager: {
      name: "Sarah Johnson",
      date: "Oct 22, 2024",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
      priority: "Medium Priority",
      message: "Your growth mindset is clear. Let's align upcoming project opportunities with your technical strengths and leadership goals.",
      actionPlan: [
        "Assign you as technical lead for the AI integration project",
        "Sponsor advanced cloud architecture certification",
        "Include you in architecture review meetings",
        "Pair you with two junior team members for mentoring",
      ],
    },
  },
  {
    id: "career-growth",
    title: "Career Growth Survey",
    date: "Sep 12, 2024",
    status: "Pending",
    icon: BarChart3,
    response: {
      ratingQuestion: "How confident are you about your career path?",
      rating: "3 / 5",
      ratingText: "Clear on the next step, but would like more structured guidance.",
      challengeQuestion: "What support would help most?",
      challengeText: "A clearer learning roadmap, project exposure, and recurring feedback on senior-level expectations.",
    },
    manager: {
      name: "Sarah Johnson",
      date: "Review pending",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
      priority: "Medium Priority",
      message: "Manager review has not been submitted yet.",
      actionPlan: ["Review career aspiration", "Map target competencies", "Confirm next check-in"],
    },
  },
  {
    id: "culture",
    title: "Workplace Culture Survey",
    date: "Jun 18, 2024",
    status: "Reviewed",
    icon: Star,
    response: {
      ratingQuestion: "How connected do you feel to the team culture?",
      rating: "5 / 5",
      ratingText: "Strong sense of belonging and support from peers.",
      challengeQuestion: "What should we continue doing?",
      challengeText: "Transparent communication, knowledge-sharing sessions, and cross-team collaboration rituals.",
    },
    manager: {
      name: "Sarah Johnson",
      date: "Jun 21, 2024",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
      priority: "Low Priority",
      message: "Thank you for the positive feedback. We'll continue investing in collaboration and team rituals.",
      actionPlan: ["Continue monthly demos", "Keep mentorship circles active", "Share feedback with People Success"],
    },
  },
  {
    id: "culturee",
    title: "Workplace Culture Survey",
    date: "Jun 18, 2024",
    status: "Reviewed",
    icon: Star,
    response: {
      ratingQuestion: "How connected do you feel to the team culture?",
      rating: "5 / 5",
      ratingText: "Strong sense of belonging and support from peers.",
      challengeQuestion: "What should we continue doing?",
      challengeText: "Transparent communication, knowledge-sharing sessions, and cross-team collaboration rituals.",
    },
    manager: {
      name: "Sarah Johnson",
      date: "Jun 21, 2024",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
      priority: "Low Priority",
      message: "Thank you for the positive feedback. We'll continue investing in collaboration and team rituals.",
      actionPlan: ["Continue monthly demos", "Keep mentorship circles active", "Share feedback with People Success"],
    },
  },
  {
    id: "cultureee",
    title: "Workplace Culture Survey",
    date: "Jun 18, 2024",
    status: "Reviewed",
    icon: Star,
    response: {
      ratingQuestion: "How connected do you feel to the team culture?",
      rating: "5 / 5",
      ratingText: "Strong sense of belonging and support from peers.",
      challengeQuestion: "What should we continue doing?",
      challengeText: "Transparent communication, knowledge-sharing sessions, and cross-team collaboration rituals.",
    },
    manager: {
      name: "Sarah Johnson",
      date: "Jun 21, 2024",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
      priority: "Low Priority",
      message: "Thank you for the positive feedback. We'll continue investing in collaboration and team rituals.",
      actionPlan: ["Continue monthly demos", "Keep mentorship circles active", "Share feedback with People Success"],
    },
  },
  {
    id: "cultur",
    title: "Workplace Culture Survey",
    date: "Jun 18, 2024",
    status: "Reviewed",
    icon: Star,
    response: {
      ratingQuestion: "How connected do you feel to the team culture?",
      rating: "5 / 5",
      ratingText: "Strong sense of belonging and support from peers.",
      challengeQuestion: "What should we continue doing?",
      challengeText: "Transparent communication, knowledge-sharing sessions, and cross-team collaboration rituals.",
    },
    manager: {
      name: "Sarah Johnson",
      date: "Jun 21, 2024",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
      priority: "Low Priority",
      message: "Thank you for the positive feedback. We'll continue investing in collaboration and team rituals.",
      actionPlan: ["Continue monthly demos", "Keep mentorship circles active", "Share feedback with People Success"],
    },
  },
  {
    id: "cultureeeeeee",
    title: "Workplace Culture Survey",
    date: "Jun 18, 2024",
    status: "Reviewed",
    icon: Star,
    response: {
      ratingQuestion: "How connected do you feel to the team culture?",
      rating: "5 / 5",
      ratingText: "Strong sense of belonging and support from peers.",
      challengeQuestion: "What should we continue doing?",
      challengeText: "Transparent communication, knowledge-sharing sessions, and cross-team collaboration rituals.",
    },
    manager: {
      name: "Sarah Johnson",
      date: "Jun 21, 2024",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
      priority: "Low Priority",
      message: "Thank you for the positive feedback. We'll continue investing in collaboration and team rituals.",
      actionPlan: ["Continue monthly demos", "Keep mentorship circles active", "Share feedback with People Success"],
    },
  },
];

const statusStyles: Record<ReportStatus, { bg: string; color: string; icon: LucideIcon }> = {
  Reviewed: { bg: "#DDF6EA", color: "#2B9D74", icon: CheckCircle2 },
  Pending: { bg: "#E7F0FC", color: "#2169B8", icon: Clock },
};

export function ReportsModal({ isOpen, onClose }: ReportsModalProps) {
  const [selectedReportId, setSelectedReportId] = useState(reports[0].id);
  const [acceptedReports, setAcceptedReports] = useState<string[]>([]);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [commentsByReport, setCommentsByReport] = useState<Record<string, ReportComment[]>>({});
  const selectedReport = useMemo(
    () => reports.find((report) => report.id === selectedReportId) || reports[0],
    [selectedReportId],
  );
  const isAccepted = acceptedReports.includes(selectedReport.id);
  const selectedComments = commentsByReport[selectedReport.id] || [];

  if (!isOpen) {
    return null;
  }

  const handleAccept = () => {
    setAcceptedReports((currentReports) =>
      currentReports.includes(selectedReport.id) ? currentReports : [...currentReports, selectedReport.id],
    );
  };

  const handleSubmitComment = () => {
    const nextComment = comment.trim();

    if (!nextComment) {
      return;
    }

    setCommentsByReport((currentComments) => ({
      ...currentComments,
      [selectedReport.id]: [
        ...(currentComments[selectedReport.id] || []),
        {
          id: `${selectedReport.id}-${Date.now()}`,
          text: nextComment,
          timestamp: new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        },
      ],
    }));
    setComment("");
  };

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
      px={{ base: "14px", md: "22px", xl: "24px", "2xl": "34px" }}
      py={{ base: "18px", md: "22px", xl: "26px", "2xl": "34px" }}
      overflowY="auto"
      onClick={onClose}
    >
      <Box
        bg={colors.surface}
        border="1px solid rgba(222, 229, 240, 0.94)"
        borderRadius="8px"
        boxShadow="0 34px 86px rgba(14, 25, 44, 0.34)"
        w="full"
        maxW={{ base: "100%", xl: "1280px", "2xl": "1500px" }}
        maxH={{ base: "none", xl: "88vh" }}
        overflow="hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <Box maxH={{ base: "none", xl: "88vh" }} overflowY="auto">
          <Flex align="center" justify="space-between" gap="18px" px={{ base: "22px", xl: "24px", "2xl": "28px" }} py={{ base: "20px", xl: "18px", "2xl": "24px" }}>
            <HStack gap={{ base: "16px", xl: "14px", "2xl": "18px" }} minW={0}>
              <Flex
                w={{ base: "54px", xl: "48px", "2xl": "56px" }}
                h={{ base: "54px", xl: "48px", "2xl": "56px" }}
                borderRadius="13px"
                bg={colors.primarySoft}
                color={colors.primary}
                align="center"
                justify="center"
                flexShrink={0}
              >
                <FileText size={24} strokeWidth={2.1} />
              </Flex>
              <Box minW={0}>
                <Text as="h2" color="#092558" fontSize={{ base: "22px", xl: "20px", "2xl": "24px" }} fontWeight="800" lineHeight="1.05">
                  Survey Responses
                </Text>
                <Text color="#53698F" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="600" mt="8px">
                  Your feedback and manager responses
                </Text>
              </Box>
            </HStack>

            <IconButton aria-label="Close reports" variant="ghost" h="40px" w="40px" minW="40px" borderRadius="6px" color="#355785" _hover={{ bg: "#F3F7FD" }} onClick={onClose}>
              <X size={22} strokeWidth={1.9} />
            </IconButton>
          </Flex>

          <Grid templateColumns={{ base: "1fr", lg: "330px minmax(0, 1fr)", xl: "330px minmax(0, 1fr)", "2xl": "390px minmax(0, 1fr)" }} gap={{ base: "14px", xl: "14px", "2xl": "18px" }} px={{ base: "22px", xl: "24px", "2xl": "28px" }} pb={{ base: "22px", xl: "20px", "2xl": "28px" }}>
            <SurveyHistoryPanel selectedReportId={selectedReport.id} onSelect={setSelectedReportId} acceptedReports={acceptedReports} />
            <ReportDetailPanel
              report={selectedReport}
              isAccepted={isAccepted}
              isCommentOpen={isCommentOpen}
              comment={comment}
              comments={selectedComments}
              onCommentChange={setComment}
              onSubmitComment={handleSubmitComment}
              onToggleComment={() => setIsCommentOpen((isOpen) => !isOpen)}
              onAccept={handleAccept}
            />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

function SurveyHistoryPanel({
  selectedReportId,
  onSelect,
  acceptedReports,
}: {
  selectedReportId: string;
  onSelect: (reportId: string) => void;
  acceptedReports: string[];
}) {
  return (
    <Box
      bg={colors.surface}
      border={cardBorder}
      borderColor="#DCE6F4"
      borderRadius="8px"
      overflow="hidden"
      h={{ base: "auto", lg: "676px", xl: "604px", "2xl": "736px" }}
      maxH={{ base: "360px", lg: "676px", xl: "604px", "2xl": "736px" }}
      display="flex"
      flexDirection="column"
    >
      <HStack gap="10px" px={{ base: "18px", xl: "16px", "2xl": "22px" }} py={{ base: "18px", xl: "15px", "2xl": "20px" }} flexShrink={0}>
        <Text color="#092558" fontSize={{ base: "16px", xl: "14px", "2xl": "17px" }} fontWeight="800">
          Survey History
        </Text>
        <Box bg="#E8F1FC" color="#486489" borderRadius="full" px="8px" py="3px" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="800" lineHeight="1">
          {reports.length}
        </Box>
      </HStack>

      <VStack align="stretch" gap="0" overflowY="auto" flex="1" minH={0}>
        {reports.map((report) => (
          <HistoryItem key={report.id} report={report} isSelected={report.id === selectedReportId} isAccepted={acceptedReports.includes(report.id)} onSelect={() => onSelect(report.id)} />
        ))}
      </VStack>
    </Box>
  );
}

function HistoryItem({
  report,
  isSelected,
  isAccepted,
  onSelect,
}: {
  report: SurveyReport;
  isSelected: boolean;
  isAccepted: boolean;
  onSelect: () => void;
}) {
  const Icon = report.icon;

  return (
    <Box
      as="button"
      textAlign="left"
      w="full"
      borderTop="1px solid"
      borderColor="#EEF1F5"
      borderLeft="3px solid"
      borderLeftColor={isSelected ? "#216DFF" : "transparent"}
      bg={isSelected ? "#F1F7FF" : colors.surface}
      px={{ base: "18px", xl: "16px", "2xl": "22px" }}
      py={{ base: "18px", xl: "15px", "2xl": "20px" }}
      _hover={{ bg: "#F7FAFF" }}
      onClick={onSelect}
    >
      <HStack align="flex-start" gap={{ base: "14px", xl: "12px", "2xl": "16px" }}>
        <IconTile icon={Icon} />
        <Box minW={0}>
          <Text color="#1E365F" fontSize={{ base: "14px", xl: "13px", "2xl": "16px" }} fontWeight="800" lineHeight="1.2">
            {report.title}
          </Text>
          <Text color="#7690B4" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="600" mt="8px">
            {report.date}
          </Text>
          <StatusBadge status={isAccepted ? "Reviewed" : report.status} mt="12px" />
        </Box>
      </HStack>
    </Box>
  );
}

function ReportDetailPanel({
  report,
  isAccepted,
  isCommentOpen,
  comment,
  comments,
  onCommentChange,
  onSubmitComment,
  onToggleComment,
  onAccept,
}: {
  report: SurveyReport;
  isAccepted: boolean;
  isCommentOpen: boolean;
  comment: string;
  comments: ReportComment[];
  onCommentChange: (value: string) => void;
  onSubmitComment: () => void;
  onToggleComment: () => void;
  onAccept: () => void;
}) {
  const handleCommentKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmitComment();
    }
  };

  return (
    <Box bg={colors.surface} border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" minH={{ base: "auto", xl: "604px", "2xl": "736px" }} overflow="hidden">
      <VStack align="stretch" gap="0" h="full">
        <Flex align={{ base: "flex-start", xl: "center" }} justify="space-between" gap="18px" px={{ base: "18px", xl: "20px", "2xl": "28px" }} py={{ base: "18px", xl: "16px", "2xl": "24px" }} flexWrap={{ base: "wrap", lg: "nowrap" }}>
          <HStack gap={{ base: "16px", xl: "14px", "2xl": "20px" }} minW={0}>
            <IconTile icon={report.icon} size="52px" />
            <Box minW={0}>
              <Text color="#092558" fontSize={{ base: "18px", xl: "15px", "2xl": "18px" }} fontWeight="800" lineHeight="1.15">
                {report.title}
              </Text>
              <Text color="#7690B4" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="600" mt="8px">
                Submitted on {report.date} <Text as="span" mx="8px">•</Text> {isAccepted ? "Accepted" : report.status}
              </Text>
            </Box>
          </HStack>
          <StatusSteps isPending={report.status === "Pending"} isAccepted={isAccepted} />
        </Flex>

        <Box flex="1" px={{ base: "18px", xl: "20px", "2xl": "28px" }} pb={{ base: "18px", xl: "14px", "2xl": "20px" }}>
          <Box border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" p={{ base: "16px", xl: "14px", "2xl": "18px" }}>
            <ResponseBlock report={report} />
            <ManagerResponse report={report} />
            {isCommentOpen ? (
              <CommentPanel
                comment={comment}
                comments={comments}
                onCommentChange={onCommentChange}
                onKeyDown={handleCommentKeyDown}
                onSubmitComment={onSubmitComment}
              />
            ) : null}
          </Box>
        </Box>

        <HStack justify="flex-end" gap="12px" px={{ base: "18px", xl: "20px", "2xl": "28px" }} py={{ base: "16px", xl: "13px", "2xl": "18px" }} borderTop="1px solid" borderColor="#EEF1F5">
          <Button h={{ base: "42px", xl: "36px", "2xl": "44px" }} px={{ base: "18px", xl: "15px", "2xl": "20px" }} bg={colors.surface} border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" color="#216DFF" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="800" _hover={{ bg: "#F7FAFF" }} onClick={onToggleComment}>
            <MessageCircle size={17} />
            Add Comment
          </Button>
          <Button h={{ base: "42px", xl: "36px", "2xl": "44px" }} px={{ base: "18px", xl: "15px", "2xl": "22px" }} bg={isAccepted ? "#39BA85" : "#3A75F6"} color={colors.surface} borderRadius="8px" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="800" _hover={{ bg: isAccepted ? "#2FA574" : "#2864E5" }} onClick={onAccept}>
            <Check size={17} />
            {isAccepted ? "Accepted" : "Accept Response"}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

function CommentPanel({
  comment,
  comments,
  onCommentChange,
  onKeyDown,
  onSubmitComment,
}: {
  comment: string;
  comments: ReportComment[];
  onCommentChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmitComment: () => void;
}) {
  return (
    <Box mt={{ base: "16px", xl: "12px", "2xl": "16px" }} border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" bg="#FBFDFF" overflow="hidden">
      <VStack
        align="stretch"
        gap="12px"
        maxH={{ base: "220px", xl: "172px", "2xl": "220px" }}
        overflowY="auto"
        p={{ base: "14px", xl: "12px", "2xl": "14px" }}
        css={{
          scrollbarWidth: "thin",
          scrollbarColor: "#CFE1FA transparent",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#D7E6F8",
            borderRadius: "999px",
          },
        }}
      >
        <Box position="relative">
          <Textarea
            value={comment}
            onChange={(event) => onCommentChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Add a comment for your manager..."
            h={{ base: "82px", xl: "68px", "2xl": "82px" }}
            minH={{ base: "82px", xl: "68px", "2xl": "82px" }}
            resize="none"
            borderColor="#DCE6F4"
            borderRadius="8px"
            bg={colors.surface}
            pr="82px"
            fontSize={{ base: "13px", xl: "12px", "2xl": "13px" }}
            _focus={{ borderColor: colors.primary, boxShadow: "0 0 0 3px rgba(29, 127, 227, 0.08)" }}
          />
          <Button
            position="absolute"
            right="10px"
            bottom="10px"
            h={{ base: "30px", xl: "28px", "2xl": "30px" }}
            px="12px"
            bg="#E7F0FC"
            color="#216DFF"
            borderRadius="6px"
            fontSize="11px"
            fontWeight="800"
            _hover={{ bg: "#D8E9FF" }}
            onClick={onSubmitComment}
          >
            Enter
          </Button>
        </Box>

        {comments.map((item) => (
          <Box key={item.id} alignSelf="flex-end" maxW="86%" bg="#E7F0FC" border="1px solid" borderColor="#CFE1FA" borderRadius="10px" px="12px" py="10px">
            <Text color="#1E365F" fontSize={{ base: "12px", xl: "11px", "2xl": "12px" }} fontWeight="700" lineHeight="1.45">
              {item.text}
            </Text>
            <Text color="#7690B4" fontSize="10px" fontWeight="700" mt="6px" textAlign="right">
              {item.timestamp}
            </Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

function ResponseBlock({ report }: { report: SurveyReport }) {
  return (
    <Box border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" bg="#FBFDFF" p={{ base: "16px", xl: "13px", "2xl": "18px" }}>
      <HStack gap="12px" mb={{ base: "14px", xl: "12px", "2xl": "16px" }}>
        <User size={18} color="#43618D" />
        <Text color="#1E365F" fontSize={{ base: "15px", xl: "13px", "2xl": "17px" }} fontWeight="800">
          Your Response
        </Text>
      </HStack>

      <Box border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" bg="#F7FBFF" px={{ base: "16px", xl: "14px", "2xl": "20px" }} py={{ base: "14px", xl: "12px", "2xl": "16px" }}>
        <Text color="#2B4167" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="800">
          {report.response.ratingQuestion}
        </Text>
        <Box display="inline-flex" mt="10px" bg="#E7F0FC" color="#216DFF" borderRadius="999px" px="10px" py="3px" fontSize={{ base: "12px", xl: "11px", "2xl": "13px" }} fontWeight="800">
          {report.response.rating}
        </Box>
        <Text color="#53698F" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="600" mt="10px">
          {report.response.ratingText}
        </Text>

        <Box h="1px" bg="#E7EDF6" my={{ base: "18px", xl: "13px", "2xl": "20px" }} />

        <Text color="#2B4167" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="800">
          {report.response.challengeQuestion}
        </Text>
        <Text color="#53698F" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="600" mt="10px" lineHeight="1.55">
          {report.response.challengeText}
        </Text>
      </Box>
    </Box>
  );
}

function ManagerResponse({ report }: { report: SurveyReport }) {
  const isHigh = report.manager.priority === "High Priority";

  return (
    <Box mt={{ base: "18px", xl: "14px", "2xl": "20px" }} border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" bg="#F7FBFF" px={{ base: "16px", xl: "14px", "2xl": "20px" }} py={{ base: "16px", xl: "13px", "2xl": "18px" }}>
      <Flex align="flex-start" justify="space-between" gap="18px">
        <HStack align="center" gap="13px">
          <Box as="img" src={report.manager.avatar} alt="" w={{ base: "44px", xl: "38px", "2xl": "50px" }} h={{ base: "44px", xl: "38px", "2xl": "50px" }} borderRadius="full" objectFit="cover" />
          <Box>
            <Text color="#1E365F" fontSize={{ base: "15px", xl: "13px", "2xl": "17px" }} fontWeight="800">
              Manager Response
            </Text>
            <Text color="#7690B4" fontSize={{ base: "12px", xl: "11px", "2xl": "13px" }} fontWeight="600" mt="6px">
              {report.manager.name} <Text as="span" mx="7px">•</Text> {report.manager.date}
            </Text>
          </Box>
        </HStack>
        <HStack gap="9px" color={isHigh ? "#E84E5B" : "#D9822B"} fontSize={{ base: "12px", xl: "11px", "2xl": "13px" }} fontWeight="800" flexShrink={0}>
          <Box w="9px" h="9px" borderRadius="full" bg={isHigh ? "#F35B67" : "#FDB83F"} />
          <Text>{report.manager.priority}</Text>
        </HStack>
      </Flex>

      <Text color="#53698F" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="600" lineHeight="1.65" mt={{ base: "18px", xl: "13px", "2xl": "18px" }}>
        {report.manager.message}
      </Text>

      <Box mt={{ base: "16px", xl: "12px", "2xl": "16px" }} border={cardBorder} borderColor="#DCE6F4" borderRadius="8px" bg={colors.surface} px={{ base: "14px", xl: "12px", "2xl": "16px" }} py={{ base: "14px", xl: "12px", "2xl": "16px" }}>
        <HStack gap="10px" mb={{ base: "12px", xl: "10px", "2xl": "14px" }}>
          <ClipboardList size={17} color="#43618D" />
          <Text color="#1E365F" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="800">
            Action Plan
          </Text>
        </HStack>
        <VStack align="stretch" gap={{ base: "10px", xl: "7px", "2xl": "10px" }}>
          {report.manager.actionPlan.map((item, index) => (
            <HStack key={item} gap="12px">
              <Box w={{ base: "22px", xl: "19px", "2xl": "22px" }} h={{ base: "22px", xl: "19px", "2xl": "22px" }} borderRadius="full" bg="#E7F0FC" color="#216DFF" display="flex" alignItems="center" justifyContent="center" fontSize={{ base: "12px", xl: "10px", "2xl": "12px" }} fontWeight="800" flexShrink={0}>
                {index + 1}
              </Box>
              <Text color="#53698F" fontSize={{ base: "13px", xl: "12px", "2xl": "14px" }} fontWeight="600">
                {item}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Box>
  );
}

function StatusSteps({ isPending, isAccepted }: { isPending: boolean; isAccepted: boolean }) {
  const steps = [
    { label: "Submitted", complete: true },
    { label: "Reviewed", complete: !isPending },
    { label: "Action Planned", complete: isAccepted },
  ];

  return (
    <HStack gap="0" minW={{ base: "100%", lg: "360px", "2xl": "420px" }} justify="space-between">
      {steps.map((step, index) => (
        <HStack key={step.label} gap="0" flex="1" justify={index === 0 ? "flex-start" : index === steps.length - 1 ? "flex-end" : "center"} position="relative">
          {index > 0 ? <Box position="absolute" left="-50%" right="50%" top="9px" h="1px" bg="#DCE6F4" /> : null}
          <VStack gap="8px" position="relative" zIndex={1}>
            <Box w="18px" h="18px" borderRadius="full" bg={step.complete ? "#52B88C" : colors.surface} border="3px solid" borderColor={step.complete ? "#52B88C" : "#2F7CF6"} display="flex" alignItems="center" justifyContent="center">
              {step.complete ? <Check size={11} color={colors.surface} strokeWidth={3} /> : null}
            </Box>
            <Text color="#315077" fontSize={{ base: "11px", xl: "10px", "2xl": "12px" }} fontWeight="700" whiteSpace="nowrap">
              {step.label}
            </Text>
          </VStack>
        </HStack>
      ))}
    </HStack>
  );
}

function StatusBadge({ status, mt }: { status: ReportStatus; mt?: string }) {
  const style = statusStyles[status];
  const Icon = style.icon;

  return (
    <HStack display="inline-flex" gap="6px" bg={style.bg} color={style.color} borderRadius="999px" px="10px" py="5px" mt={mt}>
      <Icon size={13} strokeWidth={2.4} />
      <Text fontSize={{ base: "12px", xl: "11px", "2xl": "13px" }} fontWeight="800" lineHeight="1">
        {status}
      </Text>
    </HStack>
  );
}

function IconTile({ icon: Icon, size = "46px" }: { icon: LucideIcon; size?: string }) {
  return (
    <Flex w={{ base: size, xl: "40px", "2xl": size }} h={{ base: size, xl: "40px", "2xl": size }} minW={{ base: size, xl: "40px", "2xl": size }} align="center" justify="center" borderRadius="10px" bg={colors.primarySoft} color={colors.primary}>
      <Icon size={21} strokeWidth={2.1} />
    </Flex>
  );
}
