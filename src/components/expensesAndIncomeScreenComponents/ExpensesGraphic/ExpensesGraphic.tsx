/*import { TrendingUp } from "lucide-react";*/
import { CartesianGrid, XAxis, LineChart, Line } from "recharts";
import "./ExpenseGraphic.css";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";

export const description = "A simple area chart";

export interface CategoryPercentage {
  expenseCategoryName: string;
  expensePercentage: number;
  fill: string;
}

export interface ExpenseData {
  month: string;
  totalAmount: number;
  categoryPercentages: {
    expenseCategoryName: string;
    fill: string;
    expensePercentage: number;
  }[];
}



export interface AreaChartComponentProps {
  data: ExpenseData[];
}

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(0, 0%, 100%)",
  },
} satisfies ChartConfig;

export const ExpensesGraphic: React.FC<AreaChartComponentProps> = ({ data }) => {

  return (
    <ChartContainer config={chartConfig} className="chart-container-size-expenses custom-tick-text-expenses">
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
