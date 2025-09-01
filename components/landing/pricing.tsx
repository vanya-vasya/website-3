"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const pricingTiers = [
  {
    id: "Tracker",
    name: "Cal Tracker",
    description: "For a quick start",
    price: "£10",
    tokens: "1,000 Tokens",
    generations: "~20 Macros Generations",
    features: [
      "~20 Macros Generations"
    ],
    popular: false,
    color: "from-purple-600 to-pink-600",
  },
  {
    id: "master-chef",
    name: "Master Chef",
    description: "Best value for regular use",
    price: "£50",
    tokens: "2,000 Tokens",
    generations: "~40 Recipe Generations",
    features: [
      "~20 Macros Generations",
      "~20 Recipe Generations"
    ],
    popular: true,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "master-nutritionist",
    name: "Master Nutritionist",
    description: "Perfect for your specific needs.",
    price: "£100",
    tokens: "6,000 Tokens",
    generations: "~120 Recipe Generations",
    features: [
      "~40 Macros Generations",
      "~40 Recipe Generations",
      "~40 Nutritional Consulting Generations"
    ],
    popular: false,
    color: "from-blue-600 to-violet-600",
  },
  {
    id: "digest",
    name: "Digest",
    description: "Coming soon",
    price: "",
    tokens: "",
    features: [ ],
    popular: false,
    color: "from-orange-500 to-red-600",
  }
];

const Pricing = () => {
  const [customAmount, setCustomAmount] = useState("");

  const handleGetStarted = (tierId: string) => {
    // Handle payment logic here
    console.log(`Get started with ${tierId}`);
  };

  return (
    <section
      id="pricing"
      className="relative overflow-hidden py-16 md:py-24 lg:py-32 bg-slate-100"
    >
      <div className="container relative mx-auto px-4">
        <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-bold text-4xl sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
          >
            Pay-As-You-Go
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-slate-600"
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              fontWeight: 500,
              fontSize: '1.125rem',
              lineHeight: 1.6,
              letterSpacing: '0.01em',
            }}
          >
            Just pay-as-you-go tokens, with bigger packs for better value
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`relative rounded-2xl p-6 bg-white shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                tier.popular 
                  ? "border-green-400 ring-2 ring-green-400 ring-opacity-50" 
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <h3 
                    className="text-xl font-bold text-slate-900"
                    style={{
                      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    }}
                  >
                    {tier.name}
                  </h3>
                  <p 
                    className="text-slate-600 text-sm"
                    style={{
                      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    }}
                  >
                    {tier.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center space-y-1">
                  <div 
                    className="text-4xl font-bold text-slate-900"
                    style={{
                      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    }}
                  >
                    {tier.price}
                  </div>
                  {tier.tokens && (
                    <div className="space-y-1">
                      <p 
                        className="text-green-600 font-semibold"
                        style={{
                          fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      >
                        {tier.tokens}
                      </p>
                    </div>
                  )}
                </div>

                {/* Custom Amount Input */}
                {tier.id === "custom" && (
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-semibold">£</span>
                      <input
                        type="number"
                        placeholder="25"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        style={{
                          fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      />
                    </div>
                    <label className="flex items-center space-x-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span 
                        style={{
                          fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        }}
                      >
                        I Feel Lucky (+10-25%)
                      </span>
                    </label>
                  </div>
                )}

                {/* Button */}
                {tier.id !== "digest" && (
                  <button
                    onClick={() => handleGetStarted(tier.id)}
                    className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                      tier.popular
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                        : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900"
                    }`}
                    style={{
                      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    }}
                  >
                    {tier.id === "custom" ? "Choose Amount" : "Begin"}
                  </button>
                )}

                {/* Features */}
                {tier.id !== "digest" && (
                  <div className="space-y-3">
                    <h4 
                      className="text-sm font-semibold text-slate-900 uppercase tracking-wide"
                      style={{
                        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      }}
                    >
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span 
                            className="text-slate-600 text-sm"
                            style={{
                              fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                            }}
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
