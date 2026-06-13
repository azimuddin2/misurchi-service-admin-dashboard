'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ADTable } from '@/components/modules/ADTable';
import { useCallback, useEffect, useState } from 'react';
import ADPagination from '@/components/modules/ADPagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useGetVendorReferralDetailQuery } from '@/redux/features/referral/referralApi';
import Spinner from '@/components/shared/Spinner';

type TReferDetail = {
  serial: number;
  referredUser: string;
  dateJoined: string;
  status: string;
  reward: string;
};

const VendorReferralDetail = ({ vendorId }: { vendorId: string }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState<string>(
    searchParams.get('searchTerm') || '',
  );

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;

  // ✅ Real API
  const { data, isLoading } = useGetVendorReferralDetailQuery({
    vendorId,
    page,
    limit,
  });

  const referrals = data?.data || [];
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

  useEffect(() => {
    setSearch(searchParams.get('searchTerm') || '');
  }, [searchParams]);

  const columns: ColumnDef<TReferDetail>[] = [
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
          onCheckedChange={(value) => row.toggleSelected(!!value)}
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
      accessorKey: 'referredUser',
      header: 'Referred User',
      cell: ({ row }) => <span>{row.original.referredUser}</span>,
    },
    {
      accessorKey: 'dateJoined',
      header: 'Date Joined',
      cell: ({ row }) => <span>{row.original.dateJoined}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.status === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: 'reward',
      header: 'Reward',
      cell: ({ row }) => (
        <span
          className={
            row.original.reward === '$0'
              ? 'text-gray-400'
              : 'text-green-600 font-semibold'
          }
        >
          {row.original.reward}
        </span>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Search
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
            </div> */}

      <ADTable columns={columns} data={referrals} />
      {referrals?.length > 1 && <ADPagination totalPage={meta?.totalPage} />}
    </div>
  );
};

export default VendorReferralDetail;
