import ContactAndNewsletter from './ContactAndNewsletter/ContactAndNewsletter';
import FAQ from './FAQ/FAQ';
import HeroSection from './HeroSection/HeroSection';
import ProductsServicesSection from './ProductsServicesSection/ProductsServicesSection';
import TestimonialSection from './TestimonialSection/TestimonialSection';

const Landing = () => {
	return (
		<div>
			<HeroSection />
			<ProductsServicesSection />
			<TestimonialSection />
			<FAQ />
			<ContactAndNewsletter />
		</div>
	);
};
export default Landing;
