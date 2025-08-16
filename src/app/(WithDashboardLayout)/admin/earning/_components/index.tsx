'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionEarnings from './subscription-earnings';
import CommissionEarnings from './commission-earnings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

const Earning = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sora mb-5">
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
            <h2 className="text-3xl font-semibold text-ns-title">$1250.00</h2>
            <p className="mt-2 text-base font-medium text-[#7F7F7F] text-sc-clarity-ice">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg font-medium text-ns-neutral-dark">
              Total Subscription Purchased
              <div className="text-lg flex items-center gap-0.5 text-[#5F1011]">
                <ArrowDown className=" w-4 h-4" />
                12 %
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-semibold text-ns-title">200</h2>
            <p className="mt-2 text-base font-medium text-[#7F7F7F] text-sc-clarity-ice">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="subscription" className="w-full mx-auto">
        <TabsList className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto gap-0 lg:gap-3 shadow-none">
          {/* Subscription Tab */}
          <TabsTrigger
            value="subscription"
            className="w-full cursor-pointer text-[#165940] bg-white text-lg rounded-md font-medium py-6 transition 
            data-[state=active]:bg-gradient-to-t 
            data-[state=active]:from-[#cadfe7] 
            data-[state=active]:to-[#d9ebe8] 
            data-[state=active]:text-[#165940] 
            data-[state=active]:shadow"
          >
            Subscription Earnings
          </TabsTrigger>

          {/* Commission Tab */}
          <TabsTrigger
            value="commission"
            className="w-full cursor-pointer text-[#165940] bg-white text-lg rounded-md font-medium py-6 transition 
            data-[state=active]:bg-gradient-to-t 
            data-[state=active]:from-[#cadfe7] 
            data-[state=active]:to-[#d9ebe8] 
            data-[state=active]:text-[#165940] 
            data-[state=active]:shadow"
          >
            Commission Earnings
          </TabsTrigger>
        </TabsList>

        {/* Content Panels */}
        <TabsContent value="subscription" className="mt-2">
          <SubscriptionEarnings />
        </TabsContent>

        <TabsContent value="commission" className="mt-2">
          <CommissionEarnings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Earning;
