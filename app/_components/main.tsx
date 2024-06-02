"use client";
import JSZip from "jszip";
import { useState } from "react";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { PackData, columns } from "./columns";

export function MainPackOverlay() {
  const [data, setData] = useState<PackData[]>([]);
  const [loading, setLoading] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function () {
      const zip = new JSZip();
      let content;
      try {
        content = await zip.loadAsync(reader.result as ArrayBuffer);
      } catch (e) {
        alert("NOT A ZIP FILE");
      }
      if (!content) return;
      const packDataPromises = Object.values(content.files)
        .filter((file) => {
          if (file.dir) return false;
          const fileName = file.name.split("/").pop() || "";
          const fileExtension = fileName.split(".").pop() || "";
          return ["mcmeta", "png", "json"].includes(fileExtension);
        })
        .map((file) =>
          file.async("base64").then((data) => {
            const blob = new Blob([Buffer.from(data, "base64")], {
              type: "image/png",
            });
            const fileName =
              file.name.split("/").pop()?.replace(".png", "") || "";
            return {
              pack_name: fileName,
              pack_location: file.name,
              pack_file: blob,
            };
          })
        );
      let packData = await Promise.all(packDataPromises);
      packData = packData.sort((a, b) =>
        a.pack_name.localeCompare(b.pack_name)
      ); // Sort the array
      setData(packData);
      setLoading(false);
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex flex-row items-center justify-center space-x-4">
        <Input type="file" onChange={handleFileChange} />
      </div>
      {loading && <div>Loading...</div>}
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
