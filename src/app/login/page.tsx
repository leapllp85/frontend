"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Field,
  Flex,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ArrowRight, BarChart3, Eye, EyeOff, Lock, Mail, ShieldCheck, UsersRound } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { loginWithProfile } from "@/lib/apis/auth";
import { getUserRole } from "@/utils/rbac";

type FormValues = {
  username: string;
  password: string;
};

const brandBlue = "#1D7FE3";
const deepBlue = "#08265F";
const mutedBlue = "#6D82AE";
const borderBlue = "#D9E7F8";

function BrandMark() {
  return (
    <Box w="42px" h="42px" position="relative" flexShrink={0}>
      <Box position="absolute" left="1px" bottom="4px" w="15px" h="30px" borderRadius="9px" bg="#226DDD" transform="rotate(28deg)" />
      <Box position="absolute" left="14px" top="3px" w="15px" h="36px" borderRadius="9px" bg="#63A8FF" transform="rotate(-28deg)" />
      <Box position="absolute" right="2px" bottom="4px" w="15px" h="30px" borderRadius="9px" bg={brandBlue} transform="rotate(-28deg)" />
    </Box>
  );
}

function FeaturePill({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <HStack gap="12px" minW={0}>
      <Flex
        w={{ base: "40px", xl: "42px", "2xl": "46px" }}
        h={{ base: "40px", xl: "42px", "2xl": "46px" }}
        borderRadius={{ base: "14px", "2xl": "16px" }}
        bg="rgba(231,240,252,0.9)"
        border="1px solid rgba(217,231,248,0.9)"
        color={brandBlue}
        align="center"
        justify="center"
        flexShrink={0}
      >
        {icon}
      </Flex>
      <Box minW={0}>
        <Text color={deepBlue} fontSize={{ base: "12px", "2xl": "13px" }} fontWeight="800" lineHeight="1.15">
          {title}
        </Text>
        <Text color={mutedBlue} fontSize={{ base: "11px", "2xl": "12px" }} fontWeight="700" mt="2px" lineHeight="1.2">
          {subtitle}
        </Text>
      </Box>
    </HStack>
  );
}

