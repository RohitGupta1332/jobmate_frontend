import { create } from "zustand";
import { getProfileErrorMessage, profileRequest } from "./profileApi";

export const useResumeStore = create(set => ({
    resumes: [],
    isUploading: false,
    deletingId: null,
    error: "",
    success: "",

    setError: error => set({ error, success: "" }),

    upload: async file => {
        set({ isUploading: true, error: "", success: "" });
        try {
            const formData = new FormData();
            formData.append("file", file);
            const resume = await profileRequest("/api/resume/upload", {
                method: "POST",
                body: formData,
            });
            set(state => ({
                resumes: [...state.resumes, resume],
                isUploading: false,
                success: "Resume uploaded successfully.",
            }));
            return true;
        } catch (error) {
            set({ isUploading: false, error: getProfileErrorMessage(error) });
            return false;
        }
    },

    remove: async resumeId => {
        set({ deletingId: resumeId, error: "", success: "" });
        try {
            await profileRequest(`/api/resume/${resumeId}`, { method: "DELETE" });
            set(state => ({
                resumes: state.resumes.filter(resume => resume.id !== resumeId),
                deletingId: null,
                success: "Resume deleted.",
            }));
            return true;
        } catch (error) {
            set({ deletingId: null, error: getProfileErrorMessage(error) });
            return false;
        }
    },
}));
