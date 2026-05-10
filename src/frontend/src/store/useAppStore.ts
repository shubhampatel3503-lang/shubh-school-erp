import type {
  AcademicSession,
  Notification,
  StudentDiscount,
  UserAccount,
  UserRole,
} from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Default sessions 2019-20 → 2025-26 ──────────────────────────────────────
export const DEFAULT_SESSIONS: AcademicSession[] = [
  {
    id: "sess-2019",
    name: "2019-20",
    startYear: 2019,
    isActive: false,
    isArchived: true,
    createdAt: "2019-04-01",
  },
  {
    id: "sess-2020",
    name: "2020-21",
    startYear: 2020,
    isActive: false,
    isArchived: true,
    createdAt: "2020-04-01",
  },
  {
    id: "sess-2021",
    name: "2021-22",
    startYear: 2021,
    isActive: false,
    isArchived: true,
    createdAt: "2021-04-01",
  },
  {
    id: "sess-2022",
    name: "2022-23",
    startYear: 2022,
    isActive: false,
    isArchived: true,
    createdAt: "2022-04-01",
  },
  {
    id: "sess-2023",
    name: "2023-24",
    startYear: 2023,
    isActive: false,
    isArchived: false,
    createdAt: "2023-04-01",
  },
  {
    id: "sess-2024",
    name: "2024-25",
    startYear: 2024,
    isActive: false,
    isArchived: false,
    createdAt: "2024-04-01",
  },
  {
    id: "sess-2025",
    name: "2025-26",
    startYear: 2025,
    isActive: true,
    isArchived: false,
    createdAt: "2025-04-01",
  },
];

// ─── Theme CSS variable maps ──────────────────────────────────────────────────
// IMPORTANT: All color values are stored as BARE OKLCH channel strings
// e.g. "0.28 0.12 245" (NOT "oklch(0.28 0.12 245)").
// Tailwind config uses oklch(var(--primary) / alpha) which requires bare channels.
export interface ThemeVars {
  isDark: boolean;
  label: string;
  "--background": string;
  "--foreground": string;
  "--card": string;
  "--card-foreground": string;
  "--popover": string;
  "--popover-foreground": string;
  "--primary": string;
  "--primary-foreground": string;
  "--secondary": string;
  "--secondary-foreground": string;
  "--muted": string;
  "--muted-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
  "--destructive": string;
  "--destructive-foreground": string;
  "--border": string;
  "--input": string;
  "--ring": string;
  "--sidebar-background": string;
  "--sidebar-foreground": string;
  "--sidebar-accent": string;
  "--sidebar-accent-foreground": string;
  "--sidebar-border": string;
  "--sidebar-primary": string;
  "--sidebar-primary-foreground": string;
}

/**
 * 10 professional OKLCH themes — each visually distinct, high-contrast.
 * Values are BARE channel strings: "L C H" — NO oklch() wrapper.
 * applyThemeToDom sets them directly; tailwind.config.js wraps with oklch().
 */
