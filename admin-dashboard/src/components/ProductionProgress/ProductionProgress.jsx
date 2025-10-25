import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
} from 'lucide-react';
import DataTable from '../Table/DataTable';
import {ProductionColumns, productionSuppliedColumns} from '@/components/lib/consts/Columns/Production'
import { useMediaQuery } from '@/hooks/use-media-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductionProgressDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [activeTab, setActiveTab] = useState("diecasting");
  
  // Production data states
  const [diecastingData, setDiecastingData] = useState([]);
  const [rotorsData, setRotorsData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, [activeTab]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "diecasting") {
        await fetchDiecastingData();
      } else {
        await fetchRotorsData();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiecastingData = async () => {
    try {
      const response = await axios.get("/api/order/get-all");
      
      if (response.data && response.data.data) {
        // Transform the data to match the required format
        const transformedData = response.data.data.map((order, index) => ({
          id: order._id || index + 1,
          poNumber: order.poNumber || 'Unknown PO',
          castingName: order.partName || 'Unknown Casting',
          dateOfOrder: order.dateOfOrder || new Date().toISOString().split('T')[0],
          quantityProduced: order.quantityProduced || 0,
          quantity: order.quantity || 100,
          originalQuantity: order.originalQuantity,
        }));
        
        setDiecastingData(transformedData);
      } else {
        console.error('Invalid data format received from API');
        setDiecastingData([]);
      }
    } catch (error) {
      console.error('Error fetching diecasting data:', error);
      setDiecastingData([]);
    }
  };

  const fetchRotorsData = async () => {
    try {
      // First call the refresh status endpoint
      try {
        await axios.get("/api/routerOrder/refresh-status");
      } catch (refreshError) {
        console.error('Error refreshing status:', refreshError);
        // Continue with data fetch even if refresh fails
      }
      
      // Then fetch the updated data
      const response = await axios.get("/api/routerOrder/get-all");
      
      if (response.data && response.data.data) {
        // Transform the data to match the required format
        const transformedData = response.data.data.map((order, index) => ({
          id: order._id || index + 1,
          rotorType: order.rotorType || 'Unknown Type',
          annexureNumber: order.annexureNumber || 'Unknown Annexure',
          dateOfOrder: order.dateOfOrder || new Date().toISOString().split('T')[0],
          dateOfCompletion: order.dateOfCompletion || new Date().toISOString().split('T')[0],
          quantityProduced: order.quantityProduced || 0,
          originalQuantity: order.originalQuantity || 100,
        }));
        
        setRotorsData(transformedData);
      } else {
        console.error('Invalid data format received from API:', response.data);
        setRotorsData([]);
      }
    } catch (error) {
      console.error('Error fetching rotors data:', error.response || error);
      setRotorsData([]);
    }
  };

  // Function to refresh data
  const refreshData = async () => {
    setLoading(true);
    try {
      await fetchData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get the appropriate columns based on active tab
  const columns = activeTab === "diecasting" ? ProductionColumns() : productionSuppliedColumns();
  const data = activeTab === "diecasting" ? diecastingData : rotorsData;

  return (
    <div className="w-full min-w-0">
      <div className="mb-1 ml-1 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Button 
          onClick={refreshData}
          variant="outline"
          className="flex items-center gap-2 self-start"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>
      
      <Tabs defaultValue="diecasting" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-8 mt-2 sm:my-2 gap-2">
          <TabsTrigger value="diecasting" className="text-sm md:text-base">Diecastings</TabsTrigger>
          <TabsTrigger value="rotors" className="text-sm md:text-base">Rotors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diecasting" className="mt-2 ml-1">
          <div className="w-full overflow-hidden">
            <DataTable
              data={data}
              columns={columns}
              sorting={sorting}
              setSorting={setSorting}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              showSearch={true}
              pageSize={isMobile ? 5 : 10}
              isLoading={loading}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="rotors" className="mt-2 ml-1">
          <div className="w-full overflow-hidden">
            <DataTable
              data={data}
              columns={columns}
              sorting={sorting}
              setSorting={setSorting}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              showSearch={true}
              pageSize={isMobile ? 5 : 10}
              isLoading={loading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductionProgressDashboard;