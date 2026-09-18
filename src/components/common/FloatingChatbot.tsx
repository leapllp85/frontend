"use client";

import { useState } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";

const hiddenPaths = new Set(["/login", "/chat"]);

export function FloatingChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (hiddenPaths.has(pathname)) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <Box
          position="fixed"
          right={{ base: "14px", md: "22px" }}
          bottom={{ base: "78px", md: "88px" }}
          zIndex={9998}
          w={{ base: "calc(100vw - 28px)", md: "430px", xl: "460px" }}
          h={{ base: "min(680px, calc(100vh - 118px))", md: "640px" }}
          maxH="calc(100vh - 118px)"
          bg="#FFFFFF"
          border="1px solid #E6EAF0"
          borderRadius="16px"
          boxShadow="0 24px 70px rgba(11, 12, 28, 0.18)"
          overflow="hidden"
        >
          <HStack
            h="54px"
            px="16px"
            justify="space-between"
            bg="#FFFFFF"
            borderBottom="1px solid #EEF1F5"
          >
            <HStack gap="10px">
              <Box
                w="32px"
                h="32px"
                borderRadius="10px"
                bg="#E7F0FC"
                color="#1D7FE3"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <MessageCircle size={17} />
              </Box>
              <Text color="#0B0C1C" fontSize="13px" fontWeight="800">
                Clyra Assistant
              </Text>
            </HStack>

            <Box
              as="button"
              type="button"
              aria-label="Close chatbot"
              onClick={() => setIsOpen(false)}
              w="34px"
              h="34px"
              borderRadius="10px"
              color="#3D4B68"
              display="flex"
              alignItems="center"
              justifyContent="center"
              _hover={{ bg: "#F3F7FD", color: "#1D7FE3" }}
            >
              <X size={18} />
            </Box>
          </HStack>

          <Box position="relative" h="calc(100% - 54px)" overflow="hidden">
            <iframe
              src="/chat?embed=true"
              width="100%"
              height="100%"
              style={{
                border: "none",
                display: "block",
                width: "100%",
                height: "100%",
              }}
              title="Clyra AI Chat"
            />
          </Box>
        </Box>
      )}

      <Box
        as="button"
        type="button"
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        position="fixed"
        right={{ base: "18px", md: "24px" }}
        bottom={{ base: "18px", md: "22px" }}
        zIndex={9999}
        w={{ base: "58px", md: "64px" }}
        h={{ base: "58px", md: "64px" }}
        borderRadius="full"
        bg="transparent"
        color="#FFFFFF"
        border="0"
        boxShadow="none"
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        animation={isOpen ? undefined : "chatbotPetFloat 2.7s ease-in-out infinite"}
        transition="transform 0.2s ease"
        _hover={{
          transform: "translateY(-2px)",
        }}
        onClick={() => setIsOpen((current) => !current)}
        css={{
          "@keyframes chatbotPetFloat": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-7px)" },
          },
          "@keyframes chatbotEarWiggle": {
            "0%, 100%": { transform: "rotate(0deg)" },
            "50%": { transform: "rotate(8deg)" },
          },
          "@keyframes chatbotBlink": {
            "0%, 88%, 100%": { transform: "scaleY(1)" },
            "92%": { transform: "scaleY(0.16)" },
          },
        }}
      >
        <Box
          position="absolute"
          left="50%"
          bottom="-5px"
          w="42px"
          h="10px"
          borderRadius="full"
          bg="rgba(29, 127, 227, 0.18)"
          filter="blur(2px)"
          transform="translateX(-50%)"
        />

        {isOpen ? (
          <Box
            w="52px"
            h="52px"
            borderRadius="full"
            bg="#0B0C1C"
            color="#FFFFFF"
            boxShadow="0 16px 36px rgba(11, 12, 28, 0.22)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <X size={23} strokeWidth={2.4} />
          </Box>
        ) : (
          <Box position="relative" w="64px" h="64px">
            <Box
              position="absolute"
              left="12px"
              top="5px"
              w="15px"
              h="19px"
              borderRadius="12px 12px 8px 8px"
              bg="#6EA0E6"
              transformOrigin="bottom center"
              animation="chatbotEarWiggle 3s ease-in-out infinite"
              boxShadow="inset 0 -5px 10px rgba(29, 127, 227, 0.22)"
            />
            <Box
              position="absolute"
              right="12px"
              top="5px"
              w="15px"
              h="19px"
              borderRadius="12px 12px 8px 8px"
              bg="#6EA0E6"
              transformOrigin="bottom center"
              animation="chatbotEarWiggle 3s ease-in-out 0.22s infinite"
              boxShadow="inset 0 -5px 10px rgba(29, 127, 227, 0.22)"
            />
            <Box
              position="absolute"
              inset="7px"
              borderRadius="21px"
              bg="linear-gradient(145deg, #1D7FE3 0%, #5F7BF3 100%)"
              border="1px solid rgba(255, 255, 255, 0.78)"
              boxShadow="0 18px 38px rgba(29, 127, 227, 0.32), inset 0 1px 0 rgba(255,255,255,0.42)"
              overflow="hidden"
            >
              <Box position="absolute" left="9px" top="8px" w="16px" h="8px" borderRadius="full" bg="rgba(255,255,255,0.22)" transform="rotate(-24deg)" />
              <Box
                position="absolute"
                left="12px"
                right="12px"
                top="17px"
                h="24px"
                borderRadius="12px"
                bg="rgba(255,255,255,0.94)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="8px"
              >
                <Box w="6px" h="8px" borderRadius="full" bg="#0B0C1C" animation="chatbotBlink 4.4s ease-in-out infinite" />
                <Box w="6px" h="8px" borderRadius="full" bg="#0B0C1C" animation="chatbotBlink 4.4s ease-in-out infinite" />
              </Box>
              <Box position="absolute" left="26px" top="36px" w="8px" h="3px" borderRadius="full" bg="rgba(255,255,255,0.86)" />
            </Box>
            <Box
              position="absolute"
              right="2px"
              bottom="7px"
              w="24px"
              h="24px"
              borderRadius="full"
              bg="#FFFFFF"
              color="#1D7FE3"
              border="1px solid #C9DDF6"
              boxShadow="0 8px 18px rgba(11,12,28,0.12)"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <MessageCircle size={13} strokeWidth={2.5} />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
