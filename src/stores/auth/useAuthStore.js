import { create } from "zustand";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const ACCESS_TOKEN_STORAGE_KEY = "accessToken";
const TOKEN_TYPE_STORAGE_KEY = "tokenType";
const USERNAME_STORAGE_KEY = "authUsername";
const EXPIRY_STORAGE_KEY = "tokenExpiresAt";

async function authenticate(endpoint, credentials) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const responseText = await response.text();
    let payload = null;
    if (responseText) {
        try {
            payload = JSON.parse(responseText);
        } catch {
            payload = responseText;
        }
    }

    if (!response.ok) {
        const detail = payload && typeof payload === "object"
            ? payload.message || payload.detail || payload.title
            : payload;
        throw new Error(detail || `Authentication failed (${response.status}).`);
    }
    return payload;
}

function storeSession(result, fallbackUsername) {
    if (!result?.accessToken) {
        throw new Error("The authentication response did not include an access token.");
    }

    const username = result.username || fallbackUsername;
    const tokenType = result.tokenType || "Bearer";
    const expiresInSeconds = Number(result.expiresInSeconds);
    const expiresAt = Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
        ? Date.now() + expiresInSeconds * 1000
        : null;

    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, result.accessToken);
    localStorage.setItem(TOKEN_TYPE_STORAGE_KEY, tokenType);
    localStorage.setItem(USERNAME_STORAGE_KEY, username);
    if (expiresAt) {
        localStorage.setItem(EXPIRY_STORAGE_KEY, String(expiresAt));
    } else {
        localStorage.removeItem(EXPIRY_STORAGE_KEY);
    }

    return {
        username,
        tokenType,
        accessToken: result.accessToken,
        expiresInSeconds,
        expiresAt,
    };
}

const storedExpiresAt = Number(localStorage.getItem(EXPIRY_STORAGE_KEY)) || null;
const sessionExpired = storedExpiresAt !== null && storedExpiresAt <= Date.now();
if (sessionExpired) {
    localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    localStorage.removeItem(EXPIRY_STORAGE_KEY);
}

const storedAccessToken = sessionExpired
    ? ""
    : localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || "";
const storedUsername = localStorage.getItem(USERNAME_STORAGE_KEY) || "";
const storedTokenType = localStorage.getItem(TOKEN_TYPE_STORAGE_KEY) || "Bearer";

export const useAuthStore = create(set => ({
    accessToken: storedAccessToken,
    tokenType: storedTokenType,
    username: storedUsername,
    expiresAt: sessionExpired ? null : storedExpiresAt,
    isAuthenticated: Boolean(storedAccessToken),
    isLoading: false,
    error: "",
    success: "",

    login: async credentials => {
        set({ isLoading: true, error: "", success: "" });
        try {
            const result = await authenticate("/api/auth/login", credentials);
            const session = storeSession(result, credentials.username);
            set({
                ...session,
                isAuthenticated: true,
                isLoading: false,
                success: "Signed in successfully.",
            });
            return true;
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Sign-in failed.",
            });
            return false;
        }
    },

    register: async credentials => {
        set({ isLoading: true, error: "", success: "" });
        try {
            const result = await authenticate("/api/auth/register", credentials);
            const session = storeSession(result, credentials.username);
            set({
                ...session,
                isAuthenticated: true,
                isLoading: false,
                success: result.message || "Account created successfully.",
            });
            return true;
        } catch (error) {
            set({
                isLoading: false,
                error: error instanceof Error ? error.message : "Registration failed.",
            });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        localStorage.removeItem(TOKEN_TYPE_STORAGE_KEY);
        localStorage.removeItem(USERNAME_STORAGE_KEY);
        localStorage.removeItem(EXPIRY_STORAGE_KEY);
        set({
            accessToken: "",
            tokenType: "Bearer",
            username: "",
            expiresAt: null,
            isAuthenticated: false,
            error: "",
            success: "",
        });
    },

    clearMessages: () => set({ error: "", success: "" }),
}));
