import { AppLayout } from "@/components/layout/AppLayout";
import { applyThemeToDom, useAppStore } from "@/store/useAppStore";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import DriverTrackingPage from "@/pages/DriverTrackingPage";
// ─── Pages (static — small/public, needed immediately) ───────────────────────
import LoginPage from "@/pages/LoginPage";
import PublicLandingPage from "@/pages/PublicLandingPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import { Suspense, lazy, useEffect } from "react";

// ─── Pages (lazy — loaded on demand for faster initial bundle) ─────────────────
const AcademicsPage = lazy(() => import("@/pages/AcademicsPage"));
const AlumniPage = lazy(() => import("@/pages/AlumniPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const AttendancePage = lazy(() => import("@/pages/AttendancePage"));
const FaceAttendancePage = lazy(() => import("@/pages/FaceAttendancePage"));
const AttendanceReportPage = lazy(() => import("@/pages/AttendanceReportPage"));
const CertificateStudioPage = lazy(
  () => import("@/pages/CertificateStudioPage"),
);
const ChatPage = lazy(() => import("@/pages/ChatPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const CommunicationPage = lazy(() => import("@/pages/CommunicationPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const ExaminationsPage = lazy(() => import("@/pages/ExaminationsPage"));
const ExpensesPage = lazy(() => import("@/pages/ExpensesPage"));
const FeesPage = lazy(() => import("@/pages/FeesPage"));
const HRPage = lazy(() => import("@/pages/HRPage"));
const HelpPage = lazy(() => import("@/pages/HelpPage"));
const HomeworkPage = lazy(() => import("@/pages/HomeworkPage"));
const InventoryPage = lazy(() => import("@/pages/InventoryPage"));
const LibraryPage = lazy(() => import("@/pages/LibraryPage"));
const MyFeesPage = lazy(() => import("@/pages/MyFeesPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const SessionsPage = lazy(() => import("@/pages/SessionsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const StaffAttendanceReportPage = lazy(
  () => import("@/pages/StaffAttendanceReportPage"),
);
const StudentsPage = lazy(() => import("@/pages/StudentsPage"));
const SyllabusPage = lazy(() => import("@/pages/SyllabusPage"));
const TransportPage = lazy(() => import("@/pages/TransportPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const VirtualClassesPage = lazy(() => import("@/pages/VirtualClassesPage"));
const IndexPageEditorPage = lazy(() => import("@/pages/IndexPageEditorPage"));
const TimetablePage = lazy(() => import("@/pages/TimetablePage"));
const AcademicCalendarPage = lazy(() => import("@/pages/AcademicCalendarPage"));

// Apply persisted theme on startup (before first render)
applyThemeToDom(useAppStore.getState().currentTheme ?? "navy-gold");

// ─── Root ─────────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: Outlet,
});

// ─── Public routes ────────────────────────────────────────────────────────────
const publicLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PublicLandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Public driver tracking page — no auth required
const driverTrackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bus-track/$busId",
  component: DriverTrackingPage,
});

// Also support legacy query-param style URL /bus-track/live?busId=X
const driverTrackingLegacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/bus-track/live",
  component: DriverTrackingPage,
});

// ─── Protected layout wrapper ─────────────────────────────────────────────────
const PageLoader = (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

function ProtectedLayout() {
  const currentTheme = useAppStore((s) => s.currentTheme);
  useEffect(() => {
    applyThemeToDom(currentTheme ?? "navy-gold");
  }, [currentTheme]);

  return (
    <AppLayout>
      <Suspense fallback={PageLoader}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
}

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: ProtectedLayout,
  beforeLoad: () => {
    const { isAuthenticated } = useAppStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
});

// ─── App routes ───────────────────────────────────────────────────────────────
const dashboardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/dashboard",
  component: DashboardPage,
});
const academicsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/academics",
  component: AcademicsPage,
});
const studentsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/students",
  component: StudentsPage,
});
const feesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/fees",
  component: FeesPage,
});
const attendanceRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/attendance",
  component: AttendancePage,
});
const examinationsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/examinations",
  component: ExaminationsPage,
});
const hrRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/hr",
  component: HRPage,
});
const transportRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/transport",
  component: TransportPage,
});
const communicationRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/communication",
  component: CommunicationPage,
});
const virtualClassesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/virtual-classes",
  component: VirtualClassesPage,
});
const libraryRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/library",
  component: LibraryPage,
});
const inventoryRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/inventory",
  component: InventoryPage,
});
const certStudioRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/certificate-studio",
  component: CertificateStudioPage,
});
const analyticsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/analytics",
  component: AnalyticsPage,
});
const expensesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/expenses",
  component: ExpensesPage,
});
const homeworkRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/homework",
  component: HomeworkPage,
});
const reportsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/reports",
  component: ReportsPage,
});
const chatRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/chat",
  component: ChatPage,
});
const sessionsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/sessions",
  component: SessionsPage,
});
const usersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/users",
  component: UsersPage,
});
const settingsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/settings",
  component: SettingsPage,
});
const alumniRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/alumni",
  component: AlumniPage,
});
const helpRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/help",
  component: HelpPage,
});

const syllabusRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/syllabus",
  component: SyllabusPage,
});
const myFeesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/my-fees",
  component: MyFeesPage,
});

const attendanceReportRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/attendance-report",
  component: AttendanceReportPage,
});

const staffAttendanceReportRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/staff-attendance-report",
  component: StaffAttendanceReportPage,
});

const timetableRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/timetable",
  component: TimetablePage,
});

// ─── Router ───────────────────────────────────────────────────────────────────
const faceAttendanceRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/face-attendance",
  component: FaceAttendancePage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/unauthorized",
  component: UnauthorizedPage,
});

const indexPageEditorRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/landing-page-editor",
  component: IndexPageEditorPage,
});

const academicCalendarRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/academic-calendar",
  component: AcademicCalendarPage,
});

const routeTree = rootRoute.addChildren([
  publicLandingRoute,
  loginRoute,
  driverTrackingLegacyRoute,
  driverTrackingRoute,
  appRoute.addChildren([
    dashboardRoute,
    academicsRoute,
    studentsRoute,
    feesRoute,
    attendanceRoute,
    examinationsRoute,
    hrRoute,
    transportRoute,
    communicationRoute,
    virtualClassesRoute,
    libraryRoute,
    inventoryRoute,
    certStudioRoute,
    analyticsRoute,
    expensesRoute,
    homeworkRoute,
    reportsRoute,
    chatRoute,
    sessionsRoute,
    usersRoute,
    settingsRoute,
    alumniRoute,
    helpRoute,
    attendanceReportRoute,
    staffAttendanceReportRoute,
    timetableRoute,
    syllabusRoute,
    myFeesRoute,
    notificationsRoute,
    faceAttendanceRoute,
    unauthorizedRoute,
    indexPageEditorRoute,
    academicCalendarRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
