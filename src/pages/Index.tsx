import Navbar from '@/components/Navbar';
import SocialSidebar from '@/components/SocialSidebar';
import EmailSidebar from '@/components/EmailSidebar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FeaturedProjects from '@/components/FeaturedProjects';
import OtherProjects from '@/components/OtherProjects';
import ContributionGraph from '@/components/ContributionGraph';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />
      
      <main className="relative">
        <Hero />
        <About />
        <FeaturedProjects />
        <OtherProjects />
        <ContributionGraph />
        <Certifications />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
