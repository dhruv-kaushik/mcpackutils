"use client";
import { MainPackOverlay } from "./_components/main";
import { FaGithub, FaTwitter } from "react-icons/fa";
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
              <span className="bg-[#5865f2] p-2 rounded-md text-4xl font-bold text-white tracking-wide uppercase">
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
                  >
                    <FaGithub size={24} />
                  </a>
                  <a
                    href="https://twitter.com/tabah_i"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter size={24} />
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
                Source Code
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
