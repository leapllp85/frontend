import {fetchWithAuth} from "./auth"

export async function getActionItems(username: string) {
    const response = await fetchWithAuth(
        `${process.env.BASE_URL}/api/v1/action-items/?user_id=${username}`,
    );
    return response
}