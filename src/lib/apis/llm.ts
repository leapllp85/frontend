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

export async function generateChatWithAbort(prompt: string, signal: AbortSignal) {
    try {
        const response = await fetchWithAuth(
            `${process.env.BASE_URL}/api/v1/chat/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
                signal: signal,
            }
        );
        return response;
    } catch (error: any) {
        if (error.name === 'AbortError') {
            console.log('API request was aborted');
            throw error;
        }
        console.error('API request failed:', error);
        throw error;
    }
}