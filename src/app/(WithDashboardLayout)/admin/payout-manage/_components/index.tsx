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

type TPayout = {
  _id: string;
  name: string;
  availableBalance: string;
  method: string;
  requestDate: string;
  status: 'Pending' | 'Reject' | 'Paid';
};

const PayoutManage = () => {
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
      _id: '1',
      name: 'Azim Uddin',
      availableBalance: '120.50',
      method: 'PayPal',
      requestDate: '2025-08-01',
      status: 'Pending',
    },
    {
      _id: '2',
      name: 'John Doe',
      availableBalance: '450.00',
      method: 'Bank Transfer',
      requestDate: '2025-07-30',
      status: 'Paid',
    },
    {
      _id: '3',
      name: 'Emily Smith',
      availableBalance: '75.20',
      method: 'Payoneer',
      requestDate: '2025-07-28',
      status: 'Reject',
    },
    {
      _id: '4',
      name: 'Michael Brown',
      availableBalance: '600.75',
      method: 'PayPal',
      requestDate: '2025-07-25',
      status: 'Paid',
    },
    {
      _id: '5',
      name: 'Sophia Johnson',
      availableBalance: '250.00',
      method: 'Stripe',
      requestDate: '2025-07-20',
      status: 'Pending',
    },
    {
      _id: '6',
      name: 'David Wilson',
      availableBalance: '900.10',
      method: 'Bank Transfer',
      requestDate: '2025-07-18',
      status: 'Reject',
    },
    {
      _id: '7',
      name: 'Olivia Martinez',
      availableBalance: '150.40',
      method: 'Payoneer',
      requestDate: '2025-07-15',
      status: 'Pending',
    },
    {
      _id: '8',
      name: 'Liam Anderson',
      availableBalance: '300.00',
      method: 'Stripe',
      requestDate: '2025-07-12',
      status: 'Paid',
    },
    {
      _id: '9',
      name: 'Emma Davis',
      availableBalance: '720.30',
      method: 'PayPal',
      requestDate: '2025-07-10',
      status: 'Reject',
    },
    {
      _id: '10',
      name: 'Daniel Thomas',
      availableBalance: '50.00',
      method: 'Bank Transfer',
      requestDate: '2025-07-05',
      status: 'Pending',
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
  const columns: ColumnDef<TPayout>[] = [
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
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: 'availableBalance',
      header: 'Available Balance',
      cell: ({ row }) => <span>${row.original.availableBalance}</span>,
    },
    {
      accessorKey: 'method',
      header: 'Method',
      cell: ({ row }) => <span>{row.original.method}</span>,
    },
    {
      accessorKey: 'requestDate',
      header: 'Request Date',
      cell: ({ row }) =>
        format(new Date(row.original.requestDate), 'dd MMM, yyyy'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let statusColor = 'text-gray-600 bg-gray-100'; // default

        if (status === 'Pending') statusColor = 'text-yellow-600 bg-yellow-100';
        if (status === 'Paid') statusColor = 'text-green-600 bg-green-100';
        if (status === 'Reject') statusColor = 'text-red-600 bg-red-100';

        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
          >
            {status}
          </span>
        );
      },
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

export default PayoutManage;
