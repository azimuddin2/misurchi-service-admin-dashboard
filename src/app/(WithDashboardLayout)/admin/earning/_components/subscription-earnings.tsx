'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { ADTable } from '@/components/modules/ADTable';
import { useCallback, useEffect, useState } from 'react';
import ADPagination from '@/components/modules/ADPagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

type TSubscriptionEarning = {
  _id: string;
  providerName: string;
  accountType: 'Service Provider' | string;
  subscriptionType: 'Basic' | 'Advance' | string;
  amount: number;
  purchaseDate: string; // ISO date string
};

const SubscriptionEarnings = () => {
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

  const subscriptionEarnings = [
    {
      _id: '6898450e79b2ffe0fb906e21',
      providerName: 'Netflix',
      accountType: 'Service Provider',
      subscriptionType: 'Basic',
      amount: 15.99,
      purchaseDate: '2025-08-01',
    },
    {
      _id: '6898450e79b2ffe0fb906e22',
      providerName: 'Spotify',
      accountType: 'Service Provider',
      subscriptionType: 'Advance',
      amount: 99.99,
      purchaseDate: '2025-07-10',
    },
    {
      _id: '6898450e79b2ffe0fb906e23',
      providerName: 'Adobe Creative Cloud',
      accountType: 'Service Provider',
      subscriptionType: 'Basic',
      amount: 52.99,
      purchaseDate: '2025-06-20',
    },
    {
      _id: '6898450e79b2ffe0fb906e24',
      providerName: 'Microsoft 365',
      accountType: 'Service Provider',
      subscriptionType: 'Advance',
      amount: 69.99,
      purchaseDate: '2025-05-15',
    },
    {
      _id: '6898450e79b2ffe0fb906e21',
      providerName: 'Netflix',
      accountType: 'Service Provider',
      subscriptionType: 'Basic',
      amount: 15.99,
      purchaseDate: '2025-08-01',
    },
    {
      _id: '6898450e79b2ffe0fb906e22',
      providerName: 'Spotify',
      accountType: 'Service Provider',
      subscriptionType: 'Advance',
      amount: 99.99,
      purchaseDate: '2025-07-10',
    },
    {
      _id: '6898450e79b2ffe0fb906e23',
      providerName: 'Adobe Creative Cloud',
      accountType: 'Service Provider',
      subscriptionType: 'Basic',
      amount: 52.99,
      purchaseDate: '2025-06-20',
    },
    {
      _id: '6898450e79b2ffe0fb906e24',
      providerName: 'Microsoft 365',
      accountType: 'Service Provider',
      subscriptionType: 'Advance',
      amount: 69.99,
      purchaseDate: '2025-05-15',
    },
    {
      _id: '6898450e79b2ffe0fb906e23',
      providerName: 'Adobe Creative Cloud',
      accountType: 'Service Provider',
      subscriptionType: 'Basic',
      amount: 52.99,
      purchaseDate: '2025-06-20',
    },
    {
      _id: '6898450e79b2ffe0fb906e24',
      providerName: 'Microsoft 365',
      accountType: 'Service Provider',
      subscriptionType: 'Advance',
      amount: 69.99,
      purchaseDate: '2025-05-15',
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
  const columns: ColumnDef<TSubscriptionEarning>[] = [
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
      accessorKey: 'providerName',
      header: 'Provider Name',
      cell: ({ row }) => <span>{row.original.providerName}</span>,
    },
    {
      accessorKey: 'accountType',
      header: 'Account Type',
      cell: ({ row }) => <span>{row.original.accountType}</span>,
    },
    {
      accessorKey: 'subscriptionType',
      header: 'Subscription Type',
      cell: ({ row }) => <span>{row.original.subscriptionType}</span>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <span>${row.original.amount}</span>,
    },
    {
      accessorKey: 'purchaseDate',
      header: 'Purchase Date',
      cell: ({ row }) =>
        format(new Date(row.original.purchaseDate), 'dd MMM, yyyy'),
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

      <div>
        <ADTable columns={columns} data={subscriptionEarnings || []} />
      </div>
      <ADPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default SubscriptionEarnings;
