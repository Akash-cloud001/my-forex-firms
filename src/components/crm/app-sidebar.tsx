"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Building2,
  AlertCircle,
  ShieldAlert,
  Link2,
  ChevronDown,
  Mail,
  Users,
  Shield,
} from "lucide-react";
import Image from "next/image";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
    hasSubmenu: false,
  },
  {
    title: "Firm Management",
    url: "/admin/firms",
    icon: Building2,
    hasSubmenu: false,
  },
  {
    title: "Complaints",
    url: "/admin/complaints",
    icon: AlertCircle,
    hasSubmenu: false,
  },
  {
    title: "Penalties",
    url: "/admin/penalties",
    icon: ShieldAlert,
    hasSubmenu: false,
  },
  {
    title: "Affiliate Links",
    url: "/admin/affiliates",
    icon: Link2,
    hasSubmenu: false,
  },
  {
    title: "Newsletter",
    url: "/admin/newsletter",
    icon: Mail,
    hasSubmenu: false,
  },  
  {
    title: "Live Firms",
    url: "/admin/live-firms",
    icon: Building2,
    hasSubmenu: false,
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    hasSubmenu: false,
  },
  {
    title: "Email Access",
    url: "/admin/email-management",
    icon: Shield,
    hasSubmenu: false,
  },
];

