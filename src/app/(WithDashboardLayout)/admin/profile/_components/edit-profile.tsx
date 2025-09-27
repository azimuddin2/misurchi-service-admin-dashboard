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
import { AppButton } from '@/components/shared/app-button';
import { toast } from 'sonner';
import { PhoneInput } from '@/components/shared/phone-input';
import { IUser } from '@/types';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useUpdateUserProfileMutation } from '@/redux/features/user/userApi';

type Props = {
  userData: IUser | undefined;
  imageFile: File;
};

const EditProfile = ({ userData, imageFile }: Props) => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  // Reset form values when vendorUser is available
  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
    }
  }, [userData, form]);

  const {
    formState: { isSubmitting },
  } = form;

  const [updateUserProfile] = useUpdateUserProfileMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data)); //✅Backend expects JSON string

    formData.append('profile', imageFile); //✅Append multiple images

    const toastId = toast.loading('Updateing Profile...');
    try {
      const res = await updateUserProfile({
        email: email,
        body: formData,
      }).unwrap();
      toast.success(res.message || 'Profile update successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="font-sora max-w-4xl mx-auto pb-20">
      <h2 className=" text-center text-2xl font-medium py-2">
        Edit Your Profile
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="First Name"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name  */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Last Name"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                    disabled
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
