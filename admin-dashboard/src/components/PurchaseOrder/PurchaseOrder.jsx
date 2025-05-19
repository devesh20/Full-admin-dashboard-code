import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper
} from '@tanstack/react-table';
import { Search, RefreshCw } from "lucide-react";
import { partDetails, rotorDetails } from "@/constant";



export default function PurchaseOrder() {

  const [orders, setOrders] = useState([]);
  const [rotorOrders, setRotorOrders] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([])
  const [isRotor, setIsRotor] = useState(false);
  const [form, setForm] = useState({
    partNumber: "",
    partName: "",
    poNumber: "",
    quantity: "",
    dateOfOrder: "",
    quantityProduced: "",
    annexureNumber: "",
    rotorType: "",
  });
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("ongoing");


  useEffect(() => {
    fetchOrders();
    fetchRotorOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/order/get-all");
      // Sort by date (assuming you have a createdAt field)
      // const sortedOrders = [...res.data].sort((a, b) => 
      //   new Date(b.createdAt) - new Date(a.createdAt)
      // );
      // console.log(res.data.data);
      setOrders(res.data.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const fetchRotorOrders = async () => {
    try {
      const res = await axios.get("/api/routerOrder/get-all");
      setRotorOrders(res.data.data);
    } catch (error) {
      console.error("Error fetching rotor orders", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePartNumberChange = (value) => {
    // Update form with part number and set part name from partDetails
    setForm({
      ...form,
      partNumber: value,
      partName: partDetails[value] || "",
    });
  };

  const handlePartNameChange = (value) => {
    // For PYRO variants, we need to set both the part name and number
    if (value.startsWith('PYRO')) {
      setForm({
        ...form,
        partName: value,
        partNumber: 'PYRO 1/2" NPT'
      });
    } else {
      // For other parts, find the part number from partDetails
      const partNumber = Object.entries(partDetails).find(([_, partName]) => partName === value)?.[0] || "";
      setForm({
        ...form,
        partName: value,
        partNumber: partNumber,
      });
    }
  };

  const handleRotorCheckboxChange = async (checked) => {
    setIsRotor(checked);
    if (checked) {
      await fetchRotorOrders();
    } else {
      await fetchOrders();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    // Check required fields
    if (!form.quantity) {
      setErrorMsg("Please fill all required fields.");
      return;
    }
    try {
      const endpoint = isRotor ? "/api/routerOrder/create" : "/api/order/create";
      await axios.post(endpoint, form);
      // Refresh the appropriate list based on order type
      if (isRotor) {
        await fetchRotorOrders();
      } else {
        await fetchOrders();
      }
      // Reset form after successful submission
      setForm({
        partNumber: "",
        partName: "",
        poNumber: "",
        quantity: "",
        dateOfOrder: "",
        quantityProduced: "",
        annexureNumber: "",
        rotorType: "",
      });
      setErrorMsg("");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Error creating order. Please try again."
      );
      console.error("Error creating order", error);
    }
  };

  const handleRefreshStatus = async () => {
    try {
      setRefreshing(true);
      if (isRotor) {
        await axios.post("/api/routerOrder/refresh-status");
        await fetchRotorOrders();
      } else {
        await axios.post("/api/order/refresh-status");
        await fetchOrders();
      }
      setRefreshing(false);
    } catch (error) {
      console.error("Error refreshing order status", error);
      setRefreshing(false);
    }
  };

  // Filter orders based on active tab and isRotor state
  const filteredOrders = useMemo(() => {
    const dataToFilter = isRotor ? rotorOrders : orders;
    return dataToFilter.filter(order => 
      activeTab === "completed" ? order.isComplete : !order.isComplete
    );
  }, [orders, rotorOrders, activeTab, isRotor]);

  // Column definitions
  const columnHelper = createColumnHelper();
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor('poNumber', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              PO No.
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('partNumber', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Part No.
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('partName', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Part Name
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('dateOfOrder', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date of Order
            </button>
          )
        },
        cell: info => {
          const date = new Date(info.getValue());
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        },
      }),
      columnHelper.accessor('dateOfCompletion', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Expected Completion Date
            </button>
          )
        },
        cell: info => {
          const date = new Date(info.getValue());
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }),
      columnHelper.accessor('quantityProduced', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Quantity Produced
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('originalQuantity', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Target Quantity
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('quantity', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Remaining Quantity
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
    ];

    const rotorColumns = [
      columnHelper.accessor('rotorType', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Rotor Type
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('annexureNumber', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Annexure Number
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('dateOfOrder', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Date of Order
            </button>
          )
        },
        cell: info => {
          const date = new Date(info.getValue());
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        },
      }),
      columnHelper.accessor('dateOfCompletion', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Expected Completion Date
            </button>
          )
        },
        cell: info => {
          const date = new Date(info.getValue());
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }),
      columnHelper.accessor('quantityProduced', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Quantity Produced
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('originalQuantity', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Target Quantity
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('quantity', {
        header: ({ column }) => {
          return (
            <button
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Remaining Quantity
            </button>
          )
        },
        cell: info => info.getValue(),
      }),
    ];

    return isRotor ? rotorColumns : baseColumns;
  }, [isRotor]);

  // Create the table instance
  const table = useReactTable({
    data: filteredOrders,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Order Management</h1>

      {/* Purchase Order Form */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex items-center space-x-2 mb-2">
              <Checkbox 
                id="rotor" 
                checked={isRotor}
                onCheckedChange={handleRotorCheckboxChange}
                className="w-5 h-5"
              />
              <label
                htmlFor="rotor"
                className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Rotors
              </label>
            </div>

            {isRotor ? (
              <>
                <Select
                  value={form.rotorType}
                  onValueChange={(value) => {
                    const annexure = rotorDetails[value] || "";
                    setForm((prev) => ({
                      ...prev,
                      rotorType: value,
                      // annexureNo: annexure,
                    }));
                  }}
                >
                  <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                    <SelectValue placeholder="Select Rotor Type" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700 bg-white">
                    {Object.keys(rotorDetails).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  name="annexureNumber"
                  placeholder="Annexure No."
                  value={form.annexureNumber}
                  onChange={handleChange}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </>
            ) : (
              <>
                <Select
                  value={form.partName}
                  onValueChange={(value) => {
                    handlePartNameChange(value);
                    const selectedPartNumber = partDetails[value] || '';
                    setForm(prev => ({ ...prev, partNumber: selectedPartNumber }));
                  }}
                >
                  <SelectTrigger className="w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                    <SelectValue placeholder="Select Part Name" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700 bg-white">
                    {Object.keys(partDetails).map((partName) => (
                      <SelectItem key={partName} value={partName}>
                        {partName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  name="partNumber"
                  placeholder="Part No."
                  value={form.partNumber}
                  readOnly
                  className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />

                <Input
                  name="poNumber"
                  placeholder="PO No."
                  value={form.poNumber}
                  onChange={handleChange}
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </>
            )}
            
            
            <Input
              name="quantity"
              type="number"
              placeholder="Target Qty"
              value={form.quantity}
              onChange={handleChange}
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            <Button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black cursor-pointer col-span-2"
            >
              Create
            </Button>
          </form>
          {errorMsg && (
            <div className="col-span-2 mt-2 text-red-500 text-sm">{errorMsg}</div>
          )}
        </CardContent>
      </Card>

      {/* Orders Table with Tabs */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Orders</h2>
          <Button 
            onClick={handleRefreshStatus} 
            disabled={refreshing} 
            className="flex items-center gap-2 bg-white cursor-pointer text-black border border-black"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refresh' : 'Refresh'}
          </Button>
        </div>
        {/* Search Input */}
        <div className="relative max-w-full">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="text-sm focus:outline-none h-9 w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 pl-9 shadow-sm dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 h-4 w-4" />
        </div>

        <Tabs defaultValue="ongoing" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-10 mt-2 sm:my-2 gap-2">
            <TabsTrigger value="ongoing" className="text-sm md:text-base">Ongoing Orders</TabsTrigger>
            <TabsTrigger value="completed" className="text-sm md:text-base">Completed Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing">
            

            {/* Table */}
            <div className="rounded-md overflow-x-auto md:overflow-hidden pb-2">
              <Table className="dark:bg-gray-800 dark:text-white min-w-[700px] w-full">
                <TableHeader className="dark:bg-gray-700">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="dark:border-gray-600 text-xs sm:text-sm whitespace-nowrap">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center dark:text-gray-400"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-2 py-4">
              <div className="flex items-center space-x-2">
                <p className="text-xs sm:text-sm font-medium dark:text-gray-300">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </p>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-1 text-xs sm:text-sm focus:ring-gray-500 focus:border-gray-400 outline-none dark:bg-gray-800 dark:text-white"
                >
                  {[5, 10, 20, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="dark:border-gray-600 dark:text-white text-xs sm:text-sm"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="dark:border-gray-600 dark:text-white text-xs sm:text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completed">
                  
            {/* Table */}
            <div className="rounded-md overflow-x-auto md:overflow-hidden pb-2">
              <Table className="dark:bg-gray-800 dark:text-white min-w-[700px] w-full">
                <TableHeader className="dark:bg-gray-700">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="dark:border-gray-600 text-xs sm:text-sm whitespace-nowrap">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center dark:text-gray-400"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-2 py-4">
              <div className="flex items-center space-x-2">
                <p className="text-xs sm:text-sm font-medium dark:text-gray-300">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </p>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-1 text-xs sm:text-sm focus:ring-gray-500 focus:border-gray-400 outline-none dark:bg-gray-800 dark:text-white"
                >
                  {[5, 10, 20, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="dark:border-gray-600 dark:text-white text-xs sm:text-sm"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="dark:border-gray-600 dark:text-white text-xs sm:text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}