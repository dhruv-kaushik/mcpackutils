import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import saveAs from "file-saver";
import JSZip from "jszip";
import { DataTableFacetedFilter } from "./data-table-filter";

export default function DataTableHeader({ table }: { table: any }) {
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
    console.log(packmeta);
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
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Filter Textures..."
            value={
              (table.getColumn("pack_name")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("pack_name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm focus-visible:ring-gray-500 focus-visible:ring-1"
          />
          {table.getColumn("pack_location") && (
            <DataTableFacetedFilter
              column={table.getColumn("pack_location")}
              title="Type"
              options={[
                { label: "Blocks", value: "block" },
                { label: "Sky", value: "sky" },
                { label: "Menu", value: "gui" },
              ]}
            />
          )}
        </div>
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
    </div>
  );
}