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

const RecentUserAccount = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
  ];

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
