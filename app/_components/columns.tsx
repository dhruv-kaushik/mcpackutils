"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Image from "next/image";

export type PackData = {
  pack_name: string;
  pack_location: string;
  pack_file: Blob;
};

export const columns: ColumnDef<PackData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "pack_name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
      return rowValue ? rowValue.toString().includes(value) : false;
    },
    accessorKey: "pack_location",
    header: "location",
  },
  {
    accessorKey: "pack_file",
    header: "File",
    cell: ({ row }) => {
      if (!(row.getValue("pack_location") as string).endsWith(".png")) {
        return (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-[#5865f2] underline hover:text-blue-700"
              >
                Link
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{row.getValue("pack_name")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {new Response(row.getValue("pack_file"))
                    .text()
                    .then((text) =>
                      row.getValue.toString().endsWith(".json") ||
                      row.getValue.toString().endsWith(".json")
                        ? JSON.stringify(JSON.parse(text), null, 2)
                        : text
                    )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogAction>Exit</AlertDialogAction>
            </AlertDialogContent>
          </AlertDialog>
        );
      } else {
        return (
          <a
            href={URL.createObjectURL(row.getValue("pack_file"))}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              alt="hi"
              src={URL.createObjectURL(row.getValue("pack_file"))}
              width={50}
              height={50}
            />
          </a>
        );
      }
    },
  },
];
