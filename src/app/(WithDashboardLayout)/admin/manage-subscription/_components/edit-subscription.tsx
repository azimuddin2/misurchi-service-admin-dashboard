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
import z from 'zod';

type Props = {
  id: string;
};

const EditSubscription = ({ id }: Props) => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const { data, isLoading } = useGetSubscriptionPlanByIdQuery(id);
  const plan = data?.data;

  const [updatePlan] = useUpdateSubscriptionPlanMutation();

  // Infer the TypeScript type from Zod
  type CreatePlanFormValues = z.infer<typeof createPlanValidationSchema>;

  const form = useForm<CreatePlanFormValues>({
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
      validity: '1month', // ✅ now TypeScript knows this is a valid TValidityType
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
        limits: {
          serviceMax:
            plan.limits.serviceMax === 'unlimited'
              ? 'unlimited'
              : Number(plan.limits.serviceMax),
          productMax:
            plan.limits.productMax === 'unlimited'
              ? 'unlimited'
              : Number(plan.limits.productMax),
          highlightOfferMax: Number(plan.limits.highlightOfferMax),
          transactionFee: Number(plan.limits.transactionFee),
        },
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

  const serviceMaxValue = form.watch('limits.serviceMax');
  const productMaxValue = form.watch('limits.productMax');
  const isServiceUnlimited = serviceMaxValue === 'unlimited';
  const isProductUnlimited = productMaxValue === 'unlimited';

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
                    <FormLabel className="!text-gray-700 !text-sm font-medium">
                      Plan Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Basic Plan"
                        {...field}
                        value={field.value || ''}
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
                        value={field.value || 0}
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
                      rows={16}
                      className="bg-[#f5f5f5] py-3 px-3 border-none rounded-sm w-full h-28"
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
                          className={`
            data-[state=checked]:bg-gradient-to-t 
            data-[state=checked]:from-green-600/70 
            data-[state=checked]:to-green-800
            data-[state=unchecked]:bg-gray-300
          `}
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
              {/* SERVICE MAX */}
              <FormField
                control={form.control}
                name="limits.serviceMax"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="capitalize">Service Max</FormLabel>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Unlimited</span>
                        <Switch
                          checked={isServiceUnlimited}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? 'unlimited' : 0);
                          }}
                          className="
                  data-[state=checked]:bg-gradient-to-t 
                  data-[state=checked]:from-green-600/70 
                  data-[state=checked]:to-green-800
                  data-[state=unchecked]:bg-gray-300
                "
                        />
                      </div>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isServiceUnlimited}
                        value={
                          isServiceUnlimited ? '' : Number(field.value) || 0
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder={isServiceUnlimited ? 'Unlimited' : ''}
                        className="bg-[#f5f5f5] py-6 border rounded-sm disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* PRODUCT MAX */}
              <FormField
                control={form.control}
                name="limits.productMax"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="capitalize">Product Max</FormLabel>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Unlimited</span>
                        <Switch
                          checked={isProductUnlimited}
                          onCheckedChange={(checked) => {
                            field.onChange(checked ? 'unlimited' : 0);
                          }}
                          className="
                  data-[state=checked]:bg-gradient-to-t 
                  data-[state=checked]:from-green-600/70 
                  data-[state=checked]:to-green-800
                  data-[state=unchecked]:bg-gray-300
                "
                        />
                      </div>
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isProductUnlimited}
                        value={
                          isProductUnlimited ? '' : Number(field.value) || 0
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder={isProductUnlimited ? 'Unlimited' : ''}
                        className="bg-[#f5f5f5] py-6 border rounded-sm disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HIGHLIGHT OFFER MAX & TRANSACTION FEE - same as before */}
              {['highlightOfferMax', 'transactionFee'].map((limit) => (
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
                          value={field.value || 0}
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
          <FormField
            control={form.control}
            name="validity"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    className="grid grid-cols-3 gap-4"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <div className="flex items-center space-x-2 border p-4 rounded-sm">
                      <RadioGroupItem value="free" id="free" />
                      <FormLabel htmlFor="free">Free</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-sm">
                      <RadioGroupItem value="1month" id="1month" />
                      <FormLabel htmlFor="1month">1 Month</FormLabel>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-sm">
                      <RadioGroupItem value="1year" id="1year" />
                      <FormLabel htmlFor="1year">1 Year</FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <AppButton
            className="w-full text-gray-50 text-base p-6 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 mt-1"
            content={
              <div className="flex justify-center items-center space-x-2 uppercase">
                <p>{isSubmitting ? 'Saving...' : 'Save'}</p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default EditSubscription;
