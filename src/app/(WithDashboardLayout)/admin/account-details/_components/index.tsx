'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Search, ShieldBan, ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format, parseISO } from 'date-fns';
import { IUser } from '@/types';
import { ADTable } from '@/components/modules/ADTable';
import { useCallback, useEffect, useState } from 'react';
import ADPagination from '@/components/modules/ADPagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
} from '@/redux/features/user/userApi';
import Spinner from '@/components/shared/Spinner';
import UserViewModal from './user-view-modal';
import BlockUserModal from './block-user-modal';
import { toast } from 'sonner';

const AccountDetails = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [blockModalUser, setBlockModalUser] = useState<IUser | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

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

  const { data, isLoading, refetch } = useGetAllUsersQuery({
    page,
    limit,
    query: {
      searchTerm,
      createdAt,
    },
  });

  const users = data?.data || [];
  const meta = data?.meta || { totalPage: 1 };

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

  const [changeUserStatus] = useChangeUserStatusMutation();

  const handleBlockConfirm = async (user: IUser) => {
    try {
      if (user.status === 'blocked') {
        // Unblock user → set to ongoing
        await changeUserStatus({
          id: user._id,
          status: { status: 'ongoing' }, // ✅ wrapped
        }).unwrap();

        toast.success('User unblocked successfully');
        refetch();
      } else if (user.status === 'ongoing') {
        // Block user → set to blocked
        await changeUserStatus({
          id: user._id,
          status: { status: 'blocked' }, // ✅ wrapped
        }).unwrap();

        toast.success('User blocked successfully');
        refetch();
      }
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.status}</span>
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
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          {row.original.role === 'vendor' ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Eye
                    onClick={() =>
                      router.push(
                        `/admin/account-details/${row.original?.email}`,
                      )
                    }
                    size={22}
                    className="text-[#78C0A8] cursor-pointer hover:text-[#165940]"
                  />
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Eye
                    onClick={() => {
                      setSelectedUser(row.original);
                      setIsModalOpen(true);
                    }}
                    size={22}
                    className="text-[#78C0A8] cursor-pointer hover:text-[#165940]"
                  />
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                {row.original.status === 'blocked' ? (
                  <ShieldCheck
                    size={22}
                    onClick={() => {
                      setBlockModalUser(row.original);
                      setIsBlockModalOpen(true);
                    }}
                    className="text-green-600 cursor-pointer hover:text-green-800"
                  />
                ) : (
                  <ShieldBan
                    size={22}
                    onClick={() => {
                      setBlockModalUser(row.original);
                      setIsBlockModalOpen(true);
                    }}
                    className="text-[#FE5858] cursor-pointer hover:text-red-600"
                  />
                )}
              </TooltipTrigger>
              <TooltipContent>
                {row.original.status === 'blocked' ? 'Unblock' : 'Block'}
              </TooltipContent>
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

      {/* Single User Modal */}
      <UserViewModal
        selectedUser={selectedUser}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <BlockUserModal
        user={blockModalUser}
        isOpen={isBlockModalOpen}
        onOpenChange={setIsBlockModalOpen}
        onConfirm={handleBlockConfirm}
      />
    </div>
  );
};

export default AccountDetails;
