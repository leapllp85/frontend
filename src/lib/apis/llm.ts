import {fetchWithAuth} from "./auth"

export async function generateChat(prompt: string) {
    const response = await fetchWithAuth(
        `${process.env.BASE_URL}/api/v1/chat/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        }
    );
    return response
}