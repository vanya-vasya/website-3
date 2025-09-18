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
import { Activity, Target, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { formSchema } from "./constants";
import { MODEL_GENERATIONS_PRICE, tools } from "@/constants";
import { N8nWebhookClient } from "@/lib/n8n-webhook";
import { getApiAvailableGenerations, getApiUsedGenerations } from "@/lib/api-limit";

// Define ChatCompletionRequestMessage type locally
type ChatCompletionRequestMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

// Конфигурация для разных типов инструментов
const toolConfigs = {
  'master-chef': {
    title: 'Master Chef',
    description: 'Your personal nutrition coach providing expert meal planning, dietary analysis, and personalized nutrition strategies for optimal health\nPrice: Free',
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
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [usedCredits, setUsedCredits] = useState<number>(0);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);

  // Получаем конфигурацию для текущего инструмента
  const currentTool = toolConfigs[toolId as keyof typeof toolConfigs] || toolConfigs['master-chef'];
  
  // Get tool price from the price mapping in webhook client
  const getToolPrice = (toolId: string): number => {
    const prices = {
      'master-chef': 0, // Free tool - always enabled regardless of credit balance
      'master-nutritionist': 150,
      'cal-tracker': 50,
    };
    return prices[toolId as keyof typeof prices] ?? 100; // Use ?? instead of || to handle 0 values correctly
  };
  
  const toolPrice = getToolPrice(toolId);
  const availableCredits = creditBalance - usedCredits;
  const hasInsufficientCredits = toolPrice > 0 && availableCredits < toolPrice; // Free tools (toolPrice = 0) never have insufficient credits
  
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

  // Load credit balance on component mount
  const loadCreditBalance = async () => {
    if (!userId) return;
    
    try {
      setIsLoadingCredits(true);
      
      // Fetch credit data from API route
      const response = await fetch('/api/generations', { method: 'GET' });
      
      if (response.ok) {
        const data = await response.json();
        setCreditBalance(data.available || 0);
        setUsedCredits(data.used || 0);
        
        console.log('[ConversationPage] Credit balance loaded:', {
          available: data.available,
          used: data.used,
          remaining: data.remaining
        });
      } else {
        console.error('[ConversationPage] Failed to fetch credits:', response.status, response.statusText);
        toast.error('Failed to load credit balance');
      }
    } catch (error) {
      console.error('[ConversationPage] Failed to load credit balance:', error);
      toast.error('Failed to load credit balance');
    } finally {
      setIsLoadingCredits(false);
    }
  };
  
  useEffect(() => {
    loadCreditBalance();
  }, [userId]);

  // Reset form when tool changes
  useEffect(() => {
    form.reset({ image: null });
    setUploadedImage(null);
  }, [toolId, form]);

  const isLoading = form.formState.isSubmitting || isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSubmitting || !uploadedImage) return; // Prevent double submission and ensure image exists
    
    // Check credit balance before proceeding (skip for free tools)
    if (hasInsufficientCredits && toolPrice > 0) {
      toast.error(`Insufficient credits. You need ${toolPrice} credits but only have ${availableCredits} available.`);
      proModal.onOpen();
      return;
    }
    
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

      // Send request to n8n webhook with retry logic
      const webhookResponse = await webhookClient.sendWebhookRequestWithRetry(payload, 2, 45000);

      if (webhookResponse.success && webhookResponse.data) {
        // Add assistant response to UI
        const assistantMessage: ChatCompletionRequestMessage = {
          role: "assistant",
          content: webhookResponse.data.response,
        };
        
        setMessages((current) => [...current, assistantMessage]);
        
        // Update local credit balance (optimistic update) - skip for free tools
        if (toolPrice > 0) {
          setUsedCredits(prev => prev + toolPrice);
        }
        
        // Show success feedback
        toast.success(`Response received in ${(webhookResponse.data.processingTime / 1000).toFixed(1)}s`);
        
      } else if (webhookResponse.error) {
        // Handle webhook errors
        console.error('[ConversationPage] Webhook error:', webhookResponse.error);
        
        // Remove user message from UI on error
        setMessages((current) => current.slice(0, -1));
        
        // Show appropriate error message based on error type
        switch (webhookResponse.error.code) {
          case 'HTTP_403':
            proModal.onOpen();
            toast.error("Your generation limit has been reached. Please upgrade to continue.");
            break;
          case 'CONNECTION_ERROR':
            toast.error("Unable to connect to the server. Please check your internet connection.");
            break;
          case 'TIMEOUT_ERROR':
            toast.error("Request timed out. The server may be busy, please try again.");
            break;
          case 'RESPONSE_FORMAT_ERROR':
            toast.error("Server returned an unexpected response. Please try again.");
            break;
          case 'NETWORK_ERROR':
            toast.error("Network error. Please check your connection and try again.");
            break;
          case 'MAX_RETRIES_EXCEEDED':
            toast.error("Request failed after multiple attempts. Please try again later.");
            break;
          default:
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
            <div className="col-span-12 flex flex-col items-center gap-3 mt-4">
              {/* Credit information */}
              {!isLoadingCredits && (
                <div className="text-sm text-gray-600 text-center">
                  <span className="flex items-center justify-center gap-2">
                    <Activity className="h-4 w-4" />
                    Credits: {availableCredits} available | {toolPrice === 0 ? 'Free' : `${toolPrice} required`}
                  </span>
                </div>
              )}
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Button
                        className={cn(
                          dynamicButtonStyles,
                          "px-8 py-3 text-lg font-medium",
                          (!uploadedImage || isLoading || hasInsufficientCredits || isLoadingCredits) && "opacity-50 cursor-not-allowed"
                        )}
                        type="submit"
                        disabled={!uploadedImage || isLoading || hasInsufficientCredits || isLoadingCredits}
                        size="lg"
                      >
                        {isLoading ? "Analyzing..." : "Generate"}
                        {hasInsufficientCredits && !isLoading && (
                          <AlertCircle className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isLoadingCredits ? (
                      <p>Loading credit balance...</p>
                    ) : !uploadedImage ? (
                      <p>Please upload an image first</p>
                    ) : hasInsufficientCredits ? (
                      <p>Insufficient credits. You need {toolPrice} but have {availableCredits} available.</p>
                    ) : toolPrice === 0 ? (
                      <p>Click to generate AI analysis (Free tool)</p>
                    ) : (
                      <p>Click to generate AI analysis</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
