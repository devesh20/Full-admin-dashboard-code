import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash } from "lucide-react";
import { Button } from "../../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const totalPurchasedInventoryColumns = [
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
      );
    },
    cell: ({ row }) => (
      <span className=" text-neutral-800 ml-4">
        {row.getValue("materialGrade")}
      </span>
    ),
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
      );
    },
    cell: ({ row }) => {
      const quantity = row.getValue("materialQuantity");
      const limit = row.getValue("limit");

      let colorClass = "bg-green-100 text-green-700"; // Default: quantity > limit

      if (quantity < limit) {
        colorClass = "bg-red-100 text-red-700";
      } else if (quantity === limit) {
        colorClass = "bg-yellow-100 text-yellow-700";
      }

      return (
        <div
          className={`ml-4 px-3 py-1 rounded-full text-sm font-medium inline-block ${colorClass}`}
        >
          {quantity}
        </div>
      );
    },
  },
  {
    accessorKey: "limit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Limit
        </Button>
      );
    },
    cell: ({ row }) => (
      <span className="ml-4 font-medium text-gray-900">
        {row.getValue("limit")}
      </span>
    ),
  },
];

export const totalSuppliedInventoryColumns = [
  {
    accessorKey: "rotorType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Rotor Type
        </Button>
      )
    },
    cell: ({ row }) => <span className=" text-neutral-800 ml-4">{row.getValue("rotorType")}</span>,
  },
  {
    accessorKey: "quantity",
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
    cell: ({ row }) => {
      const quantity = row.getValue("quantity");
      const limit = row.getValue("limit");

      let colorClass = "bg-green-100 text-green-700"; 

      if (quantity < limit) {
        colorClass = "bg-red-100 text-red-700";
      } else if (quantity === limit) {
        colorClass = "bg-yellow-100 text-yellow-700";
      }

      return (
        <div
          className={`ml-4 px-3 py-1 rounded-full text-sm font-medium inline-block ${colorClass}`}
        >
          {quantity}
        </div>
      );
    },
  },
  {
    accessorKey: "limit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Limit
        </Button>
      )
    },
    cell: ({ row }) => (
      <span className="ml-4 font-medium text-gray-900">
        {row.getValue("limit")}
      </span>
    ),
  },
];

export const totalConsumableInventoryColumns = [
  {
    accessorKey: "itemName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Item Name
        </Button>
      )
    },
    cell: ({ row }) => <span className=" text-neutral-800 ml-4">{row.getValue("itemName")}</span>,
  },
  {
    accessorKey: "consumablesQuantity",
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
    cell: ({ row }) => {
      const quantity = row.getValue("consumablesQuantity");
      const limit = row.getValue("limit");

      let colorClass = "bg-green-100 text-green-700"; 

      if (quantity < limit) {
        colorClass = "bg-red-100 text-red-700";
      } else if (quantity === limit) {
        colorClass = "bg-yellow-100 text-yellow-700";
      }

      return (
        <div
          className={`ml-4 px-3 py-1 rounded-full text-sm font-medium inline-block ${colorClass}`}
        >
          {quantity}
        </div>
      );
    },
  },
  {
    accessorKey: "limit",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2"
        >
          Limit
        </Button>
      )
    },
    cell: ({ row }) => (
      <span className="ml-4 font-medium text-gray-900">
        {row.getValue("limit")}
      </span>
    ),
  },
];

