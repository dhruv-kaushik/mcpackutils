"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
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

import { Input } from "@/components/ui/input";
import React from "react";
import { Button } from "@/components/ui/button";
import JSZip from "jszip";
import saveAs from "file-saver";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });
  const handleDownload = async () => {
    const zip = new JSZip();
    let packmeta;
    table.getSortedRowModel().rows.forEach((row: any) => {
      if ((row.original.pack_location as string) === "pack.mcmeta") {
        packmeta = row.getValue("pack_file");
      }
    });

    table.getFilteredSelectedRowModel().rows.forEach((row: any) => {
      if ((row.original.pack_location as string) === "pack.mcmeta") return;

      zip.file(row.original.pack_location, row.original.pack_file);
    });
    let packMetaJson = JSON.parse(await new Response(packmeta).text());
    zip.file(
      "pack.mcmeta",
      JSON.stringify({
        pack: {
          pack_format: packMetaJson.pack.pack_format || 1,
          description: "Overlay Pack made using mcpackutils.vercel.app.",
        },
      })
    );
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "pack_overlay.zip");
  };
  return (
    <div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex justify-between items-center py-4">
        <Input
          type="search"
          placeholder="Filter Textures..."
          value={
            (table.getColumn("pack_location")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("pack_location")?.setFilterValue(event.target.value)
          }
          className="max-w-sm focus-visible:ring-gray-500 focus-visible:ring-1"
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="mybutton"
              onClick={(e) => {
                if (table.getFilteredSelectedRowModel().rows.length) {
                  e.preventDefault();
                  handleDownload();
                }
              }}
            >
              Download Overlay of Selected Textures
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>No Texture Selected.</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogAction>Ok</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
