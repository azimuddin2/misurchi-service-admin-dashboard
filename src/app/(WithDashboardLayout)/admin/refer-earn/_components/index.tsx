'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Eye, Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
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
import { useGetAllVendorReferralStatsQuery } from '@/redux/features/referral/referralApi';
import Spinner from '@/components/shared/Spinner';

type TRefer = {
  vendorId: string;
  name: string;
  referralCode: number;
  totalReferredUsers: number;
  totalPoints: number;
  serial: number;
};

const ReferEarn = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );

  const initialDateParam = searchParams.get('month');
  const [selectedMonth, setSelectedMonth] = useState<string>(
    initialDateParam || '',
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;
  const searchTerm = searchParams.get('searchTerm') || '';
  const month = searchParams.get('month') || '';

  const { data, isLoading } = useGetAllVendorReferralStatsQuery({
    page,
    limit,
    searchTerm,
    month,
  });

  const vendors = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

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

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
    updateSearchParams({ month: month || null, page: '1' });
  };

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
    setSelectedMonth(searchParams.get('month') || '');
  }, [searchParams]);

  const handleView = (vendorId: string) => {
    router.push(`/admin/refer-earn/${vendorId}`);
  };

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
                ? [...prev, row.original.vendorId]
                : prev.filter((id) => id !== row.original.vendorId),
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
      cell: ({ row }) => String(row.original.serial).padStart(2, '0'),
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
      accessorKey: 'totalReferredUsers',
      header: 'Total Referred',
      cell: ({ row }) => <span>{row.original.totalReferredUsers}</span>,
    },
    {
      accessorKey: 'totalPoints',
      header: 'Total Points',
      cell: ({ row }) => <span>{row.original.totalPoints}</span>,
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
                  onClick={() => handleView(row.original.vendorId)}
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
      {/* Search + Month Filter */}
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

        {/* Month Picker */}
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => handleMonthSelect(e.target.value)}
          className="px-4 py-2 border rounded lg:w-2/5"
        />
      </div>

      <ADTable columns={columns} data={vendors} />
      {vendors?.length > 1 && <ADPagination totalPage={meta?.totalPage} />}
    </div>
  );
};

export default ReferEarn;
