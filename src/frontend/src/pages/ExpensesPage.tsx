import DateInput from "@/components/shared/DateInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  useAddExpenseEntryV2,
  useAddExpenseHeadV2,
  useDeleteExpenseEntryV2,
  useDeleteExpenseHeadV2,
  useExpenseEntriesV2,
  useExpenseHeadsV2,
  useGetExpenseStats,
  useUpdateExpenseHeadV2,
} from "@/hooks/useBackend";
import {
  SCHOOL_MONTHS,
  downloadCSV,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { ExpenseEntry, ExpenseHead } from "@/types";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  Edit,
  IndianRupee,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const CURRENT_YEAR = new Date().getFullYear();

const SKELETON_HEAD_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4"] as const;

function buildChartData(entries: ExpenseEntry[], heads: ExpenseHead[]) {
  return SCHOOL_MONTHS.slice(0, 6).map((month, idx) => {
    const monthIdx = idx + 4;
    const dateStr = `${CURRENT_YEAR}-${String(monthIdx).padStart(2, "0")}`;
    const relevant = entries.filter((e) => e.date.startsWith(dateStr));
    const headMap = new Map(heads.map((h) => [h.id, h]));
    const income = relevant
      .filter((e) => headMap.get(e.headId)?.type === "Income")
      .reduce((s, e) => s + e.amount, 0);
    const expense = relevant
      .filter((e) => headMap.get(e.headId)?.type === "Expense")
      .reduce((s, e) => s + e.amount, 0);
    return { month, income, expense };
  });
}

// ─── Head Dialog ──────────────────────────────────────────────────────────────
function HeadDialog({
  open,
  onClose,
  head,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  head: Partial<ExpenseHead> | null;
  onSave: (h: Omit<ExpenseHead, "id">, id?: string) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Omit<ExpenseHead, "id">>(() => ({
    name: head?.name ?? "",
    type: head?.type ?? "Expense",
    description: head?.description ?? "",
  }));
  const set = (k: keyof Omit<ExpenseHead, "id">, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" data-ocid="expenses.head_dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {head?.id ? "Edit Head" : "Add Expense Head"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Name</Label>
            <Input
              className="mt-1"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Staff Salary"
              data-ocid="expenses.head_name.input"
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => set("type", v as "Income" | "Expense")}
            >
              <SelectTrigger
                className="mt-1"
                data-ocid="expenses.head_type.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Input
              className="mt-1"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief description"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              disabled={!form.name.trim() || isSaving}
              onClick={() => onSave(form, head?.id)}
              data-ocid="expenses.head.save_button"
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="expenses.head.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Entry Dialog ─────────────────────────────────────────────────────────────
function EntryDialog({
  open,
  onClose,
  heads,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  heads: ExpenseHead[];
  onSave: (e: Omit<ExpenseEntry, "id"> & { headId: string }) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState({
    headId: heads[0]?.id ?? "",
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function handleSave() {
    if (!form.headId || !form.amount || !form.date) return;
    onSave({
      headId: form.headId,
      amount: Number(form.amount),
      description: form.description,
      date: form.date,
      sessionId: "2025-26",
      createdBy: "Admin",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" data-ocid="expenses.entry_dialog">
        <DialogHeader>
          <DialogTitle className="font-display">Add Ledger Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Head</Label>
            <Select value={form.headId} onValueChange={(v) => set("headId", v)}>
              <SelectTrigger
                className="mt-1"
                data-ocid="expenses.entry_head.select"
              >
                <SelectValue placeholder="Select head" />
              </SelectTrigger>
              <SelectContent>
                {heads.map((h) => (
                  <SelectItem key={h.id} value={h.id}>
                    {h.name} ({h.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Amount (₹)</Label>
            <Input
              className="mt-1"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              placeholder="0"
              data-ocid="expenses.entry_amount.input"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              className="mt-1"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Brief note"
            />
          </div>
          <div>
            <Label>Date</Label>
            <DateInput
              value={form.date}
              onChange={(iso) => set("date", iso)}
              className="mt-1"
              data-ocid="expenses.entry_date.input"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              disabled={!form.headId || !form.amount || !form.date || isSaving}
              onClick={handleSave}
              data-ocid="expenses.entry.submit_button"
            >
              {isSaving ? "Adding…" : "Add Entry"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="expenses.entry.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRows() {
  return (
    <>
      {SKELETON_HEAD_KEYS.map((key) => (
        <div
          key={key}
          className="flex items-center justify-between px-4 py-3 border-b border-border/40"
        >
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="size-7 rounded" />
            <Skeleton className="size-7 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ExpensesPage() {
  const { currentUser } = useAppStore();
  const createdBy = currentUser?.fullName ?? "Admin";

  const { data: heads = [], isLoading: headsLoading } = useExpenseHeadsV2();
  const { data: entries = [], isLoading: entriesLoading } =
    useExpenseEntriesV2();
  const { data: stats } = useGetExpenseStats();

  const addHead = useAddExpenseHeadV2();
  const updateHead = useUpdateExpenseHeadV2();
  const deleteHead = useDeleteExpenseHeadV2();
  const addEntry = useAddExpenseEntryV2();
  const deleteEntry = useDeleteExpenseEntryV2();

  const isLoading = headsLoading || entriesLoading;

  const [headDialog, setHeadDialog] = useState<{
    open: boolean;
    head: Partial<ExpenseHead> | null;
  }>({ open: false, head: null });
  const [entryOpen, setEntryOpen] = useState(false);
  const [monthFilter, setMonthFilter] = useState("All");
  const [headFilter, setHeadFilter] = useState("All");

  async function handleSaveHead(form: Omit<ExpenseHead, "id">, id?: string) {
    try {
      if (id) {
        await updateHead.mutateAsync({ id, ...form });
        toast.success("Expense head updated");
      } else {
        await addHead.mutateAsync(form);
        toast.success("Expense head added");
      }
      setHeadDialog({ open: false, head: null });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save head");
    }
  }

  async function handleDeleteHead(id: string) {
    await deleteHead.mutateAsync(id);
    toast.success("Expense head deleted");
  }

  async function handleAddEntry(
    e: Omit<ExpenseEntry, "id"> & { headId: string },
  ) {
    try {
      await addEntry.mutateAsync({ ...e, createdBy });
      toast.success("Entry added");
      setEntryOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add entry");
    }
  }

  async function handleDeleteEntry(id: string) {
    await deleteEntry.mutateAsync(id);
    toast.success("Entry deleted");
  }

  const headMap = new Map(heads.map((h) => [h.id, h]));

  // Build month options from entries
  const monthOptions = [
    ...new Set(
      entries
        .map((e) => e.date.slice(0, 7))
        .filter(Boolean)
        .sort()
        .reverse(),
    ),
  ];

  const filteredEntries = entries.filter((e) => {
    const monthOk = monthFilter === "All" || e.date.startsWith(monthFilter);
    const headOk = headFilter === "All" || e.headId === headFilter;
    return monthOk && headOk;
  });

  const filteredIncome = filteredEntries
    .filter((e) => headMap.get(e.headId)?.type === "Income")
    .reduce((s, e) => s + e.amount, 0);
  const filteredExpense = filteredEntries
    .filter((e) => headMap.get(e.headId)?.type === "Expense")
    .reduce((s, e) => s + e.amount, 0);
  const filteredBalance = filteredIncome - filteredExpense;

  const chartData = buildChartData(entries, heads);
  const incomeHeads = heads.filter((h) => h.type === "Income");
  const expenseHeads = heads.filter((h) => h.type === "Expense");

  const isSavingHead = addHead.isPending || updateHead.isPending;
  const isSavingEntry = addEntry.isPending;

  return (
    <div className="p-6 space-y-5 max-w-7xl" data-ocid="expenses.page">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Wallet className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Expenses &amp; Income
          </h1>
          <p className="text-sm text-muted-foreground">
            Income/expense ledgers and budget tracking
          </p>
        </div>
        {stats && (
          <div className="ml-auto hidden md:flex items-center gap-4 text-sm">
            <span className="text-emerald-600 font-semibold">
              Total Income: {formatCurrency(stats.totalIncome)}
            </span>
            <span className="text-red-500 font-semibold">
              Total Expense: {formatCurrency(stats.totalExpense)}
            </span>
            <span
              className={`font-bold ${
                stats.balance >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              Balance: {formatCurrency(stats.balance)}
            </span>
          </div>
        )}
      </div>

      <Tabs defaultValue="heads">
        <TabsList>
          <TabsTrigger value="heads" data-ocid="expenses.heads.tab">
            Expense Heads
          </TabsTrigger>
          <TabsTrigger value="ledger" data-ocid="expenses.ledger.tab">
            Ledger
          </TabsTrigger>
          <TabsTrigger value="budget" data-ocid="expenses.budget.tab">
            Budget vs Actual
          </TabsTrigger>
        </TabsList>

        {/* Heads Tab */}
        <TabsContent value="heads" className="mt-4">
          <div className="flex justify-end mb-3">
            <Button
              onClick={() => setHeadDialog({ open: true, head: null })}
              data-ocid="expenses.add_head.button"
            >
              <Plus className="size-4 mr-2" />
              Add Head
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Income Heads */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-emerald-50/50 flex items-center gap-2">
                <ArrowUpCircle className="size-4 text-emerald-600" />
                <h3 className="font-display font-semibold text-foreground">
                  Income Heads
                </h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {incomeHeads.length}
                </Badge>
              </div>
              <div className="divide-y divide-border">
                {isLoading ? (
                  <SkeletonRows />
                ) : incomeHeads.length === 0 ? (
                  <p
                    className="px-4 py-8 text-sm text-muted-foreground text-center"
                    data-ocid="expenses.income_heads.empty_state"
                  >
                    No income heads yet. Add one to get started.
                  </p>
                ) : (
                  incomeHeads.map((h, i) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/20"
                      data-ocid={`expenses.income_head.item.${i + 1}`}
                    >
                      <div className="min-w-0 mr-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {h.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {h.description}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() => setHeadDialog({ open: true, head: h })}
                          data-ocid={`expenses.edit_head.${i + 1}`}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive"
                          onClick={() => handleDeleteHead(h.id)}
                          data-ocid={`expenses.delete_head.${i + 1}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Expense Heads */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-red-50/50 flex items-center gap-2">
                <ArrowDownCircle className="size-4 text-red-600" />
                <h3 className="font-display font-semibold text-foreground">
                  Expense Heads
                </h3>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {expenseHeads.length}
                </Badge>
              </div>
              <div className="divide-y divide-border">
                {isLoading ? (
                  <SkeletonRows />
                ) : expenseHeads.length === 0 ? (
                  <p
                    className="px-4 py-8 text-sm text-muted-foreground text-center"
                    data-ocid="expenses.expense_heads.empty_state"
                  >
                    No expense heads yet. Add one to get started.
                  </p>
                ) : (
                  expenseHeads.map((h, i) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/20"
                      data-ocid={`expenses.expense_head.item.${i + 1}`}
                    >
                      <div className="min-w-0 mr-2">
                        <p className="text-sm font-medium text-foreground truncate">
                          {h.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {h.description}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() => setHeadDialog({ open: true, head: h })}
                          data-ocid={`expenses.edit_expense_head.${i + 1}`}
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive"
                          onClick={() => handleDeleteHead(h.id)}
                          data-ocid={`expenses.delete_expense_head.${i + 1}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Ledger Tab */}
        <TabsContent value="ledger" className="mt-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Total Income",
                value: formatCurrency(filteredIncome),
                icon: TrendingUp,
                color: "text-emerald-600",
              },
              {
                label: "Total Expense",
                value: formatCurrency(filteredExpense),
                icon: TrendingDown,
                color: "text-red-500",
              },
              {
                label: "Balance",
                value: formatCurrency(filteredBalance),
                icon: IndianRupee,
                color:
                  filteredBalance >= 0 ? "text-emerald-600" : "text-red-500",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="card-metric text-center">
                <Icon className={`size-5 ${color} mx-auto mb-1`} />
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-lg font-bold font-display ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Filters + Actions */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2">
              <Select value={monthFilter} onValueChange={setMonthFilter}>
                <SelectTrigger
                  className="w-40"
                  data-ocid="expenses.month.select"
                >
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Months</SelectItem>
                  {monthOptions.map((m) => (
                    <SelectItem key={m} value={m}>
                      {new Date(`${m}-01`).toLocaleDateString("en-IN", {
                        month: "long",
                        year: "numeric",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={headFilter} onValueChange={setHeadFilter}>
                <SelectTrigger
                  className="w-44"
                  data-ocid="expenses.head_filter.select"
                >
                  <SelectValue placeholder="Head" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Heads</SelectItem>
                  {heads.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  downloadCSV(
                    filteredEntries.map((e) => ({
                      Date: e.date,
                      Head: headMap.get(e.headId)?.name ?? "",
                      Type: headMap.get(e.headId)?.type ?? "",
                      Amount: e.amount,
                      Description: e.description,
                      "Created By": e.createdBy,
                    })),
                    "ledger",
                  )
                }
                data-ocid="expenses.export.button"
              >
                <Download className="size-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => setEntryOpen(true)}
                disabled={heads.length === 0}
                data-ocid="expenses.add_entry.button"
              >
                <Plus className="size-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {["s1", "s2", "s3", "s4", "s5"].map((key) => (
                  <Skeleton key={key} className="h-10 w-full" />
                ))}
              </div>
            ) : filteredEntries.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-14 text-muted-foreground"
                data-ocid="expenses.ledger.empty_state"
              >
                <IndianRupee className="size-8 mb-2 opacity-30" />
                <p className="text-sm font-medium">No entries found.</p>
                <p className="text-xs mt-0.5">
                  Add expense heads first, then add ledger entries.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {[
                        "Date",
                        "Head",
                        "Type",
                        "Amount",
                        "Description",
                        "By",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 font-semibold text-muted-foreground ${
                            h === "Amount" ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((e, i) => {
                      const head = headMap.get(e.headId);
                      return (
                        <tr
                          key={e.id}
                          className="border-b border-border/50 hover:bg-muted/20 table-row-alt"
                          data-ocid={`expenses.entry.item.${i + 1}`}
                        >
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {formatDate(e.date)}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground">
                            {head?.name ?? "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="secondary"
                              className={`text-xs border-0 ${
                                head?.type === "Income"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {head?.type ?? "—"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold font-mono">
                            {formatCurrency(e.amount)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {e.description || "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {e.createdBy}
                          </td>
                          <td className="px-4 py-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7 text-destructive"
                              onClick={() => handleDeleteEntry(e.id)}
                              data-ocid={`expenses.delete_entry.${i + 1}`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Budget vs Actual Tab */}
        <TabsContent value="budget" className="mt-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-display font-semibold text-foreground mb-4">
              Income vs Expense — Monthly Comparison
            </h3>
            {isLoading ? (
              <Skeleton className="h-80 w-full rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 12 }}
                    stroke="var(--muted-foreground)"
                  />
                  <Tooltip
                    formatter={(v: number) => [formatCurrency(v)]}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="oklch(0.65 0.18 145)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="oklch(0.62 0.19 22)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <HeadDialog
        open={headDialog.open}
        head={headDialog.head}
        onClose={() => setHeadDialog({ open: false, head: null })}
        onSave={handleSaveHead}
        isSaving={isSavingHead}
      />
      <EntryDialog
        open={entryOpen}
        onClose={() => setEntryOpen(false)}
        heads={heads}
        onSave={handleAddEntry}
        isSaving={isSavingEntry}
      />
    </div>
  );
}
