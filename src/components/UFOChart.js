import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// import assets
import styles from "@/assets/css/prediction/ufochart.module.css";

const data = [
  { name: "T1", emission: 100, earning: 10 },
  { name: "T2", emission: 80, earning: 12 },
  { name: "T3", emission: 40, earning: 13 },
  { name: "T4", emission: 50, earning: 13 },
  { name: "T5", emission: 20, earning: 13 },
  { name: "T6", emission: 10, earning: 13 },
];

const UFOChart = () => {
  return (
    <div className={styles.crtWrapper}>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            axisLine={{ stroke: "#4aff41", strokeWidth: 1 }}
            tick={false} // remove ticks
            padding={{ left: 0, right: 0 }}
            height={10}
          />
          <YAxis
            axisLine={{ stroke: "#4aff41", strokeWidth: 1 }}
            tick={false} // remove ticks
            width={10} // controls "thickness" of left axis area
            padding={{ top: 0, bottom: 0 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "black",
              border: "1px solid #4aff41",
            }}
            labelStyle={{ color: "#4aff41" }}
          />
          <Line
            type="monotone"
            dot={false}
            dataKey="emission"
            stroke="#4aff41"
            strokeWidth={1}
            strokeDasharray="6 6"
            name="UFO Emission"
          />
          <Line
            type="monotone"
            dot={false}
            dataKey="earning"
            stroke="#4aff41"
            strokeWidth={1}
            name="UFO Earning"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Custom Legend */}
      <div className={styles.crtLegend}>
        <div className={styles.crtLegendText}>--- UFO Emission</div>
        <div className={styles.crtLegendText}>― UFO Earning</div>
      </div>
    </div>
  );
};

export default UFOChart;
