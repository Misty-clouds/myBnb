"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, Filter } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const dateRanges = [
    { label: "30 Days Ago", value: 30 },
    { label: "60 Days Ago", value: 60 },
    { label: "6 Months Ago", value: 180 },
    { label: "1 Year Ago", value: 365 },
    { label: "2 Years Ago", value: 730 },
    { label: "5 Years Ago", value: 1825 },
  ];
  

export function DataTableWithVisibility<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    customerName: true,
    totalAmount: true,
    numberOfDays: true,
    bookingMethod: true,
    date: true,
    propertyName: true,
    created_by: true,
    actions: true,
    dailyAmount: false,
    receiptImage: false,
    entryDate: false,
    exitDate: false,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { columnVisibility },
  });

  return (
    <section className="w-full py-3 sm:py-2">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-muted/60 dark:bg-card">

          <div className="w-full flex justify-between items-center">
            <CardHeader className="flex flex-row w-full justify-between items-center pb-4">
              <h2 className="text-3xl font-bold mb-2">Booking Data 📆</h2>


            <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id.replace(/([A-Z])/g, ' $1').trim()}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {/* filter */}


                
            </div>
              
            </CardHeader>
          </div>
        

          <CardContent className="p-4">
            <div className="rounded-lg  overflow-hidden">
              <Table className="w-full text-sm">
                <TableHeader className="bg-muted/30">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b border-muted-foreground/20">
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="p-3 font-semibold text-left">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-muted/20 transition">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="p-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
