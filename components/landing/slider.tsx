"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const creatorTools = [
  {
    icon: "/images/icons/chat.png",
    title: "Video Scripts",
    description:
      "Create professional video scripts, storyboards and scenarios for your next production.",
    bgImage: "/images/backgrounds/video-scripts-bg.jpg",
    color: "from-purple-600 to-pink-600",
  },
  {
    icon: "/images/icons/photo.png",
    title: "Concept Art",
    description:
      "Generate stunning concept art and illustrations for your creative projects.",
    bgImage: "/images/backgrounds/concept-art-bg.jpg",
    color: "from-blue-600 to-violet-600",
  },
  {
    icon: "/images/icons/music-note.png",
    title: "Music Composition",
    description:
      "Create original music and melodies for your projects with AI-powered composition.",
    bgImage: "/images/backgrounds/music-bg.jpg",
    color: "from-green-500 to-teal-600",
  },
  {
    icon: "/images/icons/web-programming.png",
    title: "Social Media Content",
    description:
      "Generate engaging social media posts, captions, and content calendars for your brand.",
    bgImage: "/images/backgrounds/social-media-bg.jpg",
    color: "from-orange-500 to-red-600",
  },
  {
    icon: "/images/icons/audio.png",
    title: "Voiceovers",
    description:
      "Create professional-quality voiceovers and narration for your videos and content.",
    bgImage: "/images/backgrounds/voiceover-bg.jpg",
    color: "from-indigo-600 to-blue-500",
  },
  {
    icon: "/images/icons/video-camera.png",
    title: "Video Creation",
    description:
      "Generate engaging video content from your scripts and creative ideas.",
    bgImage: "/images/backgrounds/video-creation-bg.jpg",
    color: "from-pink-500 to-rose-600",
  },
];

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (autoplay) {
      interval = setInterval(() => {
        setActiveIndex((current) => (current + 1) % creatorTools.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
    // Restart autoplay after 10 seconds of inactivity
    setTimeout(() => setAutoplay(true), 10000);
  };

  // Calculate the visible tools (current, prev, next)
  const getPrevIndex = (index: number) =>
    index === 0 ? creatorTools.length - 1 : index - 1;
  const getNextIndex = (index: number) =>
    index === creatorTools.length - 1 ? 0 : index + 1;

  return (
    <section
      id="features"
      className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-slate-900"
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]"></div>

      {/* Background elements */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-purple-900/30 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-pink-800/30 rounded-full filter blur-3xl"></div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center space-y-8 text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bold text-4xl sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
          >
            Creator Tools
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-lg sm:text-xl text-gray-300"
          >
            Neuvisia offers specialized tools for each creative profession.
            Whether you&apos;re a video creator, digital artist, musician, or
            content creator, our AI-powered platform provides professional-grade
            tools designed specifically for your creative needs.
          </motion.p>
        </div>

        {/* 3D Card Slider */}
        <div className="relative h-[500px] w-full max-w-6xl mx-auto">
          {creatorTools.map((tool, index) => {
            // Determine if this card is active, previous, or next
            const isActive = index === activeIndex;
            const isPrev = index === getPrevIndex(activeIndex);
            const isNext = index === getNextIndex(activeIndex);
            const isVisible = isActive || isPrev || isNext;

            if (!isVisible) return null;

            let position: "center" | "left" | "right";
            if (isActive) position = "center";
            else if (isPrev) position = "left";
            else position = "right";

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  x:
                    position === "center"
                      ? 0
                      : position === "left"
                      ? "-55%"
                      : "55%",
                  scale: position === "center" ? 1 : 0.8,
                  opacity: position === "center" ? 1 : 0.6,
                  zIndex: position === "center" ? 30 : 10,
                  rotateY:
                    position === "center" ? 0 : position === "left" ? 15 : -15,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute top-0 left-0 right-0 mx-auto w-full max-w-2xl h-[500px] cursor-pointer perspective-1000"
                onClick={() => {
                  if (!isActive) {
                    setActiveIndex(index);
                    setAutoplay(false);
                    setTimeout(() => setAutoplay(true), 10000);
                  }
                }}
              >
                <div className="relative w-full h-full transform-style-3d rounded-2xl shadow-lg overflow-hidden">
                  {/* Background image with overlay */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900 to-black opacity-60"></div>

                  {/* Glowing border */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-100 blur transition-opacity animate-pulse`}
                  ></div>

                  {/* Content */}
                  <div className="absolute inset-0 z-10 p-8 flex flex-col items-center justify-center text-center">
                    <div className="mb-6 relative w-24 h-24 flex items-center justify-center">
                      <div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${tool.color} opacity-20 blur-xl`}
                      ></div>
                      <div className="relative bg-gray-900/80 p-4 rounded-full backdrop-blur-sm">
                        <Image
                          src={tool.icon}
                          alt={`${tool.title} icon`}
                          width={50}
                          height={50}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 text-white">
                      {tool.title}
                    </h3>

                    <p className="text-gray-300 mb-6 max-w-md">
                      {tool.description}
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-6 py-3 rounded-full bg-gradient-to-r ${tool.color} text-white font-semibold shadow-lg`}
                    >
                      Explore Tool
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-12 space-x-4">
          {creatorTools.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "bg-white w-8"
                  : "bg-gray-500 opacity-50 hover:opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Slider;
