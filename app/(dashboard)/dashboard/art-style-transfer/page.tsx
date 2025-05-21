"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import TransformationForm from "@/components/shared/TransformationForm";
import { FeatureContainer } from "@/components/feature-container";
import { contentStyles } from "@/components/ui/feature-styles";
import { MODEL_GENERATIONS_PRICE } from "@/constants";

// Кастомные плейсхолдеры для полей ввода
const customPlaceholders = {
  prompt: "Portrait painting in the style of Van Gogh with vibrant colors and swirling brushstrokes",
  color: "Van Gogh style" // Используем это поле для дополнительных указаний стиля
};

const ArtStyleTransferPage = () => {
  // Клиентский компонент не может использовать async
  // Аутентификация будет происходить в TransformationForm или через middleware

  return ( 
    <FeatureContainer
      title="Art Style Transfer"
      description={`Transform your artworks with different artistic styles and techniques using GPT Image. (Price: ${MODEL_GENERATIONS_PRICE.imageObjectRecolor} credits)`}
      iconName={"Wand2"}
      iconColor="text-rose-500"
      bgColor="bg-rose-500/10"
    >
      <div className={contentStyles.base}>
        <TransformationForm 
          userId={"432432423423"}
          type={"recolor" as TransformationTypeKey}
          creditBalance={9999999}
          generationPrice={MODEL_GENERATIONS_PRICE.imageObjectRecolor}
          data={customPlaceholders}
          useStyleTransfer={true} // Флаг для использования нового API вместо Cloudinary
        />
      </div>
    </FeatureContainer>
   );
}

export default ArtStyleTransferPage; 