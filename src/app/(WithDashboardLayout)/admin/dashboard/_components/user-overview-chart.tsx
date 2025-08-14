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
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Jan', uv: 90 },
  { name: 'Feb', uv: 75 },
  { name: 'Mar', uv: 85 },
  { name: 'Apr', uv: 40 },
  { name: 'May', uv: 80 },
  { name: 'Jun', uv: 70 },
  { name: 'Jul', uv: 60 },
  { name: 'Aug', uv: 65 },
  { name: 'Sep', uv: 100 },
  { name: 'Oct', uv: 80 },
  { name: 'Nov', uv: 70 },
  { name: 'Dec', uv: 90 },
];

const UserOverviewChart = () => {
  const [year, setYear] = useState(String(new Date().getFullYear()));

  return (
    <div>
      <Card className="w-full border-none shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-xl font-semibold">User Overview</CardTitle>
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
        </CardHeader>
        {/* ---------------------------------- Chart ---------------------------------- */}
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#20825F" stopOpacity={1} />
                  <stop offset="100%" stopColor="#20825F" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#20825F"
                strokeWidth={2}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default UserOverviewChart;
