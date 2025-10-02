'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { ADTable } from '@/components/modules/ADTable';
import { useCallback, useEffect, useState } from 'react';
import ADPagination from '@/components/modules/ADPagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGetAllSupportMessageQuery } from '@/redux/features/support/supportApi';
import { TSupport } from '@/types/support.type';
import Spinner from '@/components/shared/Spinner';
import SupportReplyModal from './support-reply-modal';

const CustomerSupport = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

  const [updateData, setUpdateData] = useState<TSupport | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

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

  const { data, isLoading, refetch } = useGetAllSupportMessageQuery({
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const supportMessages = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

  console.log(supportMessages);

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

  // Table columns
  const columns: ColumnDef<TSupport>[] = [
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
      id: 'serial',
      header: 'Serial',
      cell: ({ row }) => String(row.index + 1).padStart(2, '0'),
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: ({ row }) => <span>{row.original.firstName}</span>,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: ({ row }) => <span>{row.original.lastName}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span>{row.original.email}</span>,
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
                  onClick={() => {
                    setUpdateData(row.original); // save selected row data
                    setUpdateModalOpen(true); // open update modal
                  }}
                  size={22}
                  className="text-[#78C0A8] cursor-pointer hover:text-[#165940]"
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
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5 mb-5">
        <div className="relative w-full lg:w-3/5">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
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

      <div>
        <ADTable columns={columns} data={supportMessages || []} />
      </div>
      {supportMessages?.length > 0 && (
        <ADPagination totalPage={meta?.totalPage} />
      )}

      {/* Support Message Reply Type Modal  */}
      <SupportReplyModal
        isOpen={isUpdateModalOpen}
        onOpenChange={setUpdateModalOpen}
        refetch={refetch}
        supportData={updateData}
      />
    </div>
  );
};

export default CustomerSupport;
