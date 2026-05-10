import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSchoolInfo } from "@/hooks/useBackend";
import { cn, getInitials } from "@/lib/utils";
import { useAppStore, useUnreadCount } from "@/store/useAppStore";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BarChart3,
  Bell,
  BellRing,
  BookOpen,
  Briefcase,
  Bus,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  CreditCard,
  FileText,
  GalleryVerticalEnd,
  Globe,
  GraduationCap,
  HelpCircle,
  IndianRupee,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Package,
  Settings,
  TrendingUp,
  UserCog,
  Users,
  Users2,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";

// ─── Nav structure ─────────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** If set, only these roles see this item. Omit to show to all roles. */
  roles?: string[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Core",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "My Fees", href: "/my-fees", icon: IndianRupee },
      { label: "Academics", href: "/academics", icon: GraduationCap },
      { label: "Students", href: "/students", icon: Users },
      { label: "Fees", href: "/fees", icon: IndianRupee },
      { label: "Attendance", href: "/attendance", icon: ClipboardCheck },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "Syllabus & Q&A", href: "/syllabus", icon: FileText },
      { label: "Timetable", href: "/timetable", icon: CalendarDays },
    ],
  },
  {
    label: "Exams",
    items: [
      { label: "Examinations", href: "/examinations", icon: Award },
      { label: "Online Exams", href: "/examinations", icon: BookOpen },
    ],
  },
  {
    label: "HR",
    items: [{ label: "HR & Payroll", href: "/hr", icon: Briefcase }],
  },
  {
    label: "Operations",
    items: [
      { label: "Transport", href: "/transport", icon: Bus },
      { label: "Library", href: "/library", icon: Library },
      { label: "Inventory", href: "/inventory", icon: Package },
    ],
  },
  {
    label: "Communication",
    items: [
      { label: "Communication", href: "/communication", icon: MessageCircle },
      {
        label: "Notifications",
        href: "/notifications",
        icon: BellRing,
        roles: ["Admin", "Staff"],
      },
      { label: "Virtual Classes", href: "/virtual-classes", icon: Video },
      { label: "Chat", href: "/chat", icon: MessageSquare },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Expenses", href: "/expenses", icon: CreditCard },
      { label: "Reports", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Studio",
    items: [
      {
        label: "Certificate Studio",
        href: "/certificate-studio",
        icon: GalleryVerticalEnd,
      },
      { label: "Analytics", href: "/analytics", icon: TrendingUp },
      { label: "Homework", href: "/homework", icon: ClipboardList },
    ],
  },
  {
    label: "Admin",
    items: [
      { label: "Sessions", href: "/sessions", icon: CalendarClock },
      {
        label: "Academic Calendar",
        href: "/academic-calendar",
        icon: CalendarRange,
        roles: ["Admin", "Staff", "Teacher", "Accountant"],
      },
      { label: "User Management", href: "/users", icon: UserCog },
      { label: "Settings", href: "/settings", icon: Settings },
      {
        label: "Landing Page",
        href: "/landing-page-editor",
        icon: Globe,
        roles: ["Admin"],
      },
      { label: "Alumni", href: "/alumni", icon: Users2 },
      { label: "Help & Guide", href: "/help", icon: HelpCircle },
    ],
  },
];

// Flattened nav items for keyboard navigation
const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);

// ─── School Avatar ─────────────────────────────────────────────────────────
function SchoolAvatar({
  name,
  collapsed,
}: { name: string; collapsed: boolean }) {
  const initials = getInitials(name);
  const avatar = (
    <div
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm select-none"
      aria-label={name}
    >
      {initials}
    </div>
  );
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{avatar}</TooltipTrigger>
        <TooltipContent side="right">{name}</TooltipContent>
      </Tooltip>
    );
  }
  return avatar;
}

// ─── Sidebar Link ─────────────────────────────────────────────────────────────
interface SidebarLinkProps {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  isFocused: boolean;
  linkRef: React.RefObject<HTMLAnchorElement | null>;
  onFocus: () => void;
}

