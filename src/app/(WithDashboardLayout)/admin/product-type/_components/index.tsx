'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, PlusCircle, Search, Trash2 } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { format, parseISO } from 'date-fns';
import { AppButton } from '@/components/shared/app-button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/shared/Spinner';
import Link from 'next/link';
import { TProductType } from '@/types/product.type';
import { useGetAllProductTypeQuery } from '@/redux/features/productType/productTypeApi';
import { ADTable } from '@/components/modules/ADTable';
import ADPagination from '@/components/modules/ADPagination';
import AddProductTypeModal from './add-product-type-modal';


const ProductType = () => {


    const user = useAppSelector(selectCurrentUser);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const [search, setSearch] = useState<string>(
        searchParams.get('searchTerm') || '',
    );
    const initialDateParam = searchParams.get('createdAt');
    const initialDate = initialDateParam ? parseISO(initialDateParam) : undefined;
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        initialDate,
    );

    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    const searchTerm = searchParams.get('searchTerm') || '';
    const createdAt = searchParams.get('createdAt') || '';

    const { data, isLoading, refetch } = useGetAllProductTypeQuery({
        page,
        limit,
        query: {
            searchTerm,
            createdAt,
        },
    });

    const productType = data?.data || [];
    const meta = data?.meta || { totalPage: 1 };

    // const [updateTaskStatus] = useUpdateTaskStatusMutation();
    // const [deleteTask] = useDeleteTaskMutation();

    // search & createdAt date filtering part
    const updateSearchParams = useCallback(
        (newParams: Record<string, string | null | undefined>) => {
            const currentParams = new URLSearchParams(searchParams.toString());
            Object.entries(newParams).forEach(([key, value]) => {
                if (!value) {
                    currentParams.delete(key);
                } else {
                    currentParams.set(key, value);
                }
            });
            router.push(`?${currentParams.toString()}`);
        },
        [router, searchParams],
    );

    const handleSearch = () => {
        updateSearchParams({ searchTerm: search, page: '1' });
    };

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        updateSearchParams({
            createdAt: date ? format(date, 'yyyy-MM-dd') : null, // Only send 'YYYY-MM-DD'
            page: '1',
        });
    };

    useEffect(() => {
        setSearch(searchParams.get('searchTerm') || '');

        const dateParam = searchParams.get('createdAt');
        if (dateParam) {
            setSelectedDate(parseISO(dateParam));
        } else {
            setSelectedDate(undefined);
        }
    }, [searchParams]);

    // API call here backend
    const handleDelete = (data: TProductType) => {
        setSelectedId(data?._id);
        setSelectedItem(data?.name);
        setModalOpen(true);
    };

    const handleStatusUpdate = async (taskId: string, status: string) => {
        const toastId = toast.loading('Updating status...');

        const updateStatus = { status };

        // try {
        //     const res = await updateTaskStatus({
        //         id: taskId,
        //         status: updateStatus,
        //     }).unwrap();

        //     console.log(res);

        //     toast.success(res.message || 'Status updated');
        //     refetch();
        // } catch (error: any) {
        //     toast.error(error?.data?.message || 'Status update failed');
        // } finally {
        //     toast.dismiss(toastId);
        // }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedId) return;

        const toastId = toast.loading('Deleting product...');

        // try {
        //     const res = await deleteTask(selectedId).unwrap();
        //     toast.success(res.message || 'Product deleted successfully');
        //     setModalOpen(false);
        //     setSelectedId(null);
        //     setSelectedItem(null);
        //     refetch(); // Refresh product list
        // } catch (error: any) {
        //     toast.error(error?.data?.message || 'Failed to delete product');
        // } finally {
        //     toast.dismiss(toastId);
        // }
    };

    const columns: ColumnDef<TProductType>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        setSelectedIds((prev) =>
                            value
                                ? [...prev, row.original._id]
                                : prev.filter((id) => id !== row.original._id),
                        );
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                />
            ),
        },
        {
            accessorKey: 'name',
            header: 'Service Type',
            cell: ({ row }) => <span>{row.original.name}</span>,
        },
        {
            accessorKey: 'createdAt',
            header: 'Date',
            cell: ({ row }) => (
                <div>
                    <p>{format(new Date(row.original.createdAt), 'dd MMM, yyyy')}</p>
                </div>
            ),
        },
        {
            accessorKey: 'action',
            header: 'Action',
            cell: ({ row }) => (
                <div className="flex items-center space-x-3">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Edit
                                    onClick={() =>
                                        router.push(
                                            `/${user?.role}/task-hub/update-task/${row.original._id}`,
                                        )
                                    }
                                    size={20}
                                    className="text-green-500 cursor-pointer"
                                />
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Trash2
                                    onClick={() => handleDelete(row.original)}
                                    size={20}
                                    className="text-red-500 cursor-pointer"
                                />
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            ),
        },
    ];

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <div>
                {/* Add Product Button */}

                <button
                    onClick={() => setModalOpen(true)}
                   className="w-full flex items-center justify-center text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80 p-3 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500"
                >
                    <PlusCircle size={22} />
                    <span className="uppercase text-sm font-semibold ml-1">Add new product type</span>
                </button>

                {/* Search + Date Filter Section */}
                <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5">
                    <div className="relative w-full lg:w-3/5">
                        <Input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search product type..."
                            className="border px-4 py-6 pr-12 rounded w-full"
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute top-1/2 right-0 -translate-y-1/2 px-3 py-3 bg-[#165940] text-white rounded cursor-pointer"
                        >
                            <Search />
                        </button>
                    </div>

                    {/* Date Picker */}
                    <input
                        type="date"
                        value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) =>
                            handleDateSelect(
                                e.target.value ? new Date(e.target.value) : undefined,
                            )
                        }
                        className="px-4 py-2 border rounded lg:w-2/5"
                    />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mt-6 mb-2">
                    <h2 className="text-xl font-medium">Manage Product Type</h2>
                </div>

                {/* Table & Pagination */}
                <div className='h-screen'>
                    <ADTable columns={columns} data={productType || []} />
                </div>

                {
                    productType.length > 0 && <ADPagination totalPage={meta?.totalPage} />
                }

                <AddProductTypeModal
                    isOpen={isModalOpen}
                    onOpenChange={setModalOpen}
                    refetch={refetch}
                />

                {/* Delete Modal */}
                {/* <DeleteConfirmationModal
                    name={selectedItem}
                    isOpen={isModalOpen}
                    onOpenChange={setModalOpen}
                    onConfirm={handleDeleteConfirm}
                /> */}
            </div>
        </div>
    );
};

export default ProductType;