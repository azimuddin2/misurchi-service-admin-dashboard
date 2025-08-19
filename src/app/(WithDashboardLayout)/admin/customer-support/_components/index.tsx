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

type TContact = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  date: string;
};

const CustomerSupport = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  // const page = searchParams.get('page') || 1;
  // const limit = searchParams.get('limit') || 10;
  // const searchTerm = searchParams.get('searchTerm') || '';
  // const createdAt = searchParams.get('createdAt') || '';

  // const { data, isLoading, refetch } = useGetAllUsersQuery({
  //     page,
  //     limit,
  //     query: {
  //         searchTerm,
  //         createdAt,
  //     },
  // });

  // const users = data?.data || [];
  // const meta = data?.meta || { totalPage: 1 };

  const payouts = [
    {
      _id: 'c1',
      firstName: 'James',
      lastName: 'Anderson',
      email: 'james.anderson@example.com',
      date: '2025-07-01T09:15:00.000Z',
    },
    {
      _id: 'c2',
      firstName: 'Sophia',
      lastName: 'Martinez',
      email: 'sophia.martinez@example.com',
      date: '2025-07-02T10:45:00.000Z',
    },
    {
      _id: 'c3',
      firstName: 'Liam',
      lastName: 'Walker',
      email: 'liam.walker@example.com',
      date: '2025-07-03T14:30:00.000Z',
    },
    {
      _id: 'c4',
      firstName: 'Olivia',
      lastName: 'Brown',
      email: 'olivia.brown@example.com',
      date: '2025-07-04T16:20:00.000Z',
    },
    {
      _id: 'c5',
      firstName: 'Ethan',
      lastName: 'Harris',
      email: 'ethan.harris@example.com',
      date: '2025-07-05T11:10:00.000Z',
    },
    {
      _id: 'c6',
      firstName: 'Ava',
      lastName: 'Wilson',
      email: 'ava.wilson@example.com',
      date: '2025-07-06T13:55:00.000Z',
    },
    {
      _id: 'c7',
      firstName: 'Noah',
      lastName: 'Taylor',
      email: 'noah.taylor@example.com',
      date: '2025-07-07T08:40:00.000Z',
    },
    {
      _id: 'c8',
      firstName: 'Mia',
      lastName: 'Clark',
      email: 'mia.clark@example.com',
      date: '2025-07-08T15:05:00.000Z',
    },
    {
      _id: 'c9',
      firstName: 'William',
      lastName: 'Hall',
      email: 'william.hall@example.com',
      date: '2025-07-09T12:25:00.000Z',
    },
    {
      _id: 'c10',
      firstName: 'Isabella',
      lastName: 'Scott',
      email: 'isabella.scott@example.com',
      date: '2025-07-10T17:45:00.000Z',
    },
  ];
  const meta = { totalPage: 1 };

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
  const columns: ColumnDef<TContact>[] = [
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
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => format(new Date(row.original.date), 'dd MMM, yyyy'),
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
        <ADTable columns={columns} data={payouts || []} />
      </div>
      <ADPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default CustomerSupport;
