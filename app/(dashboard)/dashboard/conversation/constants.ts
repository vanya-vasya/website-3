import * as z from "zod";

export const formSchema = z.object({
  image: z.any().refine(
    (file) => file instanceof File,
    { message: "Image is required." }
  ),
});