import {fetchWithAuth} from "./auth"

export async function getProjects(username: string) {
    const response = await fetchWithAuth(
        `${process.env.BASE_URL}/api/v1/project/?user_id=${username}`,
    );
    return response
}