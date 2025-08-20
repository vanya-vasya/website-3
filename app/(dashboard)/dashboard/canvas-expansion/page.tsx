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
  prompt: "Expand canvas with matching style and elements",
};

const CanvasExpansionPage = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);

  if (!user) redirect("/sign-in");

  const balance = getUserAvailableGenerations(user);

  return (
    <div className="bg-white">
      <FeatureContainer
      title="Canvas Expansion"
      description={`Seamlessly expand your artworks beyond their original boundaries. (Price: ${MODEL_GENERATIONS_PRICE.imageGenerativeFill} credits)`}
      iconName={"LayoutGrid"}
      iconColor="text-rose-500"
      bgColor="bg-rose-500/10"
    >
      <div className={contentStyles.base}>
        <TransformationForm
          userId={user.id}
          type={"fill" as TransformationTypeKey}
          creditBalance={balance}
          generationPrice={MODEL_GENERATIONS_PRICE.imageGenerativeFill}
          data={customPlaceholders}
        />
      </div>
    </FeatureContainer>
    </div>
  );
};

export default CanvasExpansionPage;
