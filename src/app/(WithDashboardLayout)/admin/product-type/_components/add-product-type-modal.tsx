'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { useAddProductTypeMutation } from '@/redux/features/productType/productTypeApi';

interface AddProductTypeModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    refetch?: () => void;
}

// ✅ Validation schema
const productTypeSchema = z.object({
    name: z.string().min(1, 'Product type name is required'),
    description: z.string().optional(),
});

type FormValues = z.infer<typeof productTypeSchema>;

const AddProductTypeModal = ({
    isOpen,
    onOpenChange,
    refetch,
}: AddProductTypeModalProps) => {
    const [addProductType, { isLoading }] = useAddProductTypeMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(productTypeSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const toastId = toast.loading('Adding product type...');
        try {
            const res = await addProductType(data).unwrap();
            toast.success(res.message || 'Product type added successfully');
            form.reset();
            onOpenChange(false);
            refetch?.();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to add product type');
        } finally {
            toast.dismiss(toastId);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center font-semibold text-xl">
                        Add Product Type
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
                                    <FormLabel className="!text-gray-700 !text-base font-medium">
                                        Product Type Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter product type name"
                                            className="bg-[#f5f5f5] py-3 px-4 border border-gray-300 rounded w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddProductTypeModal;
