'use client';

import { usePathname } from 'next/navigation';
import {
  Settings,
  LayoutDashboard,
  UserRound,
  SquareLibrary,
  FileText,
  FileCheck,
  Shield,
  Info,
  Receipt,
  Crown,
  DollarSign,
  Star,
  Mail,
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
        title: 'Manage Subscription',
        url: `/admin/manage-subscription`,
        icon: Crown,
      },
      {
        title: 'Payout Manage',
        url: `/admin/payout-manage`,
        icon: DollarSign,
      },
      {
        title: 'Refer and Earn',
        url: `/admin/refer-earn`,
        icon: Star,
      },
      {
        title: 'Contact List',
        url: `/admin/contact-list`,
        icon: Mail,
      },
      {
        title: 'Settings',
        url: '/admin/privacy-policy',
        icon: Settings,
        items: [
          {
            title: 'Privacy Policy',
            url: '/admin/privacy-policy',
            icon: FileText,
          },
          {
            title: 'Terms of use',
            url: '/admin/terms',
            icon: FileCheck,
          },
          {
            title: 'About Us',
            url: '/admin/about-us',
            icon: Info,
          },
          {
            title: 'Policy',
            url: '/admin/policy',
            icon: Shield,
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
