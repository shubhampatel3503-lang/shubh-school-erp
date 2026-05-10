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
  type FrontendInventoryItem,
  type FrontendInventoryTransaction,
  useAddInventoryItem,
  useAddInventoryTransaction,
  useDeleteInventoryItem,
  useInventoryItems,
  useInventoryTransactions,
  useUpdateInventoryItem,
} from "@/hooks/useBackend";
import { downloadCSV, formatCurrency, formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import {
  AlertTriangle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Download,
  Edit,
  Package,
  Plus,
  Printer,
  ShoppingCart,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────
interface DailySalesSummary {
  date: string;
  totalSales: number;
  totalAmount: number;
  itemsSold: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Uniform",
  "Books & Stationery",
  "Sports",
  "Lab Equipment",
  "Furniture",
  "Cleaning",
  "Electronics",
];
const STORES = ["Main Store", "Sports Room", "Science Lab", "Library Store"];

// ─── Item Dialog ──────────────────────────────────────────────────────────────
function ItemDialog({
  open,
  onClose,
  item,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  item: Partial<FrontendInventoryItem> | null;
  onSave: (i: Partial<FrontendInventoryItem> & { name: string }) => void;
  isSaving: boolean;
}) {
  const isEdit = !!item?.id;
  const [form, setForm] = useState({
    name: item?.name ?? "",
    category: item?.category ?? CATEGORIES[0],
    store: item?.store ?? STORES[0],
    unit: item?.unit ?? "Pcs",
    currentStock: item?.currentStock ?? 0,
    minStock: item?.minStock ?? 10,
    purchasePrice: item?.purchasePrice ?? 0,
    salePrice: item?.salePrice ?? 0,
  });
  const set = (k: string, v: string | number) =>
    setForm((p) => ({ ...p, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="inventory.item_dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEdit ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Item Name</Label>
            <Input
              className="mt-1"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. School Uniform Shirt"
              data-ocid="inventory.name.input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Store</Label>
              <Select value={form.store} onValueChange={(v) => set("store", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STORES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Unit</Label>
              <Input
                className="mt-1"
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
              />
            </div>
            <div>
              <Label>Current Stock</Label>
              <Input
                className="mt-1"
                type="number"
                value={form.currentStock || ""}
                onChange={(e) => set("currentStock", Number(e.target.value))}
                placeholder="0"
                data-ocid="inventory.stock.input"
              />
            </div>
            <div>
              <Label>Min Stock</Label>
              <Input
                className="mt-1"
                type="number"
                value={form.minStock || ""}
                onChange={(e) => set("minStock", Number(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Purchase Price (₹)</Label>
              <Input
                className="mt-1"
                type="number"
                value={form.purchasePrice || ""}
                onChange={(e) => set("purchasePrice", Number(e.target.value))}
                placeholder="0"
                data-ocid="inventory.purchase_price.input"
              />
            </div>
            <div>
              <Label>Sale Price (₹)</Label>
              <Input
                className="mt-1"
                type="number"
                value={form.salePrice || ""}
                onChange={(e) => set("salePrice", Number(e.target.value))}
                placeholder="0"
                data-ocid="inventory.sale_price.input"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() =>
                onSave(
                  isEdit
                    ? { ...item, ...form, id: item?.id ?? "" }
                    : { ...form },
                )
              }
              disabled={!form.name.trim() || isSaving}
              data-ocid="inventory.item.save_button"
            >
              {isSaving ? "Saving…" : "Save Item"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="inventory.item.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Transaction Dialog ───────────────────────────────────────────────────────
function TransactionDialog({
  open,
  onClose,
  items,
  onSave,
  isSaving,
  createdBy,
}: {
  open: boolean;
  onClose: () => void;
  items: FrontendInventoryItem[];
  onSave: (t: {
    itemId: string;
    type: "Purchase" | "Sale" | "Adjustment";
    quantity: number;
    unitPrice: number;
    date: string;
    remarks: string;
    createdBy: string;
    buyerAdmNo?: string;
    buyerName?: string;
    sellerName?: string;
    receivedAmount?: number;
    balanceAmount?: number;
  }) => void;
  isSaving: boolean;
  createdBy: string;
}) {
  const [form, setForm] = useState({
    itemId: items[0]?.id ?? "",
    type: "Sale" as "Purchase" | "Sale" | "Adjustment",
    qty: "",
    price: "",
    date: new Date().toISOString().slice(0, 10),
    remarks: "",
    buyerAdmNo: "",
    buyerName: "",
    sellerName: "",
    received: "",
  });
  const setF = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const qty = Number(form.qty) || 0;
  const price = Number(form.price) || 0;
  const total = qty * price;
  const received = form.received !== "" ? Number(form.received) : null;
  const balance = received != null ? Math.max(0, total - received) : null;

  function handleSave() {
    if (!form.itemId || !form.qty || !form.price) return;
    onSave({
      itemId: form.itemId,
      type: form.type,
      quantity: qty,
      unitPrice: price,
      date: form.date,
      remarks: form.remarks,
      createdBy,
      buyerAdmNo: form.buyerAdmNo || undefined,
      buyerName: form.buyerName || undefined,
      sellerName: form.sellerName || undefined,
      receivedAmount: received ?? undefined,
      balanceAmount: balance ?? undefined,
    });
  }

  const isSale = form.type === "Sale";
  const isPurchase = form.type === "Purchase";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md overflow-y-auto max-h-[90vh]"
        data-ocid="inventory.txn_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">Add Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Item</Label>
            <Select
              value={form.itemId}
              onValueChange={(v) => setF("itemId", v)}
            >
              <SelectTrigger
                className="mt-1"
                data-ocid="inventory.txn_item.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {items.map((i) => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) =>
                setF("type", v as "Purchase" | "Sale" | "Adjustment")
              }
            >
              <SelectTrigger
                className="mt-1"
                data-ocid="inventory.txn_type.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="Purchase">Purchase</SelectItem>
                <SelectItem value="Adjustment">Adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Quantity</Label>
              <Input
                className="mt-1"
                type="number"
                value={form.qty}
                onChange={(e) => setF("qty", e.target.value)}
                placeholder="0"
                data-ocid="inventory.txn_qty.input"
              />
            </div>
            <div>
              <Label>Unit Price (₹)</Label>
              <Input
                className="mt-1"
                type="number"
                value={form.price}
                onChange={(e) => setF("price", e.target.value)}
                placeholder="0"
                data-ocid="inventory.txn_price.input"
              />
            </div>
          </div>

          {/* Total (read-only) */}
          {total > 0 && (
            <div className="px-3 py-2 rounded-lg bg-muted/40 text-sm flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(total)}
              </span>
            </div>
          )}

          {/* Sale-specific fields */}
          {isSale && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Buyer Adm. No. (optional)</Label>
                  <Input
                    className="mt-1"
                    value={form.buyerAdmNo}
                    onChange={(e) => setF("buyerAdmNo", e.target.value)}
                    placeholder="e.g. ADM001"
                    data-ocid="inventory.txn_buyer_adm.input"
                  />
                </div>
                <div>
                  <Label>Buyer Name</Label>
                  <Input
                    className="mt-1"
                    value={form.buyerName}
                    onChange={(e) => setF("buyerName", e.target.value)}
                    placeholder="Student / Staff name"
                    data-ocid="inventory.txn_buyer_name.input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Received Amount (₹)</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    value={form.received}
                    onChange={(e) => setF("received", e.target.value)}
                    placeholder="0"
                    data-ocid="inventory.txn_received.input"
                  />
                </div>
                <div>
                  <Label>Balance Amount (₹)</Label>
                  <Input
                    className="mt-1"
                    readOnly
                    value={
                      balance != null && balance > 0 ? balance.toString() : ""
                    }
                    placeholder="Auto-calculated"
                    data-ocid="inventory.txn_balance.input"
                  />
                </div>
              </div>
            </>
          )}

          {/* Purchase-specific fields */}
          {isPurchase && (
            <>
              <div>
                <Label>Supplier / Seller Name</Label>
                <Input
                  className="mt-1"
                  value={form.sellerName}
                  onChange={(e) => setF("sellerName", e.target.value)}
                  placeholder="Supplier name"
                  data-ocid="inventory.txn_seller.input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Amount Paid to Supplier (₹)</Label>
                  <Input
                    className="mt-1"
                    type="number"
                    value={form.received}
                    onChange={(e) => setF("received", e.target.value)}
                    placeholder="0"
                    data-ocid="inventory.txn_received.input"
                  />
                </div>
                <div>
                  <Label>Balance Payable (₹)</Label>
                  <Input
                    className="mt-1"
                    readOnly
                    value={
                      balance != null && balance > 0 ? balance.toString() : ""
                    }
                    placeholder="Auto-calculated"
                    data-ocid="inventory.txn_balance.input"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              className="mt-1"
              value={form.date}
              onChange={(e) => setF("date", e.target.value)}
            />
          </div>
          <div>
            <Label>Remarks</Label>
            <Input
              className="mt-1"
              value={form.remarks}
              onChange={(e) => setF("remarks", e.target.value)}
              placeholder="Optional note"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={!form.itemId || !form.qty || !form.price || isSaving}
              data-ocid="inventory.txn.submit_button"
            >
              {isSaving ? "Saving…" : "Add Transaction"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="inventory.txn.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Daily Sales Tab ─────────────────────────────────────────────────────────
function DailySalesTab({
  txns,
  txnsLoading,
}: {
  txns: (FrontendInventoryTransaction & { itemName: string })[];
  txnsLoading: boolean;
}) {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  // Derive daily summaries client-side from full transaction list
  const summaries = useMemo((): DailySalesSummary[] => {
    const byDate: Record<
      string,
      (FrontendInventoryTransaction & { itemName: string })[]
    > = {};
    for (const t of txns) {
      if (t.type === "Sale") {
        if (!byDate[t.date]) byDate[t.date] = [];
        byDate[t.date].push(t);
      }
    }
    return Object.keys(byDate)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({
        date,
        totalSales: byDate[date].length,
        totalAmount: byDate[date].reduce((s, t) => s + t.totalAmount, 0),
        itemsSold: byDate[date].reduce((s, t) => s + t.quantity, 0),
      }));
  }, [txns]);

  // Today's summary
  const todayTxns = useMemo(
    () => txns.filter((t) => t.date === today && t.type === "Sale"),
    [txns, today],
  );
  const todayTotal = todayTxns.reduce((s, t) => s + t.totalAmount, 0);

  // Apply date filter
  const filteredSummaries = useMemo(() => {
    if (!dateFilter) return summaries;
    return summaries.filter((s) => s.date === dateFilter);
  }, [summaries, dateFilter]);

  // Get txns for an expanded date from full list
  const txnsForDate = (date: string) =>
    txns.filter((t) => t.date === date && t.type === "Sale");

  return (
    <div className="space-y-4" data-ocid="inventory.daily_sales.section">
      {/* Today's Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-metric col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="size-4 text-emerald-600" />
            <span className="text-xs text-muted-foreground">Today's Sales</span>
          </div>
          <p className="text-2xl font-bold font-display text-foreground">
            {todayTxns.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            transactions today
          </p>
        </div>
        <div className="card-metric col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="size-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Today's Revenue
            </span>
          </div>
          <p className="text-2xl font-bold font-display text-foreground">
            {formatCurrency(todayTotal)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            amount collected today
          </p>
        </div>
        <div className="card-metric col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <Package className="size-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">
              Items Sold Today
            </span>
          </div>
          <p className="text-2xl font-bold font-display text-foreground">
            {todayTxns.reduce((s, t) => s + t.quantity, 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            units across all items
          </p>
        </div>
      </div>

      {/* Date filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Jump to date:</span>
        </div>
        <Input
          type="date"
          className="w-44 h-8 text-sm"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          data-ocid="inventory.daily_sales.date_filter"
        />
        {dateFilter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setDateFilter("")}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Daily Summary Table */}
      {txnsLoading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((n) => (
            <Skeleton key={`skel-daily-${n}`} className="h-12 w-full" />
          ))}
        </div>
      ) : filteredSummaries.length === 0 ? (
        <div
          className="rounded-xl border border-border bg-card px-4 py-12 text-center"
          data-ocid="inventory.daily_sales.empty_state"
        >
          <ShoppingCart className="size-8 mx-auto mb-2 opacity-30" />
          <p className="text-muted-foreground">
            {dateFilter
              ? `No sales found for ${dateFilter}`
              : "No sales recorded yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-8" />
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  Items Sold
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  Transactions
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSummaries.map((summary, i) => {
                const isExpanded = expandedDate === summary.date;
                const dayTxns = txnsForDate(summary.date);
                const isToday = summary.date === today;
                return (
                  <>
                    <tr
                      key={summary.date}
                      className="border-b border-border/50 hover:bg-muted/20 cursor-pointer table-row-alt"
                      onClick={() =>
                        setExpandedDate(isExpanded ? null : summary.date)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setExpandedDate(isExpanded ? null : summary.date);
                        }
                      }}
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      data-ocid={`inventory.daily_sales.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        {isExpanded ? (
                          <ChevronDown className="size-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="size-4 text-muted-foreground" />
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          {formatDate(summary.date)}
                          {isToday && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-emerald-100 text-emerald-700 border-0"
                            >
                              Today
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {summary.itemsSold}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {summary.totalSales}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {formatCurrency(summary.totalAmount)}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr
                        key={`${summary.date}-expand`}
                        className="bg-muted/10"
                      >
                        <td colSpan={5} className="px-4 py-0">
                          <div className="py-3 pl-4 border-l-2 border-primary/30 ml-2">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="text-muted-foreground">
                                  <th className="pb-2 text-left font-semibold">
                                    Item Name
                                  </th>
                                  <th className="pb-2 text-right font-semibold">
                                    Qty
                                  </th>
                                  <th className="pb-2 text-left font-semibold">
                                    Buyer
                                  </th>
                                  <th className="pb-2 text-left font-semibold">
                                    Seller
                                  </th>
                                  <th className="pb-2 text-right font-semibold">
                                    Received
                                  </th>
                                  <th className="pb-2 text-right font-semibold">
                                    Balance
                                  </th>
                                  <th className="pb-2 text-right font-semibold">
                                    Total
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {dayTxns.map((t, j) => (
                                  <tr
                                    key={t.id}
                                    className="border-t border-border/30"
                                    data-ocid={`inventory.daily_sales.txn.${j + 1}`}
                                  >
                                    <td className="py-2 font-medium text-foreground">
                                      {t.itemName}
                                    </td>
                                    <td className="py-2 text-right font-mono">
                                      {t.quantity}
                                    </td>
                                    <td className="py-2">
                                      {t.buyerName ? (
                                        <div className="flex flex-col">
                                          <span className="text-foreground">
                                            {t.buyerName}
                                          </span>
                                          {t.buyerAdmNo && (
                                            <span className="text-muted-foreground">
                                              Adm: {t.buyerAdmNo}
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-muted-foreground">
                                          —
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-2 text-muted-foreground">
                                      {t.sellerName || "—"}
                                    </td>
                                    <td className="py-2 text-right text-muted-foreground">
                                      {t.receivedAmount
                                        ? formatCurrency(t.receivedAmount)
                                        : "—"}
                                    </td>
                                    <td className="py-2 text-right">
                                      {t.balanceAmount ? (
                                        <span className="font-semibold text-destructive">
                                          {formatCurrency(t.balanceAmount)}
                                        </span>
                                      ) : (
                                        "—"
                                      )}
                                    </td>
                                    <td className="py-2 text-right font-semibold text-foreground">
                                      {formatCurrency(t.totalAmount)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InventoryPage() {
  const { currentRole, currentUser } = useAppStore();
  const isAdmin =
    currentRole === "Admin" ||
    currentRole === "SuperAdmin" ||
    currentRole === "Accountant";
  const createdBy = currentUser?.fullName ?? currentRole ?? "Admin";

  // ── Backend data ──────────────────────────────────────────────────────────
  const { data: items = [], isLoading: itemsLoading } = useInventoryItems();
  const { data: txnsRaw = [], isLoading: txnsLoading } =
    useInventoryTransactions();
  const addItem = useAddInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();
  const addTxn = useAddInventoryTransaction();

  // Resolve itemName in transactions by joining with items list
  const txns = txnsRaw.map((t) => ({
    ...t,
    itemName: items.find((i) => i.id === t.itemId)?.name ?? t.itemId,
  }));

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [itemDialog, setItemDialog] = useState<{
    open: boolean;
    item: Partial<FrontendInventoryItem> | null;
  }>({ open: false, item: null });
  const [txnOpen, setTxnOpen] = useState(false);

  // ── Filters ───────────────────────────────────────────────────────────────
  const [catFilter, setCatFilter] = useState("All");
  const [storeFilter, setStoreFilter] = useState("All");

  // ── Metrics ───────────────────────────────────────────────────────────────
  const totalValue = items.reduce(
    (s, i) => s + i.currentStock * i.unitPrice,
    0,
  );
  const lowStock = items.filter((i) => i.currentStock <= i.minStock);
  const filteredItems = items.filter(
    (i) =>
      (catFilter === "All" || i.category === catFilter) &&
      (storeFilter === "All" || i.store === storeFilter),
  );

  // ── Handlers ─────────────────────────────────────────────────────────────
  async function handleSaveItem(
    data: Partial<FrontendInventoryItem> & { name: string },
  ) {
    const payload = {
      name: data.name,
      category: data.category ?? CATEGORIES[0],
      store: data.store ?? STORES[0],
      unit: data.unit ?? "Pcs",
      currentStock: data.currentStock ?? 0,
      minStock: data.minStock ?? 10,
      purchasePrice: data.purchasePrice ?? 0,
      salePrice: data.salePrice ?? 0,
      unitPrice: data.salePrice ?? 0,
    };
    try {
      if (data.id) {
        await updateItem.mutateAsync({ ...payload, id: data.id });
        toast.success("Item updated successfully");
      } else {
        await addItem.mutateAsync(payload);
        toast.success("Item added successfully");
      }
      setItemDialog({ open: false, item: null });
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to save item");
    }
  }

  async function handleDeleteItem(id: string) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Item deleted");
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to delete item");
    }
  }

  async function handleAddTxn(t: Parameters<typeof addTxn.mutateAsync>[0]) {
    try {
      await addTxn.mutateAsync(t);
      toast.success("Transaction recorded");
      setTxnOpen(false);
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to record transaction");
    }
  }

  return (
    <div className="p-6 space-y-5 max-w-7xl" data-ocid="inventory.page">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Inventory
          </h1>
          <p className="text-sm text-muted-foreground">
            Items, stock, purchases, sales, and pricing
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Items",
            value: itemsLoading ? "…" : items.length,
            icon: Package,
            color: "text-primary",
          },
          {
            label: "Total Stock Value",
            value: itemsLoading ? "…" : formatCurrency(totalValue),
            icon: ShoppingCart,
            color: "text-emerald-600",
          },
          {
            label: "Low Stock Alerts",
            value: itemsLoading ? "…" : lowStock.length,
            icon: AlertTriangle,
            color: "text-amber-600",
          },
          {
            label: "Transactions",
            value: txnsLoading ? "…" : txns.length,
            icon: TrendingUp,
            color: "text-blue-600",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-metric">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`size-4 ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <p className="text-xl font-bold font-display text-foreground">
              {value}
            </p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items" data-ocid="inventory.items.tab">
            Items
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            data-ocid="inventory.transactions.tab"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="daily-sales"
            data-ocid="inventory.daily_sales.tab"
          >
            Daily Sales
          </TabsTrigger>
          <TabsTrigger value="reports" data-ocid="inventory.reports.tab">
            Reports
          </TabsTrigger>
        </TabsList>

        {/* Items Tab */}
        <TabsContent value="items" className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2">
              <Select value={catFilter} onValueChange={setCatFilter}>
                <SelectTrigger
                  className="w-44"
                  data-ocid="inventory.category.select"
                >
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={storeFilter} onValueChange={setStoreFilter}>
                <SelectTrigger
                  className="w-40"
                  data-ocid="inventory.store.select"
                >
                  <SelectValue placeholder="Store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Stores</SelectItem>
                  {STORES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => setItemDialog({ open: true, item: null })}
              data-ocid="inventory.add_item.button"
            >
              <Plus className="size-4 mr-2" />
              Add Item
            </Button>
          </div>

          {itemsLoading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <Skeleton key={`skel-item-${n}`} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {[
                        "Item",
                        "Category",
                        "Store",
                        "Unit",
                        "Stock",
                        "Min Stock",
                        "Purchase ₹",
                        "Sale ₹",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 font-semibold text-muted-foreground ${
                            [
                              "Stock",
                              "Purchase ₹",
                              "Sale ₹",
                              "Min Stock",
                            ].includes(h)
                              ? "text-right"
                              : "text-left"
                          } ${h === "Actions" ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-10 text-center text-muted-foreground"
                          data-ocid="inventory.items.empty_state"
                        >
                          <Package className="size-8 mx-auto mb-2 opacity-30" />
                          No items found. Add your first item.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item, i) => {
                        const isLow = item.currentStock <= item.minStock;
                        return (
                          <tr
                            key={item.id}
                            className="border-b border-border/50 hover:bg-muted/20 table-row-alt"
                            data-ocid={`inventory.item.${i + 1}`}
                          >
                            <td className="px-4 py-3 font-medium text-foreground">
                              <div className="flex items-center gap-2">
                                {isLow && (
                                  <AlertTriangle className="size-3.5 text-amber-500 flex-shrink-0" />
                                )}
                                {item.name}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {item.category}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {item.store}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {item.unit}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span
                                className={`font-semibold ${
                                  isLow ? "text-amber-600" : "text-foreground"
                                }`}
                              >
                                {item.currentStock}
                              </span>
                              {isLow && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs bg-amber-100 text-amber-700 border-0"
                                >
                                  Low
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">
                              {item.minStock}
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground">
                              {formatCurrency(item.purchasePrice)}
                            </td>
                            <td className="px-4 py-3 text-right text-foreground font-medium">
                              {formatCurrency(item.salePrice)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex gap-1 justify-end">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-7"
                                  onClick={() =>
                                    setItemDialog({ open: true, item })
                                  }
                                  data-ocid={`inventory.edit_item.${i + 1}`}
                                >
                                  <Edit className="size-3.5" />
                                </Button>
                                {isAdmin && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-7 text-destructive"
                                    onClick={() => handleDeleteItem(item.id)}
                                    data-ocid={`inventory.delete_item.${i + 1}`}
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button
              onClick={() => setTxnOpen(true)}
              data-ocid="inventory.add_txn.button"
            >
              <Plus className="size-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {txnsLoading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <Skeleton key={`skel-txn-${n}`} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {[
                        "Date",
                        "Item",
                        "Type",
                        "Qty",
                        "Unit Price",
                        "Total",
                        "Buyer / Adm No",
                        "Seller",
                        "Received",
                        "Balance",
                        "Remarks",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-3 py-3 font-semibold text-muted-foreground whitespace-nowrap ${
                            [
                              "Qty",
                              "Unit Price",
                              "Total",
                              "Received",
                              "Balance",
                            ].includes(h)
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {txns.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className="px-4 py-10 text-center text-muted-foreground"
                          data-ocid="inventory.txns.empty_state"
                        >
                          <TrendingUp className="size-8 mx-auto mb-2 opacity-30" />
                          No transactions yet. Record a purchase or sale.
                        </td>
                      </tr>
                    ) : (
                      txns.map((t, i) => (
                        <tr
                          key={t.id}
                          className="border-b border-border/50 hover:bg-muted/20 table-row-alt"
                          data-ocid={`inventory.txn.item.${i + 1}`}
                        >
                          <td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
                            {formatDate(t.date)}
                          </td>
                          <td className="px-3 py-3 font-medium text-foreground">
                            {t.itemName}
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                t.type === "Purchase"
                                  ? "bg-blue-100 text-blue-700"
                                  : t.type === "Sale"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {t.type === "Purchase" ? (
                                <TrendingDown className="size-3" />
                              ) : (
                                <TrendingUp className="size-3" />
                              )}
                              {t.type}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right font-mono">
                            {t.quantity}
                          </td>
                          <td className="px-3 py-3 text-right text-muted-foreground">
                            {formatCurrency(t.unitPrice)}
                          </td>
                          <td className="px-3 py-3 text-right font-semibold text-foreground">
                            {formatCurrency(t.totalAmount)}
                          </td>
                          <td className="px-3 py-3 text-muted-foreground">
                            <div className="flex flex-col">
                              {t.buyerName && (
                                <span className="text-foreground">
                                  {t.buyerName}
                                </span>
                              )}
                              {t.buyerAdmNo && (
                                <span className="text-xs text-muted-foreground">
                                  {t.buyerAdmNo}
                                </span>
                              )}
                              {!t.buyerName && !t.buyerAdmNo && (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-3 text-muted-foreground">
                            {t.sellerName || "—"}
                          </td>
                          <td className="px-3 py-3 text-right text-muted-foreground">
                            {t.receivedAmount
                              ? formatCurrency(t.receivedAmount)
                              : "—"}
                          </td>
                          <td className="px-3 py-3 text-right">
                            {t.balanceAmount ? (
                              <span className="font-semibold text-destructive">
                                {formatCurrency(t.balanceAmount)}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-3 text-muted-foreground">
                            {t.remarks || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Daily Sales Tab */}
        <TabsContent value="daily-sales" className="mt-4">
          <DailySalesTab txns={txns} txnsLoading={txnsLoading} />
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-4 space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => window.print()}
              data-ocid="inventory.print.button"
            >
              <Printer className="size-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                downloadCSV(
                  items.map((i) => ({
                    Name: i.name,
                    Category: i.category,
                    Store: i.store,
                    Unit: i.unit,
                    Stock: i.currentStock,
                    MinStock: i.minStock,
                    PurchasePrice: i.purchasePrice,
                    SalePrice: i.salePrice,
                    StockValue: i.currentStock * i.unitPrice,
                  })),
                  "inventory-report",
                )
              }
              data-ocid="inventory.export.button"
            >
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">
                Stock Report
              </h3>
              <p className="text-sm text-muted-foreground">
                Total Inventory Value:{" "}
                <span className="font-semibold text-foreground">
                  {formatCurrency(totalValue)}
                </span>
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {[
                      "Item",
                      "Category",
                      "Store",
                      "Unit",
                      "Stock",
                      "Sale Price",
                      "Stock Value",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-3 font-semibold text-muted-foreground ${
                          ["Stock", "Sale Price", "Stock Value"].includes(h)
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-10 text-center text-muted-foreground"
                      >
                        No inventory data available.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, i) => {
                      const isLow = item.currentStock <= item.minStock;
                      return (
                        <tr
                          key={item.id}
                          className={`border-b border-border/50 table-row-alt ${
                            isLow ? "bg-amber-50/50" : ""
                          }`}
                          data-ocid={`inventory.report.item.${i + 1}`}
                        >
                          <td className="px-4 py-3 font-medium text-foreground">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.category}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.store}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {item.unit}
                          </td>
                          <td className="px-4 py-3 text-right font-mono">
                            {item.currentStock}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {formatCurrency(item.salePrice)}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-foreground">
                            {formatCurrency(item.currentStock * item.unitPrice)}
                          </td>
                          <td className="px-4 py-3">
                            {isLow ? (
                              <Badge
                                variant="secondary"
                                className="bg-amber-100 text-amber-700 border-0 text-xs"
                              >
                                <AlertTriangle className="size-3 mr-1" />
                                Low Stock
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 border-0 text-xs"
                              >
                                OK
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ItemDialog
        open={itemDialog.open}
        item={itemDialog.item}
        onClose={() => setItemDialog({ open: false, item: null })}
        onSave={handleSaveItem}
        isSaving={addItem.isPending || updateItem.isPending}
      />
      <TransactionDialog
        open={txnOpen}
        onClose={() => setTxnOpen(false)}
        items={items}
        onSave={handleAddTxn}
        isSaving={addTxn.isPending}
        createdBy={createdBy}
      />
    </div>
  );
}
