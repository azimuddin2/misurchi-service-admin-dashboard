'use client';

import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import ProtectedRoute from '@/components/protected-route';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logout, selectCurrentUser } from '@/redux/features/auth/authSlice';
import Link from 'next/link';
import { Bell, Edit, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector(selectCurrentUser);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex ps-3 pr-5 lg:pr-10 justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
            <div className="flex justify-center items-center gap-3">
              <Button className="relative p-2 rounded-full shadow bg-white hover:bg-gray-100">
                <Bell className="h-12 w-12 text-gray-700" />

                {/* Notification badge */}
                <span className="absolute -top-1 right-1 w-5 h-5 bg-[#165940] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {0}
                </span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer w-10 h-10 border-2 border-black">
                    <AvatarImage src={user?.image} />
                    <AvatarFallback>{user?.name?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-[10px] mt-2 w-80 mr-6 p-3">
                  <div>
                    <Avatar className="mx-auto w-14 h-14">
                      <AvatarImage src={user?.image} />
                      <AvatarFallback className="bg-[#165940] text-white text-2xl">
                        {user?.name?.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center my-2">
                      <h2 className="text-lg">{user?.name}</h2>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link href={`/${user?.role}/profile`}>
                    <DropdownMenuItem className="rounded-[5px] cursor-pointe bg-[#EBF0EE]">
                      <Edit />
                      <span>Edit Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-[5px] text-white bg-red-500 cursor-pointer mt-2"
                  >
                    <LogOut className="text-white" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <ProtectedRoute>
            <div className="min-h-[100vh] bg-[#f6f6f6] flex-1 rounded md:min-h-min p-3 lg:p-8 lg:m-2 mt-0">
              {children}
            </div>
          </ProtectedRoute>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
