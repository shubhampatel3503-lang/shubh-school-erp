import { ae as createLucideIcon, ao as useQueryClient, an as useMutation, am as useQuery, a3 as useActor, ad as createActor, r as reactExports, aB as useSettings, a5 as useStudents, j as jsxRuntimeExports, L as Label, aC as MessageCircle, $ as Phone, e as Button, I as Input, t as Badge, F as ue, d as useAppStore, S as Skeleton, X, aD as Bell } from "./index-pMBTUEbj.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-r-j30wiQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { S as Send } from "./send-ByllD6tM.js";
import { U as User } from "./user-C6bo2V5_.js";
import { S as School } from "./school-Cb7Y3Xs9.js";
import { R as RotateCcw } from "./rotate-ccw-BQz6udQk.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { C as CircleX } from "./circle-x-QutbQW34.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { P as PenLine } from "./pen-line-D9tc1r2P.js";
import { S as Save } from "./save-JWmaUCmf.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { S as Settings2 } from "./settings-2-CEQY6662.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode);
function useBackendActor() {
  return useActor(createActor);
}
function mapMsg(m) {
  return {
    id: m.id,
    fromUsername: m.fromUsername,
    toStudentId: m.toStudentId ?? null,
    toClassLevel: m.toClassLevel ?? null,
    toSection: m.toSection ?? null,
    channel: m.channel,
    message: m.message,
    sentAt: m.sentAt,
    deliveryStatus: m.deliveryStatus,
    templateKey: m.templateKey ?? null
  };
}
function useDirectMessages(limit = 100) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["directMessages", limit],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const raw = await actor.getDirectMessages(BigInt(limit));
        return raw.map(mapMsg);
      } catch {
        return [];
      }
    },
    enabled: !isFetching,
    staleTime: 3e4,
    refetchInterval: 6e4
  });
}
function useMessageTemplates() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["messageTemplates"],
    queryFn: async () => {
      if (!actor) return defaultTemplates;
      try {
        const raw = await actor.getMessageTemplates();
        if (!Array.isArray(raw) || raw.length === 0) return defaultTemplates;
        return Object.fromEntries(raw);
      } catch {
        return defaultTemplates;
      }
    },
    enabled: !isFetching,
    staleTime: 5 * 6e4
  });
}
function useSendDirectMessage() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params) => {
      if (!actor) throw new Error("Backend not available. Please try again.");
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const msgId = `msg-${Date.now()}`;
      const backendMsg = {
        id: msgId,
        fromUsername: params.fromUsername,
        toStudentId: params.toStudentId ?? void 0,
        toClassLevel: params.toClassLevel ?? void 0,
        toSection: params.toSection ?? void 0,
        channel: params.channel,
        message: params.message,
        sentAt: now,
        deliveryStatus: "pending",
        templateKey: params.templateKey ?? void 0
      };
      const saved = await actor.sendDirectMessage(backendMsg);
      const fe = mapMsg(saved);
      const shouldWA = params.channel === "WhatsApp" || params.channel === "Both";
      if (shouldWA && params.recipientPhone && params.whatsappApiKey) {
        const waUrl = (params.whatsappApiUrl ?? "https://wacoder.in/api").replace(/\/$/, "");
        try {
          await fetch(`${waUrl}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              apiKey: params.whatsappApiKey,
              phone: params.recipientPhone,
              message: params.message
            })
          });
          await actor.updateMessageDeliveryStatus(fe.id, "sent");
          fe.deliveryStatus = "sent";
        } catch {
          await actor.updateMessageDeliveryStatus(fe.id, "failed");
          fe.deliveryStatus = "failed";
        }
      }
      const shouldInApp = params.channel === "In-App" || params.channel === "Both";
      if (shouldInApp) {
        try {
          await actor.createNotification(
            "New Message",
            params.message,
            null,
            params.toStudentId ?? null,
            params.toClassLevel ?? null,
            params.fromUsername,
            "direct_message"
          );
        } catch {
        }
      }
      return fe;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["directMessages"] });
    }
  });
}
function useUpdateMessageTemplate() {
  const { actor } = useBackendActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      key,
      template
    }) => {
      if (!actor) throw new Error("Backend not available.");
      await actor.updateMessageTemplate(key, template);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messageTemplates"] })
  });
}
const defaultTemplates = {
  fees_reminder: "Dear {parent_name}, fees of ₹{amount} are pending for {student_name} (Adm. No. {adm_no}) for {months}. Please pay by {date}. — {school_name}",
  receipt: "Dear {parent_name}, payment of ₹{amount} received for {student_name} (Adm. No. {adm_no}) on {date}. Receipt No: {receipt_no}. Thank you! — {school_name}",
  admission: "Dear {parent_name}, {student_name} has been successfully admitted to {class} at {school_name}. Adm. No: {adm_no}. Welcome!",
  exam_schedule: "Dear {parent_name}, exam schedule for {student_name} ({class}): Exams start on {date}. Please ensure timely preparation. — {school_name}",
  holiday: "Dear Parents, the school will remain closed on {date} due to {reason}. Classes will resume on {resume_date}. — {school_name}",
  custom: ""
};
const TEMPLATE_LABELS = {
  fees_reminder: "Fees Reminder",
  receipt: "Receipt",
  admission: "Admission Confirmation",
  exam_schedule: "Exam Schedule",
  holiday: "Holiday Announcement",
  custom: "Custom Message"
};
const CLASS_LEVELS = [
  { value: "PlayWay", label: "Play Way" },
  { value: "LKG", label: "LKG" },
  { value: "UKG", label: "UKG" },
  { value: "Class1", label: "Class 1" },
  { value: "Class2", label: "Class 2" },
  { value: "Class3", label: "Class 3" },
  { value: "Class4", label: "Class 4" },
  { value: "Class5", label: "Class 5" },
  { value: "Class6", label: "Class 6" },
  { value: "Class7", label: "Class 7" },
  { value: "Class8", label: "Class 8" },
  { value: "Class9", label: "Class 9" },
  { value: "Class10", label: "Class 10" },
  { value: "Class11", label: "Class 11" },
  { value: "Class12", label: "Class 12" }
];
const CHANNEL_OPTS = [
  { value: "WhatsApp", label: "WhatsApp", icon: "📱" },
  { value: "In-App", label: "In-App Notification", icon: "🔔" },
  { value: "Both", label: "Both", icon: "📡" }
];
function highlightPlaceholders(text) {
  const parts = text.split(/({[^}]+})/g);
  return parts.map(
    (p) => p.startsWith("{") && p.endsWith("}") ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "bg-primary/15 text-primary px-0.5 rounded font-mono text-xs",
        children: p
      },
      `ph-${p}`
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p }, `tx-${p}`)
  );
}
function ComposePanel({ currentUser, onSent }) {
  var _a;
  const [recipientType, setRecipientType] = reactExports.useState("individual");
  const [channel, setChannel] = reactExports.useState("WhatsApp");
  const [templateKey, setTemplateKey] = reactExports.useState("custom");
  const [message, setMessage] = reactExports.useState("");
  const [selectedStudent, setSelectedStudent] = reactExports.useState(null);
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [selectedSection, setSelectedSection] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showDropdown, setShowDropdown] = reactExports.useState(false);
  const searchRef = reactExports.useRef(null);
  const dropdownRef = reactExports.useRef(null);
  const { data: settings } = useSettings();
  const { data: allStudents = [] } = useStudents();
  const sendMsg = useSendDirectMessage();
  const [debouncedQuery, setDebouncedQuery] = reactExports.useState("");
  reactExports.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);
  const matchingStudents = reactExports.useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return allStudents.filter(
      (s) => s.fullName.toLowerCase().includes(q) || s.admNo.toLowerCase().includes(q) || s.fatherName.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [allStudents, debouncedQuery]);
  const availableSections = reactExports.useMemo(() => {
    if (!selectedClass) return [];
    const sects = /* @__PURE__ */ new Set();
    for (const st of allStudents.filter(
      (st2) => st2.classLevel === selectedClass
    )) {
      sects.add(st.sectionId);
    }
    return Array.from(sects);
  }, [allStudents, selectedClass]);
  const onTemplateChange = reactExports.useCallback((key) => {
    setTemplateKey(key);
    if (key !== "custom" && defaultTemplates[key]) {
      setMessage(defaultTemplates[key]);
    }
  }, []);
  reactExports.useEffect(() => {
    function handler(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const recipientPhone = reactExports.useMemo(() => {
    if (selectedStudent) {
      return selectedStudent.fatherMobile || selectedStudent.motherMobile || selectedStudent.mobile || "";
    }
    return "";
  }, [selectedStudent]);
  function buildRecipientLabel() {
    var _a2, _b;
    if (recipientType === "individual" && selectedStudent)
      return `${selectedStudent.fullName} (${selectedStudent.admNo})`;
    if (recipientType === "class" && selectedClass)
      return `${((_a2 = CLASS_LEVELS.find((c) => c.value === selectedClass)) == null ? void 0 : _a2.label) ?? selectedClass} — All Students`;
    if (recipientType === "section" && selectedClass && selectedSection)
      return `${((_b = CLASS_LEVELS.find((c) => c.value === selectedClass)) == null ? void 0 : _b.label) ?? selectedClass} — ${selectedSection}`;
    return "";
  }
  const isReady = reactExports.useMemo(() => {
    if (!message.trim()) return false;
    if (recipientType === "individual" && !selectedStudent) return false;
    if (recipientType === "class" && !selectedClass) return false;
    if (recipientType === "section" && (!selectedClass || !selectedSection))
      return false;
    return true;
  }, [message, recipientType, selectedStudent, selectedClass, selectedSection]);
  async function handleSend() {
    if (!isReady) return;
    const label = buildRecipientLabel();
    try {
      await sendMsg.mutateAsync({
        fromUsername: currentUser,
        toStudentId: recipientType === "individual" ? (selectedStudent == null ? void 0 : selectedStudent.id) ?? null : null,
        toClassLevel: recipientType !== "individual" ? selectedClass || null : null,
        toSection: recipientType === "section" ? selectedSection || null : null,
        channel,
        message,
        templateKey: templateKey !== "custom" ? templateKey : null,
        recipientPhone: recipientType === "individual" ? recipientPhone : void 0,
        whatsappApiKey: (settings == null ? void 0 : settings.whatsappApiKey) || "",
        whatsappApiUrl: (settings == null ? void 0 : settings.whatsappApiUrl) ?? ""
      });
      ue.success(`Message sent to ${label}`);
      setMessage("");
      setTemplateKey("custom");
      setSelectedStudent(null);
      setSearchQuery("");
      onSent == null ? void 0 : onSent();
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to send message"
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "h-full flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 text-primary" }),
      "Compose Message"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex-1 overflow-y-auto py-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase text-muted-foreground tracking-wide", children: "Send To" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-3 gap-1.5",
            "data-ocid": "compose.recipient_type",
            children: ["individual", "class", "section"].map(
              (t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setRecipientType(t),
                  "data-ocid": `compose.recipient_type.${t}`,
                  className: `px-2 py-1.5 rounded-md text-xs font-medium capitalize transition-colors border ${recipientType === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:bg-muted"}`,
                  children: t === "individual" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3" }),
                    "Individual"
                  ] }) : t === "class" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(School, { className: "h-3 w-3" }),
                    "Class"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3" }),
                    "Section"
                  ] })
                },
                t
              )
            )
          }
        )
      ] }),
      recipientType === "individual" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "student-search",
            className: "text-xs font-semibold uppercase text-muted-foreground tracking-wide",
            children: "Student"
          }
        ),
        selectedStudent ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 bg-primary/5 border border-primary/20 rounded-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: selectedStudent.fullName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              selectedStudent.admNo,
              " ·",
              ((_a = CLASS_LEVELS.find(
                (c) => c.value === selectedStudent.classLevel
              )) == null ? void 0 : _a.label) ?? selectedStudent.classLevel
            ] }),
            recipientPhone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-2.5 w-2.5" }),
              recipientPhone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => {
                setSelectedStudent(null);
                setSearchQuery("");
              },
              className: "text-muted-foreground hover:text-destructive",
              children: "✕"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "student-search",
              ref: searchRef,
              value: searchQuery,
              onChange: (e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              },
              onFocus: () => setShowDropdown(true),
              placeholder: "Search by name or Adm. No.",
              "data-ocid": "compose.student_search",
              className: "h-8 text-sm"
            }
          ),
          showDropdown && matchingStudents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              ref: dropdownRef,
              className: "absolute z-[9999] w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto",
              children: matchingStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "w-full px-3 py-2 text-left hover:bg-muted flex items-center justify-between text-sm",
                  onMouseDown: () => {
                    setSelectedStudent(s);
                    setSearchQuery("");
                    setShowDropdown(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: s.fullName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: s.admNo })
                  ]
                },
                s.id
              ))
            }
          )
        ] })
      ] }),
      (recipientType === "class" || recipientType === "section") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase text-muted-foreground tracking-wide", children: "Class" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedClass, onValueChange: setSelectedClass, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 text-sm",
              "data-ocid": "compose.class_select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select class" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999] max-h-64 overflow-y-auto", children: CLASS_LEVELS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.value, children: c.label }, c.value)) })
        ] })
      ] }),
      recipientType === "section" && selectedClass && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase text-muted-foreground tracking-wide", children: "Section" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedSection, onValueChange: setSelectedSection, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 text-sm",
              "data-ocid": "compose.section_select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select section" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: availableSections.length > 0 ? availableSections.map((sec) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: sec, children: sec }, sec)) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "A", children: "A" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase text-muted-foreground tracking-wide", children: "Channel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", children: CHANNEL_OPTS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setChannel(opt.value),
            "data-ocid": `compose.channel.${opt.value.toLowerCase().replace(/[^a-z]/g, "_")}`,
            className: `flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors border ${channel === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-foreground hover:bg-muted"}`,
            children: [
              opt.icon,
              " ",
              opt.label
            ]
          },
          opt.value
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase text-muted-foreground tracking-wide", children: "Template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: templateKey, onValueChange: onTemplateChange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 text-sm",
              "data-ocid": "compose.template_select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "z-[9999]", children: Object.entries(TEMPLATE_LABELS).map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k, children: label }, k)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold uppercase text-muted-foreground tracking-wide", children: "Message" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `text-xs ${message.length > 1e3 ? "text-destructive" : "text-muted-foreground"}`,
              children: [
                message.length,
                "/1000"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: message,
            onChange: (e) => setMessage(e.target.value),
            placeholder: "Type your message... Use {student_name}, {class}, {amount}, {date} as placeholders",
            rows: 5,
            maxLength: 1e3,
            "data-ocid": "compose.message_textarea",
            className: "text-sm resize-none"
          }
        ),
        message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs p-2 bg-muted/40 rounded border border-border leading-relaxed", children: highlightPlaceholders(message) })
      ] }),
      buildRecipientLabel() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "To:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: buildRecipientLabel() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleSend,
          disabled: !isReady || sendMsg.isPending,
          className: "w-full",
          "data-ocid": "compose.send_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
            sendMsg.isPending ? "Sending…" : "Send Message"
          ]
        }
      )
    ] })
  ] });
}
function StatusBadge({ status }) {
  if (status === "sent")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs bg-green-600/15 text-green-700 border-green-300 gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
      "Sent"
    ] });
  if (status === "failed")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs bg-destructive/15 text-destructive border-destructive/30 gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
      "Failed"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs bg-muted text-muted-foreground gap-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
    "Pending"
  ] });
}
function ChannelBadge({ channel }) {
  if (channel === "WhatsApp")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-green-600/20 text-green-700 border-green-300", children: "📱 WA" });
  if (channel === "In-App")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "🔔 In-App" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs bg-primary/15 text-primary border-primary/30", children: "📡 Both" });
}
function formatRelativeTime(sentAt) {
  try {
    const date = new Date(sentAt);
    const diff = Date.now() - date.getTime();
    if (diff < 6e4) return "just now";
    if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
    if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch {
    return sentAt;
  }
}
function MessageCard({
  msg,
  studentName,
  onRetry,
  isRetrying
}) {
  var _a;
  const classLabel = msg.toClassLevel ? ((_a = CLASS_LEVELS.find((c) => c.value === msg.toClassLevel)) == null ? void 0 : _a.label) ?? msg.toClassLevel : null;
  const recipientLabel = studentName ? studentName : classLabel ? `${classLabel}${msg.toSection ? ` — ${msg.toSection}` : " — All"}` : "Unknown";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-3 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors space-y-2",
      "data-ocid": "history.message_card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground truncate", children: recipientLabel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelBadge, { channel: msg.channel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: msg.deliveryStatus })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: msg.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground whitespace-nowrap shrink-0", children: formatRelativeTime(msg.sentAt) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "From: ",
            msg.fromUsername
          ] }),
          msg.deliveryStatus === "failed" && onRetry && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: () => onRetry(msg),
              disabled: isRetrying,
              "data-ocid": "history.retry_button",
              className: "h-6 text-xs gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3 w-3" }),
                isRetrying ? "Retrying…" : "Retry"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function SendHistoryPanel() {
  const { data: messages = [], isLoading } = useDirectMessages(100);
  const { data: allStudents = [] } = useStudents();
  const { data: settings } = useSettings();
  const sendMsg = useSendDirectMessage();
  const currentUser = useAppStore((s) => {
    var _a;
    return ((_a = s.currentUser) == null ? void 0 : _a.fullName) ?? "admin";
  });
  const studentMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const s of allStudents) m.set(s.id, s.fullName);
    return m;
  }, [allStudents]);
  const sorted = reactExports.useMemo(
    () => [...messages].sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    ),
    [messages]
  );
  async function handleRetry(msg) {
    const student = msg.toStudentId ? allStudents.find((s) => s.id === msg.toStudentId) : null;
    const phone = student ? student.fatherMobile || student.motherMobile || student.mobile || "" : "";
    try {
      await sendMsg.mutateAsync({
        fromUsername: currentUser,
        toStudentId: msg.toStudentId,
        toClassLevel: msg.toClassLevel,
        toSection: msg.toSection,
        channel: msg.channel,
        message: msg.message,
        templateKey: msg.templateKey,
        recipientPhone: phone || void 0,
        whatsappApiKey: (settings == null ? void 0 : settings.whatsappApiKey) || "",
        whatsappApiUrl: ""
      });
      ue.success("Message resent successfully");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to resend message"
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "h-full flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-4 w-4 text-primary" }),
      "Send History",
      messages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs ml-auto", children: messages.length })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex-1 overflow-y-auto py-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-lg" }, i)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center h-40 text-center text-muted-foreground",
        "data-ocid": "history.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-10 w-10 mb-3 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No messages sent yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Sent messages will appear here" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: sorted.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      MessageCard,
      {
        msg,
        studentName: msg.toStudentId ? studentMap.get(msg.toStudentId) : void 0,
        onRetry: handleRetry,
        isRetrying: sendMsg.isPending
      },
      msg.id
    )) }) })
  ] });
}
const PLACEHOLDERS = [
  "{student_name}",
  "{parent_name}",
  "{class}",
  "{adm_no}",
  "{amount}",
  "{date}",
  "{months}",
  "{receipt_no}",
  "{reason}",
  "{resume_date}",
  "{school_name}"
];
function TemplateEditor() {
  const { data: templates, isLoading } = useMessageTemplates();
  const updateTemplate = useUpdateMessageTemplate();
  const [editingKey, setEditingKey] = reactExports.useState(null);
  const [draftText, setDraftText] = reactExports.useState("");
  const effectiveTemplates = { ...defaultTemplates, ...templates };
  function startEdit(key) {
    setEditingKey(key);
    setDraftText(effectiveTemplates[key] ?? "");
  }
  function cancelEdit() {
    setEditingKey(null);
    setDraftText("");
  }
  async function saveTemplate() {
    if (!editingKey) return;
    try {
      await updateTemplate.mutateAsync({
        key: editingKey,
        template: draftText
      });
      ue.success(
        `Template "${TEMPLATE_LABELS[editingKey] ?? editingKey}" saved`
      );
      setEditingKey(null);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save template"
      );
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-lg" }, i)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "template_editor.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 p-3 bg-muted/40 rounded-lg border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide w-full mb-1", children: "Available placeholders:" }),
      PLACEHOLDERS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: "text-xs font-mono cursor-pointer hover:bg-primary/10",
          onClick: () => {
            if (editingKey) setDraftText((prev) => prev + p);
          },
          children: p
        },
        p
      )),
      editingKey && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground w-full mt-1", children: "Click a placeholder to insert it into the editing template." })
    ] }),
    Object.entries(TEMPLATE_LABELS).map(([key, label]) => {
      const isEditing = editingKey === key;
      const text = effectiveTemplates[key] ?? "";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: `transition-shadow ${isEditing ? "ring-2 ring-primary shadow-md" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: label }),
              !isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: () => startEdit(key),
                  "data-ocid": `template.${key}.edit_button`,
                  className: "h-7 text-xs gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "h-3 w-3" }),
                    "Edit"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "sm",
                    onClick: cancelEdit,
                    "data-ocid": `template.${key}.cancel_button`,
                    className: "h-7 text-xs gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
                      "Cancel"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    onClick: saveTemplate,
                    disabled: updateTemplate.isPending,
                    "data-ocid": `template.${key}.save_button`,
                    className: "h-7 text-xs gap-1",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3 w-3" }),
                      updateTemplate.isPending ? "Saving…" : "Save"
                    ]
                  }
                )
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4", children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: draftText,
                onChange: (e) => setDraftText(e.target.value),
                rows: 4,
                "data-ocid": `template.${key}.editor`,
                className: "text-sm font-mono resize-none",
                placeholder: "Template text with placeholders like {student_name}..."
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-mono leading-relaxed", children: text || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic opacity-50", children: "No template set" }) }) })
          ]
        },
        key
      );
    })
  ] });
}
function NotificationsPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const role = (currentUser == null ? void 0 : currentUser.role) ?? "Admin";
  const username = (currentUser == null ? void 0 : currentUser.fullName) ?? "admin";
  const isAdmin = role === "Admin";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full min-h-0",
      "data-ocid": "notifications.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b px-4 py-3 flex items-center gap-3 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-9 w-9 rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-foreground leading-tight", children: "Notifications" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Send messages via WhatsApp, In-App, or both" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto text-xs capitalize", children: role })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Tabs,
          {
            defaultValue: "send",
            className: "flex flex-col flex-1 min-h-0 px-4 py-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "shrink-0 w-full justify-start bg-muted/40 mb-4 h-9", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "send",
                    className: "text-xs gap-1.5",
                    "data-ocid": "notifications.send_tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5" }),
                      "Send Message"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "history",
                    className: "text-xs gap-1.5",
                    "data-ocid": "notifications.history_tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3.5 w-3.5" }),
                      "History"
                    ]
                  }
                ),
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "templates",
                    className: "text-xs gap-1.5",
                    "data-ocid": "notifications.templates_tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-3.5 w-3.5" }),
                      "Templates"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "send", className: "flex-1 min-h-0 mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "grid grid-cols-1 lg:grid-cols-2 gap-4 h-full",
                  style: { minHeight: 0 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComposePanel, { currentUser: username }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SendHistoryPanel, {}) })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TabsContent,
                {
                  value: "history",
                  className: "flex-1 min-h-0 mt-0 overflow-y-auto",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SendHistoryPanel, {})
                }
              ),
              isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                TabsContent,
                {
                  value: "templates",
                  className: "flex-1 min-h-0 mt-0 overflow-y-auto",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Message Templates" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                        "Edit templates used for WhatsApp and In-App notifications. Use placeholders like",
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-muted px-1 rounded text-xs", children: "{ student_name }" }),
                        " ",
                        "which are filled in automatically when sending."
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateEditor, {})
                  ] })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  NotificationsPage as default
};
