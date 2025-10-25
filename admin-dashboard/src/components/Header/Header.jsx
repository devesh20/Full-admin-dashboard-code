import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, User, PanelLeftOpen, PanelLeftClose, MenuIcon, AlertTriangle, RefreshCw } from "lucide-react";
import { useAuth } from '../Login-Register/AuthContext';
import { useMediaQuery } from '@/hooks/use-media-query';
import axios from 'axios';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Modal,
  ModalDialog, 
  ModalClose,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/joy'

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from '../ThemeToggle/ThemeToggle';

function Header({ onSidebarToggle, isSidebarOpen, isSidebarCompact }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load read notifications from localStorage
  useEffect(() => {
    const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification,
        read: readNotifications.includes(notification.id)
      }))
    );
  }, []);

  // Save read notifications to localStorage
  const saveReadNotifications = (notificationIds) => {
    localStorage.setItem('readNotifications', JSON.stringify(notificationIds));
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.userName) return "U";
    
    return user.userName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Fetch inventory threshold notifications
  const fetchInventoryNotifications = async () => {
    try {
      setRefreshing(true);
      // Fetch from all inventory endpoints
      const [regularInventory, suppliedInventory, consumablesInventory] = await Promise.all([
        axios.get("/api/inventory/get-all"),
        axios.get("/api/supplied-inventory/get-all"),
        axios.get("/api/consumables-inventory/get-all")
      ]);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // Process regular inventory
      const regularNotifications = regularInventory.data.data
        .filter(item => {
          const itemDate = new Date(item.updatedAt || item.createdAt);
          return item.materialQuantity <= (item.limit || 10) && itemDate >= sevenDaysAgo;
        })
        .map(item => ({
          id: item._id,
          title: `Low purchased inventory: ${item.materialGrade}`,
          message: `Quantity (${item.materialQuantity}) is below limit (${item.limit || 10})`,
          timestamp: new Date(item.updatedAt || item.createdAt),
          type: 'inventory'
        }));

      // Process supplied inventory
      const suppliedNotifications = suppliedInventory.data.data
        .filter(item => {
          const itemDate = new Date(item.updatedAt || item.createdAt);
          return item.quantity <= (item.limit || 10) && itemDate >= sevenDaysAgo;
        })
        .map(item => ({
          id: item._id,
          title: `Low supplied inventory: ${item.rotorType}`,
          message: `Quantity (${item.quantity}) is below limit (${item.limit || 10})`,
          timestamp: new Date(item.updatedAt || item.createdAt),
          type: 'supplied'
        }));

      // Process consumables inventory
      const consumablesNotifications = consumablesInventory.data.data
        .filter(item => {
          const itemDate = new Date(item.updatedAt || item.createdAt);
          return item.consumablesQuantity <= (item.limit || 20) && itemDate >= sevenDaysAgo;
        })
        .map(item => ({
          id: item._id,
          title: `Low consumable: ${item.itemName}`,
          message: `Quantity (${item.consumablesQuantity}) is below limit (${item.limit || 20})`,
          timestamp: new Date(item.updatedAt || item.createdAt),
          type: 'consumable'
        }));

      // Combine all notifications
      const allNotifications = [
        ...regularNotifications,
        ...suppliedNotifications,
        ...consumablesNotifications
      ].sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(allNotifications);
      setUnreadCount(allNotifications.length);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching inventory notifications:", error);
      setRefreshing(false);
    }
  };

  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchInventoryNotifications();
    
    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchInventoryNotifications, 30 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };
  
  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('auth/login');
  };

  const handleClose = () => {
    navigate(-1)
  }
  
  const formatTimeDifference = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };
  
  const markAllAsRead = () => {
    const allNotificationIds = notifications.map(n => n.id);
    saveReadNotifications(allNotificationIds);
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    setUnreadCount(0);
  };
  
  // Determine the icon and tooltip to show based on sidebar state
  const getSidebarToggleIcon = () => {
    if (isMobile) {
      return isSidebarOpen ? 
        <MenuIcon className="h-5 w-5" /> : 
        <MenuIcon className="h-5 w-5" />;
    } else {
      return isSidebarCompact ? 
        <PanelLeftOpen className="h-5 w-5" /> : 
        <PanelLeftClose className="h-5 w-5" />;
    }
  };
  
  const getToggleTooltip = () => {
    if (isMobile) {
      return isSidebarOpen ? "Close menu" : "Open menu";
    } else {
      return isSidebarCompact ? "Expand sidebar" : "Collapse sidebar";
    }
  };

  return (
    <header className="flex items-center h-14 gap-2 border-b px-2 md:px-4 py-2 bg-white shadow-sm">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onSidebarToggle} 
        className="mr-2 relative group"
        aria-label={getToggleTooltip()}
        title={getToggleTooltip()}
      >
        {getSidebarToggleIcon()}
        <span className="sr-only">{getToggleTooltip()}</span>
      </Button>
      
      {/* <div className="hidden md:block text-lg font-semibold">
        Admin Dashboard
      </div> */}

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Actions group */}
      {/* <ThemeToggle/> */}
      <div className="flex items-center gap-1 md:gap-3 cursor-pointer">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative cursor-pointer">
              <BellIcon className="h-5 w-5 " />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] md:w-[320px] p-0 bg-white" align="end">
            <div className="border-b px-4 py-3 flex justify-between items-center">
              <h4 className="text-sm font-semibold">Notifications</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchInventoryNotifications}
                className="text-xs text-blue-600 hover:text-blue-800"
                disabled={refreshing}
              >
                {refreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex flex-col gap-2 p-4 max-h-[300px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="flex items-start gap-2 rounded-lg p-2 hover:bg-gray-100"
                  >
                    <div className="mt-0.5 text-orange-500">
                      <AlertTriangle size={16} />
                    </div>
                    <div className="grid gap-1 flex-1">
                      <p className="text-xs font-medium">{notification.title}</p>
                      <p className="text-xs text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400">{formatTimeDifference(notification.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">
                  No notifications from the past 7 days
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="border-t px-4 py-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-sm cursor-pointer" 
                  onClick={() => navigate('/dashboard/total-inventory')}
                >
                  View Total Inventory
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full cursor-pointer">
              <Avatar className="h-8 w-8 bg-black text-white">
                {/* <AvatarImage src={user?.image} alt={user?.userName || "User"} /> */}
                <AvatarFallback className="text-sm font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className='bg-white'>
            <DropdownMenuLabel>{user?.userName || "User"}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-black" />
            <DropdownMenuItem 
              className="cursor-pointer transition-colors duration-200 hover:bg-gray-100" 
              onClick={() => navigate("/dashboard/profile")}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer transition-colors duration-200 hover:bg-gray-100" 
              onClick={handleLogoutConfirm}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Logout Confirmation Dialog */}
      <Modal open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm} >
        <ModalDialog className="sm:max-w-[425px] bg-white">
          {/* <ModalClose /> */}
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            Are you sure you want to logout from the dashboard?
          </DialogContent>
          <DialogActions className="flex justify-left gap-2 mt-4">
            <Button className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer" onClick={() => setShowLogoutConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </header>
  );
}

export default Header;