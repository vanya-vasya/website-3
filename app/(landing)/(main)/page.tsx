import Hero from "@/components/landing/hero";
import Products from "@/components/landing/products";
import Pricing from "@/components/landing/pricing";
import Logo from "@/components/landing/logo";

const LandingPage = () => {
  return (
    <div className="bg-slate-50">
      <Hero />
      <Logo />
      <Products />
      <Pricing />
    </div>
  );
};

export default LandingPage;
