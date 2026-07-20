import FooterSection from "../FooterSection/FooterSection";
import Header from "../Header/Header";
import ContactAndNewsletter from "./ContactAndNewsletter/ContactAndNewsletter";
import FAQ from "./FAQ/FAQ";
import HeroSection from "./HeroSection/HeroSection";
import ProductsServicesSection from "./ProductsServicesSection/ProductsServicesSection";
import TestimonialSection from "./TestimonialSection/TestimonialSection";

const Landing = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <ProductsServicesSection />
      <TestimonialSection />
      <FAQ />
      <ContactAndNewsletter />
      <FooterSection />
    </div>
  );
};
export default Landing;
