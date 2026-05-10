import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  TEMPLATE_LABELS,
  defaultTemplates,
  useMessageTemplates,
  useUpdateMessageTemplate,
} from "@/hooks/useMessaging";
import { Edit3, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PLACEHOLDERS = [
  "{student_name}",
  "{parent_name}",
  "{class}",
  "{adm_no}",
  "{amount}",
  "{date}",
  "{months}",
  "{receipt_no}",
  "{reason}",
  "{resume_date}",
  "{school_name}",
];

export function TemplateEditor() {
  const { data: templates, isLoading } = useMessageTemplates();
  const updateTemplate = useUpdateMessageTemplate();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");

  const effectiveTemplates = { ...defaultTemplates, ...templates };

  function startEdit(key: string) {
    setEditingKey(key);
    setDraftText(effectiveTemplates[key] ?? "");
  }

  function cancelEdit() {
    setEditingKey(null);
    setDraftText("");
  }

  async function saveTemplate() {
    if (!editingKey) return;
    try {
      await updateTemplate.mutateAsync({
        key: editingKey,
        template: draftText,
      });
      toast.success(
        `Template "${TEMPLATE_LABELS[editingKey] ?? editingKey}" saved`,
      );
      setEditingKey(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save template",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="template_editor.section">
      <div className="flex flex-wrap gap-1.5 p-3 bg-muted/40 rounded-lg border border-border">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide w-full mb-1">
          Available placeholders:
        </span>
        {PLACEHOLDERS.map((p) => (
          <Badge
            key={p}
            variant="outline"
            className="text-xs font-mono cursor-pointer hover:bg-primary/10"
            onClick={() => {
              if (editingKey) setDraftText((prev) => prev + p);
            }}
          >
            {p}
          </Badge>
        ))}
        {editingKey && (
          <p className="text-xs text-muted-foreground w-full mt-1">
            Click a placeholder to insert it into the editing template.
          </p>
        )}
      </div>

      {Object.entries(TEMPLATE_LABELS).map(([key, label]) => {
        const isEditing = editingKey === key;
        const text = effectiveTemplates[key] ?? "";
        return (
          <Card
            key={key}
            className={`transition-shadow ${isEditing ? "ring-2 ring-primary shadow-md" : ""}`}
          >
            <CardHeader className="pb-2 pt-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{label}</CardTitle>
                {!isEditing ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(key)}
                    data-ocid={`template.${key}.edit_button`}
                    className="h-7 text-xs gap-1"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={cancelEdit}
                      data-ocid={`template.${key}.cancel_button`}
                      className="h-7 text-xs gap-1"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveTemplate}
                      disabled={updateTemplate.isPending}
                      data-ocid={`template.${key}.save_button`}
                      className="h-7 text-xs gap-1"
                    >
                      <Save className="h-3 w-3" />
                      {updateTemplate.isPending ? "Saving…" : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              {isEditing ? (
                <Textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  rows={4}
                  data-ocid={`template.${key}.editor`}
                  className="text-sm font-mono resize-none"
                  placeholder="Template text with placeholders like {student_name}..."
                />
              ) : (
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  {text || (
                    <span className="italic opacity-50">No template set</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
