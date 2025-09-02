"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Split, FileX, Target, Shield } from "lucide-react";

const StoryPage = () => {
  return (
    <div className="bg-white relative" style={{'--contact-font': 'Inter, system-ui, -apple-system, sans-serif'} as React.CSSProperties & {'--contact-font': string}}>
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-24 lg:px-8" style={{ marginTop: '80px' }}>
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 
              className="text-black font-semibold leading-[1.1] tracking-[0.01em]" 
              style={{
                fontFamily: 'var(--contact-font)',
                fontSize: '2.5rem',
                textTransform: 'none'
              }}
            >
              Our Mission
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl text-base text-center mx-auto mt-6"
              style={{
                fontFamily: 'var(--contact-font)',
                fontWeight: 600,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#475569'
              }}
            >
              Empower every person to eat better by uniting AI culinary creativity, clinical-grade nutrition, and real-time coaching into one seamless experience
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        


        {/* Problem Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 mb-24"
        >
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
              The Problem We&apos;re Solving
            </h3>
            <div className="space-y-4">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl text-base text-left flex items-start gap-3"
                style={{
                  fontFamily: 'var(--contact-font)',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#475569'
                }}
              >
                <Split className="w-5 h-5 mt-0.5 text-slate-500 flex-shrink-0" />
                Food decisions are fragmented — recipes, nutrition, and tracking live in silos, creating friction and inconsistency
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl text-base text-left flex items-start gap-3"
                style={{
                  fontFamily: 'var(--contact-font)',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#475569'
                }}
              >
                <FileX className="w-5 h-5 mt-0.5 text-slate-500 flex-shrink-0" />
                Manual logging is inaccurate and unsustainable, especially with portions, mixed dishes, and diverse cuisines
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl text-base text-left flex items-start gap-3"
                style={{
                  fontFamily: 'var(--contact-font)',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#475569'
                }}
              >
                <Target className="w-5 h-5 mt-0.5 text-slate-500 flex-shrink-0" />
                Advice is generic, not goal-aligned or context-aware, so progress stalls
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl text-base text-left flex items-start gap-3"
                style={{
                  fontFamily: 'var(--contact-font)',
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  textTransform: 'none',
                  color: '#475569'
                }}
              >
                <Shield className="w-5 h-5 mt-0.5 text-slate-500 flex-shrink-0" />
                People need trusted, privacy-first guidance that adapts in real time to their bodies, preferences, and constraints
              </motion.p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src="/images/creator-empty.png"
                alt="Empty creative workspace"
                width={600}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Solution Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 mb-24"
        >
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src="/chat.png"
                alt="AI-powered creative assistant"
                width={600}
                height={450}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
              Our Solution
            </h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl text-base text-left mb-6"
              style={{
                fontFamily: 'var(--contact-font)',
                fontWeight: 600,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#475569'
              }}
            >
              A unified platform that converts photos and intent into action—turning ingredients into real recipes, meals into precise macro insights, and daily choices into measurable momentum. It blends model-driven perception, nutrition science, and behavioral design to deliver instant clarity and continuous coaching at every bite.
            </motion.p>

          </div>
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="rounded-2xl bg-gray-50 px-8 py-12">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
              Our Vision for the Future
            </h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl text-base text-center mb-6"
              style={{
                fontFamily: 'var(--contact-font)',
                fontWeight: 600,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#475569'
              }}
            >
              Food decisions become ambient, precise, and joyful—guided by AI that understands your context and culture, not just your calories.               We will set the global standard for responsible food AI, proving that delight and scientific rigor can coexist at scaleя

            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl text-base text-center"
              style={{
                fontFamily: 'var(--contact-font)',
                fontWeight: 600,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: '#475569'
              }}
            >
            </motion.p>
          </div>
        </motion.div>
      </div>
      
      <style jsx global>{`
        /* Ensure header has proper z-index and positioning */
        header {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          z-index: 9999 !important;
          background: white !important;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Ensure body has proper scroll behavior */
        body {
          padding-top: 0 !important;
        }
        
        /* Ensure all nav links are clickable */
        .nav-link {
          pointer-events: auto !important;
          cursor: pointer !important;
        }
        
        /* Ensure dropdown works properly */
        .dropdown-menu {
          z-index: 10000 !important;
        }
      `}</style>
    </div>
  );
};

export default StoryPage;
