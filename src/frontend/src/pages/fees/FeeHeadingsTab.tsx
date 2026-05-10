import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  useAddFeeHeading,
  useDeleteFeeHeading,
  useFeeHeadings,
  useUpdateFeeHeading,
} from "@/hooks/useBackend";
import type { FeeHeading } from "@/types";
import {
  BookOpen,
  CalendarDays,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Indian academic year months (April → March)
const ACADEMIC_MONTHS = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

const MONTH_PRESETS = [
  {
    id: "all12",
    label: "All 12 Months",
    description: "Entire academic year",
    months: ACADEMIC_MONTHS,
  },
  {
    id: "quarterly",
    label: "Quarterly",
    description: "Apr · Jul · Oct · Jan",
    months: ["April", "July", "October", "January"],
  },
  {
    id: "halfyearly",
    label: "Half-Yearly",
    description: "April · October only",
    months: ["April", "October"],
  },
  {
    id: "custom",
    label: "Pick Months",
    description: "Choose specific months",
    months: [],
  },
];

interface HeadingFormState {
  name: string;
  description: string;
  isActive: boolean;
  applicableMonths: string[];
}

// ─── Month Picker ─────────────────────────────────────────────────────────────
function MonthPicker({
  value,
  onChange,
}: {
  value: string[];
  onChange: (months: string[]) => void;
}) {
  const activePreset = MONTH_PRESETS.find(
    (p) =>
      p.id !== "custom" &&
      p.months.length === value.length &&
      p.months.every((m) => value.includes(m)),
  );

  function applyPreset(preset: (typeof MONTH_PRESETS)[number]) {
    if (preset.id === "custom") return;
    onChange([...preset.months]);
  }

  function toggleMonth(month: string) {
    onChange(
      value.includes(month)
        ? value.filter((m) => m !== month)
        : [...value, month],
    );
  }

  return (
    <div className="space-y-3">
      {/* Preset buttons */}
      <div className="grid grid-cols-2 gap-2">
        {MONTH_PRESETS.map((preset) => {
          const isActive =
            preset.id !== "custom"
              ? activePreset?.id === preset.id
              : !activePreset && value.length > 0;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className={`px-2.5 py-2 rounded-lg border text-left transition-all text-xs ${
                isActive
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:border-primary/40 text-foreground"
              }`}
              data-ocid={`fees.heading.month_preset.${preset.id}`}
            >
              <p className="font-medium">{preset.label}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5 truncate">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Month checkboxes */}
      <div className="border border-border rounded-lg p-3 bg-muted/20">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Selected months ({value.length}/12)
        </p>
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          {ACADEMIC_MONTHS.map((month) => (
            <div key={month} className="flex items-center gap-2">
              <Checkbox
                id={`month-${month}`}
                checked={value.includes(month)}
                onCheckedChange={() => toggleMonth(month)}
                data-ocid={`fees.heading.month.${month.toLowerCase()}`}
              />
              <label
                htmlFor={`month-${month}`}
                className="text-xs cursor-pointer select-none"
              >
                {month}
              </label>
            </div>
          ))}
        </div>
        {value.length === 0 && (
          <p className="text-xs text-destructive mt-2">
            Select at least one month.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Month pills display ──────────────────────────────────────────────────────
function MonthPills({ months }: { months: string[] }) {
  if (!months || months.length === 0)
    return <span className="text-muted-foreground text-xs italic">—</span>;
  if (months.length === 12)
    return (
      <Badge variant="outline" className="text-xs">
        All 12 months
      </Badge>
    );
  if (months.length <= 4)
    return (
      <div className="flex flex-wrap gap-1">
        {months.map((m) => (
          <Badge key={m} variant="secondary" className="text-xs px-1.5">
            {m.slice(0, 3)}
          </Badge>
        ))}
      </div>
    );
  return (
    <Badge variant="secondary" className="text-xs">
      {months.length} months
    </Badge>
  );
}

// ─── Extended FeeHeading with applicableMonths ────────────────────────────────
type FeeHeadingExt = FeeHeading & { applicableMonths?: string[] };

export function FeeHeadingsTab() {
  const { data: headings = [], isLoading } = useFeeHeadings();
  const addMutation = useAddFeeHeading();
  const updateMutation = useUpdateFeeHeading();
  const deleteMutation = useDeleteFeeHeading();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<HeadingFormState>({
    name: "",
    description: "",
    isActive: true,
    applicableMonths: [...ACADEMIC_MONTHS],
  });

  function openAdd() {
    setEditId(null);
    setForm({
      name: "",
      description: "",
      isActive: true,
      applicableMonths: [...ACADEMIC_MONTHS],
    });
    setDialogOpen(true);
  }

  function openEdit(h: FeeHeadingExt) {
    setEditId(h.id);
    setForm({
      name: h.name,
      description: h.description,
      isActive: h.isActive,
      applicableMonths: h.applicableMonths ?? [...ACADEMIC_MONTHS],
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    if (form.applicableMonths.length === 0) {
      toast.error("Please select at least one applicable month.");
      return;
    }
    try {
      if (editId) {
        await updateMutation.mutateAsync({
          id: editId,
          name: form.name.trim(),
          description: form.description,
          isActive: form.isActive,
          applicableMonths: form.applicableMonths,
        });
        toast.success("Fee heading updated");
      } else {
        await addMutation.mutateAsync({
          name: form.name.trim(),
          description: form.description,
          applicableMonths: form.applicableMonths,
        });
        toast.success("Fee heading added");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save fee heading",
      );
    }
  }

  async function handleToggle(h: FeeHeadingExt) {
    try {
      await updateMutation.mutateAsync({
        id: h.id,
        name: h.name,
        description: h.description,
        isActive: !h.isActive,
        applicableMonths: h.applicableMonths ?? [...ACADEMIC_MONTHS],
      });
      toast.success("Status updated");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteId(null);
      toast.success("Fee heading deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete fee heading",
      );
    }
  }

  const isSaving = addMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Fee Headings
          </h2>
          <p className="text-sm text-muted-foreground">
            Define fee types and specify which months each fee applies
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="gap-2"
          data-ocid="fees.heading.add_button"
        >
          <Plus size={15} /> Add Heading
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-foreground">
                #
              </th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">
                Heading Name
              </th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">
                Description
              </th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">
                <div className="flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-primary" />
                  Applies To
                </div>
              </th>
              <th className="text-center px-4 py-3 font-semibold text-foreground">
                Status
              </th>
              <th className="text-right px-4 py-3 font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }, (_, i) => `sk-${i}`).map((key) => (
                <tr key={key} className="border-b border-border">
                  <td className="px-4 py-3" colSpan={6}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : headings.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div
                    className="py-12 text-center"
                    data-ocid="fees.headings.empty_state"
                  >
                    <BookOpen className="size-10 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground font-medium">
                      No fee headings yet
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Click "Add Heading" to create your first fee type
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              (headings as FeeHeadingExt[]).map((h, i) => (
                <tr
                  key={h.id}
                  className="border-b border-border last:border-0 table-row-alt"
                  data-ocid={`fees.heading.item.${i + 1}`}
                >
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {h.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {h.description}
                  </td>
                  <td className="px-4 py-3">
                    <MonthPills
                      months={h.applicableMonths ?? ACADEMIC_MONTHS}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={h.isActive}
                      onCheckedChange={() => handleToggle(h)}
                      disabled={updateMutation.isPending}
                      data-ocid={`fees.heading.toggle.${i + 1}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Badge
                        variant={h.isActive ? "default" : "secondary"}
                        className="text-xs mr-2"
                      >
                        {h.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => openEdit(h)}
                        data-ocid={`fees.heading.edit_button.${i + 1}`}
                      >
                        <Pencil size={13} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(h.id)}
                        data-ocid={`fees.heading.delete_button.${i + 1}`}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="fees.heading.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Fee Heading" : "Add Fee Heading"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Heading Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Tuition Fee"
                data-ocid="fees.heading.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Brief description"
                data-ocid="fees.heading.description.input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                data-ocid="fees.heading.active.switch"
              />
              <Label>Active</Label>
            </div>

            {/* Month selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-primary" />
                Applicable Months
              </Label>
              <p className="text-xs text-muted-foreground -mt-1">
                Which months is this fee charged? (Indian academic year:
                Apr–Mar)
              </p>
              <MonthPicker
                value={form.applicableMonths}
                onChange={(months) =>
                  setForm((f) => ({ ...f, applicableMonths: months }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isSaving}
              data-ocid="fees.heading.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !form.name.trim() ||
                form.applicableMonths.length === 0 ||
                isSaving
              }
              data-ocid="fees.heading.save_button"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-1" /> Saving…
                </>
              ) : (
                <>{editId ? "Update" : "Add"} Heading</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm — uses AlertDialog so it renders above all other dialogs */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
      >
        <AlertDialogContent data-ocid="fees.heading.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Fee Heading?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this fee heading. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
              data-ocid="fees.heading.delete.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) handleDelete(deleteId);
              }}
              disabled={isDeleting}
              data-ocid="fees.heading.delete.confirm_button"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-1" /> Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
