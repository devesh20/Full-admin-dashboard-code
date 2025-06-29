import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
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
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    userName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    aadhaarNo: "",
    jobType: "admin",
    isOwner: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    
    // Validate name
    if (!formData.userName.trim()) {
      newErrors.userName = "Name is required";
    } else if (formData.userName.trim().length < 3) {
      newErrors.userName = "Name must be at least 3 characters";
    }
    
    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10,12}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number (10-12 digits)";
    }
    
    // Validate Aadhaar number
    if (formData.aadhaarNo && !/^\d{12}$/.test(formData.aadhaarNo.trim())) {
      newErrors.aadhaarNo = "Aadhaar number must be 12 digits";
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Validate confirm password
    if (formData.password && !formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...dataToSubmit } = formData;
    
    try {
      console.log("Submitting:", dataToSubmit);
      const result = await axios.post("/api/admin/register-admin", dataToSubmit);
      console.log(result);
      navigate("/auth/login");
    } catch (error) {
      console.log(error);
      if (error.response?.status === 409) {
        setApiError("User with this phone number already exists");
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Registration failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-2 py-4">
      <div className="w-full max-w-xs">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-lg font-bold">Register</CardTitle>
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
                id="userName" 
                label="Name" 
                value={formData.userName} 
                onChange={handleChange} 
                error={errors.userName}
              />
              <InputField 
                id="phoneNumber" 
                label="Phone Number" 
                type="tel"
                value={formData.phoneNumber} 
                onChange={handleChange} 
                error={errors.phoneNumber}
              />
              <InputField 
                id="aadhaarNo" 
                label="Aadhaar Number (Optional)" 
                value={formData.aadhaarNo} 
                onChange={handleChange} 
                error={errors.aadhaarNo}
              />
              <InputField 
                id="password" 
                label="Password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                error={errors.password}
              />
              <InputField 
                id="confirmPassword" 
                label="Confirm Password" 
                type="password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                error={errors.confirmPassword}
              />
              <div className="flex items-center gap-1.5 mt-1">
                <input
                  id="isOwner"
                  type="checkbox"
                  name="isOwner"
                  checked={formData.isOwner}
                  onChange={handleChange}
                  className="h-3 w-3 cursor-pointer"
                />
                <Label htmlFor="isOwner" className="mb-0 text-xs cursor-pointer">Are you an Owner?</Label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black text-white cursor-pointer h-8 mt-2 text-xs"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
              <div className="text-center pt-1 text-xs">
                <span>Already have an account? </span>
                <Link to="/auth/login" className="no-underline text-blue-600 font-medium">Login</Link>
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

export default Register;
