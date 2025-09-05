"use client";

export default function Info() {
  return (
    <div className="h-full w-full text-green-400 font-mono flex flex-col text-sm leading-tight">
      {/* Title */}
      <h1 className="text-2xl mb-4">INFORMATION</h1>

      {/* Quick Summary */}
      <section className="mb-4">
        <h2 className="font-bold">QUICK SUMMARY</h2>
        <p className="mb-1">BUY A SPACECRAFT PACK (STARTER OR MARKET).</p>
        <p className="mb-1">
          DEPLOY SPACECRAFTS INTO YOUR FLEET. THEY START GENERATING $UFO EVERY
          HOUR.
        </p>
        <p>
          REINVEST $UFO INTO MORE SPACECRAFTS OR UPGRADES TO SCALE YOUR FLEET
          POWER AND EARNINGS.
        </p>
      </section>

      {/* Player Goals */}
      <section className="mb-4">
        <h2 className="font-bold">PLAYER GOALS</h2>
        <p className="mb-1">
          BUILD A FLEET THAT PRODUCES PREDICTABLE HOURLY $UFO.
        </p>
        <p className="mb-1">
          DECIDE THE STRATEGY: BROAD (MANY TIER 1 SPACECRAFTS) OR DEEP (FEWER
          HIGH-TIER SHIPS + UPGRADES).
        </p>
        <p>
          LEVERAGE PACKS, SEASONAL EVENTS, AND MARKETPLACE TRADES TO INCREASE
          FLEET POWER.
        </p>
      </section>

      {/* Suggested Play Styles */}
      <section className="mb-4">
        <h2 className="font-bold">SUGGESTED PLAY STYLES</h2>
        <p className="mb-1">
          CASUAL: BUY A STARTER PACK, COLLECT HOURLY $UFO, GRADUALLY EXPAND.
        </p>
        <p className="mb-1">
          STRATEGIC/INVESTOR: OPTIMIZE TIER & LEVEL MIX, REINVEST FOR
          COMPOUNDING YIELD.
        </p>
        <p>
          COLLECTOR: TARGET RARE TIER 3 & TIER 4 SPACECRAFTS AND LIMITED PACKS.
        </p>
      </section>

      {/* Dashed Info Box */}
      <div className="border border-green-400 border-dashed p-3 mb-6 text-xs space-y-1">
        <p>Fleet Mining</p>
        <p>
          The game’s reward engine calculates hourly emissions and credits user
          accounts in near real time.
        </p>
        <p>
          Fleet Power: Each Spacecraft contributes Base Fleet Power (determined
          by tier + level).
        </p>
        <p>Player Share = PlayerFleetPower / TotalFleetPower</p>
        <p>
          Emission Distribution: Every hour, the system allocates the Hourly
          Emission Pool and distributes rewards proportionally.
        </p>
      </div>

      {/* Example Section */}
      <section>
        <h2 className="font-bold mb-2">[ EXAMPLE ]</h2>
        <p>* GLOBAL FLEET POWER: 100,000</p>
        <p>* YOUR FLEET POWER: 1,000 → 1% SHARE</p>
        <p>
          * HOURLY EMISSION: 100,000 $UFO → YOUR PAYOUT = 1,000 $UFO FOR THAT
          HOUR.
        </p>
      </section>
    </div>
  );
}
