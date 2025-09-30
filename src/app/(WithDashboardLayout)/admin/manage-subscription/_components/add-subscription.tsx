'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

// ✅ Validation Schema
const createPlanValidationSchema = z.object({
  name: z.string().min(3, 'Plan name must be at least 3 characters'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  features: z.object({
    teamMembers: z.boolean(),
    sharedCalendar: z.boolean(),
    taskHub: z.boolean(),
    grantPermissionAccess: z.boolean(),
  }),
  limits: z.object({
    serviceMax: z.number(),
    productMax: z.number(),
    highlightOfferMax: z.number(),
    transactionFee: z.number(),
  }),
  validity: z.object({
    type: z.enum(['unlimited', '1month', '3month', 'custom']),
    durationInMonths: z.string().optional().nullable(),
  }),
});

type TPlanForm = z.infer<typeof createPlanValidationSchema>;

const AddSubscription = () => {
  const form = useForm<TPlanForm>({
    resolver: zodResolver(createPlanValidationSchema),
    defaultValues: {
      name: '',
      cost: 0,
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
        type: 'unlimited',
        durationInMonths: '',
      },
    },
  });

  const onSubmit = (data: TPlanForm) => {
    console.log('Plan Data:', data);
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white">
      <h2 className="text-2xl font-semibold mb-6">Subscription Plan</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Plan Info */}
          <div>
            <h3 className="text-xl font-medium mb-4">Plan Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Basic Plan"
                        {...field}
                        value={field.value || ''}
                        className="bg-[#f5f5f5] py-6 border rounded-md"
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
                        className="bg-[#f5f5f5] py-6 border rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl font-medium mb-4">Features & Permissions</h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(form.getValues('features')).map(([feature]) => (
                <FormField
                  key={feature}
                  control={form.control}
                  name={`features.${feature}` as any}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-md px-4 py-4 bg-[#f4f9fc]">
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
            <h3 className="text-xl font-semibold mb-4">Usage Limits</h3>
            <div className="grid grid-cols-2 gap-6">
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
                          value={field.value || 0}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          className="bg-[#f5f5f5] py-6 border rounded-md"
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
            <h3 className="text-lg font-semibold mb-4">Plan Validity</h3>
            <FormField
              control={form.control}
              name="validity.type"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      className="grid grid-cols-4 gap-4"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unlimited" id="unlimited" />
                        <FormLabel htmlFor="unlimited">Unlimited</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1month" id="1month" />
                        <FormLabel htmlFor="1month">1 Month</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3month" id="3month" />
                        <FormLabel htmlFor="3month">3 Month</FormLabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <FormLabel htmlFor="custom">Add any (months)</FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            {form.watch('validity.type') === 'custom' && (
              <FormField
                control={form.control}
                name="validity.durationInMonths"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormControl>
                      <Input
                        placeholder="Enter custom duration in months"
                        {...field}
                        value={field.value || ''}
                        className="bg-[#f5f5f5] py-6 border rounded-md"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-40 py-6 rounded-md"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-40 py-6 rounded-md bg-green-600">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddSubscription;
