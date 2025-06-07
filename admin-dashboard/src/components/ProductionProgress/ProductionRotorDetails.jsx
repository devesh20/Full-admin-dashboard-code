import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, LabelList } from "recharts";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

// Fallback data
const fallbackData = {
  orderDetails: {
    annexureNumber: "Unknown",
    rotorType: "Data unavailable",
    quantity: 0,
  },
  productionGraph: [],
  rejectionGraph: [],
  totalRejections: 0,
};

const COLORS = ['#00C49F', '#FFBB28', '#724296', '#f54a00', '#0088FE', '#FF8042', '#8884d8'];

const ProductionRotorDetails = () => {
  const { annexureNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const endpoint = `/api/reports/production/rotor-order/${annexureNumber}`;
        const response = await axios.get(endpoint);
        const result = response.data?.data;

        console.log("Rotor production details response:", response.data);

        if (result) {
          setData({
            orderDetails: {
              annexureNumber: result.annexureNumber || "N/A",
              rotorType: result.rotorType || "N/A",
              quantity: result.quantity || 0,
              quantityProduced: result.quantityProduced || 0,
              originalQuantity: result.originalQuantity || 0,
              dateOfOrder: result.dateOfOrder ? new Date(result.dateOfOrder).toLocaleDateString() : "N/A",
              dateOfCompletion: result.dateOfCompletion ? new Date(result.dateOfCompletion).toLocaleDateString() : "N/A",
              isComplete: result.isComplete ? "Yes" : "No"
            },
            productionGraph: result.productionGraph || [],
            rejectionGraph: result.rejectionGraph || [],
            totalRejections: result.rejectionGraph?.reduce((acc, item) => acc + item.count, 0) || 0,
          });
        } else {
          setData(fallbackData);
        }
      } catch (error) {
        console.error("Error fetching rotor production details:", error);
        setData({
          ...fallbackData,
          orderDetails: {
            ...fallbackData.orderDetails,
            annexureNumber: annexureNumber || "N/A",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    if (annexureNumber) fetchDetails();
  }, [annexureNumber]);

  const { orderDetails, productionGraph, rejectionGraph, totalRejections } = data;

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
          <title>Production Report - Annexure ${orderDetails.annexureNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2, h3 { color: #333; }
            .card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; margin-bottom: 20px; }
            .chart { margin-top: 30px; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
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
            setTimeout(() => { window.print(); window.close(); }, 500);
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
            <p>Loading rotor production details...</p>
          </div>
        </Card>
      ) : (
        <div id="printable-section">
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Rotor Order Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <Table className="border border-gray-200 w-1/2">    
                <TableBody>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200 w-1/2">Annexure Number</TableCell>
                    <TableCell className="w-1/2">{orderDetails.annexureNumber}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200 w-1/2">Rotor Type</TableCell>
                    <TableCell className="w-1/2">{orderDetails.rotorType}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200 w-1/2">Quantity Ordered</TableCell>
                    <TableCell className="w-1/2">{orderDetails.quantity}</TableCell>
                  </TableRow>
                  
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200 w-1/2">Quantity Produced</TableCell>
                    <TableCell className="w-1/2">{orderDetails.quantityProduced}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200 w-1/2">Date of Order</TableCell>
                    <TableCell className="w-1/2">{orderDetails.dateOfOrder}</TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="font-medium text-black border-r border-gray-200 w-1/2">Date of Completion</TableCell>
                    <TableCell className="w-1/2">{orderDetails.dateOfCompletion}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {rejectionGraph.length > 0 && (
                <div>
                  <h4 className="font-semibold text-black mb-2">Rejection Causes:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {rejectionGraph.map((item) => (
                      <li key={item.reason}>
                        <span className="font-medium">{item.reason}:</span> {item.count}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 font-semibold text-black">Total Rejections: {totalRejections}</div>
                </div>
              )}

              <Separator />

              {/* <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold text-base mb-2">Production Quantity</h3>
                  {productionGraph.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No data available.</p>
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productionGraph}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="totalQuantity" name="Quantity Produced" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-base mb-2">Rejection Cause Breakdown</h3>
                  {rejectionGraph.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No rejection data available.</p>
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
                            labelLine
                            label={({ cx, cy, midAngle, outerRadius, index }) => {
                              const RADIAN = Math.PI / 180;
                              const radius = outerRadius + 20;
                              const x = cx + radius * Math.cos(-midAngle * RADIAN);
                              const y = cy + radius * Math.sin(-midAngle * RADIAN);
                              const { reason } = rejectionGraph[index];
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="#333"
                                  textAnchor={x > cx ? "start" : "end"}
                                  dominantBaseline="central"
                                  fontSize={14}
                                  fontWeight="600"
                                >
                                  {reason}
                                </text>
                              );
                            }}
                          >
                            <LabelList dataKey="count" position="inside" fontSize={12} fill="white" />
                            {rejectionGraph.map((entry, index) => (
                              <Cell key={`cell-${entry.reason}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div> */}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProductionRotorDetails;
