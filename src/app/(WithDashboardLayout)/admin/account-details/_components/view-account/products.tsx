'use client';

import { TProduct } from '@/types/product.type';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Search } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useGetAllProductsByUserQuery } from '@/redux/features/product/productApi';
import Spinner from '@/components/shared/Spinner';
import { ADTable } from '@/components/modules/ADTable';
import ADPagination from '@/components/modules/ADPagination';

type Props = {
  vendorId: string;
};

const Products = ({ vendorId }: Props) => {
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const { data, isLoading, refetch } = useGetAllProductsByUserQuery({
    vendorId,
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const products = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

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

  const columns: ColumnDef<TProduct>[] = [
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
      header: 'Product Name',
      cell: ({ row }) => {
        const { images, name } = row.original;
        const imageUrl = images?.[0]?.url || '/placeholder.png';
        console.log(imageUrl);
        return (
          <div className="flex items-start space-x-3">
            <Image
              src={imageUrl}
              alt={name}
              width={100}
              height={100}
              className="w-14 h-14 rounded-sm object-cover border"
            />
            <span className="truncate">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <span>{row.original.status}</span>,
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), 'dd MMM, yyyy'),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Eye
                  onClick={() =>
                    router.push(
                      `/${user?.role}/manage-offering/view-product/${row.original._id}`,
                    )
                  }
                  size={20}
                  className="text-blue-500 cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>View</TooltipContent>
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
      {/* Search + Date Filter Section */}
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5">
        <div className="relative w-full lg:w-3/5">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
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
      <div className="flex justify-between items-center mt-5 mb-2">
        {/* <h2 className="text-xl font-medium">Products</h2> */}
      </div>

      {/* Table & Pagination */}
      <ADTable columns={columns} data={products || []} />
      <ADPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default Products;
