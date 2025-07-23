
import { UniversityHeader } from "@/components/university/UniversityHeader";
import { UniversityHero } from "@/components/university/UniversityHero";
import { UniversityFeatures } from "@/components/university/UniversityFeatures";
import { UniversityStats } from "@/components/university/UniversityStats";
import { UniversityServices } from "@/components/university/UniversityServices";
import { UniversityTestimonials } from "@/components/university/UniversityTestimonials";
import { UniversityFooter } from "@/components/university/UniversityFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <UniversityHeader />
      <UniversityHero />
      <UniversityStats />
      <UniversityFeatures />
      <UniversityServices />
      <UniversityTestimonials />
      <UniversityFooter />
    </div>
  );
};

export default Index;
