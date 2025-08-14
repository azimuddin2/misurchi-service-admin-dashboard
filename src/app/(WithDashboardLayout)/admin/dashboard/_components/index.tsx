'use client';

import EarningOverviewChart from './earning-overview-chart';
import RecentUserAccount from './recent-user-account';
import TotalStats from './total-stats';
import UserOverviewChart from './user-overview-chart';

const Dashboard = () => {
  return (
    <div>
      <TotalStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <UserOverviewChart />
        <EarningOverviewChart />
      </div>
      <RecentUserAccount />
    </div>
  );
};

export default Dashboard;
