"use client";
import { Input } from "@/components/ui/input";
import JSZip from "jszip";
import { ArrowRightSquareIcon } from "lucide-react";
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

    const newPacks = [];
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

    setPacks(newPacks);
  };
  return (
    <div>
      <Input type="file" multiple onChange={handleFileChange} />
      <div>
        {packs.map((pack, i) => (
          <div key={i}>
            {(() => {
              try {
                const mcMetaWithoutBOM = pack.mcMeta.replace(/^\uFEFF/, "");
                const mcMetaWithoutControlChars = mcMetaWithoutBOM.replace(
                  /[\x00-\x1F\x7F-\x9F]/g,
                  ""
                );
                const parsedJson = JSON.parse(mcMetaWithoutControlChars);
                return (
                  <div className="grid grid-cols-3 p-2">
                    <div className="bg-black text-white flex items-center">
                      <Image
                        src={URL.createObjectURL(pack.packPng)}
                        alt={pack.fileName}
                        width={96}
                        height={96}
                        className="object-cover mr-3"
                      />
                      <div>
                        <h2 className="mt-2 text-xl">{pack.fileName}</h2>
                        <p className="text-sm">
                          {parsedJson.pack.description.replace(/§./g, "")}
                        </p>
                      </div>
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
        <ArrowRightSquareIcon className="w-10 h-10" />
      </div>
    </div>
  );
}
