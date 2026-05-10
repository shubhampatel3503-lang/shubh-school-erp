import { ae as createLucideIcon, r as reactExports, aE as useDirection, aF as useControllableState, j as jsxRuntimeExports, aG as Primitive, aH as useComposedRefs, aI as composeEventHandlers, aJ as Presence, aK as createContextScope, aL as useSize, aM as cn, P as MessageSquare, t as Badge, e as Button, L as Label, I as Input, aD as Bell, U as Users, a0 as formatDate, F as ue } from "./index-pMBTUEbj.js";
import { C as Card, b as CardHeader, c as CardTitle, d as CardDescription, a as CardContent } from "./card-r-j30wiQ.js";
import { R as Root, I as Item, d as createRovingFocusGroupScope, T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { u as usePrevious } from "./index-Nv6ob_Pe.js";
import { C as Circle } from "./circle-DVWL3YbQ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { S as Switch } from "./switch-CzdiPi9K.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { S as Send } from "./send-ByllD6tM.js";
import { C as Clock } from "./clock-DizmZPyv.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { Z as Zap } from "./zap-C7jt1CDw.js";
import { C as Calendar } from "./calendar-CAegGMND.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M13.234 20.252 21 12.3", key: "1cbrk9" }],
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486",
      key: "1pkts6"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode);
