import { Heading } from "@/components/heading";
import { MODEL_GENERATIONS_PRICE } from "@/constants";
import { Scissors } from "lucide-react";
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
        title="Object Remove"
        description="Easily clear out objects to focus on the important parts of your image."
        generationPrice={MODEL_GENERATIONS_PRICE.imageObjectRemove}
        icon={Scissors}
        iconColor="text-blue-600"
        bgColor="bg-blue-600/10"
      />
      <section className="mt-10">
        <TransformationForm 
          userId={user.id}
          type={"remove" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice={MODEL_GENERATIONS_PRICE.imageObjectRemove}
        />
      </section>
    </div>
   );
}
 
export default ImageObjectRemovePage;