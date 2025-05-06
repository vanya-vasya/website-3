"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import MediaUploader from "./MediaUploader"
import TransformedImage from "./TransformedImage"
import { useProModal } from "@/hooks/use-pro-modal"


export const baseSchema = z.object({
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const createSchema = (type:string) => {
  if (type === 'recolor') {
    return baseSchema.extend({
      color: z.string({required_error: "This field is required",} ).min(1, "This field is required."),
      prompt: z.string({required_error: "This field is required",}).min(1, "This field is required."),
    });
  }
  else if (type === 'fill') {
    return baseSchema.extend({
      aspectRatio: z.string({required_error: "This field is required",}),
    });
  }
  else if (type === 'remove') {
    return baseSchema.extend({
      prompt: z.string({required_error: "This field is required",}).min(1, "This field is required."),
    });
  }

  return baseSchema;
};

const TransformationForm = ({ data = null, userId, type, creditBalance, config = null,  generationPrice }: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true)
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config)

  const proModal = useProModal();
  
   // 1. Define your form.
   const formSchema = createSchema(type);

   const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    if(image){
      setIsButtonDisabled(false)
    }
    const imageSize = aspectRatioOptions[value as AspectRatioKey]
    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }))

    setNewTransformation(transformationType.config);

    return onChangeField(value)
  }

  const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
    if(image){
      setIsButtonDisabled(false)
    }
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === 'prompt' ? 'prompt' : 'to' ]: value 
        }
      }))
    }, 200)();
    return onChangeField(value)
  }


  useEffect(() => {
    if(image && (type === 'restore' || type === 'removeBackground')) {
      setNewTransformation(transformationType.config)
    }
  }, [image, transformationType.config, type])


  const onSubmit = (values: z.infer<typeof formSchema>) => {

    if(creditBalance>=generationPrice){
      setIsTransforming(true)
      setIsButtonDisabled(true)
      
      setTransformationConfig(
        deepMergeObjects(newTransformation, transformationConfig)
      )
    }
    else{
      proModal.onOpen();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>

        {type === 'fill' && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full text-white"
            render={({ field }) => (
              <Select
                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                value={field.value || ''}
              >
                <SelectTrigger className="select-field text-white border-emerald-600">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 text-white border-emerald-600">
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}  
          />
        )}

        {type === 'remove' && (
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
            <CustomField 
              control={form.control}
              name="prompt"
              formLabel="Object to remove"
              className="w-full text-white"
              render={({ field }) => (
                <Input 
                  value={field.value || ''}
                  className="border-blue-600 input-field outline-none focus-visible:ring-0 focus-visible:ring-transparent text-white placeholder:text-white/30"
                  onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                  )}
                />
              )}
            />
          </div>
        )}

        {type === 'recolor' && (
          <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
            <CustomField 
              control={form.control}
              name="prompt"
              formLabel="Object to recolor"
              className="w-full text-white"
              render={({ field }) => (
                <Input 
                  value={field.value || ''}
                  className="border-cyan-600 input-field outline-none focus-visible:ring-0 focus-visible:ring-transparent text-white placeholder:text-white/30"
                  onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                  )}

                />
              )}
            />

            {type === 'recolor' && (
              <CustomField 
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full text-white"
                render={({ field }) => (
                  <Input 
                    value={field.value || ''}
                    className="border-cyan-600 input-field outline-none focus-visible:ring-0 focus-visible:ring-transparent text-white placeholder:text-white/30"
                    onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-4 md:grid-cols-2">
          <CustomField 
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader 
                creditBalance={creditBalance}
                generationPrice={generationPrice}
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
                setTransformationConfig={setTransformationConfig}
                setIsButtonDisabled={setIsButtonDisabled}
              />
            )}
          />

          <TransformedImage 
            image={image}
            type={type}
            title={"Transformed Image"}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
            userId={userId}
            generationPrice={generationPrice}
          />
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            type="submit"
            className="submit-button capitalize"
            disabled={isButtonDisabled}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default TransformationForm