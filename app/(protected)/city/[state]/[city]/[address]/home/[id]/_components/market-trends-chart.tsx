"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { year: 2015, rate: 0, crime: 186, industry: 111 },
  { year: 2016, rate: 200, crime: 305, industry: 669 },
  { year: 2017, rate: 200, crime: 237, industry: 666 },
  { year: 2018, rate: 200, crime: 73, industry: 143 },
  { year: 2019, rate: 200, crime: 209, industry: 306 },
  { year: 2020, rate: 200, crime: 214, industry: 614 },
  { year: 2021, rate: 200, crime: 214, industry: 888 },
  { year: 2022, rate: 100000, crime: 214, industry: 999 },
];

const chartConfig = {
  crime: {
    label: "Crime",
    color: "#FF8A8A",
  },
  industry: {
    label: "Industry",
    color: "#1F316F",
  },
} satisfies ChartConfig;

const MarketTrendsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Linear</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" hideLabel />}
            />
            <Area
              dataKey="crime"
              type="linear"
              fill="#FF8A8A"
              fillOpacity={0.4}
              stroke="#FF8A8A"
            />
            <Area
              dataKey="industry"
              type="linear"
              fill="#1F316F"
              fillOpacity={0.4}
              stroke="#1F316F"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MarketTrendsChart;
