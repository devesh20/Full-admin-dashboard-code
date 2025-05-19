import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    // Clear API error when user makes any change
    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,12}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number (10-12 digits)";
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError("");
    
    try {
      console.log("Submitting:", formData);
      const result = await axios.post("/api/admin/login-admin", formData, { withCredentials: true });
      const { user, accessToken, refreshToken } = result.data.data;

      login({ user, accessToken, refreshToken });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        setApiError("Invalid credentials. Please check your phone number and password.");
      } else if (error.response?.status === 404) {
        setApiError("User not found. Please check your phone number.");
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-2 py-4">
      <div className="w-full max-w-xs">
        <Card className="shadow-md">
          <CardHeader >
            <CardTitle className="text-center text-lg font-bold">Login</CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-1">
            {apiError && (
              <div className="mb-2 p-1.5 bg-red-50 border border-red-200 text-red-600 rounded text-xs flex items-start">
                <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{apiError}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-2">
              <InputField 
                id="phoneNumber" 
                label="Phone Number" 
                type="tel" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                error={errors.phoneNumber}
              />
              <InputField 
                id="password" 
                label="Password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                error={errors.password}
              />
              <Button 
                type="submit" 
                className="w-full bg-black text-white cursor-pointer h-8 mt-2 text-xs"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center pt-1 text-xs">
                <span>Don't have an account? </span>
                <Link to="/auth/register" className="no-underline text-blue-600 font-medium">Register</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InputField = ({ id, label, type = "text", value, onChange, error }) => (
  <div className="space-y-1">
    <Label htmlFor={id} className="text-xs mb-1 block">{label}</Label>
    <Input
      id={id}
      type={type}
      name={id}
      placeholder={`Enter your ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      className={`text-xs h-7 py-1 ${error ? "border-red-500" : ""}`}
    />
    {error && <p className="text-red-500 text-[14px] mt-0.5">{error}</p>}
  </div>
);

export default Login;