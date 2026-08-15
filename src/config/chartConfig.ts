import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { attritionOverview, attritionTrend, projectStatuses } from "../components/manager-overview/data";
import { colors } from "../types/styles";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
);

export const donutChartData: ChartData<"doughnut", number[], string> = {
  labels: attritionOverview.map((item) => item.label),
  datasets: [
    {
      data: attritionOverview.map((item) => item.value),
      backgroundColor: attritionOverview.map((item) => item.color),
      borderColor: colors.surface,
      borderWidth: 0,
      hoverBorderWidth: 0,
      spacing: 0,
    },
  ],
};

export const donutChartOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "82%",
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: colors.primaryText,
      displayColors: false,
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed}%`,
      },
    },
  },
};

export const lineChartData: ChartData<"line", number[], string> = {
  labels: attritionTrend.labels,
  datasets: [
    {
      data: attritionTrend.values,
      borderColor: colors.primary,
      backgroundColor: "rgba(29, 127, 227, 0.12)",
      borderWidth: 3,
      pointBackgroundColor: colors.primary,
      pointBorderColor: colors.primary,
      pointHoverBackgroundColor: colors.primary,
      pointHoverBorderColor: colors.surface,
      pointRadius: 4,
      pointHoverRadius: 5,
      tension: 0.42,
      fill: true,
    },
  ],
};

export const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: colors.primaryText,
      displayColors: false,
    },
  },
  scales: {
    x: {
      border: { display: false },
      grid: { display: false },
      ticks: {
        color: colors.secondaryText,
        font: { size: 12, weight: 600 },
      },
    },
    y: {
      min: 0,
      max: 500,
      ticks: {
        stepSize: 100,
        color: colors.secondaryText,
        font: { size: 12, weight: 600 },
      },
      border: { display: false },
      grid: {
        color: colors.lightBorder,
      },
    },
  },
};

export const projectDoughnutData: ChartData<"doughnut", number[], string> = {
  labels: projectStatuses.map((status) => status.label),
  datasets: [
    {
      data: projectStatuses.map((status) => status.value),
      backgroundColor: projectStatuses.map((status) => status.color),
      borderColor: colors.surface,
      borderWidth: 2,
      hoverBorderWidth: 2,
      spacing: 0,
    },
  ],
};

export const projectDoughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "82%",
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: colors.primaryText,
      displayColors: false,
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed} projects`,
      },
    },
  },
};
