
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Home, MapPin, Tag } from "lucide-react";

const categories = [
  {
    title: "Luxury Homes",
    description: "Exclusive properties for premium living experience",
    icon: <Home className="h-8 w-8" />,
    properties: 245,
    color: "bg-green-100"
  },
  {
    title: "Ready to Move",
    description: "Properties available for immediate possession",
    icon: <Building className="h-8 w-8" />,
    properties: 1245,
    color: "bg-blue-100"
  },
  {
    title: "Budget Homes",
    description: "Affordable options without compromising on quality",
    icon: <Tag className="h-8 w-8" />,
    properties: 845,
    color: "bg-orange-100"
  },
  {
    title: "Premium Locations",
    description: "Properties in the most sought-after neighborhoods",
    icon: <MapPin className="h-8 w-8" />,
    properties: 567,
    color: "bg-purple-100"
  }
];

const ExploreByCategories = () => {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Explore by Categories
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Find the perfect property based on your specific requirements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className={`${category.color} rounded-t-lg p-6`}>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4">
                  {category.icon}
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription className="text-gray-700">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <p className="text-sm text-gray-500 mb-4">
                  {category.properties} properties available
                </p>
                {/* <Button variant="outline" className="w-full">Explore</Button> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExploreByCategories;
