'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ADTable } from '@/components/modules/ADTable';
import ADPagination from '@/components/modules/ADPagination';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  const page = searchParams.get('page') || 1;
  const limit = searchParams.get('limit') || 10;

  const { data, isLoading } = useGetVendorReferralDetailQuery({
    vendorId,
    page,
    limit,
  });

  const referrals = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

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
      <ADTable columns={columns} data={referrals} />
      {referrals?.length > 1 && <ADPagination totalPage={meta?.totalPage} />}
    </div>
  );
};

export default VendorReferralDetail;
