import { useState, useEffect } from 'react'
import DataTable from '../Table/DataTable'
import { totalConsumableInventoryColumns } from '../lib/consts/Columns/Inventory'
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { RxCross1, RxCross2 } from "react-icons/rx";
import axios from 'axios'
import { fetchAPI } from "../../api.js"

function ChangeLimit() {
  const [consumablesData, setConsumablesData] = useState([]);
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Limit change states
  const [showLimitSection, setShowLimitSection] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [isUpdatingLimit, setIsUpdatingLimit] = useState(false);
  const [limitUpdateMessage, setLimitUpdateMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("/api/consumables-inventory/get-all");
          setConsumablesData(res.data.data || []);
      } catch (error) {
        console.error(`Failed to fetch inventory data:`, error);
      } finally {
        setIsLoading(false);
      }
  }

  const handleLimitUpdate = async () => {
    if (!newLimit || newLimit <= 0) {
      setLimitUpdateMessage("Please enter a valid limit value");
      return;
    }

    if (!selectedItemName) {
      setLimitUpdateMessage("Please select an item name");
      return;
    }

    setIsUpdatingLimit(true);
    setLimitUpdateMessage("");

    try {
      await axios.put("/api/consumables-inventory/update-limit", {
        itemName: selectedItemName,
        limit: parseInt(newLimit)
      });

      setLimitUpdateMessage("Limit updated successfully!");
      setNewLimit("");
      setSelectedItemName("");
      
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

  useEffect(() => {
    fetchData();
  }, []);

  // Get unique item names for dropdown
  const itemNames = [...new Set(consumablesData.map(item => item.itemName).filter(Boolean))];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Consumables Inventory</h1>
        <Button 
          onClick={() => setShowLimitSection(!showLimitSection)}
          className="bg-black text-white cursor-pointer"
        >
          {showLimitSection ? <RxCross1 className="h-8 w-8" /> : "Update Limits"}
        </Button>
      </div>
      
      {/* Limit Change Section */}
      {showLimitSection && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Change Consumables Inventory Limits</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Select value={selectedItemName} onValueChange={setSelectedItemName}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Item Name" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {itemNames.map((itemName) => (
                    <SelectItem key={itemName} value={itemName}>
                      {itemName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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

      <DataTable
              data={consumablesData}
              columns={totalConsumableInventoryColumns}
              sorting={sorting}
              setSorting={setSorting}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              showSearch={true}
              pageSize={10}
              isLoading={isLoading}
      />
    </div>
  )
}

export default ChangeLimit