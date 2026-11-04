"use client";

/*import { TrendingUp } from "lucide-react";*/
import { CartesianGrid, XAxis, LineChart, Line } from "recharts";
import "./IncomesGraphic.css"



import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "../../ui/chart";


export const description = "A simple area chart";

export interface IncomeData {
    month: string;
    totalAmount: number;
    entryPercentages: Array<incomeCategoryPercentage>
}

export interface incomeCategoryPercentage {
    incomeEntryName: string;
    fill: string;
    incomePercentage: number;
    value: number;
}

export interface incomeMonthDataType {
    month: string;
    totalAmount: number;
}

export interface AreaChartComponentProps {
    data: incomeMonthDataType[];
}

/*const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 210 },
  { month: "August", desktop: 200 },
  { month: "September", desktop: 180 },
  { month: "October", desktop: 190 },
];*/

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(0, 0%, 100%)",
    },
} satisfies ChartConfig;



export const IncomesGraphic: React.FC<AreaChartComponentProps> = ({
    data,
}) => {
    return (
        <ChartContainer config={chartConfig} className="chart-container-size-incomes custom-tick-text-incomes">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "white" }}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Line
                    dataKey="totalAmount"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    );
};
