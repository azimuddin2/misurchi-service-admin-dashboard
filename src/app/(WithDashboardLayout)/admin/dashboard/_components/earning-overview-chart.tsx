'use client';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const chartData = [
  { month: 'Jan', value: 50 },
  { month: 'Feb', value: 45 },
  { month: 'Mar', value: 48 },
  { month: 'Apr', value: 30 },
  { month: 'May', value: 35 },
  { month: 'Jun', value: 42 },
  { month: 'Jul', value: 47 },
  { month: 'Aug', value: 52 },
  { month: 'Sep', value: 60 },
  { month: 'Oct', value: 72 },
  { month: 'Nov', value: 80 },
  { month: 'Dec', value: 88 },
];

const EarningOverviewChart = () => {
  const [year, setYear] = useState(String(new Date().getFullYear()));

  return (
    <Card className="w-full border-none shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-xl font-semibold text-ns-title">
          Earning Overview
        </CardTitle>
        <div className=" flex items-center gap-4">
          <div>
            <p className=" text-sc-charcoal-logic font-sora text-sm">
              Monthly Growth: 35.80%
            </p>
          </div>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="py-5">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      {/* ---------------------------------- Chart ---------------------------------- */}
      <div style={{ height: 400, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#165940" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#165940" stopOpacity={1} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[100, 100, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EarningOverviewChart;
