import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Building, LayoutDashboard, PersonStanding, Settings, Users } from "lucide-react";

export function AppSidebar() {
  const [activeItem, setActiveItem] = useState("dashboard");
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
     
      id: "/admin"
    },
    {
      title: "Properties",
      icon: Building,
      
      id: "properties"
    },
    {
      title: "Users & Agents",
      icon: Users,
      
      id: "users"
    },
    {
      title: "Buyer Tier limits",
      icon: PersonStanding,
      
      id: "buyer-tier-limit"
    },
    {
      title: "Settings",
      icon: Settings,
      id: "settings"
    }
  ];

  return (
    <Sidebar>
      {/* <SidebarHeader>
        <div className="p-4">
          <Link to="/" className="flex items-center">
            <Building className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-primary">Legacy Land Real Estate</span>
          </Link>
        </div>
      </SidebarHeader> */}
      <SidebarContent className="mt-24">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  asChild
                  isActive={activeItem === item.id}
                 
                >
                  <Link to={item.id}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-sm text-muted-foreground">© 2025 Legacy Land</p>
      </SidebarFooter>
    </Sidebar>
  );
}
