import { createProfileRecordStore } from "./createProfileRecordStore";
import { initialJobPreferencesData } from "./profileDefaults";
import { fromJobPreferences, toJobPreferences } from "./profileMappers";

export const useJobPreferencesStore = createProfileRecordStore({
    endpoint: "/api/profile/job-preferences",
    initialData: initialJobPreferencesData,
    fromResponse: fromJobPreferences,
    toRequest: toJobPreferences,
});
