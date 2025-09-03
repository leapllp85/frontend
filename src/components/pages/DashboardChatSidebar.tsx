import { Box, Button, Flex, Input, Text, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { chatApi } from "../../services/chatApi";
import { RAGApiResponse } from "../../types/ragApi";

interface DashboardChatSidebarProps {
    handleAiResponse: (response: string | RAGApiResponse, question?: string) => void;
    handleLoading: (loading: boolean) => void;
    handleError?: (error: string) => void;
    setHasQueried: (hasQueried: boolean) => void;
    setTeamCriticalityView: (teamCriticalityView: boolean) => void;
    hasQueried: boolean;
    teamCriticalityView: boolean;
    currentUser: string;
}

export default function DashboardChatSidebar({handleAiResponse, handleLoading, handleError, setHasQueried, setTeamCriticalityView, hasQueried, teamCriticalityView, currentUser}: DashboardChatSidebarProps) {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [activeButton, setActiveButton] = useState<'team-criticality' | 'my-space' | 'my-profile' | null>(null);

    const sendMessageToAPI = async (prompt: string) => {
        try {
            setLocalError(null);
            if (handleError) handleError(''); // Clear parent error
            const userMessage = `${currentUser}: ${prompt}`;
            const response = await chatApi.sendMessage(userMessage);
            console.log(response);
            handleAiResponse(response.response, prompt);
        } catch (err) {
            console.error('Chat API error:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
            setLocalError(errorMessage);
            handleError?.(errorMessage);
            handleAiResponse('Sorry, I encountered an error. Please try again.', prompt);
        }
    }

    const handleSendMessage = async () => {
        if (message.trim() && !isLoading) {
            setIsLoading(true);
            handleLoading(true)
            const userMessage = message.trim();
            setMessage("");
            await sendMessageToAPI(userMessage);
            handleLoading(false)
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isLoading) {
            handleSendMessage();
        }
    };

    return (
        <Flex
            w="full"
            direction="column"
            justify="space-between"
            className="bg-gradient-to-br from-[#c26cb8] via-[#a84da1] to-[#8e2c8a]"
            color="white"
            p={6}
            h="full"
            position="relative"
        >
            {/* Main Content Area */}
            <Box flex="1" display="flex" flexDirection="column">
                <Text fontSize="xl" fontWeight="bold" mb={8} lineHeight="1.4">
                    Hi {currentUser}, what can I help you with today?
                </Text>
                {/* Quick Action Buttons */}
                <Flex direction="column" gap={3} mb={6}>
                    <Button 
                        bg={teamCriticalityView ? "white" : "whiteAlpha.200"}
                        color={teamCriticalityView ? "purple.600" : "white"}
                        border={teamCriticalityView ? "2px solid white" : "1px solid whiteAlpha.300"}
                        _hover={teamCriticalityView ? {
                            bg: "gray.50",
                            transform: "none"
                        } : { 
                            bg: "whiteAlpha.300",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}
                        _active={{ transform: "translateY(0)" }}
                        transition="all 0.2s ease"
                        borderRadius="lg"
                        py={6}
                        fontSize="md"
                        fontWeight={teamCriticalityView ? "bold" : "medium"}
                        cursor={teamCriticalityView ? "default" : "pointer"}
                        onClick={() => {
                            if (!teamCriticalityView) {
                                setActiveButton('team-criticality');
                                setTeamCriticalityView(true);
                                setHasQueried(true);
                            }
                        }}
                        disabled={teamCriticalityView}
                    >
                        Team Criticality
                    </Button>
                    <Button 
                        bg={activeButton === 'my-space' ? "white" : "whiteAlpha.200"}
                        color={activeButton === 'my-space' ? "purple.600" : "white"}
                        border={activeButton === 'my-space' ? "2px solid white" : "1px solid whiteAlpha.300"}
                        _hover={activeButton === 'my-space' ? {
                            bg: "gray.50",
                            transform: "none"
                        } : { 
                            bg: "whiteAlpha.300",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}
                        _active={{ transform: "translateY(0)" }}
                        transition="all 0.2s ease"
                        borderRadius="lg"
                        py={6}
                        fontSize="md"
                        fontWeight={activeButton === 'my-space' ? "bold" : "medium"}
                        cursor={activeButton === 'my-space' ? "default" : "pointer"}
                        onClick={() => {
                            if (activeButton !== 'my-space') {
                                setActiveButton('my-space');
                                setTeamCriticalityView(false);
                                setHasQueried(true);
                                handleAiResponse('');
                            }
                        }}
                        disabled={activeButton === 'my-space'}
                    >
                        My Space
                    </Button>
                    <Button 
                        bg={(!hasQueried && !teamCriticalityView) ? "white" : "whiteAlpha.200"}
                        color={(!hasQueried && !teamCriticalityView) ? "purple.600" : "white"}
                        border={(!hasQueried && !teamCriticalityView) ? "2px solid white" : "1px solid whiteAlpha.300"}
                        _hover={(!hasQueried && !teamCriticalityView) ? {
                            bg: "gray.50",
                            transform: "none"
                        } : { 
                            bg: "whiteAlpha.300",
                            transform: "translateY(-1px)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}
                        _active={{ transform: "translateY(0)" }}
                        transition="all 0.2s ease"
                        borderRadius="lg"
                        py={6}
                        fontSize="md"
                        fontWeight={(!hasQueried && !teamCriticalityView) ? "bold" : "medium"}
                        cursor={(!hasQueried && !teamCriticalityView) ? "default" : "pointer"}
                        onClick={() => {
                            if (hasQueried || teamCriticalityView) {
                                setActiveButton('my-profile');
                                setHasQueried(false);
                                setTeamCriticalityView(false);
                            }
                        }}
                        disabled={!hasQueried && !teamCriticalityView}
                    >
                        My Profile
                    </Button>
                </Flex>
            </Box>

            {/* Input Area - Fixed at bottom */}
            <Box>
                <Flex gap={2} alignItems="stretch">
                    <Input
                        placeholder="Send a message"
                        bg="white"
                        color="gray.800"
                        borderRadius="lg"
                        border="none"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                            boxShadow: "0 0 0 2px rgba(255,255,255,0.3)",
                            bg: "white"
                        }}
                        py={3}
                        px={4}
                        fontSize="sm"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button 
                        borderRadius="lg" 
                        bg="whiteAlpha.200" 
                        color="white"
                        border="1px solid whiteAlpha.300"
                        _hover={{ 
                            bg: "whiteAlpha.300",
                            transform: "translateY(-1px)"
                        }}
                        _active={{ transform: "translateY(0)" }}
                        transition="all 0.2s ease"
                        px={6}
                        py={3}
                        minW="60px"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isLoading}
                        loading={isLoading}
                    >
                        {isLoading ? <Spinner size="sm" /> : "Send"}
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}