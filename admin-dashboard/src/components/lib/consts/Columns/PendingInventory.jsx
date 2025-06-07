import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash } from "lucide-react";
import { Button } from "../../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Stack} from '@mui/joy';

export const pendingPurchaseInventoryColumns = [
  {
    accessorKey: "materialGrade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex  gap-2"
        >
          Material Grade
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className=" text-neutral-800 ml-4">
        {row.getValue("materialGrade")}
      </span>
    ),
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex  gap-2"
        >
          Supplier Name
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-neutral-800 ml-4">
        {row.getValue("supplierName")}
      </span>
    ),
  },
  {
    accessorKey: "purchaseOrderNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex  gap-2"
        >
          Purchase Ord. No.
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("purchaseOrderNumber")}</span>,
  },
  {
    accessorKey: "challanNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex  gap-2"
        >
          Chalan No.
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("challanNumber")}</span>,
  },
  {
    accessorKey: "materialLotNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          LOT No.
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("materialLotNumber")}</span>,
  },
  {
    accessorKey: "materialQuantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Quantity
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("materialQuantity")}</span>,
  },
  {
    accessorKey: "materialQuantityKG",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Quantity(KG)
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("materialQuantityKG")}</span>,
  },
  {
    accessorKey: "locationAllocated",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Location Allocated
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("locationAllocated")}</span>,
  },
  {
    accessorKey: "weightDiscrepancy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Weight Discrepancy
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("weightDiscrepancy")}</span>,
  },
  {
    accessorKey: "postedBy.userName", 
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Posted By
        </Button>
      );
    },
    cell: ({ row }) => {
      const postedBy = row.original.postedBy;
      return <span className='ml-4'>{postedBy?.userName || "N/A"}</span>;
    }
  },  
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const material = row.original;
      return (
        <>
        <Stack justifyContent="center" direction="row" className="flex gap-1 items-center">
            <Link to={`pending-purchase-inventory/confirm/${row.original._id}`} className="no-underline">
                <Button className='bg-green-500 text-white cursor-pointer h-6'>
                    Confirm
                </Button>
            </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem asChild>
              <Link
                to={`pending-purchase-inventory/update/${material._id}`}
                className="flex items-center cursor-pointer no-underline"
              >
                <Edit className="mr-2 h-4 w-4 text-gray-700" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to={`pending-purchase-inventory/delete/${material._id}`}
                className="flex items-center text-red-500 cursor-pointer no-underline"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </Stack>
        </>
      );
    },
  },
];

export const pendingSuppliedInventoryColumns = [
  {
    accessorKey: "typeOfRotor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex  gap-2"
        >
          Rotor Type
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className=" text-neutral-800 ml-4">
        {row.getValue("typeOfRotor")}
      </span>
    ),
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex  gap-2"
        >
          Supplier Name
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="text-neutral-800 ml-4">
        {row.getValue("supplierName")}
      </span>
    ),
  },
  {
    accessorKey: "annexureNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex  gap-2"
        >
          Annexure No.
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("annexureNumber")}</span>,
  },
  {
    accessorKey: "materialLotNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          LOT No.
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("materialLotNumber")}</span>,
  },
  {
    accessorKey: "materialQuantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Quantity
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("materialQuantity")}</span>,
  },
  {
    accessorKey: "materialQuantityKG",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Quantity(KG)
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("materialQuantityKG")}</span>,
  },
  {
    accessorKey: "locationAllocated",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Location Allocated
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("locationAllocated")}</span>,
  },
  {
    accessorKey: "weightDiscrepancy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Weight Discrepancy
        </Button>
      );
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("weightDiscrepancy")}</span>,
  },
  {
    accessorKey: "postedBy.userName", 
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex gap-2"
        >
          Posted By
        </Button>
      );
    },
    cell: ({ row }) => {
      const postedBy = row.original.postedBy;
      return <span className='ml-4'>{postedBy?.userName || "N/A"}</span>;
    }
  },  
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const material = row.original;
      return (
        <>
        <Stack justifyContent="center" direction="row" className="flex gap-1 items-center">
            <Link to={`pending-supplied-inventory/confirm/${row.original._id}`} className="no-underline">
                <Button className='bg-green-500 text-white cursor-pointer h-6'>
                    Confirm
                </Button>
            </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem asChild>
              <Link
                to={`pending-supplied-inventory/update/${material._id}`}
                className="flex items-center cursor-pointer no-underline"
              >
                <Edit className="mr-2 h-4 w-4 text-gray-700" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to={`pending-supplied-inventory/delete/${material._id}`}
                className="flex items-center text-red-500 cursor-pointer no-underline"
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </Stack>
        </>
      );
    },
  },
]