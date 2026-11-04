import "./ExpensesPieChart.css";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import { expenseCategoryType } from "../../../pages/IncomeAndIncrease/ExpensesAndIncome";
import { ExpenseData } from "../ExpensesGraphic/ExpensesGraphic";

interface PieChart2Props {
  data: expenseCategoryType,
  isMonthData: boolean,
  monthData: ExpenseData
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

export const ExpensesPieChart: React.FC<PieChart2Props> = ({ data, monthData, isMonthData }) => {

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
            data={isMonthData === false ? data.categoryMappedData : monthData.categoryPercentages}
            dataKey={isMonthData === false ? "expenseCategoryValue" : "value"}
            nameKey={isMonthData === false ? "expenseCategoryName" : "expenseCategoryName"}
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
                        ${isMonthData === false ? data.totalCategoryExpenses : monthData.totalAmount}
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
