"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Empty } from "@/components/ui/empty";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/loader";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModal } from "@/hooks/use-pro-modal";
import { FeatureContainer } from "@/components/feature-container";
import { ImageUpload } from "@/components/image-upload";
import { inputStyles, buttonStyles, contentStyles, messageStyles, loadingStyles } from "@/components/ui/feature-styles";
import { Activity, Target } from "lucide-react";

import { formSchema } from "./constants";
import { MODEL_GENERATIONS_PRICE, tools } from "@/constants";
import { N8nWebhookClient } from "@/lib/n8n-webhook";

// Define ChatCompletionRequestMessage type locally
type ChatCompletionRequestMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

// Конфигурация для разных типов инструментов
const toolConfigs = {
  'master-chef': {
    title: 'Master Chef',
    description: 'Your personal nutrition coach providing expert meal planning, dietary analysis, and personalized nutrition strategies for optimal health\nPrice: 100 Tokens',
    iconName: 'Crown',
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
    gradient: 'from-amber-400 via-orange-500 to-red-600',
    bgGradient: 'from-amber-400/10 via-orange-500/10 to-red-600/10',
    placeholder: 'Ask me for meal planning, nutrition advice, dietary analysis, or healthy recipe suggestions...'
  },
  'master-nutritionist': {
    title: 'Master Nutritionist',
    description: 'Advanced nutritional analysis and meal optimization with scientific precision, macro tracking, and health goal alignment\nPrice: 150 Tokens',
    iconName: 'Activity',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-600/10',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    bgGradient: 'from-emerald-400/10 via-green-500/10 to-teal-600/10',
    placeholder: 'Ask me for nutritional analysis, macro tracking, meal optimization, or health goal planning...'
  },
  'cal-tracker': {
    title: 'Cal Tracker',
    description: 'Intelligent calorie and nutrient tracking with real-time insights, progress monitoring, and personalized recommendations\nPrice: 50 Tokens',
    iconName: 'Target',
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
    gradient: 'from-blue-400 via-cyan-500 to-indigo-600',
    bgGradient: 'from-blue-400/10 via-cyan-500/10 to-indigo-600/10',
    placeholder: 'Track your calories, analyze nutrition, or get personalized meal recommendations...'
  }
};

const ConversationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useAuth();
  const toolId = searchParams.get('toolId') || 'master-chef';
  const proModal = useProModal();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем конфигурацию для текущего инструмента
  const currentTool = toolConfigs[toolId as keyof typeof toolConfigs] || toolConfigs['master-chef'];
  
  // Dynamic button styles based on current tool
  const dynamicButtonStyles = currentTool.gradient 
    ? `bg-gradient-to-r ${currentTool.gradient} hover:shadow-lg shadow-md font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-white`
    : buttonStyles.base;

  // Handle image upload and update form
  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    form.setValue('image', file);
    if (file) {
      form.clearErrors('image');
    }
  };
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
    },
  });

  // Reset form when tool changes
  useEffect(() => {
    form.reset({ image: null });
    setUploadedImage(null);
  }, [toolId, form]);

  const isLoading = form.formState.isSubmitting || isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting || !uploadedImage) return; // Prevent double submission and ensure image exists
    
    setIsSubmitting(true);
    
    try {
      // Initialize n8n webhook client
      const webhookClient = new N8nWebhookClient();
      
      // Build the payload for n8n webhook with a default prompt for image analysis
      const defaultPrompt = `Analyze this food image and provide recipe suggestions, nutritional information, or cooking recommendations based on what you see.`;
      
      const payload = webhookClient.buildWebhookPayload(
        defaultPrompt,
        toolId,
        currentTool,
        uploadedImage,
        userId || undefined
      );
      
      // Validate payload before sending
      const validation = webhookClient.validatePayload(payload);
      if (!validation.valid) {
        toast.error(`Validation failed: ${validation.errors.join(', ')}`);
        return;
      }

      // Create user message for UI
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: `[Image uploaded: ${uploadedImage.name}] - Analyzing food image...`,
      };

      // Add user message to UI immediately
      setMessages((current) => [...current, userMessage]);

      // Send request to n8n webhook
      const webhookResponse = await webhookClient.sendWebhookRequest(payload);

      if (webhookResponse.success && webhookResponse.data) {
        // Add assistant response to UI
        const assistantMessage: ChatCompletionRequestMessage = {
          role: "assistant",
          content: webhookResponse.data.response,
        };
        
        setMessages((current) => [...current, assistantMessage]);
        
        // Show success feedback
        toast.success(`Response received in ${(webhookResponse.data.processingTime / 1000).toFixed(1)}s`);
        
      } else if (webhookResponse.error) {
        // Handle webhook errors
        console.error('[ConversationPage] Webhook error:', webhookResponse.error);
        
        // Remove user message from UI on error
        setMessages((current) => current.slice(0, -1));
        
        // Show appropriate error message
        if (webhookResponse.error.code === 'HTTP_403') {
          proModal.onOpen();
          toast.error("Your generation limit has been reached. Please upgrade to continue.");
        } else if (webhookResponse.error.code === 'NETWORK_ERROR') {
          toast.error("Network error. Please check your connection and try again.");
        } else {
          toast.error(`Request failed: ${webhookResponse.error.message}`);
        }
      }

      // Clear form on successful submission
      if (webhookResponse.success) {
        form.reset({ image: null });
        setUploadedImage(null);
      }

    } catch (error: any) {
      console.error('[ConversationPage] Unexpected error:', error);
      
      // Remove user message from UI on unexpected error
      setMessages((current) => current.slice(0, -1));
      
      // Show generic error message
      toast.error("An unexpected error occurred. Please try again.");
      
    } finally {
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <FeatureContainer
      title={currentTool.title}
      description={currentTool.description}
      iconName={currentTool.iconName as keyof typeof import("lucide-react")}
      gradient={currentTool.gradient}
    >
      <div className={contentStyles.base}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              inputStyles.container,
              "grid grid-cols-12 gap-4"
            )}
          >
            {/* Image Upload Section */}
            <div className="col-span-12">
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium mb-2">Upload Food Image</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload an image of food and our AI will analyze it to provide recipes, nutrition info, and cooking suggestions.
                </p>
              </div>
              <FormField
                name="image"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center">
                        <ImageUpload 
                          onImageUpload={handleImageUpload}
                          gradient={currentTool.gradient}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Generate Button */}
            <div className="col-span-12 flex justify-center mt-4">
              <Button
                className={cn(
                  dynamicButtonStyles,
                  "px-8 py-3 text-lg font-medium",
                  (!uploadedImage || isLoading) && "opacity-50 cursor-not-allowed"
                )}
                type="submit"
                disabled={!uploadedImage || isLoading}
                size="lg"
              >
                {isLoading ? "Analyzing..." : "Generate"}
              </Button>
            </div>
          </form>
        </Form>
        <div className={contentStyles.section}>
          {isLoading && (
            <div className={loadingStyles.container}>
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty 
              label="It's empty ¯\_(ツ)_/¯" 
              gradient={currentTool.gradient}
            />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  messageStyles.container,
                  message.role === "user"
                    ? messageStyles.user
                    : messageStyles.assistant
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                <p className="text-sm">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FeatureContainer>
  );
};

export default ConversationPage;
