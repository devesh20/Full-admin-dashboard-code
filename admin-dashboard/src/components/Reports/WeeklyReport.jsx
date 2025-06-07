import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { allCastings, rejectionCause as rejectionCauseOptions, materialGrades } from "@/constant"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function CastingReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [castingName, setCastingName] = useState('');
  const [rejectionCause, setRejectionCause] = useState('');
  const [castingOptions, setCastingOptions] = useState([]);
  const [rejectionOptions, setRejectionOptions] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [materialGrade, setMaterialGrade] = useState("");
  const [materialGradeOptions, setMaterialGradeOptions] = useState([]);
  const [materialData, setMaterialData] = useState(null);
  const [materialError, setMaterialError] = useState("");
  const [loadingMaterial, setLoadingMaterial] = useState(false);
  const [materialStartDate, setMaterialStartDate] = useState('');
  const [materialEndDate, setMaterialEndDate] = useState('');



  // Fetch casting and rejection options on component mount
  useEffect(() => {
    const fetchOptions = () => {
      try {
        // Use constants directly instead of API
        const uniqueCastings = [...new Set(allCastings.filter(Boolean))];
        setCastingOptions(['All', ...uniqueCastings]);
  
        const uniqueCauses = [...new Set(rejectionCauseOptions.filter(Boolean))];
        setRejectionOptions(['All', ...uniqueCauses]);

        // Fix materialGradeOptions setup - using the imported materialGrades
        console.log("Material grade options from import:", materialGrades);
        const uniqueMaterialGrades = [...new Set(materialGrades.filter(Boolean))];
        setMaterialGradeOptions(['All', ...uniqueMaterialGrades]);
        console.log("Material grade options after setting:", ['All', ...uniqueMaterialGrades]);
      } catch (error) {
        console.error("Failed to set options:", error);
        setCastingOptions(['All']);
        setRejectionOptions(['All']);
        setMaterialGradeOptions(['All']);
      }
    };
  
    fetchOptions();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.");
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setError("Start date cannot be after end date.");
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Create request object
      const requestData = {
        startDate,
        endDate,
      };
      
      // Only add filters if not "All"
      if (castingName && castingName !== 'All') {
        requestData.castingName = castingName;
      }
      
      if (rejectionCause && rejectionCause !== 'All') {
        requestData.rejectionCause = rejectionCause;
      }

      console.log("Request Data:", requestData);
      
      // Try to fetch from API
      try {
        const response = await axios.post('/api/reports/diecasting', requestData);
        console.log("API Response:", response.data.data);
        
        if (response.data && Array.isArray(response.data.data)) {
          setReportData(response.data.data);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (apiError) {
        console.warn("API call failed", apiError);
        // Use mock data as fallback
        setReportData([]);
        setError("Failed to fetch report data. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setReportData([]);
      setError(err.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }
  };


  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    
    if (!materialStartDate || !materialEndDate) {
      setMaterialError("Please select both start and end dates.");
      return;
    }

    // Validate dates
    const start = new Date(materialStartDate);
    const end = new Date(materialEndDate);
    
    if (start > end) {
      setMaterialError("Start date cannot be after end date.");
      return;
    }
    
    setLoadingMaterial(true);
    setMaterialError('');
    
    const params = {
      startDate: materialStartDate,
      endDate: materialEndDate
    };
    
    // Only add filters if not empty or "All"
    if (supplierName && supplierName !== 'All') {
      params.supplierName = supplierName;
    }
    
    if (materialGrade && materialGrade !== 'All') {
      params.materialGrade = materialGrade;
    }
  
    try {
      const response = await axios.post('/api/reports/materialReceived', params);
      console.log("Material Report Data:", response.data);
      
      if (response.data && Array.isArray(response.data.data)) {
        setMaterialData(response.data.data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error(error);
      setMaterialError(error.response?.data?.message || "Failed to fetch material report.");
      setMaterialData(null);  
    } finally {
      setLoadingMaterial(false); 
    }
  };
    
  
  const calculatePercentage = (rejected, produced) => {
    const rejectedNum = Number(rejected) || 0;
    const producedNum = Number(produced) || 0;
    
    if (producedNum === 0) return "0.00";
    return ((rejectedNum / producedNum) * 100).toFixed(2);
  };

  // Function to download report data as CSV
  const downloadCsv = () => {
    if (reportData.length === 0) return;
    
    const headers = "Casting Name,Rejection Cause,Quantity Produced,Quantity Rejected,Rejection Rate (%)\n";
    const csvContent = reportData.reduce((acc, item) => {
      const rejectionRate = calculatePercentage(item.totalQuantityRejected, item.totalQuantityProduced);
      return acc + `${item.castingName},${item.rejectionCause},${item.totalQuantityProduced},${item.totalQuantityRejected},${rejectionRate}\n`;
    }, headers);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `casting-report-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up to avoid memory leaks
  };

  // Function to download material report data as CSV
  const downloadMaterialCsv = () => {
    if (!materialData || materialData.length === 0) return;
    
    const headers = "Supplier,Material Grade,Quantity,Weight (KG),Discrepancy\n";
    const csvContent = materialData.reduce((acc, item) => {
      return acc + `${item.supplierName || ''},${item.materialGrade || ''},${item.totalQuantity.toFixed(2)},${item.totalQuantityKG.toFixed(2)},${item.totalWeightDiscrepancy.toFixed(2)}\n`;
    }, headers);
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `material-report-${materialStartDate}-to-${materialEndDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up to avoid memory leaks
  };

  // Function to print the report
  const handlePrint = () => {
    // Make sure we have data to print
    if (reportData.length === 0) {
      alert("No data available to print. Please generate a report first.");
      return;
    }
    
    // Get the content to print
    const printContents = document.getElementById('printable-section');
    
    if (!printContents) {
      console.error("Print section not found");
      alert("Unable to print: Print section not found");
      return;
    }
    
    // Create a new window for printing
    const newWin = window.open('', '_blank');
    
    if (!newWin) {
      alert("Popup blocked. Please allow popups for this site to print reports.");
      return;
    }
    
    // Add necessary styles and content to the new window
    newWin.document.write(`
      <html>
        <head>
          <title>Casting Report (${startDate} to ${endDate})</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { margin-bottom: 10px; color: #333; }
            p { margin: 5px 0; }
            .card { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 8px; page-break-inside: avoid; text-transform: capitalize; }
            .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .chart { margin-top: 30px; }
            @media print {
              .summary { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContents.innerHTML}
          <script>
            // Delay printing to ensure content is fully loaded
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    
    newWin.document.close();
  };
  
  // Function to print material report
  const handleMaterialPrint = () => {
    // Make sure we have data to print
    if (!materialData || materialData.length === 0) {
      alert("No data available to print. Please generate a report first.");
      return;
    }
    
    // Get the content to print
    const printContents = document.getElementById('material-printable-section');
    
    if (!printContents) {
      console.error("Print section not found");
      alert("Unable to print: Print section not found");
      return;
    }
    
    // Create a new window for printing
    const newWin = window.open('', '_blank');
    
    if (!newWin) {
      alert("Popup blocked. Please allow popups for this site to print reports.");
      return;
    }
    
    // Add necessary styles and content to the new window
    newWin.document.write(`
      <html>
        <head>
          <title>Material Report (${materialStartDate} to ${materialEndDate})</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2 { margin-bottom: 10px; color: #333; }
            p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f5f5f5; text-align: left; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            @media print {
              .summary { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          ${printContents.innerHTML}
          <script>
            // Delay printing to ensure content is fully loaded
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    
    newWin.document.close();
  };
  
  // Calculate summary data
  const totalProduced = reportData.reduce(
    (sum, item) => sum + Number(item.totalQuantityProduced || 0), 0
  );
  
  const totalRejected = reportData.reduce(
    (sum, item) => sum + Number(item.totalQuantityRejected || 0), 0
  );
  
  const overallRejectionRate = calculatePercentage(totalRejected, totalProduced);

  return (
    <div className="flex flex-1 flex-col w-full">
      <div className="container max-w-full px-4 h-full">
        <Tabs
          defaultValue="castingReport"
          // onValueChange={handleTabChange}
        >
          <TabsList className="grid grid-cols-2 gap-1 ">
            <TabsTrigger className="cursor-pointer" value="castingReport">
              Casting Report
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="materialReport">
              Material Report
            </TabsTrigger>
            {/* <TabsTrigger className="cursor-pointer" value="2">Total Inventory</TabsTrigger> */}
          </TabsList>

          <TabsContent value="castingReport">
            <div>
              {/* <h1 className="text-2xl font-bold my-4">Casting Report</h1> */}

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Start Date<span className="text-red-500">*</span></label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">End Date<span className="text-red-500">*</span></label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Casting Name</label>
                  <Select
                    value={castingName}
                    onValueChange={(value) => setCastingName(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white z-[9999]"
                      position="popper"
                      portal={true}
                      sideOffset={5}
                    >
                      {castingOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Rejection Cause</label>
                  <Select
                    value={rejectionCause}
                    onValueChange={(value) => setRejectionCause(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white z-[9999]"
                      position="popper"
                      portal={true}
                      sideOffset={5}
                    >
                      {rejectionOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end col-span-full">
                  <Button
                    type="submit"
                    className="w-full bg-black text-white cursor-pointer sm:col-span-2"
                    disabled={loading}
                  >
                    {loading ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
              </form>

              {loading && (
                <p className="text-muted-foreground">Generating report...</p>
              )}
              {error && <p className="text-red-500 mb-4">{error}</p>}

              {reportData.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    onClick={downloadCsv}
                    variant="outline"
                    className="text-sm bg-black text-white cursor-pointer"
                  >
                    Download CSV
                  </Button>
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="text-sm bg-black text-white cursor-pointer"
                  >
                    Print Report
                  </Button>
                </div>
              )}

              {/* report section */}
              <div id="printable-section">
                {reportData.length > 0 && (
                  <div className="bg-gray-200 rounded-lg p-4 mb-6 summary">
                    <h2 className="text-lg font-semibold mb-2">Summary</h2>
                    <p>
                      Total Quantity Produced:{" "}
                      <strong>{totalProduced.toLocaleString()}</strong>
                    </p>
                    <p>
                      Total Quantity Rejected:{" "}
                      <strong>{totalRejected.toLocaleString()}</strong>
                    </p>
                    <p>
                      Overall Rejection %:{" "}
                      <strong>{overallRejectionRate}%</strong>
                    </p>
                  </div>
                )}
                <div className="grid gap-4 sm:grid-cols-1">
                  {reportData.map((item, index) => (
                    <Card key={index} className="card">
                      <CardHeader>
                        <CardTitle className="capitalize">
                          {item.castingName}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-1">
                        <p>
                          <strong>Rejection Cause:</strong>{" "}
                          {item.rejectionCause}
                        </p>
                        <p>
                          <strong>Quantity Produced:</strong>{" "}
                          {Number(item.totalQuantityProduced).toLocaleString()}
                        </p>
                        <p>
                          <strong>Quantity Rejected:</strong>{" "}
                          {Number(item.totalQuantityRejected).toLocaleString()}
                        </p>
                        <p>
                          <strong>Rejection Rate:</strong>{" "}
                          {calculatePercentage(
                            item.totalQuantityRejected,
                            item.totalQuantityProduced
                          )}
                          %
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* Chart for rejection rates */}
                {/* {reportData.length > 0 && (
                <div className="mt-10 chart">
                  <h2 className="text-xl font-semibold mb-4">
                    Rejection % by Casting
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={reportData.map((item) => ({
                        name: item.castingName,
                        rejectionRate: parseFloat(
                          calculatePercentage(
                            item.totalQuantityRejected,
                            item.totalQuantityProduced
                          )
                        ),
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis unit="%" />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Rejection Rate"]}
                      />
                      <Bar
                        dataKey="rejectionRate"
                        fill="#ef4444"
                        name="Rejection Rate"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )} */}
              </div>

              {reportData.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {/* Please select a required fields and generate a report. */}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="materialReport">
            <div>
              <form
                onSubmit={handleMaterialSubmit}
                className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6"
              >
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">
                    Start Date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={materialStartDate}
                    onChange={(e) => setMaterialStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">
                    End Date<span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={materialEndDate}
                    onChange={(e) => setMaterialEndDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Supplier Name</label>
                  <Input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Enter supplier name"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Material Grade</label>
                  {console.log("materialGradeOptions when rendering:", materialGradeOptions)}
                  {console.log("Current materialGrade value:", materialGrade)}
                  <Select
                    value={materialGrade || "All"}
                    onValueChange={setMaterialGrade}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white z-[9999]"
                      position="popper"
                      portal={true}
                      sideOffset={5}
                    >
                      {Array.isArray(materialGradeOptions) && materialGradeOptions.length > 0 
                        ? materialGradeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        : <SelectItem value="All">All</SelectItem>
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end sm:col-span-full">
                  <Button type="submit" className="w-full bg-black text-white">
                    {loadingMaterial ? "Generating..." : "Generate Report"}
                  </Button>
                </div>
              </form>

              {materialError && <p className="text-red-500">{materialError}</p>}

              {materialData && materialData.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      onClick={downloadMaterialCsv}
                      variant="outline"
                      className="text-sm bg-black text-white cursor-pointer"
                    >
                      Download CSV
                    </Button>
                    <Button
                      onClick={handleMaterialPrint}
                      variant="outline"
                      className="text-sm bg-black text-white cursor-pointer"
                    >
                      Print Report
                    </Button>
                  </div>
                  
                  <div id="material-printable-section">
                    <Card>
                      <CardHeader>
                        <CardTitle>Material Report Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Supplier</th>
                                <th className="border p-2 text-left">
                                  Material Grade
                                </th>
                                <th className="border p-2 text-right">
                                  Quantity
                                </th>
                                <th className="border p-2 text-right">
                                  Weight (KG)
                                </th>
                                <th className="border p-2 text-right">
                                  Discrepancy
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {materialData.map((item, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }
                                >
                                  <td className="border p-2">
                                    {item.supplierName}
                                  </td>
                                  <td className="border p-2">
                                    {item.materialGrade}
                                  </td>
                                  <td className="border p-2 text-right">
                                    {item.totalQuantity.toFixed(2)}
                                  </td>
                                  <td className="border p-2 text-right">
                                    {item.totalQuantityKG.toFixed(2)}
                                  </td>
                                  <td className="border p-2 text-right">
                                    {item.totalWeightDiscrepancy.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-100 font-medium">
                              <tr>
                                <td className="border p-2" colSpan="2">
                                  Total
                                </td>
                                <td className="border p-2 text-right">
                                  {materialData
                                    .reduce(
                                      (sum, item) => sum + item.totalQuantity,
                                      0
                                    )
                                    .toFixed(2)}
                                </td>
                                <td className="border p-2 text-right">
                                  {materialData
                                    .reduce(
                                      (sum, item) => sum + item.totalQuantityKG,
                                      0
                                    )
                                    .toFixed(2)}
                                </td>
                                <td className="border p-2 text-right">
                                  {materialData
                                    .reduce(
                                      (sum, item) =>
                                        sum + item.totalWeightDiscrepancy,
                                      0
                                    )
                                    .toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default CastingReport;
