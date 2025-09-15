// lib/auth.js
import nookies from "nookies";

export async function login(username: string, password: string) {
    const apiUrl = process.env.BASE_URL || 'http://34.93.168.19:8000';
    const res = await fetch(`${apiUrl}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
        console.log(res)
        throw new Error("Invalid login");
    }

    const data = await res.json();

    localStorage.setItem("username", JSON.stringify(username));

    // Store access token in memory or localStorage
    localStorage.setItem("accessToken", data.access);

    // Store refresh token as cookie with nookies
    nookies.set(null, "refreshToken", data.refresh, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return data;
}

export async function refreshAccessToken(ctx = null) {
    const cookies = nookies.get(ctx);
    const refreshToken = cookies.refreshToken;
    if (!refreshToken) throw new Error("No refresh token found");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://34.93.168.19:8000';
    const res = await fetch(`${apiUrl}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    localStorage.setItem("accessToken", data.access);

    return data.access;
}

export async function fetchWithAuth(url: string, options: any = {}) {
    let token = localStorage.getItem("accessToken");

    try {
        let res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.status === 401) {
            try {
                token = await refreshAccessToken();
                res = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        Authorization: `Bearer ${token}`,
                    },
                });
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                throw new Error(`Authentication failed: ${refreshError}`);
            }
        }

        if (!res.ok) {
            let errorMessage = `API request failed: ${res.status} ${res.statusText}`;
            try {
                const errorData = await res.text();
                if (errorData) {
                    errorMessage += ` - ${errorData}`;
                }
            } catch (e) {
                // If we can't parse the error response, use the basic message
            }
            throw new Error(errorMessage);
        }
        
        return await res.json();
    } catch (error) {
        console.error('fetchWithAuth error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error(`Network error: ${error}`);
    }
}

export async function fetchProfile(username: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://34.93.168.19:8000';
    return await fetchWithAuth(
        `${apiUrl}/api/user/profile/?username=${username}`,
    )
}

// Enhanced login function that fetches user profile data
export async function loginWithProfile(username: string, password: string) {
    try {
        // First, perform the login
        const loginResponse = await login(username, password);
        
        // Then fetch the user profile data
        const profileData = await fetchProfile(username);
        
        // Return both login response and profile data
        return {
            ...loginResponse,
            user: profileData.user,
            profile: profileData.profile
        };
    } catch (error) {
        console.error('Login with profile error:', error);
        throw error;
    }
}

export function logout() {
    // Clear access token from localStorage
    localStorage.removeItem("accessToken");
    
    // Clear refresh token cookie
    nookies.destroy(null, "refreshToken", {
        path: "/",
    });
    
    // Redirect to login page
    window.location.href = "/login";
}

export function isTokenExpired(token: string): boolean {
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        return true;
    }
}

export function checkTokenAndRedirect() {
    const token = localStorage.getItem("accessToken");
    
    if (!token || isTokenExpired(token)) {
        logout();
        return false;
    }
    
    return true;
}

