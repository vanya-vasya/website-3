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
  prompt: "Main subject or focus area",
  color: "Bright and eye-catching colors",
};

const ThumbnailOptimizerPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  if (!user) redirect("/sign-in");

  const balance = getUserAvailableGenerations(user);

  return (
    <div className="bg-white">
      <FeatureContainer
      title="Thumbnail Optimizer"
      description={`Create attention-grabbing thumbnails that increase your click-through rates. (Price: ${MODEL_GENERATIONS_PRICE.imageObjectRecolor} credits)`}
      iconName={"Image"}
      iconColor="text-emerald-500"
      bgColor="bg-emerald-500/10"
    >
      <div className={contentStyles.base}>
        <TransformationForm
          userId={user.id}
          type={"recolor" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice={MODEL_GENERATIONS_PRICE.imageObjectRecolor}
          data={customPlaceholders}
        />
      </div>
    </FeatureContainer>
    </div>
  );
};

export default ThumbnailOptimizerPage;
