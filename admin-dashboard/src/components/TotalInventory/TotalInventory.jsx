import React, { useState, useEffect } from 'react'
import { Link, Outlet, useLoaderData } from 'react-router-dom';
import DataTable from '../Table/DataTable';
import { totalPurchasedInventoryColumns, totalSuppliedInventoryColumns, totalConsumableInventoryColumns } from '../lib/consts/Columns/Inventory';
import { Tabs,TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { RxCross1, RxCross2 } from "react-icons/rx";
import axios from 'axios';

function TotalInventory() {
    const [activeTab, setActiveTab] = useState("purchased");

    const [purchasedData, setPurchasedData] = useState([]);
    const [suppliedData, setSuppliedData] = useState([]);
    const [consumablesData, setConsumablesData] = useState([]);
    
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState("")

    // Limit change states
    const [showLimitSection, setShowLimitSection] = useState(false);
    const [selectedMaterialGrade, setSelectedMaterialGrade] = useState("");
    const [selectedRotorType, setSelectedRotorType] = useState("");
    const [newLimit, setNewLimit] = useState("");
    const [isUpdatingLimit, setIsUpdatingLimit] = useState(false);
    const [limitUpdateMessage, setLimitUpdateMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
      try {
        setIsLoading(true)
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
      } finally {
        setIsLoading(false);
      }
    };
    
    const handleLimitUpdate = async () => {
      if (!newLimit || newLimit <= 0) {
        setLimitUpdateMessage("Please enter a valid limit value");
        return;
      }

      if (activeTab === "purchased" && !selectedMaterialGrade) {
        setLimitUpdateMessage("Please select a material grade");
        return;
      }

      if (activeTab === "supplied" && !selectedRotorType) {
        setLimitUpdateMessage("Please select a rotor type");
        return;
      }

      setIsUpdatingLimit(true);
      setLimitUpdateMessage("");

      try {
        if (activeTab === "purchased") {
          await axios.put("/api/inventory/update-limit", {
            materialGrade: selectedMaterialGrade,
            limit: parseInt(newLimit)
          });
        } else if (activeTab === "supplied") {
          await axios.put("/api/supplied-inventory/update-limit", {
            rotorType: selectedRotorType,
            limit: parseInt(newLimit)
          });
        }

        setLimitUpdateMessage("Limit updated successfully!");
        setNewLimit("");
        setSelectedMaterialGrade("");
        setSelectedRotorType("");
        
        // Refresh data to show updated limits
        setTimeout(() => {
          fetchData();
        }, 500);
      } catch (error) {
        console.error("Failed to update limit:", error);
        setLimitUpdateMessage(error.response?.data?.message || "Failed to update limit");
      } finally {
        setIsUpdatingLimit(false);
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

    // Get unique material grades and rotor types for dropdowns
    const materialGrades = [...new Set(purchasedData.map(item => item.materialGrade).filter(Boolean))];
    const rotorTypes = [...new Set(suppliedData.map(item => item.rotorType).filter(Boolean))];

  return (
    <>
       <Outlet context={{ refreshData }} />
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Total Inventory</h1>
          <Button 
            onClick={() => setShowLimitSection(!showLimitSection)}
            className="bg-black text-white cursor-pointer"
          >
            {showLimitSection ? <RxCross1 fontSize={10} className="h-8 w-8" /> : "Update Limits"}
          </Button>
        </div>
        
        {/* Limit Change Section */}
        {showLimitSection && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Change Inventory Limits</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              {activeTab === "purchased" && (
                <div className="space-y-2">
                  <Label htmlFor="material-grade">Material Grade</Label>
                  <Select value={selectedMaterialGrade} onValueChange={setSelectedMaterialGrade}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Material Grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-white w-full max-w-[var(--radix-select-trigger-width)]">
                      {materialGrades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {activeTab === "supplied" && (
                <div className="space-y-2">
                  <Label htmlFor="rotor-type">Rotor Type</Label>
                  <Select value={selectedRotorType} onValueChange={setSelectedRotorType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Rotor Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white w-full max-w-[var(--radix-select-trigger-width)]">
                      {rotorTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-limit">New Limit</Label>
                <Input
                  id="new-limit"
                  type="number"
                  placeholder="Enter new limit"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  min="1"
                />
              </div>
              
              <Button 
                onClick={handleLimitUpdate}
                disabled={isUpdatingLimit}
                className="bg-black text-white cursor-pointer"
              >
                {isUpdatingLimit ? "Updating..." : "Update Limit"}
              </Button>
            </div>
            
            {limitUpdateMessage && (
              <div className={`mt-3 p-2 rounded text-sm ${
                limitUpdateMessage.includes("successfully") 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {limitUpdateMessage}
              </div>
            )}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)} className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-2 mb-4 gap-2 p-1">
            <TabsTrigger value="purchased" className="px-2 py-1.5 text-sm sm:text-base">Purchased</TabsTrigger>
            <TabsTrigger value="supplied" className="px-2 py-1.5 text-sm sm:text-base">Supplied</TabsTrigger>
            {/* <TabsTrigger value="consumables" className="px-2 py-1.5 text-sm sm:text-base">Consumables</TabsTrigger> */}
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
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default TotalInventory