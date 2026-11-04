const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export async function profileRequest(path, { method = "GET", body } = {}) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        throw new Error("Authentication required. Sign in before accessing your profile.");
    }

    const isFormData = body instanceof FormData;
    const headers = {
        Accept: "application/json",
        Authorization: `${localStorage.getItem("tokenType") || "Bearer"} ${accessToken}`,
        ...(body === undefined || isFormData
            ? {}
            : { "Content-Type": "application/json" }),
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        ...(body === undefined
            ? {}
            : { body: isFormData ? body : JSON.stringify(body) }),
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
            ? payload.message || payload.detail
            : payload;
        const error = new Error(
            detail || `Request failed with status ${response.status}.`
        );
        error.status = response.status;
        throw error;
    }

    return payload;
}

export async function optionalProfileRequest(path) {
    try {
        return await profileRequest(path);
    } catch (error) {
        if (error.status === 404) return null;
        throw error;
    }
}

export function getProfileErrorMessage(error) {
    return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export const asText = value => value == null ? "" : String(value);
export const asNumber = value => value === "" || value == null ? null : Number(value);
export const joinList = value => Array.isArray(value) ? value.join(", ") : "";
export const splitList = (value, separator = /[,;\n]/) => (
    value.split(separator).map(item => item.trim()).filter(Boolean)
);

export const hasProfileContent = entry => Object.entries(entry).some(
    ([key, value]) => (
        key !== "id" &&
        value !== "" &&
        value !== null &&
        value !== undefined &&
        value !== false &&
        (!Array.isArray(value) || value.length > 0)
    )
);
