
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const topLocations = [
  { name: "Mumbai", count: 12450, trending: true },
  { name: "Delhi NCR", count: 15320, trending: true },
  { name: "Bangalore", count: 9845, trending: true },
  { name: "Pune", count: 7623 },
  { name: "Hyderabad", count: 6890, trending: true },
  { name: "Chennai", count: 5487 },
  { name: "Kolkata", count: 4320 },
  { name: "Ahmedabad", count: 3698 },
];

const LocationList = () => {
  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Top Locations in India
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Explore properties across the most popular cities
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topLocations.map((location, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mr-4">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{location.name}</h3>
                  <p className="text-sm text-gray-500">{location.count} properties</p>
                </div>
              </div>
              {location.trending && (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                  Trending
                </Badge>
              )}
            </div>
          ))}
        </div>
        
        {/* <div className="text-center mt-8">
          <Button variant="outline" className="mt-4">
            View All Locations
          </Button>
        </div> */}
      </div>
    </div>
  );
};

export default LocationList;
