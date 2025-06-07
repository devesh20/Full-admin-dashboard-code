import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash } from "lucide-react";
import { Button } from "../../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const materialIssuedColumns = [
  {
    accessorKey: "materialGrade",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Material Grade
        </Button>
      )
    },
    cell: ({ row }) => <span className=" text-neutral-800 ml-4">{row.getValue("materialGrade")}</span>,
  },
  {
    accessorKey: "locationOfMaterial",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Location Allocated
        </Button>
      )
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("locationOfMaterial")}</span>,
  },
  {
    accessorKey: "shiftOfProduction",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Shift of Production
        </Button>
      )
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("shiftOfProduction")}</span>,
  },
  {
    accessorKey: "materialQuantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Quantity
        </Button>
      )
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
          className="flex items-center gap-2"
        >
          Quantity(KG)
        </Button>
      )
    },
    cell: ({ row }) => <span className='ml-4'>{row.getValue("materialQuantityKG")}</span>,
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
          Issued By
        </Button>
      );
    },
    cell: ({ row }) => {
      const postedBy = row.original.postedBy;
      return <span className='ml-4'>{postedBy?.userName || "N/A"}</span>;
    }
  },
  
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const material = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="24"
  //               height="24"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               stroke="currentColor"
  //               strokeWidth="2"
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               className="h-4 w-4"
  //             >
  //               <circle cx="12" cy="12" r="1" />
  //               <circle cx="12" cy="5" r="1" />
  //               <circle cx="12" cy="19" r="1" />
  //             </svg>
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end" className="bg-white">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem asChild>
  //             <Link
  //               to={`material-issued/edit/${material._id}`}
  //               className="flex items-center cursor-pointer no-underline"
  //             >
  //               <Edit className="mr-2 h-4 w-4 text-gray-700" /> Edit
  //             </Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem asChild>
  //             <Link
  //               to={`material-issued/delete/${material._id}`}
  //               className="flex items-center text-red-500 cursor-pointer no-underline"
  //             >
  //               <Trash className="mr-2 h-4 w-4" /> Delete
  //             </Link>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export const materialIssuedSuppliedColumns = [
  {
    accessorKey: "typeOfRotor",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Rotor Type
      </Button>
    ),
    cell: ({ row }) => (
      <span className="ml-4 text-neutral-800">
        {row.getValue("typeOfRotor")}
      </span>
    ),
  },
  {
    accessorKey: "materialQuantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Quantity
      </Button>
    ),
    cell: ({ row }) => (
      <span className="ml-4">{row.getValue("materialQuantity")}</span>
    ),
  },
  {
    accessorKey: "materialQuantityKG",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center gap-2"
      >
        Quantity (KG)
      </Button>
    ),
    cell: ({ row }) => (
      <span className="ml-4">{row.getValue("materialQuantityKG")}</span>
    ),
  },
  {
    accessorKey: "postedBy.userName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex gap-2"
      >
        Supplied By
      </Button>
    ),
    cell: ({ row }) => {
      const postedBy = row.original.postedBy;
      return <span className="ml-4">{postedBy?.userName || "N/A"}</span>;
    },
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const material = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               width="24"
  //               height="24"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               stroke="currentColor"
  //               strokeWidth="2"
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               className="h-4 w-4"
  //             >
  //               <circle cx="12" cy="12" r="1" />
  //               <circle cx="12" cy="5" r="1" />
  //               <circle cx="12" cy="19" r="1" />
  //             </svg>
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end" className="bg-white">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem asChild>
  //             <Link
  //               to={`material-issued-supplied/edit/${material._id}`}
  //               className="flex items-center cursor-pointer no-underline"
  //             >
  //               <Edit className="mr-2 h-4 w-4 text-gray-700" /> Edit
  //             </Link>
  //           </DropdownMenuItem>
  //           <DropdownMenuItem asChild>
  //             <Link
  //               to={`material-issued-supplied/delete/${material._id}`}
  //               className="flex items-center text-red-500 cursor-pointer no-underline"
  //             >
  //               <Trash className="mr-2 h-4 w-4" /> Delete
  //             </Link>
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];