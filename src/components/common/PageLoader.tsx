'use client';

import { Box, Spinner, Text, Stack } from '@chakra-ui/react';

interface PageLoaderProps {
  isLoading: boolean;
  message?: string;
}

export default function PageLoader({ isLoading, message = "Loading..." }: PageLoaderProps) {
  if (!isLoading) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="rgba(189, 181, 181, 0.7)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Stack direction="column" align="center" gap={4}>
        <Spinner
          color="#a5479f"
          size="xl"
        />
        <Text color="white" fontSize="lg" fontWeight="medium">
          {message}
        </Text>
      </Stack>
    </Box>
  );
}
