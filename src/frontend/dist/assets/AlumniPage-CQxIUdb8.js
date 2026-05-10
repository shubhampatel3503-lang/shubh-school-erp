import { R as useAlumni, T as useAddAlumni, V as useUpdateAlumni, W as useDeleteAlumni, r as reactExports, j as jsxRuntimeExports, Y as UsersRound, t as Badge, I as Input, e as Button, S as Skeleton, Z as getInitials, i as CLASS_LABELS, _ as MapPin, $ as Phone, a0 as formatDate, F as ue, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, a1 as generateId } from "./index-pMBTUEbj.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { D as Download } from "./download-BHLO7mQe.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { S as SquarePen } from "./square-pen-rgW01YAz.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { C as Calendar } from "./calendar-CAegGMND.js";
import "./index-Nv6ob_Pe.js";
const BATCH_YEARS = Array.from({ length: 15 }, (_, i) => String(2025 - i));
const emptyForm = () => ({
  fullName: "",
  admNo: "",
  passOutYear: String((/* @__PURE__ */ new Date()).getFullYear()),
  classLevel: "Class12",
  mobile: "",
  email: "",
  careerField: "",
  currentOccupation: "",
  company: "",
  city: "",
  photoUrl: "",
  notes: ""
});
function ConfirmDeleteDialog({
  open,
  name,
  onConfirm,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-sm",
      "data-ocid": "alumni.confirm_delete.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Alumni Record?" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Are you sure you want to delete ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: name }),
          "? This action cannot be undone."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              className: "flex-1",
              onClick: onConfirm,
              "data-ocid": "alumni.confirm_delete.confirm_button",
              children: "Delete"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onCancel,
              "data-ocid": "alumni.confirm_delete.cancel_button",
              children: "Cancel"
            }
          )
        ] })
      ]
    }
  ) });
}
function AlumniDialog({
  open,
  onClose,
  record,
  onSave,
  isSaving
}) {
  const [form, setForm] = reactExports.useState(
    () => (record == null ? void 0 : record.id) ? {
      id: record.id,
      fullName: record.fullName ?? "",
      admNo: record.admNo ?? "",
      passOutYear: record.passOutYear ?? String((/* @__PURE__ */ new Date()).getFullYear()),
      classLevel: record.classLevel ?? "Class12",
      mobile: record.mobile ?? "",
      email: record.email ?? "",
      careerField: record.careerField ?? "",
      currentOccupation: record.currentOccupation ?? "",
      company: record.company ?? "",
      city: record.city ?? "",
      photoUrl: record.photoUrl ?? "",
      notes: record.notes ?? ""
    } : emptyForm()
  );
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  function handleSave() {
    if (!form.fullName.trim()) {
      ue.error("Full name is required");
      return;
    }
    onSave(form);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "alumni.record_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: (record == null ? void 0 : record.id) ? "Edit Alumni Record" : "Add Alumni" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Full Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.fullName,
              onChange: (e) => set("fullName", e.target.value),
              placeholder: "e.g. Rahul Sharma",
              "data-ocid": "alumni.name.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Admission Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.admNo,
              onChange: (e) => set("admNo", e.target.value),
              placeholder: "ADM001",
              "data-ocid": "alumni.admno.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Graduation Year" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.passOutYear,
              onValueChange: (v) => set("passOutYear", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", "data-ocid": "alumni.batch.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: BATCH_YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: y, children: y }, y)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class at Graduation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.classLevel,
              onValueChange: (v) => set("classLevel", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.entries(CLASS_LABELS).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: v }, k)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mobile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.mobile,
              onChange: (e) => set("mobile", e.target.value),
              placeholder: "98XXXXXXXX",
              "data-ocid": "alumni.mobile.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              type: "email",
              value: form.email,
              onChange: (e) => set("email", e.target.value),
              placeholder: "email@example.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Career Field" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.careerField,
              onChange: (e) => set("careerField", e.target.value),
              placeholder: "e.g. Engineering, Medicine"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current Role" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.currentOccupation,
              onChange: (e) => set("currentOccupation", e.target.value),
              placeholder: "e.g. Software Engineer"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Company / Organization" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.company,
              onChange: (e) => set("company", e.target.value),
              placeholder: "e.g. TCS, AIIMS"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "City" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.city,
              onChange: (e) => set("city", e.target.value),
              placeholder: "e.g. Bengaluru"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              className: "mt-1",
              value: form.notes,
              onChange: (e) => set("notes", e.target.value),
              rows: 2,
              placeholder: "Any additional notes..."
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1",
            onClick: handleSave,
            disabled: isSaving,
            "data-ocid": "alumni.record.save_button",
            children: isSaving ? "Saving..." : "Save Alumni"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "alumni.record.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function EventDialog({
  open,
  onClose,
  onSave
}) {
  const [form, setForm] = reactExports.useState({
    name: "",
    date: "",
    venue: "",
    description: ""
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  function handleSave() {
    if (!form.name || !form.date) {
      ue.error("Event name and date are required");
      return;
    }
    onSave({
      id: generateId(),
      name: form.name,
      date: form.date,
      venue: form.venue,
      description: form.description,
      rsvpCount: 0
    });
    ue.success("Alumni event created");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "alumni.event_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Create Alumni Event" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Event Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.name,
            onChange: (e) => set("name", e.target.value),
            placeholder: "e.g. Annual Alumni Meet",
            "data-ocid": "alumni.event_name.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DateInput,
          {
            value: form.date,
            onChange: (iso) => set("date", iso),
            className: "mt-1",
            "data-ocid": "alumni.event_date.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Venue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.venue,
            onChange: (e) => set("venue", e.target.value),
            placeholder: "e.g. School Auditorium"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            className: "mt-1",
            value: form.description,
            onChange: (e) => set("description", e.target.value),
            rows: 3,
            placeholder: "Event details..."
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1",
            onClick: handleSave,
            "data-ocid": "alumni.event.submit_button",
            children: "Create Event"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "alumni.event.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function AlumniPage() {
  const { data: alumni = [], isLoading } = useAlumni();
  const addAlumni = useAddAlumni();
  const updateAlumni = useUpdateAlumni();
  const deleteAlumni = useDeleteAlumni();
  const [events, setEvents] = reactExports.useState([]);
  const [alumniDialog, setAlumniDialog] = reactExports.useState({ open: false, record: null });
  const [eventOpen, setEventOpen] = reactExports.useState(false);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [batchFilter, setBatchFilter] = reactExports.useState("All");
  async function saveAlumni(data) {
    try {
      if (data.id) {
        await updateAlumni.mutateAsync({
          ...data,
          id: data.id
        });
        ue.success("Alumni record updated");
      } else {
        const { id: _id, ...rest } = data;
        await addAlumni.mutateAsync(rest);
        ue.success("Alumni record added");
      }
      setAlumniDialog({ open: false, record: null });
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save alumni record"
      );
    }
  }
  async function handleDelete(id) {
    try {
      await deleteAlumni.mutateAsync(id);
      ue.success("Alumni record deleted");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to delete alumni record"
      );
    } finally {
      setDeleteTarget(null);
    }
  }
  const filtered = alumni.filter((a) => {
    const matchSearch = a.fullName.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase()) || a.currentOccupation.toLowerCase().includes(search.toLowerCase()) || (a.admNo ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBatch = batchFilter === "All" || a.passOutYear === batchFilter;
    return matchSearch && matchBatch;
  });
  const isSaving = addAlumni.isPending || updateAlumni.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-7xl", "data-ocid": "alumni.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Alumni" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Alumni directory, batch view, and events" })
      ] }),
      alumni.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto", children: [
        alumni.length,
        " alumni"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "directory", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "directory", "data-ocid": "alumni.directory.tab", children: "Directory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "events", "data-ocid": "alumni.events.tab", children: "Events" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "directory", className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-1 max-w-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search alumni...",
                  className: "pl-8",
                  "data-ocid": "alumni.search_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: batchFilter, onValueChange: setBatchFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-36",
                  "data-ocid": "alumni.batch_filter.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Batch" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Batches" }),
                BATCH_YEARS.map((y) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: y, children: [
                  "Batch ",
                  y
                ] }, y))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", "data-ocid": "alumni.export.button", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-2" }),
              "Export"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setAlumniDialog({ open: true, record: null }),
                "data-ocid": "alumni.add.open_modal_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
                  "Add Alumni"
                ]
              }
            )
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "alumni.loading_state", children: [0, 1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-14 w-full rounded-lg"
          },
          `skel-${n}`
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
              "Alumni",
              "Batch",
              "Occupation",
              "City",
              "Mobile",
              "Actions"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: `px-4 py-3 font-semibold text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`,
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((a, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/50 hover:bg-muted/20",
                "data-ocid": `alumni.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-primary", children: getInitials(a.fullName) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: a.fullName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        CLASS_LABELS[a.classLevel],
                        a.admNo ? ` · ${a.admNo}` : ""
                      ] })
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: a.passOutYear }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground max-w-[200px] truncate", children: [a.currentOccupation, a.company].filter(Boolean).join(" @ ") || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: a.city ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
                    a.city
                  ] }) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: a.mobile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "a",
                    {
                      href: `tel:${a.mobile}`,
                      className: "flex items-center gap-1 text-primary hover:underline",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-3" }),
                        a.mobile
                      ]
                    }
                  ) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 justify-end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7",
                        onClick: () => setAlumniDialog({ open: true, record: a }),
                        "data-ocid": `alumni.edit.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "size-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7 text-destructive",
                        onClick: () => setDeleteTarget(a),
                        "data-ocid": `alumni.delete.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                      }
                    )
                  ] }) })
                ]
              },
              a.id
            )) })
          ] }),
          !isLoading && filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "py-12 text-center",
              "data-ocid": "alumni.directory.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "size-10 mx-auto text-muted-foreground/30 mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: alumni.length === 0 ? 'No alumni records yet. Click "Add Alumni" to get started.' : "No alumni found matching your search" })
              ]
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "events", className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setEventOpen(true),
            "data-ocid": "alumni.add_event.open_modal_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
              "Create Event"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
          events.map((ev, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-xl border border-border bg-card p-5 space-y-3",
              "data-ocid": `alumni.event.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: ev.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
                    formatDate(ev.date)
                  ] }),
                  ev.venue && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3" }),
                    ev.venue
                  ] })
                ] }),
                ev.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground line-clamp-2", children: ev.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1 border-t border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "size-3 mr-1" }),
                    ev.rsvpCount,
                    " RSVPs"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", className: "text-xs h-7", children: "Send Invite" })
                ] })
              ]
            },
            ev.id
          )),
          events.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "col-span-3 py-12 text-center rounded-xl border border-border bg-card",
              "data-ocid": "alumni.events.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-10 mx-auto text-muted-foreground/30 mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: 'No events created yet. Click "Create Event" to add one.' })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlumniDialog,
      {
        open: alumniDialog.open,
        record: alumniDialog.record,
        onClose: () => setAlumniDialog({ open: false, record: null }),
        onSave: saveAlumni,
        isSaving
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EventDialog,
      {
        open: eventOpen,
        onClose: () => setEventOpen(false),
        onSave: (e) => setEvents((p) => [e, ...p])
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDeleteDialog,
      {
        open: !!deleteTarget,
        name: (deleteTarget == null ? void 0 : deleteTarget.fullName) ?? "",
        onConfirm: () => deleteTarget && handleDelete(deleteTarget.id),
        onCancel: () => setDeleteTarget(null)
      }
    )
  ] });
}
export {
  AlumniPage as default
};
