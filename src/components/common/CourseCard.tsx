import { Box, Image, Text, Heading, Button } from "@chakra-ui/react";

const CourseCard = ({ course }: { course: any }) => {
  return (
    <Box className="shadow-md rounded-lg !important" p={4} bg="white !important">
      <Image src={"/video-thumbnails-hero-1.png"}
        alt={course.title} borderRadius="md !important" />
      <Heading fontSize="xl !important" mt={4}>
        {course.title}
      </Heading>
      <Text mt={2} color="gray.600 !important" truncate>
        {course.description}
      </Text>
      <Button mt={4} colorPalette="teal !important">
        View Course
      </Button>
    </Box>
  );
};

export default CourseCard;
