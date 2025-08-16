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

type TRefer = {
  _id: string;
  name: string;
  referralCode: string;
  totalReferred: number;
  points: number;
};

const ReferEarn = () => {
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
      _id: 'r1',
      name: 'Azim Uddin',
      referralCode: 'REF-AZIM01',
      totalReferred: 5,
      points: 150,
    },
    {
      _id: 'r2',
      name: 'John Doe',
      referralCode: 'REF-JOHN02',
      totalReferred: 3,
      points: 90,
    },
    {
      _id: 'r3',
      name: 'Emily Smith',
      referralCode: 'REF-EMI03',
      totalReferred: 8,
      points: 240,
    },
    {
      _id: 'r4',
      name: 'Michael Brown',
      referralCode: 'REF-MIKE04',
      totalReferred: 2,
      points: 60,
    },
    {
      _id: 'r5',
      name: 'Sophia Johnson',
      referralCode: 'REF-SOPH05',
      totalReferred: 6,
      points: 180,
    },
    {
      _id: 'r6',
      name: 'David Wilson',
      referralCode: 'REF-DAVE06',
      totalReferred: 1,
      points: 30,
    },
    {
      _id: 'r7',
      name: 'Olivia Martinez',
      referralCode: 'REF-OLIV07',
      totalReferred: 4,
      points: 120,
    },
    {
      _id: 'r8',
      name: 'Liam Anderson',
      referralCode: 'REF-LIAM08',
      totalReferred: 7,
      points: 210,
    },
    {
      _id: 'r9',
      name: 'Emma Davis',
      referralCode: 'REF-EMMA09',
      totalReferred: 3,
      points: 90,
    },
    {
      _id: 'r10',
      name: 'Daniel Thomas',
      referralCode: 'REF-DANI10',
      totalReferred: 5,
      points: 150,
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
  const columns: ColumnDef<TRefer>[] = [
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
      accessorKey: 'referralCode',
      header: 'Referral Code',
      cell: ({ row }) => <span>{row.original.referralCode}</span>,
    },
    {
      accessorKey: 'totalReferred',
      header: 'Total Referred',
      cell: ({ row }) => <span>{row.original.totalReferred} Users</span>,
    },
    {
      accessorKey: 'points',
      header: 'Total points',
      cell: ({ row }) => <span>{row.original.points}</span>,
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

export default ReferEarn;
