
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageCarousel from "@/components/ImageCarousel";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Carousel */}
        <ImageCarousel />
        
        {/* About Us Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg mb-8">
                Animal Aid Connect bridges the gap between people who find injured or stray animals 
                and the organizations that can help them. Our platform enables quick reporting
                and efficient response from nearby animal welfare NGOs, veterinarians, and animal hospitals.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <FeatureCard 
                  icon="🐾"
                  title="Easy Reporting"
                  description="Quickly report animals in need with our simple form, including photo upload and location detection."
                />
                <FeatureCard 
                  icon="🚑"
                  title="Fast Response"
                  description="Connect with nearby NGOs who can provide timely assistance to the animal."
                />
                <FeatureCard 
                  icon="💙"
                  title="Save Lives"
                  description="Your quick action through our platform can help save animals in distress."
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard 
                number={1}
                title="Report an Animal"
                description="Use our form to report an injured or stray animal, upload a photo, and share the location."
              />
              <StepCard 
                number={2}
                title="NGOs Respond"
                description="Local animal welfare organizations are notified and can respond to the report."
              />
              <StepCard 
                number={3}
                title="Animal Gets Help"
                description="The NGO provides necessary care and updates the status of the animal."
              />
            </div>
            <div className="text-center mt-12">
              <Button asChild className="bg-primary hover:bg-primary-dark text-white">
                <Link to="/report">Report an Animal Now</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* NGO CTA Section */}
        <section className="py-16 bg-primary/10">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Are You an Animal Welfare NGO?</h2>
              <p className="text-gray-600 text-lg mb-8">
                Join our network of animal welfare organizations and help rescue animals in need.
                Register your NGO to start receiving reports from your operational area.
              </p>
              <Button asChild className="bg-secondary hover:bg-secondary-dark text-white">
                <Link to="/ngo/auth">Register Your NGO</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard = ({ number, title, description }: StepCardProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HomePage;
