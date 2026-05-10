import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAddPickupPoint,
  useAddRoute,
  useDeletePickupPoint,
  useDeleteRoute,
  useGetBusLocations,
  usePickupPointsByRoute,
  useRoutes,
  useStudentsWithPickupPointsByRoute,
  useUpdateBusLocation,
  useUpdatePickupPoint,
  useUpdateRoute,
} from "@/hooks/useBackend";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { type BusLocation, CLASS_LABELS } from "@/types";
import type { PickupPoint, TransportRoute } from "@/types";
import {
  AlertCircle,
  Bus,
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  MapPin,
  Navigation,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Smartphone,
  Trash2,
  Users,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface GPSLocation {
  busNo: string;
  routeName: string;
  driver: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

const _GPS_DATA: GPSLocation[] = [
  {
    busNo: "UP32-AB-1234",
    routeName: "City Center Route",
    driver: "Ramesh Kumar",
    lat: 28.6139,
    lng: 77.209,
    updatedAt: "2 minutes ago",
  },
];

// ─── Route Students Panel (shown on double-click) ────────────────────────────
function RouteStudentsPanel({
  route,
  sessionId,
  onClose,
}: {
  route: TransportRoute;
  sessionId: string;
  onClose: () => void;
}) {
  const { data: items = [], isLoading } = useStudentsWithPickupPointsByRoute(
    route.id,
    sessionId,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      data-ocid="transport.route_students.dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="presentation"
    >
      <div className="relative w-full max-w-5xl mx-4 bg-card rounded-xl border border-border shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bus size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-foreground">
                {route.name}
              </h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Bus size={12} /> {route.busNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} /> {route.driverName}
                </span>
                {route.driverMobile && (
                  <a
                    href={`tel:${route.driverMobile}`}
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Phone size={12} /> {route.driverMobile}
                  </a>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-8 shrink-0"
            data-ocid="transport.route_students.close_button"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Student count + session badge */}
        <div className="px-6 py-3 border-b border-border bg-muted/20 flex items-center gap-2 shrink-0">
          <Users size={14} className="text-muted-foreground" />
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <span className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {items.length}
              </span>{" "}
              student{items.length !== 1 ? "s" : ""} assigned to this route
            </span>
          )}
          <Badge variant="secondary" className="ml-auto text-xs">
            Session: {sessionId}
          </Badge>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center px-6"
              data-ocid="transport.route_students.empty_state"
            >
              <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <Users size={28} className="text-muted-foreground" />
              </div>
              <p className="font-semibold text-foreground mb-1">
                No students assigned
              </p>
              <p className="text-sm text-muted-foreground">
                No students have been assigned to this route for session{" "}
                {sessionId}.
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 sticky top-0">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Student Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Adm. No
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Class
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Section
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Pickup Point
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Timing
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                    Monthly Fee (&#8377;)
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                    Parent Mobile
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map(({ student: s, pickupPoint: pp }, i) => (
                  <tr
                    key={s.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                    data-ocid={`transport.route_students.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {s.fullName}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {s.admNo}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {CLASS_LABELS[s.classLevel] ?? s.classLevel}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.sectionId || "\u2014"}
                    </td>
                    <td className="px-4 py-3">
                      {pp ? (
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                          <MapPin size={12} className="text-accent shrink-0" />
                          {pp.name}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          No pickup point
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {pp?.timing || "\u2014"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {pp ? (
                        <span className="font-semibold text-foreground">
                          {formatCurrency(pp.monthlyFare)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">\u2014</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {s.fatherMobile ? (
                        <a
                          href={`tel:${s.fatherMobile}`}
                          className="flex items-center gap-1 text-primary hover:underline text-xs"
                          data-ocid={`transport.route_students.call.${i + 1}`}
                        >
                          <Phone size={11} />
                          {s.fatherMobile}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">\u2014</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between shrink-0">
          <p className="text-xs text-muted-foreground">
            Monthly fee is based on each student&apos;s assigned pickup point.
          </p>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="transport.route_students.cancel_button"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Routes & Buses Tab ───────────────────────────────────────────────────────
function RoutesTab({
  routes,
  onRouteDoubleClick,
}: {
  routes: TransportRoute[];
  onRouteDoubleClick: (r: TransportRoute) => void;
}) {
  const addRoute = useAddRoute();
  const updateRoute = useUpdateRoute();
  const deleteRoute = useDeleteRoute();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TransportRoute | null>(null);
  const [form, setForm] = useState({
    name: "",
    busNumber: "",
    driverName: "",
    driverMobile: "",
  });

  function openAdd() {
    setForm({ name: "", busNumber: "", driverName: "", driverMobile: "" });
    setEditing(null);
    setOpen(true);
  }
  function openEdit(r: TransportRoute) {
    setForm({
      name: r.name,
      busNumber: r.busNumber,
      driverName: r.driverName,
      driverMobile: r.driverMobile,
    });
    setEditing(r);
    setOpen(true);
  }
  function save() {
    if (!form.name) return;
    if (editing) {
      updateRoute.mutate(
        {
          id: editing.id,
          name: form.name,
          busNumber: form.busNumber,
          driverName: form.driverName,
          driverMobile: form.driverMobile,
        },
        {
          onSuccess: () => {
            toast.success("Route updated successfully");
            setOpen(false);
          },
          onError: (e) => toast.error((e as Error).message),
        },
      );
    } else {
      addRoute.mutate(
        {
          name: form.name,
          busNumber: form.busNumber,
          driverName: form.driverName,
          driverMobile: form.driverMobile,
        },
        {
          onSuccess: () => {
            toast.success("Route added successfully");
            setOpen(false);
          },
          onError: (e) => toast.error((e as Error).message),
        },
      );
    }
  }
  function remove(id: string) {
    deleteRoute.mutate(id, {
      onSuccess: () => toast.success("Route deleted"),
      onError: (e) => toast.error((e as Error).message),
    });
  }

  const isSaving = addRoute.isPending || updateRoute.isPending;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {routes.length} route{routes.length !== 1 ? "s" : ""} configured
        </p>
        <Button
          size="sm"
          onClick={openAdd}
          data-ocid="transport.routes.add_button"
        >
          <Plus size={14} className="mr-1.5" /> Add Route
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/20 border-b border-border text-xs text-muted-foreground">
          <Users size={12} />
          Double-click any route row to view assigned students with pickup
          points
        </div>
        {routes.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 text-center px-6"
            data-ocid="transport.routes.empty_state"
          >
            <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Bus size={28} className="text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground mb-1">No routes yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first route to start assigning students and pickup
              points.
            </p>
            <Button size="sm" onClick={openAdd}>
              <Plus size={14} className="mr-1.5" /> Add First Route
            </Button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Route Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Bus No
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Driver
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Mobile
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-0 table-row-alt hover:bg-muted/20 transition-colors cursor-pointer select-none"
                  data-ocid={`transport.routes.item.${i + 1}`}
                  onDoubleClick={() => onRouteDoubleClick(r)}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <Bus size={14} className="text-primary shrink-0" />
                      {r.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">
                    {r.busNumber}
                  </td>
                  <td className="px-4 py-3 text-foreground">{r.driverName}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${r.driverMobile}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                      data-ocid={`transport.routes.call.${i + 1}`}
                    >
                      <Phone size={12} />
                      {r.driverMobile}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={r.isActive ? "default" : "secondary"}>
                      {r.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => openEdit(r)}
                        data-ocid={`transport.routes.edit_button.${i + 1}`}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => remove(r.id)}
                        disabled={deleteRoute.isPending}
                        data-ocid={`transport.routes.delete_button.${i + 1}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="transport.routes.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Route" : "Add Route"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label>Route Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="e.g. City Center Route"
                  data-ocid="transport.routes.name.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Bus Number</Label>
                <Input
                  value={form.busNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, busNumber: e.target.value }))
                  }
                  placeholder="UP32-AB-1234"
                  data-ocid="transport.routes.bus_no.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Driver Name</Label>
                <Input
                  value={form.driverName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, driverName: e.target.value }))
                  }
                  placeholder="Driver full name"
                  data-ocid="transport.routes.driver.input"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Driver Mobile</Label>
                <Input
                  value={form.driverMobile}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, driverMobile: e.target.value }))
                  }
                  placeholder="10-digit mobile"
                  data-ocid="transport.routes.mobile.input"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="transport.routes.cancel_button"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={isSaving}
              data-ocid="transport.routes.submit_button"
              type="button"
            >
              {isSaving
                ? "Saving\u2026"
                : editing
                  ? "Save Changes"
                  : "Add Route"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Pickup Points Tab ────────────────────────────────────────────────────────
function PickupPointsTab({ routes }: { routes: TransportRoute[] }) {
  const [routeFilter, setRouteFilter] = useState(routes[0]?.id ?? "");
  const effectiveRouteId = routeFilter || (routes[0]?.id ?? "");
  const { data: allPoints = [], isLoading: loadingPoints } =
    usePickupPointsByRoute(effectiveRouteId);
  const addPoint = useAddPickupPoint();
  const updatePoint = useUpdatePickupPoint();
  const deletePoint = useDeletePickupPoint();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PickupPoint | null>(null);
  const [form, setForm] = useState({
    routeId: "",
    name: "",
    timing: "07:30",
    monthlyFare: "",
    order: "1",
  });

  const filtered = allPoints.filter((p) =>
    routeFilter ? p.routeId === routeFilter : true,
  );
  const getRouteName = (id: string) =>
    routes.find((r) => r.id === id)?.name ?? "\u2014";

  function openAdd() {
    const defaultRoute = routeFilter || (routes[0]?.id ?? "");
    setForm({
      routeId: defaultRoute,
      name: "",
      timing: "07:30",
      monthlyFare: "",
      order: String(
        allPoints.filter((p) => p.routeId === defaultRoute).length + 1,
      ),
    });
    setEditing(null);
    setOpen(true);
  }
  function openEdit(p: PickupPoint) {
    setForm({
      routeId: p.routeId,
      name: p.name,
      timing: p.timing ?? "07:30",
      monthlyFare: String(p.monthlyFare),
      order: String(p.order ?? 1),
    });
    setEditing(p);
    setOpen(true);
  }
  function save() {
    if (!form.name || !form.routeId) return;
    const fare = Number(form.monthlyFare) || 0;
    const order = Number(form.order) || 1;
    if (editing) {
      updatePoint.mutate(
        {
          id: editing.id,
          routeId: form.routeId,
          name: form.name,
          timing: form.timing,
          monthlyFare: fare,
          order,
        },
        {
          onSuccess: () => {
            toast.success("Pickup point updated");
            setOpen(false);
          },
          onError: (e) => toast.error((e as Error).message),
        },
      );
    } else {
      addPoint.mutate(
        {
          routeId: form.routeId,
          name: form.name,
          timing: form.timing,
          monthlyFare: fare,
          order,
        },
        {
          onSuccess: () => {
            toast.success("Pickup point added");
            setOpen(false);
          },
          onError: (e) => toast.error((e as Error).message),
        },
      );
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 justify-between">
        <Select
          value={effectiveRouteId}
          onValueChange={(v) => setRouteFilter(v)}
        >
          <SelectTrigger
            className="w-56"
            data-ocid="transport.points.route_filter"
          >
            <SelectValue placeholder="Select Route" />
          </SelectTrigger>
          <SelectContent>
            {routes.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={openAdd}
          data-ocid="transport.points.add_button"
        >
          <Plus size={14} className="mr-1.5" /> Add Pickup Point
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        {loadingPoints ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded" />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-center px-3 py-3 font-semibold text-muted-foreground w-10">
                  #
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Point Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Route
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Timing
                </th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                  Monthly Fare
                </th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-muted-foreground text-sm"
                    data-ocid="transport.points.empty_state"
                  >
                    No pickup points for this route. Click &ldquo;Add Pickup
                    Point&rdquo; to create one.
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-border last:border-0 table-row-alt hover:bg-muted/20 transition-colors"
                  data-ocid={`transport.points.item.${i + 1}`}
                >
                  <td className="px-3 py-3 text-center text-muted-foreground text-xs font-mono">
                    {p.order}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-accent" />
                      {p.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {getRouteName(p.routeId)}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {p.timing || "\u2014"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">
                    {formatCurrency(p.monthlyFare)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => openEdit(p)}
                        data-ocid={`transport.points.edit_button.${i + 1}`}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() =>
                          deletePoint.mutate(
                            { id: p.id, routeId: p.routeId },
                            {
                              onSuccess: () =>
                                toast.success("Pickup point deleted"),
                              onError: (e) => toast.error((e as Error).message),
                            },
                          )
                        }
                        data-ocid={`transport.points.delete_button.${i + 1}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="transport.points.dialog">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Pickup Point" : "Add Pickup Point"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Route</Label>
              <Select
                value={form.routeId}
                onValueChange={(v) => setForm((f) => ({ ...f, routeId: v }))}
              >
                <SelectTrigger data-ocid="transport.points.route.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Point Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Civil Lines"
                data-ocid="transport.points.name.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Pickup Timing</Label>
                <Input
                  type="time"
                  value={form.timing}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, timing: e.target.value }))
                  }
                  data-ocid="transport.points.timing.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Order / Sequence</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: e.target.value }))
                  }
                  placeholder="1"
                  data-ocid="transport.points.order.input"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Monthly Fare (&#8377;)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
                  &#8377;
                </span>
                <Input
                  className="pl-7"
                  type="number"
                  min="0"
                  step="50"
                  value={form.monthlyFare}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, monthlyFare: e.target.value }))
                  }
                  placeholder="1200"
                  data-ocid="transport.points.fare.input"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              data-ocid="transport.points.cancel_button"
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={addPoint.isPending || updatePoint.isPending}
              data-ocid="transport.points.submit_button"
              type="button"
            >
              {addPoint.isPending || updatePoint.isPending
                ? "Saving\u2026"
                : editing
                  ? "Save Changes"
                  : "Add Point"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── GPS Tracking Tab ─────────────────────────────────────────────────────────
function LiveTrackingTab({ routes }: { routes: TransportRoute[] }) {
  const {
    data: busLocations = [],
    dataUpdatedAt,
    refetch,
  } = useGetBusLocations();
  const updateLocation = useUpdateBusLocation();
  const [guideOpen, setGuideOpen] = useState(false);
  const [form, setForm] = useState({
    busId: "",
    routeId: routes[0]?.id ?? "",
    lat: "",
    lng: "",
  });
  const [lastRefreshed, setLastRefreshed] = useState<string>(() =>
    new Date().toLocaleTimeString(),
  );

  // Format nanoseconds timestamp → dd/mm/yyyy HH:MM
  function fmtNano(ns: bigint): string {
    if (!ns) return "\u2014";
    const ms = Number(ns) / 1_000_000;
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }

  // Update "last refreshed" time whenever data changes
  const prevUpdatedAt = dataUpdatedAt;
  if (prevUpdatedAt) {
    const ts = new Date(prevUpdatedAt).toLocaleTimeString();
    if (ts !== lastRefreshed) setLastRefreshed(ts);
  }

  // Compute bbox for OSM embed from bus locations
  function getOSMUrl(): string {
    const lats = busLocations.filter((b) => b.isActive).map((b) => b.latitude);
    const lngs = busLocations.filter((b) => b.isActive).map((b) => b.longitude);
    if (lats.length === 0) {
      return "https://www.openstreetmap.org/export/embed.html?bbox=80.8%2C26.7%2C81.1%2C26.9&layer=mapnik";
    }
    const minLat = Math.min(...lats) - 0.02;
    const maxLat = Math.max(...lats) + 0.02;
    const minLng = Math.min(...lngs) - 0.02;
    const maxLng = Math.max(...lngs) + 0.02;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng}%2C${minLat}%2C${maxLng}%2C${maxLat}&layer=mapnik`;
  }

  function handleManualUpdate() {
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (!form.busId.trim()) {
      toast.error("Please enter a Bus ID");
      return;
    }
    if (!form.routeId) {
      toast.error("Please select a route");
      return;
    }
    if (Number.isNaN(lat) || lat === 0) {
      toast.error("Enter a valid latitude (e.g. 26.8467)");
      return;
    }
    if (Number.isNaN(lng) || lng === 0) {
      toast.error("Enter a valid longitude (e.g. 80.9462)");
      return;
    }
    updateLocation.mutate(
      {
        busId: form.busId.trim(),
        routeId: form.routeId,
        latitude: lat,
        longitude: lng,
      },
      {
        onSuccess: () => {
          toast.success("Bus location updated successfully");
          setForm((f) => ({ ...f, busId: "", lat: "", lng: "" }));
          refetch();
          setLastRefreshed(new Date().toLocaleTimeString());
        },
        onError: (e) =>
          toast.error((e as Error).message ?? "Failed to update location"),
      },
    );
  }

  const activeBuses = busLocations.filter((b) => b.isActive);

  return (
    <div className="p-6 space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Navigation size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-foreground">
              Live Bus Tracking
            </h2>
            <p className="text-xs text-muted-foreground">
              Auto-refreshes every 30 seconds
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock size={11} /> Last refreshed: {lastRefreshed}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              refetch();
              setLastRefreshed(new Date().toLocaleTimeString());
            }}
            data-ocid="transport.tracking.refresh_button"
            type="button"
          >
            <RefreshCw size={13} className="mr-1.5" /> Refresh Now
          </Button>
        </div>
      </div>

      {/* Map Section */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MapPin size={15} className="text-primary" /> Live Map
            {activeBuses.length > 0 ? (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <span className="size-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                {activeBuses.length} bus{activeBuses.length !== 1 ? "es" : ""}{" "}
                online
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <WifiOff size={11} /> No buses online
              </span>
            )}
          </div>
          <a
            href="https://www.openstreetmap.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Open full map \u2197
          </a>
        </div>
        <div className="relative" style={{ height: 280 }}>
          <iframe
            title="School Bus Live Map"
            src={getOSMUrl()}
            className="w-full h-full border-0"
            loading="lazy"
            data-ocid="transport.tracking.map"
          />
          {activeBuses.length === 0 && (
            <div className="absolute inset-0 bg-background/60 flex flex-col items-center justify-center gap-2 pointer-events-none">
              <Wifi size={28} className="text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                No active bus locations
              </p>
              <p className="text-xs text-muted-foreground">
                Use the form below to simulate a position
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bus Cards */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-foreground font-display">
          Bus Locations
        </h3>
        {busLocations.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-border bg-muted/20 text-center"
            data-ocid="transport.tracking.empty_state"
          >
            <Bus size={28} className="text-muted-foreground mb-2" />
            <p className="font-medium text-foreground">
              No buses registered yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Use the Manual Update form below to add a bus location, or connect
              a GPS device.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {busLocations.map((bus: BusLocation, i: number) => (
              <div
                key={bus.busId}
                className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors"
                data-ocid={`transport.tracking.item.${i + 1}`}
              >
                <div
                  className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                    bus.isActive ? "bg-green-500/10" : "bg-muted/50"
                  }`}
                >
                  <Bus
                    size={18}
                    className={
                      bus.isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {bus.busId}
                    </p>
                    <Badge
                      variant={bus.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {bus.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {bus.routeName} &middot; Driver: {bus.driverName}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={10} /> {bus.latitude.toFixed(5)},{" "}
                      {bus.longitude.toFixed(5)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={10} /> {fmtNano(bus.updatedAt)}
                    </span>
                  </div>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${bus.latitude}&mlon=${bus.longitude}&zoom=15`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline mt-1 inline-block"
                    data-ocid={`transport.tracking.map_link.${i + 1}`}
                  >
                    View on map \u2197
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Location Update Form */}
      <div
        className="rounded-xl border border-border bg-card p-5 space-y-4"
        data-ocid="transport.tracking.manual_panel"
      >
        <div className="flex items-center gap-2">
          <Navigation size={16} className="text-primary" />
          <h3 className="font-semibold text-foreground font-display">
            Manual Location Update
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Test GPS tracking or manually update a bus position. Useful before
          hardware is installed.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Bus ID / Bus Number</Label>
            <Input
              value={form.busId}
              onChange={(e) =>
                setForm((f) => ({ ...f, busId: e.target.value }))
              }
              placeholder="e.g. UP32-AB-1234"
              data-ocid="transport.tracking.bus_id.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Route</Label>
            <Select
              value={form.routeId}
              onValueChange={(v) => setForm((f) => ({ ...f, routeId: v }))}
            >
              <SelectTrigger data-ocid="transport.tracking.route.select">
                <SelectValue placeholder="Select route" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Latitude</Label>
            <Input
              type="number"
              step="0.0001"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
              placeholder="e.g. 26.8467"
              data-ocid="transport.tracking.lat.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Longitude</Label>
            <Input
              type="number"
              step="0.0001"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
              placeholder="e.g. 80.9462"
              data-ocid="transport.tracking.lng.input"
            />
          </div>
        </div>
        <Button
          onClick={handleManualUpdate}
          disabled={updateLocation.isPending}
          data-ocid="transport.tracking.update_button"
          type="button"
        >
          <MapPin size={14} className="mr-1.5" />
          {updateLocation.isPending ? "Updating\u2026" : "Update Location"}
        </Button>
      </div>

      {/* Live Tracking Options — Driver Mobile vs Jio Motive OBD */}
      <div
        className="rounded-xl border-2 border-primary/20 bg-primary/5 overflow-hidden"
        data-ocid="transport.tracking.options_card"
      >
        <div className="px-5 py-4 border-b border-primary/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-primary" />
            <h3 className="font-display font-bold text-foreground">
              How to Enable Live Bus Tracking
            </h3>
          </div>
          <Badge className="bg-primary text-primary-foreground text-xs">
            Choose an Option
          </Badge>
        </div>
        <div className="p-5 grid gap-4 sm:grid-cols-2">
          {/* Option A — Driver Mobile */}
          <div
            className="rounded-xl border border-border bg-card p-4 space-y-3"
            data-ocid="transport.tracking.option_mobile_card"
          >
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Smartphone
                  size={18}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Option A — Driver&apos;s Mobile Phone
                </p>
                <p className="text-xs text-muted-foreground">
                  Zero hardware cost
                </p>
              </div>
            </div>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                Works on any smartphone with a browser
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                ~5–10 metre GPS accuracy
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                Driver bookmarks a URL — no app install
              </li>
              <li className="flex items-start gap-2 text-destructive">
                <span className="shrink-0 mt-0.5">⚠</span>
                Stops if screen locks or browser closes
              </li>
              <li className="flex items-start gap-2 text-destructive">
                <span className="shrink-0 mt-0.5">⚠</span>
                Requires driver to keep tab open while driving
              </li>
            </ul>
            <div className="rounded-lg bg-muted/50 border border-border p-3">
              <p className="text-xs font-semibold text-foreground mb-1">
                How to enable:
              </p>
              <p className="text-xs text-muted-foreground">
                Share this URL with the driver — they open it in Chrome on their
                phone before starting the route:
              </p>
              <div className="mt-1.5 bg-card border border-border rounded px-2 py-1.5 font-mono text-xs break-all select-all">
                {window.location.origin}/bus-track/{routes[0]?.id ?? "BUS_ID"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Replace <strong>BUS_ID</strong> with your actual Bus ID (e.g.
                the route ID or bus number).
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const url = `${window.location.origin}/bus-track/${routes[0]?.id ?? "demo"}`;
                  navigator.clipboard
                    .writeText(url)
                    .then(() =>
                      toast.success("Driver tracking URL copied to clipboard!"),
                    );
                }}
                data-ocid="transport.tracking.copy_driver_url_button"
                type="button"
              >
                <Phone size={13} className="mr-1.5" /> Copy Driver URL
              </Button>
              {"share" in navigator && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    const url = `${window.location.origin}/bus-track/${routes[0]?.id ?? "demo"}`;
                    navigator
                      .share({ title: "Bus Tracking Link", url })
                      .catch(() => {});
                  }}
                  data-ocid="transport.tracking.share_driver_url_button"
                  type="button"
                >
                  <Navigation size={13} className="mr-1.5" /> Share Link
                </Button>
              )}
            </div>
          </div>

          {/* Option B — Jio Motive OBD */}
          <div
            className="rounded-xl border-2 border-green-500/30 bg-green-500/5 p-4 space-y-3 relative"
            data-ocid="transport.tracking.option_jio_card"
          >
            <Badge className="absolute top-3 right-3 bg-green-600 text-white text-xs">
              Recommended
            </Badge>
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <Wifi
                  size={18}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Option B — Jio Motive OBD Device
                </p>
                <p className="text-xs text-muted-foreground">
                  Plug-in, fully automatic
                </p>
              </div>
            </div>
            <ul className="space-y-1.5 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                Plugs into OBD-II port under bus dashboard
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                Automatic — works even if driver&apos;s phone is off
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                Jio Motive REST API polls location every 30 seconds
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                Best for schools with 3+ buses
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-muted-foreground shrink-0 mt-0.5">₹</span>
                OBD device: <strong>&#8377;1,500&ndash;2,000</strong> one-time
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <span className="text-muted-foreground shrink-0 mt-0.5">₹</span>
                Jio Motive subscription:{" "}
                <strong>&#8377;99&ndash;199/month</strong> per bus
              </li>
            </ul>
            <div className="rounded-lg bg-card border border-green-500/20 p-3">
              <p className="text-xs font-semibold text-foreground mb-1">
                How it connects:
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal ml-4">
                <li>
                  Buy Jio Motive OBD device from{" "}
                  <strong>jiomotivefleet.com</strong>
                </li>
                <li>Plug into bus OBD-II port &amp; activate SIM</li>
                <li>Enter your Jio Motive API key in ERP Settings</li>
                <li>
                  ERP auto-polls location every 30 seconds via HTTP outcalls
                </li>
              </ol>
            </div>
            <a
              href="https://jiomotivefleet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 w-full text-sm font-medium text-green-700 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg py-2 hover:bg-green-500/15 transition-colors"
              data-ocid="transport.tracking.jio_motive_link"
            >
              <Navigation size={13} /> Visit Jio Motive Fleet ↗
            </a>
          </div>
        </div>
        <div className="px-5 pb-4">
          <div className="flex items-start gap-2 rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground">
            <Info size={13} className="shrink-0 mt-0.5" />
            <span>
              <strong>Not sure which to choose?</strong> Start with Option A
              (Driver Mobile) — it costs nothing and works immediately. Upgrade
              to Jio Motive OBD when you want a fully automatic, always-on
              solution that doesn&apos;t depend on the driver remembering to
              open a browser tab.
            </span>
          </div>
        </div>
      </div>

      {/* Hardware Setup Guide */}
      <div
        className="rounded-xl border border-border bg-card overflow-hidden"
        data-ocid="transport.tracking.guide_panel"
      >
        <button
          type="button"
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors"
          onClick={() => setGuideOpen((o) => !o)}
          data-ocid="transport.tracking.guide_toggle"
        >
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-primary" />
            <span className="font-semibold text-foreground font-display">
              How to Set Up GPS Tracking for School Buses
            </span>
          </div>
          {guideOpen ? (
            <ChevronUp size={16} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={16} className="text-muted-foreground" />
          )}
        </button>
        {guideOpen && (
          <div className="px-5 pb-5 border-t border-border space-y-4 pt-4">
            <div
              className="flex items-start gap-2 rounded-lg bg-accent/10 border border-accent/20 p-3 text-sm"
              data-ocid="transport.tracking.guide_info"
            >
              <AlertCircle size={15} className="text-accent shrink-0 mt-0.5" />
              <span className="text-muted-foreground">
                This guide helps you set up real-time GPS tracking for your
                school buses so parents and admins can see live bus locations.
              </span>
            </div>
            <ol className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    Buy a GPS Tracker Device
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Purchase a SIM-based GPS tracker from Amazon India or local
                    electronics stores. Good options:
                  </p>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground list-disc ml-4">
                    <li>
                      <strong>Teltonika FMB920</strong> &mdash; Professional
                      grade, very reliable
                    </li>
                    <li>
                      <strong>Queclink GV65</strong> &mdash; Compact and easy to
                      install
                    </li>
                    <li>
                      <strong>OBD GPS Tracker</strong> &mdash; Plug-and-play via
                      OBD port (easiest)
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-1">
                    <strong>Cost:</strong> &#8377;1,500 &ndash; &#8377;3,000 per
                    device on Amazon India.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    Insert a SIM Card with Data Plan
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Use an Airtel or Jio nano-SIM with a data plan. A basic
                    IoT/data plan is enough &mdash; approximately{" "}
                    <strong>&#8377;50&ndash;&#8377;100/month per bus</strong>.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    Configure the Device to Send Location
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Set up the GPS device to POST location data to this system
                    every 30 seconds. Use your device&apos;s configuration app
                    or SMS commands to set the server URL:
                  </p>
                  <div className="mt-2 bg-muted/50 rounded-md p-2.5 font-mono text-xs border border-border break-all">
                    POST /api/update-location
                    <br />
                    {
                      '{"busId": "UP32-AB-1234", "routeId": "r1", "lat": 26.8467, "lng": 80.9462}'
                    }
                  </div>
                  <p className="text-muted-foreground mt-1.5 text-xs">
                    Interval: every 30 seconds (recommended). The ERP will
                    automatically display the latest position.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    Verify on the Map
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Once the device is set up and the bus is running, the map
                    above will show the live position. The bus card will appear
                    under &ldquo;Bus Locations&rdquo; with the last updated
                    time.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  5
                </span>
                <div>
                  <p className="font-semibold text-foreground">
                    Share Tracking Link with Parents
                  </p>
                  <p className="text-muted-foreground mt-0.5">
                    Parents can be given a shareable tracking link so they can
                    check the live bus location from their phone without needing
                    to log in.
                  </p>
                </div>
              </li>
            </ol>
            <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm">
              <p className="font-semibold text-foreground mb-1">
                Benefits of Live Bus Tracking
              </p>
              <ul className="text-muted-foreground space-y-0.5 list-disc ml-4">
                <li>Real-time bus location visible to admin and parents</li>
                <li>
                  Parent peace-of-mind &mdash; know exactly when the bus will
                  arrive
                </li>
                <li>
                  Route monitoring &mdash; ensure drivers follow the correct
                  route
                </li>
                <li>Driver accountability and safety record</li>
              </ul>
            </div>
            <div className="flex items-start gap-2 rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground">
              <Info size={13} className="shrink-0 mt-0.5" />
              <span>
                <strong>Testing tip:</strong> Before buying hardware, use the{" "}
                <strong>Manual Location Update</strong> form above to simulate
                bus positions and verify the map is working correctly.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function TransportPage() {
  const [activeTab, setActiveTab] = useState("routes");
  const { data: routes = [] } = useRoutes();
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(
    null,
  );
  const currentSession = useAppStore((s) => s.currentSession);

  return (
    <div className="flex flex-col h-full min-h-0" data-ocid="transport.page">
      {/* Route Students Panel — portal-style, z-50 */}
      {selectedRoute && (
        <RouteStudentsPanel
          route={selectedRoute}
          sessionId={currentSession}
          onClose={() => setSelectedRoute(null)}
        />
      )}
      <div className="bg-card border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bus className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Transport
            </h1>
            <p className="text-sm text-muted-foreground">
              Routes, pickup points &amp; GPS tracking
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="bg-card border-b px-6 flex-shrink-0">
          <TabsList
            className="h-12 bg-transparent p-0 gap-1"
            data-ocid="transport.tabs"
          >
            <TabsTrigger
              value="routes"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="transport.routes.tab"
            >
              <Bus size={14} /> Routes &amp; Buses
            </TabsTrigger>
            <TabsTrigger
              value="points"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="transport.points.tab"
            >
              <MapPin size={14} /> Pickup Points
            </TabsTrigger>
            <TabsTrigger
              value="gps"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="transport.gps.tab"
            >
              <Navigation size={14} /> Live Tracking
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 min-h-0 overflow-auto bg-background">
          <TabsContent value="routes" className="m-0 p-0 h-full">
            <RoutesTab
              routes={routes}
              onRouteDoubleClick={(r) => setSelectedRoute(r)}
            />
          </TabsContent>
          <TabsContent value="points" className="m-0 p-0 h-full">
            <PickupPointsTab routes={routes} />
          </TabsContent>
          <TabsContent value="gps" className="m-0 p-0 h-full">
            <LiveTrackingTab routes={routes} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