function TeamJourneyIllustration() {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const nodes = [
    { x: 150, y: 204, name: "A", width: 102, delay: 1.05 },
    { x: 270, y: 150, name: "M", width: 114, delay: 1.35 },
    { x: 405, y: 107, name: "R", width: 112, delay: 1.65 },
    { x: 515, y: 52, name: "✓", width: 104, delay: 1.95 },
  ];

  return (
    <Box
      position="relative"
      h={{ base: "200px", md: "clamp(195px, 26vh, 250px)", xl: "clamp(210px, 28vh, 280px)", "2xl": "clamp(255px, 32vh, 325px)" }}
      mt={{ base: 5, lg: 4, xl: 5, "2xl": 8 }}
      maxW="690px"
      overflow="hidden"
      aria-label="Animated growth path showing team wellbeing progress"
    >
      <Box
        as={motion.div}
        position="absolute"
        inset="0"
        animation={shouldAnimate ? "ambientFloat 8s ease-in-out 3.2s infinite" : undefined}
      >
        <svg viewBox="0 0 640 310" width="100%" height="100%" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="loginHill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#DDECFB" />
            </linearGradient>
            <linearGradient id="loginHillSoft" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F8FBFF" />
              <stop offset="100%" stopColor="#ECF5FF" />
            </linearGradient>
            <linearGradient id="loginPath" x1="60" y1="250" x2="540" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B9D9F8" />
              <stop offset="52%" stopColor="#69ACEB" />
              <stop offset="100%" stopColor="#1D7FE3" />
            </linearGradient>
            <filter id="loginGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d="M12 292 C92 257 147 268 226 231 C309 192 358 200 434 146 C514 90 566 86 628 62 L628 310 L12 310 Z" fill="url(#loginHillSoft)" opacity="0.72" />
          <path d="M92 292 C182 246 244 274 338 224 C430 174 465 151 550 105 C593 82 617 73 638 64 L638 310 L92 310 Z" fill="url(#loginHill)" opacity="0.64" />
          <path d="M28 280 C114 250 158 263 238 224 C328 181 374 191 459 133 C522 90 578 88 620 60" fill="none" stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" opacity="0.62" />
          <path d="M28 280 C114 250 158 263 238 224 C328 181 374 191 459 133 C522 90 578 88 620 60" fill="none" stroke="#DCECFB" strokeWidth="8" strokeLinecap="round" opacity="0.56" />
          <motion.path
            d="M28 280 C114 250 158 263 238 224 C328 181 374 191 459 133 C522 90 578 88 620 60"
            fill="none"
            stroke="url(#loginPath)"
            strokeWidth="3.6"
            strokeLinecap="round"
            initial={shouldAnimate ? { pathLength: 0, opacity: 0.2 } : { pathLength: 1, opacity: 1 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: shouldAnimate ? 1.4 : 0, ease: "easeOut" }}
          />

          <motion.circle
            r="6"
            fill="#1D7FE3"
            filter="url(#loginGlow)"
            initial={shouldAnimate ? { cx: 28, cy: 280, opacity: 0 } : { cx: 620, cy: 60, opacity: 0.65 }}
            animate={
              shouldAnimate
                ? {
                    cx: [28, 124, 238, 352, 459, 620],
                    cy: [280, 250, 224, 181, 133, 60],
                    opacity: [0, 1, 1, 1, 1, 0],
                  }
                : undefined
            }
            transition={{ delay: 2.45, duration: 2.05, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.2 }}
          />

          <motion.g
            initial={shouldAnimate ? { opacity: 0, scale: 0.88 } : { opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: shouldAnimate ? 2.1 : 0, duration: 0.42 }}
          >
            <line x1="586" y1="34" x2="586" y2="105" stroke="#7BADEA" strokeWidth="3" strokeLinecap="round" />
            <path d="M589 39 L625 47 L589 63 Z" fill="#1D7FE3" opacity="0.86" />
            <circle cx="586" cy="105" r="5" fill="#1D7FE3" opacity="0.42" />
          </motion.g>

          {nodes.map((node) => (
            <motion.g
              key={node.x}
              initial={shouldAnimate ? { opacity: 0, y: 12, scale: 0.96 } : { opacity: 1, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: shouldAnimate ? node.delay : 0, duration: 0.42, ease: "easeOut" }}
            >
              <rect x={node.x - node.width / 2} y={node.y - 27} width={node.width} height="54" rx="13" fill="rgba(255,255,255,0.9)" stroke="#D9E7F8" />
              <circle cx={node.x - node.width / 2 + 25} cy={node.y} r="15" fill="#E7F0FC" stroke="#CFE1FA" />
              <text x={node.x - node.width / 2 + 25} y={node.y + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#1D7FE3">{node.name}</text>
              <rect x={node.x - node.width / 2 + 49} y={node.y - 10} width={node.width - 72} height="7" rx="3.5" fill="#BFD6F4" />
              <rect x={node.x - node.width / 2 + 49} y={node.y + 7} width={node.width - 86} height="7" rx="3.5" fill="#E1ECFA" />
            </motion.g>
          ))}
        </svg>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = handleSubmit(async (data) => {
    const username = data.username?.trim();
    const password = data.password;

    if (!username || !password) {
      toaster.warning({
        title: "Missing fields",
        description: "Please fill in both username and password.",
        duration: 3000,
      });
      return;
    }

    try {
      const loginResponse = await loginWithProfile(username, password);
      localStorage.setItem("userData", JSON.stringify(loginResponse.user));
      authLogin(loginResponse.user);
      toaster.success({
        title: "Login successful",
        duration: 3000,
      });

      const userRole = getUserRole(loginResponse.user);
      router.push(userRole === "Manager" ? "/manager-overview" : "/associate-profile");
    } catch (error: any) {
      toaster.error({
        title: "Login failed",
        description: error.message,
        duration: 3000,
      });
    }
  });

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #FFFFFF 0%, #F7FBFF 46%, #EEF6FF 100%)"
      color={deepBlue}
      fontFamily="Arial, Helvetica, sans-serif"
      position="relative"
      overflow="hidden"
    >
      <Toaster />
      <Box position="absolute" right="-120px" top="-170px" w={{ base: "290px", md: "460px" }} h={{ base: "290px", md: "460px" }} borderRadius="full" bg="rgba(231,240,252,0.86)" />
      <Box position="absolute" right="-70px" bottom="-150px" w={{ base: "230px", md: "380px" }} h={{ base: "230px", md: "380px" }} borderRadius="full" bg="rgba(231,240,252,0.72)" />
      <Box position="absolute" left="-120px" bottom="-90px" w="360px" h="180px" borderRadius="50%" bg="rgba(231,240,252,0.7)" />

      <Flex
        minH="100vh"
        align="center"
        justify="center"
        px={{ base: "20px", md: "42px", xl: "114px", "2xl": "100px" }}
        py={{ base: "24px", md: "32px", "2xl": "30px" }}
        position="relative"
        zIndex={1}
      >
        <Flex
          w="full"
          maxW={{ base: "100%", "2xl": "1440px" }}
          gap={{ base: "28px", lg: "32px", xl: "40px", "2xl": "72px" }}
          align="center"
          justify="space-between"
          direction={{ base: "column", lg: "row" }}
        >
          <Box flex="1" maxW={{ base: "680px", lg: "600px", xl: "630px", "2xl": "710px" }} w="full">
            <HStack gap="12px" mb={{ base: "28px", lg: "34px", xl: "42px", "2xl": "78px" }}>
              <BrandMark />
              <Text fontSize={{ base: "22px", md: "24px", "2xl": "28px" }} fontWeight="800" letterSpacing="0" color={deepBlue}>
                <Text as="span" color={brandBlue}>CLYRA </Text>
              </Text>
            </HStack>

            <Text color={brandBlue} fontSize={{ base: "11px", "2xl": "13px" }} fontWeight="800" letterSpacing={{ base: "3.5px", "2xl": "5px" }} mb={{ base: "12px", xl: "14px", "2xl": "18px" }}>
              PEOPLE • INSIGHTS • GROWTH
            </Text>
            <Text as="h1" color={deepBlue} fontSize={{ base: "31px", md: "37px", xl: "40px", "2xl": "52px" }} fontWeight="800" lineHeight="1.16" maxW={{ base: "650px", lg: "520px", xl: "560px", "2xl": "650px" }}>
              Build stronger teams for a brighter tomorrow.
            </Text>
            <Text color={mutedBlue} fontSize={{ base: "13px", md: "14px", "2xl": "17px" }} fontWeight="600" lineHeight="1.55" mt={{ base: "16px", xl: "18px", "2xl": "26px" }} maxW={{ base: "430px", lg: "390px", "2xl": "430px" }}>
              Clyra helps you understand, support and retain your people because great teams build great businesses.
            </Text>

            <HStack gap={{ base: "14px", md: "20px", "2xl": "32px" }} mt={{ base: "22px", xl: "26px", "2xl": "36px" }} flexWrap="wrap">
              <FeaturePill icon={<UsersRound size={20} />} title="Understand" subtitle="Your People" />
              <FeaturePill icon={<BarChart3 size={20} />} title="Make Data" subtitle="Driven Decisions" />
              <FeaturePill icon={<ShieldCheck size={20} />} title="Reduce" subtitle="Attrition Risk" />
            </HStack>

            <TeamJourneyIllustration />

            <Text color={brandBlue} fontSize={{ base: "13px", "2xl": "14px" }} fontWeight="700" fontStyle="italic" lineHeight="1.35" mt={{ base: 4, md: 0 }}>
              Better people.
              <br />
              Stronger teams.
            </Text>
          </Box>

          <Box w="full" maxW={{ base: "520px", lg: "440px", xl: "460px", "2xl": "480px" }} flexShrink={0}>
            <Box
              bg="rgba(255,255,255,0.84)"
              border="1px solid"
              borderColor={borderBlue}
              borderRadius="18px"
              boxShadow="0 24px 70px rgba(29,127,227,0.14)"
              overflow="hidden"
              position="relative"
            >
              <Box position="absolute" right="-74px" top="-96px" w="250px" h="250px" borderRadius="full" bg="rgba(231,240,252,0.82)" />
              <Box position="relative" zIndex={1} p={{ base: "24px", md: "32px", xl: "34px", "2xl": "44px" }}>
                <Text as="h2" color={deepBlue} fontSize={{ base: "25px", md: "28px", "2xl": "31px" }} fontWeight="800" lineHeight="1.1">
                  Welcome Back
                </Text>
                <Text color={mutedBlue} fontSize={{ base: "14px", "2xl": "15px" }} fontWeight="600" mt="10px">
                  Sign in to your Clyra account
                </Text>

                <form onSubmit={handleLogin}>
                  <Stack gap={{ base: "16px", "2xl": "20px" }} mt={{ base: "28px", "2xl": "36px" }} w="full">
                    <Field.Root invalid={!!errors.username} w="full">
                      <Box position="relative" w="full">
                        <Box
                          position="absolute"
                          left="17px"
                          top="50%"
                          transform="translateY(-50%)"
                          color={brandBlue}
                          zIndex={2}
                          pointerEvents="none"
                          display="flex"
                          alignItems="center"
                        >
                          <Mail size={19} />
                        </Box>
                        <Input
                          w="full"
                          h={{ base: "52px", "2xl": "56px" }}
                          pl="56px"
                          pr="18px"
                          bg="#FFFFFF"
                          border="1px solid"
                          borderColor={borderBlue}
                          borderRadius="10px"
                          color={deepBlue}
                          fontSize="14px"
                          fontWeight="700"
                          placeholder="Email or username"
                          _placeholder={{ color: "#9AADD0" }}
                          _hover={{ borderColor: "#BBD3F3" }}
                          _focus={{ borderColor: brandBlue, boxShadow: "0 0 0 3px rgba(29,127,227,0.12)" }}
                          _autofill={{ boxShadow: "0 0 0 1000px #FFFFFF inset", WebkitTextFillColor: deepBlue }}
                          {...register("username")}
                        />
                      </Box>
                      <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                    </Field.Root>

                    <Field.Root invalid={!!errors.password} w="full">
                      <Box position="relative" w="full">
                        <Box
                          position="absolute"
                          left="17px"
                          top="50%"
                          transform="translateY(-50%)"
                          color={brandBlue}
                          zIndex={2}
                          pointerEvents="none"
                          display="flex"
                          alignItems="center"
                        >
                          <Lock size={19} />
                        </Box>
                        <Input
                          type={showPassword ? "text" : "password"}
                          w="full"
                          h={{ base: "52px", "2xl": "56px" }}
                          pl="56px"
                          pr="52px"
                          bg="#FFFFFF"
                          border="1px solid"
                          borderColor={borderBlue}
                          borderRadius="10px"
                          color={deepBlue}
                          fontSize="14px"
                          fontWeight="700"
                          placeholder="Password"
                          _placeholder={{ color: "#9AADD0" }}
                          _hover={{ borderColor: "#BBD3F3" }}
                          _focus={{ borderColor: brandBlue, boxShadow: "0 0 0 3px rgba(29,127,227,0.12)" }}
                          _autofill={{ boxShadow: "0 0 0 1000px #FFFFFF inset", WebkitTextFillColor: deepBlue }}
                          {...register("password")}
                        />
                        <Box
                          as="button"
                          type="button"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          position="absolute"
                          right="16px"
                          top="50%"
                          transform="translateY(-50%)"
                          color={mutedBlue}
                          zIndex={2}
                          display="flex"
                          alignItems="center"
                          onClick={() => setShowPassword((value) => !value)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Box>
                      </Box>
                      <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                    </Field.Root>

                    <HStack justify="space-between" gap="16px">
                      <HStack gap="9px">
                        <Box
                          as="input"
                          id="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(event) => setRememberMe(event.target.checked)}
                          width="16px"
                          height="16px"
                          accentColor={brandBlue}
                        />
                        <Text as="label" htmlFor="remember-me" color={mutedBlue} fontSize="13px" fontWeight="700" cursor="pointer">
                          Remember me
                        </Text>
                      </HStack>
                      <Text as="button" type="button" color={brandBlue} fontSize="13px" fontWeight="800">
                        Forgot password?
                      </Text>
                    </HStack>

                    <Button
                      type="submit"
                      w="full"
                      h={{ base: "52px", "2xl": "56px" }}
                      borderRadius="10px"
                      bg={brandBlue}
                      color="white"
                      fontSize="15px"
                      fontWeight="800"
                      boxShadow="0 16px 32px rgba(29,127,227,0.24)"
                      _hover={{ bg: "#176FC7" }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Spinner size="sm" /> : "Sign In"}
                      {!isSubmitting && <ArrowRight size={18} />}
                    </Button>
                  </Stack>
                </form>

                <HStack my={{ base: "22px", "2xl": "26px" }} gap="18px">
                  <Box h="1px" flex="1" bg={borderBlue} />
                  <Text color="#9AADD0" fontSize="12px" fontWeight="800">
                    OR
                  </Text>
                  <Box h="1px" flex="1" bg={borderBlue} />
                </HStack>

                <Button
                  type="button"
                  h={{ base: "50px", "2xl": "54px" }}
                  w="full"
                  borderRadius="10px"
                  bg="rgba(255,255,255,0.82)"
                  border="1px solid"
                  borderColor={borderBlue}
                  color={deepBlue}
                  fontSize="14px"
                  fontWeight="800"
                  _hover={{ bg: "#F8FBFF" }}
                >
                  <ShieldCheck size={18} color={brandBlue} />
                  Sign in with SSO
                </Button>

                <Text color="#8EA2C7" fontSize="12px" fontWeight="700" mt={{ base: "26px", "2xl": "36px" }}>
                  © 2025 CLYRA. All rights reserved.
                </Text>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Flex>

      <style jsx>{`
        @keyframes ambientFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(*) {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </Box>
  );
}
