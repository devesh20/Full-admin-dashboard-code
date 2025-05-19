import React from 'react';
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import { CircularProgress } from '@mui/joy';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const DataTable = ({
  data,
  columns,
  sorting,
  setSorting,
  globalFilter,
  setGlobalFilter,
  showSearch = true,
  pageSize = 10,
  isLoading = false
}) => {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: pageSize,
        pageIndex: 0,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <CircularProgress variant='soft' color="neutral" size='md' thickness={1} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      {/* Search bar */}
      {showSearch && (
        <div className="mb-3">
          <div className="relative max-w-full">
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="text-sm focus:outline-none active:outline-none h-9 w-full border border-gray-300 rounded-md px-4 pl-9 shadow-sm"
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      )}

      {/* Table with horizontal scroll */}
      <div className="w-full max-w-full overflow-hidden rounded-md border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-max text-gray-700">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-left text-xs font-bold text-gray-800 uppercase px-3 py-3"
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex items-center"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <ArrowUpDown className="ml-2" size={16} />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-t border-gray-200">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="px-3 py-3 text-sm"
                      > 
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
                    className="h-24 text-center text-gray-500"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination with better responsiveness */}
      <div className="mt-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 text-xs sm:text-sm whitespace-nowrap">Items per page</span>
          <select
            className="border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:ring-gray-500 focus:border-gray-400 outline-none"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <div className="flex items-center">
            <button
              className="p-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              className="p-1 ml-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          <span className="flex items-center text-xs sm:text-sm whitespace-nowrap">
            <input
              type="number"
              min={1}
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value
                  ? Math.max(
                      0,
                      Math.min(
                        Number(e.target.value) - 1,
                        table.getPageCount() - 1
                      )
                    )
                  : 0;
                table.setPageIndex(page);
              }}
              className="w-10 p-1 rounded-md border border-gray-300 text-center"
              aria-label="Page number"
            />
            <span className="ml-1">of {table.getPageCount()}</span>
          </span>

          <div className="flex items-center">
            <button
              className="p-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>

            <button
              className="p-1 ml-1 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;