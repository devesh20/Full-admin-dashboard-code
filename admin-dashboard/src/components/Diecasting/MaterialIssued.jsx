import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "../Table/DataTable";
import {
  materialIssuedColumns,
  materialIssuedSuppliedColumns,
} from "../lib/consts/Columns/MaterialIssued";
import {
  loadMaterialIssuedData,
  loadMaterialIssuedSuppliedData,
} from "../Manage-Inventory/DataLoader/Loaders"
import { CircularProgress } from "@mui/joy";

function MaterialIssued() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [tabValue, setTabValue] = useState("purchased");
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedIssuedData, setPurchasedIssuedData] = useState([]);
  const [suppliedIssuedData, setSuppliedIssuedData] = useState([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [purchased, supplied] = await Promise.all([
        loadMaterialIssuedData(),
        loadMaterialIssuedSuppliedData(),
      ]);
      setPurchasedIssuedData(purchased);
      setSuppliedIssuedData(supplied);
    } catch (error) {
      console.error("Error loading issued data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getColumns = (tab) => {
    return tab === "purchased" ? materialIssuedColumns : materialIssuedSuppliedColumns;
  };

  const getData = (tab) => {
    return tab === "purchased" ? purchasedIssuedData : suppliedIssuedData;
  };

  const renderTabContent = (tab) => {
    const data = getData(tab);
    if (isLoading) {
      return (
        <div className="w-full h-64 flex items-center justify-center">
          <CircularProgress variant='soft' color="neutral" size='md' thickness={1} />
        </div>
      );
    }
    if (!data || data.length === 0) {
      return (
        <div className="w-full h-64 flex items-center justify-center text-gray-500">
          No data available.
        </div>
      );
    }
    return (
      <DataTable
        data={data}
        columns={getColumns(tab)}
        sorting={sorting}
        setSorting={setSorting}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        showSearch={true}
        pageSize={10}
        isLoading={isLoading}
      />
    );
  };

  return (
    <div className="max-w-full w-full px-1 h-full">
      <Tabs value={tabValue} onValueChange={(val) => setTabValue(val)} className="w-full">
        <TabsList className="grid w-full grid-cols-1 h-10 sm:grid-cols-2 mb-10 sm:mb-4 gap-2 border-none">
          <TabsTrigger className="cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1" value="purchased">Purchased</TabsTrigger>
          <TabsTrigger className="cursor-pointer text-xs sm:text-sm md:text-base px-2 py-1" value="supplied">Supplied</TabsTrigger>
        </TabsList>

        <TabsContent value="purchased">
          {renderTabContent("purchased")}
        </TabsContent>

        <TabsContent value="supplied">
          {renderTabContent("supplied")}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MaterialIssued;
