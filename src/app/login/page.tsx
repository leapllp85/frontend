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

            localStorage.setItem('userData', JSON.stringify(loginResponse.user));
            localStorage.setItem('profileData', JSON.stringify(loginResponse.profile));
            
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
        <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gray-100">
            <Toaster />
            {/* Left Side - Login Form */}
            <Box paddingLeft={16} className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white">
                <Box mb={10}>
                    <Heading
                        letterSpacing={"0.7px"}
                        className="text-[#8e2c8a]"
                        size={"3xl"}
                        mb={2}
                        fontWeight={"extrabold"}
                    >
                        MVP Platform
                    </Heading>
                </Box>
                <Stack gap={8}>
                    <Box>
                        <Heading color="#8e2c8a" size="md" mb={1}>
                            Welcome!
                        </Heading>
                        <Text fontSize="sm" color="gray.900">
                            Sign in to access your dashboard.
                        </Text>
                    </Box>
                    <form onSubmit={handleLogin}>
                        <Stack gap="4" align="flex-start" maxW="sm">
                            <Field.Root invalid={!!errors.username}>
                                <Field.Label color={"gray.900"}>Username</Field.Label>
                                <Input
                                    color={"gray.900"}
                                    borderColor={"gray.300"}
                                    {...register("username")}
                                />
                                <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
                            </Field.Root>

                            <Field.Root invalid={!!errors.password}>
                                <Field.Label color={"gray.900"}>Password</Field.Label>
                                <PasswordInput
                                    color={"gray.900"}
                                    borderColor={"gray.300"}
                                    {...register("password")}
                                />
                                <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                            </Field.Root>

                            <Button
                                bg={"#8e2c8a"}
                                color={"white"}
                                _hover={{ bg: "#732176" }}
                                fontWeight={"bold"}
                                className="py-2 px-4 rounded-md shadow-md"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Box>

            {/* Right Side - Info and Brands */}
            <Box padding={16} className="bg-gradient-to-br from-[#c26cb8] via-[#a84da1] to-[#8e2c8a] text-white flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12">
                <Stack gap="8">
                    <Heading size="2xl">Your Mind Matters</Heading>
                    <Stack gap={0.2}>
                        <Text fontSize="lg">
                            A <b>healthy business</b> starts with <b>healthy minds</b>
                        </Text>
                        <Text fontSize="2xl">
                            <b>We're here to support yours.</b>
                        </Text>
                    </Stack>
                </Stack>
            </Box>
        </div>
    );
}
