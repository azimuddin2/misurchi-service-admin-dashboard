'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { AppButton } from '@/components/shared/app-button';
import { TextEditor } from '@/components/shared/text-editor';
import { toast } from 'sonner';
import {
  useAddPrivacyMutation,
  useGetPrivacyQuery,
} from '@/redux/features/privacy/privacyApi';
import Spinner from '@/components/shared/Spinner';

// -------------------- Validation Schema --------------------
const privacySchema = z.object({
  content: z
    .string({ required_error: 'Privacy Policy content is required' })
    .min(100, 'Privacy Policy content must be at least 100 characters'),
});

export default function PrivacyPolicyForm() {
  const form = useForm({
    resolver: zodResolver(privacySchema),
    defaultValues: { content: '' },
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Fetch existing privacy
  const { data: privacyData, isLoading } = useGetPrivacyQuery();

  useEffect(() => {
    if (privacyData?.data?.content) {
      setValue('content', privacyData.data.content);
    }
  }, [privacyData, setValue]);

  const [AddPrivacy] = useAddPrivacyMutation();

  // -------------------- Submit --------------------
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading('Saving privacy policy...');
    try {
      const res = await AddPrivacy(data).unwrap();
      toast.success(res.message || 'Privacy Policy saved successfully');
      console.log('Submitted Data:', data);
    } catch (err) {
      toast.error('Failed to save Privacy Policy');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="rounded max-w-7xl">
      <h2 className="text-xl font-medium mb-3 ml-1">Privacy Policy</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Reusable Text Editor */}
          <TextEditor
            name="content"
            control={control}
            placeholder="Write Privacy Policy..."
            minHeight={600}
          />

          {/* Submit Button */}
          <AppButton
            disabled={isSubmitting}
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 m-0"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold">
                <p className="uppercase">
                  {isSubmitting ? 'Saving...' : 'Save Change'}
                </p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
}
