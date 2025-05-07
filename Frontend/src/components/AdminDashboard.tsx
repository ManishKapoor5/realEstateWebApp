import { useState } from "react";
import { PropertyForm } from "@/components/shared/PropertyForm";
import { Property } from "../types/property";
import { useToast } from "@/components/ui/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";

import { Outlet } from "react-router-dom";
import  Header  from "@/components/Header";

export default function AdminDashboard() {
  const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
  const { toast } = useToast();

  const handlePropertySubmit = (data: Partial<Property>) => {
    toast({
      title: "Success",
      description: "Property has been added successfully.",
    });
    setIsPropertyFormOpen(false);
  };

  return (
    <SidebarProvider>
      
      <div className="flex min-h-screen w-full">
        
        <AppSidebar />
        
        <div className="flex-1">
          <Header />
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold gradient-text">Dashboard Overview</h1>
                {/* <Button onClick={() => setIsPropertyFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Property
                </Button> */}
              </div>
              
            </div>
            
          </header>

          <Outlet />
          <main className="container mx-auto px-4 py-8">
            
              
                      
          </main>
          
          <PropertyForm
            open={isPropertyFormOpen}
            onOpenChange={setIsPropertyFormOpen}
            onSubmit={handlePropertySubmit}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
