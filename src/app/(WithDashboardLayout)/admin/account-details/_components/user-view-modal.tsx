'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { IUser } from '@/types';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface CancelModalProps {
  selectedUser: IUser | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const UserViewModal = ({
  selectedUser,
  isOpen,
  onOpenChange,
}: CancelModalProps) => {
  const joinDate = selectedUser?.createdAt
    ? format(new Date(selectedUser?.createdAt), 'dd MMM, yyyy')
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100"></DialogTitle>
          <DialogDescription asChild>
            <div className="">
              <Card className="overflow-hidden border-none p-3 shadow-none">
                <div className="mt-6">
                  <Avatar className="mx-auto w-28 h-28">
                    <AvatarImage src={selectedUser?.image} />
                    <AvatarFallback className="bg-[#165940] text-white text-5xl capitalize">
                      {selectedUser?.fullName?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Profile Information */}
                <div className="divide-y divide-gray-200">
                  {/* Name */}
                  <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE] text-base">
                    <span className="text-[#212529] font-medium">Name</span>
                    <span className="text-[#212529] font-semibold">
                      {selectedUser?.fullName}
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex justify-between items-center px-4 py-4 text-base">
                    <span className="text-[#212529] font-medium">Email</span>
                    <span className="text-[#212529] font-semibold">
                      {selectedUser?.email}
                    </span>
                  </div>

                  {/* Phone Number */}
                  <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE] text-base">
                    <span className="text-[#212529] font-medium">
                      Phone Number
                    </span>
                    <span className="text-[#212529] font-semibold">
                      {selectedUser?.phone}
                    </span>
                  </div>

                  {/* Date of Join */}
                  <div className="flex justify-between items-center px-4 py-4 text-base">
                    <span className="text-[#212529] font-medium">
                      Date of Join
                    </span>
                    <span className="text-[#212529] font-semibold">
                      {joinDate}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex justify-between items-center px-4 py-4 bg-[#EBF0EE] text-base">
                    <span className="text-[#212529] font-medium">Location</span>
                    <span className="text-[#212529] font-semibold">
                      Ontario, USA
                    </span>
                  </div>

                  {/* Account Type */}
                  <div className="flex justify-between items-center px-4 py-4 text-base">
                    <span className="text-[#212529] font-medium">
                      Account Type
                    </span>
                    <span className="text-[#212529] font-semibold capitalize">
                      {selectedUser?.role}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserViewModal;
