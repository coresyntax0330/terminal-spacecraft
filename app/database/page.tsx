"use client";

export default function Database() {
  return (
    <div className="h-full w-full text-green-400 font-mono flex flex-col">
      {/* Title */}
      <h1 className="text-2xl mb-6">DATABASE</h1>

      {/* Wallet Section */}
      <div className="mb-6">
        <h2 className="text-lg mb-2">YOUR WALLET INFORMATION AND ETH BALANCES</h2>

        <div className="border border-green-400 border-dashed p-4 space-y-2">
          <div className="flex justify-between">
            <span>TOKEN BALANCES</span>
            <span>0.000000 $ETH</span>
          </div>
          <div className="flex justify-between">
            <span>ETHLOREMIPSUM</span>
            <span>0 $ETH</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="truncate">
              0XBA4600A92872612380129120A4600A92872612331232BD002
            </span>
            <button className="border border-green-400 px-2 py-1 text-xs hover:bg-green-400 hover:text-black transition">
              COPY
            </button>
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="mb-6">
        <h2 className="text-lg mb-2">
          SHARE YOUR REFERRAL LINK WITH A FELLOW SPACE DEGEN AND EARN A 2.5% BONUS
        </h2>

        <div className="border border-green-400 border-dashed p-4 space-y-2">
          <div className="flex justify-between">
            <span>REFERRALS</span>
            <span>0</span>
          </div>
          <div className="flex justify-between">
            <span>TOTAL REFERRALS:</span>
            <span>0</span>
          </div>
          <div className="flex justify-between">
            <span>TOTAL EARNED:</span>
            <span>0 $ETH</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="truncate">
              HTTP://LOREMIPSUM.ETH/REF/0XBA46...2BD002
            </span>
            <button className="border border-green-400 px-2 py-1 text-xs hover:bg-green-400 hover:text-black transition">
              COPY
            </button>
          </div>
        </div>
      </div>

      {/* Disconnect Option */}
      <div className="text-sm">
        <p>&gt; 1. DISCONNECT</p>
      </div>
    </div>
  );
}
