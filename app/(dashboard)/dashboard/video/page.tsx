"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";
import { FeatureContainer } from "@/components/feature-container";
import { inputStyles, buttonStyles, contentStyles, loadingStyles, cardStyles } from "@/components/ui/feature-styles";
import { cn } from "@/lib/utils";

import { formSchema } from "./constants";
import { MODEL_GENERATIONS_PRICE } from "@/constants";

const VideoPage = () => {
  const router = useRouter();
  const proModal = useProModal();
  const [video, setVideo] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);
      const response = await axios.post("/api/video", values);
      setVideo(response.data);
      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <FeatureContainer
      title="Video Generation"
      description={`Turn your prompt into video. Generation can take from 1 to 5 minutes. (Price: ${MODEL_GENERATIONS_PRICE.videoGeneration} credits)`}
      iconName={"FileVideo2"}
      iconColor="text-purple-500"
      bgColor="bg-purple-500/10"
    >
      <div className={contentStyles.base}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              inputStyles.container,
              "grid grid-cols-12 gap-2"
            )}
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className={inputStyles.base}
                      disabled={isLoading}
                      placeholder="Clown fish swimming in a coral reef"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className={cn(
                buttonStyles.base,
                "col-span-12 lg:col-span-2 w-full"
              )}
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Generate
            </Button>
          </form>
        </Form>
        <div className={contentStyles.section}>
          {isLoading && (
            <div className={loadingStyles.container}>
              <Loader />
            </div>
          )}
          {!video && !isLoading && <Empty label="No video files generated." />}
          {video && (
            <video
              controls
              className={cn(cardStyles.base, "w-full aspect-video")}
            >
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </FeatureContainer>
  );
};

export default VideoPage;
