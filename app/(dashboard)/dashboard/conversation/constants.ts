import * as z from "zod";

// Dynamic form schema based on tool type
export const getFormSchema = (toolId: string) => {
  if (toolId === 'master-nutritionist') {
    // Master Nutritionist uses description field with N8N URL
    return z.object({
      description: z.string()
        .min(10, { message: "Description must be at least 10 characters." })
        .max(1000, { message: "Description must be less than 1000 characters." })
        .refine(
          (desc) => desc.includes('https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102'),
          { message: "Description must include the N8N webhook URL: https://vanya-vasya.app.n8n.cloud/webhook/4c6c4649-99ef-4598-b77b-6cb12ab6a102" }
        ),
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