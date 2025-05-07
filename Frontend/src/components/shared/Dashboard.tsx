import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  LineChart, PieChart,
  Line, Pie, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell
} from "recharts";
import axios from "axios";
import axiosInstance from "@/services/axiosInstance";

interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  price: number;
  status: 'available' | 'sold' | 'rented';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStatProps {
  label: string;
  value: string | number;
  trend?: "up" | "down";
  trendValue?: string;
  icon?: React.ReactNode;
}

const DashboardStat: React.FC<DashboardStatProps> = ({ label, value, trend, trendValue, icon }) => (
  <Card className="p-6 hover:shadow-lg transition-shadow bg-white/50 backdrop-blur-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
        {trend && trendValue && (
          <p className={`text-xs mt-2 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </p>
        )}
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
  </Card>
);

export const DashboardMetrics: React.FC<{
  properties: number;
  available: number;
  sold: number;
  agents: number;
  totalValue: number;
}> = ({ agents }) => {
  const [data, setData] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axiosInstance.get(`/Property/getAll`);
        console.log("API data---->", response.data);
        // Map API data to match Property interface
        const mappedData = response.data.data.map((prop: any) => ({
          id: prop._id,
          title: prop.title,
          type: prop.type,
          location: prop.location.address, // Simplify location to string
          price: prop.price,
          status: prop.status,
          bedrooms: prop.features?.bedrooms,
          bathrooms: prop.features?.bathrooms,
          area: prop.features?.area,
          featuredImage: prop.images?.[0],
          createdAt: prop.createdAt,
          updatedAt: prop.updatedAt,
        }));
        setData(mappedData);
        console.log("State data after setData:", mappedData);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch properties. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const chartData = [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 45 },
    { name: "Mar", value: 38 },
    { name: "Apr", value: 50 },
  ];

  // Calculate available and sold from data
  const availableCount = data.filter(prop => prop.status.toLowerCase() === 'available').length;
  const soldCount = data.filter(prop => prop.status.toLowerCase() === 'sold').length;

  // Calculate property distribution for PieChart
  const propertyDistribution = [
    { name: 'Apartments', value: data.filter(prop => prop.type.toLowerCase() === 'apartment').length },
    { name: 'Houses', value: data.filter(prop => prop.type.toLowerCase() === 'house').length },
    { name: 'Plots', value: data.filter(prop => prop.type.toLowerCase() === 'plot').length },
    { name: 'Commercial', value: data.filter(prop => prop.type.toLowerCase() === 'commercial').length },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  console.log("Render - Current data state:", data);
  console.log("Available count:", availableCount);
  console.log("Sold count:", soldCount);
  console.log("Property distribution:", propertyDistribution);

  
  return (
    <div className="space-y-6 my-6 mx-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStat 
          key="total-properties"
          label="Total Properties" 
          value={data.length}
          trend="up"
          trendValue="12% from last month"
        />
        <DashboardStat 
          key="available-properties"
          label="Available Properties" 
          value={availableCount}
        />
        <DashboardStat 
          key="sold-properties"
          label="Properties Sold" 
          value={soldCount}
          trend="up"
          trendValue="8% from last month"
        />
        <DashboardStat 
          key="active-agents"
          label="Active Agents" 
          value={agents}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Property Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};