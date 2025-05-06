import { Code, FileImage, MessageSquare, Mic, FileAudio, FileVideo2, PaintBucket, ArchiveRestore, ImageMinus, BrushIcon, Scissors } from "lucide-react";

export const GENERATIONS_PRICE = 0.05;

export const MODEL_GENERATIONS_PRICE = {
  conversation: 1,
  imageGeneration: 14,
  imageBackgroundRemoval: 17,
  imageGenerativeFill: 20,
  imageObjectRecolor: 16,
  imageObjectRemove: 28,
  imageRestore: 11,
  videoGeneration: 20,
  musicGeneration: 11,
  speecGeneration: 13,
  codeGeneration: 5
}

export const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/dashboard/conversation',
    color: "text-red-600", 
    bgColor: "bg-red-600/10", 
  },
  {
    label: 'Image Generation',
    icon: FileImage,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: '/dashboard/image-generation',
  },
  {
    label: 'Image Restore',
    icon: ArchiveRestore,
    color: "text-yellow-600",
    bgColor: "bg-yellow-600/10",
    href: '/dashboard/image-restore',
  },
  {
    label: 'Image Background Removal',
    icon: ImageMinus,
    color: "text-lime-600",
    bgColor: "bg-lime-600/10",
    href: '/dashboard/image-background-removal',
  },
  {
    label: 'Image Generative Fill',
    icon: PaintBucket,
    color: "text-emerald-600",
    bgColor: "bg-emerald-600/10",
    href: '/dashboard/image-generative-fill',
  },
  {
    label: 'Image Object Recolor',
    icon: BrushIcon,
    color: "text-cyan-600",
    bgColor: "bg-cyan-600/10",
    href: '/dashboard/image-object-recolor',
  },  
  {
    label: 'Image Object Remove',
    icon: Scissors,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    href: '/dashboard/image-object-remove',
  },
  {
    label: 'Video Generation',
    icon: FileVideo2,
    color: "text-indigo-600",
    bgColor: "bg-indigo-600/10",
    href: '/dashboard/video',
  },
  {
    label: 'Music Generation',
    icon: FileAudio,
    href: '/dashboard/music',
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: 'Speech Generation',
    icon: Mic,
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-600/10",
    href: '/dashboard/speech',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-rose-600",
    bgColor: "bg-rose-600/10",
    href: '/dashboard/code',
  },
];

export const toolsModal = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/dashboard/conversation',
    color: "text-violet-500", 
    bgColor: "bg-violet-500/10", 
  },
  {
    label: 'Images',
    icon: FileImage,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: '/dashboard/image-generation',
  },
  {
    label: 'Video Generation',
    icon: FileVideo2,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: '/dashboard/video',
  },
  {
    label: 'Music Generation',
    icon: FileAudio,
    href: '/dashboard/music',
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: 'Speech Generation',
    icon: Mic,
    color: "text-cyan-600",
    bgColor: "bg-cyan-600/10",
    href: '/dashboard/speech',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/dashboard/code',
  },
];

export const navLinks = [
  {
    label: "Home",
    route: "/",
    icon: "/assets/icons/home.svg",
  },
  {
    label: "Image Restore",
    route: "/transformations/add/restore",
    icon: "/assets/icons/image.svg",
  },
  {
    label: "Generative Fill",
    route: "/transformations/add/fill",
    icon: "/assets/icons/stars.svg",
  },
  {
    label: "Object Remove",
    route: "/transformations/add/remove",
    icon: "/assets/icons/scan.svg",
  },
  {
    label: "Object Recolor",
    route: "/transformations/add/recolor",
    icon: "/assets/icons/filter.svg",
  },
  {
    label: "Background Remove",
    route: "/transformations/add/removeBackground",
    icon: "/assets/icons/camera.svg",
  },
  {
    label: "Profile",
    route: "/profile",
    icon: "/assets/icons/profile.svg",
  },
  {
    label: "Buy Credits",
    route: "/credits",
    icon: "/assets/icons/bag.svg",
  },
];


export const transformationTypes = {
  restore: {
    type: "restore",
    title: "Restore Image",
    subTitle: "Refine images by removing noise and imperfections",
    config: { restore: true },
    icon: "image.svg",
  },
  removeBackground: {
    type: "removeBackground",
    title: "Background Remove",
    subTitle: "Removes the background of the image using AI",
    config: { removeBackground: true },
    icon: "camera.svg",
  },
  fill: {
    type: "fill",
    title: "Generative Fill",
    subTitle: "Enhance an image's dimensions using AI outpainting",
    config: { fillBackground: true },
    icon: "stars.svg",
  },
  remove: {
    type: "remove",
    title: "Object Remove",
    subTitle: "Identify and eliminate objects from images",
    config: {
      remove: { prompt: "", removeShadow: true, multiple: true },
    },
    icon: "scan.svg",
  },
  recolor: {
    type: "recolor",
    title: "Object Recolor",
    subTitle: "Identify and recolor objects from the image",
    config: {
      recolor: { prompt: "", to: "", multiple: true },
    },
    icon: "filter.svg",
  },
};

export const aspectRatioOptions = {
  "1:1": {
    aspectRatio: "1:1",
    label: "Square (1:1)",
    width: 1000,
    height: 1000,
  },
  "3:4": {
    aspectRatio: "3:4",
    label: "Standard Portrait (3:4)",
    width: 1000,
    height: 1334,
  },
  "9:16": {
    aspectRatio: "9:16",
    label: "Phone Portrait (9:16)",
    width: 1000,
    height: 1778,
  },
  "4:3": {
    aspectRatio: "4:3",
    label: "Standard (4:3)",
    width: 1000,
    height: 750,
  },
  "16:9": {
    aspectRatio: "16:9",
    label: "Widescreen (16:9)",
    width: 1000,
    height: 563,
  },
  "3:2": {
    aspectRatio: "3:2",
    label: "Photo (3:2)",
    width: 1000,
    height: 667,
  },
  "5:4": {
    aspectRatio: "5:4",
    label: "Print (5:4)",
    width: 1000,
    height: 800,
  },
  "2:1": {
    aspectRatio: "2:1",
    label: "Panorama (2:1)",
    width: 1000,
    height: 500,
  },
  "21:9": {
    aspectRatio: "21:9",
    label: "Ultra-Widescreen (21:9)",
    width: 1000,
    height: 429,
  },
  "2:3": {
    aspectRatio: "2:3",
    label: "Portrait (2:3)",
    width: 1000,
    height: 1500,
  },
  "5:7": {
    aspectRatio: "5:7",
    label: "Classic (5:7)",
    width: 1000,
    height: 1400,
  },
  "16:10": {
    aspectRatio: "16:10",
    label: "Widescreen (16:10)",
    width: 1000,
    height: 625,
  },
};


export const defaultValues = {
  title: "",
  aspectRatio: "",
  color: "",
  prompt: "",
  publicId: "",
};

export const creditFee = -1;