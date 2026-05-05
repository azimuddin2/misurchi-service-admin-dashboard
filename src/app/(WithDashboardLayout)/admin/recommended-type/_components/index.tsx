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
import { Edit, PlusCircle, Search, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/shared/Spinner';
import { TRecommendedType } from '@/types/recommended.type';
import {
  useDeleteRecommendedTypeMutation,
  useGetAllRecommendedTypeQuery,
} from '@/redux/features/recommendedType/recommendedTypeApi';
import { ADTable } from '@/components/modules/ADTable';
import ADPagination from '@/components/modules/ADPagination';
import DeleteConfirmationModal from '@/components/shared/delete-confirmation-modal';
import AddRecommendedTypeModal from './add-recommended-type-modal';
import UpdateRecommendedTypeModal from './update-recommended-type-modal';

const RecommendedType = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Separate states
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const [updateData, setUpdateData] = useState<TRecommendedType | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search & Date states
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

  const { data, isLoading, refetch } = useGetAllRecommendedTypeQuery({
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const recommendedTypes = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  const [deleteRecommendedType] = useDeleteRecommendedTypeMutation();

  // 🔎 Update search params
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
      createdAt: date ? format(date, 'yyyy-MM-dd') : null,
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

  // 🗑 Delete handlers
  const handleDelete = (data: TRecommendedType) => {
    setSelectedId(data?._id);
    setSelectedItem(data?.name);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedId) return;
    const toastId = toast.loading('Deleting recommended type...');
    try {
      const res = await deleteRecommendedType(selectedId).unwrap();
      toast.success(res.message || 'Recommended type deleted successfully');
      setDeleteModalOpen(false);
      setSelectedId(null);
      setSelectedItem(null);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete recommended type');
    } finally {
      toast.dismiss(toastId);
    }
  };

  // 📊 Table columns
  const columns: ColumnDef<TRecommendedType>[] = [
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
      header: 'Recommended Type',
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => (
        <p>{format(new Date(row.original.createdAt), 'dd MMM, yyyy')}</p>
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
                  onClick={() => {
                    setUpdateData(row.original);
                    setUpdateModalOpen(true);
                  }}
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

  if (isLoading) return <Spinner />;

  return (
    <div>
      {/* ➕ Add Recommended Type Button */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="w-full flex items-center justify-center text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80 p-3 cursor-pointer text-sm mt-2 shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500"
      >
        <PlusCircle size={22} />
        <span className="uppercase text-sm font-semibold ml-1">
          Add new recommended type
        </span>
      </button>

      {/* 🔎 Search + Date Filter */}
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5">
        <div className="relative w-full lg:w-3/5">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recommended type..."
            className="border px-4 py-6 pr-12 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="absolute top-1/2 right-0 -translate-y-1/2 px-3 py-3 bg-[#165940] text-white rounded cursor-pointer"
          >
            <Search />
          </button>
        </div>

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

      {/* 📋 Header */}
      <div className="flex justify-between items-center mt-6 mb-2">
        <h2 className="text-xl font-medium">Manage Recommended Type</h2>
      </div>

      {/* 📊 Table & Pagination */}
      <ADTable columns={columns} data={recommendedTypes || []} />

      {recommendedTypes.length > 0 && (
        <ADPagination totalPage={meta?.totalPage} />
      )}

      {/* ➕ Add Recommended Type Modal */}
      <AddRecommendedTypeModal
        isOpen={isAddModalOpen}
        onOpenChange={setAddModalOpen}
        refetch={refetch}
      />

      {/* Update Recommended Type Modal  */}
      <UpdateRecommendedTypeModal
        isOpen={isUpdateModalOpen}
        onOpenChange={setUpdateModalOpen}
        refetch={refetch}
        recommendedTypeData={updateData}
      />

      {/* 🗑 Delete Modal */}
      <DeleteConfirmationModal
        name={selectedItem}
        isOpen={isDeleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default RecommendedType;
