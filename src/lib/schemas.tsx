import { z } from "zod";

import { requiredString } from "@/lib/validation";

export const formSchema = z.object({
  loginEmail: requiredString,
  firstName: z.string(),
  lastName: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;
