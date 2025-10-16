'use client';

import Link from 'next/link';
import { ArrowRight, PlusCircle } from 'lucide-react';
import checkIcon from '@/assets/icons/check.png';
import closeIcon from '@/assets/icons/close.png';
import Image from 'next/image';
import { AppButton } from '@/components/shared/app-button';
import { useGetAllSubscriptionPlansQuery } from '@/redux/features/subscription/subscriptionApi';
import { TSubscriptionPlan } from '@/types/subscription.type';
import Spinner from '@/components/shared/Spinner';

const ManageSubscription = () => {
  const { data, isLoading } = useGetAllSubscriptionPlansQuery({});
  const subscriptionPlans = data?.data || [];

  if (isLoading) {
    return <Spinner />;
  }

  // ✅ Helper function to format validity nicely
  const formatValidity = (validity: string) => {
    switch (validity) {
      case 'free':
        return 'Free';
      case '1month':
        return '1 Month';
      case '1year':
        return '1 Year';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Add Subscription Button */}
      <AppButton
        className="w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
        content={
          <Link
            href={`/admin/manage-subscription/add-subscription`}
            className="flex justify-center items-center space-x-1 font-semibold"
          >
            <PlusCircle size={24} />
            <span className="uppercase text-sm font-semibold">
              Add Subscription Plan
            </span>
          </Link>
        }
      />

      {/* Subscription Plans */}
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        {subscriptionPlans.map((plan: TSubscriptionPlan) => (
          <div key={plan._id} className="bg-white rounded-lg p-8 shadow-sm">
            {/* Title */}
            <h2 className="text-3xl text-[#212529] font-semibold text-center mb-2">
              {plan.name}
            </h2>
            <p className="text-gray-500 text-center mb-6 capitalize">
              {plan.description}
            </p>

            {/* Price */}
            <div className="bg-gradient-to-t to-green-800 from-green-500/70 text-white text-center py-4 rounded-md mb-8">
              {plan.cost === 0 ? (
                <span className="text-3xl font-bold">Free</span>
              ) : (
                <>
                  <span className="text-3xl font-bold">
                    ${plan.cost.toFixed(2)}
                  </span>
                  <span className="text-xl">
                    {' '}
                    / {formatValidity(plan.validity)}
                  </span>
                </>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <Image src={checkIcon} alt="check" width={20} />
                <span>
                  Cost: {plan.cost === 0 ? 'Free' : `$${plan.cost.toFixed(2)}`}
                </span>
              </li>

              {/* Dynamic Features */}
              <li className="flex items-center gap-2">
                <Image
                  src={plan.features.teamMembers ? checkIcon : closeIcon}
                  alt=""
                  width={20}
                />
                <span>
                  Add Team Members: {plan.features.teamMembers ? 'Yes' : 'No'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Image
                  src={plan.features.sharedCalendar ? checkIcon : closeIcon}
                  alt=""
                  width={20}
                />
                <span>
                  Shared Calendar: {plan.features.sharedCalendar ? 'Yes' : 'No'}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Image
                  src={plan.features.taskHub ? checkIcon : closeIcon}
                  alt=""
                  width={20}
                />
                <span>Task Hub: {plan.features.taskHub ? 'Yes' : 'No'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Image
                  src={
                    plan.features.grantPermissionAccess ? checkIcon : closeIcon
                  }
                  alt=""
                  width={20}
                />
                <span>
                  Grant Permission Access:{' '}
                  {plan.features.grantPermissionAccess ? 'Yes' : 'No'}
                </span>
              </li>

              {/* Limits */}
              <li className="flex items-center gap-2">
                <Image src={checkIcon} alt="check" width={20} />
                <span>Service Max: {plan.limits.serviceMax}</span>
              </li>
              <li className="flex items-center gap-2">
                <Image src={checkIcon} alt="check" width={20} />
                <span>Product Max: {plan.limits.productMax}</span>
              </li>
              <li className="flex items-center gap-2">
                <Image src={checkIcon} alt="check" width={20} />
                <span>
                  Highlight Offer Max: {plan.limits.highlightOfferMax}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Image src={checkIcon} alt="check" width={20} />
                <span>Transaction Fee: {plan.limits.transactionFee}%</span>
              </li>

              {/* Validity */}
              <li className="flex items-center gap-2">
                <Image src={checkIcon} alt="check" width={20} />
                <span className="capitalize">
                  Validity: {formatValidity(plan.validity)}
                </span>
              </li>
            </ul>

            {/* Edit Button */}
            <Link
              href={`/admin/manage-subscription/edit-subscription/${plan._id}`}
              className="block text-center border border-gray-300 rounded-md py-3 px-4 font-medium hover:bg-gray-50 transition-colors"
            >
              EDIT <ArrowRight className="inline-block ml-2 h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSubscription;
