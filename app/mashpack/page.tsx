"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JSZip from "jszip";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [packs, setPacks] = useState<
    { fileName: string; data: JSZip; mcMeta: string; packPng: Blob }[]
  >([]);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(files);
    if (!files) return;

    const newPacks: any = [];
    for (const file of files) {
      if (!file.name.endsWith(".zip")) {
        alert("Only zip files are allowed");
        return;
      }
      const zip = new JSZip();
      const data = await zip.loadAsync(file);
      const fileName = await file.name;
      const mcMeta = await data.file("pack.mcmeta")?.async("text");
      const packPng = await data.file("pack.png")?.async("blob");
      if (!fileName) return alert("Invalid Texture PAck");
      if (!mcMeta) return alert("Invalid Texture PAck");
      if (!data) return alert("Invalid Texture PAck");
      if (!packPng) return alert("Invalid Texture PAck");

      newPacks.push({ fileName, data, mcMeta, packPng });
    }

    setPacks((prevPacks) => {
      // Filter out any new packs that already exist in prevPacks
      const uniquePacks = newPacks.filter(
        (newPack: any) =>
          !prevPacks.some((prevPack) => prevPack.fileName === newPack.fileName)
      );

      return [...prevPacks, ...uniquePacks];
    });
  };
  return (
    <div className="p-4">
      <Input type="file" multiple onChange={handleFileChange} />
      <div className="mt-4 grid grid-cols-1 gap-4">
        {packs.map((pack, i) => (
          <div key={i} className="bg-gray-100 shadow-lg rounded-lg p-4">
            {(() => {
              try {
                const mcMetaWithoutBOM = pack.mcMeta.replace(/^\uFEFF/, "");
                const mcMetaWithoutControlChars = mcMetaWithoutBOM.replace(
                  /[\x00-\x1F\x7F-\x9F]/g,
                  ""
                );
                const parsedJson = JSON.parse(mcMetaWithoutControlChars);
                return (
                  <div className="flex items-center">
                    <Image
                      src={URL.createObjectURL(pack.packPng)}
                      alt={pack.fileName}
                      width={96}
                      height={96}
                      className="object-cover mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-bold">{pack.fileName}</h2>
                      <p className="text-sm text-gray-600">
                        {parsedJson.pack.description.replace(/§./g, "")}
                      </p>
                    </div>
                  </div>
                );
              } catch (e) {
                alert(e);
                return `Invalid JSON: ${pack.mcMeta}`;
              }
            })()}
          </div>
        ))}
      </div>
      <Button variant="default" className="mt-4 w-full rounded-lg">
        Start Pack Mashup
      </Button>
    </div>
  );
}
