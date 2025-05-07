import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { useNavigate } from "react-router-dom";

// Define the Property interface
interface Property {
  _id: string;
  title: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  size: string;
  images: string | string[];
  status: string;
  features: {
    parking: boolean;
    furnished: boolean;
    bedrooms: number;
    bathrooms: number;
    area?: number;
  };
  propertyType: string;
  type: string;
  owner: {
    name: string;
    email: string;
    contact: string;
  };
  description: string;
  isNew?: boolean;
  isVerified?: boolean;
  approval?: string; // Updated to match the imported Property type
  createdAt?: string; // Added property
}

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle responsive display
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerPage(2);
      } else {
        setCardsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (properties.length > 0) {
      const maxPage = Math.ceil(properties.length / cardsPerPage) - 1;
      if (currentPage > maxPage) {
        setCurrentPage(maxPage);
      }
    }
  }, [cardsPerPage, properties.length, currentPage]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/Property/getFrontPageAllProperties`);
        if (!response) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.data;
        const propertiesData = Array.isArray(data.data) ? data.data : [];

        const formattedProperties: Property[] = propertiesData.map((item: any) => ({
          _id: item._id || item.id,
          title: item.title,
          location: {
            address: item.location?.address || "",
            city: item.location?.city || "",
            state: item.location?.state || "",
            country: item.location?.country || "",
            postalCode: item.location?.postalCode || "",
            latitude: item.location?.latitude || 0,
            longitude: item.location?.longitude || 0,
          },
          price: item.price || "0",
          bedrooms: item.bedrooms || item.features?.bedrooms || 0,
          bathrooms: item.bathrooms || item.features?.bathrooms || 0,
          area: item.area || item.size || "0",
          size: item.size || item.area || "0",
          images: Array.isArray(item.images) ? item.images : item.images ? [item.images] : [],
          status: item.status || "",
          features: {
            parking: item.features?.parking || false,
            furnished: item.features?.furnished || false,
            bedrooms: item.features?.bedrooms || item.bedrooms || 0,
            bathrooms: item.features?.bathrooms || item.bathrooms || 0,
            area: item.features?.area || 0,
          },
          propertyType: item.propertyType || item.type || "",
          type: item.type || item.propertyType || "",
          owner: {
            name: item.owner?.name || "",
            email: item.owner?.email || "",
            contact: item.owner?.contact || "",
          },
          description: item.description || "",
          isNew: item.isNew || false,
          isVerified: item.isVerified || false,
          approval: item.approval || '', // Ensure 'approval' is included
        }));

        setProperties(formattedProperties);
        setError(null);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch properties");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const totalPages = Math.max(1, Math.ceil(properties.length / cardsPerPage));

  const getVisibleProperties = () => {
    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;
    return properties.slice(start, end);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (property: Property) => {
    navigate(`/property/${property._id}`);
  };

  if (loading) {
    return (
      <div className="py-24 bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-red-700 font-medium text-lg mb-2">Unable to load properties</h3>
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              No properties currently available. Check back soon!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const visibleProperties = getVisibleProperties();

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Featured Properties
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Explore our handpicked premium properties in top locations
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-in-out gap-4">
              {visibleProperties.map((property) => (
                <div
                  key={property._id}
                  className="w-full"
                  style={{ flex: `0 0 calc(${100 / cardsPerPage}% - ${(cardsPerPage - 1) * 16 / cardsPerPage}px)` }}
                >
                  <PropertyCard
                    title={property.title}
                    price={parseFloat(property.price)}
                    location={`${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
                    property={{ ...property, approval: property.approval || '', createdAt: property.createdAt ? new Date(property.createdAt).toISOString() : undefined }}
                    onViewDetails={() => handleViewDetails(property)}
                  />
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <>
              <button
                onClick={prevPage}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center z-10 hover:bg-gray-100"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={nextPage}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 h-10 w-10 bg-white rounded-full shadow-md flex items-center justify-center z-10 hover:bg-gray-100"
                aria-label="Next page"
              >
                <ChevronRight className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`h-2 rounded-full transition-all ${
                  currentPage === index ? "w-6 bg-blue-600" : "w-2 bg-gray-300"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProperties;