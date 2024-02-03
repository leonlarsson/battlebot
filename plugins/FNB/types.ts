import type { BasePluginType } from "knub";
import z from "zod";

export const zFNBConfig = z.strictObject({
  can_info: z.boolean(),
  can_create: z.boolean(),
  can_category: z.boolean(),
});

export interface FNBPluginType extends BasePluginType {
  config: z.infer<typeof zFNBConfig>;
}
