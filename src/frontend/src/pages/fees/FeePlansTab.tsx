import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useFeeHeadings,
  useFeePlans,
  useGetSections,
  useSetFeePlan,
} from "@/hooks/useBackend";
import { CLASS_LABELS, CLASS_ORDER, sessionYears } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { ClassLevel, FeeHeading, Section } from "@/types";
import {
  AlertCircle,
  Copy,
  LayoutList,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
/** key: `classLevel||sessionId||sectionId` (sectionId = "null" for class-level) */
type AmountMap = Map<string, string>;

function amtKey(cls: string, sess: string, sid: string, hid: string): string {
  return `${cls}||${sess}||${sid}||${hid}`;
}

/** How many months this heading applies — defaults to 12 if unset */
function headingMonthCount(h: FeeHeading): number {
  return h.applicableMonths && h.applicableMonths.length > 0
    ? h.applicableMonths.length
    : 12;
}

const MONTH_ABBR: Record<string, string> = {
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
  January: "Jan",
  February: "Feb",
  March: "Mar",
};

function MonthPills({ months }: { months: string[] }) {
  if (!months || months.length === 0)
    return (
      <span className="text-[10px] text-muted-foreground">All 12 months</span>
    );
  return (
    <div className="flex flex-wrap gap-0.5 mt-0.5">
      {months.map((m) => (
        <span
          key={m}
          className="inline-block bg-primary/10 text-primary border border-primary/20 rounded px-1 py-0 text-[9px] font-medium leading-4"
        >
          {MONTH_ABBR[m] ?? m}
        </span>
      ))}
    </div>
  );
}

// ─── AmountCell ───────────────────────────────────────────────────────────────
function AmountCell({
  value,
  onChange,
  isInherited,
  dataOcid,
}: {
  value: string;
  onChange: (v: string) => void;
  isInherited: boolean;
  dataOcid: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <td className="px-2 py-1.5 text-right">
      <input
        ref={ref}
        type="text"
        value={value}
        placeholder="—"
        onChange={(e) => {
          if (/^\d*$/.test(e.target.value)) onChange(e.target.value);
        }}
        onFocus={() => ref.current?.select()}
        className={`w-[80px] text-right border rounded px-1.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${
          isInherited
            ? "border-dashed border-muted-foreground/30 bg-muted/20 text-muted-foreground hover:border-input hover:bg-background hover:text-foreground focus:border-input focus:bg-background focus:text-foreground"
            : "border-transparent hover:border-input focus:border-input bg-transparent hover:bg-background focus:bg-background text-foreground"
        }`}
        data-ocid={dataOcid}
      />
    </td>
  );
}

// ─── Plan Group Card ──────────────────────────────────────────────────────────
interface PlanGroupProps {
  classLevel: ClassLevel;
  sessionId: string;
  sectionId: string; // "null" for class-level
  sectionName: string; // "All Sections" or "Section A"
  headings: FeeHeading[];
  amounts: AmountMap;
  inheritedAmounts: AmountMap; // class-level amounts to use as fallback
  onAmtChange: (
    cls: ClassLevel,
    sess: string,
    sid: string,
    hid: string,
    v: string,
  ) => void;
  onSave: (cls: ClassLevel, sess: string, sid: string) => void;
  onDelete: (cls: ClassLevel, sess: string, sid: string) => void;
  isSaving: boolean;
  groupIndex: number;
}

function PlanGroupCard({
  classLevel,
  sessionId,
  sectionId,
  sectionName,
  headings,
  amounts,
  inheritedAmounts,
  onAmtChange,
  onSave,
  onDelete,
  isSaving,
  groupIndex,
}: PlanGroupProps) {
  const annualTotal = headings.reduce((sum, h) => {
    const key = amtKey(classLevel, sessionId, sectionId, h.id);
    const raw = amounts.get(key) ?? "";
    const val =
      raw !== ""
        ? Number(raw)
        : Number(
            inheritedAmounts.get(amtKey(classLevel, sessionId, "null", h.id)) ??
              "0",
          );
    return sum + val * headingMonthCount(h);
  }, 0);

  const monthlyTotal = headings.reduce((sum, h) => {
    const key = amtKey(classLevel, sessionId, sectionId, h.id);
    const raw = amounts.get(key) ?? "";
    const val =
      raw !== ""
        ? Number(raw)
        : Number(
            inheritedAmounts.get(amtKey(classLevel, sessionId, "null", h.id)) ??
              "0",
          );
    return sum + val;
  }, 0);

  const isSectionPlan = sectionId !== "null";

  return (
    <div
      className="border border-border rounded-lg bg-card overflow-hidden"
      data-ocid={`fees.plans.item.${groupIndex}`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="secondary" className="font-semibold">
            {CLASS_LABELS[classLevel]}
          </Badge>
          {isSectionPlan && (
            <Badge
              variant="outline"
              className="text-primary border-primary/30 bg-primary/5"
            >
              {sectionName}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">{sessionId}</span>
          {monthlyTotal > 0 ? (
            <span className="text-xs text-muted-foreground">
              Monthly: ₹{monthlyTotal.toLocaleString("en-IN")} · Annual: ₹
              {annualTotal.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
              No amounts yet
            </span>
          )}
          {isSectionPlan && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
              <AlertCircle size={10} />
              Dashed = inherited from class plan
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => onSave(classLevel, sessionId, sectionId)}
            disabled={isSaving}
            data-ocid={`fees.plans.save_button.${groupIndex}`}
          >
            {isSaving ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Save size={12} />
            )}
            Save
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7 text-destructive hover:text-destructive"
            onClick={() => onDelete(classLevel, sessionId, sectionId)}
            data-ocid={`fees.plans.delete_button.${groupIndex}`}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </div>

      {/* Amounts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-foreground min-w-[180px] sticky left-0 bg-muted/20 z-10">
                Fee Heading
              </th>
              <th className="text-center px-2 py-2 font-semibold text-foreground min-w-[180px]">
                Applicable Months
              </th>
              <th className="text-right px-2 py-2 font-semibold text-foreground w-28">
                Per Month (₹)
              </th>
              <th className="text-right px-3 py-2 font-semibold text-foreground w-28">
                Annual (₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {headings.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 text-center text-xs text-muted-foreground"
                >
                  No fee headings configured. Add headings in the Fee Headings
                  tab first.
                </td>
              </tr>
            ) : (
              headings.map((h, hi) => {
                const key = amtKey(classLevel, sessionId, sectionId, h.id);
                const ownVal = amounts.get(key) ?? "";
                const fallbackVal =
                  inheritedAmounts.get(
                    amtKey(classLevel, sessionId, "null", h.id),
                  ) ?? "";
                const isInherited = isSectionPlan && ownVal === "";
                const displayVal = isInherited ? fallbackVal : ownVal;
                const numVal = Number(displayVal) || 0;
                const mCount = headingMonthCount(h);
                return (
                  <tr
                    key={h.id}
                    className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-3 py-1.5 sticky left-0 bg-card z-10">
                      <div className="font-medium text-foreground">
                        {h.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        × {mCount} month{mCount !== 1 ? "s" : ""}
                      </div>
                    </td>
                    <td className="px-2 py-1.5">
                      <MonthPills months={h.applicableMonths ?? []} />
                    </td>
                    <AmountCell
                      value={displayVal}
                      onChange={(v) =>
                        onAmtChange(classLevel, sessionId, sectionId, h.id, v)
                      }
                      isInherited={isInherited}
                      dataOcid={`fees.plans.cell.${groupIndex}.${hi + 1}`}
                    />
                    <td className="px-3 py-1.5 text-right text-muted-foreground">
                      {numVal > 0
                        ? `₹${(numVal * mCount).toLocaleString("en-IN")}`
                        : "—"}
                    </td>
                  </tr>
                );
              })
            )}
            {headings.length > 0 && (
              <tr className="bg-primary/5 border-t-2 border-primary/20 font-semibold">
                <td
                  colSpan={2}
                  className="px-3 py-2.5 sticky left-0 bg-primary/5 z-10 text-foreground"
                >
                  Grand Total
                </td>
                <td className="px-2 py-2.5 text-right text-foreground">
                  ₹{monthlyTotal.toLocaleString("en-IN")}
                </td>
                <td className="px-3 py-2.5 text-right text-primary font-bold">
                  ₹{annualTotal.toLocaleString("en-IN")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
interface PlanEntry {
  classLevel: ClassLevel;
  sessionId: string;
  sectionId: string; // "null" means class-level
}

function entryKey(e: PlanEntry) {
  return `${e.classLevel}||${e.sessionId}||${e.sectionId}`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function FeePlansTab() {
  const sessions = sessionYears();
  // Fix: use global store session instead of date-based getCurrentSession()
  const { currentSession: storeSession } = useAppStore();

  const { data: backendPlans = [], isLoading: loadingPlans } =
    useFeePlans(storeSession);
  const { data: backendHeadings = [], isLoading: loadingHeadings } =
    useFeeHeadings();
  const { data: allSections = [], isLoading: loadingSections } =
    useGetSections();
  const setFeePlanMutation = useSetFeePlan();

  const headings = backendHeadings.filter((h) => h.isActive);

  const [filterSession, setFilterSession] = useState(storeSession);
  const [filterClass, setFilterClass] = useState<ClassLevel | "all">("all");
  const [filterSection, setFilterSection] = useState<string>("all");
  const [lastFilterClass, setLastFilterClass] = useState<ClassLevel | "all">(
    filterClass,
  );
  // Reset section filter when class changes
  if (lastFilterClass !== filterClass) {
    setLastFilterClass(filterClass);
    setFilterSection("all");
  }

  // Sync filterSession whenever the global store session changes
  useEffect(() => {
    setFilterSession(storeSession);
    initialized.current = false;
  }, [storeSession]);

  const [localEntries, setLocalEntries] = useState<Set<string>>(new Set());
  const [amounts, setAmounts] = useState<AmountMap>(new Map());
  const [copySourceClass, setCopySourceClass] = useState<ClassLevel | "">("");
  const [addClass, setAddClass] = useState<ClassLevel | "">("");
  const [addSection, setAddSection] = useState<string>("class"); // "class" = class-level
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const initialized = useRef(false);

  // Sections available for the currently-selected filter class
  const sectionsForFilterClass = useMemo(
    () =>
      filterClass === "all"
        ? []
        : allSections.filter((s) => s.classLevel === filterClass),
    [allSections, filterClass],
  );

  // Sections for add-class dropdown
  const sectionsForAddClass = useMemo(
    () =>
      addClass ? allSections.filter((s) => s.classLevel === addClass) : [],
    [allSections, addClass],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on session change
  useEffect(() => {
    initialized.current = false;
  }, [filterSession]);

  // Build amounts map from backend plans
  useEffect(() => {
    if (!loadingPlans && !loadingHeadings && !initialized.current) {
      initialized.current = true;
      const map: AmountMap = new Map();
      const keys = new Set<string>();
      for (const p of backendPlans) {
        const sid = p.sectionId ?? "null";
        keys.add(`${p.classLevel}||${p.sessionId}||${sid}`);
        map.set(
          amtKey(p.classLevel, p.sessionId, sid, p.feeHeadingId),
          String(p.monthlyAmount),
        );
      }
      setAmounts(map);
      setLocalEntries(keys);
    }
  }, [backendPlans, loadingPlans, loadingHeadings]);

  // Compute which entries to display
  const filteredEntries = useMemo(() => {
    const all = Array.from(localEntries).map((k) => {
      const [cls, sess, sid] = k.split("||");
      return { classLevel: cls as ClassLevel, sessionId: sess, sectionId: sid };
    });
    return all
      .filter((e) => {
        if (e.sessionId !== filterSession) return false;
        if (filterClass !== "all" && e.classLevel !== filterClass) return false;
        if (filterSection === "all") return true;
        if (filterSection === "class") return e.sectionId === "null";
        return e.sectionId === filterSection;
      })
      .sort((a, b) => {
        const ai = CLASS_ORDER.indexOf(a.classLevel);
        const bi = CLASS_ORDER.indexOf(b.classLevel);
        // Classes not found in CLASS_ORDER go to the end (use 999 instead of -1)
        const ci = (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        if (ci !== 0) return ci;
        // class-level plan first, then sections alphabetically
        if (a.sectionId === "null") return -1;
        if (b.sectionId === "null") return 1;
        return a.sectionId.localeCompare(b.sectionId);
      });
  }, [localEntries, filterSession, filterClass, filterSection]);

  // For "copy from class" strip: all class-level entries in current session
  const classLevelInSession = useMemo(
    () =>
      Array.from(localEntries)
        .filter((k) => k.endsWith(`||${filterSession}||null`))
        .map((k) => k.split("||")[0] as ClassLevel),
    [localEntries, filterSession],
  );

  // Inherited amounts: class-level amounts to use as fallback for section plans
  // We expose the whole amounts map; lookup uses sectionId="null" for class level
  function getInheritedAmounts(): AmountMap {
    return amounts;
  }

  function setAmt(
    cls: ClassLevel,
    sess: string,
    sid: string,
    hid: string,
    val: string,
  ) {
    setAmounts((prev) => {
      const next = new Map(prev);
      next.set(amtKey(cls, sess, sid, hid), val);
      return next;
    });
  }

  function getSectionName(sectionId: string, classLevel: ClassLevel): string {
    if (sectionId === "null") return "All Sections";
    const sec = allSections.find(
      (s) => s.id === sectionId && s.classLevel === classLevel,
    );
    return sec ? `Section ${sec.name}` : sectionId;
  }

  async function saveGroup(cls: ClassLevel, sess: string, sid: string) {
    const key = `${cls}||${sess}||${sid}`;
    setSavingKey(key);
    const monthlyAmounts: Array<[string, number]> = headings
      .map((h) => {
        const own = amounts.get(amtKey(cls, sess, sid, h.id)) ?? "";
        // For section plans: if own is empty, inherit from class-level
        const val =
          own !== ""
            ? Number(own)
            : sid !== "null"
              ? Number(amounts.get(amtKey(cls, sess, "null", h.id)) ?? "0")
              : 0;
        return [h.id, val] as [string, number];
      })
      .filter(([, amt]) => amt > 0);

    try {
      await setFeePlanMutation.mutateAsync({
        classLevel: cls,
        sectionId: sid === "null" ? null : sid,
        sessionId: sess,
        monthlyAmounts,
      });
      const label =
        sid === "null"
          ? `${CLASS_LABELS[cls]} (class-level)`
          : `${CLASS_LABELS[cls]} – ${getSectionName(sid, cls)}`;
      toast.success(`${label} fee plan saved`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save fee plan",
      );
    } finally {
      setSavingKey(null);
    }
  }

  function deleteGroup(cls: ClassLevel, sess: string, sid: string) {
    const key = `${cls}||${sess}||${sid}`;
    setLocalEntries((prev) => {
      const n = new Set(prev);
      n.delete(key);
      return n;
    });
    setAmounts((prev) => {
      const n = new Map(prev);
      for (const h of headings) n.delete(amtKey(cls, sess, sid, h.id));
      return n;
    });
    toast.success("Fee plan removed");
  }

  function addNewEntry() {
    if (!addClass) {
      toast.error("Select a class to add");
      return;
    }
    const sid = addSection === "class" ? "null" : addSection;
    const key = `${addClass}||${filterSession}||${sid}`;
    if (localEntries.has(key)) {
      toast.error("A plan for this class/section already exists");
      return;
    }
    setLocalEntries((prev) => new Set([...prev, key]));
    setAddClass("");
    setAddSection("class");
    const label =
      sid === "null"
        ? CLASS_LABELS[addClass]
        : `${CLASS_LABELS[addClass]} – ${getSectionName(sid, addClass)}`;
    toast.success(`Added ${label} — enter amounts and click Save`);
  }

  function copyToClass(targetCls: ClassLevel, sourceCls: ClassLevel) {
    setAmounts((prev) => {
      const next = new Map(prev);
      for (const h of headings) {
        const srcVal =
          prev.get(amtKey(sourceCls, filterSession, "null", h.id)) ?? "";
        next.set(amtKey(targetCls, filterSession, "null", h.id), srcVal);
      }
      return next;
    });
    const targetKey = `${targetCls}||${filterSession}||null`;
    setLocalEntries((prev) => new Set([...prev, targetKey]));
    toast.success(
      `Amounts copied from ${CLASS_LABELS[sourceCls]} — click Save to persist`,
    );
  }

  const isLoading = loadingPlans || loadingHeadings || loadingSections;

  if (isLoading) {
    return (
      <div
        className="p-6 flex items-center justify-center gap-2 text-muted-foreground text-sm py-20"
        data-ocid="fees.plans.loading_state"
      >
        <Loader2 className="animate-spin size-4" /> Loading fee plans…
      </div>
    );
  }

  // Classes that don't yet have a class-level plan in this session
  const existingClassKeys = Array.from(localEntries)
    .filter((k) => k.endsWith(`||${filterSession}||null`))
    .map((k) => k.split("||")[0] as ClassLevel);
  const availableToAdd = CLASS_ORDER.filter(
    (c) => !existingClassKeys.includes(c),
  );

  return (
    <div className="p-6 space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Fee Plans</h2>
          <p className="text-sm text-muted-foreground">
            Set monthly amounts per heading · Annual total = amount × heading's
            applicable months
          </p>
          <div className="mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Session: {storeSession}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filterSession}
            onValueChange={(v) => {
              setFilterSession(v);
              initialized.current = false;
            }}
          >
            <SelectTrigger
              className="w-32"
              data-ocid="fees.plans.session.select"
            >
              <SelectValue placeholder="Session" />
            </SelectTrigger>
            <SelectContent>
              {sessions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterClass}
            onValueChange={(v) => setFilterClass(v as ClassLevel | "all")}
          >
            <SelectTrigger
              className="w-36"
              data-ocid="fees.plans.class_filter.select"
            >
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {CLASS_ORDER.map((c) => (
                <SelectItem key={c} value={c}>
                  {CLASS_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Section filter — only when a specific class is selected */}
          {filterClass !== "all" && (
            <Select value={filterSection} onValueChange={setFilterSection}>
              <SelectTrigger
                className="w-40"
                data-ocid="fees.plans.section_filter.select"
              >
                <SelectValue placeholder="All Sections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                <SelectItem value="class">Class-Level Plan</SelectItem>
                {sectionsForFilterClass.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    Section {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* ── Add New Class/Section ── */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-muted/20 border border-border rounded-lg">
        <Plus size={14} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Add plan for:</span>
        <Select
          value={addClass}
          onValueChange={(v) => {
            setAddClass(v as ClassLevel);
            setAddSection("class");
          }}
        >
          <SelectTrigger
            className="h-7 w-36 text-xs"
            data-ocid="fees.plans.new_class.select"
          >
            <SelectValue placeholder="Select class…" />
          </SelectTrigger>
          <SelectContent>
            {availableToAdd.length === 0 ? (
              <SelectItem value="_none" disabled>
                All classes added
              </SelectItem>
            ) : (
              availableToAdd.map((c) => (
                <SelectItem key={c} value={c}>
                  {CLASS_LABELS[c]}
                </SelectItem>
              ))
            )}
            {/* Also allow adding section-specific even if class-level exists */}
            {existingClassKeys.map((c) => (
              <SelectItem key={`existing-${c}`} value={c}>
                {CLASS_LABELS[c]} (section)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {addClass && (
          <Select value={addSection} onValueChange={setAddSection}>
            <SelectTrigger
              className="h-7 w-40 text-xs"
              data-ocid="fees.plans.new_section.select"
            >
              <SelectValue placeholder="Class-level plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class">Class-Level Plan</SelectItem>
              {sectionsForAddClass.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  Section {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={addNewEntry}
          data-ocid="fees.plans.add_button"
        >
          <Plus size={12} /> Add
        </Button>
      </div>

      {/* ── Copy from class strip ── */}
      {classLevelInSession.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 bg-muted/30 border border-border rounded-lg text-sm">
          <Copy size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground text-xs">
            Copy class-level amounts from
          </span>
          <Select
            value={copySourceClass}
            onValueChange={(v) => setCopySourceClass(v as ClassLevel)}
          >
            <SelectTrigger
              className="h-7 w-36 text-xs"
              data-ocid="fees.plans.copy_source.select"
            >
              <SelectValue placeholder="Source class" />
            </SelectTrigger>
            <SelectContent>
              {classLevelInSession.map((c) => (
                <SelectItem key={c} value={c}>
                  {CLASS_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">to</span>
          {classLevelInSession
            .filter((c) => c !== copySourceClass)
            .map((c) => (
              <Button
                key={c}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  copySourceClass &&
                  copyToClass(c, copySourceClass as ClassLevel)
                }
                data-ocid={`fees.plans.copy_to.${c}`}
              >
                {CLASS_LABELS[c]}
              </Button>
            ))}
        </div>
      )}

      {/* ── Plan Cards ── */}
      {filteredEntries.length === 0 ? (
        <div
          className="border border-border rounded-lg bg-card py-14 text-center"
          data-ocid="fees.plans.empty_state"
        >
          <LayoutList className="size-10 mx-auto text-muted-foreground/30 mb-3" />
          <p className="font-medium text-foreground">
            No fee plans for {filterSession}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Use "Add plan for" above to create a fee structure for a class or
            section
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry, gi) => {
            const key = entryKey(entry);
            return (
              <PlanGroupCard
                key={key}
                classLevel={entry.classLevel}
                sessionId={entry.sessionId}
                sectionId={entry.sectionId}
                sectionName={getSectionName(entry.sectionId, entry.classLevel)}
                headings={headings}
                amounts={amounts}
                inheritedAmounts={getInheritedAmounts()}
                onAmtChange={setAmt}
                onSave={saveGroup}
                onDelete={deleteGroup}
                isSaving={savingKey === key}
                groupIndex={gi + 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
