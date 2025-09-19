import * as z from "zod";

// Dynamic form schema based on tool type
export const getFormSchema = (toolId: string) => {
  if (toolId === 'master-nutritionist') {
    // Master Nutritionist uses description field for challenges
    return z.object({
      description: z.string()
        .min(10, { message: "Description must be at least 10 characters." })
        .max(1000, { message: "Description must be less than 1000 characters." }),
      image: z.any().optional(), // Optional for Master Nutritionist
    });
  } else {
    // Other tools use image upload
    return z.object({
      image: z.any().refine(
        (file) => file instanceof File,
        { message: "Image is required." }
      ),
      description: z.string().optional(), // Optional for other tools
    });
  }
};

// Legacy export for backward compatibility
export const formSchema = getFormSchema('master-chef');