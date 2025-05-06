"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "How do I access Neuvisia's tools?",
    answer:
      "You can access all of Neuvisia’s tools by logging into your account on our website from any device with a stable internet connection. There’s no need for additional software.",
  },
  {
    question: "Is there a limit to how many generations I can make?",
    answer:
      "There are no strict limits to the number of generations you can make. However, your usage may be limited by the number of tokens available in your account, which you can easily track on your dashboard.",
  },
  {
    question: "How do you ensure my privacy and security?",
    answer:
      "We ensure your privacy by keeping all data anonymous. We don’t store or track your creations, so your personal information and work remain fully secure.",
  },
  {
    question: "What do I need to use Neuvisia?",
    answer:
      "To use Neuvisia, you only need a reliable internet connection and a modern web browser. There's no need for specific software or hardware.",
  },
  {
    question: "What types of content can I create with Neuvisia?",
    answer:
      "With Neuvisia, you can create a variety of content, including text, images, music, videos, code, and audio. The platform is always evolving, with new features being added regularly.",
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
