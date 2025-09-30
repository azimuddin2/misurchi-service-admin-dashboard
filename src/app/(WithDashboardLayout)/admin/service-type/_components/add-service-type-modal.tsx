'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import { useAddServiceTypeMutation } from '@/redux/features/serviceType/serviceTypeApi';

interface AddServiceTypeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetch?: () => void;
}

// ✅ Validation schema
const serviceTypeSchema = z.object({
  name: z.string().min(1, 'Service type name is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof serviceTypeSchema>;

const AddServiceTypeModal = ({
  isOpen,
  onOpenChange,
  refetch,
}: AddServiceTypeModalProps) => {
  const [addServiceType] = useAddServiceTypeMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: {
      name: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const toastId = toast.loading('Adding service type...');
    try {
      const res = await addServiceType(data).unwrap();
      toast.success(res.message || 'Service type added successfully');
      form.reset();
      onOpenChange(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add service type');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-medium text-xl">
            Add Service Type
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Service Type Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter service type name"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 text-base p-5 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 mt-5"
              content={
                <div className="flex justify-center items-center space-x-2 uppercase">
                  <p>{isSubmitting ? 'Saving...' : 'Save'}</p>
                  <ArrowRight />
                </div>
              }
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceTypeModal;
