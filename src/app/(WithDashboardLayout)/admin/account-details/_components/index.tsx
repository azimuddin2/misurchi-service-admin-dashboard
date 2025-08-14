'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Search, ShieldBan } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { IUser } from '@/types';
import { ADTable } from '@/components/modules/ADTable';
import { useCallback, useEffect, useState } from 'react';
import ADPagination from '@/components/modules/ADPagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

const AccountDetails = () => {
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

  // TODO: Sending `users` and `meta` data to backend
  const users = [
    {
      _id: '66b8a9f3d2a1c1a1e8a00001',
      fullName: 'Azim Uddin',
      email: 'azim@example.com',
      role: 'admin',
      isDeleted: false,
      createdAt: '2025-08-01T10:15:30Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00002',
      fullName: 'Sarah Khan',
      email: 'sarah.khan@example.com',
      role: 'vendor',
      isDeleted: false,
      createdAt: '2025-07-28T14:20:00Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00003',
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      role: 'user',
      isDeleted: true,
      createdAt: '2025-07-15T09:45:10Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00004',
      fullName: 'Emily Brown',
      email: 'emily.brown@example.com',
      role: 'vendor',
      isDeleted: false,
      createdAt: '2025-06-30T18:05:45Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00005',
      fullName: 'Michael Lee',
      email: 'michael.lee@example.com',
      role: 'user',
      isDeleted: false,
      createdAt: '2025-06-20T11:25:00Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00006',
      fullName: 'Sophia Garcia',
      email: 'sophia.garcia@example.com',
      role: 'vendor',
      isDeleted: false,
      createdAt: '2025-06-10T07:50:30Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00001',
      fullName: 'Azim Uddin',
      email: 'azim@example.com',
      role: 'admin',
      isDeleted: false,
      createdAt: '2025-08-01T10:15:30Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00002',
      fullName: 'Sarah Khan',
      email: 'sarah.khan@example.com',
      role: 'vendor',
      isDeleted: false,
      createdAt: '2025-07-28T14:20:00Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00003',
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      role: 'user',
      isDeleted: true,
      createdAt: '2025-07-15T09:45:10Z',
    },
    {
      _id: '66b8a9f3d2a1c1a1e8a00004',
      fullName: 'Emily Brown',
      email: 'emily.brown@example.com',
      role: 'vendor',
      isDeleted: false,
      createdAt: '2025-06-30T18:05:45Z',
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
  const columns: ColumnDef<IUser>[] = [
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
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }) => <span>{row.original.fullName}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <span>{row.original.email}</span>,
    },
    {
      accessorKey: 'role',
      header: 'Account Type',
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.role === 'vendor'
            ? 'Service Provider'
            : row.original.role}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date & Time',
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), 'dd MMM, yyyy'),
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: () => (
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <ShieldBan
                  size={22}
                  className="text-[#FE5858] cursor-pointer hover:text-red-600"
                />
              </TooltipTrigger>
              <TooltipContent>Block</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  return (
    <div className="">
      {/* Search + Date Filter Section */}
      <div className="flex flex-col lg:justify-between lg:flex-row gap-4 mt-5 mb-5">
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

      <ADTable columns={columns} data={users || []} />
      <ADPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default AccountDetails;
