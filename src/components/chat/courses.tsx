import { SimpleGrid } from "@chakra-ui/react";
import CourseCard from "../common/CourseCard";
import { Course } from "@/types";

interface CoursesTemplateProps {
    results: Course[];
}

export const CoursesTemplate = ({ results }: CoursesTemplateProps) => {
    return (
        <SimpleGrid columns={4} gap={6} p={6}>
        {results.map((course: Course, index: number) => (
            <CourseCard key={index} course={course} />
        ))}
        </SimpleGrid>
    );
}