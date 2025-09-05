import React from "react";

// import style
import styles from "@/assets/css/dashboard/manualpage.module.css";

const ManualPage = () => {
  return (
    <div className={styles.main}>
      <div className={styles.title}>Information</div>
      <div className={styles.wrapper}>
        <div className={styles.section}>
          <div className={styles.subTitle}>Quick Summary</div>
          <div className={styles.content}>
            <div className={styles.text}>
              Buy a Spacecraft Pack (Starter or market).
            </div>
            <div className={styles.text}>
              Deploy Spacecrafts into your fleet. They start generating $UFO
              every hour.
            </div>
            <div className={styles.text}>
              Reinvest $UFO into more Spacecrafts or upgrades to scale your
              Fleet Power and earnings.
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.subTitle}>Player Goals</div>
          <div className={styles.content}>
            <div className={styles.text}>
              Build a fleet that produces predictable hourly $UFO.
            </div>
            <div className={styles.text}>
              Decide the strategy: broad (many Tier 1 Spacecrafts) or deep
              (fewer high-tier ships + upgrades).
            </div>
            <div className={styles.text}>
              Leverage packs, seasonal events, and marketplace trades to
              increase Fleet Power.
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.subTitle}>Suggested Play Styles</div>
          <div className={styles.content}>
            <div className={styles.text}>
              Casual: Buy a starter pack, collect hourly $UFO, gradually expand.
            </div>
            <div className={styles.text}>
              Strategic/Investor: Optimize tier & Level mix, reinvest for
              compounding yield.
            </div>
            <div className={styles.text}>
              Collector: Target rare Tier 3 & Tier 4 Spacecrafts and limited
              packs.
            </div>
          </div>
        </div>
      </div>
      <div className={styles.miningSection}>
        <div className={styles.mineText}>Fleet Mining</div>
        <div className={styles.mineText}>
          The game’s reward engine calculates hourly emissions and credits user
          accounts in near real time.
        </div>
        <div className={styles.mineText}>
          Fleet Power: Each Spacecraft contributes Base Fleet Power (determined
          by tier + level).
        </div>
        <div className={styles.mineText}>
          Player Share = PlayerFleetPower/TotalFleetPower
        </div>
        <div className={styles.mineText}>
          Emission Distribution: Every hour, the system allocates the Hourly
          Emission Pool and distributes rewards proportionally.
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.text}>[EXAMPLE]</div>
        <div className={styles.text}>*Global Fleet Power: 100,000</div>
        <div className={styles.text}>*Your Fleet Power: 1,000 → 1% Share</div>
        <div className={styles.text}>
          *Hourly Emission: 100,000 $UFO → Your payout = 1,000 $UFO for that
          hour.
        </div>
      </div>
    </div>
  );
};

export default ManualPage;
