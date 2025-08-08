import { Avatar, AvatarGroup } from "@chakra-ui/react";

export const Avator = () => {
    return (
        <AvatarGroup>
            <Avatar.Root>
                <Avatar.Fallback />
                <Avatar.Image />
            </Avatar.Root>
        </AvatarGroup>
    );
};
