import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineLogout } from 'react-icons/hi';
import { useAuth } from '../Login-Register/AuthContext';
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../lib/consts/Navigation';

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

function AppSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <ShadcnSidebar className="h-screen bg-white">
      <SidebarContent>
        <div className="py-2">
          <h1 className="px-4 text-lg font-bold">Admin Dashboard</h1>
        </div>
        
        {/* Main Navigation Links */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {DASHBOARD_SIDEBAR_LINKS.map((item) => (
                <SidebarMenuItem 
                  key={item.key}
                  className={location.pathname === item.path ? "bg-muted" : ""}
                >
                  <SidebarMenuButton asChild onClick={() => navigate(item.path)}>
                    <div className="flex items-center cursor-pointer">
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Bottom Links */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
                <SidebarMenuItem 
                  key={item.key}
                  className={location.pathname === item.path ? "bg-muted" : ""}
                >
                  <SidebarMenuButton asChild onClick={() => navigate(item.path)}>
                    <div className="flex items-center cursor-pointer">
                      <span className="mr-2">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={handleLogout}>
                  <div className="flex items-center cursor-pointer text-red-500">
                    <HiOutlineLogout  />
                    <span>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
}

export default AppSidebar;