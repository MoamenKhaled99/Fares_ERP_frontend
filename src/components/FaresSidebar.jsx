import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  HelpCircle,
  ArrowRightLeft, 
  Languages,
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
import { Button } from "@/components/ui/button"

export function FaresSidebar({ currentPath, navigate, ...props }) {
  const { t, i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const data = {
    user: {
      name: t('user.admin'),
      email: t('user.email'),
      avatar: "/avatars/admin.jpg",
    },
    navMain: [
      {
        title: t('nav.dashboard'),
        url: "/",
        icon: LayoutDashboard,
        isActive: currentPath === "/",
      },
      {
        title: t('nav.products'),
        icon: Package,
        isActive: currentPath === "/irons" || currentPath === "/wires" || currentPath === "/silk",
        items: [
          {
            title: t('nav.irons'),
            url: "/irons",
            isActive: currentPath === "/irons",
          },
          {
            title: t('nav.wires'),
            url: "/wires",
            isActive: currentPath === "/wires",
          },
          {
            title: t('nav.silk'),
            url: "/silk",
            isActive: currentPath === "/silk",
          },
        ],
      },
      {
        title: t('nav.stockLogs'),
        url: "/stock-logs",
        icon: ArrowRightLeft,
        isActive: currentPath === "/stock-logs",
      },
      {
        title: t('nav.invoices'),
        url: "/invoices",
        icon: ShoppingCart,
        isActive: currentPath === "/invoices" || currentPath === "/invoices/new",
        items: [
          {
            title: t('nav.invoiceList'),
            url: "/invoices",
          },
          {
            title: t('nav.newInvoice'),
            url: "/invoices/new",
          },
        ],
      },
      
    ],
    navSecondary: [
      {
        title: t('nav.settings'),
        url: "#",
        icon: Settings,
      },
      {
        title: t('nav.help'),
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
    <Sidebar 
      collapsible="none" 
      side={i18n.language === 'ar' ? 'right' : 'left'} 
      className="min-h-svh bg-sidebar border-r"
      {...props}
    >
      {/* Updated: Added 'mb-6' and 'pt-4' to push content down and add breathing room */}
      <SidebarHeader className="mb-2 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              size="lg" 
              onClick={() => navigate("/")}
              // Updated: changed height to h-auto and added padding (py-4) to accommodate larger logo
              className="data-[slot=sidebar-menu-button]:!p-2 hover:bg-transparent h-auto py-3"
            >
              <div className="flex aspect-square size-12 items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="App Logo" 
                  className="size-full object-contain" 
                />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-bold text-lg">{t('app.title')}</span>
                <span className="text-xs">{t('app.subtitle')}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} onNavigate={handleNavigate} />
        <NavSecondary items={data.navSecondary} className="mt-auto" onNavigate={handleNavigate} />
        <div className="px-3 py-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="w-full justify-start gap-2"
          >
            <Languages className="h-4 w-4" />
            <span>{i18n.language === 'ar' ? 'English' : 'العربية'}</span>
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}