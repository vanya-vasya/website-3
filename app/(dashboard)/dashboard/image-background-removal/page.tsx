import { Heading } from "@/components/heading";
import { MODEL_GENERATIONS_PRICE } from "@/constants";
import { ImageMinus } from "lucide-react";
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
        title="Background Removal"
        description="Quick background removal to bring your subject into focus."
        generationPrice={MODEL_GENERATIONS_PRICE.imageBackgroundRemoval}
        icon={ImageMinus}
        iconColor="text-lime-600"
        bgColor="bg-lime-600/10"
      />
      <section className="mt-10">
        <TransformationForm 
          userId={user.id}
          type={"removeBackground" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice = {MODEL_GENERATIONS_PRICE.imageBackgroundRemoval}
        />
      </section>
    </div>
   );
}
 
export default ImageObjectRemovePage;