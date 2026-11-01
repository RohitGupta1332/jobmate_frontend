import { createProfileRecordStore } from "./createProfileRecordStore";
import { initialPersonalData } from "./profileDefaults";
import { fromPersonal, toPersonal } from "./profileMappers";

export const usePersonalStore = createProfileRecordStore({
    endpoint: "/api/profile/personal-info",
    initialData: initialPersonalData,
    fromResponse: fromPersonal,
    toRequest: toPersonal,
});
