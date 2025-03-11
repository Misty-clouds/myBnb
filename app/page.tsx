import { BenefitsSection } from "@/components/sections/benefits"
import { CommunitySection } from "@/components/sections/community"
import { ContactSection } from "@/components/sections/contact"
import { FAQSection } from "@/components/sections/faq"
import { FeaturesSection } from "@/components/sections/features"
import { FooterSection } from "@/components/sections/footer"
import { HeroSection } from "@/components/sections/hero"
import { Navbar } from "@/components/sections/navbar"
import { PricingSection } from "@/components/sections/pricing"
import { ServicesSection } from "@/components/sections/services"
import { SponsorsSection } from "@/components/sections/sponsors"
import { TestimonialSection } from "@/components/sections/testimonial"
export default function home (){
  return (<>
    <Navbar/>
    <HeroSection/>
    <SponsorsSection/>
    <BenefitsSection />
    <FeaturesSection />
    <ServicesSection />
    <TestimonialSection />
    <CommunitySection />
    <PricingSection />
    <ContactSection />
    <FAQSection />
    <FooterSection />    
    </>
  )
}