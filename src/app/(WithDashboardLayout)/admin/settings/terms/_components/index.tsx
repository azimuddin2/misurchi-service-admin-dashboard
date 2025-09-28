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
  useAddTermsMutation,
  useGetTermsQuery,
} from '@/redux/features/terms/termsApi';
import Spinner from '@/components/shared/Spinner';

// -------------------- Validation Schema --------------------
const termsSchema = z.object({
  content: z
    .string({ required_error: 'Terms of use content is required' })
    .min(100, 'Terms of use content must be at least 100 characters'),
});

export default function TermsForm() {
  const form = useForm({
    resolver: zodResolver(termsSchema),
    defaultValues: { content: '' },
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  // Fetch existing terms
  const { data: termsData, isLoading } = useGetTermsQuery();

  useEffect(() => {
    if (termsData?.data?.content) {
      setValue('content', termsData.data.content);
    }
  }, [termsData, setValue]);

  const [AddTerms] = useAddTermsMutation();

  // -------------------- Submit --------------------
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading('Saving terms...');
    try {
      const res = await AddTerms(data).unwrap();
      toast.success(res.message || 'Terms saved successfully');
      console.log('Submitted Data:', data);
    } catch {
      toast.error('Failed to save terms');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="rounded max-w-7xl">
      <h2 className="text-xl font-medium mb-3 ml-1">Terms of Use</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Reusable Text Editor */}
          <TextEditor
            name="content"
            control={control}
            placeholder="Write Terms..."
            minHeight={600}
          />

          {/* Submit Button */}
          <AppButton
            type="submit"
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
