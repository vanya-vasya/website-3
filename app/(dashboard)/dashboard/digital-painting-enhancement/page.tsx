import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import TransformationForm from "@/components/shared/TransformationForm";
import { getUserAvailableGenerations } from "@/lib/utils";
import { FeatureContainer } from "@/components/feature-container";
import { contentStyles } from "@/components/ui/feature-styles";
import { MODEL_GENERATIONS_PRICE } from "@/constants";

// Кастомные плейсхолдеры для полей ввода
const customPlaceholders = {
  prompt: "Enhance and refine this digital painting",
};

const DigitalPaintingEnhancementPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  if (!user) redirect("/sign-in");

  const balance = getUserAvailableGenerations(user);

  return (
    <div className="bg-white">
      <FeatureContainer
      title="Digital Painting Enhancement"
      description={`Enhance and refine your digital paintings with AI assistance. (Price: ${MODEL_GENERATIONS_PRICE.imageRestore} credits)`}
      iconName={"BrushIcon"}
      iconColor="text-pink-500"
      bgColor="bg-pink-500/10"
    >
      <div className={contentStyles.base}>
        <TransformationForm
          userId={user.id}
          type={"restore" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice={MODEL_GENERATIONS_PRICE.imageRestore}
          data={customPlaceholders}
        />
      </div>
    </FeatureContainer>
    </div>
  );
};

export default DigitalPaintingEnhancementPage;
