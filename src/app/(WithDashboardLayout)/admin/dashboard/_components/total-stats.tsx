'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAdminDashboardStatsQuery } from '@/redux/features/dashboard/dashboardApi';
import { TAdminDashboardStats } from '@/types/dashboard.type';
import { ArrowDown, ArrowUp } from 'lucide-react';
import CountUp from 'react-countup';

const TotalStats = () => {
  const { data } = useGetAdminDashboardStatsQuery({});
  const adminDashboardStats = data?.data as TAdminDashboardStats;

  const totalUsers = adminDashboardStats?.totalUsers || 0;
  const totalIncome = adminDashboardStats?.totalIncome || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sora">
      <Card className="border-none shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Total User
            <div className="text-lg flex items-center gap-0.5 text-[#5F1011]">
              <ArrowDown className=" w-4 h-4" />
              12 %
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">
            <CountUp end={totalUsers} duration={1.5} separator="," />
          </h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F] text-sc-clarity-ice">
            Last 30 days
          </p>
        </CardContent>
      </Card>
      <Card className="border-none shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
            Total Earning
            <div className=" flex items-center gap-0.5 text-[#165940]">
              <ArrowUp className=" w-4 h-4" />
              12 %
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-semibold text-ns-title">
            $
            <CountUp
              end={totalIncome}
              duration={1.5}
              decimals={2} // ensures 2 decimal places
              separator="," // adds thousands separator
              decimal="." // decimal point
            />
          </h2>
          <p className="mt-2 text-base font-medium text-[#7F7F7F] text-sc-clarity-ice">
            Last 30 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalStats;
