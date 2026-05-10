import { r as reactExports, a6 as useRoutes, d as useAppStore, j as jsxRuntimeExports, ap as Bus, _ as MapPin, dx as Navigation, dy as useStudentsWithPickupPointsByRoute, U as Users, $ as Phone, e as Button, X, S as Skeleton, t as Badge, i as CLASS_LABELS, bk as formatCurrency, dz as useAddRoute, dA as useUpdateRoute, dB as useDeleteRoute, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, I as Input, k as DialogFooter, dg as usePickupPointsByRoute, dC as useAddPickupPoint, dD as useUpdatePickupPoint, dE as useDeletePickupPoint, F as ue, dF as useGetBusLocations, dG as useUpdateBusLocation, dH as WifiOff, cT as Wifi } from "./index-pMBTUEbj.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { P as Pencil } from "./pencil-CU7v6fNP.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { R as RefreshCw } from "./refresh-cw-BgXF1ld8.js";
import { S as Smartphone } from "./smartphone-DHS3LfhR.js";
import { I as Info } from "./info-CUpF_eRC.js";
import { a as ChevronUp, C as ChevronDown } from "./index-Nv6ob_Pe.js";
import { C as CircleAlert } from "./circle-alert-5rCM7BJk.js";
function RouteStudentsPanel({
  route,
  sessionId,
  onClose
}) {
  const { data: items = [], isLoading } = useStudentsWithPickupPointsByRoute(
    route.id,
    sessionId
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      "data-ocid": "transport.route_students.dialog",
      onClick: (e) => {
        if (e.target === e.currentTarget) onClose();
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") onClose();
      },
      role: "presentation",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-5xl mx-4 bg-card rounded-xl border border-border shadow-2xl flex flex-col max-h-[90vh]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { size: 18, className: "text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-display font-bold text-foreground", children: route.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { size: 12 }),
                  " ",
                  route.busNumber
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12 }),
                  " ",
                  route.driverName
                ] }),
                route.driverMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `tel:${route.driverMobile}`,
                    className: "flex items-center gap-1 text-primary hover:underline",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 12 }),
                      " ",
                      route.driverMobile
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: onClose,
              className: "size-8 shrink-0",
              "data-ocid": "transport.route_students.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-3 border-b border-border bg-muted/20 flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 14, className: "text-muted-foreground" }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: items.length }),
            " ",
            "student",
            items.length !== 1 ? "s" : "",
            " assigned to this route"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
            "Session: ",
            sessionId
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded-md" }, i)) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 text-center px-6",
            "data-ocid": "transport.route_students.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 28, className: "text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "No students assigned" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "No students have been assigned to this route for session",
                " ",
                sessionId,
                "."
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40 sticky top-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "#" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Student Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Adm. No" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Section" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Pickup Point" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Timing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-muted-foreground", children: "Monthly Fee (₹)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Parent Mobile" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map(({ student: s, pickupPoint: pp }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
              "data-ocid": `transport.route_students.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: i + 1 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: s.fullName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: s.admNo }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: CLASS_LABELS[s.classLevel] ?? s.classLevel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: s.sectionId || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: pp ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 font-medium text-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12, className: "text-accent shrink-0" }),
                  pp.name
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs italic", children: "No pickup point" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: (pp == null ? void 0 : pp.timing) || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: pp ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatCurrency(pp.monthlyFare) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "\\u2014" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: s.fatherMobile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: `tel:${s.fatherMobile}`,
                    className: "flex items-center gap-1 text-primary hover:underline text-xs",
                    "data-ocid": `transport.route_students.call.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 11 }),
                      s.fatherMobile
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "\\u2014" }) })
              ]
            },
            s.id
          )) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Monthly fee is based on each student's assigned pickup point." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "transport.route_students.cancel_button",
              children: "Close"
            }
          )
        ] })
      ] })
    }
  );
}
function RoutesTab({
  routes,
  onRouteDoubleClick
}) {
  const addRoute = useAddRoute();
  const updateRoute = useUpdateRoute();
  const deleteRoute = useDeleteRoute();
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    name: "",
    busNumber: "",
    driverName: "",
    driverMobile: ""
  });
  function openAdd() {
    setForm({ name: "", busNumber: "", driverName: "", driverMobile: "" });
    setEditing(null);
    setOpen(true);
  }
  function openEdit(r) {
    setForm({
      name: r.name,
      busNumber: r.busNumber,
      driverName: r.driverName,
      driverMobile: r.driverMobile
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
          driverMobile: form.driverMobile
        },
        {
          onSuccess: () => {
            ue.success("Route updated successfully");
            setOpen(false);
          },
          onError: (e) => ue.error(e.message)
        }
      );
    } else {
      addRoute.mutate(
        {
          name: form.name,
          busNumber: form.busNumber,
          driverName: form.driverName,
          driverMobile: form.driverMobile
        },
        {
          onSuccess: () => {
            ue.success("Route added successfully");
            setOpen(false);
          },
          onError: (e) => ue.error(e.message)
        }
      );
    }
  }
  function remove(id) {
    deleteRoute.mutate(id, {
      onSuccess: () => ue.success("Route deleted"),
      onError: (e) => ue.error(e.message)
    });
  }
  const isSaving = addRoute.isPending || updateRoute.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        routes.length,
        " route",
        routes.length !== 1 ? "s" : "",
        " configured"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: openAdd,
          "data-ocid": "transport.routes.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
            " Add Route"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border overflow-hidden bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-muted/20 border-b border-border text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12 }),
        "Double-click any route row to view assigned students with pickup points"
      ] }),
      routes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-16 text-center px-6",
          "data-ocid": "transport.routes.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { size: 28, className: "text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "No routes yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Add your first route to start assigning students and pickup points." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openAdd, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
              " Add First Route"
            ] })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Route Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Bus No" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Driver" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Mobile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-muted-foreground", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: routes.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 table-row-alt hover:bg-muted/20 transition-colors cursor-pointer select-none",
            "data-ocid": `transport.routes.item.${i + 1}`,
            onDoubleClick: () => onRouteDoubleClick(r),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { size: 14, className: "text-primary shrink-0" }),
                r.name
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-foreground", children: r.busNumber }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: r.driverName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `tel:${r.driverMobile}`,
                  className: "flex items-center gap-1 text-primary hover:underline",
                  "data-ocid": `transport.routes.call.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 12 }),
                    r.driverMobile
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: r.isActive ? "default" : "secondary", children: r.isActive ? "Active" : "Inactive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8",
                    onClick: () => openEdit(r),
                    "data-ocid": `transport.routes.edit_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8 text-destructive hover:text-destructive",
                    onClick: () => remove(r.id),
                    disabled: deleteRoute.isPending,
                    "data-ocid": `transport.routes.delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                )
              ] }) })
            ]
          },
          r.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "transport.routes.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Route" : "Add Route" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Route Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              placeholder: "e.g. City Center Route",
              "data-ocid": "transport.routes.name.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bus Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.busNumber,
              onChange: (e) => setForm((f) => ({ ...f, busNumber: e.target.value })),
              placeholder: "UP32-AB-1234",
              "data-ocid": "transport.routes.bus_no.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Driver Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.driverName,
              onChange: (e) => setForm((f) => ({ ...f, driverName: e.target.value })),
              placeholder: "Driver full name",
              "data-ocid": "transport.routes.driver.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Driver Mobile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.driverMobile,
              onChange: (e) => setForm((f) => ({ ...f, driverMobile: e.target.value })),
              placeholder: "10-digit mobile",
              "data-ocid": "transport.routes.mobile.input"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setOpen(false),
            "data-ocid": "transport.routes.cancel_button",
            type: "button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: save,
            disabled: isSaving,
            "data-ocid": "transport.routes.submit_button",
            type: "button",
            children: isSaving ? "Saving…" : editing ? "Save Changes" : "Add Route"
          }
        )
      ] })
    ] }) })
  ] });
}
function PickupPointsTab({ routes }) {
  var _a, _b;
  const [routeFilter, setRouteFilter] = reactExports.useState(((_a = routes[0]) == null ? void 0 : _a.id) ?? "");
  const effectiveRouteId = routeFilter || (((_b = routes[0]) == null ? void 0 : _b.id) ?? "");
  const { data: allPoints = [], isLoading: loadingPoints } = usePickupPointsByRoute(effectiveRouteId);
  const addPoint = useAddPickupPoint();
  const updatePoint = useUpdatePickupPoint();
  const deletePoint = useDeletePickupPoint();
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    routeId: "",
    name: "",
    timing: "07:30",
    monthlyFare: "",
    order: "1"
  });
  const filtered = allPoints.filter(
    (p) => routeFilter ? p.routeId === routeFilter : true
  );
  const getRouteName = (id) => {
    var _a2;
    return ((_a2 = routes.find((r) => r.id === id)) == null ? void 0 : _a2.name) ?? "—";
  };
  function openAdd() {
    var _a2;
    const defaultRoute = routeFilter || (((_a2 = routes[0]) == null ? void 0 : _a2.id) ?? "");
    setForm({
      routeId: defaultRoute,
      name: "",
      timing: "07:30",
      monthlyFare: "",
      order: String(
        allPoints.filter((p) => p.routeId === defaultRoute).length + 1
      )
    });
    setEditing(null);
    setOpen(true);
  }
  function openEdit(p) {
    setForm({
      routeId: p.routeId,
      name: p.name,
      timing: p.timing ?? "07:30",
      monthlyFare: String(p.monthlyFare),
      order: String(p.order ?? 1)
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
          order
        },
        {
          onSuccess: () => {
            ue.success("Pickup point updated");
            setOpen(false);
          },
          onError: (e) => ue.error(e.message)
        }
      );
    } else {
      addPoint.mutate(
        {
          routeId: form.routeId,
          name: form.name,
          timing: form.timing,
          monthlyFare: fare,
          order
        },
        {
          onSuccess: () => {
            ue.success("Pickup point added");
            setOpen(false);
          },
          onError: (e) => ue.error(e.message)
        }
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: effectiveRouteId,
          onValueChange: (v) => setRouteFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-56",
                "data-ocid": "transport.points.route_filter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Route" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: routes.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.id, children: r.name }, r.id)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: openAdd,
          "data-ocid": "transport.points.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
            " Add Pickup Point"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden bg-card", children: loadingPoints ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-3 font-semibold text-muted-foreground w-10", children: "#" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Point Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Route" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Timing" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-muted-foreground", children: "Monthly Fare" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-muted-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 6,
            className: "px-4 py-10 text-center text-muted-foreground text-sm",
            "data-ocid": "transport.points.empty_state",
            children: "No pickup points for this route. Click “Add Pickup Point” to create one."
          }
        ) }),
        filtered.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 table-row-alt hover:bg-muted/20 transition-colors",
            "data-ocid": `transport.points.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-center text-muted-foreground text-xs font-mono", children: p.order }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 13, className: "text-accent" }),
                p.name
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: getRouteName(p.routeId) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: p.timing || "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold text-foreground", children: formatCurrency(p.monthlyFare) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8",
                    onClick: () => openEdit(p),
                    "data-ocid": `transport.points.edit_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8 text-destructive hover:text-destructive",
                    onClick: () => deletePoint.mutate(
                      { id: p.id, routeId: p.routeId },
                      {
                        onSuccess: () => ue.success("Pickup point deleted"),
                        onError: (e) => ue.error(e.message)
                      }
                    ),
                    "data-ocid": `transport.points.delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                )
              ] }) })
            ]
          },
          p.id
        ))
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { "data-ocid": "transport.points.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit Pickup Point" : "Add Pickup Point" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Route" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.routeId,
              onValueChange: (v) => setForm((f) => ({ ...f, routeId: v })),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "transport.points.route.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: routes.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.id, children: r.name }, r.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Point Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.name,
              onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })),
              placeholder: "e.g. Civil Lines",
              "data-ocid": "transport.points.name.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Pickup Timing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: form.timing,
                onChange: (e) => setForm((f) => ({ ...f, timing: e.target.value })),
                "data-ocid": "transport.points.timing.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Order / Sequence" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "1",
                value: form.order,
                onChange: (e) => setForm((f) => ({ ...f, order: e.target.value })),
                placeholder: "1",
                "data-ocid": "transport.points.order.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Monthly Fare (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none", children: "₹" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "pl-7",
                type: "number",
                min: "0",
                step: "50",
                value: form.monthlyFare,
                onChange: (e) => setForm((f) => ({ ...f, monthlyFare: e.target.value })),
                placeholder: "1200",
                "data-ocid": "transport.points.fare.input"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setOpen(false),
            "data-ocid": "transport.points.cancel_button",
            type: "button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: save,
            disabled: addPoint.isPending || updatePoint.isPending,
            "data-ocid": "transport.points.submit_button",
            type: "button",
            children: addPoint.isPending || updatePoint.isPending ? "Saving…" : editing ? "Save Changes" : "Add Point"
          }
        )
      ] })
    ] }) })
  ] });
}
function LiveTrackingTab({ routes }) {
  var _a, _b;
  const {
    data: busLocations = [],
    dataUpdatedAt,
    refetch
  } = useGetBusLocations();
  const updateLocation = useUpdateBusLocation();
  const [guideOpen, setGuideOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    busId: "",
    routeId: ((_a = routes[0]) == null ? void 0 : _a.id) ?? "",
    lat: "",
    lng: ""
  });
  const [lastRefreshed, setLastRefreshed] = reactExports.useState(
    () => (/* @__PURE__ */ new Date()).toLocaleTimeString()
  );
  function fmtNano(ns) {
    if (!ns) return "—";
    const ms = Number(ns) / 1e6;
    const d = new Date(ms);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  }
  const prevUpdatedAt = dataUpdatedAt;
  if (prevUpdatedAt) {
    const ts = new Date(prevUpdatedAt).toLocaleTimeString();
    if (ts !== lastRefreshed) setLastRefreshed(ts);
  }
  function getOSMUrl() {
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
      ue.error("Please enter a Bus ID");
      return;
    }
    if (!form.routeId) {
      ue.error("Please select a route");
      return;
    }
    if (Number.isNaN(lat) || lat === 0) {
      ue.error("Enter a valid latitude (e.g. 26.8467)");
      return;
    }
    if (Number.isNaN(lng) || lng === 0) {
      ue.error("Enter a valid longitude (e.g. 80.9462)");
      return;
    }
    updateLocation.mutate(
      {
        busId: form.busId.trim(),
        routeId: form.routeId,
        latitude: lat,
        longitude: lng
      },
      {
        onSuccess: () => {
          ue.success("Bus location updated successfully");
          setForm((f) => ({ ...f, busId: "", lat: "", lng: "" }));
          refetch();
          setLastRefreshed((/* @__PURE__ */ new Date()).toLocaleTimeString());
        },
        onError: (e) => ue.error(e.message ?? "Failed to update location")
      }
    );
  }
  const activeBuses = busLocations.filter((b) => b.isActive);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-8 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 16, className: "text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground", children: "Live Bus Tracking" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Auto-refreshes every 30 seconds" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
          " Last refreshed: ",
          lastRefreshed
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => {
              refetch();
              setLastRefreshed((/* @__PURE__ */ new Date()).toLocaleTimeString());
            },
            "data-ocid": "transport.tracking.refresh_button",
            type: "button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13, className: "mr-1.5" }),
              " Refresh Now"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 15, className: "text-primary" }),
          " Live Map",
          activeBuses.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-green-600 dark:text-green-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 rounded-full bg-green-500 inline-block animate-pulse" }),
            activeBuses.length,
            " bus",
            activeBuses.length !== 1 ? "es" : "",
            " ",
            "online"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 11 }),
            " No buses online"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "https://www.openstreetmap.org",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-xs text-primary hover:underline",
            children: "Open full map \\u2197"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { height: 280 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            title: "School Bus Live Map",
            src: getOSMUrl(),
            className: "w-full h-full border-0",
            loading: "lazy",
            "data-ocid": "transport.tracking.map"
          }
        ),
        activeBuses.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-background/60 flex flex-col items-center justify-center gap-2 pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { size: 28, className: "text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No active bus locations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Use the form below to simulate a position" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-sm text-foreground font-display", children: "Bus Locations" }),
      busLocations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-border bg-muted/20 text-center",
          "data-ocid": "transport.tracking.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { size: 28, className: "text-muted-foreground mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "No buses registered yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Use the Manual Update form below to add a bus location, or connect a GPS device." })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: busLocations.map((bus, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:bg-muted/20 transition-colors",
          "data-ocid": `transport.tracking.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `size-10 rounded-lg flex items-center justify-center shrink-0 ${bus.isActive ? "bg-green-500/10" : "bg-muted/50"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bus,
                  {
                    size: 18,
                    className: bus.isActive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: bus.busId }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: bus.isActive ? "default" : "secondary",
                    className: "text-xs",
                    children: bus.isActive ? "Active" : "Inactive"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: [
                bus.routeName,
                " · Driver: ",
                bus.driverName
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                  " ",
                  bus.latitude.toFixed(5),
                  ",",
                  " ",
                  bus.longitude.toFixed(5)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 10 }),
                  " ",
                  fmtNano(bus.updatedAt)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `https://www.openstreetmap.org/?mlat=${bus.latitude}&mlon=${bus.longitude}&zoom=15`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-xs text-primary hover:underline mt-1 inline-block",
                  "data-ocid": `transport.tracking.map_link.${i + 1}`,
                  children: "View on map \\u2197"
                }
              )
            ] })
          ]
        },
        bus.busId
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-5 space-y-4",
        "data-ocid": "transport.tracking.manual_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 16, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground font-display", children: "Manual Location Update" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Test GPS tracking or manually update a bus position. Useful before hardware is installed." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Bus ID / Bus Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.busId,
                  onChange: (e) => setForm((f) => ({ ...f, busId: e.target.value })),
                  placeholder: "e.g. UP32-AB-1234",
                  "data-ocid": "transport.tracking.bus_id.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Route" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.routeId,
                  onValueChange: (v) => setForm((f) => ({ ...f, routeId: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "transport.tracking.route.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select route" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: routes.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r.id, children: r.name }, r.id)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Latitude" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.0001",
                  value: form.lat,
                  onChange: (e) => setForm((f) => ({ ...f, lat: e.target.value })),
                  placeholder: "e.g. 26.8467",
                  "data-ocid": "transport.tracking.lat.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Longitude" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.0001",
                  value: form.lng,
                  onChange: (e) => setForm((f) => ({ ...f, lng: e.target.value })),
                  placeholder: "e.g. 80.9462",
                  "data-ocid": "transport.tracking.lng.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleManualUpdate,
              disabled: updateLocation.isPending,
              "data-ocid": "transport.tracking.update_button",
              type: "button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14, className: "mr-1.5" }),
                updateLocation.isPending ? "Updating…" : "Update Location"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border-2 border-primary/20 bg-primary/5 overflow-hidden",
        "data-ocid": "transport.tracking.options_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-primary/15 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 18, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground", children: "How to Enable Live Bus Tracking" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-primary text-primary-foreground text-xs", children: "Choose an Option" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border border-border bg-card p-4 space-y-3",
                "data-ocid": "transport.tracking.option_mobile_card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Smartphone,
                      {
                        size: 18,
                        className: "text-blue-600 dark:text-blue-400"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Option A — Driver's Mobile Phone" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Zero hardware cost" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 shrink-0 mt-0.5", children: "✓" }),
                      "Works on any smartphone with a browser"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 shrink-0 mt-0.5", children: "✓" }),
                      "~5–10 metre GPS accuracy"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 shrink-0 mt-0.5", children: "✓" }),
                      "Driver bookmarks a URL — no app install"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-destructive", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5", children: "⚠" }),
                      "Stops if screen locks or browser closes"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-destructive", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 mt-0.5", children: "⚠" }),
                      "Requires driver to keep tab open while driving"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/50 border border-border p-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-1", children: "How to enable:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Share this URL with the driver — they open it in Chrome on their phone before starting the route:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 bg-card border border-border rounded px-2 py-1.5 font-mono text-xs break-all select-all", children: [
                      window.location.origin,
                      "/bus-track/",
                      ((_b = routes[0]) == null ? void 0 : _b.id) ?? "BUS_ID"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                      "Replace ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "BUS_ID" }),
                      " with your actual Bus ID (e.g. the route ID or bus number)."
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                        onClick: () => {
                          var _a2;
                          const url = `${window.location.origin}/bus-track/${((_a2 = routes[0]) == null ? void 0 : _a2.id) ?? "demo"}`;
                          navigator.clipboard.writeText(url).then(
                            () => ue.success("Driver tracking URL copied to clipboard!")
                          );
                        },
                        "data-ocid": "transport.tracking.copy_driver_url_button",
                        type: "button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 13, className: "mr-1.5" }),
                          " Copy Driver URL"
                        ]
                      }
                    ),
                    "share" in navigator && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "flex-1",
                        onClick: () => {
                          var _a2;
                          const url = `${window.location.origin}/bus-track/${((_a2 = routes[0]) == null ? void 0 : _a2.id) ?? "demo"}`;
                          navigator.share({ title: "Bus Tracking Link", url }).catch(() => {
                          });
                        },
                        "data-ocid": "transport.tracking.share_driver_url_button",
                        type: "button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 13, className: "mr-1.5" }),
                          " Share Link"
                        ]
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border-2 border-green-500/30 bg-green-500/5 p-4 space-y-3 relative",
                "data-ocid": "transport.tracking.option_jio_card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "absolute top-3 right-3 bg-green-600 text-white text-xs", children: "Recommended" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Wifi,
                      {
                        size: 18,
                        className: "text-green-600 dark:text-green-400"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Option B — Jio Motive OBD Device" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Plug-in, fully automatic" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 shrink-0 mt-0.5", children: "✓" }),
                      "Plugs into OBD-II port under bus dashboard"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 shrink-0 mt-0.5", children: "✓" }),
                      "Automatic — works even if driver's phone is off"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 shrink-0 mt-0.5", children: "✓" }),
                      "Jio Motive REST API polls location every 30 seconds"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-500 shrink-0 mt-0.5", children: "✓" }),
                      "Best for schools with 3+ buses"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0 mt-0.5", children: "₹" }),
                      "OBD device: ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "₹1,500–2,000" }),
                      " one-time"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2 text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground shrink-0 mt-0.5", children: "₹" }),
                      "Jio Motive subscription:",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "₹99–199/month" }),
                      " per bus"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-card border border-green-500/20 p-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground mb-1", children: "How it connects:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "text-xs text-muted-foreground space-y-1 list-decimal ml-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                        "Buy Jio Motive OBD device from",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "jiomotivefleet.com" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Plug into bus OBD-II port & activate SIM" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Enter your Jio Motive API key in ERP Settings" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "ERP auto-polls location every 30 seconds via HTTP outcalls" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: "https://jiomotivefleet.com",
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: "flex items-center justify-center gap-1.5 w-full text-sm font-medium text-green-700 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg py-2 hover:bg-green-500/15 transition-colors",
                      "data-ocid": "transport.tracking.jio_motive_link",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 13 }),
                        " Visit Jio Motive Fleet ↗"
                      ]
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 13, className: "shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Not sure which to choose?" }),
              " Start with Option A (Driver Mobile) — it costs nothing and works immediately. Upgrade to Jio Motive OBD when you want a fully automatic, always-on solution that doesn't depend on the driver remembering to open a browser tab."
            ] })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card overflow-hidden",
        "data-ocid": "transport.tracking.guide_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors",
              onClick: () => setGuideOpen((o) => !o),
              "data-ocid": "transport.tracking.guide_toggle",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 16, className: "text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground font-display", children: "How to Set Up GPS Tracking for School Buses" })
                ] }),
                guideOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { size: 16, className: "text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { size: 16, className: "text-muted-foreground" })
              ]
            }
          ),
          guideOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pb-5 border-t border-border space-y-4 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start gap-2 rounded-lg bg-accent/10 border border-accent/20 p-3 text-sm",
                "data-ocid": "transport.tracking.guide_info",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 15, className: "text-accent shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "This guide helps you set up real-time GPS tracking for your school buses so parents and admins can see live bus locations." })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "space-y-4 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", children: "1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Buy a GPS Tracker Device" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5", children: "Purchase a SIM-based GPS tracker from Amazon India or local electronics stores. Good options:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-1.5 space-y-1 text-muted-foreground list-disc ml-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Teltonika FMB920" }),
                      " — Professional grade, very reliable"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Queclink GV65" }),
                      " — Compact and easy to install"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "OBD GPS Tracker" }),
                      " — Plug-and-play via OBD port (easiest)"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Cost:" }),
                    " ₹1,500 – ₹3,000 per device on Amazon India."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", children: "2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Insert a SIM Card with Data Plan" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mt-0.5", children: [
                    "Use an Airtel or Jio nano-SIM with a data plan. A basic IoT/data plan is enough — approximately",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "₹50–₹100/month per bus" }),
                    "."
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", children: "3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Configure the Device to Send Location" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5", children: "Set up the GPS device to POST location data to this system every 30 seconds. Use your device's configuration app or SMS commands to set the server URL:" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 bg-muted/50 rounded-md p-2.5 font-mono text-xs border border-border break-all", children: [
                    "POST /api/update-location",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    '{"busId": "UP32-AB-1234", "routeId": "r1", "lat": 26.8467, "lng": 80.9462}'
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1.5 text-xs", children: "Interval: every 30 seconds (recommended). The ERP will automatically display the latest position." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", children: "4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Verify on the Map" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5", children: "Once the device is set up and the bus is running, the map above will show the live position. The bus card will appear under “Bus Locations” with the last updated time." })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5", children: "5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Share Tracking Link with Parents" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-0.5", children: "Parents can be given a shareable tracking link so they can check the live bus location from their phone without needing to log in." })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 p-3 text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground mb-1", children: "Benefits of Live Bus Tracking" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-muted-foreground space-y-0.5 list-disc ml-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Real-time bus location visible to admin and parents" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Parent peace-of-mind — know exactly when the bus will arrive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Route monitoring — ensure drivers follow the correct route" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Driver accountability and safety record" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg bg-muted/40 border border-border p-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 13, className: "shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Testing tip:" }),
                " Before buying hardware, use the",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Manual Location Update" }),
                " form above to simulate bus positions and verify the map is working correctly."
              ] })
            ] })
          ] })
        ]
      }
    )
  ] });
}
function TransportPage() {
  const [activeTab, setActiveTab] = reactExports.useState("routes");
  const { data: routes = [] } = useRoutes();
  const [selectedRoute, setSelectedRoute] = reactExports.useState(
    null
  );
  const currentSession = useAppStore((s) => s.currentSession);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", "data-ocid": "transport.page", children: [
    selectedRoute && /* @__PURE__ */ jsxRuntimeExports.jsx(
      RouteStudentsPanel,
      {
        route: selectedRoute,
        sessionId: currentSession,
        onClose: () => setSelectedRoute(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 py-4 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Transport" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Routes, pickup points & GPS tracking" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: setActiveTab,
        className: "flex flex-col flex-1 min-h-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "h-12 bg-transparent p-0 gap-1",
              "data-ocid": "transport.tabs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "routes",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "transport.routes.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Bus, { size: 14 }),
                      " Routes & Buses"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "points",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "transport.points.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 14 }),
                      " Pickup Points"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "gps",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "transport.gps.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { size: 14 }),
                      " Live Tracking"
                    ]
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-auto bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "routes", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              RoutesTab,
              {
                routes,
                onRouteDoubleClick: (r) => setSelectedRoute(r)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "points", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PickupPointsTab, { routes }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "gps", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LiveTrackingTab, { routes }) })
          ] })
        ]
      }
    )
  ] });
}
export {
  TransportPage as default
};
