import React from "react";
import { Badge, Box, Heading, Stack, Text, Flex } from "@chakra-ui/react";
// import { ProgressBar } from "../ui/progress";

export default function ProjectListingItem({name, description, source, timeline, progress, status}: {
    name: string, description: string, source: string,
    timeline: string, progress: number, status: string
}) {
    return (
        <Box className="!w-full !p-4 !border !border-gray-200 !rounded-md !bg-white !shadow-sm !hover:shadow-md !transition-all !duration-200">
            <div className="inline-block !bg-green-100 !text-green-800 !text-xs !font-semibold !px-3 !py-1">
                {status}
            </div>
            <a href={source}>
                <Heading size="sm" className={"!mt-2"}>
                    {name}
                </Heading>
            </a>
            <Text fontSize="sm" className="!mt-1">
                {description}
            </Text>
            <Text fontSize="xs" className="!text-gray-500 !mt-1">
                {timeline}
            </Text>
            {/* <ProgressBar value={progress} colorPalette="purple" borderRadius="full" /> */}
        </Box>
    )
}
