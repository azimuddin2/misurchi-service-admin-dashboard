'use client';

import { usePathname } from 'next/navigation';
import {
  Settings,
  LayoutDashboard,
  UserRound,
  SquareLibrary,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import Link from 'next/link';
import logo from '@/assets/images/logo.png';
import Image from 'next/image';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAppSelector(selectCurrentUser);
  const pathname = usePathname();

  const navMain = [];

  // Admin-only routes
  if (user?.role === 'admin') {
    navMain.push(
      {
        title: 'Dashboard',
        url: `/admin/dashboard`,
        icon: LayoutDashboard,
      },
      {
        title: 'Account Details',
        url: `/admin/account-details`,
        icon: UserRound,
      },
      {
        title: 'Earning',
        url: `/admin/earning`,
        icon: SquareLibrary,
      },
      {
        title: 'Settings',
        url: '/vendor/edit-profile',
        icon: Settings,
        items: [
          {
            title: 'Edit Profile',
            url: '/vendor/edit-profile',
          },
          {
            title: 'View Profile',
            url: '/vendor/view-profile',
          },
        ],
      },
    );
  }

  return (
    <Sidebar className="h-full" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <Image src={logo} alt="Logo" width={100} height={100} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} currentPath={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
