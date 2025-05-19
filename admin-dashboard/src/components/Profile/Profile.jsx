import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../Login-Register/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    password: "",
    image: "",
    email: ""
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.userName || "",
        phone: user.phoneNumber || "",
        password: "",
        image: user.image || "",
        email: user.email || ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, image: imageUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error("User information not available");
      return;
    }

    setIsSaving(true);
    try {
      // Prepare data for update
      const updateData = {
        userName: profile.name,
        phoneNumber: profile.phone,
      };

      // Only include password if it's not empty
      if (profile.password.trim() !== "") {
        updateData.password = profile.password;
      }

      const response = await axios.put(`/api/admin/update/${user._id}`, updateData, {
        withCredentials: true
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    return profile.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="w-full mx-auto p-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24 bg-black text-white">
              <AvatarImage src={profile.image || "/default-avatar.png"} alt="Profile" />
              <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
            </Avatar>
            {/* <label className="absolute bottom-0 right-0 p-2 bg-gray-200 rounded-full cursor-pointer">
              <Pencil className="h-4 w-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label> */}
          </div>
          
          <div className="w-full">
            <Label className="mb-1 ml-1">Name</Label>
            <Input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="w-full">
            <Label className="mb-1 ml-1">Phone Number</Label>
            <Input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="w-full">
            <Label className="mb-1 ml-1">Password</Label>
            <Input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleInputChange}
              placeholder="Enter new password to change (leave empty to keep current)"
            />
          </div>

          {/* <div className="w-full">
            <Label className="mb-1 ml-1">Email</Label>
            <Input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div> */}
          
          <Button 
            type="submit" 
            className="w-full mt-4 bg-black text-white" 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Profile;