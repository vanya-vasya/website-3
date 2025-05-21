"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "How can Neuvisia help me as a creative professional?",
    answer:
      "Neuvisia offers specialized AI tools for video creators, digital artists, musicians, and content creators. Depending on your profession, you can access tools like video script generation, concept art creation, music composition, voiceover creation, and social media content generation to enhance your creative workflow.",
  },
  {
    question: "Can I use Neuvisia for commercial projects?",
    answer:
      "Yes, all content created with Neuvisia can be used for both personal and commercial projects. You retain full rights to the content you generate using our platform, making it ideal for professional creative work.",
  },
  {
    question: "Do I need to be technically skilled to use Neuvisia?",
    answer:
      "Not at all. Neuvisia is designed with creative professionals in mind, with an intuitive interface that requires no technical expertise. Simply describe what you want to create, and our AI tools will handle the complex work for you.",
  },
  {
    question: "How do you ensure the quality of AI-generated creative content?",
    answer:
      "Our AI models are specifically trained on high-quality creative content relevant to each profession. We continuously refine our models to ensure they produce professional-grade results that meet industry standards for video, art, music, and content creation.",
  },
  {
    question: "Can I customize the AI-generated content for my specific needs?",
    answer:
      "Absolutely. All our creative tools allow for detailed customization through specific prompts and parameters. You maintain creative control while leveraging AI to speed up your workflow and enhance your creative capabilities.",
  },
  {
    question: "How much do different generations cost?",
    answer:
      "The cost of generating content ranges from 1 to 5 tokens, depending on the type of generation. You can find more details about specific costs on our website.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index: any) => {
    console.log("index", index);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq">
      <div className="p-8 bg-slate-900 rounded shadow relative">
        <div className="mb-8 text-center">
          <div className="feature-one__color-overly-1 flaot-bob-y top-[-350px]"></div>
          <h1 className="text-3xl font-bold text-white">
            Frequently Asked Questions
          </h1>
        </div>
        <div className="feature-one__color-overly-1 flaot-bob-y top-[10px]"></div>

        <ul>
          {faqData.map((faq, index) => (
            <li key={index} className="mb-4 mt-4">
              <div className="flex justify-center">
                <button
                  className="w-full sm:max-w-[1600px] text-left p-4 bg-slate-800 rounded-lg shadow hover:ring-2 hover:ring-pink-600 text-white"
                  onClick={() => toggleFAQ(index)}
                >
                  {index + 1}. <span className="question">{faq.question}</span>
                </button>
              </div>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-slate-700 w-full sm:max-w-[1600px] mx-auto text-left rounded-lg shadow-inner mt-2 text-white">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Faq;
