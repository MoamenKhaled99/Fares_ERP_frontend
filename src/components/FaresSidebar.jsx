import * as React from "react"
import {
  LayoutDashboard,
  Anchor,
  Cable,
  Package,
  ShoppingCart,
  Settings,
  HelpCircle,
  ArrowUpCircle,
  ArrowRightLeft, 
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function FaresSidebar({ currentPath, navigate, ...props }) {
  const data = {
    user: {
      name: "المسؤول",
      email: "admin@fares.com",
      avatar: "/avatars/admin.jpg",
    },
    navMain: [
      {
        title: "لوحة التحكم",
        url: "/",
        icon: LayoutDashboard,
        isActive: currentPath === "/",
      },
      {
        title: "الحدايد",
        url: "/irons",
        icon: Anchor,
        isActive: currentPath === "/irons",
      },
      {
        title: "الويرات",
        url: "/wires",
        icon: Cable,
        isActive: currentPath === "/wires",
      },
      {
        title: "الشرائط",
        url: "/silk",
        icon: Package,
        isActive: currentPath === "/silk",
      },
      
      {
        title: "سجل المخزون", // ✅ NEW LINK
        url: "/stock-logs",
        icon: ArrowRightLeft,
        isActive: currentPath === "/stock-logs",
      },

      {
        title: "الفواتير",
        url: "/invoices",
        icon: ShoppingCart,
        isActive: currentPath === "/invoices" || currentPath === "/invoices/new",
        items: [
          {
            title: "قائمة الفواتير",
            url: "/invoices",
          },
          {
            title: "فاتورة جديدة",
            url: "/invoices/new",
          },
        ],
      },
      
    ],
    navSecondary: [
      {
        title: "الإعدادات",
        url: "#",
        icon: Settings,
      },
      {
        title: "المساعدة",
        url: "#",
        icon: HelpCircle,
      },
    ],
  }

  const handleNavigate = (url) => {
    if (url !== "#") {
      navigate(url)
    }
  }

  return (
    // FIX: Added side="right" to align with RTL layout
    <Sidebar collapsible="icon" side="right" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              onClick={() => navigate("/")}
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600 text-white font-bold">
                F
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-bold text-lg">Fares ERP</span>
                <span className="text-xs">نظام إدارة متكامل</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onNavigate={handleNavigate} />
        <NavSecondary items={data.navSecondary} className="mt-auto" onNavigate={handleNavigate} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}