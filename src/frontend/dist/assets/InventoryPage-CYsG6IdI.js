import { ae as createLucideIcon, d as useAppStore, ck as useInventoryItems, cl as useInventoryTransactions, cm as useAddInventoryItem, cn as useUpdateInventoryItem, co as useDeleteInventoryItem, cp as useAddInventoryTransaction, r as reactExports, j as jsxRuntimeExports, cb as Package, a2 as TrendingUp, bk as formatCurrency, e as Button, S as Skeleton, t as Badge, a0 as formatDate, ab as downloadCSV, F as ue, I as Input, aw as ChevronRight, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label } from "./index-pMBTUEbj.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { T as TriangleAlert } from "./triangle-alert-Ai_hY88N.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { S as SquarePen } from "./square-pen-rgW01YAz.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { T as TrendingDown } from "./trending-down-BzTR3C0O.js";
import { P as Printer } from "./printer-Bk2BNhY3.js";
import { D as Download } from "./download-BHLO7mQe.js";
import { C as Calendar } from "./calendar-CAegGMND.js";
import { C as ChevronDown } from "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "8", cy: "21", r: "1", key: "jimo8o" }],
  ["circle", { cx: "19", cy: "21", r: "1", key: "13723u" }],
  [
    "path",
    {
      d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
      key: "9zh506"
    }
  ]
];
const ShoppingCart = createLucideIcon("shopping-cart", __iconNode);
const CATEGORIES = [
  "Uniform",
  "Books & Stationery",
  "Sports",
  "Lab Equipment",
  "Furniture",
  "Cleaning",
  "Electronics"
];
const STORES = ["Main Store", "Sports Room", "Science Lab", "Library Store"];
function ItemDialog({
  open,
  onClose,
  item,
  onSave,
  isSaving
}) {
  const isEdit = !!(item == null ? void 0 : item.id);
  const [form, setForm] = reactExports.useState({
    name: (item == null ? void 0 : item.name) ?? "",
    category: (item == null ? void 0 : item.category) ?? CATEGORIES[0],
    store: (item == null ? void 0 : item.store) ?? STORES[0],
    unit: (item == null ? void 0 : item.unit) ?? "Pcs",
    currentStock: (item == null ? void 0 : item.currentStock) ?? 0,
    minStock: (item == null ? void 0 : item.minStock) ?? 10,
    purchasePrice: (item == null ? void 0 : item.purchasePrice) ?? 0,
    salePrice: (item == null ? void 0 : item.salePrice) ?? 0
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "inventory.item_dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: isEdit ? "Edit Item" : "Add Item" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Item Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            className: "mt-1",
            value: form.name,
            onChange: (e) => set("name", e.target.value),
            placeholder: "e.g. School Uniform Shirt",
            "data-ocid": "inventory.name.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: form.category,
              onValueChange: (v) => set("category", v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Store" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.store, onValueChange: (v) => set("store", v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STORES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Unit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              value: form.unit,
              onChange: (e) => set("unit", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Current Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              type: "number",
              value: form.currentStock || "",
              onChange: (e) => set("currentStock", Number(e.target.value)),
              placeholder: "0",
              "data-ocid": "inventory.stock.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Min Stock" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              type: "number",
              value: form.minStock || "",
              onChange: (e) => set("minStock", Number(e.target.value)),
              placeholder: "0"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Purchase Price (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              type: "number",
              value: form.purchasePrice || "",
              onChange: (e) => set("purchasePrice", Number(e.target.value)),
              placeholder: "0",
              "data-ocid": "inventory.purchase_price.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Sale Price (₹)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "mt-1",
              type: "number",
              value: form.salePrice || "",
              onChange: (e) => set("salePrice", Number(e.target.value)),
              placeholder: "0",
              "data-ocid": "inventory.sale_price.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "flex-1",
            onClick: () => onSave(
              isEdit ? { ...item, ...form, id: (item == null ? void 0 : item.id) ?? "" } : { ...form }
            ),
            disabled: !form.name.trim() || isSaving,
            "data-ocid": "inventory.item.save_button",
            children: isSaving ? "Saving…" : "Save Item"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: onClose,
            "data-ocid": "inventory.item.cancel_button",
            children: "Cancel"
          }
        )
      ] })
    ] })
  ] }) });
}
function TransactionDialog({
  open,
  onClose,
  items,
  onSave,
  isSaving,
  createdBy
}) {
  var _a;
  const [form, setForm] = reactExports.useState({
    itemId: ((_a = items[0]) == null ? void 0 : _a.id) ?? "",
    type: "Sale",
    qty: "",
    price: "",
    date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    remarks: "",
    buyerAdmNo: "",
    buyerName: "",
    sellerName: "",
    received: ""
  });
  const setF = (k, v) => setForm((p) => ({ ...p, [k]: v }));
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
      buyerAdmNo: form.buyerAdmNo || void 0,
      buyerName: form.buyerName || void 0,
      sellerName: form.sellerName || void 0,
      receivedAmount: received ?? void 0,
      balanceAmount: balance ?? void 0
    });
  }
  const isSale = form.type === "Sale";
  const isPurchase = form.type === "Purchase";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-md overflow-y-auto max-h-[90vh]",
      "data-ocid": "inventory.txn_dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Add Transaction" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Item" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.itemId,
                onValueChange: (v) => setF("itemId", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "mt-1",
                      "data-ocid": "inventory.txn_item.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: items.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: i.id, children: i.name }, i.id)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.type,
                onValueChange: (v) => setF("type", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "mt-1",
                      "data-ocid": "inventory.txn_type.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Sale", children: "Sale" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Purchase", children: "Purchase" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Adjustment", children: "Adjustment" })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: "mt-1",
                  type: "number",
                  value: form.qty,
                  onChange: (e) => setF("qty", e.target.value),
                  placeholder: "0",
                  "data-ocid": "inventory.txn_qty.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Unit Price (₹)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: "mt-1",
                  type: "number",
                  value: form.price,
                  onChange: (e) => setF("price", e.target.value),
                  placeholder: "0",
                  "data-ocid": "inventory.txn_price.input"
                }
              )
            ] })
          ] }),
          total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2 rounded-lg bg-muted/40 text-sm flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatCurrency(total) })
          ] }),
          isSale && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Buyer Adm. No. (optional)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: "mt-1",
                    value: form.buyerAdmNo,
                    onChange: (e) => setF("buyerAdmNo", e.target.value),
                    placeholder: "e.g. ADM001",
                    "data-ocid": "inventory.txn_buyer_adm.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Buyer Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: "mt-1",
                    value: form.buyerName,
                    onChange: (e) => setF("buyerName", e.target.value),
                    placeholder: "Student / Staff name",
                    "data-ocid": "inventory.txn_buyer_name.input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Received Amount (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: "mt-1",
                    type: "number",
                    value: form.received,
                    onChange: (e) => setF("received", e.target.value),
                    placeholder: "0",
                    "data-ocid": "inventory.txn_received.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Balance Amount (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: "mt-1",
                    readOnly: true,
                    value: balance != null && balance > 0 ? balance.toString() : "",
                    placeholder: "Auto-calculated",
                    "data-ocid": "inventory.txn_balance.input"
                  }
                )
              ] })
            ] })
          ] }),
          isPurchase && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Supplier / Seller Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  className: "mt-1",
                  value: form.sellerName,
                  onChange: (e) => setF("sellerName", e.target.value),
                  placeholder: "Supplier name",
                  "data-ocid": "inventory.txn_seller.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Amount Paid to Supplier (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: "mt-1",
                    type: "number",
                    value: form.received,
                    onChange: (e) => setF("received", e.target.value),
                    placeholder: "0",
                    "data-ocid": "inventory.txn_received.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Balance Payable (₹)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    className: "mt-1",
                    readOnly: true,
                    value: balance != null && balance > 0 ? balance.toString() : "",
                    placeholder: "Auto-calculated",
                    "data-ocid": "inventory.txn_balance.input"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                className: "mt-1",
                value: form.date,
                onChange: (e) => setF("date", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Remarks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "mt-1",
                value: form.remarks,
                onChange: (e) => setF("remarks", e.target.value),
                placeholder: "Optional note"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "flex-1",
                onClick: handleSave,
                disabled: !form.itemId || !form.qty || !form.price || isSaving,
                "data-ocid": "inventory.txn.submit_button",
                children: isSaving ? "Saving…" : "Add Transaction"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: onClose,
                "data-ocid": "inventory.txn.cancel_button",
                children: "Cancel"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function DailySalesTab({
  txns,
  txnsLoading
}) {
  const [expandedDate, setExpandedDate] = reactExports.useState(null);
  const [dateFilter, setDateFilter] = reactExports.useState("");
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const summaries = reactExports.useMemo(() => {
    const byDate = {};
    for (const t of txns) {
      if (t.type === "Sale") {
        if (!byDate[t.date]) byDate[t.date] = [];
        byDate[t.date].push(t);
      }
    }
    return Object.keys(byDate).sort((a, b) => b.localeCompare(a)).map((date) => ({
      date,
      totalSales: byDate[date].length,
      totalAmount: byDate[date].reduce((s, t) => s + t.totalAmount, 0),
      itemsSold: byDate[date].reduce((s, t) => s + t.quantity, 0)
    }));
  }, [txns]);
  const todayTxns = reactExports.useMemo(
    () => txns.filter((t) => t.date === today && t.type === "Sale"),
    [txns, today]
  );
  const todayTotal = todayTxns.reduce((s, t) => s + t.totalAmount, 0);
  const filteredSummaries = reactExports.useMemo(() => {
    if (!dateFilter) return summaries;
    return summaries.filter((s) => s.date === dateFilter);
  }, [summaries, dateFilter]);
  const txnsForDate = (date) => txns.filter((t) => t.date === date && t.type === "Sale");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "inventory.daily_sales.section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-metric col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "size-4 text-emerald-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Today's Sales" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: todayTxns.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "transactions today" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-metric col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Today's Revenue" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: formatCurrency(todayTotal) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "amount collected today" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-metric col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-4 text-blue-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Items Sold Today" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: todayTxns.reduce((s, t) => s + t.quantity, 0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "units across all items" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Jump to date:" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          type: "date",
          className: "w-44 h-8 text-sm",
          value: dateFilter,
          onChange: (e) => setDateFilter(e.target.value),
          "data-ocid": "inventory.daily_sales.date_filter"
        }
      ),
      dateFilter && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-8 text-xs",
          onClick: () => setDateFilter(""),
          children: "Clear"
        }
      )
    ] }),
    txnsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, `skel-daily-${n}`)) }) : filteredSummaries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card px-4 py-12 text-center",
        "data-ocid": "inventory.daily_sales.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "size-8 mx-auto mb-2 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: dateFilter ? `No sales found for ${dateFilter}` : "No sales recorded yet." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground w-8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-muted-foreground", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-muted-foreground", children: "Items Sold" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-muted-foreground", children: "Transactions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-muted-foreground", children: "Total Amount" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredSummaries.map((summary, i) => {
        const isExpanded = expandedDate === summary.date;
        const dayTxns = txnsForDate(summary.date);
        const isToday = summary.date === today;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/50 hover:bg-muted/20 cursor-pointer table-row-alt",
              onClick: () => setExpandedDate(isExpanded ? null : summary.date),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setExpandedDate(isExpanded ? null : summary.date);
                }
              },
              tabIndex: 0,
              "aria-expanded": isExpanded,
              "data-ocid": `inventory.daily_sales.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  formatDate(summary.date),
                  isToday && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "secondary",
                      className: "text-xs bg-emerald-100 text-emerald-700 border-0",
                      children: "Today"
                    }
                  )
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-foreground", children: summary.itemsSold }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono text-foreground", children: summary.totalSales }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold text-foreground", children: formatCurrency(summary.totalAmount) })
              ]
            },
            summary.date
          ),
          isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "tr",
            {
              className: "bg-muted/10",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-4 py-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-3 pl-4 border-l-2 border-primary/30 ml-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-left font-semibold", children: "Item Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-semibold", children: "Qty" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-left font-semibold", children: "Buyer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-left font-semibold", children: "Seller" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-semibold", children: "Received" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-semibold", children: "Balance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-2 text-right font-semibold", children: "Total" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: dayTxns.map((t, j) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-t border-border/30",
                    "data-ocid": `inventory.daily_sales.txn.${j + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 font-medium text-foreground", children: t.itemName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-mono", children: t.quantity }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2", children: t.buyerName ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: t.buyerName }),
                        t.buyerAdmNo && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                          "Adm: ",
                          t.buyerAdmNo
                        ] })
                      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-muted-foreground", children: t.sellerName || "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right text-muted-foreground", children: t.receivedAmount ? formatCurrency(t.receivedAmount) : "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right", children: t.balanceAmount ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-destructive", children: formatCurrency(t.balanceAmount) }) : "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-2 text-right font-semibold text-foreground", children: formatCurrency(t.totalAmount) })
                    ]
                  },
                  t.id
                )) })
              ] }) }) })
            },
            `${summary.date}-expand`
          )
        ] });
      }) })
    ] }) })
  ] });
}
function InventoryPage() {
  const { currentRole, currentUser } = useAppStore();
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin" || currentRole === "Accountant";
  const createdBy = (currentUser == null ? void 0 : currentUser.fullName) ?? currentRole ?? "Admin";
  const { data: items = [], isLoading: itemsLoading } = useInventoryItems();
  const { data: txnsRaw = [], isLoading: txnsLoading } = useInventoryTransactions();
  const addItem = useAddInventoryItem();
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();
  const addTxn = useAddInventoryTransaction();
  const txns = txnsRaw.map((t) => {
    var _a;
    return {
      ...t,
      itemName: ((_a = items.find((i) => i.id === t.itemId)) == null ? void 0 : _a.name) ?? t.itemId
    };
  });
  const [itemDialog, setItemDialog] = reactExports.useState({ open: false, item: null });
  const [txnOpen, setTxnOpen] = reactExports.useState(false);
  const [catFilter, setCatFilter] = reactExports.useState("All");
  const [storeFilter, setStoreFilter] = reactExports.useState("All");
  const totalValue = items.reduce(
    (s, i) => s + i.currentStock * i.unitPrice,
    0
  );
  const lowStock = items.filter((i) => i.currentStock <= i.minStock);
  const filteredItems = items.filter(
    (i) => (catFilter === "All" || i.category === catFilter) && (storeFilter === "All" || i.store === storeFilter)
  );
  async function handleSaveItem(data) {
    const payload = {
      name: data.name,
      category: data.category ?? CATEGORIES[0],
      store: data.store ?? STORES[0],
      unit: data.unit ?? "Pcs",
      currentStock: data.currentStock ?? 0,
      minStock: data.minStock ?? 10,
      purchasePrice: data.purchasePrice ?? 0,
      salePrice: data.salePrice ?? 0,
      unitPrice: data.salePrice ?? 0
    };
    try {
      if (data.id) {
        await updateItem.mutateAsync({ ...payload, id: data.id });
        ue.success("Item updated successfully");
      } else {
        await addItem.mutateAsync(payload);
        ue.success("Item added successfully");
      }
      setItemDialog({ open: false, item: null });
    } catch (e) {
      ue.error(e.message ?? "Failed to save item");
    }
  }
  async function handleDeleteItem(id) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    try {
      await deleteItem.mutateAsync(id);
      ue.success("Item deleted");
    } catch (e) {
      ue.error(e.message ?? "Failed to delete item");
    }
  }
  async function handleAddTxn(t) {
    try {
      await addTxn.mutateAsync(t);
      ue.success("Transaction recorded");
      setTxnOpen(false);
    } catch (e) {
      ue.error(e.message ?? "Failed to record transaction");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-w-7xl", "data-ocid": "inventory.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold font-display text-foreground", children: "Inventory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Items, stock, purchases, sales, and pricing" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      {
        label: "Total Items",
        value: itemsLoading ? "…" : items.length,
        icon: Package,
        color: "text-primary"
      },
      {
        label: "Total Stock Value",
        value: itemsLoading ? "…" : formatCurrency(totalValue),
        icon: ShoppingCart,
        color: "text-emerald-600"
      },
      {
        label: "Low Stock Alerts",
        value: itemsLoading ? "…" : lowStock.length,
        icon: TriangleAlert,
        color: "text-amber-600"
      },
      {
        label: "Transactions",
        value: txnsLoading ? "…" : txns.length,
        icon: TrendingUp,
        color: "text-blue-600"
      }
    ].map(({ label, value, icon: Icon, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-metric", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-4 ${color}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold font-display text-foreground", children: value })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "items", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "items", "data-ocid": "inventory.items.tab", children: "Items" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "transactions",
            "data-ocid": "inventory.transactions.tab",
            children: "Transactions"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          TabsTrigger,
          {
            value: "daily-sales",
            "data-ocid": "inventory.daily_sales.tab",
            children: "Daily Sales"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "reports", "data-ocid": "inventory.reports.tab", children: "Reports" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "items", className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: catFilter, onValueChange: setCatFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-44",
                  "data-ocid": "inventory.category.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Category" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Categories" }),
                CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: storeFilter, onValueChange: setStoreFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-40",
                  "data-ocid": "inventory.store.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Store" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "All", children: "All Stores" }),
                STORES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setItemDialog({ open: true, item: null }),
              "data-ocid": "inventory.add_item.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
                "Add Item"
              ]
            }
          )
        ] }),
        itemsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, `skel-item-${n}`)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
            "Item",
            "Category",
            "Store",
            "Unit",
            "Stock",
            "Min Stock",
            "Purchase ₹",
            "Sale ₹",
            "Actions"
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `px-4 py-3 font-semibold text-muted-foreground ${[
                "Stock",
                "Purchase ₹",
                "Sale ₹",
                "Min Stock"
              ].includes(h) ? "text-right" : "text-left"} ${h === "Actions" ? "text-right" : ""}`,
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filteredItems.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 9,
              className: "px-4 py-10 text-center text-muted-foreground",
              "data-ocid": "inventory.items.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "size-8 mx-auto mb-2 opacity-30" }),
                "No items found. Add your first item."
              ]
            }
          ) }) : filteredItems.map((item, i) => {
            const isLow = item.currentStock <= item.minStock;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/50 hover:bg-muted/20 table-row-alt",
                "data-ocid": `inventory.item.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    isLow && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3.5 text-amber-500 flex-shrink-0" }),
                    item.name
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.store }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.unit }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-right", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `font-semibold ${isLow ? "text-amber-600" : "text-foreground"}`,
                        children: item.currentStock
                      }
                    ),
                    isLow && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "secondary",
                        className: "ml-2 text-xs bg-amber-100 text-amber-700 border-0",
                        children: "Low"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-muted-foreground", children: item.minStock }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-muted-foreground", children: formatCurrency(item.purchasePrice) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-foreground font-medium", children: formatCurrency(item.salePrice) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 justify-end", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7",
                        onClick: () => setItemDialog({ open: true, item }),
                        "data-ocid": `inventory.edit_item.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "size-3.5" })
                      }
                    ),
                    isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "icon",
                        variant: "ghost",
                        className: "size-7 text-destructive",
                        onClick: () => handleDeleteItem(item.id),
                        "data-ocid": `inventory.delete_item.${i + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" })
                      }
                    )
                  ] }) })
                ]
              },
              item.id
            );
          }) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "transactions", className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setTxnOpen(true),
            "data-ocid": "inventory.add_txn.button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 mr-2" }),
              "Add Transaction"
            ]
          }
        ) }),
        txnsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [0, 1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, `skel-txn-${n}`)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
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
            "Remarks"
          ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `px-3 py-3 font-semibold text-muted-foreground whitespace-nowrap ${[
                "Qty",
                "Unit Price",
                "Total",
                "Received",
                "Balance"
              ].includes(h) ? "text-right" : "text-left"}`,
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: txns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "td",
            {
              colSpan: 11,
              className: "px-4 py-10 text-center text-muted-foreground",
              "data-ocid": "inventory.txns.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-8 mx-auto mb-2 opacity-30" }),
                "No transactions yet. Record a purchase or sale."
              ]
            }
          ) }) : txns.map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/50 hover:bg-muted/20 table-row-alt",
              "data-ocid": `inventory.txn.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground whitespace-nowrap", children: formatDate(t.date) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 font-medium text-foreground", children: t.itemName }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: `inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${t.type === "Purchase" ? "bg-blue-100 text-blue-700" : t.type === "Sale" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`,
                    children: [
                      t.type === "Purchase" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-3" }),
                      t.type
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-mono", children: t.quantity }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right text-muted-foreground", children: formatCurrency(t.unitPrice) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right font-semibold text-foreground", children: formatCurrency(t.totalAmount) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                  t.buyerName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: t.buyerName }),
                  t.buyerAdmNo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: t.buyerAdmNo }),
                  !t.buyerName && !t.buyerAdmNo && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground", children: t.sellerName || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right text-muted-foreground", children: t.receivedAmount ? formatCurrency(t.receivedAmount) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right", children: t.balanceAmount ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-destructive", children: formatCurrency(t.balanceAmount) }) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-muted-foreground", children: t.remarks || "—" })
              ]
            },
            t.id
          )) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "daily-sales", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DailySalesTab, { txns, txnsLoading }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "reports", className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => window.print(),
              "data-ocid": "inventory.print.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4 mr-2" }),
                "Print"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => downloadCSV(
                items.map((i) => ({
                  Name: i.name,
                  Category: i.category,
                  Store: i.store,
                  Unit: i.unit,
                  Stock: i.currentStock,
                  MinStock: i.minStock,
                  PurchasePrice: i.purchasePrice,
                  SalePrice: i.salePrice,
                  StockValue: i.currentStock * i.unitPrice
                })),
                "inventory-report"
              ),
              "data-ocid": "inventory.export.button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "size-4 mr-2" }),
                "Export"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "Stock Report" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "Total Inventory Value:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatCurrency(totalValue) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
              "Item",
              "Category",
              "Store",
              "Unit",
              "Stock",
              "Sale Price",
              "Stock Value",
              "Status"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: `px-4 py-3 font-semibold text-muted-foreground ${["Stock", "Sale Price", "Stock Value"].includes(h) ? "text-right" : "text-left"}`,
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                colSpan: 8,
                className: "px-4 py-10 text-center text-muted-foreground",
                children: "No inventory data available."
              }
            ) }) : items.map((item, i) => {
              const isLow = item.currentStock <= item.minStock;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "tr",
                {
                  className: `border-b border-border/50 table-row-alt ${isLow ? "bg-amber-50/50" : ""}`,
                  "data-ocid": `inventory.report.item.${i + 1}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: item.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.category }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.store }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.unit }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-mono", children: item.currentStock }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: formatCurrency(item.salePrice) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right font-semibold text-foreground", children: formatCurrency(item.currentStock * item.unitPrice) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: isLow ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "secondary",
                        className: "bg-amber-100 text-amber-700 border-0 text-xs",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "size-3 mr-1" }),
                          "Low Stock"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "secondary",
                        className: "bg-emerald-100 text-emerald-700 border-0 text-xs",
                        children: "OK"
                      }
                    ) })
                  ]
                },
                item.id
              );
            }) })
          ] }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ItemDialog,
      {
        open: itemDialog.open,
        item: itemDialog.item,
        onClose: () => setItemDialog({ open: false, item: null }),
        onSave: handleSaveItem,
        isSaving: addItem.isPending || updateItem.isPending
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TransactionDialog,
      {
        open: txnOpen,
        onClose: () => setTxnOpen(false),
        items,
        onSave: handleAddTxn,
        isSaving: addTxn.isPending,
        createdBy
      }
    )
  ] });
}
export {
  InventoryPage as default
};
