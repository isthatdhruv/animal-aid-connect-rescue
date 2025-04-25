
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ngoApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, MapPin, Phone, Flag, CheckCircle, XCircle } from "lucide-react";

// Mock data for demonstration
const mockReports = [
  {
    id: "report1",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    animalType: "Cat",
    severity: 3,
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: "MG Road, Bangalore"
    },
    distance: 2.5,
    reportedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    description: "Gray cat with injured paw, seems to be in pain but conscious",
    reporterPhone: "9876543210"
  },
  {
    id: "report2",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    animalType: "Dog",
    severity: 4,
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: "Indiranagar, Bangalore"
    },
    distance: 4.8,
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    description: "Stray dog hit by vehicle, bleeding from leg",
    reporterPhone: null
  },
  {
    id: "report3",
    imageUrl: "https://images.unsplash.com/photo-1557925923-6982bd9650ff",
    animalType: "Bird",
    severity: 2,
    location: {
      lat: 12.9716,
      lng: 77.5946,
      address: "Koramangala, Bangalore"
    },
    distance: 3.1,
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    description: "Small bird with broken wing, unable to fly",
    reporterPhone: "8765432109"
  }
];

const NgoDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRescues: 0,
    rating: 0
  });
  const [isActionInProgress, setIsActionInProgress] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be actual API calls
        // const reportsData = await ngoApi.getNgoReports(user!.id);
        // const profileData = await ngoApi.getProfile(user!.id);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setReports(mockReports);
        setStats({
          totalRescues: 27,
          rating: 4.8
        });
      } catch (error) {
        console.error("Failed to fetch NGO data:", error);
        toast({
          title: "Failed to load data",
          description: "Could not retrieve your reports and profile data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleAcceptReport = async (reportId: string) => {
    setIsActionInProgress(reportId);
    
    try {
      // In a real app, this would make an API call
      // await ngoApi.updateReportStatus(reportId, "Closed", user!.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update UI by removing the accepted report
      setReports(reports.filter(report => report.id !== reportId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalRescues: prev.totalRescues + 1
      }));
      
      toast({
        title: "Report accepted",
        description: "Thank you for helping this animal in need.",
      });
    } catch (error) {
      console.error("Failed to accept report:", error);
      toast({
        title: "Action failed",
        description: "Could not accept the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionInProgress(null);
    }
  };
  
  const handleFlagReport = async (reportId: string) => {
    setIsActionInProgress(reportId);
    
    try {
      // In a real app, this would make an API call
      // await ngoApi.updateReportStatus(reportId, "Flagged", user!.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update UI by removing the flagged report
      setReports(reports.filter(report => report.id !== reportId));
      
      toast({
        title: "Report flagged",
        description: "The report has been flagged for review by administrators.",
      });
    } catch (error) {
      console.error("Failed to flag report:", error);
      toast({
        title: "Action failed",
        description: "Could not flag the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionInProgress(null);
    }
  };
  
  // Check if the NGO is approved
  const isApproved = user?.status === "Approved";
  
  return (
    <ProtectedRoute requiredUserType="ngo">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-8">
          <div className="container-custom">
            <h1 className="text-3xl font-bold mb-6">NGO Dashboard</h1>
            
            {!isApproved ? (
              <Card className="bg-amber-50 border-amber-200 mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-amber-800">Profile Pending Approval</h2>
                      <p className="text-amber-700">
                        Your NGO profile is currently under review. You'll have full access to the dashboard once an administrator approves your profile.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Stats Card - Total Rescues */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Total Rescues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stats.totalRescues
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Card - Rating */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold flex items-center">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        {stats.rating}
                        <div className="text-yellow-400 text-sm ml-2 mt-1">
                          {Array(5).fill(0).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Stats Card - Organization Name */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold truncate">
                    {user?.name || "Your NGO"}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Badge variant={isApproved ? "default" : "outline"} className={isApproved ? "bg-green-500" : ""}>
                      {user?.status || "Pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="reports" className="w-full">
              <TabsList className="mb-8 grid grid-cols-2 md:w-[400px]">
                <TabsTrigger value="reports">Active Reports</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reports">
                <h2 className="text-xl font-semibold mb-4">Reports in Your Area</h2>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : reports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                      <Card key={report.id} className="overflow-hidden">
                        {/* Report Image */}
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={report.imageUrl} 
                            alt={report.animalType} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className={`${getSeverityColor(report.severity)}`}>
                              Severity: {report.severity}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="pt-6 pb-4">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-lg">{report.animalType}</h3>
                            <Badge variant="outline" className="text-gray-500">
                              {formatTimeAgo(report.reportedAt)}
                            </Badge>
                          </div>
                          
                          {report.description && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {report.description}
                            </p>
                          )}
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-gray-700">{report.location.address}</p>
                                <p className="text-gray-500">{report.distance.toFixed(1)} km away</p>
                              </div>
                            </div>
                            
                            {report.reporterPhone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-gray-500" />
                                <a href={`tel:${report.reporterPhone}`} className="text-primary hover:underline">
                                  {report.reporterPhone}
                                </a>
                              </div>
                            )}
                          </div>
                          
                          {/* Action buttons */}
                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <Button 
                              onClick={() => handleAcceptReport(report.id)}
                              className="bg-primary hover:bg-primary-dark"
                              disabled={isActionInProgress === report.id || !isApproved}
                            >
                              {isActionInProgress === report.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              )}
                              Accept
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleFlagReport(report.id)}
                              disabled={isActionInProgress === report.id || !isApproved}
                            >
                              {isActionInProgress === report.id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <Flag className="h-4 w-4 mr-2" />
                              )}
                              Flag
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
                    <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Active Reports</h3>
                    <p className="text-gray-500">
                      There are currently no active animal reports in your area.
                      <br />
                      Check back later or expand your operational radius.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="profile">
                <h2 className="text-xl font-semibold mb-4">NGO Profile</h2>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-600 mb-4">
                      This section will contain profile management functionality, including:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li>Editing NGO details</li>
                      <li>Updating operational location</li>
                      <li>Changing contact information</li>
                      <li>Managing service preferences</li>
                    </ul>
                    
                    <div className="mt-6">
                      <Button variant="outline">Edit Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

// Helper function to format time ago
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

// Helper function to get severity color
const getSeverityColor = (severity: number) => {
  switch (severity) {
    case 1: return 'bg-blue-100 text-blue-800';
    case 2: return 'bg-green-100 text-green-800';
    case 3: return 'bg-yellow-100 text-yellow-800';
    case 4: return 'bg-orange-100 text-orange-800';
    case 5: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default NgoDashboard;
