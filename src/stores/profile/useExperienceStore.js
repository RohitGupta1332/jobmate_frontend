import { createProfileCollectionStore } from "./createProfileCollectionStore";
import { initialExperienceData } from "./profileDefaults";
import { fromExperience, toExperience } from "./profileMappers";

export const useExperienceStore = createProfileCollectionStore({
    endpoint: "/api/experiences",
    initialData: initialExperienceData,
    fromResponse: fromExperience,
    toRequest: toExperience,
});
