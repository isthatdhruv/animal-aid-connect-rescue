
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ngoApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const animalTypes = [
  { id: "dogs", label: "Dogs" },
  { id: "cats", label: "Cats" },
  { id: "birds", label: "Birds" },
  { id: "wildlife", label: "Wildlife" },
  { id: "farm", label: "Farm Animals" },
  { id: "reptiles", label: "Reptiles" },
  { id: "exotic", label: "Exotic Pets" },
];

const NgoSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [ngoName, setNgoName] = useState("");
  const [description, setDescription] = useState("");
  const [animals, setAnimals] = useState<string[]>([]);
  const [transport, setTransport] = useState(false);
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number}>({
    lat: 0,
    lng: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const detectLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({
            lat: latitude,
            lng: longitude
          });
          setIsDetectingLocation(false);
          
          toast({
            title: "Location detected",
            description: "Your current location has been detected successfully.",
          });
        },
        (error) => {
          setIsDetectingLocation(false);
          toast({
            title: "Location error",
            description: "Could not detect your location. Please enter address manually.",
            variant: "destructive",
          });
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setIsDetectingLocation(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };
  
  const handleAnimalChange = (animalId: string, checked: boolean) => {
    if (checked) {
      setAnimals([...animals, animalId]);
    } else {
      setAnimals(animals.filter(id => id !== animalId));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!ngoName || animals.length === 0 || !address || location.lat === 0 || location.lng === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and set your location",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send profile data to the API
      // const response = await ngoApi.setupProfile(user?.id, {
      //   name: ngoName,
      //   description,
      //   animals,
      //   transport,
      //   location: { ...location, address },
      //   contactPhone,
      //   website
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user context with new profile info
      if (user) {
        const updatedUser = {
          ...user,
          name: ngoName,
          profileComplete: true,
        };
        
        login(updatedUser, "ngo");
        
        toast({
          title: "Profile setup complete",
          description: "Your NGO profile has been created and is pending approval.",
        });
        
        navigate("/ngo/dashboard");
      }
    } catch (error) {
      console.error("Profile setup error:", error);
      toast({
        title: "Setup failed",
        description: "Could not complete your profile setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ProtectedRoute requiredUserType="ngo">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-12">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Complete Your NGO Profile</h1>
              
              <Card>
                <CardHeader>
                  <CardTitle>NGO Details</CardTitle>
                  <CardDescription>
                    Please provide the following information to complete your NGO profile. 
                    This will help us verify your organization.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* NGO Name */}
                    <div className="space-y-2">
                      <Label htmlFor="ngoName">NGO Name <span className="text-destructive">*</span></Label>
                      <Input
                        id="ngoName"
                        placeholder="Your organization name"
                        value={ngoName}
                        onChange={(e) => setNgoName(e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    
                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us about your organization's mission and activities"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    {/* Animals Facilitated */}
                    <div className="space-y-3">
                      <div>
                        <Label>Animals Facilitated <span className="text-destructive">*</span></Label>
                        <p className="text-sm text-gray-500 mt-1">
                          Select all types of animals your organization can help
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {animalTypes.map((animal) => (
                          <div key={animal.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={animal.id} 
                              checked={animals.includes(animal.id)}
                              onCheckedChange={(checked) => handleAnimalChange(animal.id, checked === true)}
                              disabled={isSubmitting}
                            />
                            <Label htmlFor={animal.id} className="cursor-pointer">
                              {animal.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Transport Availability */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="transport">Transport Availability</Label>
                        <p className="text-sm text-gray-500">
                          Can your organization transport animals?
                        </p>
                      </div>
                      <Switch
                        id="transport"
                        checked={transport}
                        onCheckedChange={setTransport}
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    {/* Operational Location */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Operational Address <span className="text-destructive">*</span></Label>
                      <Input
                        id="address"
                        placeholder="Street address, city, state, zip code"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                    
                    {/* Geolocation */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Location Coordinates <span className="text-destructive">*</span></Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={detectLocation}
                          disabled={isDetectingLocation || isSubmitting}
                        >
                          {isDetectingLocation ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Detecting...
                            </>
                          ) : (
                            "Detect Location"
                          )}
                        </Button>
                      </div>
                      {location.lat !== 0 && location.lng !== 0 ? (
                        <p className="text-sm bg-muted p-2 rounded-md">
                          Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
                        </p>
                      ) : (
                        <p className="text-sm text-amber-600">
                          Please detect your location or enter address to continue
                        </p>
                      )}
                    </div>
                    
                    {/* Contact Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        placeholder="Phone number"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    {/* Website */}
                    <div className="space-y-2">
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        placeholder="https://your-ngo-website.org"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Complete Profile Setup"
                      )}
                    </Button>
                    
                    <p className="text-sm text-center text-gray-500">
                      <span className="text-destructive">Note:</span> Your NGO profile will be reviewed by an administrator before approval.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default NgoSetup;
