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
<<<<<<< HEAD
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
=======
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import { TSupport } from '@/types/support.type';
import { useUpdateSupportMessageMutation } from '@/redux/features/support/supportApi';
import { Textarea } from '@/components/ui/textarea';

interface SupportReplyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetch?: () => void;
  supportData: TSupport | null;
}

<<<<<<< HEAD
const STATUS_OPTIONS = [
  'Pending',
  'Reviewed',
  'In Progress',
  'Resolved',
] as const;

const supportMessageSchema = z.object({
  messageReply: z.string().min(1, 'Reply message is required'),
  status: z.enum(['Pending', 'Reviewed', 'In Progress', 'Resolved'], {
    required_error: 'Status is required',
  }),
=======
// ✅ Validation schema
const supportMessageSchema = z.object({
  messageReply: z.string().min(1, 'Reply message is required'),
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
});

type FormValues = z.infer<typeof supportMessageSchema>;

const SupportReplyModal = ({
  isOpen,
  onOpenChange,
  refetch,
  supportData,
}: SupportReplyModalProps) => {
  const [replySupportMessage] = useUpdateSupportMessageMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(supportMessageSchema),
    defaultValues: {
      messageReply: '',
<<<<<<< HEAD
      status: 'Pending',
=======
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const toastId = toast.loading(
      'Replying to support message, please wait...',
    );
    try {
      const res = await replySupportMessage({
        id: supportData?._id as string,
        data,
      }).unwrap();

      toast.success(res.message || 'Support message replied successfully!');
      form.reset();
      onOpenChange(false);
      refetch?.();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          'Failed to reply to the support message. Please try again later.',
      );
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-medium text-xl">
            Reply Message
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
<<<<<<< HEAD
            {/* User Info */}
            <div>
              <div className="flex items-center">
                <div className="w-1/2">
                  <h2 className="text-base text-gray-500">First Name</h2>
                  <p>{supportData?.firstName}</p>
                </div>
                <div className="w-1/2">
=======
            <div>
              <div className="flex items-center">
                <div className=" w-1/2">
                  <h2 className="text-base text-gray-500">First Name</h2>
                  <p>{supportData?.firstName}</p>
                </div>
                <div className=" w-1/2">
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
                  <h2 className="text-base text-gray-500">Last Name</h2>
                  <p>{supportData?.lastName}</p>
                </div>
              </div>
              <p className="mt-3">
<<<<<<< HEAD
                <span className="text-base text-gray-500">Email Address</span>
=======
                <span className="text-base text-gray-500">Email Address</span>{' '}
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
                <br />
                <span>{supportData?.email}</span>
              </p>
              <p className="mt-3">
<<<<<<< HEAD
                <span className="text-base text-gray-500">Message</span>
                <br />
                <span className="text-sm">{supportData?.message}</span>
              </p>
            </div>

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-sm font-medium">
                    Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#f5f5f5] border-none rounded-sm text-sm text-gray-700 w-full">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Reply Field */}
=======
                <span className="text-base text-gray-500">Message</span> <br />
                <span>{supportData?.message}</span>
              </p>
            </div>

>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
            <FormField
              control={form.control}
              name="messageReply"
              render={({ field }) => (
                <FormItem>
<<<<<<< HEAD
                  <FormLabel className="!text-gray-700 !text-sm font-medium">
=======
                  <FormLabel className="!text-gray-700 !text-sm font-medium mt-5">
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
                    Message Reply
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={12}
                      className="bg-[#f5f5f5] py-3 px-3 border-none rounded-sm w-full h-28"
                      placeholder="Add Reply..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<<<<<<< HEAD
            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-2">
=======
            <div className="flex justify-between items-center gap-2">
              {/* Submit Button */}
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
              <AppButton
                className="w-1/2 mt-2 text-gray-50 text-base p-5 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
                content={
                  <div className="flex justify-center items-center space-x-2 uppercase">
<<<<<<< HEAD
                    <p>{isSubmitting ? 'Submitting...' : 'Submit'}</p>
=======
                    <p>{isSubmitting ? 'Submting...' : 'Submit'}</p>
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
                    <ArrowRight />
                  </div>
                }
              />
<<<<<<< HEAD
=======
              {/* Cancel Button */}
>>>>>>> 173cd23b53f4a53f3949ae9d8693801e227f8a0c
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

export default SupportReplyModal;
