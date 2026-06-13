'use client';

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UserCog,
  Star,
  Wrench,
  Package,
  Wallet,
  Crown,
  Headphones,
  Settings,
  FileText,
  FileCheck,
  Info,
  ShieldCheck,
  UserPen,
  Gift,
  BadgeDollarSign,
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
        icon: UserCog,
      },
      {
        title: 'Recommended Type',
        url: `/admin/recommended-type`,
        icon: Star,
      },
      {
        title: 'Service Category',
        url: `/admin/service-type`,
        icon: Wrench,
      },
      {
        title: 'Product Category',
        url: `/admin/product-type`,
        icon: Package,
      },
      {
        title: 'Earning',
        url: `/admin/earning`,
        icon: Wallet,
      },
      {
        title: 'Manage Subscription',
        url: `/admin/manage-subscription`,
        icon: Crown,
      },
      {
        title: 'Refer & Earn',
        url: `/admin/refer-earn`,
        icon: Gift,
      },
      {
        title: 'Refer Payout Manage',
        url: `/admin/payout-manage`,
        icon: BadgeDollarSign,
      },
      {
        title: 'Customer Support',
        url: `/admin/customer-support`,
        icon: Headphones,
      },
      {
        title: 'Edit Profile',
        url: `/admin/profile`,
        icon: UserPen,
      },
      {
        title: 'Settings',
        url: '/admin/settings/privacy-policy',
        icon: Settings,
        items: [
          {
            title: 'Privacy Policy',
            url: '/admin/settings/privacy-policy',
            icon: FileText,
          },
          {
            title: 'Terms of Use',
            url: '/admin/settings/terms',
            icon: FileCheck,
          },
          {
            title: 'About Us',
            url: '/admin/settings/about-us',
            icon: Info,
          },
          {
            title: 'Policy',
            url: '/admin/settings/policy',
            icon: ShieldCheck,
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
