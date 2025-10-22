'use client';

import { Card } from '@/components/ui/card';
import { useGetUserProfileQuery } from '@/redux/features/user/userApi';
import { IUser } from '@/types';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Products from './products';
import Services from './services';
import {
  useGetVendorProfileQuery,
  useGetVendorSummaryQuery,
} from '@/redux/features/vendor/vendorApi';
import Spinner from '@/components/shared/Spinner';

type Props = {
  email: string;
};

const VendorViewAccount = ({ email }: Props) => {
  const { data, isLoading } = useGetUserProfileQuery(email);
  const user: IUser | undefined = data?.data;

  const { data: vendorData, isLoading: vendorDataIsLoading } =
    useGetVendorProfileQuery(user?.email as string);
  const vendor = vendorData?.data;

  const vendorId = vendor?._id as string;

  const { data: vendorSummary, isLoading: vendorSummaryIsLoading } =
    useGetVendorSummaryQuery({ id: vendorId });

  const totalProducts = vendorSummary?.data.totalProducts;
  const totalServices = vendorSummary?.data.totalServices;
  const totalEarnings = vendorSummary?.data.totalEarnings;

  const joinDate = vendor?.createdAt
    ? format(new Date(vendor.createdAt), 'dd MMM, yyyy')
    : '';

  if (isLoading || vendorDataIsLoading || vendorSummaryIsLoading) {
    return <Spinner />;
  }

  return (
    <div className="lg:flex">
      {/* Profile Section */}
      <div className="w-full lg:w-1/4">
        <Card className="overflow-hidden border-none p-3 shadow-none">
          <div className="mt-6">
            <Avatar className="mx-auto w-28 h-28">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-[#165940] text-white text-5xl capitalize">
                {vendor?.businessName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Information */}
          <div className="divide-y divide-gray-200">
            {/* Name */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">Name</span>
              <span className="text-[#212529] font-semibold">
                {vendor?.businessName}
              </span>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Email</span>
              <span className="text-[#212529] font-semibold">
                {vendor?.email}
              </span>
            </div>

            {/* Phone Number */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">Phone Number</span>
              <span className="text-[#212529] font-semibold">
                {vendor?.phone}
              </span>
            </div>

            {/* Date of Join */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Date of Join</span>
              <span className="text-[#212529] font-semibold">{joinDate}</span>
            </div>

            {/* Location */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">Location</span>
              <span className="text-[#212529] font-semibold">
                {vendor?.country}
              </span>
            </div>

            {/* Account Type */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Account Type</span>
              <span className="text-[#212529] font-semibold capitalize">
                {vendor?.chooseOffer} Provider
              </span>
            </div>

            {/* Subscription Plan */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">
                Subscription Plan
              </span>
              {user?.subscribed ? (
                <span className="text-[#212529] font-semibold capitalize">
                  {user?.subscribed}
                </span>
              ) : (
                <span className="text-[#212529] font-semibold capitalize">
                  Basic
                </span>
              )}
            </div>

            {/* Total Products */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Total Products</span>
              <span className="text-[#212529] font-bold">{totalProducts}</span>
            </div>

            {/* Total Service */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">Total Service</span>
              <span className="text-[#212529] font-semibold">
                {totalServices}
              </span>
            </div>

            {/* Total Earning */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Total Earning</span>
              <span className="text-[#212529] font-semibold">
                ${totalEarnings?.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Product & Service Section  */}
      <div className="w-full max-w-6xl mx-auto mt-5 lg:mt-0">
        <Tabs defaultValue="products" className="w-full max-w-6xl mx-auto">
          <TabsList
            style={{ background: 'none' }}
            className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
          >
            {/* Products Tab */}
            <TabsTrigger
              value="products"
              className="relative w-full cursor-pointer text-[#165940] bg-white text-lg 
    rounded-md font-medium py-6 transition
    data-[state=active]:text-[#165940] 
    data-[state=active]:shadow
    data-[state=active]:bg-gradient-to-b 
    data-[state=active]:from-[#cadfe7] 
    data-[state=active]:to-[#d9ebe8]
    data-[state=active]:before:absolute
    data-[state=active]:before:inset-0
    data-[state=active]:before:rounded-md
    data-[state=active]:before:bg-gradient-to-t
    data-[state=active]:before:from-[#cadfe7]
    data-[state=active]:before:to-transparent
    data-[state=active]:before:opacity-40
    data-[state=active]:before:content-['']"
            >
              Products
            </TabsTrigger>

            {/* Services Tab */}
            <TabsTrigger
              value="services"
              className="relative w-full cursor-pointer text-[#165940] bg-white text-lg 
    rounded-md font-medium py-6 transition
    data-[state=active]:text-[#165940] 
    data-[state=active]:shadow
    data-[state=active]:bg-gradient-to-b 
    data-[state=active]:from-[#cadfe7] 
    data-[state=active]:to-[#d9ebe8]
    data-[state=active]:before:absolute
    data-[state=active]:before:inset-0
    data-[state=active]:before:rounded-md
    data-[state=active]:before:bg-gradient-to-t
    data-[state=active]:before:from-[#cadfe7]
    data-[state=active]:before:to-transparent
    data-[state=active]:before:opacity-40
    data-[state=active]:before:content-['']"
            >
              Services
            </TabsTrigger>
          </TabsList>

          {/* Content Panels */}
          <TabsContent value="products" className="mt-2">
            <Products vendorId={vendorId} />
          </TabsContent>

          <TabsContent value="services" className="mt-2">
            <Services vendorId={vendorId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorViewAccount;
