"use client"; // 👈 MUST be at the top for client components

import {
    Box,
    Button,
    Heading,
    Input,
    Field,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";
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

export default function LoginPage() { // 👈 NO async here
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const router = useRouter();
    const { login: authLogin } = useAuth();

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
        <div className="w-full min-h-screen flex" style={{ background: '#226773' }}>
            <Toaster />
            {/* Left Side - Branding - 40% width */}
            <Box 
                className="text-white px-8 py-12 flex-shrink-0" 
                style={{ 
                    width: '50%',
                    minHeight: '100vh',
                    background: '#226773',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box
                    position="absolute"
                    bottom={-150}
                    left={-150}
                    width="350px"
                    height="350px"
                    borderRadius="50%"
                    bg="#CCF2EE"
                    zIndex={1}
                    opacity={0.3}
                   
                />
                <Box
                    position="absolute"
                    bottom={-100}
                    left={-100}
                    width="250px"
                    height="250px"
                    borderRadius="50%"
                    bg="#226773"
                    zIndex={3}
                    // opacity={0.7}
                />     
                      

                <Box textAlign="center" width="100%">
                    <Text
                        fontSize="48px"
                       
                        letterSpacing="0.15em"
                        lineHeight="1.2"
                        color="#FFFFFF"
                        mb={4}
                    >
                        <span style={{ fontWeight: 'semi-bold' }}>Pulse </span>
                    </Text>

                    <Heading 
                        
                        fontWeight="300"
                        fontSize="32px"
                        lineHeight="1.2"
                        color="#FFFFFF"
                        letterSpacing="0.05em"
                        mb={4}
                    >
                        Strong mental health is smart business
                    </Heading>
                    
                    <Text fontSize="20px"   lineHeight="1.5" color="#FFFFFF" mb={2} letterSpacing="0.05em">
                    You power your business. We support your well-being
                    </Text>
                  

                    
                    {/* Carousel dots */}
                    <Box className="flex gap-2 justify-center" mb={8}>
                        <Box 
                            width="8px"
                            height="8px"
                            borderRadius="50%"
                            bg="rgba(255, 255, 255, 0.5)"
                        />
                        <Box 
                            width="8px"
                            height="8px"
                            borderRadius="50%"
                            bg="#FFFFFF"
                        />
                    </Box>

                    {/* Copyright */}
                    <Text 
                        position="absolute"
                        bottom="2rem"
                        left="50%"
                        transform="translateX(-50%)"
                        fontSize="12px"
                        color="#FFFFFF"
                        whiteSpace="nowrap"
                    >
                        © copyrighted. All rights reserved.
                    </Text>
                </Box>
            </Box>

            {/* Right Side - Login Form - 60% width */}
            <Box 
                className="flex items-center justify-center"
                style={{
                    width: '50%',
                    minHeight: '100vh',
                    background: '#f8f8f8',
                    borderTopLeftRadius: '32px',
                    borderBottomLeftRadius: '32px',
                    boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
                    padding: '2rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Decorative circles */}
                <Box
                    position="absolute"
                    top={-150}
                    right={-150}
                    width="350px"
                    height="350px"
                    borderRadius="50%"
                    bg="#036173"
                    zIndex={1}
                    // opacity={0.3}
                   
                />
                <Box
                    position="absolute"
                    top={-100}
                    right={-100}
                    width="250px"
                    height="250px"
                    borderRadius="50%"
                    bg="#FFFFFF"
                    zIndex={3}
                    // opacity={0.7}
                />                
                <Box 
                    className="w-full relative z-10"
                    style={{
                        maxWidth: '420px',
                        margin: '0 auto',
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Stack gap={10}>
                        <Box textAlign="center">
                            <Heading color="#1b7f8e" fontSize="40px"  letterSpacing="0.07em" lineHeight="1.2" mb={1} fontWeight="700">
                                Welcome!
                            </Heading>
                            <Text fontSize="20px" lineHeight="1.5" color="#666666">
                                Sign in to access your dashboard
                            </Text>
                        </Box>
                        <form onSubmit={handleLogin} style={{ width: '100%' }}>
                            <Stack gap="2.5" align="stretch" width="full">
                                <Field.Root invalid={!!errors.username}>
                                    <Box position="relative" width="full">
                                        <Box
                                            position="absolute"
                                            left="14px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            zIndex={1}
                                            color="gray.400"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        </Box>
                                        <Input
                                            placeholder="Username"
                                            color="#666666"
                                            bg="#dcdcdc"
                                            border="none"
                                            borderRadius="full"
                                            height="42px"
                                            pl={12}
                                            pr={4}
                                            fontSize="13px"
                                            _placeholder={{ color: '#999999', fontSize: '13px' }}
                                            _focus={{ bg: '#d0d0d0', outline: 'none', boxShadow: 'none' }}
                                            {...register("username")}
                                        />
                                    </Box>
                                    <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!errors.password}>
                                    <Box position="relative" width="full">
                                        <Box
                                            position="absolute"
                                            left="14px"
                                            top="50%"
                                            transform="translateY(-50%)"
                                            zIndex={1}
                                            color="gray.400"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                            </svg>
                                        </Box>
                                        <PasswordInput
                                            placeholder="Password"
                                            color="#666666"
                                            bg="#dcdcdc"
                                            border="none"
                                            borderRadius="full"
                                            height="42px"
                                            pl={12}
                                            pr={12}
                                            fontSize="13px"
                                            _placeholder={{ color: '#999999', fontSize: '13px' }}
                                            _focus={{ bg: '#d0d0d0', outline: 'none', boxShadow: 'none' }}
                                            {...register("password")}
                                        />
                                    </Box>
                                    <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                                </Field.Root>

                                <Box className="flex items-center justify-between" mt={1.5}>
                                    <Box className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="remember-me"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            style={{
                                                width: '15px',
                                                height: '15px',
                                                accentColor: '#1b7f8e',
                                                cursor: 'pointer'
                                            }}
                                        />
                                        <label htmlFor="remember-me" style={{ cursor: 'pointer' }}>
                                            <Text fontSize="12px" color="#666666">
                                                Remember me
                                            </Text>
                                        </label>
                                    </Box>
                                    <Text
                                        fontSize="11px"
                                        color="#3bb5c9"
                                        cursor="pointer"
                                        _hover={{ textDecoration: 'underline' }}
                                    >
                                        Forgot password?
                                    </Text>
                                </Box>

                                <Button
                                    bg="#1b7f8e"
                                    color="#FFFFFF"
                                    _hover={{ bg: "#156570" }}
                                    fontWeight="600"
                                    borderRadius="full"
                                    height="46px"
                                    mt={3}
                                    type="submit"
                                    width="full"
                                    fontSize="15px"
                                >
                                    Submit
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Box>
        </div>
    );
}
