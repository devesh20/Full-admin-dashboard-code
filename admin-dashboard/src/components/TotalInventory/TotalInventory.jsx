import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLoaderData } from 'react-router-dom';
import DataTable from '../Table/DataTable';
import { totalPurchasedInventoryColumns, totalSuppliedInventoryColumns, totalConsumableInventoryColumns } from '../lib/consts/Columns/Inventory';
import { Tabs,TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import axios from 'axios';

function TotalInventory() {
    const [activeTab, setActiveTab] = useState("purchased");

    const [purchasedData, setPurchasedData] = useState([]);
    const [suppliedData, setSuppliedData] = useState([]);
    const [consumablesData, setConsumablesData] = useState([]);
    
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState("")

    const fetchData = async () => {
      try {
        if (activeTab === "purchased") {
          const res = await axios.get("/api/inventory/get-all");
          setPurchasedData(res.data.data || []);
        } else if (activeTab === "supplied") {
          const res = await axios.get("/api/supplied-inventory/get-all");
          setSuppliedData(res.data.data || []);
        } else if (activeTab === "consumables") {
          const res = await axios.get("/api/consumables-inventory/get-all");
          setConsumablesData(res.data.data || []);
        }
      } catch (error) {
        console.error(`Failed to fetch ${activeTab} inventory data:`, error);
      }
    };
    

    const refreshData = fetchData;
  
    useEffect(() => {
      fetchData();
    }, [activeTab]);

    const getData = () => {
      switch (activeTab) {
        case "purchased":
          return { data: purchasedData, columns: totalPurchasedInventoryColumns };
        case "supplied":
          return { data: suppliedData, columns: totalSuppliedInventoryColumns };
        case "consumables":
          return { data: consumablesData, columns: totalConsumableInventoryColumns  };
        default:
          return { data: [], columns: [] };
      }
    };
  
    const { data, columns } = getData();

  return (
    <>
       <Outlet context={{ refreshData }} />
      <div>
        <h1 className="text-2xl font-bold mb-4">Total Inventory</h1>
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)} className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-3 mb-4 gap-2 p-1">
            <TabsTrigger value="purchased" className="px-2 py-1.5 text-sm sm:text-base">Purchased</TabsTrigger>
            <TabsTrigger value="supplied" className="px-2 py-1.5 text-sm sm:text-base">Supplied</TabsTrigger>
            <TabsTrigger value="consumables" className="px-2 py-1.5 text-sm sm:text-base">Consumables</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mx-1">
            <DataTable
              data={data}
              columns={columns}
              sorting={sorting}
              setSorting={setSorting}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              showSearch={true}
              pageSize={10}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default TotalInventory