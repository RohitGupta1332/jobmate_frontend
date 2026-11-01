import { create } from "zustand";
import {
    getProfileErrorMessage,
    optionalProfileRequest,
    profileRequest,
} from "./profileApi";

export function createProfileRecordStore({
    endpoint,
    initialData,
    fromResponse,
    toRequest,
}) {
    return create((set, get) => ({
        data: { ...initialData },
        isLoading: false,
        isSaving: false,
        error: "",
        success: "",

        load: async () => {
            set({ isLoading: true, error: "", success: "" });
            try {
                const result = await optionalProfileRequest(endpoint);
                set({
                    data: result ? fromResponse(result) : { ...initialData },
                    isLoading: false,
                });
                return true;
            } catch (error) {
                set({ isLoading: false, error: getProfileErrorMessage(error) });
                return false;
            }
        },

        setField: (field, value) => set(state => ({
            data: { ...state.data, [field]: value },
            error: "",
            success: "",
        })),

        save: async () => {
            set({ isSaving: true, error: "", success: "" });
            try {
                const result = await profileRequest(endpoint, {
                    method: "PUT",
                    body: toRequest(get().data),
                });
                set({
                    data: fromResponse(result),
                    isSaving: false,
                    success: "Changes saved.",
                });
                return true;
            } catch (error) {
                set({ isSaving: false, error: getProfileErrorMessage(error) });
                return false;
            }
        },

        remove: async () => {
            set({ isSaving: true, error: "", success: "" });
            try {
                await profileRequest(endpoint, { method: "DELETE" });
                set({
                    data: { ...initialData },
                    isSaving: false,
                    success: "Section deleted.",
                });
                return true;
            } catch (error) {
                set({ isSaving: false, error: getProfileErrorMessage(error) });
                return false;
            }
        },
    }));
}
