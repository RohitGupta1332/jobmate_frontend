import { createProfileRecordStore } from "./createProfileRecordStore";
import { initialAdditionalInfoData } from "./profileDefaults";
import { fromAdditionalInfo, toAdditionalInfo } from "./profileMappers";

export const useAdditionalInfoStore = createProfileRecordStore({
    endpoint: "/api/profile/additional-info",
    initialData: initialAdditionalInfoData,
    fromResponse: fromAdditionalInfo,
    toRequest: toAdditionalInfo,
});
