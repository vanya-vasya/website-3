"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProModal } from "@/hooks/use-pro-modal";
import { FeatureContainer } from "@/components/feature-container";
import { inputStyles, buttonStyles, contentStyles, loadingStyles, cardStyles } from "@/components/ui/feature-styles";
import { cn } from "@/lib/utils";

import { formSchema, resolutionOptions } from "./constants";
import { MODEL_GENERATIONS_PRICE } from "@/constants";

const PhotoPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      resolution: "1024x1024",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/image", values);
      const urls = response.data.map((image: { url: string }) => image.url);
      setPhotos((prevPhotos) => [...prevPhotos, ...urls]);
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
      title="Image Generation"
      description={`Turn your prompt into an image using our advanced AI model. (Price: ${MODEL_GENERATIONS_PRICE.imageGeneration} credits)`}
      iconName={"ImageIcon"}
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
                <FormItem className="col-span-12 lg:col-span-7">
                  <FormControl className="m-0 p-0">
                    <Input
                      className={inputStyles.base}
                      disabled={isLoading}
                      placeholder="A picture of a horse in Swiss alps"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-3">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {resolutionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
          {photos.length === 0 && !isLoading && (
            <Empty label="No images generated." />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photos.map((src) => (
              <Card key={src} className={cn(cardStyles.base, cardStyles.interactive)}>
                <div className="relative aspect-square">
                  <Image fill alt="Generated" src={src} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
                <CardFooter className="p-2">
                  <Button
                    onClick={() => window.open(src)}
                    className={cn(buttonStyles.secondary, "w-full")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </FeatureContainer>
  );
}

export default PhotoPage;