export const THEME_VARS: Record<string, ThemeVars> = {
  // 1. Deep Blue — corporate navy + vibrant sky accent
  "navy-gold": {
    isDark: false,
    label: "Deep Blue",
    "--background": "0.97 0.007 240",
    "--foreground": "0.15 0.04 240",
    "--card": "1 0 0",
    "--card-foreground": "0.15 0.04 240",
    "--popover": "1 0 0",
    "--popover-foreground": "0.15 0.04 240",
    "--primary": "0.28 0.12 245",
    "--primary-foreground": "0.97 0 0",
    "--secondary": "0.91 0.03 240",
    "--secondary-foreground": "0.28 0.12 245",
    "--muted": "0.93 0.015 240",
    "--muted-foreground": "0.48 0.04 240",
    "--accent": "0.68 0.18 198",
    "--accent-foreground": "0.12 0.06 220",
    "--destructive": "0.52 0.22 25",
    "--destructive-foreground": "0.98 0 0",
    "--border": "0.87 0.02 240",
    "--input": "0.87 0.02 240",
    "--ring": "0.68 0.18 198",
    "--sidebar-background": "0.20 0.10 245",
    "--sidebar-foreground": "0.94 0.01 240",
    "--sidebar-accent": "0.32 0.12 245",
    "--sidebar-accent-foreground": "0.97 0 0",
    "--sidebar-border": "0.30 0.10 245",
    "--sidebar-primary": "0.68 0.18 198",
    "--sidebar-primary-foreground": "0.12 0.06 220",
  },

  // 2. Emerald — rich forest green + fresh mint accent
  "ocean-blue": {
    isDark: false,
    label: "Emerald",
    "--background": "0.97 0.008 152",
    "--foreground": "0.14 0.06 152",
    "--card": "1 0 0",
    "--card-foreground": "0.14 0.06 152",
    "--popover": "1 0 0",
    "--popover-foreground": "0.14 0.06 152",
    "--primary": "0.32 0.14 152",
    "--primary-foreground": "0.97 0 0",
    "--secondary": "0.90 0.04 152",
    "--secondary-foreground": "0.28 0.12 152",
    "--muted": "0.93 0.02 152",
    "--muted-foreground": "0.48 0.05 152",
    "--accent": "0.70 0.20 158",
    "--accent-foreground": "0.12 0.07 152",
    "--destructive": "0.52 0.22 25",
    "--destructive-foreground": "0.98 0 0",
    "--border": "0.87 0.02 152",
    "--input": "0.87 0.02 152",
    "--ring": "0.70 0.20 158",
    "--sidebar-background": "0.22 0.10 152",
    "--sidebar-foreground": "0.94 0.01 152",
    "--sidebar-accent": "0.32 0.12 152",
    "--sidebar-accent-foreground": "0.97 0 0",
    "--sidebar-border": "0.32 0.10 152",
    "--sidebar-primary": "0.70 0.20 158",
    "--sidebar-primary-foreground": "0.12 0.07 152",
  },

  // 3. Royal Purple — deep purple + warm golden accent
  "forest-green": {
    isDark: false,
    label: "Royal Purple",
    "--background": "0.97 0.008 292",
    "--foreground": "0.14 0.06 292",
    "--card": "1 0 0",
    "--card-foreground": "0.14 0.06 292",
    "--popover": "1 0 0",
    "--popover-foreground": "0.14 0.06 292",
    "--primary": "0.34 0.18 292",
    "--primary-foreground": "0.97 0 0",
    "--secondary": "0.90 0.04 292",
    "--secondary-foreground": "0.30 0.14 292",
    "--muted": "0.93 0.02 292",
    "--muted-foreground": "0.48 0.05 292",
    "--accent": "0.72 0.18 72",
    "--accent-foreground": "0.16 0.06 72",
    "--destructive": "0.52 0.22 25",
    "--destructive-foreground": "0.98 0 0",
    "--border": "0.87 0.025 292",
    "--input": "0.87 0.025 292",
    "--ring": "0.72 0.18 72",
    "--sidebar-background": "0.22 0.14 292",
    "--sidebar-foreground": "0.94 0.01 292",
    "--sidebar-accent": "0.32 0.16 292",
    "--sidebar-accent-foreground": "0.97 0 0",
    "--sidebar-border": "0.32 0.14 292",
    "--sidebar-primary": "0.72 0.18 72",
    "--sidebar-primary-foreground": "0.16 0.06 72",
  },

  // 4. Amber — warm amber + deep brown accent
  "royal-purple": {
    isDark: false,
    label: "Amber",
    "--background": "0.98 0.010 72",
    "--foreground": "0.15 0.05 60",
    "--card": "1 0 0",
    "--card-foreground": "0.15 0.05 60",
    "--popover": "1 0 0",
    "--popover-foreground": "0.15 0.05 60",
    "--primary": "0.55 0.20 60",
    "--primary-foreground": "0.98 0 0",
    "--secondary": "0.92 0.05 72",
    "--secondary-foreground": "0.30 0.12 60",
    "--muted": "0.93 0.025 72",
    "--muted-foreground": "0.50 0.06 60",
    "--accent": "0.42 0.14 50",
    "--accent-foreground": "0.97 0 0",
    "--destructive": "0.52 0.22 25",
    "--destructive-foreground": "0.98 0 0",
    "--border": "0.88 0.03 72",
    "--input": "0.88 0.03 72",
    "--ring": "0.55 0.20 60",
    "--sidebar-background": "0.30 0.14 55",
    "--sidebar-foreground": "0.96 0.01 72",
    "--sidebar-accent": "0.42 0.16 55",
    "--sidebar-accent-foreground": "0.97 0 0",
    "--sidebar-border": "0.40 0.14 55",
    "--sidebar-primary": "0.75 0.18 72",
    "--sidebar-primary-foreground": "0.15 0.05 60",
  },

  // 5. Coral — vibrant coral + cool slate contrast
  "sunset-orange": {
    isDark: false,
    label: "Coral",
    "--background": "0.98 0.008 20",
    "--foreground": "0.16 0.04 20",
    "--card": "1 0 0",
    "--card-foreground": "0.16 0.04 20",
    "--popover": "1 0 0",
    "--popover-foreground": "0.16 0.04 20",
    "--primary": "0.58 0.22 22",
    "--primary-foreground": "0.98 0 0",
    "--secondary": "0.92 0.04 20",
    "--secondary-foreground": "0.32 0.14 22",
    "--muted": "0.93 0.02 20",
    "--muted-foreground": "0.50 0.05 20",
    "--accent": "0.40 0.08 230",
    "--accent-foreground": "0.97 0 0",
    "--destructive": "0.42 0.22 25",
    "--destructive-foreground": "0.98 0 0",
    "--border": "0.88 0.025 20",
    "--input": "0.88 0.025 20",
    "--ring": "0.58 0.22 22",
    "--sidebar-background": "0.30 0.16 20",
    "--sidebar-foreground": "0.96 0.01 20",
    "--sidebar-accent": "0.42 0.18 22",
    "--sidebar-accent-foreground": "0.97 0 0",
    "--sidebar-border": "0.40 0.16 20",
    "--sidebar-primary": "0.74 0.18 22",
    "--sidebar-primary-foreground": "0.16 0.04 20",
  },

  // 6. Teal — deep teal + electric cyan accent
  "rose-pink": {
    isDark: false,
    label: "Teal",
    "--background": "0.97 0.008 190",
    "--foreground": "0.14 0.06 190",
    "--card": "1 0 0",
    "--card-foreground": "0.14 0.06 190",
    "--popover": "1 0 0",
    "--popover-foreground": "0.14 0.06 190",
    "--primary": "0.34 0.12 193",
    "--primary-foreground": "0.97 0 0",
    "--secondary": "0.90 0.04 190",
    "--secondary-foreground": "0.28 0.10 193",
    "--muted": "0.93 0.02 190",
    "--muted-foreground": "0.48 0.05 190",
    "--accent": "0.72 0.22 190",
    "--accent-foreground": "0.12 0.07 190",
    "--destructive": "0.52 0.22 25",
    "--destructive-foreground": "0.98 0 0",
    "--border": "0.87 0.025 190",
    "--input": "0.87 0.025 190",
    "--ring": "0.72 0.22 190",
    "--sidebar-background": "0.22 0.10 193",
    "--sidebar-foreground": "0.94 0.01 190",
    "--sidebar-accent": "0.32 0.12 193",
    "--sidebar-accent-foreground": "0.97 0 0",
    "--sidebar-border": "0.32 0.10 193",
    "--sidebar-primary": "0.72 0.22 190",
    "--sidebar-primary-foreground": "0.12 0.07 190",
  },

  // 7. Slate — professional blue-gray + teal highlight
  "charcoal-dark": {
    isDark: false,
    label: "Slate",
    "--background": "0.96 0.006 222",
    "--foreground": "0.18 0.04 222",
    "--card": "1 0 0",
    "--card-foreground": "0.18 0.04 222",
    "--popover": "1 0 0",
    "--popover-foreground": "0.18 0.04 222",
    "--primary": "0.36 0.10 222",
    "--primary-foreground": "0.97 0 0",
    "--secondary": "0.90 0.025 222",
    "--secondary-foreground": "0.30 0.08 222",
    "--muted": "0.92 0.015 222",
    "--muted-foreground": "0.50 0.04 222",
    "--accent": "0.60 0.16 188",
    "--accent-foreground": "0.12 0.07 188",
    "--destructive": "0.52 0.22 25",
    "--destructive-foreground": "0.98 0 0",
    "--border": "0.86 0.015 222",
    "--input": "0.86 0.015 222",
    "--ring": "0.60 0.16 188",
    "--sidebar-background": "0.26 0.07 222",
    "--sidebar-foreground": "0.94 0.01 222",
    "--sidebar-accent": "0.36 0.08 222",
    "--sidebar-accent-foreground": "0.97 0 0",
    "--sidebar-border": "0.34 0.06 222",
    "--sidebar-primary": "0.60 0.16 188",
    "--sidebar-primary-foreground": "0.12 0.07 188",
  },

  // 8. Rose — deep rose + soft blush accent
  "midnight-dark": {
    isDark: false,
    label: "Rose",
    "--background": "0.97 0.008 358",
    "--foreground": "0.15 0.05 358",
    "--card": "1 0 0",
    "--card-foreground": "0.15 0.05 358",
    "--popover": "1 0 0",
    "--popover-foreground": "0.15 0.05 358",
    "--primary": "0.44 0.22 358",
    "--primary-foreground": "0.97 0 0",
    "--secondary": "0.91 0.04 358",
    "--secondary-foreground": "0.32 0.15 358",
    "--muted": "0.93 0.02 358",
    "--muted-foreground": "0.50 0.05 358",
    "--accent": "0.68 0.18 0",
    "--accent-foreground": "0.14 0.06 0",
    "--destructive": "0.52 0.22 25",
    "--destructive-foreground": "0.98 0 0",
    "--border": "0.87 0.025 358",
    "--input": "0.87 0.025 358",
    "--ring": "0.68 0.18 0",
    "--sidebar-background": "0.26 0.16 358",
    "--sidebar-foreground": "0.96 0.01 358",
    "--sidebar-accent": "0.36 0.18 358",
    "--sidebar-accent-foreground": "0.97 0 0",
    "--sidebar-border": "0.34 0.16 358",
    "--sidebar-primary": "0.68 0.18 0",
    "--sidebar-primary-foreground": "0.14 0.06 0",
  },

  // 9. Charcoal Dark — dark mode, charcoal + electric cyan accent
  "slate-gray": {
    isDark: true,
    label: "Charcoal Dark",
    "--background": "0.13 0.012 240",
    "--foreground": "0.92 0.01 240",
    "--card": "0.17 0.012 240",
    "--card-foreground": "0.92 0.01 240",
    "--popover": "0.17 0.012 240",
    "--popover-foreground": "0.92 0.01 240",
    "--primary": "0.68 0.20 193",
    "--primary-foreground": "0.10 0.01 240",
    "--secondary": "0.22 0.02 240",
    "--secondary-foreground": "0.86 0.01 240",
    "--muted": "0.22 0.015 240",
    "--muted-foreground": "0.60 0.02 240",
    "--accent": "0.72 0.22 190",
    "--accent-foreground": "0.10 0.01 240",
    "--destructive": "0.60 0.22 25",
    "--destructive-foreground": "0.97 0 0",
    "--border": "0.26 0.02 240",
    "--input": "0.26 0.02 240",
    "--ring": "0.68 0.20 193",
    "--sidebar-background": "0.10 0.01 240",
    "--sidebar-foreground": "0.90 0.01 240",
    "--sidebar-accent": "0.20 0.018 240",
    "--sidebar-accent-foreground": "0.92 0.01 240",
    "--sidebar-border": "0.20 0.018 240",
    "--sidebar-primary": "0.68 0.20 193",
    "--sidebar-primary-foreground": "0.10 0.01 240",
  },

  // 10. Midnight Dark — dark mode, midnight blue + vivid purple accent
  "crimson-red": {
    isDark: true,
    label: "Midnight Dark",
    "--background": "0.11 0.025 265",
    "--foreground": "0.92 0.015 265",
    "--card": "0.15 0.025 265",
    "--card-foreground": "0.92 0.015 265",
    "--popover": "0.15 0.025 265",
    "--popover-foreground": "0.92 0.015 265",
    "--primary": "0.62 0.24 285",
    "--primary-foreground": "0.97 0 0",
    "--secondary": "0.20 0.03 265",
    "--secondary-foreground": "0.86 0.015 265",
    "--muted": "0.20 0.025 265",
    "--muted-foreground": "0.58 0.03 265",
    "--accent": "0.56 0.26 312",
    "--accent-foreground": "0.97 0 0",
    "--destructive": "0.58 0.22 25",
    "--destructive-foreground": "0.97 0 0",
    "--border": "0.24 0.03 265",
    "--input": "0.24 0.03 265",
    "--ring": "0.62 0.24 285",
    "--sidebar-background": "0.09 0.020 265",
    "--sidebar-foreground": "0.90 0.015 265",
    "--sidebar-accent": "0.18 0.030 265",
    "--sidebar-accent-foreground": "0.92 0.015 265",
    "--sidebar-border": "0.18 0.030 265",
    "--sidebar-primary": "0.62 0.24 285",
    "--sidebar-primary-foreground": "0.97 0 0",
  },
};

