import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { reportApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Camera, Upload, Loader2 } from "lucide-react";

const ReportPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [animalType, setAnimalType] = useState<string>("");
  const [customAnimalType, setCustomAnimalType] = useState<string>("");
  const [severity, setSeverity] = useState<number>(3);
  const [description, setDescription] = useState<string>("");
  const [location, setLocation] = useState<{lat: number, lng: number, address: string}>({
    lat: 0,
    lng: 0,
    address: ""
  });
  const [contactPhone, setContactPhone] = useState<string>("");
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [usingCamera, setUsingCamera] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle location detection
  const detectLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Here you would typically reverse geocode to get the address
          // For now we'll just use the coordinates as the address
          setLocation({
            lat: latitude,
            lng: longitude,
            address: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
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
            description: "Could not detect your location. Please enter it manually.",
            variant: "destructive",
          });
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setIsDetectingLocation(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter location manually.",
        variant: "destructive",
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!image) {
      toast({
        title: "Image required",
        description: "Please upload or take a photo of the animal.",
        variant: "destructive",
      });
      return;
    }
    
    if (!animalType && !customAnimalType) {
      toast({
        title: "Animal type required",
        description: "Please select or specify the animal type.",
        variant: "destructive",
      });
      return;
    }
    
    if (location.lat === 0 && location.lng === 0) {
      toast({
        title: "Location required",
        description: "Please detect your location or enter it manually.",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare form data for submission (including file)
    const formData = new FormData();
    formData.append("image", image);
    formData.append("animalType", animalType === "other" ? customAnimalType : animalType);
    formData.append("severity", severity.toString());
    formData.append("description", description);
    formData.append("location", JSON.stringify(location));
    formData.append("contactPhone", contactPhone);
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would make an API call
      // await reportApi.submitReport(formData);
      console.log("Submitting report:", {
        animalType: animalType === "other" ? customAnimalType : animalType,
        severity,
        description,
        location,
        contactPhone,
        image: image.name // Just logging the filename for demonstration
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Report submitted successfully",
        description: "Thank you for helping this animal. Nearby NGOs will be notified.",
      });
      
      // Redirect to thank you page or back to home
      navigate("/");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle camera access for photo capture
  const startCamera = async () => {
    setUsingCamera(true);
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("MediaDevices API not supported in this browser");
      }

      // List available devices first
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log("Available video devices:", videoDevices);

      if (videoDevices.length === 0) {
        throw new Error("No video devices found");
      }

      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      console.log("Attempting to access camera with constraints:", constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!stream) {
        throw new Error("No stream received from camera");
      }

      // Get the video element after stream is available
      const videoElement = document.getElementById("camera") as HTMLVideoElement;
      if (!videoElement) {
        throw new Error("Camera element not found");
      }

      videoElement.srcObject = stream;
      
      // Wait for the video to be ready
      await new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          videoElement.play()
            .then(resolve)
            .catch(reject);
        };
        videoElement.onerror = () => {
          reject(new Error("Video element error"));
        };
      });

    } catch (error) {
      console.error("Detailed camera error:", error);
      setUsingCamera(false);
      
      let errorMessage = "Could not access your camera. Please try uploading an image instead.";
      
      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          errorMessage = "Camera access was denied. Please allow camera access in your browser settings.";
        } else if (error.name === "NotFoundError") {
          errorMessage = "No camera found. Please check your device's camera.";
        } else if (error.name === "NotReadableError") {
          errorMessage = "Camera is in use by another application. Please close other applications using the camera.";
        } else if (error.name === "OverconstrainedError") {
          errorMessage = "Camera constraints could not be satisfied. Please try a different camera.";
        } else {
          errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      setError(errorMessage);
    }
  };
  
  const capturePhoto = () => {
    try {
      const videoElement = document.getElementById("camera") as HTMLVideoElement;
      if (!videoElement || !videoElement.srcObject) {
        throw new Error("Camera not initialized");
      }

      const canvas = document.createElement("canvas");
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not get canvas context");
      }
      
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setImage(file);
          setImagePreview(canvas.toDataURL("image/jpeg"));
          
          // Stop camera stream
          const stream = videoElement.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          videoElement.srcObject = null;
          
          setUsingCamera(false);
        } else {
          throw new Error("Could not create image from camera");
        }
      }, "image/jpeg", 0.95); // 0.95 quality for better image
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast({
        title: "Capture error",
        description: "Could not capture photo. Please try again or upload an image.",
        variant: "destructive",
      });
      setUsingCamera(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Report an Animal in Need</h1>
            
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload/Camera Section */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Animal Photo</Label>
                    
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-60 object-cover rounded-md" 
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-white/80"
                        >
                          Change
                        </Button>
                      </div>
                    ) : usingCamera ? (
                      <div className="space-y-2">
                        <video 
                          id="camera" 
                          autoPlay 
                          playsInline 
                          muted
                          className="w-full h-60 object-cover rounded-md bg-black"
                        ></video>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={capturePhoto}
                            className="flex-1"
                          >
                            Take Photo
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const videoElement = document.getElementById("camera") as HTMLVideoElement;
                              if (videoElement && videoElement.srcObject) {
                                const stream = videoElement.srcObject as MediaStream;
                                const tracks = stream.getTracks();
                                tracks.forEach(track => track.stop());
                                videoElement.srcObject = null;
                              }
                              setUsingCamera(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("image")?.click()}
                            className="w-full h-24 flex flex-col items-center justify-center"
                          >
                            <Upload className="h-6 w-6 mb-2" />
                            Upload Photo
                          </Button>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={startCamera}
                          className="h-24 flex flex-col items-center justify-center"
                        >
                          <Camera className="h-6 w-6 mb-2" />
                          Take Photo
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Animal Type */}
                  <div className="space-y-2">
                    <Label htmlFor="animalType">Animal Type</Label>
                    <Select value={animalType} onValueChange={setAnimalType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select animal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="cow">Cow</SelectItem>
                        <SelectItem value="other">Other (please specify)</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {animalType === "other" && (
                      <div className="mt-2">
                        <Input 
                          placeholder="Please specify animal type" 
                          value={customAnimalType}
                          onChange={(e) => setCustomAnimalType(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Injury Severity */}
                  <div className="space-y-2">
                    <Label htmlFor="severity">
                      Injury Severity <span className="text-gray-500 text-sm">({severityLabel(severity)})</span>
                    </Label>
                    <Slider
                      id="severity"
                      min={1}
                      max={5}
                      step={1}
                      value={[severity]}
                      onValueChange={(values) => setSeverity(values[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Minor</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe the animal's condition and situation"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  
                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="flex gap-2">
                      <Input
                        id="location"
                        placeholder="Address or location description"
                        value={location.address}
                        onChange={(e) => setLocation({ ...location, address: e.target.value })}
                        className="flex-1"
                      />
                      <Button 
                        type="button"
                        onClick={detectLocation}
                        variant="outline"
                        disabled={isDetectingLocation}
                      >
                        {isDetectingLocation ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Detect"
                        )}
                      </Button>
                    </div>
                    {location.lat !== 0 && location.lng !== 0 && (
                      <p className="text-xs text-gray-500">
                        Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                  
                  {/* Contact Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone Number (Optional)</Label>
                    <Input
                      id="contactPhone"
                      placeholder="Your phone number for follow-up if needed"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                    />
                  </div>
                  
                  {/* Submit Button */}
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
                      "Submit Report"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const severityLabel = (severity: number) => {
  switch (severity) {
    case 1: return "Minor issue";
    case 2: return "Moderate concern";
    case 3: return "Needs attention";
    case 4: return "Serious condition";
    case 5: return "Critical emergency";
    default: return "Needs attention";
  }
};

export default ReportPage;
