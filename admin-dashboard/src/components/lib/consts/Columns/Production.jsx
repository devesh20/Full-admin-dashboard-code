import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChartLine, Clock, Edit, MoreVertical, Trash, User } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/use-media-query';

const getStatusBadge = (completed, target) => {
    const percentage = (completed / target) * 100;
    
    if (percentage >= 90) {
      return <Badge className="bg-green-500">Completed</Badge>;
    } else if (percentage <= 10 && percentage >= 1) {
      return <Badge className="bg-red-500">Just Started</Badge>;
    } else if(percentage <= 0){
      return <Badge className="bg-red-500">Pending</Badge>;
    }else {
      return <Badge className="bg-yellow-500">In Progress</Badge>;
    }
};

const columnHelper = createColumnHelper();

export const ProductionColumns = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const columns = [
    columnHelper.accessor("poNumber", {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 font-semibold"
        >
          {isMobile ? "PO" : "PO NO"}
        </button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("poNumber")}</span>,
    }),
    
    columnHelper.accessor("castingName", {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 font-semibold"
        >
          {isMobile ? "Name" : "CASTING NAME"}
        </button>
      ),
      cell: (info) => info.getValue(),
    }),
    
    // Only show shift on tablet and desktop
    // ...(isMobile ? [] : [
    //   columnHelper.accessor("shiftOfProduction", {
    //     header: "Shift",
    //     cell: ({ row }) => (
    //       <Badge variant="outline">
    //         {row.getValue("shiftOfProduction")}
    //       </Badge>
    //     ),
    //   }),
    // ]),
    
    // Only show startDateTime on tablet and desktop
    ...(isMobile ? [] : [
      columnHelper.accessor("dateOfOrder", {
        header: () => (
          <div className="flex items-center gap-1 font-semibold">
            {isTablet ? "Date" : "Date of Order"}
          </div>
        ),
        cell: (info) => {
          const date = new Date(info.getValue());
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
          return formattedDate;
        },
      }),
    ]),
    
    columnHelper.accessor("quantityProduced", {
      header: "Progress",
      cell: ({ row }) => {
        const completed = row.getValue("quantityProduced");
        const target = row.original.originalQuantity;
        
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {completed}/{target}
            </span>
          </div>
        );
      },
    }),
    
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const completed = row.getValue("quantityProduced");
        const target = row.original.originalQuantity;
        
        return getStatusBadge(completed, target);
      },
    }),
    
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right mr-1">Actions</div>,
      cell: ({ row }) => {
        const item = row.original;
    
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                {/* <DropdownMenuItem asChild>
                  <Link
                    to={`/edit-production/${item._id}`}
                    className="flex items-center cursor-pointer no-underline"
                  >
                    <Edit className="mr-2 h-4 w-4 text-blue-500" /> Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/production/delete/${item._id}`}
                    className="flex items-center text-red-500 cursor-pointer no-underline"
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link
                    to={`/dashboard/production-details/${item.poNumber}`}
                    className="flex items-center text-black cursor-pointer no-underline"
                    rel="noopener noreferrer"
                    onClick={() => console.log("Production Details Link item:", item)}
                  >
                    <ChartLine className="mr-2 h-4 w-4" /> Details
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
    
  ];

  return columns;
};

export const productionSuppliedColumns = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const columns = [
    columnHelper.accessor("rotorType", {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 font-semibold"
        >
          {isMobile ? "TYPE" : "ROTOR TYPE"}
        </button>
      ),
      cell: ({ row }) => <span className="font-medium">{row.getValue("rotorType")}</span>,
    }),

    columnHelper.accessor("annexureNumber", {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 font-semibold"
        >
          {isMobile ? "A NO." : "ANNEXURE NO."}
        </button>
      ),
      cell: (info) => info.getValue(),
    }),

    ...(isMobile ? [] : [
      columnHelper.accessor("dateOfOrder", {
        header: () => (
          <div className="flex items-center gap-1 font-semibold">
            {isTablet ? "Ordered" : "Date of Order"}
          </div>
        ),
        cell: (info) => {
          const date = new Date(info.getValue());
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
          return formattedDate;
        },
      }),
      columnHelper.accessor("dateOfCompletion", {
        header: () => (
          <div className="flex items-center gap-1 font-semibold">
            {isTablet ? "Completed" : "Date of Completion"}
          </div>
        ),
        cell: (info) => {
          const date = new Date(info.getValue());
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
          return formattedDate;
        },
      }),
    ]),

    columnHelper.accessor("quantityProduced", {
      header: "Progress",
      cell: ({ row }) => {
        const completed = row.getValue("quantityProduced");
        const target = row.original.originalQuantity;

        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {completed}/{target}
            </span>
          </div>
        );
      },
    }),

    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const completed = row.getValue("quantityProduced");
        const target = row.original.originalQuantity;
        return getStatusBadge(completed, target); // You already use this in ProductionColumns
      },
    }),

    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right mr-1">Actions</div>,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem asChild>
                  <Link
                    to={`/dashboard/production-details/${item.annexureNumber}`}
                    className="flex items-center text-black cursor-pointer no-underline"
                  >
                    <ChartLine className="mr-2 h-4 w-4" /> Details
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  return columns;
};
