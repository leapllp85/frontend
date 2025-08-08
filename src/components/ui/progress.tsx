import { Progress } from "@chakra-ui/react";

export const ProgressBar = ({ value, colorPalette, borderRadius, ...props }: { value: number, colorPalette: string, borderRadius: string }) => (
    <Progress.Root
        width="120px"
        defaultValue={value}
        colorPalette={colorPalette}
        borderRadius={borderRadius}
        variant="outline"
        {...props}
    >
        <Progress.Track>
            <Progress.Range />
        </Progress.Track>
    </Progress.Root>
)
