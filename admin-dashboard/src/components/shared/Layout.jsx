// import { Outlet } from 'react-router-dom';
// import { SidebarProvider } from '../../components/ui/sidebar';
// import  AppSidebar  from '../AppSidebar/app-sidebar';
// import { SidebarTrigger } from '../../components/ui/sidebar';
// import Header from '../Header/Header'
// import React from 'react';
// import Sidebar from '../Sidebar/Sidebar';

// // Update your Layout component
// export default function Layout() {
//   const [open, setOpen] = React.useState(true)
//   return (
//     <>
//     <SidebarProvider open={open} onOpenChange={setOpen}>
//       <div className="flex h-screen overflow-hidden">
//         <AppSidebar />
//           <div className="flex flex-col flex-1">
//           <Header />
//             <main className="flex-1 bg-gray-50 overflow-x-scroll">
//               <div className="container p-4 h-full">
//                 <Outlet />
//               </div>
//             </main>
//           </div>
//       </div>
//     </SidebarProvider>
//     </>
//   );
// }

// // export default function Layout() {
// //   return (
// //     <html lang="en">
// //       <body className="antialiased">
// //         <Header/>
// //         <div className="flex">
// //           <div className='h-[100vh] w-[300px]'>
// //               <Sidebar/>
// //           </div>
// //           <div className='p-5 w-full md:max-w-[1140px]'>
// //             <Outlet/>
// //           </div>
// //         </div>
// //       </body>
// //     </html>
// //   );
// // }


import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuth } from '../Login-Register/AuthContext'; 
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; 

// export default function Layout() {
//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       <Header />
//       <div className="flex flex-1 overflow-hidden">
//         <aside className="fixed left-0 top-[header-height] bottom-0 z-10">
//           <Sidebar />
//         </aside>
//         <main className="flex-1 ml-[250px] overflow-y-auto">
//           <div className="p-6 max-w-6xl mx-auto">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

export default function Layout() {
  const { isAuthenticated, loading } = useAuth();

  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  
  // Sidebar visibility state (shown/hidden)
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  // Sidebar compact mode state (icons only vs full) - default to compact
  const [compactMode, setCompactMode] = useState(true);
  
  // Update sidebar visibility when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Calculate sidebar width based on both states
  const getSidebarWidth = () => {
    if (!sidebarOpen) return 0;
    return compactMode ? 70 : 240;
  };

  //auth checks 
  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - conditionally shown based on screen size and state */}
      <div 
        className={`fixed left-0 top-0 bottom-0 z-20 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isMobile ? 'shadow-lg' : ''}`}
        style={{ width: compactMode ? '70px' : '240px' }}
      >
        <Sidebar isCompact={compactMode} />
      </div>
      
      {/* Main content */}
      <div 
        className="flex flex-col w-full transition-all duration-300 ease-in-out min-w-0"
        style={{ marginLeft: isMobile ? 0 : `${getSidebarWidth()}px` }}
      >
        {/* Header with sidebar toggle button */}
        <div className="sticky top-0 z-10 w-full">
          <Header 
            onSidebarToggle={() => {
              if (isMobile) {
                // On mobile, toggle sidebar visibility
                setSidebarOpen(!sidebarOpen);
              } else {
                // On desktop, toggle between compact and full mode
                setCompactMode(!compactMode);
              }
            }} 
            isSidebarOpen={sidebarOpen}
            isSidebarCompact={compactMode}
          />
        </div>
        
        {/* Main content area with scrolling */}
        <main className="flex-1 overflow-auto min-w-0 bg-gray-50">
          <div className="w-full min-w-0 p-2 sm:p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Overlay to close sidebar on mobile when clicked */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}