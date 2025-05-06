import { Heading } from "@/components/heading";
import { MODEL_GENERATIONS_PRICE } from "@/constants";
import { ArchiveRestore } from "lucide-react";
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
        title="Image Restore"
        description="Refine images by removing noise and imperfections."
        generationPrice={MODEL_GENERATIONS_PRICE.imageGeneration}
        icon={ArchiveRestore}
        iconColor="text-yellow-600"
        bgColor="bg-yellow-600/10"
      />
      <section className="mt-10">
        <TransformationForm
          userId={user.id}
          type={"restore" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice={MODEL_GENERATIONS_PRICE.imageGeneration}
        />
      </section>
    </div>
   );
}
 
export default ImageObjectRemovePage;