
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Check, Ban, Eye, Trash2, Search, Filter, Users, FileText, BarChart2 } from "lucide-react";

// Mock data for demonstration
const mockNgos = [
  {
    id: "ngo1",
    name: "Animal Rescue Trust",
    email: "contact@animalrescue.org",
    status: "Approved",
    animals: ["dogs", "cats", "birds"],
    location: {
      address: "123 Main St, Bangalore",
      lat: 12.9716,
      lng: 77.5946
    },
    transport: true,
    totalRescues: 45,
    rating: 4.8,
    registeredAt: new Date(2023, 5, 15)
  },
  {
    id: "ngo2",
    name: "Wildlife SOS",
    email: "help@wildlifesos.org",
    status: "Pending Approval",
    animals: ["wildlife", "exotic", "birds"],
    location: {
      address: "456 Park Ave, Delhi",
      lat: 28.7041,
      lng: 77.1025
    },
    transport: true,
    totalRescues: 0,
    rating: 0,
    registeredAt: new Date(2023, 8, 22)
  },
  {
    id: "ngo3",
    name: "Street Paws Foundation",
    email: "info@streetpaws.org",
    status: "Approved",
    animals: ["dogs", "cats"],
    location: {
      address: "789 Oak Rd, Mumbai",
      lat: 19.0760,
      lng: 72.8777
    },
    transport: false,
    totalRescues: 78,
    rating: 4.5,
    registeredAt: new Date(2023, 2, 8)
  },
  {
    id: "ngo4",
    name: "Farm Animal Sanctuary",
    email: "sanctuary@farmanimal.org",
    status: "Suspended",
    animals: ["farm"],
    location: {
      address: "101 Rural Lane, Chennai",
      lat: 13.0827,
      lng: 80.2707
    },
    transport: true,
    totalRescues: 12,
    rating: 3.2,
    registeredAt: new Date(2023, 1, 20)
  }
];

const mockReports = [
  {
    id: "report1",
    imageUrl: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    animalType: "Cat",
    severity: 3,
    location: {
      address: "MG Road, Bangalore",
      lat: 12.9716,
      lng: 77.5946
    },
    reporterPhone: "9876543210",
    status: "Active",
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: "report2",
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    animalType: "Dog",
    severity: 4,
    location: {
      address: "Indiranagar, Bangalore",
      lat: 12.9716,
      lng: 77.5946
    },
    reporterPhone: null,
    status: "Closed",
    reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    closedByNgoId: "ngo1",
    closedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "report3",
    imageUrl: "https://images.unsplash.com/photo-1557925923-6982bd9650ff",
    animalType: "Bird",
    severity: 2,
    location: {
      address: "Koramangala, Bangalore",
      lat: 12.9716,
      lng: 77.5946
    },
    reporterPhone: "8765432109",
    status: "Flagged",
    reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    flaggedByNgoId: "ngo3",
    flaggedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  }
];

