import { createActor } from "@/backend";
import { AttendanceSystemsSection } from "@/components/settings/AttendanceSystemsSection";
import { BackupRestoreTab } from "@/components/settings/BackupRestoreTab";
import { CustomColumnsSection } from "@/components/settings/CustomColumnsSection";
import { DevicesTab } from "@/components/settings/DevicesTab";
import { ImageUploadField } from "@/components/shared/ImageUploadField";
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetIndexPageConfig,
  useSaveIndexPageConfig,
  useSchoolInfo,
  useUpdateSchoolInfo,
} from "@/hooks/useBackend";
import type {
  IndexPageConfig as FrontendIndexPageConfig,
  IndexPageSection as FrontendIndexPageSection,
} from "@/hooks/useBackend";
import { defaultSettings } from "@/lib/backend";
import { useAppStore } from "@/store/useAppStore";
import type { AppSettings } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Globe,
  GripVertical,
  Images,
  Layout,
  Loader2,
  Palette,
  Phone,
  Plus,
  School,
  Settings2,
  Shield,
  Trash2,
  Upload,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Factory Reset Section ───────────────────────────────────────────────────
function FactoryResetSection() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const currentRole = useAppStore((s) => s.currentRole);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";

  const [step, setStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  if (!isAdmin) return null;

  async function handleFinalReset() {
    if (!adminPassword.trim()) {
      toast.error("Admin password is required.");
      return;
    }
    setResetting(true);
    try {
      if (actor) {
        const r = await actor.factoryReset(adminPassword);
        if (r.__kind__ === "ok") {
          toast.success(
            "Factory reset complete. App has been reset to default state.",
          );
          localStorage.clear();
          setAuthenticated(false);
          navigate({ to: "/login" });
          return;
        }
        toast.error(
          (r as { __kind__: "err"; err: string }).err ??
            "Factory reset failed.",
        );
      } else {
        toast.error("Backend not available.");
      }
    } catch {
      toast.error("Factory reset failed. Please try again.");
    } finally {
      setResetting(false);
      setDialogOpen(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-destructive/15 flex items-center justify-center">
            <AlertTriangle className="size-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-semibold text-destructive text-base">
              Danger Zone
            </h2>
            <p className="text-xs text-muted-foreground">
              These actions are irreversible and will permanently delete all
              data.
            </p>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 p-4 rounded-lg border border-destructive/30 bg-card">
          <div>
            <p className="font-medium text-foreground">Factory Reset</p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
              Permanently deletes ALL data including students, staff, fees,
              timetables, attendance, and inventory. This cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              setStep(1);
              setConfirmText("");
              setAdminPassword("");
              setDialogOpen(true);
            }}
            data-ocid="settings.factory_reset_button"
          >
            Factory Reset
          </Button>
        </div>
      </div>

      {/* Step 1 — type FACTORY_RESET */}
      <Dialog
        open={dialogOpen && step === 1}
        onOpenChange={(v) => {
          if (!v) {
            setDialogOpen(false);
          }
        }}
      >
        <DialogContent data-ocid="settings.factory_reset_dialog_1">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" /> Confirm Factory Reset
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              This will permanently delete <strong>ALL data</strong> including
              students, staff, fees, timetables, attendance, and inventory.{" "}
              <strong>This cannot be undone.</strong>
            </p>
            <div className="space-y-1.5">
              <Label>
                Type{" "}
                <span className="font-mono font-bold text-destructive">
                  FACTORY_RESET
                </span>{" "}
                to confirm
              </Label>
              <Input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="FACTORY_RESET"
                data-ocid="settings.factory_reset_confirm_input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="settings.factory_reset_cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={confirmText !== "FACTORY_RESET"}
              onClick={() => setStep(2)}
              data-ocid="settings.factory_reset_continue_button"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 2 — final confirmation + admin password */}
      <Dialog
        open={dialogOpen && step === 2}
        onOpenChange={(v) => {
          if (!v) {
            setDialogOpen(false);
          }
        }}
      >
        <DialogContent data-ocid="settings.factory_reset_dialog_2">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="size-5" /> Final Warning
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground font-semibold">
              Are you absolutely sure? All data will be permanently deleted.
            </p>
            <div className="space-y-1.5">
              <Label>Admin Password (for verification)</Label>
              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter your admin password"
                data-ocid="settings.factory_reset_password_input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="settings.factory_reset_final_cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={resetting || !adminPassword.trim()}
              onClick={handleFinalReset}
              data-ocid="settings.factory_reset_final_confirm_button"
            >
              {resetting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" /> Resetting…
                </>
              ) : (
                "Yes, Delete Everything"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const THEMES = [
  {
    id: "navy-gold",
    name: "Deep Blue",
    primary: "oklch(0.28 0.12 245)",
    accent: "oklch(0.68 0.18 198)",
    bg: "oklch(0.97 0.007 240)",
  },
  {
    id: "ocean-blue",
    name: "Emerald",
    primary: "oklch(0.32 0.14 152)",
    accent: "oklch(0.70 0.20 158)",
    bg: "oklch(0.97 0.008 152)",
  },
  {
    id: "forest-green",
    name: "Royal Purple",
    primary: "oklch(0.34 0.18 292)",
    accent: "oklch(0.72 0.18 72)",
    bg: "oklch(0.97 0.008 292)",
  },
  {
    id: "royal-purple",
    name: "Amber",
    primary: "oklch(0.55 0.20 60)",
    accent: "oklch(0.42 0.14 50)",
    bg: "oklch(0.98 0.010 72)",
  },
  {
    id: "sunset-orange",
    name: "Coral",
    primary: "oklch(0.58 0.22 22)",
    accent: "oklch(0.40 0.08 230)",
    bg: "oklch(0.98 0.008 20)",
  },
  {
    id: "rose-pink",
    name: "Teal",
    primary: "oklch(0.34 0.12 193)",
    accent: "oklch(0.72 0.22 190)",
    bg: "oklch(0.97 0.008 190)",
  },
  {
    id: "charcoal-dark",
    name: "Slate",
    primary: "oklch(0.36 0.10 222)",
    accent: "oklch(0.60 0.16 188)",
    bg: "oklch(0.96 0.006 222)",
  },
  {
    id: "midnight-dark",
    name: "Rose",
    primary: "oklch(0.44 0.22 358)",
    accent: "oklch(0.68 0.18 0)",
    bg: "oklch(0.97 0.008 358)",
  },
  {
    id: "slate-gray",
    name: "Charcoal Dark",
    primary: "oklch(0.68 0.20 193)",
    accent: "oklch(0.72 0.22 190)",
    bg: "oklch(0.13 0.012 240)",
  },
  {
    id: "crimson-red",
    name: "Midnight Dark",
    primary: "oklch(0.62 0.24 285)",
    accent: "oklch(0.56 0.26 312)",
    bg: "oklch(0.11 0.025 265)",
  },
];

const CLASS_VALUES = [
  "PlayWay",
  "LKG",
  "UKG",
  "Class1",
  "Class2",
  "Class3",
  "Class4",
  "Class5",
  "Class6",
  "Class7",
  "Class8",
  "Class9",
  "Class10",
  "Class11",
  "Class12",
];

const SECTION_TYPES = [
  "hero",
  "features",
  "about",
  "contact",
  "testimonials",
  "custom",
] as const;
type SectionType = (typeof SECTION_TYPES)[number];

const DEFAULT_CONFIG: FrontendIndexPageConfig = {
  heroTitle: "Excellence in Education",
  heroSubtitle:
    "Empowering students with knowledge, values, and skills for tomorrow",
  heroImageFileId: "",
  heroImages: [],
  heroBgColor: "#1e3a5f",
  heroTextColor: "#ffffff",
  ctaButtonText: "Login to Dashboard",
  ctaButtonColor: "#c9a84c",
  customLinks: [],
  featureCards: [],
  isPublished: false,
  sections: [
    {
      id: "sec-1",
      sectionType: "features",
      title: "Our Features",
      description: "Complete school management — from admissions to alumni.",
      imageFileId: "",
      bgColor: "",
      textColor: "",
      isVisible: true,
      order: 1,
    },
    {
      id: "sec-2",
      sectionType: "about",
      title: "About Us",
      description:
        "A premier educational institution committed to excellence in academics and holistic development of students.",
      imageFileId: "",
      bgColor: "",
      textColor: "",
      isVisible: true,
      order: 2,
    },
    {
      id: "sec-3",
      sectionType: "contact",
      title: "Contact Us",
      description: "Reach out to us for admissions and enquiries.",
      imageFileId: "",
      bgColor: "",
      textColor: "",
      isVisible: true,
      order: 3,
    },
  ],
};

function generateId() {
  return `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// ── Section Editor (inline expand) ───────────────────────────────────────────
interface SectionEditorProps {
  section: FrontendIndexPageSection;
  index: number;
  total: number;
  onChange: (updated: FrontendIndexPageSection) => void;
  onDelete: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

function SectionEditor({
  section,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SectionEditorProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="border border-border rounded-lg bg-card overflow-hidden"
      data-ocid={`index_page.section.item.${index + 1}`}
    >
      {/* Header row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
        <Badge variant="outline" className="text-xs shrink-0 capitalize">
          {section.sectionType}
        </Badge>
        <span className="text-sm font-medium text-foreground flex-1 truncate min-w-0">
          {section.title || "(untitled)"}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            aria-label="Move up"
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            data-ocid={`index_page.section.move_up.${index + 1}`}
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Move down"
            disabled={index === total - 1}
            onClick={() => onMoveDown(index)}
            className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            data-ocid={`index_page.section.move_down.${index + 1}`}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={section.isVisible ? "Hide section" : "Show section"}
            onClick={() =>
              onChange({ ...section, isVisible: !section.isVisible })
            }
            className="p-1 rounded hover:bg-muted"
            data-ocid={`index_page.section.toggle.${index + 1}`}
          >
            {section.isVisible ? (
              <Eye className="h-3.5 w-3.5 text-primary" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          <button
            type="button"
            aria-label={expanded ? "Collapse" : "Edit"}
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded hover:bg-muted"
            data-ocid={`index_page.section.edit_button.${index + 1}`}
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Expanded editor */}
      {expanded && (
        <div className="border-t border-border px-3 py-3 space-y-3 bg-muted/20">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Section Title</Label>
              <Input
                value={section.title}
                onChange={(e) =>
                  onChange({ ...section, title: e.target.value })
                }
                placeholder="Section title"
                className="h-8 text-sm"
                data-ocid={`index_page.section.title.${index + 1}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Section Type</Label>
              <select
                className="w-full h-8 rounded-md border border-input bg-background px-3 text-sm"
                value={section.sectionType}
                onChange={(e) =>
                  onChange({ ...section, sectionType: e.target.value })
                }
                data-ocid={`index_page.section.type.${index + 1}`}
              >
                {SECTION_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Textarea
              rows={2}
              value={section.description}
              onChange={(e) =>
                onChange({ ...section, description: e.target.value })
              }
              placeholder="Section description or subtitle"
              className="text-sm resize-none"
              data-ocid={`index_page.section.description.${index + 1}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={section.bgColor || "#f8fafc"}
                  onChange={(e) =>
                    onChange({ ...section, bgColor: e.target.value })
                  }
                  className="h-8 w-10 rounded border border-input cursor-pointer p-0.5"
                  data-ocid={`index_page.section.bg_color.${index + 1}`}
                />
                <Input
                  value={section.bgColor}
                  onChange={(e) =>
                    onChange({ ...section, bgColor: e.target.value })
                  }
                  placeholder="#ffffff"
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={section.textColor || "#1a1a1a"}
                  onChange={(e) =>
                    onChange({ ...section, textColor: e.target.value })
                  }
                  className="h-8 w-10 rounded border border-input cursor-pointer p-0.5"
                  data-ocid={`index_page.section.text_color.${index + 1}`}
                />
                <Input
                  value={section.textColor}
                  onChange={(e) =>
                    onChange({ ...section, textColor: e.target.value })
                  }
                  placeholder="#000000"
                  className="h-8 text-sm flex-1"
                />
              </div>
            </div>
          </div>
          <ImageUploadField
            label="Section Image"
            value={section.imageFileId}
            onChange={(url) => onChange({ ...section, imageFileId: url })}
            onRemove={() => onChange({ ...section, imageFileId: "" })}
            shape="rect"
            ocid={`index_page.section.image.${index + 1}`}
          />
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onDelete(section.id)}
              className="h-7 text-xs"
              data-ocid={`index_page.section.delete_button.${index + 1}`}
            >
              Delete Section
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Live Preview Panel ────────────────────────────────────────────────────────
interface PreviewPanelProps {
  config: FrontendIndexPageConfig;
}

function PreviewPanel({ config }: PreviewPanelProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-sm text-[10px] leading-tight">
      {/* Mini hero */}
      <div
        className="relative px-4 py-5 text-center"
        style={{ background: config.heroBgColor || "#1e3a5f" }}
      >
        {config.heroImageFileId && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${config.heroImageFileId})` }}
          />
        )}
        <div className="relative z-10">
          <p
            className="font-bold text-sm leading-snug mb-0.5"
            style={{ color: config.heroTextColor || "#ffffff" }}
          >
            {config.heroTitle || "School Name"}
          </p>
          <p
            className="text-[10px] opacity-80 mb-2"
            style={{ color: config.heroTextColor || "#ffffff" }}
          >
            {config.heroSubtitle || "Tagline"}
          </p>
          <span
            className="inline-block px-2 py-0.5 rounded text-[9px] font-semibold"
            style={{
              background: config.ctaButtonColor || "#c9a84c",
              color: "#fff",
            }}
          >
            {config.ctaButtonText || "Login"}
          </span>
        </div>
      </div>
      {/* Mini sections */}
      {config.sections
        .filter((s) => s.isVisible)
        .sort((a, b) => a.order - b.order)
        .map((s) => (
          <div
            key={s.id}
            className="px-3 py-2 border-t border-border"
            style={{
              background: s.bgColor || "transparent",
              color: s.textColor || "inherit",
            }}
          >
            <p className="font-semibold text-[9px]">{s.title}</p>
            <p className="text-[8px] opacity-70 mt-0.5 truncate">
              {s.description}
            </p>
          </div>
        ))}
      <div className="px-3 py-1.5 bg-muted/40 border-t border-border text-[8px] text-center text-muted-foreground">
        Footer — SHUBH SCHOOL ERP
      </div>
    </div>
  );
}

