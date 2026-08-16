import { watchType } from "./watch";
import { journalPostType } from "./journalPost";
import { discountCodeType } from "./discountCode";

/** Pass to Studio `schema.types` (e.g. `types: schemaTypes`). */
export const schemaTypes = [watchType, journalPostType, discountCodeType];