const AdminDashboard = () => {
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [ngos, setNgos] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [stats, setStats] = useState({
    ngoPending: 0,
    ngoApproved: 0,
    ngoSuspended: 0,
    reportsActive: 0,
    reportsClosed: 0,
    reportsFlagged: 0
  });
  
  // Filters
  const [ngoStatusFilter, setNgoStatusFilter] = useState<string>("all");
  const [ngoSearchQuery, setNgoSearchQuery] = useState<string>("");
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("all");
  const [reportSearchQuery, setReportSearchQuery] = useState<string>("");
  const [isActionInProgress, setIsActionInProgress] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be actual API calls
        // const ngosData = await adminApi.getNgos();
        // const reportsData = await adminApi.getReports();
        // const statsData = await adminApi.getStats();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Set mock data
        setNgos(mockNgos);
        setReports(mockReports);
        setStats({
          ngoPending: mockNgos.filter(ngo => ngo.status === "Pending Approval").length,
          ngoApproved: mockNgos.filter(ngo => ngo.status === "Approved").length,
          ngoSuspended: mockNgos.filter(ngo => ngo.status === "Suspended").length,
          reportsActive: mockReports.filter(report => report.status === "Active").length,
          reportsClosed: mockReports.filter(report => report.status === "Closed").length,
          reportsFlagged: mockReports.filter(report => report.status === "Flagged").length
        });
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
        toast({
          title: "Failed to load data",
          description: "Could not retrieve dashboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle NGO status change
  const handleNgoStatusChange = async (ngoId: string, newStatus: string) => {
    setIsActionInProgress(ngoId);
    
    try {
      // In a real app, this would make an API call
      // await adminApi.updateNgoStatus(ngoId, newStatus);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update NGO list with new status
      const updatedNgos = ngos.map(ngo => {
        if (ngo.id === ngoId) {
          return { ...ngo, status: newStatus };
        }
        return ngo;
      });
      
      setNgos(updatedNgos);
      
      // Update stats
      const ngoPending = updatedNgos.filter(ngo => ngo.status === "Pending Approval").length;
      const ngoApproved = updatedNgos.filter(ngo => ngo.status === "Approved").length;
      const ngoSuspended = updatedNgos.filter(ngo => ngo.status === "Suspended").length;
      
      setStats(prev => ({
        ...prev,
        ngoPending,
        ngoApproved,
        ngoSuspended
      }));
      
      toast({
        title: "Status updated",
        description: `NGO status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Failed to update NGO status:", error);
      toast({
        title: "Action failed",
        description: "Could not update NGO status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionInProgress(null);
    }
  };
  
  // Filter and search NGOs
  const filteredNgos = ngos.filter(ngo => {
    const matchesStatus = ngoStatusFilter === "all" || ngo.status === ngoStatusFilter;
    const matchesSearch = ngoSearchQuery === "" || 
      ngo.name.toLowerCase().includes(ngoSearchQuery.toLowerCase()) ||
      ngo.email.toLowerCase().includes(ngoSearchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  // Filter and search reports
  const filteredReports = reports.filter(report => {
    const matchesStatus = reportStatusFilter === "all" || report.status === reportStatusFilter;
    const matchesSearch = reportSearchQuery === "" || 
      report.animalType.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
      report.location.address.toLowerCase().includes(reportSearchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });
  
  return (
    <ProtectedRoute requiredUserType="admin">
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-8">
          <div className="container-custom">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                title="Total NGOs" 
                value={ngos.length} 
                icon={<Users className="h-5 w-5" />}
                loading={isLoading}
                details={[
                  { label: "Approved", value: stats.ngoApproved },
                  { label: "Pending", value: stats.ngoPending },
                  { label: "Suspended", value: stats.ngoSuspended }
                ]}
              />
              
              <StatsCard 
                title="Total Reports" 
                value={reports.length} 
                icon={<FileText className="h-5 w-5" />}
                loading={isLoading}
                details={[
                  { label: "Active", value: stats.reportsActive },
                  { label: "Closed", value: stats.reportsClosed },
                  { label: "Flagged", value: stats.reportsFlagged }
                ]}
              />
              
              <StatsCard 
                title="System Statistics" 
                value="Overview" 
                icon={<BarChart2 className="h-5 w-5" />}
                loading={isLoading}
                details={[
                  { label: "Rescue Rate", value: "72%" },
                  { label: "Avg. Response", value: "4.2h" }
                ]}
              />
            </div>
            
            <Tabs defaultValue="ngos" className="w-full">
              <TabsList className="mb-6 grid grid-cols-2 md:w-[400px]">
                <TabsTrigger value="ngos">NGO Management</TabsTrigger>
                <TabsTrigger value="reports">Reports Overview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ngos">
                <div className="bg-white rounded-lg shadow-sm border">
                  {/* NGO Filters */}
                  <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-medium">NGO Management</h2>
                      <Badge variant="outline" className="ml-2">
                        {filteredNgos.length} NGOs
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search NGOs..."
                          className="pl-9 max-w-[250px]"
                          value={ngoSearchQuery}
                          onChange={(e) => setNgoSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select 
                          value={ngoStatusFilter} 
                          onValueChange={setNgoStatusFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All NGOs</SelectItem>
                            <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* NGOs Table */}
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredNgos.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>NGO Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Animals</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Transport</TableHead>
                            <TableHead>Rescues</TableHead>
                            <TableHead>Registered</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredNgos.map((ngo) => (
                            <TableRow key={ngo.id}>
                              <TableCell className="font-medium">
                                <div>
                                  {ngo.name}
                                  <div className="text-xs text-gray-500">{ngo.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getNgoStatusColor(ngo.status)}>
                                  {ngo.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {ngo.animals.map((animal: string) => (
                                    <Badge key={animal} variant="outline" className="text-xs">
                                      {animal.charAt(0).toUpperCase() + animal.slice(1)}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate" title={ngo.location.address}>
                                {ngo.location.address}
                              </TableCell>
                              <TableCell>
                                {ngo.transport ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Ban className="h-4 w-4 text-gray-300" />
                                )}
                              </TableCell>
                              <TableCell>{ngo.totalRescues}</TableCell>
                              <TableCell>{formatDate(ngo.registeredAt)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <NgoDetailsDialog ngo={ngo} />
                                  
                                  {ngo.status === "Pending Approval" && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleNgoStatusChange(ngo.id, "Approved")}
                                      disabled={isActionInProgress === ngo.id}
                                    >
                                      {isActionInProgress === ngo.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        "Approve"
                                      )}
                                    </Button>
                                  )}
                                  
                                  {ngo.status === "Approved" && (
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleNgoStatusChange(ngo.id, "Suspended")}
                                      disabled={isActionInProgress === ngo.id}
                                    >
                                      {isActionInProgress === ngo.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        "Suspend"
                                      )}
                                    </Button>
                                  )}
                                  
                                  {ngo.status === "Suspended" && (
                                    <Button
                                      size="sm"
                                      variant="default"
                                      onClick={() => handleNgoStatusChange(ngo.id, "Approved")}
                                      disabled={isActionInProgress === ngo.id}
                                    >
                                      {isActionInProgress === ngo.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        "Reinstate"
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No NGOs found matching the current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reports">
                <div className="bg-white rounded-lg shadow-sm border">
                  {/* Report Filters */}
                  <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-medium">Reports Overview</h2>
                      <Badge variant="outline" className="ml-2">
                        {filteredReports.length} Reports
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search reports..."
                          className="pl-9 max-w-[250px]"
                          value={reportSearchQuery}
                          onChange={(e) => setReportSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select 
                          value={reportStatusFilter} 
                          onValueChange={setReportStatusFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Reports</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Closed">Closed</SelectItem>
                            <SelectItem value="Flagged">Flagged</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reports Table */}
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredReports.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Animal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Reported At</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReports.map((report) => (
                            <TableRow key={report.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="h-10 w-10 rounded overflow-hidden">
                                    <img 
                                      src={report.imageUrl} 
                                      alt={report.animalType} 
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <span>{report.animalType}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getReportStatusColor(report.status)}>
                                  {report.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getSeverityColor(report.severity)}>
                                  {report.severity}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-[200px] truncate" title={report.location.address}>
                                {report.location.address}
                              </TableCell>
                              <TableCell>{formatDate(report.reportedAt)}</TableCell>
                              <TableCell>
                                {report.reporterPhone ? (
                                  <a href={`tel:${report.reporterPhone}`} className="text-primary hover:underline">
                                    {report.reporterPhone}
                                  </a>
                                ) : (
                                  <span className="text-gray-400">Not provided</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <ReportDetailsDialog report={report} />
                                  
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive border-destructive hover:bg-destructive/10"
                                    title="Delete report"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No reports found matching the current filters.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading: boolean;
  details: { label: string; value: string | number }[];
}

const StatsCard = ({ title, value, icon, loading, details }: StatsCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className="bg-primary/10 p-2 rounded-full">
          {icon}
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold mb-2">
        {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : value}
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {details.map((detail, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-500">{detail.label}:</span>
            <span className="font-medium">{detail.value}</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

interface NgoDetailsDialogProps {
  ngo: any;
}

const NgoDetailsDialog = ({ ngo }: NgoDetailsDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button size="sm" variant="ghost" title="View details">
        <Eye className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>NGO Details</DialogTitle>
        <DialogDescription>
          Complete information about this NGO
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Name</p>
          <p>{ngo.name}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p>{ngo.email}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Status</p>
          <Badge className={getNgoStatusColor(ngo.status)}>
            {ngo.status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Animals Facilitated</p>
          <div className="flex flex-wrap gap-2">
            {ngo.animals.map((animal: string) => (
              <Badge key={animal} variant="outline">
                {animal.charAt(0).toUpperCase() + animal.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Transportation Available</p>
          <p>{ngo.transport ? "Yes" : "No"}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Location</p>
          <p>{ngo.location.address}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {ngo.location.lat.toFixed(6)}, {ngo.location.lng.toFixed(6)}
          </p>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Statistics</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Rescues</p>
              <p className="text-xl font-semibold">{ngo.totalRescues}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rating</p>
              <p className="text-xl font-semibold flex items-center">
                {ngo.rating}
                {ngo.rating > 0 ? (
                  <span className="text-yellow-400 text-sm ml-1">★</span>
                ) : null}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Registered At</p>
          <p>{formatDate(ngo.registeredAt)}</p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

interface ReportDetailsDialogProps {
  report: any;
}

const ReportDetailsDialog = ({ report }: ReportDetailsDialogProps) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button size="sm" variant="ghost" title="View details">
        <Eye className="h-4 w-4" />
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Report Details</DialogTitle>
        <DialogDescription>
          Complete information about this animal report
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <div>
          <img 
            src={report.imageUrl} 
            alt={report.animalType} 
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Animal Type</p>
            <p>{report.animalType}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Status</p>
            <Badge className={getReportStatusColor(report.status)}>
              {report.status}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Severity</p>
          <div className="flex items-center">
            <Badge variant="outline" className={getSeverityColor(report.severity)}>
              Level {report.severity}
            </Badge>
            <span className="ml-2 text-gray-500">
              {getSeverityLabel(report.severity)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-500">Location</p>
          <p>{report.location.address}</p>
          <p className="text-xs text-gray-500">
            Coordinates: {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Reported At</p>
            <p>{formatDate(report.reportedAt)}</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Reporter Contact</p>
            {report.reporterPhone ? (
              <a href={`tel:${report.reporterPhone}`} className="text-primary hover:underline">
                {report.reporterPhone}
              </a>
            ) : (
              <p className="text-gray-400">Not provided</p>
            )}
          </div>
        </div>
        
        {report.status === "Closed" && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Closed Information</p>
            <p>Closed by: NGO #{report.closedByNgoId}</p>
            <p>Closed at: {formatDate(report.closedAt)}</p>
          </div>
        )}
        
        {report.status === "Flagged" && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Flag Information</p>
            <p>Flagged by: NGO #{report.flaggedByNgoId}</p>
            <p>Flagged at: {formatDate(report.flaggedAt)}</p>
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

// Helper function to format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper function to get NGO status color
const getNgoStatusColor = (status: string) => {
  switch (status) {
    case "Approved": return "bg-green-100 text-green-800";
    case "Pending Approval": return "bg-yellow-100 text-yellow-800";
    case "Suspended": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get report status color
const getReportStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-blue-100 text-blue-800";
    case "Closed": return "bg-green-100 text-green-800";
    case "Flagged": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get severity color
const getSeverityColor = (severity: number) => {
  switch (severity) {
    case 1: return "bg-blue-100 text-blue-800";
    case 2: return "bg-green-100 text-green-800";
    case 3: return "bg-yellow-100 text-yellow-800";
    case 4: return "bg-orange-100 text-orange-800";
    case 5: return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get severity label
const getSeverityLabel = (severity: number) => {
  switch (severity) {
    case 1: return "Minor issue";
    case 2: return "Moderate concern";
    case 3: return "Needs attention";
    case 4: return "Serious condition";
    case 5: return "Critical emergency";
    default: return "Unknown";
  }
};

export default AdminDashboard;