function SidebarLink({
  item,
  collapsed,
  isActive,
  isFocused,
  linkRef,
  onFocus,
}: SidebarLinkProps) {
  const Icon = item.icon;
  const link = (
    <Link
      ref={linkRef}
      to={item.href}
      onFocus={onFocus}
      tabIndex={isFocused ? 0 : -1}
      data-ocid={`sidebar.${item.label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.link`}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        "text-sidebar-foreground/80 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-accent",
        isActive &&
          "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
        isFocused &&
          !isActive &&
          "ring-2 ring-sidebar-accent/50 bg-sidebar-accent/10",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }
  return link;
}

// ─── Notification List ────────────────────────────────────────────────────────
function NotificationList({ onClose }: { onClose: () => void }) {
  const { notifications, markNotificationRead } = useAppStore();
  const recent = notifications.slice(0, 8);
  if (recent.length === 0) {
    return (
      <div
        className="px-4 py-8 text-center text-sm text-muted-foreground"
        data-ocid="topbar.notifications.empty_state"
      >
        No notifications yet
      </div>
    );
  }
  return (
    <ScrollArea className="max-h-72">
      <div className="divide-y divide-border">
        {recent.map((n) => (
          <button
            key={n.id}
            type="button"
            className={cn(
              "w-full text-left px-4 py-3 text-sm hover:bg-muted/40 transition-colors",
              !n.isRead && "bg-primary/5",
            )}
            onClick={() => {
              markNotificationRead(n.id);
              onClose();
            }}
            data-ocid={`topbar.notifications.item.${n.id}`}
          >
            <p className={cn("truncate", !n.isRead && "font-medium")}>
              {n.title}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {n.message}
            </p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

// ─── App Layout ──────────────────────────────────────────────────────────────
interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isSidebarCollapsed,
    toggleSidebar,
    currentRole,
    currentUser,
    logout: storeLogout,
  } = useAppStore();
  const { data: schoolInfo } = useSchoolInfo();
  const unreadCount = useUnreadCount();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // ─── Keyboard nav state ───────────────────────────────────────────────────
  const [focusedNavIndex, setFocusedNavIndex] = useState(0);
  const linkRefs = useRef<Array<React.RefObject<HTMLAnchorElement | null>>>(
    ALL_NAV_ITEMS.map(() => ({ current: null })),
  );

  // Close notification panel on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  // Close mobile sidebar on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional — close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    storeLogout();
    navigate({ to: "/login" });
  };

  const userName = currentUser?.fullName ?? currentRole;
  const schoolName = schoolInfo?.name ?? "SHUBH SCHOOL ERP";

  // ─── Arrow key navigation ─────────────────────────────────────────────────
  const handleNavKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = Math.min(focusedNavIndex + 1, ALL_NAV_ITEMS.length - 1);
        setFocusedNavIndex(next);
        linkRefs.current[next]?.current?.focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = Math.max(focusedNavIndex - 1, 0);
        setFocusedNavIndex(prev);
        linkRefs.current[prev]?.current?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        setFocusedNavIndex(0);
        linkRefs.current[0]?.current?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        const last = ALL_NAV_ITEMS.length - 1;
        setFocusedNavIndex(last);
        linkRefs.current[last]?.current?.focus();
      }
    },
    [focusedNavIndex],
  );

  // Build a flat index map for rendering
  let navItemFlatIndex = 0;
  const getNextFlatIndex = () => navItemFlatIndex++;

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Logo / School Avatar */}
      <Link
        to="/dashboard"
        data-ocid="sidebar.dashboard_home.link"
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border px-4 transition-all duration-200",
          "hover:bg-sidebar-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sidebar-accent",
          isSidebarCollapsed ? "justify-center" : "gap-3",
        )}
      >
        <SchoolAvatar name={schoolName} collapsed={isSidebarCollapsed} />
        {!isSidebarCollapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-bold font-display text-sidebar-foreground leading-tight">
              {schoolName.replace(" ERP", "")}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              ERP System
            </p>
          </div>
        )}
      </Link>

      {/* Nav — flex-1 min-h-0 ensures it fills remaining space and scrolls */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3">
        <nav
          aria-label="Main navigation"
          onKeyDown={handleNavKeyDown}
          className="space-y-4 px-2"
          data-ocid="sidebar.nav"
        >
          {(() => {
            navItemFlatIndex = 0;
            return NAV_GROUPS.map((group) => (
              <div key={group.label}>
                {!isSidebarCollapsed && (
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                    {group.label}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items
                    .filter(
                      (item) =>
                        !item.roles || item.roles.includes(currentRole ?? ""),
                    )
                    .map((item) => {
                      const flatIdx = getNextFlatIndex();
                      return (
                        <SidebarLink
                          key={item.href + item.label}
                          item={item}
                          collapsed={isSidebarCollapsed}
                          isActive={location.pathname === item.href}
                          isFocused={focusedNavIndex === flatIdx}
                          linkRef={
                            linkRefs.current[
                              flatIdx
                            ] as React.RefObject<HTMLAnchorElement | null>
                          }
                          onFocus={() => setFocusedNavIndex(flatIdx)}
                        />
                      );
                    })}
                </div>
              </div>
            ));
          })()}
        </nav>
      </div>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-2 shrink-0">
        <button
          type="button"
          onClick={toggleSidebar}
          onKeyDown={(e) => e.key === "Enter" && toggleSidebar()}
          data-ocid="sidebar.collapse_toggle"
          aria-label={
            isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          className="flex w-full items-center justify-center rounded-lg py-2 text-sidebar-foreground/60 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground transition-all duration-200"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar — smooth width transition */}
        <aside
          className={cn(
            "hidden lg:flex flex-col border-r border-border shrink-0",
            "transition-[width] duration-300 ease-in-out overflow-hidden",
            isSidebarCollapsed ? "w-[60px]" : "w-[220px]",
          )}
          style={{ willChange: "width" }}
        >
          {sidebarContent}
        </aside>

        {/* Mobile Sidebar Overlay */}
        <div
          className={cn(
            "mobile-sidebar-backdrop fixed inset-0 bg-foreground/20 lg:hidden transition-opacity duration-300",
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
          role="button"
          tabIndex={0}
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          aria-label="Close sidebar"
        />
        <aside
          className={cn(
            "mobile-sidebar-panel fixed inset-y-0 left-0 w-[220px] lg:hidden",
            "transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          style={{ willChange: "transform" }}
        >
          {sidebarContent}
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                data-ocid="sidebar.mobile_open_button"
                aria-label="Open sidebar"
              >
                <Menu className="size-5" />
              </Button>
              <h1 className="text-lg font-bold font-display text-foreground hidden sm:block">
                SHUBH SCHOOL ERP
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => setNotifOpen((v) => !v)}
                  data-ocid="topbar.notifications_button"
                  aria-label="Notifications"
                >
                  <Bell className="size-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 size-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>

                {notifOpen && (
                  <div
                    className="notification-popover absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                    data-ocid="topbar.notifications.popover"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold font-display">
                        Notifications
                      </p>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={() => {
                            const { notifications, markNotificationRead } =
                              useAppStore.getState();
                            for (const n of notifications)
                              markNotificationRead(n.id);
                          }}
                          data-ocid="topbar.notifications.mark_all_read"
                        >
                          <CheckCheck className="size-3" /> Mark all read
                        </Button>
                      )}
                    </div>
                    <NotificationList onClose={() => setNotifOpen(false)} />
                  </div>
                )}
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5">
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {getInitials(userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-foreground leading-none">
                    {userName}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {currentRole}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 ml-1 text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                  data-ocid="topbar.logout_button"
                  aria-label="Log out"
                >
                  <LogOut className="size-3.5" />
                </Button>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto bg-background">{children}</main>

          {/* Caffeine attribution footer */}
          <footer className="shrink-0 border-t border-border bg-muted/40 px-6 py-2 text-center text-[11px] text-muted-foreground">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </footer>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </TooltipProvider>
  );
}
