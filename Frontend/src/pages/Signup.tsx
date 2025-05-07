// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Building, Facebook, Square } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Signup = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [role, setRole] = useState("buyer");
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     contactNumber: '',
//     role: 'buyer', // Default role
//   });

//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedRole = e.target.value;
//     setRole(selectedRole);
//     setFormData({ ...formData, role: selectedRole });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     console.log("handle Submit")
    
//     const payload = {
//       ...formData,
//       contactNumber: Number(formData.contactNumber),
//     };

//     try {
//       setIsLoading(true);
//       console.log("sign up try")
//       await axios.post(`https://realestatesite-backend.onrender.com/api/v1/RealEstateUser/signup`, payload);
//       navigate('/login');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Signup failed');
//       console.log(err.response.data.message)
//       if (err) {
//   toast({ title: "Signup Failed", description: error, variant: "destructive" });
// }

//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-6">
//           <a href="/" className="inline-flex items-center mb-4">
//             <Building className="h-8 w-8 text-primary" />
//             <span className="ml-2 text-2xl font-bold text-primary">Legacy land Real Estate</span>
//           </a>
//           <h1 className="text-2xl font-bold">Create an Account</h1>
//           <p className="text-gray-600">Join Legacy land to find your dream property</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Sign Up</CardTitle>
//             <CardDescription>Enter your details to create an account</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label htmlFor="name" className="text-sm font-medium">Full Name</label>
//                 <Input
//                   id="name"
//                   placeholder="Enter your full name"
//                   value={formData.fullName}
//                   autoComplete={"off"}
//                   onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="email" className="text-sm font-medium">Email</label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   autoComplete={"off"}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   placeholder="Enter your phone number"
//                   value={formData.contactNumber}
//                   autoComplete={"off"}
//                   onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="password" className="text-sm font-medium">Password</label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Create a password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="role" className="text-sm font-medium">Role</label>
//                 <select
//                   id="role"
//                   name="role"
//                   value={role}
//                   onChange={handleRoleChange}
//                   className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="buyer">Buyer</option>
//                   <option value="seller">Seller</option>
//                   <option value="agent">Agent</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <input type="checkbox" id="terms" className="rounded text-primary" required />
//                 <label htmlFor="terms" className="text-sm text-gray-600">
//                   I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
//                 </label>
//               </div>
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Creating account..." : "Create Account"}
//               </Button>
//             </form>

//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or sign up with</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Button variant="outline" className="w-full">
//                 <Square className="w-4 h-4 mr-2" />
//                 Google
//               </Button>
//               <Button variant="outline" className="w-full">
//                 <Facebook className="w-4 h-4 mr-2" />
//                 Facebook
//               </Button>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{" "}
//               <a href="/login" className="text-primary font-medium hover:underline">
//                 Log in
//               </a>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Signup;

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Building, Facebook, Square, AlertCircle } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useState } from "react";

// const Signup = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     contactNumber: '',
//     role: 'buyer', // Default role
//   });

//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//   const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedRole = e.target.value;
//     setFormData({ ...formData, role: selectedRole });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const payload = {
//       ...formData,
//       contactNumber: Number(formData.contactNumber),
//       // Set status to "pending" for sellers and agents, "active" for buyers
//       status: ['seller', 'agent'].includes(formData.role) ? 'pending' : 'active'
//     };

//     try {
//       setIsLoading(true);
//       await axios.post(`${API_URL || 'https://realestatesite-backend.onrender.com'}/api/v1/RealEstateUser/signup`, payload);
      
//       // Show appropriate message based on role
//       if (['seller', 'agent'].includes(formData.role)) {
//         toast({ 
//           title: "Registration Successful", 
//           description: `Your ${formData.role} account is pending approval from an admin. You'll be notified once approved.`,
//           duration: 6000
//         });
//       } else {
//         toast({ 
//           title: "Registration Successful", 
//           description: "Your account has been created successfully." 
//         });
//       }
      
//       navigate('/login');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Signup failed');
//       toast({ 
//         title: "Signup Failed", 
//         description: err.response?.data?.message || 'An error occurred during signup', 
//         variant: "destructive" 
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-6">
//           <a href="/" className="inline-flex items-center mb-4">
//             <Building className="h-8 w-8 text-primary" />
//             <span className="ml-2 text-2xl font-bold text-primary">Legacy land Real Estate</span>
//           </a>
//           <h1 className="text-2xl font-bold">Create an Account</h1>
//           <p className="text-gray-600">Join Legacy land to find your dream property</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Sign Up</CardTitle>
//             <CardDescription>Enter your details to create an account</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <label htmlFor="name" className="text-sm font-medium">Full Name</label>
//                 <Input
//                   id="name"
//                   placeholder="Enter your full name"
//                   value={formData.fullName}
//                   autoComplete="off"
//                   onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="email" className="text-sm font-medium">Email</label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   autoComplete="off"
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   placeholder="Enter your phone number"
//                   value={formData.contactNumber}
//                   autoComplete="off"
//                   onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label htmlFor="password" className="text-sm font-medium">Password</label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="Create a password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="role" className="text-sm font-medium">Role</label>
//                 <select
//                   id="role"
//                   name="role"
//                   value={formData.role}
//                   onChange={handleRoleChange}
//                   className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 >
//                   <option value="buyer">Buyer</option>
//                   <option value="seller">Seller</option>
//                   <option value="agent">Agent</option>
//                 </select>
//               </div>
              
