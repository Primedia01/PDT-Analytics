import { LayoutDashboard, Building2, BarChart3, Settings, MapPin, Target, Users as UsersIcon, Shield, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth, Role } from "@/lib/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Sidebar() {
  const [location] = useLocation();
  const { user, setUserRole } = useAuth();

  const getNavigation = () => {
    switch (user.role) {
      case "admin":
        return [
          { name: "Dashboard", href: "/", icon: LayoutDashboard },
          { name: "Mall Explorer", href: "/explorer", icon: Building2 },
          { name: "Portfolio Analytics", href: "/analytics", icon: BarChart3 },
          { name: "Assets", href: "/assets", icon: MapPin },
          { name: "Campaign Simulator", href: "/campaign", icon: Target },
          { name: "User Management", href: "#", icon: UsersIcon },
          { name: "Settings", href: "#", icon: Settings },
        ];
      case "internal":
        return [
          { name: "Dashboard", href: "/", icon: LayoutDashboard },
          { name: "Mall Explorer", href: "/explorer", icon: Building2 },
          { name: "Portfolio Analytics", href: "/analytics", icon: BarChart3 },
          { name: "Assets", href: "/assets", icon: MapPin },
        ];
      case "sales":
        return [
          { name: "Dashboard", href: "/", icon: LayoutDashboard },
          { name: "Mall Explorer", href: "/explorer", icon: Building2 },
          { name: "Campaign Simulator", href: "/campaign", icon: Target },
          { name: "Available Assets", href: "/assets", icon: MapPin },
        ];
      case "advertiser":
        return [
          { name: "Campaign Planner", href: "/campaign", icon: Target },
          { name: "My Campaigns", href: "#", icon: BarChart3 },
          { name: "Mall Explorer", href: "/explorer", icon: Building2 },
          { name: "Reports", href: "#", icon: LayoutDashboard },
        ];
      case "mall_partner":
        return [
          { name: "Dashboard", href: "/", icon: LayoutDashboard },
          { name: "Mall Explorer", href: "/explorer", icon: Building2 },
          { name: "My Assets", href: "/assets", icon: MapPin },
        ];
      default:
        return [];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            RT
          </div>
          <span>RetailTwin</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;

            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Role Profile & Switcher (for mockup purposes) */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors outline-none">
            <div className="flex items-center gap-3 text-left">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-xs leading-none mb-1">{user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-mono">{user.role}</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="font-normal">
                <p className="text-xs text-muted-foreground">Organization</p>
                <p className="text-sm font-medium">{user.organization}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase">Mock Role Switcher</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setUserRole("admin")}>Admin View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUserRole("internal")}>Internal Operations View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUserRole("sales")}>Sales Team View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUserRole("advertiser")}>Advertiser View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUserRole("mall_partner")}>Mall Partner View</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
