import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
// import "./PieChart2.css";
import { incomesCategoryType } from "../../../pages/IncomeAndIncrease/ExpensesAndIncome";

export interface IncomeData {
  month: string;
  totalAmount: number;
  entryPercentages: Array<{
    value: number
  }>
}

interface IncomesPieChartProps {
  data: incomesCategoryType,
  isMonthData: boolean,
  monthData: IncomeData
}

const chartConfig = {
  visitors: {
    label: "July",
  },
  home: {
    label: "Home",
    color: "hsl(var(--chart-1))",
  },
  market: {
    label: "Market",
    color: "hsl(var(--chart-2))",
  },
  clothes: {
    label: "Clothes",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "#c4c4c4",
  },
} satisfies ChartConfig;

export const IncomesPieChart = ({ data, monthData, isMonthData }: IncomesPieChartProps) => {

  return (
    <div className="pie-card-container">
      <ChartContainer
        config={chartConfig}
        className="aspect-square w-[16vw] max-h-[260px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={isMonthData === false ? data.categoryMappedData : monthData.entryPercentages}
            dataKey={isMonthData === false ? "incomeCategoryValue" : "value"}
            nameKey={isMonthData === false ? "incomeCategoryName" : "expenseCategoryName"}
            innerRadius={70}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-white"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="text-3xl font-bold fill-white"
                      >
                        ${isMonthData === false ? data.totalCategoryIncomes : monthData.totalAmount}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-white"
                      >
                        Expenses
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};
