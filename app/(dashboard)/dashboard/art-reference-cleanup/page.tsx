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
  prompt: "Background elements, watermarks, or distracting objects",
};

const ArtReferenceCleanupPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  if (!user) redirect("/sign-in");

  const balance = getUserAvailableGenerations(user);

  return (
    <div className="bg-white">
      <FeatureContainer
      title="Art Reference Cleanup"
      description={`Clean up and prepare reference images for your artistic creations. (Price: ${MODEL_GENERATIONS_PRICE.imageObjectRemove} credits)`}
      iconName={"ImageMinus"}
      iconColor="text-pink-700"
      bgColor="bg-pink-700/10"
    >
      <div className={contentStyles.base}>
        <TransformationForm
          userId={user.id}
          type={"remove" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice={MODEL_GENERATIONS_PRICE.imageObjectRemove}
          data={customPlaceholders}
        />
      </div>
    </FeatureContainer>
    </div>
  );
};

export default ArtReferenceCleanupPage;
