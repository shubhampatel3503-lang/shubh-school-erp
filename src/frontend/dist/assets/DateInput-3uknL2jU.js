import { br as React, r as reactExports, j as jsxRuntimeExports, aM as cn } from "./index-pMBTUEbj.js";
import { C as Calendar } from "./calendar-CAegGMND.js";
function isoToDisplay(iso) {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return "";
}
function displayToIso(display) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display);
  if (!match) return "";
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
}
function validateDisplay(display, required) {
  if (!display) {
    return required ? "Date is required." : null;
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(display)) {
    return "Enter date as dd/mm/yyyy.";
  }
  const [dd, mm, yyyy] = display.split("/").map(Number);
  if (mm < 1 || mm > 12) return "Month must be 01–12.";
  if (dd < 1 || dd > 31) return "Day must be 01–31.";
  const d = new Date(yyyy, mm - 1, dd);
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) {
    return "Invalid date.";
  }
  return null;
}
const DateInput = React.forwardRef(
  ({
    value,
    onChange,
    label,
    placeholder = "dd/mm/yyyy",
    required = false,
    className,
    minDate,
    maxDate,
    disabled = false,
    "data-ocid": ocid
  }, _ref) => {
    const uid = reactExports.useId();
    const nativeRef = reactExports.useRef(null);
    const [display, setDisplay] = reactExports.useState(() => isoToDisplay(value));
    const [error, setError] = reactExports.useState(null);
    const [touched, setTouched] = reactExports.useState(false);
    React.useEffect(() => {
      setDisplay(isoToDisplay(value));
    }, [value]);
    function handleChange(e) {
      let raw = e.target.value;
      const digits = raw.replace(/\D/g, "");
      if (digits.length <= 2) {
        raw = digits;
      } else if (digits.length <= 4) {
        raw = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        raw = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      }
      setDisplay(raw);
      if (touched) setError(null);
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
        const iso = displayToIso(raw);
        const err = validateDisplay(raw, required);
        if (!err && iso) {
          onChange(iso);
        }
      } else if (raw === "") {
        onChange("");
      }
    }
    function handleBlur() {
      setTouched(true);
      const err = validateDisplay(display, required);
      setError(err);
      if (!err && display) {
        const iso = displayToIso(display);
        if (iso) onChange(iso);
      }
    }
    function handleKeyDown(e) {
      const allowed = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ];
      if (allowed.includes(e.key)) return;
      if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key))
        return;
      if (!/[\d/]/.test(e.key)) {
        e.preventDefault();
      }
    }
    function openNativePicker() {
      var _a, _b, _c;
      (_b = (_a = nativeRef.current) == null ? void 0 : _a.showPicker) == null ? void 0 : _b.call(_a);
      (_c = nativeRef.current) == null ? void 0 : _c.click();
    }
    function handleNativeChange(e) {
      const iso = e.target.value;
      if (iso) {
        setDisplay(isoToDisplay(iso));
        setError(null);
        onChange(iso);
      }
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col gap-1", className), children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: uid, className: "text-sm font-medium text-foreground", children: [
        label,
        required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive ml-1", children: "*" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            id: uid,
            type: "text",
            inputMode: "numeric",
            value: display,
            placeholder,
            disabled,
            maxLength: 10,
            onChange: handleChange,
            onBlur: handleBlur,
            onKeyDown: handleKeyDown,
            "data-ocid": ocid,
            "aria-invalid": !!error,
            "aria-describedby": error ? `${uid}-error` : void 0,
            className: cn(
              "w-full rounded-md border bg-background px-3 py-2 text-sm",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-input",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "pr-9",
              error ? "border-destructive focus:ring-destructive/40" : "border-input"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: nativeRef,
            type: "date",
            tabIndex: -1,
            "aria-hidden": "true",
            min: minDate,
            max: maxDate,
            value: value || "",
            onChange: handleNativeChange,
            className: "absolute right-0 w-8 opacity-0 cursor-pointer",
            style: { height: "100%" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            tabIndex: -1,
            disabled,
            onClick: openNativePicker,
            "aria-label": "Open calendar",
            className: cn(
              "absolute right-0 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground",
              "transition-colors duration-200 focus:outline-none z-10",
              "focus-visible:ring-2 focus-visible:ring-ring rounded",
              disabled && "opacity-50 cursor-not-allowed"
            ),
            style: { height: "100%" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" })
          }
        )
      ] }),
      error && touched && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          id: `${uid}-error`,
          role: "alert",
          className: "text-xs text-destructive mt-0.5",
          children: error
        }
      )
    ] });
  }
);
DateInput.displayName = "DateInput";
export {
  DateInput as D
};