// ─── Apply theme to DOM immediately (no page reload) ─────────────────────────
export function applyThemeToDom(themeId: string) {
  const vars = THEME_VARS[themeId] ?? THEME_VARS["navy-gold"];
  const root = document.documentElement;

  // Set every CSS variable in one pass — values are bare OKLCH channels
  const cssVarKeys = Object.keys(vars).filter((k) =>
    k.startsWith("--"),
  ) as Array<keyof ThemeVars>;

  for (const key of cssVarKeys) {
    root.style.setProperty(key, vars[key] as string);
  }

  // Set sidebar alias used by shadcn sidebar component
  root.style.setProperty("--sidebar", vars["--sidebar-background"]);
  root.style.setProperty("--sidebar-ring", vars["--ring"]);

  // Sync dark mode class
  if (vars.isDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // Force a repaint so the browser picks up all CSS variable changes immediately.
  // Reading offsetHeight triggers a layout flush without causing visible flicker.
  void root.offsetHeight;
}

interface AppState {
  currentRole: UserRole;
  currentSession: string;
  sessions: AcademicSession[];
  currentUser: UserAccount | null;
  notifications: Notification[];
  isAuthenticated: boolean;
  isSidebarCollapsed: boolean;
  discounts: StudentDiscount[];
  currentTheme: string;
  setRole: (role: UserRole) => void;
  setSession: (session: string) => void;
  setSessions: (sessions: AcademicSession[]) => void;
  setUser: (user: UserAccount | null) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  setAuthenticated: (value: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  logout: () => void;
  addDiscount: (discount: StudentDiscount) => void;
  updateDiscount: (discount: StudentDiscount) => void;
  removeDiscount: (id: string) => void;
  getDiscountsForStudent: (studentId: string) => StudentDiscount[];
  setTheme: (themeId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentRole: "Admin",
      currentSession: "2025-26",
      sessions: DEFAULT_SESSIONS,
      currentUser: null,
      notifications: [],
      isAuthenticated: false,
      isSidebarCollapsed: false,
      discounts: [],
      currentTheme: "navy-gold",

      setRole: (role) => set({ currentRole: role }),
      setSession: (session) => set({ currentSession: session }),
      setSessions: (sessions) => set({ sessions }),
      setUser: (user) => set({ currentUser: user }),
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        })),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (value) => set({ isSidebarCollapsed: value }),
      logout: () =>
        set({
          isAuthenticated: false,
          currentUser: null,
          currentRole: "Admin",
        }),
      addDiscount: (discount) =>
        set((state) => ({ discounts: [...state.discounts, discount] })),
      updateDiscount: (discount) =>
        set((state) => ({
          discounts: state.discounts.map((d) =>
            d.id === discount.id ? discount : d,
          ),
        })),
      removeDiscount: (id) =>
        set((state) => ({
          discounts: state.discounts.filter((d) => d.id !== id),
        })),
      getDiscountsForStudent: (studentId) =>
        get().discounts.filter((d) => d.studentId === studentId),
      setTheme: (themeId) => {
        set({ currentTheme: themeId });
        applyThemeToDom(themeId);
      },
    }),
    {
      name: "shubh-erp-store",
      partialize: (state) => ({
        currentRole: state.currentRole,
        currentSession: state.currentSession,
        sessions: state.sessions,
        isSidebarCollapsed: state.isSidebarCollapsed,
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
        discounts: state.discounts,
        currentTheme: state.currentTheme,
      }),
    },
  ),
);

export const useUnreadCount = () => {
  return useAppStore((s) => s.notifications.filter((n) => !n.isRead).length);
};
