'use client';

import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';
import checkIcon from '@/assets/icons/check.png';
import closeIcon from '@/assets/icons/close.png';
import Image from 'next/image';
import { AppButton } from '@/components/shared/app-button';

const ManageSubscription = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Add Product Button */}
      <AppButton
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <Link
            href={`/`}
            className="flex justify-center items-center space-x-1 font-semibold"
          >
            <PlusCircle size={24} />
            <span className="uppercase text-sm font-semibold">
              Add Subscription Plan
            </span>
          </Link>
        }
      />

      <div className="grid md:grid-cols-2 gap-5 mt-5">
        {/* Basic Plan */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl text-[#212529] font-bold text-center mb-2">
            Basic Plan
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Unlimited to free subscription plan
          </p>

          <div className="bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white text-center py-4 rounded-md mb-8">
            <span className="text-3xl font-bold">Free</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Cost: Free</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={closeIcon} alt="x" width={16} />
              <span>Add Team Members: No</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Validity: Unlimited</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Add Service Max: 10</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={closeIcon} alt="x" width={16} />
              <span>Grant permission Access: No</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Add Product Max: 10</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Transaction percentage: 7.5%</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={closeIcon} alt="x" width={16} />
              <span>Shared Calendar: No</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Highlight offering Max 1</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={closeIcon} alt="x" width={16} />
              <span>Task Hub: No</span>
            </li>
          </ul>

          <Link
            href="/get-started"
            className="block text-center border border-gray-300 rounded-md py-3 px-4 font-medium hover:bg-gray-50 transition-colors"
          >
            EDIT <ArrowRight className="inline-block ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Advance Plan */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl text-[#212529] font-bold text-center mb-2">
            Advance Plan
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Limited to paid subscription plan
          </p>

          <div className=" bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white text-center py-4 rounded-md mb-8">
            <span className="text-3xl font-bold">$52.00</span>
            <span className="text-xl">/month</span>
          </div>

          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Cost: $52.00 per month</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Add Team Members: Yes</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Validity: Limited to paid subscription</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Add Service Max: Unlimited</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Grant permission Access: Yes</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Add Product Max: Unlimited</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Transaction percentage: 5%</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Shared Calendar: Yes</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Highlight offering Max 5</span>
            </li>
            <li className="flex items-center gap-2">
              <Image src={checkIcon} alt="check" width={20} />
              <span>Task Hub: Yes</span>
            </li>
          </ul>

          <Link
            href="/get-started"
            className="block text-center border border-gray-300 rounded-md py-3 px-4 font-medium hover:bg-gray-50 transition-colors"
          >
            EDIT <ArrowRight className="inline-block ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscription;