export default function AppSidebar() {
  const { state } = useSidebar()
  const pathname = usePathname();
  const router = useRouter(); 
  const { user } = useUser();
  const [openSubmenus, setOpenSubmenus] = React.useState<Record<string, boolean>>({});
  
  const toggleSubmenu = (itemUrl: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [itemUrl]: !prev[itemUrl]
    }));
  };

  // Auto-open submenu if user is on a submenu route
  React.useEffect(() => {
    navigationItems.forEach(item => {
      const submenu = (item as unknown as { submenu?: Array<{ url: string }> }).submenu;
      if (item.hasSubmenu && submenu) {
        const isOnSubmenuRoute = submenu.some(subItem => 
          pathname === subItem.url || pathname.startsWith(subItem.url + '/')
        );
        if (isOnSubmenuRoute && !openSubmenus[item.url]) {
          setOpenSubmenus(prev => ({
            ...prev,
            [item.url]: true
          }));
        }
      }
    });
  }, [pathname, openSubmenus]);
  
  return (
    <Sidebar className="bg-background border-r border-sidebar-border" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className={`flex items-center gap-2 py-2 ${state === "expanded" ? "px-4" : "px-0"}`}>
          {state !== "expanded" && <div className="flex items-center justify-center text-primary text-sm font-bold">
            MFF
          </div>}
          {state === "expanded" && <div className={`${state !== "expanded" ? "w-0" : "w-auto"} transition-all duration-200 flex items-center justify-center text-primary font-bold overflow-hidden text-sm`}>
            My Forex Firms
          </div>}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isSubmenuOpen = openSubmenus[item.url];
                
                // For items with submenus, only highlight if we're on the exact parent route
                // or if we're on a submenu route (but don't highlight the parent if we're on a submenu)
                const isParentActive = item.hasSubmenu ? pathname === item.url : false;
                
                // Check if any submenu item is active for parent highlighting
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const hasActiveSubmenu = item.hasSubmenu && (item as any).submenu?.some((subItem: { url: string }) => 
                  pathname === subItem.url || pathname.startsWith(subItem.url + '/')
                );
                
                // For items without submenus, use normal active detection
                const isActive = !item.hasSubmenu && (pathname === item.url || pathname.startsWith(item.url + '/'));
                
                const menuButton = item.hasSubmenu ? (
                  <SidebarMenuButton 
                    onClick={() => toggleSubmenu(item.url)}
                    isActive={isParentActive || hasActiveSubmenu}
                    className={`hover:!bg-accent/50 ${(isParentActive || hasActiveSubmenu) ? "!bg-accent !text-primary" : ""}`}
                  >
                    <Icon className="h-4 w-4 text-current" />
                    {state === "expanded" && (
                      <>
                        <span>{item.title}</span>
                        <ChevronDown 
                          className={`h-4 w-4 ml-auto transition-transform duration-200 ${
                            isSubmenuOpen ? "rotate-180" : ""
                          }`} 
                        />
                      </>
                    )}
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    className={` hover:!bg-accent/50 ${isActive ? "!bg-accent !text-primary" : ""}`}
                  >
                    <Link href={item.url}>
                      <Icon className="h-4 w-4 text-current" />
                      {state === "expanded" && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                );
                
                return (
                  <SidebarMenuItem key={item.url}>
                    {state !== "expanded" ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {menuButton}
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      menuButton
                    )}
                    {item.hasSubmenu && state === "expanded" && isSubmenuOpen && (
                      <SidebarMenuSub>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(item as any).submenu?.map((subItem: any) => {
                          // More precise active detection for submenu items
                          // For analytics, only highlight exact matches to prevent multi-selection
                          let isSubActive = false;
                          
                          if (subItem.url === '/owner/analytics') {
                            // Only highlight Overview if we're exactly on /owner/analytics
                            isSubActive = pathname === '/owner/analytics';
                          } else if (subItem.url === '/owner/analytics/advanced') {
                            // Only highlight Advanced if we're on /owner/analytics/advanced or its sub-routes
                            isSubActive = pathname === '/owner/analytics/advanced' || pathname.startsWith('/owner/analytics/advanced/');
                          } else {
                            // For other submenu items, use the original logic
                            isSubActive = pathname === subItem.url || 
                              (pathname.startsWith(subItem.url + '/') && 
                               subItem.url !== '/owner/inventory' && 
                               subItem.url !== '/owner/leads');
                          }
                          const SubIcon = subItem.icon;
                          const isSubSubmenuOpen = openSubmenus[subItem.url];
                          const hasActiveSubSubmenu = subItem.hasSubmenu && subItem.submenu?.some((subSubItem: { url: string }) => 
                            pathname === subSubItem.url || pathname.startsWith(subSubItem.url + '/')
                          );
                          
                          return (
                            <SidebarMenuSubItem key={subItem.url}>
                              {subItem.hasSubmenu ? (
                                <SidebarMenuSubButton 
                                  onClick={() => toggleSubmenu(subItem.url)}
                                  isActive={hasActiveSubSubmenu}
                                  className={`hover:!bg-accent/50 whitespace-nowrap ${hasActiveSubSubmenu ? "!bg-accent !text-primary" : ""}`}
                                >
                                  <SubIcon className="h-4 w-4 text-current" />
                                  {subItem.title}
                                  <ChevronDown 
                                    className={`h-4 w-4 ml-auto transition-transform duration-200 ${
                                      isSubSubmenuOpen ? "rotate-180" : ""
                                    }`} 
                                  />
                                </SidebarMenuSubButton>
                              ) : (
                                <SidebarMenuSubButton 
                                  asChild 
                                  isActive={isSubActive} 
                                  className={`hover:!bg-accent/50 ${isSubActive ? "!bg-accent !text-primary" : ""}`}
                                >
                                  <Link href={subItem.url}>
                                    <SubIcon className="h-4 w-4 text-current" />
                                    {subItem.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              )}
                              
                              {/* Nested submenu rendering */}
                              {subItem.hasSubmenu && isSubSubmenuOpen && (
                                <SidebarMenuSub>
                                  {subItem.submenu?.map((subSubItem: { url: string; title: string; icon: React.ComponentType<{ className?: string }> }) => {
                                    const isSubSubActive = pathname === subSubItem.url || pathname.startsWith(subSubItem.url + '/');
                                    const SubSubIcon = subSubItem.icon;
                                    return (
                                      <SidebarMenuSubItem key={subSubItem.url}>
                                        <SidebarMenuSubButton 
                                          asChild 
                                          isActive={isSubSubActive} 
                                          className={`hover:!bg-accent/50 w-full whitespace-nowrap text-xs ${isSubSubActive ? "!bg-accent !text-primary" : ""}`}
                                        >
                                          <Link href={subSubItem.url} className="w-full">
                                            <SubSubIcon className="h-3 w-3 text-current" />
                                            {subSubItem.title}
                                          </Link>
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    );
                                  })}
                                </SidebarMenuSub>
                              )}
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className={`"border border-t border-sidebar-border cursor-pointer ${state === "expanded" ? "p-4" : "px-2 py-4"} "`}
      onClick={() => {
        router.push("/admin/profile");
      }}
      >
        {state !== "expanded" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-base font-medium flex items-center gap-2 relative">
                {user?.imageUrl ? (
                  <Image 
                    src={user.imageUrl} 
                    alt={user.fullName || "User"} 
                    className="h-8 w-8 rounded-full object-cover"
                    width={32}
                    height={32}
                    priority
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                    {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-sm">
              {user?.fullName || user?.emailAddresses?.[0]?.emailAddress || "User"}
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="text-base font-medium flex items-center gap-2">
            {user?.imageUrl ? (
              <Image 
              src={user.imageUrl} 
              alt={user.fullName || "User"} 
              className=" rounded-full object-cover"
              width={32}
              height={32}
                priority
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0) || "U"}
              </div>
            )}
            <span className="text-sm">{user?.fullName || user?.emailAddresses?.[0]?.emailAddress || "User"}</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}