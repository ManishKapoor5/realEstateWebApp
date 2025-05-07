// export default Login;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, Facebook, AlertCircle, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from "@/services/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApprovalRequest, setShowApprovalRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [accountStatus, setAccountStatus] = useState('');
  const [userId, setUserId] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth store methods
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Get the redirect path (if any)
  const from = location.state?.from;
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from || '/', { replace: true });
    }
  }, [navigate, from, isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setShowApprovalRequest(false);

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Login attempt started for:", email);

    try {
      // Regular user login via API
      const API_URL = import.meta.env.MODE ==="developement" ?  "http://localhost:3000/api/v1" : "/"
      const response = await axiosInstance.post(`${API_URL}/RealEstateUser/login`, {
        email,
        password,
      });

      const data = response.data;
      console.log("Login response data:", data);

      // Status checks
      if (data.status === 'pending') {
        setError('Your account is pending admin approval. You can send a request to expedite the process.');
        setAccountStatus('pending');
        setUserId(data._id);
        setShowApprovalRequest(true);
        toast({
          title: "Account Pending Approval",
          description: "Your account is pending admin approval. You can request approval below.",
          variant: "default",
          duration: 6000
        });
        setIsLoading(false);
        return;
      }

      if (data.status === 'inactive') {
        setError('Your account has been deactivated. You can request reactivation below.');
        setAccountStatus('inactive');
        setUserId(data._id);
        setShowApprovalRequest(true);
        toast({
          title: "Account Inactive",
          description: "Your account has been deactivated. You can request reactivation.",
          variant: "destructive",
          duration: 6000
        });
        setIsLoading(false);
        return;
      }

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Ensure role is a string and normalize to lowercase
      const userRole = String(data.role || '').toLowerCase();
      console.log("User role (normalized):", userRole);

      // Create user object with explicit typing
      const validRoles = ["buyer", "seller", "agent", "admin"];
      const user = {
        _id: data._id,
        fullName: data.fullName || '',
        email: data.email,
        contactNumber: data.contactNumber || '',
        role: validRoles.includes(userRole) ? (userRole as "buyer" | "seller" | "agent" | "admin") : "buyer",
        status: data.status,
        tier: data.tier || 'basic', // Add a default or fetched tier value
      };

      // Set auth state
      setAuth(data.accessToken, data.refreshToken, user);
      console.log("Auth state set, user role:", userRole);

      // Success message
      toast({
        title: "Success",
        description: "You have successfully logged in!",
      });

      // Navigate based on role with a small delay to ensure state updates
      setTimeout(() => {
        if (userRole === 'admin') {
          console.log("Navigating to admin dashboard");
          navigate("/admin");
        }
        else if(userRole === 'seller'){
          navigate("/seller-dashboard")
        }
        else if(userRole === 'agent'){
          navigate("/agent-dashboard")
        }
        else if(userRole === 'buyer'){
          navigate("/buyer-dashboard")
        }
        else {
          console.log("Navigating to:", from || "/");
          navigate(from || "/");
        }
      }, 100);

    } catch (err) {
      console.error("Login Error:", err);
      
      if (axios.isAxiosError(err) && err.response) {
        // Handle specific error messages from the API
        const errorMessage = err.response.data?.message || "Invalid email or password";
        setError(errorMessage);
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        // Handle other errors
        setError("An unexpected error occurred. Please try again later.");
        toast({
          title: "Login Failed",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendApprovalRequest = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User information is missing. Please try logging in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingRequest(true);
    
    try {
      const API_URL = 'https://realestatesite-backend.onrender.com/api/v1';
      
      const response = await axios.post(`${API_URL}/RealEstateUser/request-approval`, {
        userId: userId,
        email: email,
        requestType: accountStatus === 'pending' ? 'activation' : 'reactivation',
        message: requestMessage
      });

      if (response.data.success) {
        toast({
          title: "Request Sent",
          description: "Your approval request has been sent to administrators.",
          variant: "default",
        });
        setShowApprovalRequest(false);
      } else {
        throw new Error(response.data.message || "Failed to send request");
      }
    } catch (err) {
      console.error("Approval Request Error:", err);
      toast({
        title: "Request Failed",
        description: err.response?.data?.message || "Failed to send approval request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSendingRequest(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Building className="h-6 w-6" />
            Real Estate CRM
          </CardTitle>
          <CardDescription>Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-sm text-red-800">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          {showApprovalRequest ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-blue-800 mb-2">Request Account Approval</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Add a message to administrators explaining why your account should be {accountStatus === 'pending' ? 'activated' : 'reactivated'}.
                </p>
                <textarea
                  className="w-full p-3 border border-blue-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Please explain why you need access to the system..."
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                ></textarea>
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={handleSendApprovalRequest}
                    disabled={isSendingRequest || !requestMessage.trim()}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {isSendingRequest ? "Sending..." : "Send Request"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowApprovalRequest(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={isLoading}
                  required
                  className="focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                  className="focus:ring-primary"
                />
              </div>
              <div className="flex justify-end text-sm">
                <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          )}
          
          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account?</span>{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
        {/* <CardFooter>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Facebook className="h-5 w-5" />
            Continue with Facebook
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default Login;