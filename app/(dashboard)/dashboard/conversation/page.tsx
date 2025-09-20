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
import { RecipeCard } from "@/components/RecipeCard";
import { FriendlyResponseCard } from "@/components/FriendlyResponseCard";
import { CalTrackerResponseCard } from "@/components/CalTrackerResponseCard";
import { friendlyFormatter, FriendlyResponse } from "@/lib/friendly-response-formatter";
import { calTrackerFormatter, CalTrackerResponse } from "@/lib/cal-tracker-formatter";

import { getFormSchema } from "./constants";
import { MODEL_GENERATIONS_PRICE, tools } from "@/constants";
import { N8nWebhookClient } from "@/lib/n8n-webhook";
import { getApiAvailableGenerations, getApiUsedGenerations } from "@/lib/api-limit";

// Define ChatCompletionRequestMessage type locally with enhanced response support
type ChatCompletionRequestMessage = {
  role: 'user' | 'system' | 'assistant';
  content: string;
  recipeData?: Recipe; // Optional recipe data for structured responses
  friendlyResponse?: FriendlyResponse; // Friendly formatted response for Master Nutritionist
  calTrackerResponse?: CalTrackerResponse; // Formatted response for Cal Tracker
};

// Recipe type for structured recipe responses
type Recipe = {
  dish: string;
  kcal: number;
  prot: number;
  fat: number;
  carb: number;
  recipe: string; // markdown
};

// Helper function to parse JSON response and extract recipe data
const parseRecipeResponse = (response: string): { text: string; recipe?: Recipe } => {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(response);
    
    // Check if it's a recipe object with required fields
    if (parsed && typeof parsed === 'object' && 
        parsed.dish && 
        typeof parsed.kcal === 'number' && 
        typeof parsed.prot === 'number' && 
        typeof parsed.fat === 'number' && 
        typeof parsed.carb === 'number' && 
        parsed.recipe) {
      return {
        text: response, // Keep original JSON as text fallback
        recipe: parsed as Recipe
      };
    }
    
    // If it's JSON but not a recipe format, return as text
    return { text: typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2) };
  } catch (error) {
    // Not valid JSON, return as plain text
    return { text: response };
  }
};

