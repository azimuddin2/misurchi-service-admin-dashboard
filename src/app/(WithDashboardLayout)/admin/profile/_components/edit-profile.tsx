'use client';

import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '@/components/shared/app-button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { PhoneInput } from '@/components/shared/phone-input';

const EditProfile = () => {
  const form = useForm({
    // resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
    } catch (error: any) {
      const message = error?.data?.message || error?.message;
      toast.error(message);
    }
  };

  return (
    <div className="font-sora max-w-4xl mx-auto pb-20">
      <h2 className=" text-center text-2xl font-medium py-2">
        Edit Your Profile
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Business Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    {...field}
                    value={field.value || ''}
                    className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    {...field}
                    value={field.value || ''}
                    className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <PhoneInput
                    // @ts-ignore
                    value={field.value || ''}
                    onChange={field.onChange}
                    international
                    defaultCountry="US"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <AppButton
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold">
                <p className="uppercase">
                  {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                </p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default EditProfile;
