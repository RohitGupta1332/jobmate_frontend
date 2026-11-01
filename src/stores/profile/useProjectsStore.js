import { createProfileCollectionStore } from "./createProfileCollectionStore";
import { initialProjectData } from "./profileDefaults";
import { fromProject, toProject } from "./profileMappers";

export const useProjectsStore = createProfileCollectionStore({
    endpoint: "/api/projects",
    initialData: initialProjectData,
    fromResponse: fromProject,
    toRequest: toProject,
});