// Конфигурация для разных типов инструментов
const toolConfigs = {
  'master-chef': {
    title: 'Master Chef',
    description: 'Snap your ingredients. We will turn them into nourishing recipes, complete with a full nutritional breakdown. Because eating well should be that simple\nPrice: Free',
    iconName: 'Crown',
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-600/10',
    gradient: 'from-amber-400 via-orange-500 to-red-600',
    bgGradient: 'from-amber-400/10 via-orange-500/10 to-red-600/10',
    placeholder: 'Ask me for meal planning, nutrition advice, dietary analysis, or healthy recipe suggestions...'
  },
  'master-nutritionist': {
    title: 'Master Nutritionist',
    description: 'Advanced nutritional analysis and meal optimization with scientific precision, macro tracking, and health goal alignment\nPrice: Free',
    iconName: 'Activity',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-600/10',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    bgGradient: 'from-emerald-400/10 via-green-500/10 to-teal-600/10',
    placeholder: 'Tell us your challenge. We\'ll turn it into a recipe for wellness'
  },
  'cal-tracker': {
    title: 'Cal Tracker',
    description: 'Intelligent calorie and nutrient tracking\nPrice: Free',
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
  const [description, setDescription] = useState<string>('');
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
      'master-nutritionist': 0, // Free tool - always enabled regardless of credit balance
      'cal-tracker': 0, // Free tool - always enabled regardless of credit balance
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
  
  // Get dynamic form schema based on tool type
  const currentFormSchema = getFormSchema(toolId);
  
  const form = useForm<z.infer<typeof currentFormSchema>>({
    resolver: zodResolver(currentFormSchema),
    defaultValues: toolId === 'master-nutritionist' ? {
      description: '',
      image: null,
    } : {
      image: null,
      description: '',
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
  }, [userId, loadCreditBalance]);

  // Reset form when tool changes
  useEffect(() => {
    if (toolId === 'master-nutritionist') {
      form.reset({ description: '', image: null });
      setDescription('');
    } else {
      form.reset({ image: null, description: '' });
    }
    setUploadedImage(null);
  }, [toolId, form]);

  const isLoading = form.formState.isSubmitting || isSubmitting;

  const onSubmit = async (values: z.infer<typeof currentFormSchema>) => {
    // Validation based on tool type
    if (toolId === 'master-nutritionist') {
      if (isSubmitting || !values.description?.trim()) return; // Prevent double submission and ensure description exists
    } else {
      if (isSubmitting || !uploadedImage) return; // Prevent double submission and ensure image exists
    }
    
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
      
      let webhookResponse;
      let userMessage: ChatCompletionRequestMessage;

      if (toolId === 'master-nutritionist') {
        // Master Nutritionist - send description with N8N URL
        userMessage = {
          role: "user",
          content: `[Description: ${values.description}] - Processing nutritional analysis...`,
        };

        // Add user message to UI immediately
        setMessages((current) => [...current, userMessage]);

        // Send description directly to the N8N webhook URL specified in the description
        webhookResponse = await webhookClient.sendDescriptionToWebhookWithRetry(
          values.description || '',
          toolId,
          userId || undefined,
          2, // maxRetries
          45000 // timeoutMs
        );
      } else {
        // Other tools - send image file
        const defaultPrompt = `Analyze this food image and provide recipe suggestions, nutritional information, or cooking recommendations based on what you see.`;
        
        userMessage = {
          role: "user",
          content: `[Image uploaded: ${uploadedImage?.name}] - Analyzing food image...`,
        };

        // Add user message to UI immediately
        setMessages((current) => [...current, userMessage]);

        // Send file directly to n8n webhook using multipart/form-data with retry logic
        webhookResponse = await webhookClient.sendFileToWebhookWithRetry(
          uploadedImage!,
          toolId,
          defaultPrompt,
          userId || undefined,
          2, // maxRetries
          45000 // timeoutMs
        );
      }

      if (webhookResponse.success && webhookResponse.data) {
        let assistantMessage: ChatCompletionRequestMessage;
        let successMessage: string;

        // Handle Master Nutritionist responses with friendly formatting
        if (toolId === 'master-nutritionist') {
          const friendlyResponse = friendlyFormatter.formatResponse(webhookResponse.data.response);
          
          assistantMessage = {
            role: "assistant",
            content: friendlyResponse.greeting, // Use greeting as main content
            friendlyResponse: friendlyResponse, // Include full friendly response data
          };
          
          successMessage = `✨ Personalized nutrition guidance ready in ${(webhookResponse.data.processingTime / 1000).toFixed(1)}s!`;
        } else if (toolId === 'cal-tracker') {
          // Handle Cal-Tracker responses with positive, imaginative formatting
          const calTrackerResponse = calTrackerFormatter.formatResponse(webhookResponse.data.response);
          
          assistantMessage = {
            role: "assistant",
            content: calTrackerResponse.greeting, // Use greeting as main content
            calTrackerResponse: calTrackerResponse, // Include full cal tracker response data
          };
          
          successMessage = `🎯 Amazing nutrition analysis complete in ${(webhookResponse.data.processingTime / 1000).toFixed(1)}s!`;
        } else {
          // Handle other tools with recipe parsing
          const parsedResponse = parseRecipeResponse(webhookResponse.data.response);
          
          assistantMessage = {
            role: "assistant",
            content: parsedResponse.text,
            recipeData: parsedResponse.recipe, // Include recipe data if present
          };
          
          successMessage = parsedResponse.recipe 
            ? `Recipe generated in ${(webhookResponse.data.processingTime / 1000).toFixed(1)}s!`
            : `Response received in ${(webhookResponse.data.processingTime / 1000).toFixed(1)}s`;
        }
        
        setMessages((current) => [...current, assistantMessage]);
        
        // Update local credit balance (optimistic update) - skip for free tools
        if (toolPrice > 0) {
          setUsedCredits(prev => prev + toolPrice);
        }
        
        // Show success feedback
        toast.success(successMessage);
        
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
        if (toolId === 'master-nutritionist') {
          form.reset({ description: '', image: null });
          setDescription('');
        } else {
          form.reset({ image: null, description: '' });
          setUploadedImage(null);
        }
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
              "grid grid-cols-12 gap-4",
              // Ensure proper container sizing and responsive behavior
              "w-full max-w-4xl mx-auto",
              "sm:p-4 md:p-6 lg:p-8"
            )}
          >
            {/* Input Section - Conditional based on tool type */}
            <div className="col-span-12">
              {toolId === 'master-nutritionist' ? (
                // Master Nutritionist - Description Input
                <div>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium mb-2">Enter Analysis Description</h3>
                  </div>
                  <FormField
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-2">
                            <textarea
                              {...field}
                              placeholder={currentTool.placeholder}
                              className={cn(
                                inputStyles.base,
                                "w-full min-h-[200px] h-auto resize-y",
                                "border border-gray-300 rounded-lg p-4",
                                "placeholder:text-sm placeholder:text-gray-500",
                                "focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500",
                                "transition-all duration-200",
                                "text-base leading-relaxed",
                                // Responsive sizing
                                "sm:min-h-[180px] md:min-h-[200px] lg:min-h-[240px]",
                                "sm:p-3 md:p-4 lg:p-5"
                              )}
                              value={description}
                              onChange={(e) => {
                                setDescription(e.target.value);
                                field.onChange(e.target.value);
                              }}
                            />
                            <div className="flex justify-end text-xs text-gray-500">
                              <span>{description.length}/1000 characters</span>
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                // Other tools - Image Upload
                <div>
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium mb-2">Upload Food Image</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Upload an image of food and our AI will analyze it to provide nutrition data.
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
              )}
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
                          ((toolId === 'master-nutritionist' ? !description.trim() : !uploadedImage) || isLoading || hasInsufficientCredits || isLoadingCredits) && "opacity-50 cursor-not-allowed"
                        )}
                        type="submit"
                        disabled={(toolId === 'master-nutritionist' ? !description.trim() : !uploadedImage) || isLoading || hasInsufficientCredits || isLoadingCredits}
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
                    ) : toolId === 'master-nutritionist' ? (
                      !description.trim() ? (
                        <p>Please enter your challenge description</p>
                      ) : hasInsufficientCredits ? (
                        <p>Insufficient credits. You need {toolPrice} but have {availableCredits} available.</p>
                      ) : (
                        <p>Click to generate nutritional analysis (Free tool)</p>
                      )
                    ) : (
                      !uploadedImage ? (
                        <p>Please upload an image first</p>
                      ) : hasInsufficientCredits ? (
                        <p>Insufficient credits. You need {toolPrice} but have {availableCredits} available.</p>
                      ) : toolPrice === 0 ? (
                        <p>Click to generate AI analysis (Free tool)</p>
                      ) : (
                        <p>Click to generate AI analysis</p>
                      )
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
              label="No messages yet"
              gradient={currentTool.gradient}
            />
          )}
          <div className="flex flex-col-reverse gap-y-6">
            {messages.map((message, index) => (
              <div key={`${message.content}-${index}`} className="space-y-4">
                {/* User/Assistant message header */}
                <div
                  className={cn(
                    "flex items-start gap-x-4",
                    message.role === "user" 
                      ? "justify-end" 
                      : "justify-start"
                  )}
                >
                  {message.role !== "user" && <BotAvatar />}
                  <div
                    className={cn(
                      "max-w-md px-4 py-3 rounded-2xl",
                      message.role === "user"
                        ? "bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    )}
                  >
                    <p className="text-sm font-medium">
                      {message.role === "user" ? "You" : "Master Chef"}
                    </p>
                    {!message.recipeData && !message.calTrackerResponse && (
                      <p className="text-sm mt-1">{message.content}</p>
                    )}
                  </div>
                  {message.role === "user" && <UserAvatar />}
                </div>

                {/* Friendly response card for Master Nutritionist */}
                {message.role === "assistant" && message.friendlyResponse && (
                  <div className="w-full">
                    <FriendlyResponseCard 
                      response={message.friendlyResponse} 
                      gradient={currentTool.gradient}
                    />
                  </div>
                )}

                {/* Cal-Tracker response card for positive, imaginative nutrition analysis */}
                {message.role === "assistant" && message.calTrackerResponse && (
                  <div className="w-full">
                    <CalTrackerResponseCard 
                      response={message.calTrackerResponse} 
                      gradient={currentTool.gradient}
                    />
                  </div>
                )}

                {/* Recipe card for structured responses */}
                {message.role === "assistant" && message.recipeData && !message.friendlyResponse && !message.calTrackerResponse && (
                  <div className="w-full">
                    <RecipeCard 
                      data={message.recipeData} 
                      gradient={currentTool.gradient}
                    />
                  </div>
                )}

                {/* Fallback text for non-structured assistant responses */}
                {message.role === "assistant" && !message.recipeData && !message.friendlyResponse && !message.calTrackerResponse && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded border">
                      {message.content}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FeatureContainer>
  );
};

export default ConversationPage;
