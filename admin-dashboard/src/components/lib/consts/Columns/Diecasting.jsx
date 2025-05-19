import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, MoreVertical, Trash } from "lucide-react";
import { Stack, IconButton } from '@mui/joy';
import { createColumnHelper } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';


const columnHelper = createColumnHelper();

export const DieCastingColumns = [
  columnHelper.accessor("castingName", {
    header: () => <span className="flex items-center">Casting Name</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("quantityProduced", {
    header: () => <span className="flex items-center">Quantity Produced</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("quantityProducedKG", {
    header: () => <span className="flex items-center">Quantity Produced (KG)</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("shiftOfProduction", {
    header: () => <span className="flex items-center">Shift of Production</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("machineNumber", {
    header: () => <span className="flex items-center">Machine Number</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("furnaceTemperature", {
    header: () => <span className="flex items-center">Furnace Temperature</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("dyeTemperature", {
    header: () => <span className="flex items-center">Die Temperature</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("quantityRejected", {
    header: () => <span className="flex items-center">Quantity Rejected</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("rejectionCause", {
    header: () => <span className="flex items-center">Rejection Cause</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("timeToFix", {
    header: () => <span className="flex items-center">Time to Fix</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("machineDefectCause", {
    header: () => <span className="flex items-center">Machine Defect Cause</span>,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("postedBy.userName", {
    header: () => <span className="flex items-center">Posted By</span>,
    cell: (info) => info.getValue() || "N/A",
  }),  
  columnHelper.accessor("actions", {
    id: "actions",
    header: () => <span className="flex items-center">Actions</span>,
    cell: ({ row }) => (   
      <Stack justifyContent="center" direction="row">
        <IconButton component={Link} to={`update/${row.original._id}`}>
          <Edit className="text-gray-700" />
        </IconButton>
        <IconButton component={Link} to={`delete/${row.original._id}`}>
          <Trash className="text-red-500" />
        </IconButton>
      </Stack>
    ),
  }),
];