"use client";

import {
    Box,
    Button,
    Heading,
    Input,
    Field,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { loginWithProfile } from "@/lib/apis/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { getUserRole } from "@/utils/rbac";

type FormValues = {
    username: string;
    password: string;
};

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const router = useRouter();
    const { login: authLogin } = useAuth();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleLogin = handleSubmit(async (data) => {
        let username = data.username;
        let password = data.password;
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

            // Store user data in localStorage
            localStorage.setItem('userData', JSON.stringify(loginResponse.user));
            
            // Store user data in AuthContext
            authLogin(loginResponse.user);
            
            toaster.success({
                title: "Login successful",
                duration: 3000,
            });
            
            // All users redirect to home page after login
            router.push("/");
        } catch (error: any) {
            toaster.error({
                title: "Login failed",
                description: error.message,
                duration: 3000,
            });
        }
    });

    return (
        <div 
            className="w-full min-h-screen relative"
            style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #00d4aa 50%, #4facfe 75%, #00f2fe 100%)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 15s ease infinite',
                transition: 'all 1s ease-in-out',
                opacity: isLoaded ? 1 : 0
            }}
        >
            <Toaster />
            
            {/* Animated Mesh Background */}
            <Box
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                opacity={0.3}
                backgroundImage="radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px)"
                backgroundSize="60px 60px"
                animation="meshMove 20s linear infinite"
                zIndex={1}
            />

            {/* Floating Orbs */}
            <Box
                position="absolute"
                top="10%"
                left="15%"
                width="120px"
                height="120px"
                borderRadius="50%"
                background="radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1))"
                animation="floatSlow 8s ease-in-out infinite"
                zIndex={2}
            />
            <Box
                position="absolute"
                top="60%"
                right="20%"
                width="80px"
                height="80px"
                borderRadius="50%"
                background="radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0.05))"
                animation="floatSlow 6s ease-in-out infinite reverse"
                zIndex={2}
            />
            <Box
                position="absolute"
                bottom="25%"
                left="25%"
                width="60px"
                height="60px"
                borderRadius="50%"
                background="radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.08))"
                animation="floatSlow 10s ease-in-out infinite"
                zIndex={2}
            />

            {/* Main Content Grid */}
            <Box
                display="grid"
                gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
                minHeight="100vh"
                position="relative"
                zIndex={10}
            >
                {/* Left Side - Brand Story */}
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    padding={{ base: "2rem", lg: "4rem" }}
                    textAlign="center"
                    position="relative"
                >
                    <Box
                        maxWidth="500px"
                        style={{
                            transform: isLoaded ? 'translateX(0)' : 'translateX(-50px)',
                            transition: 'transform 1s ease-out 0.3s'
                        }}
                    >
                        {/* Animated Logo */}
                        <Box
                            width="120px"
                            height="120px"
                            borderRadius="30px"
                            background="rgba(255, 255, 255, 0.95)"
                            backdropFilter="blur(20px)"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            margin="0 auto 3rem"
                            boxShadow="0 20px 60px rgba(0, 0, 0, 0.1)"
                            position="relative"
                            animation="logoFloat 4s ease-in-out infinite"
                        >
                            <Text fontSize="48px" fontWeight="bold" 
                                background="linear-gradient(135deg, #00d4aa, #4facfe)"
                                backgroundClip="text"
                                color="transparent"
                            >
                                C
                            </Text>
                            <Box
                                position="absolute"
                                top="-5px"
                                right="-5px"
                                width="30px"
                                height="30px"
                                borderRadius="50%"
                                background="linear-gradient(45deg, #00f2fe, #00d4aa)"
                                animation="pulse 3s ease-in-out infinite"
                            />
                        </Box>

                        <Heading
                            fontSize={{ base: "48px", lg: "64px" }}
                            fontWeight="800"
                            color="white"
                            mb={6}
                            letterSpacing="-0.03em"
                            textShadow="0 4px 20px rgba(0,0,0,0.3)"
                            lineHeight="1.1"
                        >
                            Clyra
                        </Heading>

                        <Text
                            fontSize="24px"
                            color="rgba(255,255,255,0.95)"
                            lineHeight="1.6"
                            mb={8}
                            fontWeight="300"
                            textShadow="0 2px 10px rgba(0,0,0,0.2)"
                        >
                            Transform your workplace wellness journey with intelligent insights and compassionate care
                        </Text>

                        <Box display="flex" justifyContent="center" gap={3} mb={8}>
                            <Box
                                width="12px"
                                height="12px"
                                borderRadius="50%"
                                background="rgba(255,255,255,0.8)"
                                animation="pulse 2s ease-in-out infinite"
                            />
                            <Box
                                width="12px"
                                height="12px"
                                borderRadius="50%"
                                background="rgba(255,255,255,0.6)"
                                animation="pulse 2s ease-in-out infinite 0.3s"
                            />
                            <Box
                                width="12px"
                                height="12px"
                                borderRadius="50%"
                                background="rgba(255,255,255,0.4)"
                                animation="pulse 2s ease-in-out infinite 0.6s"
                            />
                        </Box>

                        <Text
                            fontSize="16px"
                            color="rgba(255,255,255,0.8)"
                            fontWeight="400"
                        >
                            Empowering minds • Building resilience • Creating impact
                        </Text>
                    </Box>
                </Box>

                {/* Right Side - Login Form */}
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    padding={{ base: "2rem", lg: "4rem" }}
                    position="relative"
                >
                    <Box
                        maxWidth="420px"
                        width="100%"
                        style={{
                            transform: isLoaded ? 'translateX(0)' : 'translateX(50px)',
                            transition: 'transform 1s ease-out 0.6s'
                        }}
                    >
                        {/* Login Card */}
                        <Box
                            background="rgba(255, 255, 255, 0.98)"
                            backdropFilter="blur(30px)"
                            borderRadius="32px"
                            padding="3rem"
                            boxShadow="0 30px 80px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.3)"
                            border="1px solid rgba(255, 255, 255, 0.2)"
                            position="relative"
                            overflow="hidden"
                        >
                            {/* Card Background Pattern */}
                            <Box
                                position="absolute"
                                top="0"
                                right="0"
                                width="200px"
                                height="200px"
                                borderRadius="50%"
                                background="linear-gradient(135deg, rgba(0, 212, 170, 0.1), rgba(79, 172, 254, 0.05))"
                                transform="translate(50%, -50%)"
                                zIndex={1}
                            />

                            <Box position="relative" zIndex={2}>
                                {/* Header */}
                                <Box textAlign="center" mb={10}>
                                    <Heading
                                        fontSize="32px"
                                        fontWeight="700"
                                        color="#1a202c"
                                        mb={3}
                                        letterSpacing="-0.02em"
                                    >
                                        Welcome Back
                                    </Heading>
                                    <Text
                                        fontSize="18px"
                                        color="#718096"
                                        fontWeight="400"
                                    >
                                        {/* Continue your wellness journey */}
                                    </Text>
                                </Box>

                                {/* Form */}
                                <form onSubmit={handleLogin}>
                                    <Stack gap={6}>
                                        <Field.Root invalid={!!errors.username}>
                                            <Box position="relative">
                                                <Input
                                                    placeholder="Enter your username"
                                                    height="60px"
                                                    pl="24px"
                                                    pr="24px"
                                                    fontSize="16px"
                                                    borderRadius="20px"
                                                    border="2px solid transparent"
                                                    background="rgba(248, 250, 252, 0.8)"
                                                    color="#2d3748"
                                                    _placeholder={{ color: '#a0aec0' }}
                                                    _focus={{
                                                        borderColor: 'transparent',
                                                        background: 'white',
                                                        boxShadow: '0 0 0 4px rgba(0, 212, 170, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
                                                        outline: 'none',
                                                        transform: 'translateY(-2px)'
                                                    }}
                                                    _hover={{
                                                        background: 'rgba(248, 250, 252, 1)',
                                                        transform: 'translateY(-1px)'
                                                    }}
                                                    transition="all 0.3s ease"
                                                    {...register("username")}
                                                />
                                            </Box>
                                            <Field.ErrorText color="#e53e3e" fontSize="14px" mt={2}>
                                                {errors.username?.message}
                                            </Field.ErrorText>
                                        </Field.Root>

                                        <Field.Root invalid={!!errors.password}>
                                            <Box position="relative">
                                                <PasswordInput
                                                    placeholder="Enter your password"
                                                    height="60px"
                                                    pl="24px"
                                                    pr="24px"
                                                    fontSize="16px"
                                                    borderRadius="20px"
                                                    border="2px solid transparent"
                                                    background="rgba(248, 250, 252, 0.8)"
                                                    color="#2d3748"
                                                    _placeholder={{ color: '#a0aec0' }}
                                                    _focus={{
                                                        borderColor: 'transparent',
                                                        background: 'white',
                                                        boxShadow: '0 0 0 4px rgba(0, 212, 170, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
                                                        outline: 'none',
                                                        transform: 'translateY(-2px)'
                                                    }}
                                                    _hover={{
                                                        background: 'rgba(248, 250, 252, 1)',
                                                        transform: 'translateY(-1px)'
                                                    }}
                                                    transition="all 0.3s ease"
                                                    {...register("password")}
                                                />
                                            </Box>
                                            <Field.ErrorText color="#e53e3e" fontSize="14px" mt={2}>
                                                {errors.password?.message}
                                            </Field.ErrorText>
                                        </Field.Root>

                                        {/* <Box display="flex" alignItems="center" justifyContent="space-between" mt={4}>
                                            <Box display="flex" alignItems="center" gap={3}>
                                                <input
                                                    type="checkbox"
                                                    id="remember-me"
                                                    checked={rememberMe}
                                                    onChange={(e) => setRememberMe(e.target.checked)}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        accentColor: '#00d4aa',
                                                        cursor: 'pointer'
                                                    }}
                                                />
                                                <label htmlFor="remember-me" style={{ cursor: 'pointer' }}>
                                                    <Text fontSize="15px" color="#4a5568" fontWeight="500">
                                                        Remember me
                                                    </Text>
                                                </label>
                                            </Box>
                                            <Text
                                                fontSize="15px"
                                                color="#4facfe"
                                                cursor="pointer"
                                                fontWeight="600"
                                                _hover={{ textDecoration: 'underline' }}
                                            >
                                                Forgot password?
                                            </Text>
                                        </Box> */}

                                        <Button
                                            type="submit"
                                            height="60px"
                                            borderRadius="20px"
                                            background="linear-gradient(135deg, #00d4aa 0%, #4facfe 100%)"
                                            color="white"
                                            fontSize="18px"
                                            fontWeight="600"
                                            mt={6}
                                            _hover={{
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 20px 40px rgba(0, 212, 170, 0.4)'
                                            }}
                                            _active={{
                                                transform: 'translateY(-1px)'
                                            }}
                                            transition="all 0.3s ease"
                                            boxShadow="0 10px 30px rgba(0, 212, 170, 0.3)"
                                        >
                                            Sign In to Continue
                                        </Button>
                                    </Stack>
                                </form>

                                {/* Footer */}
                                <Box textAlign="center" mt={8}>
                                    <Text fontSize="14px" color="#a0aec0">
                                        © 2025 Clyra. All rights reserved.
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Advanced CSS Animations */}
            <style jsx>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes meshMove {
                    0% { transform: translateX(0) translateY(0); }
                    100% { transform: translateX(-60px) translateY(-60px); }
                }
                @keyframes floatSlow {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
                @keyframes logoFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
            `}</style>
        </div>
    );
}
