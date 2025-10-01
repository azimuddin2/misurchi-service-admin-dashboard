'use client';

import { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { createPlanValidationSchema } from './subscriptionValidation';
import {
  useGetSubscriptionPlanByIdQuery,
  useUpdateSubscriptionPlanMutation,
} from '@/redux/features/subscription/subscriptionApi';
import Spinner from '@/components/shared/Spinner';
import Link from 'next/link';

type Props = {
  id: string;
};

const EditSubscription = ({ id }: Props) => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const { data, isLoading } = useGetSubscriptionPlanByIdQuery(id);
  const plan = data?.data;

  const [updatePlan] = useUpdateSubscriptionPlanMutation();

  const form = useForm({
    resolver: zodResolver(createPlanValidationSchema),
    defaultValues: {
      name: '',
      cost: 0,
      description: '',
      features: {
        teamMembers: false,
        sharedCalendar: false,
        taskHub: false,
        grantPermissionAccess: false,
      },
      limits: {
        serviceMax: 0,
        productMax: 0,
        highlightOfferMax: 0,
        transactionFee: 0,
      },
      validity: {
        type: '1month',
        durationInMonths: '',
      },
    },
  });

  // Populate form when plan is fetched
  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        cost: plan.cost,
        description: plan.description,
        features: plan.features,
        limits: plan.limits,
        validity: plan.validity,
      });
    }
  }, [plan]);

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    // const updatedData = { ...data };

    const toastId = toast.loading('Updating subscription plan...');

    try {
      const res = await updatePlan({ id, data }).unwrap();
      toast.success(res.message || 'Subscription plan updated successfully');
      router.push(`/${user?.role}/manage-subscription`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update plan');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-5xl mx-auto p-5 lg:p-8 bg-white rounded-lg">
      <div className="mb-5">
        <h2 className="text-2xl font-semibold">Edit Subscription Plan</h2>
        <p className="text-gray-500">
          Update plan details, features, and pricing
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Plan Info */}
          <div>
            <h3 className="text-xl font-medium mb-4">Plan Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Basic Plan"
                        className="bg-[#f5f5f5] py-6 border rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (Enter 0 for free plan)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-[#f5f5f5] py-6 border rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-sm font-medium mt-5">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={8}
                      className="bg-[#f5f5f5] py-3 px-3 border-none rounded-sm w-full h-12"
                      placeholder="Enter short description here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-medium mb-4">Features & Permissions</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(form.getValues('features')).map(([feature]) => (
                <FormField
                  key={feature}
                  control={form.control}
                  name={`features.${feature}` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-sm px-4 py-4 bg-[#f4f9fc]">
                      <FormLabel className="capitalize">
                        {feature.replace(/([A-Z])/g, ' $1')}
                      </FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-gradient-to-t data-[state=checked]:from-green-600/70 data-[state=checked]:to-green-800 data-[state=unchecked]:bg-gray-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Limits */}
          <div>
            <h3 className="text-xl font-medium mb-4">Usage Limits</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                'serviceMax',
                'productMax',
                'highlightOfferMax',
                'transactionFee',
              ].map((limit) => (
                <FormField
                  key={limit}
                  control={form.control}
                  name={`limits.${limit}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        {limit.replace(/([A-Z])/g, ' $1')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="bg-[#f5f5f5] py-6 border rounded-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Validity */}
          <div>
            <h3 className="text-xl font-medium mb-4">Plan Validity</h3>
            <FormField
              control={form.control}
              name="validity.type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      className="grid grid-cols-2 lg:grid-cols-5 gap-4"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {[
                        'unlimited',
                        '1month',
                        '3month',
                        '6month',
                        'custom',
                      ].map((val) => (
                        <div
                          key={val}
                          className="flex items-center space-x-2 border p-4 rounded-sm"
                        >
                          <RadioGroupItem value={val} id={val} />
                          <FormLabel htmlFor={val}>
                            {val === 'custom'
                              ? 'Add any (months)'
                              : val.replace('month', ' Month')}
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Custom months input */}
            {form.watch('validity.type') === 'custom' && (
              <FormField
                control={form.control}
                name="validity.durationInMonths"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter custom duration in months"
                        type="number"
                        value={field.value ?? ''} // <-- fix here
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="bg-[#f5f5f5] py-6 border rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Submit Button */}
            <AppButton
              className="text-gray-50 text-base p-6 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 mt-1"
              content={
                <div className="flex justify-center items-center space-x-2 uppercase">
                  <p>{isSubmitting ? 'Updating...' : 'Update'}</p>
                  <ArrowRight />
                </div>
              }
            />

            <div className="mt-1 cursor-pointer text-sm rounded-sm border-b-4 border-r-4 border-gray-800 bg-white text-gray-800 shadow-sm shadow-gray-500 hover:bg-gray-100 transition-all">
              <Link
                href={`/admin/manage-subscription`}
                className="flex w-full justify-center items-center space-x-2 font-semibold py-3"
              >
                <span className="uppercase text-base font-medium">Cancel</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditSubscription;
