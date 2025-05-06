"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";

import { Heading } from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Loader } from "@/components/loader";
import { Empty } from "@/components/ui/empty";
import { useProModal } from "@/hooks/use-pro-modal";

import { formSchema } from "./constants";
import { MODEL_GENERATIONS_PRICE } from "@/constants";

const SpeechPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [speechList, setSpeechList] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/speech', values);
      setSpeechList((prev) => [...prev, response.data]);
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
  }

  return ( 
    <div>
      <Heading
        title="Speech Generation"
        description="Turn your prompt into speech. Generation can take from 1 to 5 minutes."
        generationPrice={MODEL_GENERATIONS_PRICE.speecGeneration}
        icon={Mic}
        iconColor="text-fuchsia-600"
        bgColor="bg-fuchsia-600/10"
      />
      <div>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              border-fuchsia-600
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
          >
            <FormField
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent text-white placeholder:text-white/30"
                      disabled={isLoading} 
                      placeholder="Text to be read aloud..." 
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="col-span-12 lg:col-span-2 w-full bg-transparent border border-transparent border-fuchsia-600 text-fuchsia-600 hover:ring-2 hover:text-white transition duration-300"
              type="submit"
              disabled={isLoading}
              size="icon"
            >
              Generate
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="p-20">
            <Loader />
          </div>
        )}
        {speechList.length === 0 && !isLoading && (
          <Empty label="No speech generated." />
        )}
        <div className="space-y-4 mt-8">
          {speechList.map((speech, index) => (
            <div
              key={index}
              className="bg-slate-900 p-4 rounded-lg text-white"
            >
              <p className="mb-2 font-semibold">Audio {index + 1}</p>
              <audio controls className="w-full text-white ">
                <source src={speech} />
                Your browser does not support the audio element.
              </audio>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
 
export default SpeechPage;