//               {/* Info message for sellers and agents */}
//               {['seller', 'agent'].includes(formData.role) && (
//                 <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
//                   <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
//                   <span>
//                     <strong>Note:</strong> {formData.role === 'seller' ? 'Seller' : 'Agent'} accounts require admin approval before you can log in. This may take 1-2 business days.
//                   </span>
//                 </div>
//               )}
              
//               <div className="flex items-center space-x-2">
//                 <input type="checkbox" id="terms" className="rounded text-primary" required />
//                 <label htmlFor="terms" className="text-sm text-gray-600">
//                   I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
//                 </label>
//               </div>
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Creating account..." : "Create Account"}
//               </Button>
//             </form>

//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-gray-200"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">Or sign up with</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <Button variant="outline" className="w-full">
//                 <Square className="w-4 h-4 mr-2" />
//                 Google
//               </Button>
//               <Button variant="outline" className="w-full">
//                 <Facebook className="w-4 h-4 mr-2" />
//                 Facebook
//               </Button>
//             </div>
//           </CardContent>
//           <CardFooter className="flex justify-center">
//             <p className="text-sm text-gray-600">
//               Already have an account?{" "}
//               <a href="/login" className="text-primary font-medium hover:underline">
//                 Log in
//               </a>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, Facebook, Square, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvalMessage, setApprovalMessage] = useState(''); // Added state for approval message
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    contactNumber: '',
    role: 'buyer', // Default role
  });

  const API_URL =  'https://realestatesite-backend.onrender.com';
  
  // Check if current role requires approval
  const requiresApproval = ['seller', 'agent'].includes(formData.role);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRole = e.target.value;
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate approval message if role requires approval
    if (requiresApproval && !approvalMessage.trim()) {
      setError('Please provide a message for administrators');
      toast({ 
        title: "Error", 
        description: "Please provide a message for administrators", 
        variant: "destructive" 
      });
      return;
    }
    
    const payload = {
      ...formData,
      contactNumber: Number(formData.contactNumber),
      // Set status to "pending" for sellers and agents, "active" for buyers
      status: requiresApproval ? 'pending' : 'active'
    };

    try {
      setIsLoading(true);
      // First API call to create user account
      const response = await axios.post(`${API_URL}/RealEstateUser/signup`, payload);
      
      // If role requires approval, automatically send approval request
      if (requiresApproval && response.data) {
        const userId = response.data._id; // Get user ID from signup response
        
        try {
          // Second API call to send approval request
          await axios.post(`${API_URL}/RealEstateUser/request-approval`, {
            userId: userId,
            email: formData.email,
            requestType: 'activation',
            message: approvalMessage
          });
          
          toast({ 
            title: "Registration Successful", 
            description: `Your ${formData.role} account has been created and an approval request has been automatically sent. You'll be notified once approved.`,
            duration: 6000
          });
        } catch (approvalErr) {
          console.error("Approval request error:", approvalErr);
          toast({ 
            title: "Registration Successful", 
            description: `Your account was created, but we couldn't automatically send your approval request. Please login to send it manually.`,
            duration: 6000
          });
        }
      } else {
        toast({ 
          title: "Registration Successful", 
          description: "Your account has been created successfully." 
        });
      }
      
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
      toast({ 
        title: "Signup Failed", 
        description: err.response?.data?.message || 'An error occurred during signup', 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center mb-4">
            <Building className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-primary">Legacy Land Real Estate</span>
          </a>
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-600">Join Legacy Land to find your dream property</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 p-3 rounded-md mb-4 text-sm text-red-800 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  autoComplete="off"
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  autoComplete="off"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.contactNumber}
                  autoComplete="off"
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              
              {/* Approval Message Section - Only shown for seller/agent */}
              {requiresApproval && (
                <div className="space-y-2">
                  <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Note:</strong> {formData.role === 'seller' ? 'Seller' : 'Agent'} accounts require admin approval before you can log in. 
                      Please provide details about {formData.role === 'seller' ? 'your properties and how you plan to use our platform' : 'your experience and credentials'}.
                    </span>
                  </div>
                  
                  <label htmlFor="approvalMessage" className="text-sm font-medium">Message for Administrators</label>
                  <textarea
                    id="approvalMessage"
                    rows={4}
                    placeholder={formData.role === 'seller' 
                      ? "Please explain why you're signing up as a seller and what properties you plan to list..."
                      : "Please provide details about your experience as a real estate agent..."}
                    value={approvalMessage}
                    onChange={(e) => setApprovalMessage(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="terms" className="rounded text-primary" required />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                </label>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div> */}

            {/* <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Square className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
            </div> */}
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-primary font-medium hover:underline">
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;