"use client";
import { Button } from "@/components/ui/button";
import { MainPackOverlay } from "./_components/main";
import {
  GitHubLogoIcon,
  TwitterLogoIcon,
  DiscordLogoIcon,
} from "@radix-ui/react-icons";
import { Code2Icon } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <div className="flex items-center justify-center p-5">
            <h1 className="p-2 rounded-md text-4xl font-bold text-[#23272a] tracking-wide uppercase">
              {" "}
              The
              {"   "}
              <span className="bg-[#5865f2] p-2 rounded-sm text-4xl font-bold text-white tracking-wide uppercase">
                Best
              </span>
              {"  "}Way to Make Pack Overlays.
            </h1>
          </div>
          <MainPackOverlay />
        </div>
        <div>
          <footer className="flex items-center justify-between p-5 bg-[#23272a] text-white">
            <div className="flex items-center space-x-4">
              <img
                src="/avatar.png"
                alt="@tabahi"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-bold">Made by Tabahi</div>
                <div className="flex space-x-2">
                  <a
                    href="https://github.com/dhruv-kaushik"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 ease-in-out hover:text-[#57f287]"
                  >
                    <GitHubLogoIcon width={24} height={24} />
                  </a>
                  <a
                    href="https://twitter.com/tabah_i"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 ease-in-out text-white hover:text-[#1DA1F2]"
                  >
                    <TwitterLogoIcon width={25} height={25} />
                  </a>
                  <a
                    href="https://discord.gg/tvQZKq7Wax"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 ease-in-out text-white hover:text-[#5865f2]"
                  >
                    <FaDiscord size={24} />
                  </a>
                </div>
              </div>
            </div>
            <div>
              <a
                href="https://github.com/dhruv-kaushik/mcpackutils"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="link"
                  className="text-white hover:text-[#57f287]"
                >
                  <Code2Icon size={24} className="mr-2 hover:text-green-400" />
                  Src
                </Button>
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
