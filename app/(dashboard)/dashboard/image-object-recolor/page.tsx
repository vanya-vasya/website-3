import { Heading } from "@/components/heading";
import { MODEL_GENERATIONS_PRICE } from "@/constants";
import { Brush } from "lucide-react";
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
        title="Object Recolor"
        description="Easily change the color of objects to match your vision."
        generationPrice={MODEL_GENERATIONS_PRICE.imageObjectRecolor}
        icon={Brush}
        iconColor="text-cyan-600"
        bgColor="bg-cyan-600/10"
      />
      <section className="mt-10">
        <TransformationForm 
          userId={user.id}
          type={"recolor" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice={MODEL_GENERATIONS_PRICE.imageObjectRecolor}
        />
      </section>
    </div>
   );
}
 
export default ImageObjectRemovePage;