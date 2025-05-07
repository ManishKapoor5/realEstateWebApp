import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Home, Search } from "lucide-react";
import CitySelector from "./CitySelector";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";

// Cleaned PropertyLocation (no lat/lng)
interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: boolean;
  furnished: boolean;
}

interface PropertyOwner {
  name: string;
  contact: string;
  email: string;
}

// Removed geo field
interface Property {
  _id: { $oid: string };
  title: string;
  description: string;
  price: number;
  type: string;
  location: PropertyLocation;
  features: PropertyFeatures;
  images: string[];
  owner: PropertyOwner;
  sellerId: { $oid: string };
  status: string;
  approval: string;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

type TabType = "buy" | "seller" | "agent" | "pg";

const propertyTypes: Record<TabType, string[]> = {
  buy: ["apartment", "villa", "house", "plot", "commercial"],
  seller: ["apartment", "house", "pg", "villa"],
  agent: ["office", "shop", "commercial"],
  pg: ["pg-men", "pg-women", "co-living"],
};

interface PropertyTypeButtonsProps {
  type: TabType;
  selectedType: string | null;
  onSelect: (type: string) => void;
}

const PropertyTypeButtons: React.FC<PropertyTypeButtonsProps> = ({ 
  type, 
  selectedType, 
  onSelect 
}) => (
  <div className="mt-4 flex flex-wrap gap-2">
    {propertyTypes[type].map((label) => (
      <Button 
        key={label} 
        variant={selectedType === label ? "default" : "outline"} 
        size="sm" 
        className="rounded-full"
        onClick={() => onSelect(label)}
      >
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Button>
    ))}
  </div>
);

const Hero: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("buy");
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedPropertyType, setSelectedPropertyType] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/Property/getFrontPageAllProperties");
        if (res.data && res.data.data) {
          console.log("Fetched properties:", res.data.data);
          setProperties(res.data.data);
        } else if (Array.isArray(res.data)) {
          setProperties(res.data);
        } else {
          console.error("Unexpected API response format:", res.data);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = () => {
    const filteredProperties = properties.filter(property => {
      try {
        const typeMatch = !selectedPropertyType || 
          (property.type && property.type.toLowerCase() === selectedPropertyType.toLowerCase());
        
        const cityMatch = !selectedCity || 
          (property.location && 
           property.location.city && 
           property.location.city.toLowerCase().includes(selectedCity.toLowerCase()));
        
        const searchMatch = !searchInput || (
          (property.title && property.title.toLowerCase().includes(searchInput.toLowerCase())) ||
          (property.description && property.description.toLowerCase().includes(searchInput.toLowerCase())) ||
          (property.location && 
           property.location.address && 
           property.location.address.toLowerCase().includes(searchInput.toLowerCase()))
        );
        
        const statusMatch = !property.status || property.status === "available";
        
        return typeMatch && cityMatch && searchMatch && statusMatch;
      } catch (error) {
        console.error("Error filtering property:", error, property);
        return false;
      }
    });
    console.log("Filtered Properties----->",filteredProperties.length)
    navigate("/property-listings", { state: filteredProperties });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream Property in India
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search from over 10 lakh properties for sale and rent across top cities in India
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-1">
          <Tabs defaultValue={activeTab} onValueChange={(val) => setActiveTab(val as TabType)}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="buy" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                <Home className="mr-2 h-4 w-4" />
                Buy
              </TabsTrigger>
              <TabsTrigger value="seller" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                <Building className="mr-2 h-4 w-4" />
                Seller
              </TabsTrigger>
              <TabsTrigger value="agent" className="rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
                Agent
              </TabsTrigger>
            </TabsList>

            {(Object.keys(propertyTypes) as TabType[]).map((key) => (
              <TabsContent key={key} value={key} className="px-4 pb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/4">
                    <CitySelector onSelect={(city) => setSelectedCity(city)} />
                  </div>
                  <div className="relative w-full md:w-3/4">
                    <Input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search by title, description or address"
                      className="pr-10 h-12"
                    />
                    <Button 
                      onClick={handleSearch} 
                      disabled={isLoading}
                      className="absolute right-0 top-0 h-12 rounded-l-none"
                    >
                      <Search className="h-5 w-5" />
                      <span className="ml-2 hidden md:inline">
                        {isLoading ? "Loading..." : "Search"}
                      </span>
                    </Button>
                  </div>
                </div>
                <PropertyTypeButtons 
                  type={key} 
                  selectedType={selectedPropertyType}
                  onSelect={setSelectedPropertyType}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hero;
