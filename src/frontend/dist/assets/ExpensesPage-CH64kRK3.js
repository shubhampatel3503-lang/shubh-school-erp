import { ae as createLucideIcon, d as useAppStore, bc as useExpenseHeadsV2, bd as useExpenseEntriesV2, be as useGetExpenseStats, bf as useAddExpenseHeadV2, bg as useUpdateExpenseHeadV2, bh as useDeleteExpenseHeadV2, bi as useAddExpenseEntryV2, bj as useDeleteExpenseEntryV2, r as reactExports, j as jsxRuntimeExports, bk as formatCurrency, e as Button, t as Badge, a2 as TrendingUp, aR as IndianRupee, ab as downloadCSV, S as Skeleton, a0 as formatDate, F as ue, bl as SCHOOL_MONTHS, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, I as Input } from "./index-pMBTUEbj.js";
import { D as DateInput } from "./DateInput-3uknL2jU.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { W as Wallet } from "./wallet-BSqNaYM4.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { C as CircleArrowUp } from "./circle-arrow-up-BFj8jnyJ.js";
import { S as SquarePen } from "./square-pen-rgW01YAz.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { T as TrendingDown } from "./trending-down-BzTR3C0O.js";
import { D as Download } from "./download-BHLO7mQe.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, a as Bar } from "./BarChart-Bzpux5qV.js";
import "./calendar-CAegGMND.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 8v8", key: "napkw2" }],
  ["path", { d: "m8 12 4 4 4-4", key: "k98ssh" }]
];
const CircleArrowDown = createLucideIcon("circle-arrow-down", __iconNode);
const CURRENT_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
const SKELETON_HEAD_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"];
function buildChartData(entries, heads) {
  return SCHOOL_MONTHS.slice(0, 6).map((month, idx) => {
    const monthIdx = idx + 4;
    const dateStr = `${CURRENT_YEAR}-${String(monthIdx).padStart(2, "0")}`;
    const relevant = entries.filter((e) => e.date.startsWith(dateStr));
    const headMap = new Map(heads.map((h) => [h.id, h]));
    const income = relevant.filter((e) => {
      var _a;
      return ((_a = headMap.get(e.headId)) == null ? void 0 : _a.type) === "Income";
    }).reduce((s, e) => s + e.amount, 0);
    const expense = relevant.filter((e) => {
      var _a;
      return ((_a = headMap.get(e.headId)) == null ? void 0 : _a.type) === "Expense";
    }).reduce((s, e) => s + e.amount, 0);
    return { month, income, expense };
  });
}
function HeadDialog({
  open,
  onClose,
  head,
  onSave,
  isSaving
}) {
  const [form, setForm] = reactExports.useState(() => ({
    name: (head == null ? void 0 : head.name) ?? "",
    type: (head == null ? void 0 : head.type) ?? "Expense",
    description: (head == null ? void 0 : head.description) ?? ""
  }));
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "expenses.head_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: (head == null ? void 0 : head.id) ? "Edit Head" : "Add Expense Head" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.name,
            onChange: (e) => set("name", e.target.value),
            placeholder: "e.g. Staff Salary",
            "data-ocid": "expenses.head_name.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: form.type,
            onValueChange: (v) => set("type", v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "mt-1",
                  "data-ocid": "expenses.head_type.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Income", children: "Income" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Expense", children: "Expense" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.description,
            onChange: (e) => set("description", e.target.value),
            placeholder: "Brief description"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1",
            disabled: !form.name.trim() || isSaving,
            onClick: () => onSave(form, head == null ? void 0 : head.id),
            "data-ocid": "expenses.head.save_button",
            children: isSaving ? "Saving…" : "Save"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "expenses.head.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function EntryDialog({
  open,
  onClose,
  heads,
  onSave,
  isSaving
}) {
  var _a;
  const [form, setForm] = reactExports.useState({
    headId: ((_a = heads[0]) == null ? void 0 : _a.id) ?? "",
    amount: "",
    description: "",
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  function handleSave() {
    if (!form.headId || !form.amount || !form.date) return;
    onSave({
      headId: form.headId,
      amount: Number(form.amount),
      description: form.description,
      date: form.date,
      sessionId: "2025-26",
      createdBy: "Admin"
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", "data-ocid": "expenses.entry_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add Ledger Entry" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Head" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.headId, onValueChange: (v) => set("headId", v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "mt-1",
              "data-ocid": "expenses.entry_head.select",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select head" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: heads.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: h.id, children: [
            h.name,
            " (",
            h.type,
            ")"
          ] }, h.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount (₹)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.amount,
            onChange: (e) => set("amount", e.target.value),
            placeholder: "0",
            "data-ocid": "expenses.entry_amount.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.description,
            onChange: (e) => set("description", e.target.value),
            placeholder: "Brief note"
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
            "data-ocid": "expenses.entry_date.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1",
            disabled: !form.headId || !form.amount || !form.date || isSaving,
            onClick: handleSave,
            "data-ocid": "expenses.entry.submit_button",
            children: isSaving ? "Adding…" : "Add Entry"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            "data-ocid": "expenses.entry.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function SkeletonRows() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: SKELETON_HEAD_KEYS.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center justify-between px-4 py-3 border-b border-border/40",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-56" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-7 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-7 rounded" })
        ] })
      ]
    },
    key
  )) });
}
function ExpensesPage() {
  const { currentUser } = useAppStore();
  const createdBy = (currentUser == null ? void 0 : currentUser.fullName) ?? "Admin";
  const { data: heads = [], isLoading: headsLoading } = useExpenseHeadsV2();
  const { data: entries = [], isLoading: entriesLoading } = useExpenseEntriesV2();
  const { data: stats } = useGetExpenseStats();
  const addHead = useAddExpenseHeadV2();
  const updateHead = useUpdateExpenseHeadV2();
  const deleteHead = useDeleteExpenseHeadV2();
  const addEntry = useAddExpenseEntryV2();
  const deleteEntry = useDeleteExpenseEntryV2();
  const isLoading = headsLoading || entriesLoading;
  const [headDialog, setHeadDialog] = reactExports.useState({ open: false, head: null });
  const [entryOpen, setEntryOpen] = reactExports.useState(false);
  const [monthFilter, setMonthFilter] = reactExports.useState("All");
  const [headFilter, setHeadFilter] = reactExports.useState("All");
  async function handleSaveHead(form, id) {
    try {
      if (id) {
        await updateHead.mutateAsync({ id, ...form });
        ue.success("Expense head updated");
      } else {
        await addHead.mutateAsync(form);
        ue.success("Expense head added");
      }
      setHeadDialog({ open: false, head: null });
    } catch (e) {
      ue.error(e instanceof Error ? e.message : "Failed to save head");
    }
  }
  async function handleDeleteHead(id) {
    await deleteHead.mutateAsync(id);
    ue.success("Expense head deleted");
  }
  async function handleAddEntry(e) {
    try {
      await addEntry.mutateAsync({ ...e, createdBy });
      ue.success("Entry added");
      setEntryOpen(false);
    } catch (err) {
      ue.error(err instanceof Error ? err.message : "Failed to add entry");
    }
  }
  async function handleDeleteEntry(id) {
    await deleteEntry.mutateAsync(id);
    ue.success("Entry deleted");
  }
  const headMap = new Map(heads.map((h) => [h.id, h]));
  const monthOptions = [
    ...new Set(
      entries.map((e) => e.date.slice(0, 7)).filter(Boolean).sort().reverse()
    )
  ];
  const filteredEntries = entries.filter((e) => {
    const monthOk = monthFilter === "All" || e.date.startsWith(monthFilter);
    const headOk = headFilter === "All" || e.headId === headFilter;
    return monthOk && headOk;
  });
  const filteredIncome = filteredEntries.filter((e) => {
    var _a;
    return ((_a = headMap.get(e.headId)) == null ? void 0 : _a.type) === "Income";
  }).reduce((s, e) => s + e.amount, 0);
  const filteredExpense = filteredEntries.filter((e) => {
    var _a;
    return ((_a = headMap.get(e.headId)) == null ? void 0 : _a.type) === "Expense";
  }).reduce((s, e) => s + e.amount, 0);
  const filteredBalance = filteredIncome - filteredExpense;
  const chartData = buildChartData(entries, heads);
  const incomeHeads = heads.filter((h) => h.type === "Income");
  const expenseHeads = heads.filter((h) => h.type === "Expense");
  const isSavingHead = addHead.isPending || updateHead.isPending;
  const isSavingEntry = addEntry.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-7xl", "data-ocid": "expenses.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Expenses & Income" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Income/expense ledgers and budget tracking" })
      ] }),
      stats && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto hidden md:flex items-center gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 font-semibold", children: [
          "Total Income: ",
          formatCurrency(stats.totalIncome)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-500 font-semibold", children: [
          "Total Expense: ",
          formatCurrency(stats.totalExpense)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `font-bold ${stats.balance >= 0 ? "text-emerald-600" : "text-red-500"}`,
            children: [
              "Balance: ",
              formatCurrency(stats.balance)
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "heads", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "heads", "data-ocid": "expenses.heads.tab", children: "Expense Heads" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "ledger", "data-ocid": "expenses.ledger.tab", children: "Ledger" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "budget", "data-ocid": "expenses.budget.tab", children: "Budget vs Actual" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "heads", className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setHeadDialog({ open: true, head: null }),
            "data-ocid": "expenses.add_head.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
              "Add Head"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-emerald-50/50 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowUp, { className: "size-4 text-emerald-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Income Heads" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: incomeHeads.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRows, {}) : incomeHeads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "px-4 py-8 text-sm text-muted-foreground text-center",
                "data-ocid": "expenses.income_heads.empty_state",
                children: "No income heads yet. Add one to get started."
              }
            ) : incomeHeads.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-4 py-3 hover:bg-muted/20",
                "data-ocid": `expenses.income_head.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 mr-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: h.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: h.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7",
                        onClick: () => setHeadDialog({ open: true, head: h }),
                        "data-ocid": `expenses.edit_head.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "size-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7 text-destructive",
                        onClick: () => handleDeleteHead(h.id),
                        "data-ocid": `expenses.delete_head.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                      }
                    )
                  ] })
                ]
              },
              h.id
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-red-50/50 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleArrowDown, { className: "size-4 text-red-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Expense Heads" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "ml-auto text-xs", children: expenseHeads.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRows, {}) : expenseHeads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "px-4 py-8 text-sm text-muted-foreground text-center",
                "data-ocid": "expenses.expense_heads.empty_state",
                children: "No expense heads yet. Add one to get started."
              }
            ) : expenseHeads.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-4 py-3 hover:bg-muted/20",
                "data-ocid": `expenses.expense_head.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 mr-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: h.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: h.description })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7",
                        onClick: () => setHeadDialog({ open: true, head: h }),
                        "data-ocid": `expenses.edit_expense_head.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "size-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7 text-destructive",
                        onClick: () => handleDeleteHead(h.id),
                        "data-ocid": `expenses.delete_expense_head.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                      }
                    )
                  ] })
                ]
              },
              h.id
            )) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "ledger", className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: [
          {
            label: "Total Income",
            value: formatCurrency(filteredIncome),
            icon: TrendingUp,
            color: "text-emerald-600"
          },
          {
            label: "Total Expense",
            value: formatCurrency(filteredExpense),
            icon: TrendingDown,
            color: "text-red-500"
          },
          {
            label: "Balance",
            value: formatCurrency(filteredBalance),
            icon: IndianRupee,
            color: filteredBalance >= 0 ? "text-emerald-600" : "text-red-500"
          }
        ].map(({ label, value, icon: Icon, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-metric text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-5 ${color} mx-auto mb-1` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-lg font-bold font-display ${color}`, children: value })
        ] }, label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: monthFilter, onValueChange: setMonthFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-40",
                  "data-ocid": "expenses.month.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Month" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Months" }),
                monthOptions.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: (/* @__PURE__ */ new Date(`${m}-01`)).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric"
                }) }, m))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: headFilter, onValueChange: setHeadFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-44",
                  "data-ocid": "expenses.head_filter.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Head" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Heads" }),
                heads.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: h.id, children: h.name }, h.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: () => downloadCSV(
                  filteredEntries.map((e) => {
                    var _a, _b;
                    return {
                      Date: e.date,
                      Head: ((_a = headMap.get(e.headId)) == null ? void 0 : _a.name) ?? "",
                      Type: ((_b = headMap.get(e.headId)) == null ? void 0 : _b.type) ?? "",
                      Amount: e.amount,
                      Description: e.description,
                      "Created By": e.createdBy
                    };
                  }),
                  "ledger"
                ),
                "data-ocid": "expenses.export.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-2" }),
                  "Export"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => setEntryOpen(true),
                disabled: heads.length === 0,
                "data-ocid": "expenses.add_entry.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
                  "Add Entry"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden bg-card", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: ["s1", "s2", "s3", "s4", "s5"].map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, key)) }) : filteredEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-14 text-muted-foreground",
            "data-ocid": "expenses.ledger.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "size-8 mb-2 opacity-30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No entries found." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-0.5", children: "Add expense heads first, then add ledger entries." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
            "Date",
            "Head",
            "Type",
            "Amount",
            "Description",
            "By",
            ""
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `px-4 py-3 font-semibold text-muted-foreground ${h === "Amount" ? "text-right" : "text-left"}`,
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredEntries.map((e, i) => {
            const head = headMap.get(e.headId);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/50 hover:bg-muted/20 table-row-alt",
                "data-ocid": `expenses.entry.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: formatDate(e.date) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: (head == null ? void 0 : head.name) ?? "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: `text-xs border-0 ${(head == null ? void 0 : head.type) === "Income" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`,
                      children: (head == null ? void 0 : head.type) ?? "—"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold font-mono", children: formatCurrency(e.amount) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: e.description || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: e.createdBy }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "icon",
                      variant: "ghost",
                      className: "size-7 text-destructive",
                      onClick: () => handleDeleteEntry(e.id),
                      "data-ocid": `expenses.delete_entry.${i + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                    }
                  ) })
                ]
              },
              e.id
            );
          }) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "budget", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground mb-4", children: "Income vs Expense — Monthly Comparison" }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-80 w-full rounded-lg" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 320, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: chartData,
            margin: { top: 5, right: 20, left: 10, bottom: 5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "month",
                  tick: { fontSize: 12 },
                  stroke: "var(--muted-foreground)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  tickFormatter: (v) => `₹${(v / 1e3).toFixed(0)}k`,
                  tick: { fontSize: 12 },
                  stroke: "var(--muted-foreground)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  formatter: (v) => [formatCurrency(v)],
                  contentStyle: {
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "income",
                  name: "Income",
                  fill: "oklch(0.65 0.18 145)",
                  radius: [4, 4, 0, 0]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "expense",
                  name: "Expense",
                  fill: "oklch(0.62 0.19 22)",
                  radius: [4, 4, 0, 0]
                }
              )
            ]
          }
        ) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      HeadDialog,
      {
        open: headDialog.open,
        head: headDialog.head,
        onClose: () => setHeadDialog({ open: false, head: null }),
        onSave: handleSaveHead,
        isSaving: isSavingHead
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EntryDialog,
      {
        open: entryOpen,
        onClose: () => setEntryOpen(false),
        heads,
        onSave: handleAddEntry,
        isSaving: isSavingEntry
      }
    )
  ] });
}
export {
  ExpensesPage as default
};
