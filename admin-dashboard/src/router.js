import { createBrowserRouter, redirect} from "react-router-dom";
import Layout from "./components/Layout";
import AuthLayout from "./components/AuthLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ManageInventory from "./components/ManageInventory/ManageInventory";
import InventoryModal from "./components/ManageInventory/InventoryModal";
import MaterialIssuedModal from "./components/ManageInventory/MaterialIssuedModal";
import ProductionProgress from "./components/ProductionProgress/ProductionProgress";
import ProductionDetails from "./components/ProductionProgress/ProductionDetails";
import DieCasting from "./components/Diecasting/MaterialIssued";
import WorkersInfo from "./components/workersInfo/workers";
import WorkersModal from "./components/workersInfo/workersmodal";
import axios from "axios";

const router = createBrowserRouter([
    // {
    //   path: "login",
    //   element: <Login/>,
    //   action: async ({ request }) => {
    //     const formdata = await request.formData();
    //     const adminData = Object.fromEntries(formdata);
    //     await axios.post("/login-admin", adminData);
    //     return redirect("login");
    //   },
    // },
    // {
    //   path: "register",
    //   element: <Register/>,
    //   action: async ({ request }) => {
    //     const formdata = await request.formData();
    //     const adminLoginData = Object.fromEntries(formdata);
    //     await axios.post("/register-admin", adminLoginData);
    //     return redirect("http://localhost:5173/");
    //   }
    // },
    // {
    //   element: <ProtectedRoutes/>,
    //   children: [
    //     {
    //       path: "/",
    //       element: <Layout/>,
    
    //       children: [
    //         {
    //           index: true,
    //           element: <Dashboard />,
    //         },
    //         {
    //           path: "inventory",
    //           element: <ManageInventory />,
    //           loader: async () => {
    //             const { data } = await axios.get("/inventory/material-received");
    //             return data;
    //           },
    //           children: [
    //             {
    //               path: "material-received/edit/:id",
    //               element: <InventoryModal />,
    //               loader: async ({ params }) => {
    //                 const { data } = await axios.get(
    //                   `/inventory/material-received/${params.id}`
    //                 );
    //                 // console.log(data);
    //                 return data;
    //               },
    //               action: async ({ request, params }) => {
    //                 const formdata = await request.formData();
    //                 const inventoryData = Object.fromEntries(formdata);
    //                 await axios.put(
    //                   `material-received/edit/${params.id}`,
    //                   inventoryData
    //                 );
    //                 return redirect("/inventory");
    //               },
    //             },
    //             {
    //               path: "material-received/delete/:id",
    //               element: <InventoryModal />,
    //               action: async ({ params }) => {
    //                 axios.delete(`material-received/delete/${params.id}`);
    //                 return redirect("/inventory");
    //               },
    //             },
    //             {
    //               path: "material-issued/edit/:id",
    //               element: <MaterialIssuedModal />,
    //               loader: async ({ params }) => {
    //                 const { data } = await axios.get(
    //                   `/inventory/material-issued/${params.id}`
    //                 );
    //                 // console.log(data);
    //                 return data;
    //               },
    //               action: async ({ request, params }) => {
    //                 const formdata = await request.formData();
    //                 const inventoryData = Object.fromEntries(formdata);
    //                 await axios.put(
    //                   `material-issued/edit/${params.id}`,
    //                   inventoryData
    //                 );
    //                 return redirect("/inventory");
    //               },
    //             },
    //             {
    //               path: "material-issued/delete/:id",
    //               element: <MaterialIssuedModal />,
    //               action: async ({ params }) => {
    //                 axios.delete(`material-issued/delete/${params.id}`);
    //                 return redirect("/inventory");
    //               },
    //             },
    //           ],
    //         },
    //         {
    //           path: "production",
    //           element: <ProductionProgress />,
    //           // loader:
    //           // children:
    //         },
    //         {
    //           path: "production",
    //           element: <ProductionProgress />,
    //           // loader:
    //           // children:
    //         },
    
    //         //Die-Casting route
    //         {
    //           path: "die-casting",
    //           element: <DieCasting />,
    //           loader: async () => {
    //             const { data } = await axios.get("/die-castings/display");
    //             return data;
    //           },
    //           // children:
    //         },
    //         {
    //           path: "workers",
    //           element: <WorkersInfo />,
    //           loader: async () => {
    //             const { data } = await axios.get("/allWorkers");
    //             return data;
    //           },
    //           children: [
    //             {
    //               path: "register-user",
    //               element: <WorkersModal />,
    //               action: async ({ request }) => {
    //                 const formdata = await request.formData();
    //                 const userData = Object.fromEntries(formdata);
    //                 await axios.post("/register-user", userData);
    //                 return redirect("/workers");
    //               },
    //             },
    //             {
    //               path: ":id/edit",
    //               element: <WorkersModal />,
    //               loader: async ({ params }) => {
    //                 const { data } = await axios.get(`/allWorkers/${params.id}`);
    //                 // console.log(data);
    //                 return data;
    //               },
    //               action: async ({ request, params }) => {
    //                 const formdata = await request.formData();
    //                 // console.log("formdata", typeof(formdata));
    
    //                 const userData = Object.fromEntries(formdata);
    //                 await axios.put(`workers/${params.id}/edit`, userData);
    //                 return redirect("/workers");
    //               },
    //             },
    //             {
    //               path: "delete/:id",
    //               element: <WorkersModal />,
    //               action: async ({ params }) => {
    //                 await axios.delete(`/delete/${params.id}`);
    //                 return redirect("/workers");
    //               },
    //             },
    //           ],
    //         },
    //         {
    //           path: "*",
    //           element: <div>Page not found</div>,
    //           // loader:
    //           // children:
    //         },
    //       ],
    //     },  
    //   ]
    // },
    {
      path: "/",
      element: <Layout/>,
  
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
              path: "material-received/edit/:id",
              element: <InventoryModal />,
              loader: async ({ params }) => {
                const { data } = await axios.get(`/inventory/material-received/${params.id}`);
                // console.log(data);
                return data;
              },
              action: async ({ request, params }) => {
                const formdata = await request.formData();
                const inventoryData = Object.fromEntries(formdata);
                await axios.put(`material-received/edit/${params.id}`,inventoryData
                );
                return redirect("/inventory");
              },
            },
            {
              path: "material-received/delete/:id",
              element: <InventoryModal />,
              action: async ({ params }) => {
                axios.delete(`material-received/delete/${params.id}`);
                return redirect("/inventory");
              },
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
              action: async ({ request, params }) => {
                const formdata = await request.formData();
                const inventoryData = Object.fromEntries(formdata);
                await axios.put(
                  `material-issued/edit/${params.id}`,
                  inventoryData
                );
                return redirect("/inventory");
              },
            },
            {
              path: "material-issued/delete/:id",
              element: <MaterialIssuedModal />,
              action: async ({ params }) => {
                axios.delete(`material-issued/delete/${params.id}`);
                return redirect("/inventory");
              },
            },
          ],
        },
        {
          path: "production",
          element: <ProductionProgress />,
        },
        {
          path: "production/details/:id",
          element: <ProductionDetails />,
          loader: async ({ params }) => {
            try {
              const { data } = await axios.get(`/api/order/${params.id}`);
              // Transform data for the details component
              return {
                orderDetails: {
                  poNumber: data.poNumber || 'N/A',
                  partName: data.castingName || 'N/A',
                  targetQuantity: data.quantity || 0,
                },
                productionGraph: [
                  // Sample data structure - this would be populated from actual production data
                  { date: '2023-01-01', totalQuantity: data.quantityProduced || 0 },
                  { date: '2023-01-02', totalQuantity: Math.floor((data.quantityProduced || 0) * 1.2) },
                ]
              };
            } catch (error) {
              console.error("Error loading production details:", error);
              return {
                orderDetails: { poNumber: 'Error', partName: 'Error loading data', targetQuantity: 0 },
                productionGraph: []
              };
            }
          }
        },
  
        //Die-Casting route
        {
          path: "die-casting",
          element: <DieCasting />,
          loader: async () => {
            const { data } = await axios.get("/die-castings/display");
            return data;
          },
          // children:
        },
        {
          path: "workers",
          element: <WorkersInfo />,
          loader: async () => {
            const { data } = await axios.get("/allWorkers");
            return data;
          },
          children: [
            {
              path: "register-user",
              element: <WorkersModal />,
              action: async ({ request }) => {
                const formdata = await request.formData();
                const userData = Object.fromEntries(formdata);
                await axios.post("/register-user", userData);
                return redirect("/workers");
              },
            },
            {
              path: ":id/edit",
              element: <WorkersModal />,
              loader: async ({ params }) => {
                const { data } = await axios.get(`/allWorkers/${params.id}`);
                // console.log(data);
                return data;
              },
              action: async ({ request, params }) => {
                const formdata = await request.formData();
                // console.log("formdata", typeof(formdata));
  
                const userData = Object.fromEntries(formdata);
                await axios.put(`workers/${params.id}/edit`, userData);
                return redirect("/workers");
              },
            },
            {
              path: "delete/:id",
              element: <WorkersModal />,
              action: async ({ params }) => {
                await axios.delete(`/delete/${params.id}`);
                return redirect("/workers");
              },
            },
          ],
        },
        {
          path: "*",
          element: <div>Page not found</div>,
          // loader:
          // children:
        },
      ],
    }, 
    {
      path: "/auth",
      element: <AuthLayout/>,
      children: [
        {
          path: "login",
          element: <Login/>,
          action: async ({ request }) => {
            const formdata = await request.formData();
            const adminData = Object.fromEntries(formdata);
            await axios.post("/login-admin", adminData);
            return redirect("login");
          },
        },
        {
          path: "register",
          element: <Register/>,
          action: async ({ request }) => {
            const formdata = await request.formData();
            const adminLoginData = Object.fromEntries(formdata);
            await axios.post("/register-admin", adminLoginData);
            return redirect("http://localhost:5173/");
          }
        },
  
      ]
    },
      
  ]);


  export default router