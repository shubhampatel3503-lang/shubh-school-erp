/**
 * DateInput — reusable date field that:
 *  • Displays / accepts typed dd/mm/yyyy
 *  • Has a calendar icon that opens the native date picker as fallback
 *  • Validates on blur (rejects impossible dates like 32/13/2026)
 *  • Shows an inline error when the date is invalid
 *  • Stores / emits ISO YYYY-MM-DD internally for backend compatibility
 *  • Respects optional minDate / maxDate (ISO strings)
 */

import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import React, { useId, useRef, useState } from "react";

export interface DateInputProps {
  value: string; // ISO YYYY-MM-DD (or empty string)
  onChange: (iso: string) => void; // emits ISO YYYY-MM-DD (or empty string)
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  minDate?: string; // ISO YYYY-MM-DD
  maxDate?: string; // ISO YYYY-MM-DD
  disabled?: boolean;
  "data-ocid"?: string;
}

// ── helpers ──────────────────────────────────────────────────────────────────

/** Convert ISO YYYY-MM-DD → dd/mm/yyyy display string */
function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length === 3) {
    const [yyyy, mm, dd] = parts;
    return `${dd}/${mm}/${yyyy}`;
  }
  return "";
}

/** Convert dd/mm/yyyy → ISO YYYY-MM-DD (or "" if unparseable) */
function displayToIso(display: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(display);
  if (!match) return "";
  const [, dd, mm, yyyy] = match;
  return `${yyyy}-${mm}-${dd}`;
}

/** Validate a dd/mm/yyyy string. Returns error message or null. */
function validateDisplay(display: string, required: boolean): string | null {
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
  if (
    d.getFullYear() !== yyyy ||
    d.getMonth() !== mm - 1 ||
    d.getDate() !== dd
  ) {
    return "Invalid date.";
  }
  return null;
}

// ── component ────────────────────────────────────────────────────────────────

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder = "dd/mm/yyyy",
      required = false,
      className,
      minDate,
      maxDate,
      disabled = false,
      "data-ocid": ocid,
    },
    _ref,
  ) => {
    const uid = useId();
    const nativeRef = useRef<HTMLInputElement>(null);

    // Internal display state — what the user sees while typing
    const [display, setDisplay] = useState<string>(() => isoToDisplay(value));
    const [error, setError] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);

    // Sync display when value prop changes externally
    React.useEffect(() => {
      setDisplay(isoToDisplay(value));
    }, [value]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      let raw = e.target.value;

      // Auto-insert slashes as user types digits
      const digits = raw.replace(/\D/g, "");
      if (digits.length <= 2) {
        raw = digits;
      } else if (digits.length <= 4) {
        raw = `${digits.slice(0, 2)}/${digits.slice(2)}`;
      } else {
        raw = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
      }

      setDisplay(raw);

      // Live-clear error as user types
      if (touched) setError(null);

      // Emit ISO only when we have a complete, valid date
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

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      // Allow: backspace, delete, tab, arrows, ctrl+a/c/v/x
      const allowed = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];
      if (allowed.includes(e.key)) return;
      if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key))
        return;
      // Allow digits and slash
      if (!/[\d/]/.test(e.key)) {
        e.preventDefault();
      }
    }

    function openNativePicker() {
      nativeRef.current?.showPicker?.();
      nativeRef.current?.click();
    }

    function handleNativeChange(e: React.ChangeEvent<HTMLInputElement>) {
      const iso = e.target.value; // YYYY-MM-DD
      if (iso) {
        setDisplay(isoToDisplay(iso));
        setError(null);
        onChange(iso);
      }
    }

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        {label && (
          <label htmlFor={uid} className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <input
            id={uid}
            type="text"
            inputMode="numeric"
            value={display}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={10}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            data-ocid={ocid}
            aria-invalid={!!error}
            aria-describedby={error ? `${uid}-error` : undefined}
            className={cn(
              "w-full rounded-md border bg-background px-3 py-2 text-sm",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-input",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "pr-9",
              error
                ? "border-destructive focus:ring-destructive/40"
                : "border-input",
            )}
          />

          {/* Hidden native date input used only as calendar picker */}
          <input
            ref={nativeRef}
            type="date"
            tabIndex={-1}
            aria-hidden="true"
            min={minDate}
            max={maxDate}
            value={value || ""}
            onChange={handleNativeChange}
            className="absolute right-0 w-8 opacity-0 cursor-pointer"
            style={{ height: "100%" }}
          />

          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            onClick={openNativePicker}
            aria-label="Open calendar"
            className={cn(
              "absolute right-0 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground",
              "transition-colors duration-200 focus:outline-none z-10",
              "focus-visible:ring-2 focus-visible:ring-ring rounded",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            style={{ height: "100%" }}
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
        </div>

        {error && touched && (
          <p
            id={`${uid}-error`}
            role="alert"
            className="text-xs text-destructive mt-0.5"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

DateInput.displayName = "DateInput";
export default DateInput;
