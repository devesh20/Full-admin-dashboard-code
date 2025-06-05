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
      return <Badge className="bg-yellow-500">Just Started</Badge>;
    } else if(percentage <= 0){
      return <Badge className="bg-red-500">Pending</Badge>;
    }else {
      return <Badge className="bg-blue-400">In Progress</Badge>;
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
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.getValue("poNumber")}</span>
      ),
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
      cell: ({ row }) => (
        <span className="font-medium text-gray-900">{row.getValue("castingName")}</span>
      ),
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
    ...(isMobile
      ? []
      : [
          columnHelper.accessor("dateOfOrder", {
            header: () => (
              <div className="flex items-center gap-1 font-semibold">
                {isTablet ? "Date" : "Date of Order"}
              </div>
            ),
            cell: (info) => {
              const date = new Date(info.getValue());
              const formattedDate = `${String(date.getDate()).padStart(
                2,
                "0"
              )}/${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}/${date.getFullYear()}`;
              return formattedDate;
            },
          }),
        ]),

    columnHelper.accessor("quantityProduced", {
      header: "Progress",
      cell: ({ row }) => {
        const completed = row.getValue("quantityProduced");
        const target = row.original.originalQuantity;
        const progress = target > 0 ? (completed / target) * 100 : 0;

        return (
          <div className="flex flex-col gap-1 w-full min-w-[120px]">
            <div className="flex justify-between text-xs text-gray-700 font-medium">
              <span>{completed}</span>
              <span className="text-gray-500">/ {target}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
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
                    onClick={() =>
                      console.log("Production Details Link item:", item)
                    }
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
    columnHelper.accessor("annexureNumber", {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 font-semibold whitespace-nowrap"
        >
          {isMobile ? "A NO." : "ANNEXURE NO."}
        </button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 whitespace-nowrap">{row.getValue("annexureNumber")}</span>
      ),
    }),
    columnHelper.accessor("rotorType", {
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 p-0 font-semibold whitespace-nowrap"
        >
          {isMobile ? "TYPE" : "ROTOR TYPE"}
        </button>
      ),
      cell: ({ row }) => <span className="font-medium text-gray-900 whitespace-nowrap">{row.getValue("rotorType")}</span>,
    }),

    columnHelper.accessor("dateOfOrder", {
      header: () => (
        <div className="flex items-center gap-1 font-semibold whitespace-nowrap">
          {isTablet ? "Ordered" : "Date of Order"}
        </div>
      ),
      cell: (info) => {
        const date = new Date(info.getValue());
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return <span className="whitespace-nowrap">{formattedDate}</span>;
      },
    }),

    columnHelper.accessor("quantityProduced", {
      header: "Progress",
      cell: ({ row }) => {
        const completed = row.getValue("quantityProduced");
        const target = row.original.originalQuantity;
        const progress = target > 0 ? (completed / target) * 100 : 0;

        return (
          <div className="flex flex-col gap-1 w-full">
            <div className="flex justify-between text-xs text-gray-700 font-medium">
              <span>{completed}</span>
              <span className="text-gray-500">/ {target}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
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
                <DropdownMenuItem asChild>
                  <Link
                    to={`/dashboard/production/${item.annexureNumber}`}
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
