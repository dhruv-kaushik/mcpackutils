"use client";
import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ImageData {
  src: string;
  path: string;
  selected: boolean;
}

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function () {
      const zip = new JSZip();
      const content = await zip.loadAsync(reader.result as ArrayBuffer);
      const imagePromises = Object.values(content.files)
        .filter((file) => file.name.endsWith(".png") && !file.dir)
        .map((file) =>
          file.async("base64").then((data) => {
            const blob = new Blob([Buffer.from(data, "base64")], {
              type: "image/png",
            });
            const url = URL.createObjectURL(blob);
            return {
              src: url,
              path: file.name,
              selected: false,
            };
          })
        );

      const newImages = await Promise.all(imagePromises);
      setImages((oldImages) => [...oldImages, ...newImages]);
    };
    reader.readAsArrayBuffer(file);
  };
  const handleCheckboxChange = (index: number) => {
    setImages((images) =>
      images.map((image, i) =>
        i === index ? { ...image, selected: !image.selected } : image
      )
    );
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    for (const image of images.filter((image) => image.selected)) {
      const response = await fetch(image.src);
      const blob = await response.blob();
      zip.file(image.path, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "selected_images.zip");
  };
  return (
    <main>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleDownload}>Download selected images</button>
      {images.map((image, index) => (
        <div key={index} className="p-5 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={image.selected}
            onChange={() => handleCheckboxChange(index)}
          />
          <div className="text-black">{image.path}</div>
          <img
            src={image.src}
            className="w-8 h-8 shadow-2xl cursor-pointer ml-2"
            alt=""
            onClick={() => window.open(image.src)}
          />
        </div>
      ))}
    </main>
  );
}
