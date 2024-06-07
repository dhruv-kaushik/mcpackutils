"use client";
import { Input } from "@/components/ui/input";
import JSZip from "jszip";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [packs, setPacks] = useState<{ file: File; mcMeta: string }[]>([]);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPacks = [];
    for (const file of files) {
      if (!file.name.endsWith(".zip")) {
        alert("Only zip files are allowed");
        return;
      }
      const zip = new JSZip();
      const data = await zip.loadAsync(file);

      const mcMeta = await data.file("pack.mcmeta")?.async("text");
      if (!mcMeta) return alert("Invalid Texture PAck");
      newPacks.push({ file, mcMeta });
    }

    setPacks(newPacks);
  };
  return (
    <div>
      <Input type="file" multiple onChange={handleFileChange} />
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
                    <img
                      src="https://via.placeholder.com/128"
                      alt={pack.file.name}
                      className="w-16 h-20 object-cover mr-3"
                    />
                    <div>
                      <h2 className="mt-2 text-xl">{pack.file.name}</h2>
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
    </div>
  );
}
