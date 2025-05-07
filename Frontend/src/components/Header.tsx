// import { Button } from "@/components/ui/button";
// import {
//   Building,
//   Menu,
//   Plus,
//   Search,
//   User
// } from "lucide-react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Header = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const navigate = useNavigate();
//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
//         <div className="flex items-center">
//           <Link to="/" className="flex items-center">
//             <Building className="h-8 w-8 text-primary" />
//             <span className="ml-2 text-2xl font-bold text-primary">Legacy land Real Estate</span>
//           </Link>
//         </div>

        

//         <div className="flex items-center">
//           <Button variant="outline" size="sm" className="mr-2 hidden md:flex">
//             <Search size={16} className="mr-1" />
//             Search
//           </Button>
//           <Button onClick={() => navigate("/login")} variant="ghost" size="sm" className="hidden md:flex">
//             <User size={16} className="mr-1" />
//             Login
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="md:hidden"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             <Menu />
//           </Button>
//         </div>
//       </div>

//       {mobileMenuOpen && (
//                     <MobileNavItem title="Login" icon={<User size={18} />} />
          
//       )}
//     </header>
//   );
// };

// const NavItem = ({ title, icon, active = false }: { title: string; icon?: React.ReactNode; active?: boolean }) => (
//   <Link
//     to={`/`}
//     className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${active ? "text-primary" : "text-gray-700 hover:text-primary"
//       }`}
//   >
//     {icon && <span className="mr-1.5">{icon}</span>}
//     {title}
//     {active && <div className="h-1 w-full bg-primary absolute bottom-0 left-0 rounded-t-md"></div>}
//   </Link>
// );

// const MobileNavItem = ({ title, icon, active = false }: { title: string; icon?: React.ReactNode; active?: boolean }) => (
//   <Link
//     to="/"
//     className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${active ? "text-primary bg-accent" : "text-gray-700 hover:bg-gray-50 hover:text-primary"
//       }`}
//   >
//     {icon && <span className="mr-2">{icon}</span>}
//     {title}
//   </Link>
// );

// export default Header;

// import { Button } from "@/components/ui/button";
// import {
//   Building,
//   Menu,
//   Plus,
//   Search,
//   User,
//   LogOut
// } from "lucide-react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Header = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated auth state
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setIsLoggedIn(false); // Simulate logout
//     navigate("/"); // Redirect to home page
//   };

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
//         <div className="flex items-center">
//           <Link to="/" className="flex items-center">
//             <Building className="h-8 w-8 text-primary" />
//             <span className="ml-2 text-2xl font-bold text-primary">Legacy Land Real Estate</span>
//           </Link>
//         </div>

//         <div className="flex items-center">
//           <Button variant="outline" size="sm" className="mr-2 hidden md:flex">
//             <Search size={16} className="mr-1" />
//             Search
//           </Button>
//           {isLoggedIn ? (
//             <Button onClick={handleLogout} variant="ghost" size="sm" className="hidden md:flex">
//               <LogOut size={16} className="mr-1" />
//               Logout
//             </Button>
//           ) : (
//             <Button onClick={() => navigate("/login")} variant="ghost" size="sm" className="hidden md:flex">
//               <User size={16} className="mr-1" />
//               Login
//             </Button>
//           )}

//           <Button
//             variant="ghost"
//             size="icon"
//             className="md:hidden"
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           >
//             <Menu />
//           </Button>
//         </div>
//       </div>

//       {mobileMenuOpen && (
//         <div className="md:hidden">
//           {isLoggedIn ? (
//             <MobileNavItem
//               title="Logout"
//               icon={<LogOut size={18} />}
//               onClick={handleLogout}
//             />
//           ) : (
//             <MobileNavItem
//               title="Login"
//               icon={<User size={18} />}
//               onClick={() => navigate("/login")}
//             />
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// const NavItem = ({ title, icon, active = false }: { title: string; icon?: React.ReactNode; active?: boolean }) => (
//   <Link
//     to={`/`}
//     className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${active ? "text-primary" : "text-gray-700 hover:text-primary"
//       }`}
//   >
//     {icon && <span className="mr-1.5">{icon}</span>}
//     {title}
//     {active && <div className="h-1 w-full bg-primary absolute bottom-0 left-0 rounded-t-md"></div>}
//   </Link>
// );

// const MobileNavItem = ({
//   title,
//   icon,
//   active = false,
//   onClick,
// }: {
//   title: string;
//   icon?: React.ReactNode;
//   active?: boolean;
//   onClick?: () => void;
// }) => (
//   <Link
//     to={title === "Logout" ? "#" : "/"}
//     onClick={onClick}
//     className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${active ? "text-primary bg-accent" : "text-gray-700 hover:bg-gray-50 hover:text-primary"
//       }`}
//   >
//     {icon && <span className="mr-2">{icon}</span>}
//     {title}
//   </Link>
// );

// export default Header;

import { Button } from "@/components/ui/button";
import {
  Building,
  Menu,
  Search,
  User,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, logout, accessToken, refreshToken } = useAuthStore();

  

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Building className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-primary">Legacy Land Real Estate</span>
          </Link>
        </div>

       

        <div className="flex items-center">
          {/* <Button variant="outline" size="sm" className="mr-2 hidden md:flex">
            <Search size={16} className="mr-1" />
            Search
          </Button> */}
          {isAuthenticated ? (
            <Button onClick={handleLogout} variant="ghost" size="sm" className="hidden md:flex">
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          ) : (
            <Button onClick={() => navigate("/login")} variant="ghost" size="sm" className="hidden md:flex">
              <User size={16} className="mr-1" />
              Login
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden">
          {isAuthenticated ? (
            <MobileNavItem
              title="Logout"
              icon={<LogOut size={18} />}
              onClick={handleLogout}
            />
          ) : (
            <MobileNavItem
              title="Login"
              icon={<User size={18} />}
              onClick={() => navigate("/login")}
            />
          )}
        </div>
      )}
    </header>
  );
};

const NavItem = ({ title, icon, active = false }: { title: string; icon?: React.ReactNode; active?: boolean }) => (
  <Link
    to={`/`}
    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
      active ? "text-primary" : "text-gray-700 hover:text-primary"
    }`}
  >
    {icon && <span className="mr-1.5">{icon}</span>}
    {title}
    {active && <div className="h-1 w-full bg-primary absolute bottom-0 left-0 rounded-t-md"></div>}
  </Link>
);

const MobileNavItem = ({
  title,
  icon,
  active = false,
  onClick,
}: {
  title: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => (
  <Link
    to={title === "Logout" ? "#" : "/"}
    onClick={onClick}
    className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
      active ? "text-primary bg-accent" : "text-gray-700 hover:bg-gray-50 hover:text-primary"
    }`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {title}
  </Link>
);

export default Header;