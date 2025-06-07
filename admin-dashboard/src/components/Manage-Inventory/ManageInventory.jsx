import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, Outlet, useLoaderData, useActionData } from 'react-router-dom';
import DataTable from '../Table/DataTable';
import { materialReceivedPurchaseColumns, materialReceivedSuppliedColumns } from '../lib/consts/Columns/MaterialRecieved';
import { materialIssuedColumns, materialIssuedSuppliedColumns } from '../lib/consts/Columns/MaterialIssued'
import {
  loadMaterialIssuedData, 
  loadMaterialReceivedPurchasedData,
  loadPurchasedPendingInventoryData,
  loadSuppliedPendingInventoryData,
  loadMaterialSuppliedData,
  loadMaterialIssuedSuppliedData
} from './DataLoader/Loaders'
import { pendingPurchaseInventoryColumns, pendingSuppliedInventoryColumns } from '../lib/consts/Columns/PendingInventory';

function ManageInventory() {
    const actionData = useActionData();
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState("")
    const [activeTab, setActiveTab] = useState("0");
    const [currentData, setCurrentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [purchasedPendingData, setPurchasedPendingData] = useState([]);
    const [suppliedPendingData, setSuppliedPendingData] = useState([]);
    const [purchasedData, setPurchasedData] = useState([]);
    const [suppliedData, setSuppliedData] = useState([]);
    const [purchasedIssuedData, setPurchasedIssuedData] = useState([]);
    const [suppliedIssuedData, setSuppliedIssuedData] = useState([]);


    const loadTabData = async (tabValue) => {
      setIsLoading(true);
      try {
        let data;
        let purchased;
        let supplied ;
        switch (tabValue) {
          case "0":
            purchased = await loadPurchasedPendingInventoryData();
            supplied = await loadSuppliedPendingInventoryData();
            setPurchasedPendingData(purchased);
            setSuppliedPendingData(supplied);
            // return;
            // data = await loadPendingInventoryData();
            // console.log(data)
            break;
          case "1":
            purchased = await loadMaterialReceivedPurchasedData();
            setPurchasedData(purchased)
            supplied = await loadMaterialSuppliedData()
            setSuppliedData(supplied);
            break;
          case "2":
            purchased = await loadMaterialIssuedData();
            setPurchasedIssuedData(purchased)
            supplied = await loadMaterialIssuedSuppliedData();
            setSuppliedIssuedData(supplied)
            break;
          default:
            data = [];
            break;
        }
        setCurrentData(data);
      } catch (error) {
        console.error('Error loading data:', error);
        setCurrentData([]);
      } finally {
        setIsLoading(false);
      }
    };

    const getColumns = (tabValue, subTab = null) => {
      if (tabValue === "0") {
        if (subTab === "purchased") {
          return pendingPurchaseInventoryColumns;
        } else if (subTab === "supplied") {
          return pendingSuppliedInventoryColumns;
        }
        return []; // fallback
      } else if (tabValue === "1") {
        if (subTab === "purchased") {
          return materialReceivedPurchaseColumns;
        } else if (subTab === "supplied") {
          return materialReceivedSuppliedColumns;
        }
        return []; 
        
      } else if (tabValue === "2") {
        if (subTab === "purchased") {
          return materialIssuedColumns;
        } else if (subTab === "supplied") {
          return materialIssuedSuppliedColumns;
        }
        return []; 
      }
      return [];
    };
    

    useEffect(() => {
      if (actionData?.success) {
        loadTabData(activeTab);
      }
    }, [actionData]);
  
    useEffect(() => {
      loadTabData(activeTab);
    }, [activeTab]);
  
    const handleTabChange = (value) => {
      setActiveTab(value);
      setSorting([]);
      setGlobalFilter("");
    };

  return (
    <div className='flex flex-1 w-full'>
      <Outlet context={{ refreshData: () => loadTabData(activeTab) }}/>
      <div className='max-w-full w-full px-1 h-full'>
        <Tabs 
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full space-y-4"
        >
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-10 sm:mb-4 gap-2 p-1">
            <TabsTrigger className="cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1.5" value="0">Pending Inventory</TabsTrigger>
            <TabsTrigger className="cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1.5" value="1">Material Received</TabsTrigger>
          </TabsList>
          
          <TabsContent value="0">
            <Tabs defaultValue="purchased" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 gap-2 p-1">
                <TabsTrigger className="cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1" value="purchased">Purchased</TabsTrigger>
                <TabsTrigger className="cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1" value="supplied">Supplied</TabsTrigger>
              </TabsList>

              <TabsContent value="purchased" className="mx-1">
                <DataTable
                  data={purchasedPendingData}
                  columns={getColumns("0", "purchased")}
                  sorting={sorting}
                  setSorting={setSorting}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  showSearch={true}
                  pageSize={10}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="supplied" className="mx-1">
                <DataTable
                  data={suppliedPendingData}
                  columns={getColumns("0", "supplied")}
                  sorting={sorting}
                  setSorting={setSorting}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  showSearch={true}
                  pageSize={10}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>


          <TabsContent value="1">
            <Tabs defaultValue="purchased" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 gap-2 p-1">
                <TabsTrigger className="cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1" value="purchased">Purchased</TabsTrigger>
                <TabsTrigger className="cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1" value="supplied">Supplied</TabsTrigger>
              </TabsList>

              <TabsContent value="purchased" className="mx-1">
                <DataTable
                  data={purchasedData}
                  columns={getColumns("1", "purchased")}
                  sorting={sorting}
                  setSorting={setSorting}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  showSearch={true}
                  pageSize={10}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="supplied" className="mx-1">
                <DataTable
                  data={suppliedData}
                  columns={getColumns("1", "supplied")}
                  sorting={sorting}
                  setSorting={setSorting}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  showSearch={true}
                  pageSize={10}
                  isLoading={isLoading}
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ManageInventory