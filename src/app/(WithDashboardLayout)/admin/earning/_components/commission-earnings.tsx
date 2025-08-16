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

type TCommissionEarnings = {
  _id: string;
  providerName: string;
  itemNumber: string;
  transactionPrice: number;
  commission: string;
  offerType: 'Service' | 'Product';
  transactionDate: string; // ISO date string
};

const CommissionEarnings = () => {
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

  const commissionEarnings = [
    {
      _id: '1',
      providerName: 'Netflix',
      itemNumber: 'NF-2025-001',
      transactionPrice: 15.99,
      commission: '10%',
      offerType: 'Service',
      transactionDate: '2025-08-01',
    },
    {
      _id: '2',
      providerName: 'Spotify',
      itemNumber: 'SP-2025-002',
      transactionPrice: 99.99,
      commission: '12%',
      offerType: 'Product',
      transactionDate: '2025-07-15',
    },
    {
      _id: '3',
      providerName: 'Adobe Creative Cloud',
      itemNumber: 'AD-2025-003',
      transactionPrice: 52.99,
      commission: '15%',
      offerType: 'Service',
      transactionDate: '2025-07-10',
    },
    {
      _id: '4',
      providerName: 'Microsoft 365',
      itemNumber: 'MS-2025-004',
      transactionPrice: 69.99,
      commission: '8%',
      offerType: 'Service',
      transactionDate: '2025-06-28',
    },
    {
      _id: '5',
      providerName: 'Amazon',
      itemNumber: 'AMZ-2025-005',
      transactionPrice: 120.0,
      commission: '5%',
      offerType: 'Product',
      transactionDate: '2025-06-15',
    },
    {
      _id: '6',
      providerName: 'eBay',
      itemNumber: 'EBY-2025-006',
      transactionPrice: 45.5,
      commission: '7%',
      offerType: 'Service',
      transactionDate: '2025-06-10',
    },
    {
      _id: '7',
      providerName: 'Shopify',
      itemNumber: 'SHP-2025-007',
      transactionPrice: 200.0,
      commission: '10%',
      offerType: 'Product',
      transactionDate: '2025-05-25',
    },
    {
      _id: '8',
      providerName: 'Udemy',
      itemNumber: 'UDM-2025-008',
      transactionPrice: 19.99,
      commission: '20%',
      offerType: 'Service',
      transactionDate: '2025-05-12',
    },
    {
      _id: '9',
      providerName: 'Apple',
      itemNumber: 'APL-2025-009',
      transactionPrice: 999.0,
      commission: '6%',
      offerType: 'Product',
      transactionDate: '2025-04-30',
    },
    {
      _id: '10',
      providerName: 'Google Cloud',
      itemNumber: 'GCP-2025-010',
      transactionPrice: 250.0,
      commission: '18%',
      offerType: 'Service',
      transactionDate: '2025-04-20',
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
  const columns: ColumnDef<TCommissionEarnings>[] = [
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
      accessorKey: 'itemNumber',
      header: 'Item Number',
      cell: ({ row }) => <span>{row.original.itemNumber}</span>,
    },
    {
      accessorKey: 'transactionPrice',
      header: 'Transaction Price',
      cell: ({ row }) => <span>${row.original.transactionPrice}</span>,
    },
    {
      accessorKey: 'commission',
      header: 'Commission %',
      cell: ({ row }) => <span>{row.original.commission}</span>,
    },
    {
      accessorKey: 'offerType',
      header: 'Offer Type',
      cell: ({ row }) => <span>{row.original.offerType}</span>,
    },
    {
      accessorKey: 'transactionDate',
      header: 'Transaction Date',
      cell: ({ row }) =>
        format(new Date(row.original.transactionDate), 'dd MMM, yyyy'),
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
        <ADTable columns={columns} data={commissionEarnings || []} />
      </div>
      <ADPagination totalPage={meta?.totalPage} />
    </div>
  );
};

export default CommissionEarnings;
