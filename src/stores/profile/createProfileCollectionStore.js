import { create } from "zustand";
import {
    getProfileErrorMessage,
    hasProfileContent,
    profileRequest,
} from "./profileApi";

export function createProfileCollectionStore({
    endpoint,
    initialData = [],
    fromResponse,
    toRequest,
}) {
    let savedIds = [];

    return create((set, get) => ({
        data: initialData.map(item => ({ ...item })),
        isLoading: false,
        isSaving: false,
        error: "",
        success: "",

        load: async () => {
            set({ isLoading: true, error: "", success: "" });
            try {
                const results = await profileRequest(endpoint);
                savedIds = results.map(item => item.id);
                set({
                    data: results.length
                        ? results.map(fromResponse)
                        : initialData.map(item => ({ ...item })),
                    isLoading: false,
                });
                return true;
            } catch (error) {
                set({ isLoading: false, error: getProfileErrorMessage(error) });
                return false;
            }
        },

        updateItem: (index, field, value) => set(state => ({
            data: state.data.map((item, itemIndex) => (
                itemIndex === index ? { ...item, [field]: value } : item
            )),
            error: "",
            success: "",
        })),

        addItem: template => set(state => ({
            data: [...state.data, { ...template }],
            error: "",
            success: "",
        })),

        removeItem: index => set(state => ({
            data: state.data.filter((_, itemIndex) => itemIndex !== index),
            error: "",
            success: "",
        })),

        save: async () => {
            const entries = get().data;
            const populatedEntries = entries.filter(hasProfileContent);
            const currentIds = new Set(
                populatedEntries
                    .filter(entry => entry.id != null)
                    .map(entry => String(entry.id))
            );

            set({ isSaving: true, error: "", success: "" });
            try {
                for (const id of savedIds) {
                    if (!currentIds.has(String(id))) {
                        await profileRequest(`${endpoint}/${id}`, { method: "DELETE" });
                    }
                }

                const persistedEntries = [];
                for (const entry of populatedEntries) {
                    const result = entry.id == null
                        ? await profileRequest(endpoint, {
                            method: "POST",
                            body: toRequest(entry),
                        })
                        : await profileRequest(`${endpoint}/${entry.id}`, {
                            method: "PUT",
                            body: toRequest(entry),
                        });
                    persistedEntries.push(fromResponse(result));
                }

                savedIds = persistedEntries.map(entry => entry.id);
                set({
                    data: [
                        ...persistedEntries,
                        ...entries.filter(entry => !hasProfileContent(entry)),
                    ],
                    isSaving: false,
                    success: "Changes saved.",
                });
                return true;
            } catch (error) {
                set({ isSaving: false, error: getProfileErrorMessage(error) });
                return false;
            }
        },
    }));
}
