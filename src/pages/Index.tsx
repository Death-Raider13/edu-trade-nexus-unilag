import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Marketplace from "@/components/Marketplace";
import Credits from "@/components/Credits";
import AgentSignup from "@/components/AgentSignup";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Marketplace />
      <Credits />
      <AgentSignup />
      <Footer />
    </div>
  );
};

export default Index;
