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
      )
    },
    cell: ({ row }) => <span className=" text-neutral-800 ml-4">{row.getValue("materialGrade")}</span>,
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
    cell: ({ row }) => <span className='ml-4'>{row.getValue("limit")}</span>,
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
    cell: ({ row }) => <span className='ml-4'>{row.getValue("quantity")}</span>,
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
    cell: ({ row }) => <span className='ml-4'>{row.getValue("limit")}</span>,
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
    cell: ({ row }) => <span className='ml-4'>{row.getValue("consumablesQuantity")}</span>,
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
    cell: ({ row }) => <span className='ml-4'>{row.getValue("limit")}</span>,
  },
];

