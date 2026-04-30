import { watchType } from "./watch";
import { journalPostType } from "./journalPost";

/** Pass to Studio `schema.types` (e.g. `types: schemaTypes`). */
export const schemaTypes = [watchType, journalPostType];
