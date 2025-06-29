import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "../Login-Register/AuthContext";
import {
  DASHBOARD_SIDEBAR_LINKS,
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
} from "../lib/consts/Navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import {
  Modal,
  ModalDialog, 
  ModalClose,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/joy';
import { Button } from "@/components/ui/button";
import dynaquipLogo from "@/assets/white-logo.png";


const Sidebar = ({ isCompact }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Use isCompact prop if provided, otherwise determine based on screen size
  const compact = isCompact !== undefined ? isCompact : isMobile;

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate("/auth/login");
  };

  const isActive = (path) => pathname === path;

  return (
    <>
      <div className={`${compact ? 'w-[70px]' : 'w-[240px]'} h-screen bg-[#000000] text-white flex flex-col transition-all duration-300`}>
        {/* Sidebar Header for logo the company*/}
        {/* <div className={`h-14 ${compact ? 'px-2 justify-center' : 'px-4'} flex items-center border-b border-[#2A2B2E]`}>
          {compact ? (
            <div className="flex items-center justify-center">
              <img 
                src="/logo-small.png" 
                alt="DE" 
                className="h-8 w-8"
              />
            </div>
          ) : (
            <div className="flex items-center">
              <img 
                src="/dynaquip-engineers-logo.jpg" 
                alt="DE" 
                className="h-8"
              />
            </div>
          )}
        </div> */}
        <div className={`h-14 ${compact ? 'px-2 justify-center' : 'px-4'} flex items-center border-b border-[#2A2B2E]`}>
          {compact ? (
            <div className="text-xl font-bold flex items-center justify-center transition-all duration-300">
              <Button onClick={() => navigate("/dashboard")}>
                <img 
                src={dynaquipLogo} 
                alt="Dynaquip" 
                className="h-10 w-10 object-contain transition-all duration-300 cursor-pointer"
              />
              </Button>
              {/* <h1 className="text-lg font-semibold white-space: nowrap"></h1> */}
            </div>
          ) : (
            <div className="text-md font-normal flex items-center justify-center gap-1 transition-all duration-300">
              <Button onClick={() => navigate("/dashboard")}>
                <img 
                src={dynaquipLogo} 
                alt="Dynaquip" 
                className="h-10 w-10 object-contain transition-all duration-300 cursor-pointer"
              />
              <h1 className="text-md font-normal font-serif transition-all duration-300">Dynaquip Engineers</h1>
              </Button>
            </div>
          )}
        </div>


        {/* Sidebar Links */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-2">
          {DASHBOARD_SIDEBAR_LINKS.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center ${compact ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md no-underline transition-colors ${
                isActive(item.path)
                  ? "bg-[#343541] text-white"
                  : "text-gray-300 hover:bg-[#2A2B2E] hover:text-white"
              }`}
              title={compact ? item.label : ""}
            >
              <span className={`text-lg ${compact ? 'mx-auto' : ''}`}>{item.icon}</span>
              {!compact && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Bottom Links + Logout */}
        <div className="px-2 py-4 border-t border-[#2A2B2E] space-y-2 overflow-x-hidden">
          {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`flex items-center ${compact ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-md no-underline duration-300 ${
                isActive(item.path)
                  ? "bg-[#343541] text-white"
                  : "text-gray-300 hover:bg-[#2A2B2E] hover:text-white"
              }`}
              title={compact ? item.label : ""}
            >
              <span className={`text-lg ${compact ? 'mx-auto' : ''}`}>{item.icon}</span>
              {!compact && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogoutConfirm}
            className={`flex items-center ${compact ? 'justify-center w-full' : 'gap-3 w-full'} px-3 py-2 text-red-500 hover:bg-[#2A2B2E] rounded-md  duration-300`}
            title={compact ? "Logout" : ""}
          >
            <span className={`text-lg ${compact ? 'mx-auto' : ''}`}>
              <HiOutlineLogout />
            </span>
            {!compact && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <ModalDialog className="sm:max-w-[425px] bg-white">
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            Are you sure you want to logout from the dashboard?
          </DialogContent>
          <DialogActions className="flex justify-left gap-2 mt-4">
            <Button 
              className="bg-gray-500 hover:bg-gray-600 text-white cursor-pointer" 
              onClick={() => setShowLogoutConfirm(false)}
            >
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
    </>
  );
};

export default Sidebar;
