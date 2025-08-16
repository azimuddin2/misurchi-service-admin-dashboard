'use client';

import { Card } from '@/components/ui/card';
import { useGetUserByIdQuery } from '@/redux/features/user/userApi';
import { IUser } from '@/types';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  userId: string;
};

const ViewAccount = ({ userId }: Props) => {
  const { data } = useGetUserByIdQuery(userId);
  const user: IUser | undefined = data?.data;

  const joinDate = user?.createdAt
    ? format(new Date(user.createdAt), 'dd MMM, yyyy')
    : '';

  return (
    <div>
      {/* Profile Section */}
      <div className="w-full lg:w-1/4">
        <Card className="overflow-hidden border-none p-3 shadow-none">
          <div className="mt-6">
            <Avatar className="mx-auto w-28 h-28">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="bg-[#165940] text-white text-5xl capitalize">
                {user?.fullName?.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Information */}
          <div className="divide-y divide-gray-200">
            {/* Name */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">Name</span>
              <span className="text-[#212529] font-semibold">
                {user?.fullName}
              </span>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Email</span>
              <span className="text-[#212529] font-semibold">
                {user?.email}
              </span>
            </div>

            {/* Phone Number */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">Phone Number</span>
              <span className="text-[#212529] font-semibold">
                {user?.phone}
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
              <span className="text-[#212529] font-semibold">Ontario, USA</span>
            </div>

            {/* Account Type */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Account Type</span>
              <span className="text-[#212529] font-semibold capitalize">
                {user?.role === 'vendor' ? 'Service Provider' : user?.role}
              </span>
            </div>

            {/* Subscription Plan */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">
                Subscription Plan
              </span>
              <span className="text-[#212529] font-semibold">Basic</span>
            </div>

            {/* Total Products */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Total Products</span>
              <span className="text-[#212529] font-bold">{21}</span>
            </div>

            {/* Total Service */}
            <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE]">
              <span className="text-[#212529] font-medium">Total Service</span>
              <span className="text-[#212529] font-semibold">{16}</span>
            </div>

            {/* Total Earning */}
            <div className="flex justify-between items-center px-4 py-4">
              <span className="text-[#212529] font-medium">Total Earning</span>
              <span className="text-[#212529] font-semibold">$2000.00</span>
            </div>
          </div>
        </Card>
      </div>
      <div></div>
    </div>
  );
};

export default ViewAccount;
