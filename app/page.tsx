"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

export default function HomePage() {
  const [step, setStep] = useState<"menu" | "boot" | "login">("menu");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const router = useRouter();

  const bootMessages = [
    "> INITIALIZING ABSTRACTORS CORE...",
    "> LOADING FLEET PROTOCOLS...",
    "> VERIFYING STATIONS NFT REGISTRY...",
    "> CONNECTING TO INTERSTELLAR NETWORK...",
    "> STATUS: ONLINE",
  ];

  // Handle boot sequence animation
  useEffect(() => {
    if (step === "boot") {
      let i = 0;
      setBootLines([]); // reset
      const interval = setInterval(() => {
        if (i < bootMessages.length) {
          setBootLines((prev) => [...prev, bootMessages[i]]);
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => setStep("login"), 1000);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // -------------------- MENU --------------------
  if (step === "menu") {
    return (
      <div className="h-full w-full flex items-center justify-center text-green-400 font-mono">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <Image
              src="/assets/logo.png"
              alt="Abstractors Logo"
              width={168}
              height={168}
              className="mb-4"
              priority
            />
          </div>

          {/* Menu */}
          <div className="text-sm space-y-2 mt-6">
            <p
              className="cursor-pointer hover:text-green-200"
              onClick={() => setStep("boot")}
            >
              &gt; 1. START SYSTEM
            </p>
            <p>&gt; 2. OPERATIONS MANUAL</p>
            <p>&gt; 3. SUPPLY DEPOT</p>
          </div>
        </div>
      </div>
    );
  }

  // -------------------- BOOT --------------------
  if (step === "boot") {
    return (
      <div className="h-full w-full flex items-center justify-center text-green-400 font-mono">
        <div className="space-y-2 text-sm">
          {bootLines.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
    );
  }

  // -------------------- LOGIN --------------------
  if (step === "login") {
    return (
      <div className="h-full w-full flex items-center justify-center text-green-400 font-mono">
        <div className="flex flex-col items-center space-y-6 max-w-md w-full">
          <h2 className="text-2xl">[ LOG IN TO ABSTRACT ]</h2>
          <p className="text-xs">
            SIGN IN TO YOUR ABSTRACT WALLET TO GRANT ACCESS
          </p>

          {/* Email input */}
          <input
            type="email"
            placeholder="EMAIL"
            className="w-full p-2 bg-black border border-green-400 border-dashed text-green-400 font-mono text-sm"
          />

          {/* Connect Button */}
          <div className="flex justify-center mt-4">
            <ConnectWalletButton />
          </div>

          {/* Options */}
          <div className="text-sm space-y-2 mt-6">
            <p>&gt; 1. START</p>
            <p>&gt; 2. GOOGLE</p>
            <p>&gt; 3. CONTINUE WITH A WALLET</p>
            <p>&gt; 4. I HAVE A PASSKEY</p>
          </div>

          {/* Footer */}
          <div className="text-xs mt-6 text-green-500 text-center">
            [ SYSTEM NOTES ] <br />
            PROTECTED BY <span className="text-green-300">privy</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
