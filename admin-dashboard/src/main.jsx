import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, redirect, RouterProvider, Navigate} from 'react-router-dom'
import '@fontsource/inter';
import axios from 'axios'
import { Toaster } from 'sonner'


//import pages
import Layout from './components/shared/Layout.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ManageInventory from './components/Manage-Inventory/ManageInventory.jsx'
import WorkersInfo from './components/Workers-Details/WorkersInfo.jsx'
import ProductionProgress from './components/ProductionProgress/ProductionProgress.jsx'
import WorkersModal from './components/Workers-Details/WorkersModal.jsx'
import MaterialReceivedModal from './components/Manage-Inventory/Modals/MaterialReceivedModal.jsx'
import MaterialIssuedModal from './components/Manage-Inventory/Modals/MaterialissuedModal.jsx'
import PendingInventoryModal from './components/Manage-Inventory/Modals/PendingInventoryModal'
import DieCasting from './components/Diecasting/MaterialIssued.jsx'
import WeeklyReport from './components/Reports/WeeklyReport.jsx';
// import {router} from './router.js';


import Login from './components/Login-Register/Login.jsx'
import Register from './components/Login-Register/Register.jsx'
import AuthLayout from './components/shared/auth-layout.jsx';
import ProtectedRoute from './components/Login-Register/ProtectedRoute.jsx';
import { AuthProvider } from './components/Login-Register/AuthContext.jsx';
import DieCastingModal from './components/Diecasting/Modal/DieCastingModal.jsx';
import PurchaseOrder from './components/PurchaseOrder/PurchaseOrder';
import Profile from './components/Profile/Profile';
import ProductionDetails from './components/ProductionProgress/ProductionDetails';
import TotalInventory from './components/TotalInventory/TotalInventory';
import ProductionRotorDetails from './components/ProductionProgress/ProductionRotorDetails';
import MaterialIssued from './components/Diecasting/MaterialIssued.jsx';
import ChangeLimit from './components/CastingSpecification/ChangeLimit.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "/auth",
    element: <AuthLayout/>,
    children: [
      {
        path: "login",
        element: <Login/>,
      },
      {
        path: "register",
        element: <Register/>,
      },
    ]
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Layout/></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "inventory",
        element: <ManageInventory />,
        // loader: async () => {
        //   const { data } = await axios.get("/inventory/material-received");
        //   return data;
        // },
        children: [
          {
            path: "pending-purchase-inventory/update/:id",
            element: <PendingInventoryModal/>,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/pendingInventory/get/${params.id}`);
              // console.log(data);
              return data;
            },
          },
          {
            path: "pending-supplied-inventory/update/:id",
            element: <PendingInventoryModal/>,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/pendingInventorySupplied/get/${params.id}`);
              // console.log(data);
              return data;
            },
          },
          {
            path: "pending-purchase-inventory/confirm/:id",
            element: <PendingInventoryModal/>,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/pendingInventory/get/${params.id}`);
              // console.log(data);
              return data;
            },
          },
          {
            path: "pending-purchase-inventory/delete/:id",
            element: <PendingInventoryModal/>,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/pendingInventory/get/${params.id}`);
              // console.log(data);
              return data;
            },
          },
          {
            path: "pending-supplied-inventory/delete/:id",
            element: <PendingInventoryModal/>,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/pendingInventorySupplied/get/${params.id}`);
              // console.log(data);
              return data;
            },
          },
          {
            path: "pending-supplied-inventory/confirm/:id",
            element: <PendingInventoryModal/>,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/pendingInventorySupplied/get/${params.id}`);
              // console.log(data);
              return data;
            },
          },
          {
            path: "material-received/edit/:id",
            element: <MaterialReceivedModal />,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/material-received/${params.id}`);
              // console.log(data);
              return data;
            },
          },
          {
            path: "material-received/delete/:id",
            element: <MaterialReceivedModal/>,
          },
          {
            path: "material-issued/edit/:id",
            element: <MaterialIssuedModal />,
            loader: async ({ params }) => {
              const { data } = await axios.get(
                `/inventory/material-issued/${params.id}`
              );
              // console.log(data);
              return data;
            },
          },
          {
            path: "material-issued/delete/:id",
            element: <MaterialIssuedModal />,
          },
        ],
      },
      {
        path: "production",
        element: <ProductionProgress />, 
      },
      {
        path: "production-details/:poNumber",
        element: <ProductionDetails />,
      },
      {
        path: "production/:annexureNumber",
        element: <ProductionRotorDetails/>,
      },
      {
        path: "consumables",
        element: <ChangeLimit />,
        // loader:
        // children:
      },

      //Die-Casting route
      {
        path: "diecasting",
        element: <DieCasting />,
        loader: async () => {
          const { data } = await axios.get("/api/diecasting/get-all");
          return data.data;
        },
        children: [
          {
            path: 'update/:id',
            element: <DieCastingModal/>,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/diecasting/${params.id}`);
              return data.data;
            }
          },
          {
            path: 'delete/:id',
            element: <DieCastingModal/>
          }
        ]
      },
      {
        path: "material-issued",
        element: <MaterialIssued/>,
      },
      {
        path: "workers",
        element: <WorkersInfo />,
        loader: async () => {
          const { data } = await axios.get("/api/user/get-all");
          return data.data;
        },
        children: [
          {
            path: "register-user",
            element: <WorkersModal />,
            action: async ({ request }) => {
              const formdata = await request.formData();
              console.log(formdata)
              const userData = Object.fromEntries(formdata);
              await axios.post("/api/user/register-user", userData);
              return redirect("/dashboard/workers");
            },
          },
          {
            path: "update/:id",
            element: <WorkersModal />,
            loader: async ({ params }) => {
              const { data } = await axios.get(`/api/user/get-all/${params.id}`);
              // console.log(data.data);
              return data.data;
            },
            action: async ({ request, params }) => {
              const formdata = await request.formData();
              // console.log("formdata", typeof(formdata));

              const userData = Object.fromEntries(formdata);
              await axios.put(`/api/user/update/${params.id}`, userData);
              return redirect("/dashboard/workers");
            },
          },
          {
            path: "delete/:id",
            element: <WorkersModal />,
            action: async ({ params }) => {
              await axios.post(`/api/user/delete-user/${params.id}`);
              return redirect("/dashboard/workers");
            },
          },
        ],
      },
      {
        path: "orders",
        element: <PurchaseOrder />,
        // loader:
        // children:
      },
      {
        path: "report",
        element: <WeeklyReport />,
        // loader:
        // children:
      },
      {
        path: "profile",
        element: <Profile />,
        // loader:
        // children:
      },
      {
        path: "total-inventory",
        element: <TotalInventory/>,
        // loader:
        // children:
      },
      {
        path: "*",
        element: <div className='flex item-center'>Page not found</div>,
        // loader:
        // children:
      },
    ],
  }, 
  
]);


createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Toaster position="top-right" richColors closeButton />
    <RouterProvider router={router}/>
  </AuthProvider>
)
