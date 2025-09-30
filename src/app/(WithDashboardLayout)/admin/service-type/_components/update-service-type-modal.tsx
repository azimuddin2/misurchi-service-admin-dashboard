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
import { useEffect } from 'react';
import { TServiceType } from '@/types/service.type';
import { useUpdateServiceTypeMutation } from '@/redux/features/serviceType/serviceTypeApi';

interface AddServiceTypeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetch?: () => void;
  serviceTypeData: TServiceType | null;
}

// ✅ Validation schema
const serviceTypeSchema = z.object({
  name: z.string().min(1, 'Service type name is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof serviceTypeSchema>;

const UpdateServiceTypeModal = ({
  isOpen,
  onOpenChange,
  refetch,
  serviceTypeData,
}: AddServiceTypeModalProps) => {
  const [updateServiceType] = useUpdateServiceTypeMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(serviceTypeSchema),
    defaultValues: {
      name: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // preload form when data changes
  useEffect(() => {
    if (serviceTypeData) {
      form.reset({ name: serviceTypeData.name });
    }
  }, [serviceTypeData, form]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const toastId = toast.loading('Updating service type...');
    try {
      const res = await updateServiceType({
        id: serviceTypeData?._id as string,
        data,
      }).unwrap();
      toast.success(res.message || 'Service type updated successfully');
      form.reset();
      onOpenChange(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update service type');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-medium text-xl">
            Update Service Type
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
                <FormItem>
                  <FormLabel>Service Type Name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      placeholder="Enter service type name"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center gap-2">
              {/* Submit Button */}
              <AppButton
                className="w-1/2 mt-2 text-gray-50 text-base p-5 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
                content={
                  <div className="flex justify-center items-center space-x-2 uppercase">
                    <p>{isSubmitting ? 'Updating...' : 'Update'}</p>
                    <ArrowRight />
                  </div>
                }
              />
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="w-1/2 uppercase flex items-center justify-center text-black p-2 border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80 cursor-pointer text-base mt-2 shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500"
              >
                <p className="mr-1">Cancel</p>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateServiceTypeModal;
