import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import './AdminDashboard.css';

// Lazy load pages/components
const Index = lazy(() => import("./pages/Index"));
const PropertyListings = lazy(() => import("./pages/PropertyListings"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Contact = lazy(() => import("./pages/Contact"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"));
const BuyerRoute = lazy(() => import("./routes/BuyerRoute"));
const SellerRoute = lazy(() => import("./routes/SellerRoute"));
const BuyerDashboard = lazy(() => import("./pages/BuyerDashboard"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const AddProperty = lazy(() => import("./pages/AddProperty"));
const SearchBox = lazy(() => import("./components/SearchBox"));
const AdminProtectedRoute = lazy(() => import("./components/common/AdminProtectedRoute"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const AdminNewDashboard = lazy(() => import("./pages/AdminNewDashboard"));
const PropertiesTab = lazy(() => import("./components/PropertiesTab"));
//const Dashboard = lazy(() => import("./pages/Dashboard"));
const AgentsTab = lazy(() => import("./pages/Agents"));
const SettingsTab = lazy(() => import("./components/SettingsTab"));
const DashboardMetrics = lazy(() => import("./components/shared/Dashboard").then(m => ({ default: m.DashboardMetrics })));
const AgentDashboard = lazy(() => import("./pages/AgentDashboard"));
const EachPropertyDetails = lazy(() => import("./components/EachProperty"));
const BuyerInquiriesTab = lazy(() => import("./pages/BuyerInquiry"));
const PropertyLimitConfiguration = lazy(() => import("./components/PropertyLimitConfiguration"));
const PropertyDetailPage = lazy(() => import("./pages/PropertyDetailPage"));
const UpgradeTier = lazy(() => import("./components/UpgradeTier"));

const REFRESH_INTERVAL = 15 * 60 * 1000;

const queryClient = new QueryClient();

// Mock data for dashboard
const mockProperties = [
  {
    id: 'prop-001',
    title: 'Luxury Apartment in Mumbai',
    type: 'Flat/Apartment',
    location: 'Mumbai',
    price: 12500000,
    status: 'available',
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    createdAt: new Date('2025-03-12'),
    updatedAt: new Date('2025-04-01')
  },
  {
    id: 'prop-002',
    title: 'Villa with Garden in Bangalore',
    type: 'Villa',
    location: 'Bangalore',
    price: 22000000,
    status: 'available',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-03-25')
  },
  {
    id: 'prop-003',
    title: 'Commercial Plot in Delhi',
    type: 'Plot',
    location: 'Delhi',
    price: 35000000,
    status: 'sold',
    area: 5000,
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-04-10')
  },
];

const mockAgents = [
  {
    id: 'agent-001',
    name: 'Vivek Kumar',
    email: 'vivek.kumar@legacyland.com',
    phone: '+91 98765 43210',
    properties: 24,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 'agent-002',
    name: 'Neha Verma',
    email: 'neha.verma@legacyland.com',
    phone: '+91 98765 12345',
    properties: 18,
    rating: 4.5,
    status: 'active'
  },
  {
    id: 'agent-003',
    name: 'Suresh Reddy',
    email: 'suresh.reddy@legacyland.com',
    phone: '+91 87654 32109',
    properties: 12,
    rating: 4.2,
    status: 'inactive'
  },
];

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/property-listings" element={<PropertyListings />} />
              <Route path="/property-details" element={<PropertyDetails />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/searchbox" element={<SearchBox onSearchResults={() => {}} />} />
              <Route path="/property/:id" element={<EachPropertyDetails />} />
              <Route path="/individual-property/:id" element={<PropertyDetailPage />} />
              <Route path="/upgradeTier" element={<UpgradeTier />} />

              <Route path="/admin" element={<AdminNewDashboard />}>
                <Route
                  index
                  element={
                    <DashboardMetrics
                      properties={mockProperties.length}
                      available={mockProperties.filter(p => p.status === 'available').length}
                      sold={mockProperties.filter(p => p.status === 'sold').length}
                      agents={mockAgents.filter(a => a.status === 'active').length}
                      totalValue={mockProperties.reduce((sum, p) => sum + p.price, 0)}
                    />
                  }
                />
                <Route path="properties" element={<PropertiesTab />} />
                <Route path="users" element={<AgentsTab />} />
                <Route path="buyer-tier-limit" element={<PropertyLimitConfiguration />} />
                <Route path="settings" element={<SettingsTab />} />
              </Route>

              <Route path="/buyer-dashboard" element={<BuyerRoute><BuyerDashboard /></BuyerRoute>} />
              <Route path="/seller-dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;