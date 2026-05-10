import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CertificateTemplateBackend } from "@/hooks/useBackend";
import type { CertificateType } from "@/types";
import {
  CreditCard,
  Edit,
  FileText,
  GraduationCap,
  Printer,
  Receipt,
  ScrollText,
  Star,
  Trash2,
} from "lucide-react";

interface TemplateLibraryProps {
  templates: CertificateTemplateBackend[];
  onEdit: (template: CertificateTemplateBackend) => void;
  onGenerate: (template: CertificateTemplateBackend) => void;
  onDelete: (id: string) => void;
  onSetDefault?: (id: string, templateType: string) => void;
  activeType: CertificateType | "all";
}

const TYPE_META: Record<
  string,
  { label: string; color: string; icon: React.ElementType }
> = {
  IDCard: {
    label: "Student ID Card",
    color: "bg-blue-100 text-blue-700",
    icon: CreditCard,
  },
  StaffIDCard: {
    label: "Staff ID Card",
    color: "bg-violet-100 text-violet-700",
    icon: CreditCard,
  },
  FeeReceipt: {
    label: "Fee Receipt",
    color: "bg-green-100 text-green-700",
    icon: Receipt,
  },
  Bonafide: {
    label: "Bonafide",
    color: "bg-purple-100 text-purple-700",
    icon: GraduationCap,
  },
  Transfer: {
    label: "Transfer Cert.",
    color: "bg-orange-100 text-orange-700",
    icon: ScrollText,
  },
  AdmitCard: {
    label: "Admit Card",
    color: "bg-red-100 text-red-700",
    icon: FileText,
  },
  AdmissionForm: {
    label: "Admission Form",
    color: "bg-teal-100 text-teal-700",
    icon: FileText,
  },
  Result: {
    label: "Result Sheet",
    color: "bg-indigo-100 text-indigo-700",
    icon: FileText,
  },
  Experience: {
    label: "Experience",
    color: "bg-yellow-100 text-yellow-700",
    icon: FileText,
  },
  DemandSlip: {
    label: "Demand Slip",
    color: "bg-rose-100 text-rose-700",
    icon: ScrollText,
  },
};

function TemplatePreviewCard({
  template,
}: { template: CertificateTemplateBackend }) {
  const meta = TYPE_META[template.templateType] ?? TYPE_META.AdmissionForm;
  const Icon = meta.icon;

  let elementCount = 0;
  let paperSize = "A4";
  try {
    const parsed = JSON.parse(template.elementsJson) as {
      elements?: unknown[];
      paperSize?: string;
    };
    elementCount = parsed.elements?.length ?? 0;
    paperSize = parsed.paperSize ?? "A4";
  } catch {
    /* ignore */
  }

  return (
    <div className="aspect-[3/4] rounded-lg border-2 border-border bg-gradient-to-br from-muted/40 to-muted/10 flex flex-col items-center justify-center gap-2 relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 overflow-hidden rounded-lg">
        <p className="text-4xl font-bold text-foreground rotate-45 select-none">
          SHUBH
        </p>
      </div>
      <div className="size-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center">
        <Icon className="size-6 text-primary" />
      </div>
      <p className="text-xs text-muted-foreground font-mono">{paperSize}</p>
      <p className="text-xs text-muted-foreground">{elementCount} elements</p>
      {template.isDefault && (
        <div className="absolute top-2 right-2">
          <Star className="size-3.5 text-amber-500 fill-amber-500" />
        </div>
      )}
    </div>
  );
}

export function TemplateLibrary({
  templates,
  onEdit,
  onGenerate,
  onDelete,
  onSetDefault,
  activeType,
}: TemplateLibraryProps) {
  const filtered =
    activeType === "all"
      ? templates
      : templates.filter((t) => t.templateType === activeType);

  if (filtered.length === 0) {
    return (
      <div
        className="text-center py-16 text-muted-foreground"
        data-ocid="template_library.empty_state"
      >
        <FileText className="size-12 mx-auto mb-3 opacity-20" />
        <p className="font-medium">No templates yet</p>
        <p className="text-sm mt-1">
          Add a new template or switch document type
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      data-ocid="template_library.list"
    >
      {filtered.map((template, i) => {
        const meta =
          TYPE_META[template.templateType] ?? TYPE_META.AdmissionForm;
        return (
          <div
            key={template.id}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-primary/40 transition-all group"
            data-ocid={`template_library.item.${i + 1}`}
          >
            {/* Preview */}
            <div className="p-3">
              <TemplatePreviewCard template={template} />
            </div>

            {/* Info */}
            <div className="px-3 pb-1">
              <p
                className="font-semibold text-foreground text-sm truncate"
                title={template.name}
              >
                {template.name}
              </p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${meta.color}`}
                >
                  {meta.label}
                </span>
                {template.isDefault && (
                  <Badge variant="secondary" className="text-xs h-4 px-1">
                    <Star className="size-2.5 mr-0.5 text-amber-500 fill-amber-500" />
                    Default
                  </Badge>
                )}
              </div>
            </div>

            {/* Default status / set default */}
            <div className="px-3 pt-1">
              {template.isDefault ? (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <Star className="size-2.5 fill-amber-500 text-amber-500" />
                  Used when printing {meta.label}
                </p>
              ) : onSetDefault ? (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                  onClick={() =>
                    onSetDefault(template.id, template.templateType)
                  }
                  data-ocid={`template_library.set_default.${i + 1}`}
                >
                  Set as Default for {meta.label}
                </button>
              ) : null}
            </div>

            {/* Actions */}
            <div className="px-3 pb-3 pt-2 flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-7 text-xs"
                onClick={() => onEdit(template)}
                data-ocid={`template_library.edit.${i + 1}`}
              >
                <Edit className="size-3 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                className="flex-1 h-7 text-xs"
                onClick={() => onGenerate(template)}
                data-ocid={`template_library.generate.${i + 1}`}
              >
                <Printer className="size-3 mr-1" />
                Print
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(template.id)}
                aria-label="Delete template"
                data-ocid={`template_library.delete.${i + 1}`}
              >
                <Trash2 className="size-3" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
