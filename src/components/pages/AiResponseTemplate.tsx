import React from "react";
import { Box, Button, Flex, Input, Text, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {CoursesTemplate} from "../chat/courses";
import { Course } from "@/types";

interface AiResponse {
    model: string;
    results: Course[];
}

interface AiResponseTemplateProps {
    aiResponse: AiResponse;
    isLoading: boolean;
}

const templateMapping: Record<string, React.ComponentType<any>> = {
    Course: CoursesTemplate
}

export default function AiResponseTemplate({aiResponse, isLoading}: AiResponseTemplateProps) {

    const [template, setTemplate] = useState<string>("");
    const [results, setResults] = useState<Course[]>([]);

    useEffect(() => {
        setTemplate(aiResponse.model)
        setResults(aiResponse.results)
    }, [aiResponse])

    return (
        <Box width={"60%"} p={6} className="bg-white text-gray-800">
            {
                isLoading ? (
                    <Spinner size="md" />
                ): (
                    templateMapping[template] && React.createElement(templateMapping[template], { results })
                )
            }
        </Box>
    )
}