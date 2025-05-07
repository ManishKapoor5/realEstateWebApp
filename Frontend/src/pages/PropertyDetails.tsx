import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Bed, 
  Building, 
  Calendar, 
  Check, 
  Heart, 
  Home, 
  MapPin, 
  MessageSquare, 
  Phone, 
  Share2, 
  ShowerHead,
  Square,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Sample property data
const property = {
  id: 1,
  title: "3 BHK Apartment in DLF Phase 5",
  description: "Luxurious 3 BHK apartment with modern amenities in a prime location. The apartment offers spacious rooms with abundant natural light, high-quality fittings, and a beautiful view of the surrounding area. Perfect for families looking for a comfortable living space in a vibrant neighborhood.",
  location: "DLF Phase 5, Gurugram, Haryana",
  price: "₹1.45 Cr",
  pricePerSqFt: "7,250",
  size: "2000 sq.ft",
  bedrooms: 3,
  bathrooms: 2,
  propertyType: "Apartment",
  images: [
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    "https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
    "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  ],
  features: [
    "Modular Kitchen",
    "24/7 Security",
    "Power Backup",
    "Swimming Pool",
    "Gym",
    "Children's Play Area",
    "Covered Parking",
    "Visitor Parking",
    "Clubhouse",
    "Landscaped Gardens",
  ],
  postedOn: "2 weeks ago",
  furnishing: "Semi-Furnished",
  facing: "East",
  floorNo: "8 (Out of 14)",
  carParking: "2 Covered",
  ownerName: "Rahul Sharma",
  ownerType: "Individual",
  agencyName: "Legacy Land Properties",
  yearBuilt: 2020,
  isVerified: true
};

const PropertyDetails = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" className="mb-4" asChild>
            <Link to="/property-listings">
              <ArrowLeft size={16} className="mr-2" />
              Back to Listings
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <img 
                    src={property.images[currentImage]} 
                    alt={property.title}
                    className="w-full h-[400px] object-cover"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`absolute top-4 right-4 bg-white/90 hover:bg-white ${liked ? 'text-red-500' : 'text-gray-500'}`}
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart className={liked ? 'fill-current' : ''} size={20} />
                  </Button>
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
                    {property.images.map((image, index) => (
                      <div 
                        key={index}
                        className={`w-16 h-16 rounded overflow-hidden flex-shrink-0 cursor-pointer border-2 ${currentImage === index ? 'border-primary' : 'border-white'}`}
                        onClick={() => setCurrentImage(index)}
                      >
                        <img src={image} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold">{property.title}</h1>
                      <p className="text-gray-600 flex items-center mt-1">
                        <MapPin size={16} className="mr-1" />
                        {property.location}
                      </p>
                    </div>
                    <div className="text-right mt-2 md:mt-0">
                      <p className="text-2xl font-bold text-primary">{property.price}</p>
                      <p className="text-sm text-gray-600">₹{property.pricePerSqFt}/sq.ft</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 py-4 border-y">
                    <div className="flex items-center gap-2">
                      <Bed size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium">{property.bedrooms}</p>
                        <p className="text-xs text-gray-500">Bedrooms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShowerHead size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium">{property.bathrooms}</p>
                        <p className="text-xs text-gray-500">Bathrooms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium">{property.size}</p>
                        <p className="text-xs text-gray-500">Built-up Area</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building size={20} className="text-gray-500" />
                      <div>
                        <p className="font-medium">{property.propertyType}</p>
                        <p className="text-xs text-gray-500">Property Type</p>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="overview" className="mt-6">
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Description</h3>
                        <p className="text-gray-600">{property.description}</p>
                        
                        <h3 className="text-lg font-medium pt-2">Key Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                          <div className="flex items-center">
                            <span className="text-gray-600 w-32">Property Type:</span>
                            <span>{property.propertyType}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600 w-32">Furnishing:</span>
                            <span>{property.furnishing}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600 w-32">Floor:</span>
                            <span>{property.floorNo}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600 w-32">Facing:</span>
                            <span>{property.facing}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600 w-32">Car Parking:</span>
                            <span>{property.carParking}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600 w-32">Year Built:</span>
                            <span>{property.yearBuilt}</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="details">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Property Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Rooms</h4>
                            <div className="space-y-1">
                              <p>Bedrooms: {property.bedrooms}</p>
                              <p>Bathrooms: {property.bathrooms}</p>
                              <p>Balconies: 2</p>
                              <p>Living Room: 1</p>
                              <p>Kitchen: 1</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-700 mb-2">Area Details</h4>
                            <div className="space-y-1">
                              <p>Super Built-up Area: 2200 sq.ft</p>
                              <p>Built-up Area: {property.size}</p>
                              <p>Carpet Area: 1800 sq.ft</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Additional Information</h4>
                          <p>Water Supply: 24/7 Municipal + Borewell</p>
                          <p>Status of Electricity: No/Rare Power Cut</p>
                          <p>Status of Water Seepage: No Seepage</p>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="features">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Features & Amenities</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2">
                          {property.features.map((feature, index) => (
                            <div key={index} className="flex items-center">
                              <Check className="text-green-500 mr-2" size={16} />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div className="flex justify-center mb-2">
                      {property.isVerified && (
                        <Badge className="bg-blue-500 text-white">
                          Verified Owner
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">Contact Owner</h3>
                    <p className="text-sm text-gray-500">
                      {property.ownerName} • {property.ownerType}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button className="w-full">
                      <Phone size={16} className="mr-2" />
                      View Phone Number
                    </Button>
                    <Button variant="outline" className="w-full">
                      <MessageSquare size={16} className="mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Property Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted on</span>
                      <span className="font-medium flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {property.postedOn}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property ID</span>
                      <span className="font-medium">LL{property.id}82932</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed by</span>
                      <span className="font-medium">{property.agencyName}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 size={14} className="mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart size={14} className="mr-1" />
                      Favorite
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Similar Properties</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex gap-3">
                        <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/photo-148779234325-4df${item}900750${item}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`} 
                            alt={`Similar property ${item}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{item + 1} BHK Apartment in DLF Phase {item}</h4>
                          <p className="text-primary font-medium text-sm">₹{(item * 0.5 + 1).toFixed(2)} Cr</p>
                          <p className="text-xs text-gray-500">Gurugram, Haryana</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">View More</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetails;
