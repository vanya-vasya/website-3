"use client";

import Image from "next/image";

const Logo = () => {
  // Array of partner logos
  const partnerLogos = [
    {
      src: "/logos/FreshVite-Logo.png",
      alt: "FreshVite Healthy Food Delivery",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/NutriFlow-Logo.png",
      alt: "NutriFlow Nutrition Consulting",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/VitalEats-Logo.png",
      alt: "VitalEats Restaurant Group",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/FlexFit-Logo.png",
      alt: "FlexFit Fitness Studios",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/GreenBowl-Logo.png",
      alt: "GreenBowl Organic Meals",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/PurePlate-Logo.png",
      alt: "PurePlate Healthy Restaurants",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/ActiveLife-Logo.png",
      alt: "ActiveLife Wellness Center",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/WholeFresh-Logo.png",
      alt: "WholeFresh Organic Delivery",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/ZenKitchen-Logo.png",
      alt: "ZenKitchen Mindful Eating",
      width: 512,
      height: 188,
    },
    {
      src: "/logos/FitFuel-Logo.png",
      alt: "FitFuel Sports Nutrition",
      width: 512,
      height: 188,
    },
  ];

  // Duplicate the array to create seamless loop
  const duplicatedLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section id="partners" className="bg-white py-1 sm:py-1.5">
      <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">


        {/* Scrolling Marquee */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          
          {/* Scrolling container */}
          <div className="flex space-x-4 lg:space-x-6 animate-marquee">
            {duplicatedLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="flex-shrink-0 flex items-center justify-center h-64 w-128 opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="max-h-48 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --contact-font: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
                          Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }

        .contact-heading {
          font-family: var(--contact-font);
          font-weight: 600;
          font-size: 2.5rem;
          line-height: 1.1;
          letter-spacing: 0.01em;
          text-transform: none;
          color: #0f172a;
          margin-bottom: 1rem;
        }

        .contact-subtitle {
          font-family: var(--contact-font);
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.2;
          letter-spacing: 0.01em;
          text-transform: none;
          color: #0f172a;
          margin-top: 1rem;
        }



        @media (max-width: 640px) {
          .contact-heading {
            font-size: 2rem;
          }
          .contact-subtitle {
            font-size: 0.875rem;
          }
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee-scroll 20s linear infinite;
          will-change: transform;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 15s;
          }
        }

        .w-128 {
          width: 32rem; /* 512px */
        }
      `}</style>
    </section>
  );
};

export default Logo;
