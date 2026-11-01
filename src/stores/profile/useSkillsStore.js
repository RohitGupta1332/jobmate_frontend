import { createProfileCollectionStore } from "./createProfileCollectionStore";
import { fromSkill, toSkill } from "./profileMappers";

export const useSkillsStore = createProfileCollectionStore({
    endpoint: "/api/skills",
    fromResponse: fromSkill,
    toRequest: toSkill,
});