var RADIO_NAME = "Radio";
var [createRadioContext, createRadioScope] = createContextScope(RADIO_NAME);
var [RadioProvider, useRadioContext] = createRadioContext(RADIO_NAME);
var Radio = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadio,
      name,
      checked = false,
      required,
      disabled,
      value = "on",
      onCheck,
      form,
      ...radioProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioProvider, { scope: __scopeRadio, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "radio",
          "aria-checked": checked,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...radioProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            if (!checked) onCheck == null ? void 0 : onCheck();
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        RadioBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Radio.displayName = RADIO_NAME;
var INDICATOR_NAME = "RadioIndicator";
var RadioIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadio, forceMount, ...indicatorProps } = props;
    const context = useRadioContext(INDICATOR_NAME, __scopeRadio);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...indicatorProps,
        ref: forwardedRef
      }
    ) });
  }
);
RadioIndicator.displayName = INDICATOR_NAME;
var BUBBLE_INPUT_NAME = "RadioBubbleInput";
var RadioBubbleInput = reactExports.forwardRef(
  ({
    __scopeRadio,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.input,
      {
        type: "radio",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
RadioBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
var RADIO_GROUP_NAME = "RadioGroup";
var [createRadioGroupContext] = createContextScope(RADIO_GROUP_NAME, [
  createRovingFocusGroupScope,
  createRadioScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var useRadioScope = createRadioScope();
var [RadioGroupProvider, useRadioGroupContext] = createRadioGroupContext(RADIO_GROUP_NAME);
var RadioGroup$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRadioGroup,
      name,
      defaultValue,
      value: valueProp,
      required = false,
      disabled = false,
      orientation,
      dir,
      loop = true,
      onValueChange,
      ...groupProps
    } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue ?? null,
      onChange: onValueChange,
      caller: RADIO_GROUP_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      RadioGroupProvider,
      {
        scope: __scopeRadioGroup,
        name,
        required,
        disabled,
        value,
        onValueChange: setValue,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation,
            dir: direction,
            loop,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Primitive.div,
              {
                role: "radiogroup",
                "aria-required": required,
                "aria-orientation": orientation,
                "data-disabled": disabled ? "" : void 0,
                dir: direction,
                ...groupProps,
                ref: forwardedRef
              }
            )
          }
        )
      }
    );
  }
);
RadioGroup$1.displayName = RADIO_GROUP_NAME;
var ITEM_NAME = "RadioGroupItem";
var RadioGroupItem$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, disabled, ...itemProps } = props;
    const context = useRadioGroupContext(ITEM_NAME, __scopeRadioGroup);
    const isDisabled = context.disabled || disabled;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeRadioGroup);
    const radioScope = useRadioScope(__scopeRadioGroup);
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const checked = context.value === itemProps.value;
    const isArrowKeyPressedRef = reactExports.useRef(false);
    reactExports.useEffect(() => {
      const handleKeyDown = (event) => {
        if (ARROW_KEYS.includes(event.key)) {
          isArrowKeyPressedRef.current = true;
        }
      };
      const handleKeyUp = () => isArrowKeyPressedRef.current = false;
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      };
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !isDisabled,
        active: checked,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Radio,
          {
            disabled: isDisabled,
            required: context.required,
            checked,
            ...radioScope,
            ...itemProps,
            name: context.name,
            ref: composedRefs,
            onCheck: () => context.onValueChange(itemProps.value),
            onKeyDown: composeEventHandlers((event) => {
              if (event.key === "Enter") event.preventDefault();
            }),
            onFocus: composeEventHandlers(itemProps.onFocus, () => {
              var _a;
              if (isArrowKeyPressedRef.current) (_a = ref.current) == null ? void 0 : _a.click();
            })
          }
        )
      }
    );
  }
);
RadioGroupItem$1.displayName = ITEM_NAME;
var INDICATOR_NAME2 = "RadioGroupIndicator";
var RadioGroupIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeRadioGroup, ...indicatorProps } = props;
    const radioScope = useRadioScope(__scopeRadioGroup);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioIndicator, { ...radioScope, ...indicatorProps, ref: forwardedRef });
  }
);
RadioGroupIndicator.displayName = INDICATOR_NAME2;
var Root2 = RadioGroup$1;
var Item2 = RadioGroupItem$1;
var Indicator = RadioGroupIndicator;
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
const INIT_SENT = [
  {
    id: "m1",
    channel: "WhatsApp",
    target: "All Students",
    subject: "Fee Reminder",
    body: "Dear Parent, please clear pending fees before 30th April.",
    sentAt: "2026-04-25",
    deliveredCount: 138,
    totalCount: 145
  },
  {
    id: "m2",
    channel: "SMS",
    target: "Class 10-A",
    subject: "Exam Timetable",
    body: "Annual exam timetable has been released. Please check the school app.",
    sentAt: "2026-04-20",
    deliveredCount: 42,
    totalCount: 42
  },
  {
    id: "m3",
    channel: "WhatsApp",
    target: "By Route - Route A",
    subject: "Bus Delay",
    body: "Route A bus will be delayed by 20 minutes today due to road work.",
    sentAt: "2026-04-15",
    deliveredCount: 65,
    totalCount: 68
  }
];
const INIT_NOTIFS = [
  {
    id: "n1",
    title: "Fee Due Alert",
    message: "45 students have pending fees for April 2026.",
    target: "Accountant",
    type: "Fee",
    isRead: false,
    createdAt: "2026-04-27"
  },
  {
    id: "n2",
    title: "Low Attendance",
    message: "Class 8-A attendance below 75% this week.",
    target: "Admin",
    type: "Attendance",
    isRead: false,
    createdAt: "2026-04-26"
  },
  {
    id: "n3",
    title: "New Admission",
    message: "Arjun Singh admitted to LKG-A.",
    target: "Admin",
    type: "Info",
    isRead: true,
    createdAt: "2026-04-24"
  }
];
const INIT_SCHEDULED = [
  {
    id: "sc1",
    title: "Monthly Fee Reminder",
    trigger: "On 1st of every month",
    target: "All Parents",
    scheduledAt: "Monthly",
    isEnabled: true
  },
  {
    id: "sc2",
    title: "Exam Result Notification",
    trigger: "On exam result publish",
    target: "All Students",
    scheduledAt: "On event",
    isEnabled: true
  },
  {
    id: "sc3",
    title: "Birthday Wishes",
    trigger: "On student birthday",
    target: "Student + Parent",
    scheduledAt: "Daily",
    isEnabled: false
  }
];
function loadWaSettings() {
  try {
    const raw = localStorage.getItem("wacoder_settings");
    if (!raw) return { apiKey: "", senderNumber: "" };
    return JSON.parse(raw);
  } catch {
    return { apiKey: "", senderNumber: "" };
  }
}
function saveWaSettings(s) {
  localStorage.setItem("wacoder_settings", JSON.stringify(s));
}
async function sendViaWacoder(apiKey, mobile, message) {
  try {
    const clean = mobile.replace(/\D/g, "").slice(-10);
    if (clean.length < 10)
      return { mobile, success: false, error: "Invalid mobile" };
    const url = `https://wacoder.in/api/send?apikey=${encodeURIComponent(apiKey)}&mobile=${encodeURIComponent(clean)}&message=${encodeURIComponent(message)}`;
    const res = await fetch(url);
    const text = await res.text();
    const ok = res.ok && /success|sent/i.test(text);
    return { mobile: clean, success: ok, error: ok ? void 0 : text };
  } catch (e) {
    return {
      mobile,
      success: false,
      error: e instanceof Error ? e.message : "Network error"
    };
  }
}
function CommunicationPage() {
  const [channel, setChannel] = reactExports.useState("WhatsApp");
  const [target, setTarget] = reactExports.useState("all");
  const [subject, setSubject] = reactExports.useState("");
  const [body, setBody] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  const [sentMessages, setSentMessages] = reactExports.useState(INIT_SENT);
  const [waSettings, setWaSettings] = reactExports.useState(loadWaSettings);
  const [showWaSetup, setShowWaSetup] = reactExports.useState(false);
  const [waApiKeyInput, setWaApiKeyInput] = reactExports.useState("");
  const [waSenderInput, setWaSenderInput] = reactExports.useState("");
  const [customMobiles, setCustomMobiles] = reactExports.useState("");
  function openWaSetup() {
    setWaApiKeyInput(waSettings.apiKey);
    setWaSenderInput(waSettings.senderNumber);
    setShowWaSetup(true);
  }
  function saveWaConfig() {
    const s = {
      apiKey: waApiKeyInput.trim(),
      senderNumber: waSenderInput.trim()
    };
    saveWaSettings(s);
    setWaSettings(s);
    setShowWaSetup(false);
    ue.success("WhatsApp (wacoder.in) settings saved");
  }
  const [notifTitle, setNotifTitle] = reactExports.useState("");
  const [notifMessage, setNotifMessage] = reactExports.useState("");
  const [notifTarget, setNotifTarget] = reactExports.useState("Admin");
  const [notifications, setNotifications] = reactExports.useState(INIT_NOTIFS);
  const [schedName, setSchedName] = reactExports.useState("");
  const [schedTrigger, setSchedTrigger] = reactExports.useState("");
  const [schedTarget, setSchedTarget] = reactExports.useState("All Students");
  const [scheduled, setScheduled] = reactExports.useState(INIT_SCHEDULED);
  async function handleSend() {
    if (!body.trim()) {
      ue.error("Message body is required");
      return;
    }
    if (channel === "WhatsApp") {
      if (!waSettings.apiKey) {
        openWaSetup();
        ue.error("Please configure your wacoder.in API key first");
        return;
      }
      const mobiles = [];
      if (target === "custom") {
        for (const m of customMobiles.split(/[,\n;]+/)) {
          const t = m.trim().replace(/\D/g, "");
          if (t.length >= 10) mobiles.push(t.slice(-10));
        }
        if (mobiles.length === 0) {
          ue.error("Enter at least one mobile number for Custom target");
          return;
        }
      } else {
        mobiles.push("0000000000");
      }
      setSending(true);
      let delivered = 0;
      for (const mobile of mobiles) {
        const r = await sendViaWacoder(waSettings.apiKey, mobile, body);
        if (r.success) delivered++;
      }
      setSending(false);
      const targetLabel2 = target === "all" ? "All Students" : target === "class" ? "By Class" : target === "route" ? "By Route" : "Custom";
      setSentMessages((prev) => [
        {
          id: `m${Date.now()}`,
          channel: "WhatsApp",
          target: targetLabel2,
          subject: subject || "(No subject)",
          body,
          sentAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          deliveredCount: delivered,
          totalCount: mobiles.length
        },
        ...prev
      ]);
      setSubject("");
      setBody("");
      if (delivered > 0)
        ue.success(
          `WhatsApp: ${delivered}/${mobiles.length} sent via wacoder.in`
        );
      else ue.error("WhatsApp send failed — check your wacoder.in API key");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    const targetLabel = target === "all" ? "All Students" : target === "class" ? "By Class" : target === "route" ? "By Route" : "Custom";
    setSentMessages((prev) => [
      {
        id: `m${Date.now()}`,
        channel: "SMS",
        target: targetLabel,
        subject: subject || "(No subject)",
        body,
        sentAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        deliveredCount: 40,
        totalCount: 40
      },
      ...prev
    ]);
    setSending(false);
    setSubject("");
    setBody("");
    ue.success("SMS message sent successfully");
  }
  function handleCreateNotif() {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      ue.error("Title and message are required");
      return;
    }
    setNotifications((prev) => [
      {
        id: `n${Date.now()}`,
        title: notifTitle,
        message: notifMessage,
        target: notifTarget,
        type: "Info",
        isRead: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
      },
      ...prev
    ]);
    setNotifTitle("");
    setNotifMessage("");
    ue.success("Notification created");
  }
  function handleMarkRead(id) {
    setNotifications(
      (prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
    );
  }
  function handleDeleteNotif(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }
  function handleAddScheduled() {
    if (!schedName.trim() || !schedTrigger.trim()) {
      ue.error("Name and trigger are required");
      return;
    }
    setScheduled((prev) => [
      {
        id: `sc${Date.now()}`,
        title: schedName,
        trigger: schedTrigger,
        target: schedTarget,
        scheduledAt: "On event",
        isEnabled: true
      },
      ...prev
    ]);
    setSchedName("");
    setSchedTrigger("");
    ue.success("Scheduled notification added");
  }
  function handleToggleScheduled(id) {
    setScheduled(
      (prev) => prev.map((s) => s.id === id ? { ...s, isEnabled: !s.isEnabled } : s)
    );
  }
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "communication.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-6 w-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Communication" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Broadcast messages, manage notifications, and schedule alerts" })
      ] }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", className: "ml-auto", children: [
        unreadCount,
        " unread"
      ] })
    ] }),
    channel === "WhatsApp" && !waSettings.apiKey && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-amber-300 bg-amber-50 px-4 py-2.5 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-amber-700 font-medium", children: "⚠ WhatsApp not configured — set up wacoder.in to send real messages" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "border-amber-400 text-amber-700 hover:bg-amber-100 shrink-0",
          onClick: openWaSetup,
          "data-ocid": "communication.wa_setup.button",
          children: "Configure"
        }
      )
    ] }),
    channel === "WhatsApp" && waSettings.apiKey && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-green-300 bg-green-50 px-4 py-2 flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-green-700 font-medium", children: [
        "✓ WhatsApp connected via wacoder.in",
        waSettings.senderNumber ? ` · Sender: ${waSettings.senderNumber}` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "ghost",
          className: "text-xs h-7 text-green-700",
          onClick: openWaSetup,
          "data-ocid": "communication.wa_edit.button",
          children: "Edit"
        }
      )
    ] }),
    showWaSetup && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/40",
        "data-ocid": "communication.wa_setup.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-xl shadow-xl border border-border max-w-md w-full mx-4 p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "WhatsApp via wacoder.in" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Enter your wacoder.in credentials. Messages are sent via",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://wacoder.in",
                target: "_blank",
                rel: "noreferrer",
                className: "text-primary underline font-medium",
                children: "wacoder.in"
              }
            ),
            " ",
            "API."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                "API Key ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: waApiKeyInput,
                  onChange: (e) => setWaApiKeyInput(e.target.value),
                  placeholder: "Your wacoder.in API key",
                  type: "password",
                  "data-ocid": "communication.wa_apikey.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Sender Number (optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: waSenderInput,
                  onChange: (e) => setWaSenderInput(e.target.value),
                  placeholder: "e.g. 9876543210",
                  "data-ocid": "communication.wa_sender.input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setShowWaSetup(false),
                "data-ocid": "communication.wa_setup.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: saveWaConfig,
                disabled: !waApiKeyInput.trim(),
                "data-ocid": "communication.wa_setup.save_button",
                children: "Save Settings"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "broadcast", "data-ocid": "communication.tab", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "broadcast",
            "data-ocid": "communication.broadcast.tab",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
              "Broadcast"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "notifications",
            "data-ocid": "communication.notifications.tab",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 mr-2" }),
              "Notifications",
              unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1.5 bg-destructive text-destructive-foreground rounded-full text-xs px-1.5", children: unreadCount })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TabsTrigger,
          {
            value: "scheduler",
            "data-ocid": "communication.scheduler.tab",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 mr-2" }),
              "Scheduler"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "broadcast", className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5 text-primary" }),
                "New Broadcast"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Send a message to students, parents, or staff" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Channel" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  RadioGroup,
                  {
                    value: channel,
                    onValueChange: (v) => setChannel(v),
                    className: "flex gap-6",
                    "data-ocid": "communication.channel.radio",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          RadioGroupItem,
                          {
                            value: "WhatsApp",
                            id: "ch-wa",
                            "data-ocid": "communication.channel_whatsapp.radio"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Label,
                          {
                            htmlFor: "ch-wa",
                            className: "cursor-pointer font-normal",
                            children: "WhatsApp"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          RadioGroupItem,
                          {
                            value: "SMS",
                            id: "ch-sms",
                            "data-ocid": "communication.channel_sms.radio"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Label,
                          {
                            htmlFor: "ch-sms",
                            className: "cursor-pointer font-normal",
                            children: "SMS"
                          }
                        )
                      ] })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Target Audience" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  RadioGroup,
                  {
                    value: target,
                    onValueChange: setTarget,
                    className: "grid grid-cols-2 gap-2",
                    "data-ocid": "communication.target.radio",
                    children: [
                      { id: "all", label: "All Students & Parents" },
                      { id: "class", label: "By Class" },
                      { id: "route", label: "By Transport Route" },
                      { id: "custom", label: "Custom Mobile Numbers" }
                    ].map(({ id, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `flex items-center gap-2 p-3 rounded-lg border cursor-pointer ${target === id ? "border-primary bg-primary/5" : "border-border"}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            RadioGroupItem,
                            {
                              value: id,
                              id: `tgt-${id}`,
                              "data-ocid": `communication.target_${id}.radio`
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Label,
                            {
                              htmlFor: `tgt-${id}`,
                              className: "cursor-pointer font-normal text-sm",
                              children: label
                            }
                          )
                        ]
                      },
                      id
                    ))
                  }
                ),
                target === "class" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { "data-ocid": "communication.class.select", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Class" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Class 5-A", "Class 8-A", "Class 10-A"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
                ] }),
                target === "route" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { "data-ocid": "communication.route.select", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Route" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "r1", children: "Route A - North Delhi" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "r2", children: "Route B - South Delhi" })
                  ] })
                ] }),
                target === "custom" && channel === "WhatsApp" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Mobile Numbers" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      rows: 3,
                      value: customMobiles,
                      onChange: (e) => setCustomMobiles(e.target.value),
                      placeholder: "9876543210, 9123456780…",
                      className: "text-xs",
                      "data-ocid": "communication.custom_mobiles.textarea"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "10-digit numbers, comma or newline separated" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Subject (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: subject,
                    onChange: (e) => setSubject(e.target.value),
                    placeholder: "Message subject",
                    "data-ocid": "communication.subject.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Message" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    rows: 5,
                    value: body,
                    onChange: (e) => setBody(e.target.value),
                    placeholder: "Type your message here…",
                    "data-ocid": "communication.body.textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
                  body.length,
                  " / 1600 chars"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    "data-ocid": "communication.attach.upload_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "h-4 w-4 mr-2" }),
                      "Attach File"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    onClick: handleSend,
                    disabled: sending,
                    className: "ml-auto",
                    "data-ocid": "communication.send.primary_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4 mr-2" }),
                      sending ? "Sending…" : `Send via ${channel}`
                    ]
                  }
                )
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm", children: "Quick Stats" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: [
              { label: "Messages Today", value: "3" },
              { label: "This Week", value: "12" },
              { label: "Total Recipients", value: "245" }
            ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex justify-between items-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: value })
                ]
              },
              label
            )) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-primary" }),
            "Sent Messages"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: sentMessages.map((msg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-4 p-4 rounded-lg bg-muted/20 border border-border",
              "data-ocid": `communication.sent.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `p-2 rounded-lg ${msg.channel === "WhatsApp" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground truncate", children: msg.subject }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: msg.channel }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: msg.target })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: msg.body })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-xs text-muted-foreground shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: formatDate(msg.sentAt) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-green-600 font-medium", children: [
                    msg.deliveredCount,
                    "/",
                    msg.totalCount,
                    " delivered"
                  ] })
                ] })
              ]
            },
            msg.id
          )) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "notifications", className: "space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Notification Feed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "destructive", children: [
              unreadCount,
              " unread"
            ] })
          ] }),
          notifications.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center py-12 text-muted-foreground",
              "data-ocid": "communication.notifications.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-12 w-12 mx-auto mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No notifications yet" })
              ]
            }
          ),
          notifications.map((notif, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex items-start gap-4 p-4 rounded-lg border transition-colors ${notif.isRead ? "bg-card border-border" : "bg-primary/5 border-primary/20"}`,
              "data-ocid": `communication.notification.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `p-2 rounded-lg ${notif.isRead ? "bg-muted/40" : "bg-primary/10"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bell,
                      {
                        className: `h-4 w-4 ${notif.isRead ? "text-muted-foreground" : "text-primary"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm text-foreground", children: notif.title }),
                    !notif.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-primary" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: notif.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: notif.type }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "→ ",
                      notif.target
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDate(notif.createdAt) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                  !notif.isRead && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-7 px-2",
                      onClick: () => handleMarkRead(notif.id),
                      "data-ocid": `communication.mark_read.button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-7 px-2 text-destructive hover:text-destructive",
                      onClick: () => handleDeleteNotif(notif.id),
                      "data-ocid": `communication.delete_notif.delete_button.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  )
                ] })
              ]
            },
            notif.id
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-primary" }),
            "Create Notification"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: notifTitle,
                  onChange: (e) => setNotifTitle(e.target.value),
                  placeholder: "Notification title",
                  className: "h-8",
                  "data-ocid": "communication.notif_title.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Message" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  rows: 3,
                  value: notifMessage,
                  onChange: (e) => setNotifMessage(e.target.value),
                  placeholder: "Notification message",
                  "data-ocid": "communication.notif_message.textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Target" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: notifTarget, onValueChange: setNotifTarget, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8",
                    "data-ocid": "communication.notif_target.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [
                  "Admin",
                  "Teacher",
                  "Accountant",
                  "All Staff",
                  "All Parents",
                  "All Students"
                ].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "w-full",
                onClick: handleCreateNotif,
                "data-ocid": "communication.create_notif.submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 mr-2" }),
                  "Create"
                ]
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "scheduler", className: "space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: "Scheduled Notifications" }),
          scheduled.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex items-center gap-4 p-4 rounded-lg border ${item.isEnabled ? "bg-card border-border" : "bg-muted/20 border-border opacity-60"}`,
              "data-ocid": `communication.scheduled.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `p-2 rounded-lg ${item.isEnabled ? "bg-primary/10" : "bg-muted/40"}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Calendar,
                      {
                        className: `h-4 w-4 ${item.isEnabled ? "text-primary" : "text-muted-foreground"}`
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: item.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "Trigger: ",
                      item.trigger
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                      "→ ",
                      item.target
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: item.scheduledAt }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: item.isEnabled,
                      onCheckedChange: () => handleToggleScheduled(item.id),
                      "data-ocid": `communication.scheduled.toggle.${i + 1}`
                    }
                  )
                ] })
              ]
            },
            item.id
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
            "New Scheduled Alert"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: schedName,
                  onChange: (e) => setSchedName(e.target.value),
                  placeholder: "e.g. Fee Reminder",
                  className: "h-8",
                  "data-ocid": "communication.sched_name.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Trigger Rule" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: schedTrigger, onValueChange: setSchedTrigger, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8",
                    "data-ocid": "communication.sched_trigger.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select trigger" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [
                  "On fee due date",
                  "On exam result publish",
                  "On student birthday",
                  "On low attendance",
                  "Monthly (1st of month)",
                  "Weekly (Monday)"
                ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Target" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: schedTarget, onValueChange: setSchedTarget, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8",
                    "data-ocid": "communication.sched_target.select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [
                  "All Students",
                  "All Parents",
                  "All Staff",
                  "Admin",
                  "Accountant"
                ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "w-full",
                onClick: handleAddScheduled,
                "data-ocid": "communication.sched.submit_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 mr-2" }),
                  "Schedule"
                ]
              }
            )
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CommunicationPage as default
};
