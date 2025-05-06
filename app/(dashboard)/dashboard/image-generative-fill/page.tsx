import { Heading } from "@/components/heading";
import { MODEL_GENERATIONS_PRICE } from "@/constants";
import {  PaintBucket } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import TransformationForm from "@/components/shared/TransformationForm";
import { getUserAvailableGenerations } from "@/lib/utils";

const ImageObjectRemovePage = async () => {
  
  const {userId} = auth();
  
  if(!userId) redirect('/sign-in');
  
  const user = await getUserById(userId);  

  if(!user) redirect('/sign-in');
  
  const balance = getUserAvailableGenerations(user);

  return ( 
    <div>
      <Heading
        title="Generative Fill"
        description="Automatically adjust and fill your images to fit any aspect ratio."
        generationPrice={MODEL_GENERATIONS_PRICE.imageGenerativeFill}
        icon={PaintBucket}
        iconColor="text-emerald-600"
        bgColor="bg-emerald-600/10"
      />
      <section className="mt-10">
        <TransformationForm 
          userId={user.id}
          type={"fill" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice={MODEL_GENERATIONS_PRICE.imageGenerativeFill}
        />
      </section>
    </div>
   );
}
 
export default ImageObjectRemovePage;