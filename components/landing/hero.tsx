"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section 
      id="home" 
      className="feature-one animate__flip pb-8 relative overflow-hidden"
             style={{
         backgroundImage: 'url(/assets/images/minimalist-background.jpg)',
         backgroundSize: 'cover',
         backgroundPosition: 'center',
         backgroundRepeat: 'no-repeat',
         minHeight: '50vh'
       }}
    >
      {/* Content overlay */}
      <div className="relative z-10 mx-auto px-2 sm:px-4 flex items-center" style={{ minHeight: '50vh' }}>
        <div className="feature-one__inner w-full">
          <h2 className="hero-heading text-center">
            AI Engine built for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-green-500 to-green-600">
            MINDFUL EATER
            </span>
          </h2>
          <div className="flex justify-center mb-12">
            <p 
              className="max-w-4xl text-base text-center"
              style={{
                fontFamily: 'var(--contact-font)',
                fontWeight: 600,
                letterSpacing: '0.01em',
                textTransform: 'none',
                color: 'white'
              }}
            >
            An Snap a picture, and your meal’s story comes alive. AI sidekick counts the calories, imagines recipes, and guides you toward a healthier happily-ever-after        </p>
          </div>
          <div className="feature-one__btn-box">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-full bg-green-300 text-slate-900 shadow-lg hover:bg-green-400 transition-colors duration-300"
                style={{ 
                  fontFamily: 'var(--contact-font)', 
                  fontWeight: 600,
                  letterSpacing: '0.01em'
                }}
              >
                Begin
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --contact-font: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .hero-heading {
          font-family: var(--contact-font);
          font-weight: 600;
          font-size: 2.5rem;
          line-height: 1.1;
          letter-spacing: 0.01em;
          text-transform: none;
          color: white;
          margin-bottom: 1rem;
        }

        @media (max-width: 640px) {
          .hero-heading {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;