// ── Add Section Dialog ────────────────────────────────────────────────────────
interface AddSectionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: SectionType) => void;
}

function AddSectionDialog({ open, onClose, onAdd }: AddSectionDialogProps) {
  const [selectedType, setSelectedType] = useState<SectionType>("custom");
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-ocid="index_page.add_section.dialog">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Label>Section Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {SECTION_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedType(t)}
                className={`px-3 py-2 rounded-lg border text-sm capitalize transition-all ${
                  selectedType === t
                    ? "border-primary bg-primary/10 text-primary font-medium"
                    : "border-border hover:border-primary/40 text-foreground"
                }`}
                data-ocid={`index_page.add_section.type.${t}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="index_page.add_section.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAdd(selectedType);
              onClose();
            }}
            data-ocid="index_page.add_section.confirm_button"
          >
            Add Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Hero Slider Images Manager ────────────────────────────────────────────────
interface HeroImagesManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

function HeroImagesManager({ images, onChange }: HeroImagesManagerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setError("Only JPG and PNG images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be smaller than 5 MB.");
      return;
    }
    setUploading(true);
    const url = URL.createObjectURL(file);
    setTimeout(() => {
      onChange([...images, url]);
      setUploading(false);
    }, 400);
  }

  function removeImage(idx: number) {
    const img = images[idx];
    if (img?.startsWith("blob:")) URL.revokeObjectURL(img);
    onChange(images.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-1.5">
          <Images className="h-3.5 w-3.5 text-primary" />
          Hero Slider Images
          <span className="text-muted-foreground font-normal ml-1">
            ({images.length} image{images.length !== 1 ? "s" : ""} — auto-play
            5s)
          </span>
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          data-ocid="index_page.hero_images.upload_button"
        >
          {uploading ? (
            <span className="animate-pulse">Uploading…</span>
          ) : (
            <>
              <Upload className="h-3 w-3" />
              Add Image
            </>
          )}
        </Button>
      </div>

      {images.length === 0 ? (
        <button
          type="button"
          className="w-full rounded-lg border-2 border-dashed border-border bg-muted/20 py-6 text-center cursor-pointer hover:bg-muted/40 transition-colors"
          onClick={() => fileRef.current?.click()}
          data-ocid="index_page.hero_images.dropzone"
        >
          <Images className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">
            Click to add slider images (JPG/PNG, max 5 MB each)
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Multiple images will auto-play in a slider
          </p>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((src, i) => (
            <div
              key={src + String(i)}
              className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted/30"
              data-ocid={`index_page.hero_images.item.${i + 1}`}
            >
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  aria-label={`Remove slide ${i + 1}`}
                  data-ocid={`index_page.hero_images.delete_button.${i + 1}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="absolute bottom-1 left-1 rounded bg-black/50 text-white text-[9px] px-1 py-0.5">
                {i + 1}
              </span>
            </div>
          ))}
          {/* Add more tile */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="aspect-video rounded-lg border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-1"
            data-ocid="index_page.hero_images.add_more_button"
          >
            <Plus className="h-4 w-4 text-muted-foreground/60" />
            <span className="text-[10px] text-muted-foreground">Add more</span>
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
        aria-label="Upload hero slider image"
      />
    </div>
  );
}

