import type { Metadata } from "next";
import { NextAbstractWalletProvider } from "@/components/ui/agw-provider";
import { Toaster } from "@/components/ui/sonner";
import { NavButtons } from "@/components/nav-buttons";
import "./globals.css";

export const metadata: Metadata = {
  title: "Terminal",
  description: "Retro mining game on Abstractor L2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-green-400 font-mono">
        <NextAbstractWalletProvider>
          <div className="min-h-screen flex items-center justify-center">
            {/* OUTER TV SHELL */}
            <div className="w-[1024px] h-[832px] bg-black border-8 border-gray-700 rounded-lg shadow-2xl flex p-4">
              {/* INNER CRT SCREEN AREA */}
              <div
                className="flex flex-col flex-1 border border-green-700 rounded-md p-4 gap-4"
                style={{
                  backgroundImage: "url('/assets/crt-bg.png')",
                  backgroundSize: "cover",
                  backgroundRepeat: "repeat",
                }}
              >
                {/* TOP ROW: LEFT + RIGHT */}
                <div className="flex flex-1 gap-4">
                  {/* LEFT SCREEN (dynamic pages) */}
                  <div className="flex-1 border border-green-700 rounded-md p-6 overflow-auto">
                    {children}
                  </div>

                  {/* RIGHT COLUMN (stable) */}
                  <div className="w-[270px] flex flex-col gap-4 text-green-400 text-xs">
                    {/* Chart */}
                    <div className="flex-1 border border-green-700 rounded-md p-4">
                      <h2 className="mb-2">UFO Emission vs Earning</h2>
                      <pre>[Graph Placeholder]</pre>
                    </div>

                    {/* Stats */}
                    <div className="flex-1 border border-green-700 rounded-md p-4">
                      <h2 className="mb-2">STATION CONTROL</h2>
                      <pre>{`UFO Balance: 1,250
Status: ACTIVE
Fleet Power: 2,450
Hourly: 125 UFO

Next Emission: 545,909 blocks
Emission/Block: UFO
Total Fleet: 64,837,560
Total Burned: 48,107,182

Ship: Scout-Class
Mining Rate: 2.5 TH/s
Fleet Share: 0.03765%
Daily Yield: 3,000 UFO

Earned: 1,250 UFO`}</pre>
                    </div>
                  </div>
                </div>

                {/* NAV (inside CRT border) */}
                <div className="border-t border-green-700 pt-4">
                  <NavButtons />
                </div>
              </div>
            </div>
          </div>
          <Toaster />
        </NextAbstractWalletProvider>
      </body>
    </html>
  );
}
