import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend , LineChart, Line} from "recharts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LabelList } from "recharts";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

// Fallback data
const fallbackData = {
  orderDetails: {
    poNumber: "Unknown",
    partNumber: "Data unavailable",
    targetQuantity: 0,
  },
  productionGraph: [
    { date: "2023-01-01", totalQuantity: 0 },
  ],
  rejectionGraph: [],
};

// Colors for pie chart
// const COLORS = ['', '#36a2eb', '#ffcd56', '#4bc0c0', '#9966ff', '#ff9f40'];
const COLORS = ['#00C49F', '#FFBB28', '#724296', '#f54a00', '#0088FE', '#FF8042', '#8884d8'];

const ProductionDetails = () => {
  const { poNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    orderDetails: { poNumber: 'N/A', partNumber: 'N/A', targetQuantity: 0 , castingName: 0},
    productionGraph: [],
    rejectionGraph: [],
    totalRejections: 0,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/reports/production/order/${poNumber}`);
        const result = response.data?.data;
        console.log("Production details response:", response.data);

        if (result) {
          setData({
            orderDetails: {
              poNumber: result.poNumber || poNumber,
              partNumber: result.partNumber || result.partNumber || "N/A",
              targetQuantity: result.quantity || 0,
              castingName: result.castingName || 0,
              quantityProduced: result.quantityProduced || 0,
              originalQuantity: result.originalQuantity || 0,

            },
            productionGraph: result.productionGraph || [],
            rejectionGraph: result.rejectionGraph || [],
            totalRejections: result.rejectionGraph?.reduce((acc, item) => acc + item.count, 0) || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching production details:", error);
        setData({
          ...fallbackData,
          orderDetails: {
            ...fallbackData.orderDetails,
            poNumber: poNumber,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [poNumber]);

  const { orderDetails, productionGraph, rejectionGraph } = data;

  const handlePrint = () => {
    const printContents = document.getElementById('printable-section');
  
    if (!printContents) {
      alert("Unable to find printable content.");
      return;
    }
  
    const newWin = window.open('', '_blank');
  
    if (!newWin) {
      alert("Popup blocked. Please allow popups for this site to print reports.");
      return;
    }
  
    newWin.document.write(`
      <html>
        <head>
          <title>Production Report - PO ${orderDetails.poNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2, h3 { color: #333; }
            .card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
            .chart { margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            @media print {
              button { display: none; }
              table { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          ${printContents.innerHTML}
          <script>
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
  

  return (
    <div className="p-4 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 cursor-pointer w-full sm:w-auto"
          onClick={() => navigate("/dashboard/production")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Production
        </Button>

        <Button
          onClick={handlePrint}
          variant="outline"
          className="text-sm bg-black text-white cursor-pointer w-full sm:w-auto"
        >
          Print PDF
        </Button>
      </div>

      {loading ? (
        <Card className="shadow-md rounded-2xl p-8">
          <div className="flex justify-center items-center h-[300px]">
            <p>Loading production details...</p>
          </div>
        </Card>
      ) : (
        <div id="printable-section">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">
                <h3>Production Order Details</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              {/* Order Details Section */}
              {orderDetails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="text-sm bg-black text-white cursor-pointer"
                  >
                    Print Report
                  </Button>
                </div>
              )}
              <Table className="border border-gray-200 w-1/2">    
                <TableBody>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200">PO Number</TableCell>
                    <TableCell>{orderDetails.poNumber}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200">Part Number</TableCell>
                    <TableCell>{orderDetails.partNumber}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200">Target Quantity</TableCell>
                    <TableCell>{orderDetails.originalQuantity}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200">Casting Name</TableCell>
                    <TableCell>{orderDetails.castingName}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200">Quantity Produced</TableCell>
                    <TableCell>{orderDetails.quantityProduced}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200">Total Rejections</TableCell>
                    <TableCell>{data.totalRejections}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  {data.rejectionGraph.length > 0 && (
                    <div className="text-sm">
                      <h4 className="font-semibold text-black mb-2">
                        Rejection Causes:
                      </h4>
                      <ul className="list-disc list-inside space-y-1">
                        {data.rejectionGraph.map((item) => (
                          <li key={item.reason}>
                            <span className="font-medium">{item.reason}:</span>{" "}
                            {item.count}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
                {/* Production Bar Chart */}
                <div>
                  <h3 className="font-semibold text-base mb-2">
                    Production Quantity
                  </h3>
                  {productionGraph.length == 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No data available.
                    </p>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={productionGraph}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="totalQuantity"
                            name="Quantity Produced"
                            stroke="#3b82f6" // Blue color consistent with your theme
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Rejection Pie Chart */}
                <div>
                  <h3 className="font-semibold text-base mb-2">
                    Rejection Cause Breakdown
                  </h3>
                  {rejectionGraph.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No rejection data available.
                    </p>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={rejectionGraph}
                            dataKey="count"
                            nameKey="reason"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            labelLine={true}
                            label={({
                              cx,
                              cy,
                              midAngle,
                              outerRadius,
                              index,
                            }) => {
                              const RADIAN = Math.PI / 180;
                              const radius = outerRadius + 20;
                              const x =
                                cx + radius * Math.cos(-midAngle * RADIAN);
                              const y =
                                cy + radius * Math.sin(-midAngle * RADIAN);
                              const { reason } = rejectionGraph[index];

                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="#333"
                                  textAnchor={x > cx ? "start" : "end"}
                                  dominantBaseline="central"
                                  fontSize={16}
                                  fontWeight="800"
                                >
                                  {reason}
                                </text>
                              );
                            }}
                          >
                            <LabelList
                              dataKey="count"
                              position="inside"
                              fontSize={12}
                              fill="white"
                            />
                            {rejectionGraph.map((entry, index) => (
                              <Cell
                                key={`cell-${entry.reason}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductionDetails;
