import { r as reactExports, j as jsxRuntimeExports, cc as Video, e as Button, i as CLASS_LABELS, t as Badge, dM as ExternalLink, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, I as Input, C as CLASS_ORDER } from "./index-pMBTUEbj.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { C as Calendar } from "./calendar-CAegGMND.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { S as Send } from "./send-ByllD6tM.js";
import { Z as Zap } from "./zap-C7jt1CDw.js";
import { C as CircleCheckBig } from "./circle-check-big-DCQRnxmS.js";
import { C as Copy } from "./copy-BDQ1kkni.js";
import "./index-Nv6ob_Pe.js";
const SAMPLE_CLASSES = [
  {
    id: "1",
    title: "Mathematics - Quadratic Equations",
    platform: "GoogleMeet",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingId: "abc-defg-hij",
    classLevel: "Class10",
    subjectId: "math",
    teacherId: "t1",
    scheduledAt: "2025-04-28T10:00:00",
    durationMinutes: 60,
    isCompleted: false
  },
  {
    id: "2",
    title: "Science - Newton's Laws",
    platform: "Zoom",
    meetingLink: "https://zoom.us/j/1234567890",
    meetingId: "1234567890",
    classLevel: "Class9",
    subjectId: "sci",
    teacherId: "t2",
    scheduledAt: "2025-04-27T14:00:00",
    durationMinutes: 45,
    isCompleted: true
  },
  {
    id: "3",
    title: "English Literature - Hamlet",
    platform: "GoogleMeet",
    meetingLink: "https://meet.google.com/xyz-pqrs-tuv",
    meetingId: "xyz-pqrs-tuv",
    classLevel: "Class11",
    subjectId: "eng",
    teacherId: "t1",
    scheduledAt: "2025-04-29T11:00:00",
    durationMinutes: 50,
    isCompleted: false
  },
  {
    id: "4",
    title: "Hindi Grammar Workshop",
    platform: "GoogleMeet",
    meetingLink: "https://meet.google.com/ijk-lmno-pqr",
    meetingId: "ijk-lmno-pqr",
    classLevel: "Class8",
    subjectId: "hindi",
    teacherId: "t3",
    scheduledAt: "2025-04-30T09:00:00",
    durationMinutes: 40,
    isCompleted: false
  }
];
const INITIAL_INSTANT_MEETS = [
  {
    id: "im1",
    link: "https://meet.google.com/qwe-rty-uio",
    createdAt: "2025-04-27T08:00:00"
  },
  {
    id: "im2",
    link: "https://meet.google.com/asd-fgh-jkl",
    createdAt: "2025-04-26T15:30:00"
  }
];
function generateMeetCode() {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n) => Array.from(
    { length: n },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `${seg(3)}-${seg(4)}-${seg(3)}`;
}
function formatScheduled(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
const PLATFORM_COLORS = {
  GoogleMeet: "bg-emerald-100 text-emerald-700",
  Zoom: "bg-blue-100 text-blue-700"
};
function ScheduleDialog({
  open,
  onClose,
  onSave
}) {
  const [form, setForm] = reactExports.useState({
    title: "",
    classLevel: "Class9",
    subject: "",
    platform: "GoogleMeet",
    link: "",
    date: "",
    time: "",
    duration: "45"
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  function handleSave() {
    if (!form.title || !form.date || !form.time) return;
    onSave({
      title: form.title,
      platform: form.platform,
      meetingLink: form.link || `https://meet.google.com/${generateMeetCode()}`,
      meetingId: generateMeetCode(),
      classLevel: form.classLevel,
      subjectId: form.subject,
      teacherId: "t1",
      scheduledAt: `${form.date}T${form.time}:00`,
      durationMinutes: Number(form.duration)
    });
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "virtual.schedule_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Schedule Virtual Class" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.title,
            onChange: (e) => set("title", e.target.value),
            placeholder: "e.g. Mathematics - Chapter 3",
            "data-ocid": "virtual.title.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Class" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.classLevel,
              onValueChange: (v) => set("classLevel", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "mt-1",
                    "data-ocid": "virtual.class.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CLASS_ORDER.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: CLASS_LABELS[c] }, c)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subject" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.subject,
              onChange: (e) => set("subject", e.target.value),
              placeholder: "Subject name"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Platform" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.platform,
              onValueChange: (v) => set("platform", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "mt-1",
                    "data-ocid": "virtual.platform.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "GoogleMeet", children: "Google Meet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Zoom", children: "Zoom" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Duration (min)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.duration,
              onChange: (e) => set("duration", e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Meeting Link (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.link,
            onChange: (e) => set("link", e.target.value),
            placeholder: "https://meet.google.com/...",
            "data-ocid": "virtual.link.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              className: "mt-1",
              value: form.date,
              onChange: (e) => set("date", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Time" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "time",
              className: "mt-1",
              value: form.time,
              onChange: (e) => set("time", e.target.value)
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
            "data-ocid": "virtual.schedule.submit_button",
            children: "Schedule Class"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "virtual.schedule.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function VirtualClassesPage() {
  const [classes, setClasses] = reactExports.useState(SAMPLE_CLASSES);
  const [scheduleOpen, setScheduleOpen] = reactExports.useState(false);
  const [instantMeet, setInstantMeet] = reactExports.useState(null);
  const [instantMeets, setInstantMeets] = reactExports.useState(INITIAL_INSTANT_MEETS);
  const [copied, setCopied] = reactExports.useState(false);
  function handleSchedule(data) {
    setClasses((p) => [
      { ...data, id: `vc-${Date.now()}`, isCompleted: false },
      ...p
    ]);
  }
  function startInstantMeet() {
    const code = generateMeetCode();
    const link = `https://meet.google.com/${code}`;
    setInstantMeet(link);
    setInstantMeets((p) => [
      { id: `im-${Date.now()}`, link, createdAt: (/* @__PURE__ */ new Date()).toISOString() },
      ...p.slice(0, 4)
    ]);
    setCopied(false);
  }
  function copyLink(link) {
    navigator.clipboard.writeText(link).catch(() => {
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-6xl", "data-ocid": "virtual.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Virtual Classes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Schedule and manage online classes" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setScheduleOpen(true),
          "data-ocid": "virtual.schedule.open_modal_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
            "Schedule Class"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "scheduled", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "scheduled", "data-ocid": "virtual.scheduled.tab", children: "Scheduled Classes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "instant", "data-ocid": "virtual.instant.tab", children: "Quick Meet" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "scheduled", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
          "Title",
          "Class",
          "Platform",
          "Date & Time",
          "Duration",
          "Status",
          "Actions"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: `px-4 py-3 font-semibold text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`,
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: classes.map((cls, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border/50 hover:bg-muted/20 table-row-alt",
            "data-ocid": `virtual.class.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: cls.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: CLASS_LABELS[cls.classLevel] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${PLATFORM_COLORS[cls.platform]}`,
                  children: cls.platform === "GoogleMeet" ? "Google Meet" : "Zoom"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3.5" }),
                formatScheduled(cls.scheduledAt)
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5" }),
                cls.durationMinutes,
                " min"
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: cls.isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "bg-emerald-100 text-emerald-700 border-0",
                  children: "Completed"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "bg-blue-100 text-blue-700 border-0",
                  children: "Upcoming"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    onClick: () => window.open(cls.meetingLink, "_blank"),
                    disabled: cls.isCompleted,
                    "data-ocid": `virtual.join.button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5 mr-1" }),
                      "Join"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    "data-ocid": `virtual.send_link.button.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-3.5 mr-1" }),
                      "Send"
                    ]
                  }
                )
              ] }) })
            ]
          },
          cls.id
        )) })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "instant", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-8 flex flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-20 rounded-full bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-10 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground text-xl", children: "Start Instant Meet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Generate a Google Meet link and share instantly" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              onClick: startInstantMeet,
              className: "w-full max-w-xs",
              "data-ocid": "virtual.instant_meet.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "size-4 mr-2" }),
                "Start Instant Meeting"
              ]
            }
          ),
          instantMeet && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "w-full rounded-lg bg-muted/40 p-3 space-y-2",
              "data-ocid": "virtual.instant_meet.result",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase", children: "Meeting Link" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary font-mono break-all", children: instantMeet }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "flex-1",
                      onClick: () => copyLink(instantMeet),
                      "data-ocid": "virtual.copy_link.button",
                      children: [
                        copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-3.5 mr-1 text-emerald-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5 mr-1" }),
                        copied ? "Copied!" : "Copy Link"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "flex-1",
                      onClick: () => window.open(instantMeet, "_blank"),
                      "data-ocid": "virtual.open_meet.button",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5 mr-1" }),
                        "Join Now"
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-4", children: "Recent Instant Meets" }),
          instantMeets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center py-8 text-muted-foreground text-sm",
              "data-ocid": "virtual.instant_meets.empty_state",
              children: "No instant meets yet"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: instantMeets.slice(0, 5).map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between p-3 rounded-lg bg-muted/30",
              "data-ocid": `virtual.instant_meet.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-mono text-primary truncate max-w-[200px]", children: m.link.replace("https://meet.google.com/", "") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(m.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    onClick: () => window.open(m.link, "_blank"),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3.5" })
                  }
                )
              ]
            },
            m.id
          )) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScheduleDialog,
      {
        open: scheduleOpen,
        onClose: () => setScheduleOpen(false),
        onSave: handleSchedule
      }
    )
  ] });
}
export {
  VirtualClassesPage as default
};
