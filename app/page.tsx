"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { MainPackOverlay } from "./_components/main";
import { Badge } from "@/components/ui/badge";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { FaGithub, FaTwitter } from "react-icons/fa";
export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="flex items-center justify-center p-5">
            <h1 className="p-2 rounded-md text-4xl font-bold text-black tracking-wide uppercase">
              {" "}
              The Best Way to Make
              {"   "}
              <span className="bg-[#5865f2] p-2 rounded-md text-4xl font-bold text-white tracking-wide uppercase">
                Pack Overlays.
              </span>
            </h1>
          </div>
          <MainPackOverlay />
        </div>
        <footer className="flex items-center justify-between p-5 bg-[#23272a] text-white">
          <div className="flex flex-col space-y-4">
            <a
              href="https://www.facebook.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600" // Facebook's brand color
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1DA1F2]" // Twitter's brand color
            >
              <FaTwitter size={24} />
            </a>
          </div>
          <div className="text-center ml-48 bg-[#ed4245] font-bold p-3 uppercase">
            <p>Texture Packs are not stored in this process</p>{" "}
          </div>
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@tabahi" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <div className="font-bold">Made by Tabahi</div>
              <div className="space-x-2">
                <Badge variant="secondary">Web Developer</Badge>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
