import React from "react";
import { Badge, Box, Heading, VStack, Stack } from "@chakra-ui/react";
import { ProgressBar } from "../ui/progress";

export default function ProfileListComponent({heading, children}: {heading: string, children: React.ReactNode}) {
    return (
        <VStack gap={2}>
            <Box w="full" alignItems="left">
                <Heading size="md">
                    {heading}
                </Heading>
            </Box>
            <VStack w="full" gap={4} overflowY={"scroll"} scrollBehavior={"smooth"}>
                {children}
            </VStack>
        </VStack>
    )
}