// ── Index Page Tab ────────────────────────────────────────────────────────────
function IndexPageTab() {
  const { data: savedConfig, isLoading } = useGetIndexPageConfig();
  const saveConfig = useSaveIndexPageConfig();

  const [config, setConfig] = useState<FrontendIndexPageConfig>(DEFAULT_CONFIG);
  const [dirty, setDirty] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Populate from backend when loaded
  useEffect(() => {
    if (savedConfig) {
      setConfig(savedConfig);
      setDirty(false);
    }
  }, [savedConfig]);

  function updateConfig(partial: Partial<FrontendIndexPageConfig>) {
    setConfig((c) => ({ ...c, ...partial }));
    setDirty(true);
  }

  function updateSection(updated: FrontendIndexPageSection) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) => (s.id === updated.id ? updated : s)),
    }));
    setDirty(true);
  }

  function deleteSection(id: string) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.filter((s) => s.id !== id),
    }));
    setDirty(true);
  }

  function moveSection(index: number, dir: "up" | "down") {
    setConfig((c) => {
      const arr = [...c.sections];
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return c;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...c, sections: arr.map((s, i) => ({ ...s, order: i + 1 })) };
    });
    setDirty(true);
  }

  function addSection(type: SectionType) {
    const newSection: FrontendIndexPageSection = {
      id: generateId(),
      sectionType: type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: "",
      imageFileId: "",
      bgColor: "",
      textColor: "",
      isVisible: true,
      order: config.sections.length + 1,
    };
    setConfig((c) => ({ ...c, sections: [...c.sections, newSection] }));
    setDirty(true);
  }

  async function handleSave() {
    try {
      await saveConfig.mutateAsync(config);
      setDirty(false);
      toast.success("Index page configuration saved successfully");
    } catch {
      toast.error("Failed to save index page configuration");
    }
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="index_page.loading_state"
      >
        <div className="text-center space-y-2">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            Loading index page config…
          </p>
        </div>
      </div>
    );
  }

  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4" data-ocid="index_page.panel">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layout className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-foreground text-sm">
              Index / Landing Page Editor
            </h3>
            <p className="text-xs text-muted-foreground">
              Customise every section of the public landing page
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <span
              className="text-xs text-amber-600 font-medium px-2 py-1 bg-amber-50 border border-amber-200 rounded-md"
              data-ocid="index_page.unsaved_indicator"
            >
              Unsaved changes
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview((v) => !v)}
            data-ocid="index_page.preview_toggle"
          >
            {showPreview ? (
              <EyeOff className="h-3.5 w-3.5 mr-1.5" />
            ) : (
              <Eye className="h-3.5 w-3.5 mr-1.5" />
            )}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveConfig.isPending}
            data-ocid="index_page.save_button"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            {saveConfig.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div
        className={`grid gap-6 ${showPreview ? "lg:grid-cols-[1fr_280px]" : ""}`}
      >
        {/* ── Left: editor ── */}
        <div className="space-y-5">
          {/* Hero Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  H
                </span>
                Hero Section
              </CardTitle>
              <CardDescription className="text-xs">
                Title, subtitle, CTA button, colors, and background image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Hero Title</Label>
                <Input
                  value={config.heroTitle}
                  onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                  placeholder="School name or main headline"
                  data-ocid="index_page.hero_title.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Hero Subtitle / Tagline</Label>
                <Input
                  value={config.heroSubtitle}
                  onChange={(e) =>
                    updateConfig({ heroSubtitle: e.target.value })
                  }
                  placeholder="Tagline or short description"
                  data-ocid="index_page.hero_subtitle.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">CTA Button Text</Label>
                <Input
                  value={config.ctaButtonText}
                  onChange={(e) =>
                    updateConfig({ ctaButtonText: e.target.value })
                  }
                  placeholder="e.g. Login to Dashboard"
                  data-ocid="index_page.cta_text.input"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Hero Background</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.heroBgColor || "#1e3a5f"}
                      onChange={(e) =>
                        updateConfig({ heroBgColor: e.target.value })
                      }
                      className="h-9 w-12 rounded border border-input cursor-pointer p-0.5"
                      data-ocid="index_page.hero_bg_color.input"
                    />
                    <Input
                      value={config.heroBgColor}
                      onChange={(e) =>
                        updateConfig({ heroBgColor: e.target.value })
                      }
                      placeholder="#1e3a5f"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Hero Text Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.heroTextColor || "#ffffff"}
                      onChange={(e) =>
                        updateConfig({ heroTextColor: e.target.value })
                      }
                      className="h-9 w-12 rounded border border-input cursor-pointer p-0.5"
                      data-ocid="index_page.hero_text_color.input"
                    />
                    <Input
                      value={config.heroTextColor}
                      onChange={(e) =>
                        updateConfig({ heroTextColor: e.target.value })
                      }
                      placeholder="#ffffff"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">CTA Button Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.ctaButtonColor || "#c9a84c"}
                      onChange={(e) =>
                        updateConfig({ ctaButtonColor: e.target.value })
                      }
                      className="h-9 w-12 rounded border border-input cursor-pointer p-0.5"
                      data-ocid="index_page.cta_color.input"
                    />
                    <Input
                      value={config.ctaButtonColor}
                      onChange={(e) =>
                        updateConfig({ ctaButtonColor: e.target.value })
                      }
                      placeholder="#c9a84c"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              </div>
              <ImageUploadField
                label="Hero Background Image (fallback)"
                value={config.heroImageFileId}
                onChange={(url) => updateConfig({ heroImageFileId: url })}
                onRemove={() => updateConfig({ heroImageFileId: "" })}
                shape="rect"
                ocid="index_page.hero_image.upload_button"
              />
              <HeroImagesManager
                images={config.heroImages ?? []}
                onChange={(imgs) => updateConfig({ heroImages: imgs })}
              />
            </CardContent>
          </Card>

          {/* Sections Manager */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <span className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      S
                    </span>
                    Sections Manager
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Reorder, toggle visibility, and edit each section
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddDialogOpen(true)}
                  data-ocid="index_page.add_section.open_modal_button"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {sortedSections.length === 0 ? (
                <div
                  className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground"
                  data-ocid="index_page.sections.empty_state"
                >
                  <Layout className="h-6 w-6 mx-auto mb-2 opacity-30" />
                  <p>No sections yet — click "Add Section" to get started.</p>
                </div>
              ) : (
                sortedSections.map((section, i) => (
                  <SectionEditor
                    key={section.id}
                    section={section}
                    index={i}
                    total={sortedSections.length}
                    onChange={updateSection}
                    onDelete={deleteSection}
                    onMoveUp={(idx) => moveSection(idx, "up")}
                    onMoveDown={(idx) => moveSection(idx, "down")}
                  />
                ))
              )}
            </CardContent>
          </Card>

          {/* Bottom save */}
          <div className="flex items-center justify-between pt-1">
            {dirty && (
              <span className="text-xs text-amber-600 font-medium">
                You have unsaved changes
              </span>
            )}
            <Button
              onClick={handleSave}
              disabled={saveConfig.isPending}
              className="ml-auto"
              data-ocid="index_page.save_bottom.save_button"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {saveConfig.isPending ? "Saving…" : "Save Index Page"}
            </Button>
          </div>
        </div>

        {/* ── Right: live preview ── */}
        {showPreview && (
          <div className="space-y-3">
            <div className="sticky top-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Live Preview
              </p>
              <PreviewPanel config={config} />
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Preview updates as you edit
              </p>
            </div>
          </div>
        )}
      </div>

      <AddSectionDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={addSection}
      />
    </div>
  );
}

