import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import type { CustomStudentColumn } from "@/hooks/useBackend";
import {
  useGetCustomStudentColumns,
  useSaveCustomStudentColumns,
} from "@/hooks/useBackend";
import { Columns, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FIELD_TYPES: Array<{
  value: CustomStudentColumn["fieldType"];
  label: string;
}> = [
  { value: "Text", label: "Text" },
  { value: "Number", label: "Number" },
  { value: "Date", label: "Date" },
];

export function CustomColumnsSection() {
  const { data: columns = [], isLoading } = useGetCustomStudentColumns();
  const saveColumns = useSaveCustomStudentColumns();

  const [localColumns, setLocalColumns] = useState<CustomStudentColumn[]>([]);
  const [initialised, setInitialised] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] =
    useState<CustomStudentColumn["fieldType"]>("Text");

  // Sync from backend on first load
  if (!initialised && !isLoading) {
    setLocalColumns(columns);
    setInitialised(true);
  }

  function handleDelete(idx: number) {
    setLocalColumns((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleAdd() {
    if (!newName.trim()) {
      toast.error("Column name is required");
      return;
    }
    if (
      localColumns.some(
        (c) => c.columnLabel.toLowerCase() === newName.trim().toLowerCase(),
      )
    ) {
      toast.error("A column with this name already exists");
      return;
    }
    setLocalColumns((prev) => [
      ...prev,
      { columnLabel: newName.trim(), fieldType: newType },
    ]);
    setNewName("");
    setNewType("Text");
    setAddDialogOpen(false);
  }

  async function handleSave() {
    try {
      await saveColumns.mutateAsync(localColumns);
      toast.success("Custom columns saved successfully");
    } catch {
      toast.error("Failed to save custom columns");
    }
  }

  return (
    <Card data-ocid="custom_columns.panel">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <Columns className="h-4 w-4 text-primary" />
              Student Profile — Extra Columns
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Add custom fields that appear in Add Student, Edit Student, and
              Student Profile. Admin only.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAddDialogOpen(true)}
            data-ocid="custom_columns.add_button"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Column
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {localColumns.length === 0 ? (
          <div
            className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground"
            data-ocid="custom_columns.empty_state"
          >
            <Columns className="h-6 w-6 mx-auto mb-2 opacity-30" />
            <p>No custom columns yet. Click "Add Column" to create one.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Column Name
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-foreground">
                    Field Type
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-foreground w-16">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {localColumns.map((col, idx) => (
                  <tr
                    key={col.columnLabel}
                    className="border-b border-border last:border-0"
                    data-ocid={`custom_columns.item.${idx + 1}`}
                  >
                    <td className="px-3 py-2 font-medium text-foreground">
                      {col.columnLabel}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {col.fieldType}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(idx)}
                        data-ocid={`custom_columns.delete_button.${idx + 1}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveColumns.isPending}
            data-ocid="custom_columns.save_button"
          >
            {saveColumns.isPending ? "Saving…" : "Save Columns"}
          </Button>
        </div>
      </CardContent>

      {/* Add Column Dialog */}
      <Dialog
        open={addDialogOpen}
        onOpenChange={(o) => {
          if (!o) {
            setNewName("");
            setNewType("Text");
          }
          setAddDialogOpen(o);
        }}
      >
        <DialogContent
          className="max-w-sm"
          data-ocid="custom_columns.add.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              Add Custom Column
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Column Name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Blood Group, Aadhaar No."
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                data-ocid="custom_columns.add.name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Field Type</Label>
              <Select
                value={newType}
                onValueChange={(v) =>
                  setNewType(v as CustomStudentColumn["fieldType"])
                }
              >
                <SelectTrigger data-ocid="custom_columns.add.type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              data-ocid="custom_columns.add.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!newName.trim()}
              data-ocid="custom_columns.add.confirm_button"
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
