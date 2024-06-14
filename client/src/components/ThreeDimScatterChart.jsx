import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ThreeDimScatterChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="Attempt" />
        <YAxis type="number" dataKey="y" name="Average Time (seconds)" />
        <ZAxis type="number" dataKey="z" range={[60, 400]} name="Score" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Legend />
        <Scatter
          name="Quiz Attempts"
          data={data}
          fill="#8884d8"
          shape="circle"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ThreeDimScatterChart;
