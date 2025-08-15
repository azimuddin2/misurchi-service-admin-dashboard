'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, ShieldBan } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { IUser } from '@/types';
import { ADTable } from '@/components/modules/ADTable';
import { useState } from 'react';
import { useGetAllUsersQuery } from '@/redux/features/user/userApi';

const RecentUserAccount = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, refetch } = useGetAllUsersQuery({
    query: {},
  });

  const users = data?.data?.slice(0, 6) || [];

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
      cell: ({ row }) => `0${row.index + 1}`,
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
    <div className="my-6">
      <ADTable columns={columns} data={users || []} />
    </div>
  );
};

export default RecentUserAccount;
