"use client";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Boxes,
  ShoppingCart,
  Package,
  Users,
  Truck,
  BarChart3,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = (pathname.split("/").filter(Boolean)[0] || "es");
  const tMenu = useTranslations("menu");
  const tCommon = useTranslations("common");
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{tCommon("appTitle")}</span>
            <ThemeToggle />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menú</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={tMenu("sales") as any}>
                  <Link href={`/${locale}/dashboard/sales`}>
                    <ShoppingCart />
                    <span>{tMenu("sales")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={tMenu("products") as any}>
                  <Link href={`/${locale}/dashboard/products`}>
                    <Package />
                    <span>{tMenu("products")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={tMenu("inventory") as any}>
                  <Link href={`/${locale}/dashboard/inventory`}>
                    <Boxes />
                    <span>{tMenu("inventory")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={tMenu("customers") as any}>
                  <Link href={`/${locale}/dashboard/customers`}>
                    <Users />
                    <span>{tMenu("customers")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={tMenu("suppliers") as any}>
                  <Link href={`/${locale}/dashboard/suppliers`}>
                    <Truck />
                    <span>{tMenu("suppliers")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={tMenu("employees") as any}>
                  <Link href={`/${locale}/dashboard/employees`}>
                    <Users />
                    <span>{tMenu("employees")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={tMenu("reports") as any}>
                  <Link href={`/${locale}/dashboard/reports`}>
                    <BarChart3 />
                    <span>{tMenu("reports")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarSeparator />
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={tMenu("settings") as any}>
                  <Link href={`/${locale}/dashboard/settings`}>
                    <Settings />
                    <span>{tMenu("settings")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="border-b h-12 flex items-center gap-2 px-3">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                document.cookie = "session=; Max-Age=0; path=/";
                router.push(`/${locale}/auth`);
              }}
              aria-label="Cerrar sesión"
            >
              <LogOut />
              <span>{tCommon("logout")}</span>
            </Button>
          </div>
        </div>
        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
