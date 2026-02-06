"use client";

import Link from "next/link";
import { Header } from "@/components/layout";
import { Container } from "@/components/layout/Container";
import { ThemeToggle } from "@/components/providers";
import { Card, Button, Table, Chart } from "@/components/ui";
import type { ChartDataPoint } from "@/components/ui";

// Sample chart data
const barData: ChartDataPoint[] = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
  { name: "Jun", value: 700 },
];

const lineData: ChartDataPoint[] = [
  { name: "Week 1", value: 100 },
  { name: "Week 2", value: 200 },
  { name: "Week 3", value: 150 },
  { name: "Week 4", value: 300 },
  { name: "Week 5", value: 250 },
  { name: "Week 6", value: 400 },
];

const pieData: ChartDataPoint[] = [
  { name: "Desktop", value: 400, color: "#ffffff" },
  { name: "Mobile", value: 300, color: "#a3a3a3" },
  { name: "Tablet", value: 200, color: "#737373" },
  { name: "Other", value: 100, color: "#525252" },
];

// Sample table data
interface SalesData {
  product: string;
  category: string;
  sales: number;
  revenue: number;
  growth: string;
}

const tableData: SalesData[] = [
  { product: "Product A", category: "Electronics", sales: 1234, revenue: 45600, growth: "+12%" },
  { product: "Product B", category: "Clothing", sales: 867, revenue: 23400, growth: "+8%" },
  { product: "Product C", category: "Home", sales: 543, revenue: 12300, growth: "-3%" },
  { product: "Product D", category: "Electronics", sales: 2341, revenue: 78900, growth: "+25%" },
  { product: "Product E", category: "Sports", sales: 432, revenue: 9800, growth: "+5%" },
  { product: "Product F", category: "Clothing", sales: 765, revenue: 19800, growth: "+15%" },
  { product: "Product G", category: "Home", sales: 321, revenue: 7600, growth: "-8%" },
  { product: "Product H", category: "Electronics", sales: 1876, revenue: 56700, growth: "+18%" },
];

const columns = [
  { key: "product" as const, header: "Product", sortable: true },
  { key: "category" as const, header: "Category", sortable: true },
  { key: "sales" as const, header: "Sales", sortable: true, align: "right" as const },
  {
    key: "revenue" as const,
    header: "Revenue",
    sortable: true,
    align: "right" as const,
    render: (value: unknown) => `$${(value as number).toLocaleString()}`,
  },
  {
    key: "growth" as const,
    header: "Growth",
    align: "right" as const,
    render: (value: unknown) => {
      const isPositive = (value as string).startsWith("+");
      return (
        <span className={isPositive ? "text-green-400" : "text-red-400"}>
          {value as string}
        </span>
      );
    },
  },
];

export default function ChartsExamplePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header
        logo={
          <Link href="/" className="font-semibold text-[var(--text-primary)]">
            Wireframe
          </Link>
        }
        actions={
          <div className="flex items-center gap-4">
            <ThemeToggle size="sm" />
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
          </div>
        }
        sticky
      />

      <Container size="xl" className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Charts & Data Display
          </h1>
          <p className="text-[var(--text-secondary)]">
            Chart and Table component examples
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Bar Chart - Monthly Sales
            </h2>
            <Chart
              type="bar"
              data={barData}
              height={280}
              showGrid
              showTooltip
              showLegend={false}
              yAxisLabel="Sales"
            />
          </Card>

          {/* Line Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Line Chart - Weekly Progress
            </h2>
            <Chart
              type="line"
              data={lineData}
              height={280}
              showGrid
              showTooltip
              showLegend={false}
              yAxisLabel="Progress"
            />
          </Card>

          {/* Pie Chart */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Pie Chart - Device Distribution
            </h2>
            <Chart
              type="pie"
              data={pieData}
              height={280}
              showTooltip
              showLegend
            />
          </Card>

          {/* Stats Cards */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              Summary Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
                <p className="text-sm text-[var(--text-muted)]">Total Sales</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  8,379
                </p>
                <p className="text-sm text-green-400">+12.5%</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
                <p className="text-sm text-[var(--text-muted)]">Revenue</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  $254K
                </p>
                <p className="text-sm text-green-400">+8.2%</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
                <p className="text-sm text-[var(--text-muted)]">Orders</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  1,234
                </p>
                <p className="text-sm text-red-400">-3.1%</p>
              </div>
              <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)]">
                <p className="text-sm text-[var(--text-muted)]">Customers</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  567
                </p>
                <p className="text-sm text-green-400">+15.3%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Data Table - Product Sales
          </h2>
          <Table
            columns={columns}
            data={tableData}
            sortable
            pagination
            pageSize={5}
          />
        </Card>
      </Container>
    </div>
  );
}