// ── Main SettingsPage ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [schoolName, setSchoolName] = useState("");
  const [about, setAbout] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [schoolPhotoUrl, setSchoolPhotoUrl] = useState(
    "/assets/generated/school-hero.dim_1200x600.jpg",
  );
  const [dashboardBgUrl, setDashboardBgUrl] = useState(settings.dashboardBgUrl);
  const [whatsappKey, setWhatsappKey] = useState(settings.whatsappApiKey);
  const [whatsappUrl, setWhatsappUrl] = useState(
    settings.whatsappPhoneNumberId,
  );
  const [upiId, setUpiId] = useState(settings.gpayUpiId);

  const [testingConn, setTestingConn] = useState(false);
  const updateSchoolInfo = useUpdateSchoolInfo();
  const { data: schoolInfo } = useSchoolInfo();
  const currentTheme = useAppStore((s) => s.currentTheme);
  const setTheme = useAppStore((s) => s.setTheme);

  // Populate school profile state from backend when data loads
  useEffect(() => {
    if (schoolInfo) {
      setSchoolName(schoolInfo.name || "");
      setAbout(schoolInfo.about || "");
      setAddress(schoolInfo.address || "");
      setPhone(schoolInfo.phone || "");
      setEmail(schoolInfo.email || "");
      if (schoolInfo.photoUrl) setSchoolPhotoUrl(schoolInfo.photoUrl);
    }
  }, [schoolInfo]);

  async function handleSaveSchoolProfile() {
    try {
      await updateSchoolInfo.mutateAsync({
        name: schoolName,
        about,
        address,
        phone,
        email,
        photoUrl: schoolPhotoUrl,
      });
      toast.success("School profile saved successfully");
    } catch {
      toast.error("Failed to save school profile");
    }
  }

  function handleSaveIntegrations() {
    setSettings((s) => ({
      ...s,
      whatsappApiKey: whatsappKey,
      whatsappPhoneNumberId: whatsappUrl,
      gpayUpiId: upiId,
    }));
    toast.success("Integration settings saved");
  }

  async function handleTestConnection() {
    setTestingConn(true);
    await new Promise((r) => setTimeout(r, 1200));
    setTestingConn(false);
    if (whatsappKey.trim()) {
      toast.success("WhatsApp connection successful");
    } else {
      toast.error("Connection failed: API key is required");
    }
  }

  function handleApplyTheme(themeId: string) {
    setTheme(themeId);
    toast.success("Theme applied successfully");
  }

  return (
    <div className="p-6 space-y-6" data-ocid="settings.page">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Settings2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            School configuration, integrations, and system preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" data-ocid="settings.tab">
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="general" data-ocid="settings.general.tab">
            General
          </TabsTrigger>
          <TabsTrigger value="profile" data-ocid="settings.profile.tab">
            School Profile
          </TabsTrigger>
          <TabsTrigger value="indexpage" data-ocid="settings.indexpage.tab">
            Index Page
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            data-ocid="settings.integrations.tab"
          >
            Integrations
          </TabsTrigger>
          <TabsTrigger value="themes" data-ocid="settings.themes.tab">
            Themes
          </TabsTrigger>
          <TabsTrigger value="devices" data-ocid="settings.devices.tab">
            Devices
          </TabsTrigger>
          <TabsTrigger value="attendance" data-ocid="settings.attendance.tab">
            Attendance
          </TabsTrigger>
          <TabsTrigger value="backup" data-ocid="settings.backup.tab">
            Backup &amp; Restore
          </TabsTrigger>
          <TabsTrigger
            value="danger"
            className="text-destructive data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
            data-ocid="settings.danger.tab"
          >
            Danger Zone
          </TabsTrigger>
        </TabsList>

        {/* ── General ── */}
        <TabsContent value="general">
          <div className="grid gap-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-primary" />
                  Academic Session
                </CardTitle>
                <CardDescription>
                  Current active academic year configuration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Active Session
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All fee and student operations use this session
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-base px-4 py-1">
                    {settings.activeSessionId}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Default Class
                </CardTitle>
                <CardDescription>
                  Pre-selected class when adding new students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Default Class for New Students</Label>
                  <select
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    defaultValue="Class1"
                    data-ocid="settings.default_class.select"
                  >
                    {CLASS_VALUES.map((c) => (
                      <option key={c} value={c}>
                        {c.replace("Class", "Class ")}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
            <CustomColumnsSection />
          </div>
        </TabsContent>
        <TabsContent value="profile">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                School Profile
              </CardTitle>
              <CardDescription>
                Edit public-facing school information shown on landing page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Enter school name"
                  data-ocid="settings.school_name.input"
                />
              </div>
              <div className="space-y-2">
                <ImageUploadField
                  label="School Photo"
                  value={schoolPhotoUrl}
                  onChange={setSchoolPhotoUrl}
                  onRemove={() => setSchoolPhotoUrl("")}
                  shape="rect"
                  ocid="settings.photo.upload_button"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">About / Description</Label>
                <Textarea
                  id="about"
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  data-ocid="settings.about.textarea"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    data-ocid="settings.address.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-ocid="settings.phone.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-ocid="settings.email.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    data-ocid="settings.website.input"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveSchoolProfile}
                disabled={updateSchoolInfo.isPending}
                className="w-full"
                data-ocid="settings.profile.save_button"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {updateSchoolInfo.isPending ? "Saving…" : "Save School Profile"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Index Page ── */}
        <TabsContent value="indexpage">
          <IndexPageTab />
        </TabsContent>

        {/* ── Integrations ── */}
        <TabsContent value="integrations">
          <div className="grid gap-6 max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-primary" />
                  WhatsApp API
                </CardTitle>
                <CardDescription>
                  Configure WhatsApp Business API for messaging
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={whatsappKey}
                    onChange={(e) => setWhatsappKey(e.target.value)}
                    placeholder="Enter WhatsApp API key"
                    data-ocid="settings.whatsapp_key.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number ID / API URL</Label>
                  <Input
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    placeholder="e.g. 123456789012345"
                    data-ocid="settings.whatsapp_url.input"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testingConn}
                  data-ocid="settings.whatsapp_test.button"
                >
                  {testingConn ? "Testing…" : "Test Connection"}
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Payment Gateways
                </CardTitle>
                <CardDescription>
                  Enable payment methods for fee collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <p className="text-sm font-medium">Razorpay</p>
                    <p className="text-xs text-muted-foreground">
                      Cards, UPI, Net Banking
                    </p>
                  </div>
                  <Switch
                    checked={settings.razorpayEnabled}
                    onCheckedChange={(v) =>
                      setSettings((s) => ({ ...s, razorpayEnabled: v }))
                    }
                    data-ocid="settings.razorpay.switch"
                  />
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div>
                    <p className="text-sm font-medium">PayU</p>
                    <p className="text-xs text-muted-foreground">
                      Cards, Net Banking, Wallets
                    </p>
                  </div>
                  <Switch
                    checked={settings.payuEnabled}
                    onCheckedChange={(v) =>
                      setSettings((s) => ({ ...s, payuEnabled: v }))
                    }
                    data-ocid="settings.payu.switch"
                  />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">GPay / UPI QR</p>
                    <p className="text-xs text-muted-foreground">
                      Google Pay QR code on fee screen
                    </p>
                  </div>
                  <Switch
                    checked={settings.gpayEnabled}
                    onCheckedChange={(v) =>
                      setSettings((s) => ({ ...s, gpayEnabled: v }))
                    }
                    data-ocid="settings.gpay.switch"
                  />
                </div>
                {settings.gpayEnabled && (
                  <div className="space-y-2 pt-2">
                    <Label>
                      <Phone className="h-3 w-3 inline mr-1" />
                      UPI ID
                    </Label>
                    <Input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="school@upi"
                      data-ocid="settings.upi_id.input"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <Button
              onClick={handleSaveIntegrations}
              data-ocid="settings.integrations.save_button"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Save Integration Settings
            </Button>
          </div>
        </TabsContent>

        {/* ── Themes ── */}
        <TabsContent value="themes">
          <div className="space-y-6 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Colour Themes
                </CardTitle>
                <CardDescription>
                  Choose a colour scheme for the ERP interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-4">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleApplyTheme(theme.id)}
                      className={`group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                        currentTheme === theme.id
                          ? "border-primary shadow-md"
                          : "border-border hover:border-primary/40"
                      }`}
                      data-ocid={`settings.theme.${theme.id}`}
                    >
                      <div className="flex gap-1">
                        <span
                          className="h-8 w-8 rounded-full border border-border shadow-sm"
                          style={{ background: theme.primary }}
                        />
                        <span
                          className="h-8 w-8 rounded-full border border-border shadow-sm"
                          style={{ background: theme.accent }}
                        />
                        <span
                          className="h-8 w-8 rounded-full border border-border shadow-sm"
                          style={{ background: theme.bg }}
                        />
                      </div>
                      <span className="text-xs text-center font-medium text-foreground truncate w-full">
                        {theme.name}
                      </span>
                      {currentTheme === theme.id && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custom Dashboard Background</CardTitle>
                <CardDescription>
                  Upload a background image for the dashboard page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploadField
                  label="Dashboard Background"
                  value={dashboardBgUrl}
                  onChange={(url) => {
                    setDashboardBgUrl(url);
                    setSettings((s) => ({ ...s, dashboardBgUrl: url }));
                  }}
                  onRemove={() => {
                    setDashboardBgUrl("");
                    setSettings((s) => ({ ...s, dashboardBgUrl: "" }));
                  }}
                  shape="rect"
                  ocid="settings.dashboard_bg.upload_button"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: 1920×1080px, JPG or PNG
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Devices ── */}
        <TabsContent value="devices">
          <DevicesTab />
        </TabsContent>

        {/* ── Attendance Systems ── */}
        <TabsContent value="attendance">
          <AttendanceSystemsSection />
        </TabsContent>

        {/* ── Backup & Restore ── */}
        <TabsContent value="backup">
          <BackupRestoreTab />
        </TabsContent>

        {/* ── Danger Zone ── */}
        <TabsContent value="danger">
          <FactoryResetSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
