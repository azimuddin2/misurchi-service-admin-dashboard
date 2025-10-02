'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, ShieldBan, ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { IUser } from '@/types';
import { ADTable } from '@/components/modules/ADTable';
import { useState } from 'react';
import {
  useChangeUserStatusMutation,
  useGetAllUsersQuery,
} from '@/redux/features/user/userApi';
import UserViewModal from '../../account-details/_components/user-view-modal';
import BlockUserModal from '../../account-details/_components/block-user-modal';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const RecentUserAccount = () => {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [blockModalUser, setBlockModalUser] = useState<IUser | null>(null);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  const { data, refetch } = useGetAllUsersQuery({
    query: {},
  });

  const users = data?.data?.slice(0, 6) || [];

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

  return (
    <div className="my-6">
      <ADTable columns={columns} data={users || []} />

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

export default RecentUserAccount;
