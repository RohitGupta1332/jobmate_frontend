import { createProfileCollectionStore } from "./createProfileCollectionStore";
import { initialEducationData } from "./profileDefaults";
import { fromEducation, toEducation } from "./profileMappers";

export const useEducationStore = createProfileCollectionStore({
    endpoint: "/api/education",
    initialData: initialEducationData,
    fromResponse: fromEducation,
    toRequest: toEducation,
});
