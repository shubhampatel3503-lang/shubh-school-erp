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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type {
  CustomLink,
  FeatureCard,
  IndexPageConfig,
  IndexPageSection,
} from "@/hooks/useBackend";
import {
  useGetIndexPageConfig,
  useSaveIndexPageConfig,
} from "@/hooks/useBackend";
import {
  Award,
  BookMarked,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  GripVertical,
  Images,
  Layout,
  Link2,
  Plus,
  Settings2,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types & Defaults ─────────────────────────────────────────────────────────

const SECTION_TYPES = [
  "features",
  "about",
  "contact",
  "testimonials",
  "custom",
] as const;

const ICON_OPTIONS = [
  "GraduationCap",
  "Users",
  "IndianRupee",
  "ClipboardCheck",
  "Award",
  "MessageSquare",
  "BookMarked",
  "Phone",
  "Mail",
  "Bus",
  "Library",
  "FileText",
  "Star",
  "Globe",
];

const SUGGESTED_LINKS = [
  { label: "Online Admission", url: "#admission", isExternal: false },
  { label: "Certificate Verification", url: "#verify", isExternal: false },
  { label: "Student Portal", url: "/login", isExternal: false },
  {
    label: "School Website",
    url: "https://yourschool.edu.in",
    isExternal: true,
  },
];

const EMPTY_CONFIG: IndexPageConfig = {
  heroTitle: "",
  heroSubtitle: "",
  heroImageFileId: "",
  heroImages: [],
  heroBgColor: "",
  heroTextColor: "",
  ctaButtonText: "Login to Dashboard",
  ctaButtonColor: "",
  sections: [],
  customLinks: [],
  featureCards: [],
  isPublished: false,
};

function genId() {
  return `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// ─── Hero Images Manager ─────────────────────────────────────────────────────

function HeroImagesManager({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    onChange([...images, url]);
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs flex items-center gap-1.5">
        <Images className="h-3.5 w-3.5" /> Slider Images
      </Label>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div
              key={src + String(i)}
              className="relative group rounded-lg overflow-hidden w-24 h-16 border border-border"
            >
              <img
                src={src}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileRef.current?.click()}
        data-ocid="index_editor.slider_image.upload_button"
      >
        <Upload className="h-3.5 w-3.5 mr-1.5" /> Add Slide Image
      </Button>
      <input
        type="file"
        ref={fileRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Section Editor ──────────────────────────────────────────────────────────

function SectionEditor({
  section,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  section: IndexPageSection;
  index: number;
  total: number;
  onChange: (s: IndexPageSection) => void;
  onDelete: (id: string) => void;
  onMoveUp: (i: number) => void;
  onMoveDown: (i: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="border border-border rounded-lg bg-card overflow-hidden"
      data-ocid={`index_editor.section.item.${index + 1}`}
    >
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
            className="p-1 rounded hover:bg-muted disabled:opacity-30"
            data-ocid={`index_editor.section.move_up.${index + 1}`}
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Move down"
            disabled={index === total - 1}
            onClick={() => onMoveDown(index)}
            className="p-1 rounded hover:bg-muted disabled:opacity-30"
            data-ocid={`index_editor.section.move_down.${index + 1}`}
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={section.isVisible ? "Hide" : "Show"}
            onClick={() =>
              onChange({ ...section, isVisible: !section.isVisible })
            }
            className="p-1 rounded hover:bg-muted"
            data-ocid={`index_editor.section.toggle.${index + 1}`}
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
            data-ocid={`index_editor.section.edit_button.${index + 1}`}
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          <button
            type="button"
            aria-label="Delete"
            onClick={() => onDelete(section.id)}
            className="p-1 rounded hover:bg-destructive/10 text-destructive"
            data-ocid={`index_editor.section.delete_button.${index + 1}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
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
                data-ocid={`index_editor.section.title.${index + 1}`}
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
                data-ocid={`index_editor.section.type.${index + 1}`}
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
              placeholder="Section description"
              className="text-sm resize-none"
              data-ocid={`index_editor.section.description.${index + 1}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Background Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={section.bgColor || "#ffffff"}
                  onChange={(e) =>
                    onChange({ ...section, bgColor: e.target.value })
                  }
                  className="h-8 w-10 rounded border border-input cursor-pointer p-0.5"
                />
                <Input
                  value={section.bgColor}
                  onChange={(e) =>
                    onChange({ ...section, bgColor: e.target.value })
                  }
                  placeholder="#ffffff"
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Text Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={section.textColor || "#000000"}
                  onChange={(e) =>
                    onChange({ ...section, textColor: e.target.value })
                  }
                  className="h-8 w-10 rounded border border-input cursor-pointer p-0.5"
                />
                <Input
                  value={section.textColor}
                  onChange={(e) =>
                    onChange({ ...section, textColor: e.target.value })
                  }
                  placeholder="#000000"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Custom Links Manager ────────────────────────────────────────────────────

function CustomLinksManager({
  links,
  onChange,
}: {
  links: CustomLink[];
  onChange: (links: CustomLink[]) => void;
}) {
  function addLink(suggested?: {
    label: string;
    url: string;
    isExternal: boolean;
  }) {
    const newLink: CustomLink = {
      label: suggested?.label ?? "New Link",
      url: suggested?.url ?? "",
      isExternal: suggested?.isExternal ?? false,
      order: links.length,
    };
    onChange([...links, newLink]);
  }

  function updateLink(index: number, updated: CustomLink) {
    onChange(links.map((l, i) => (i === index ? updated : l)));
  }

  function removeLink(index: number) {
    onChange(links.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {links.length === 0 && (
        <div
          className="rounded-lg border border-dashed border-border py-6 text-center"
          data-ocid="index_editor.links.empty_state"
        >
          <Link2 className="h-6 w-6 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No custom links yet</p>
        </div>
      )}
      {links.map((link, i) => (
        <div
          key={String(i)}
          className="flex items-start gap-2 p-3 rounded-lg border border-border bg-card"
          data-ocid={`index_editor.link.item.${i + 1}`}
        >
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Label</Label>
              <Input
                value={link.label}
                onChange={(e) =>
                  updateLink(i, { ...link, label: e.target.value })
                }
                placeholder="e.g. Online Admission"
                className="h-8 text-sm"
                data-ocid={`index_editor.link.label.${i + 1}`}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">URL</Label>
              <Input
                value={link.url}
                onChange={(e) =>
                  updateLink(i, { ...link, url: e.target.value })
                }
                placeholder="https://... or /path"
                className="h-8 text-sm"
                data-ocid={`index_editor.link.url.${i + 1}`}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-5 shrink-0">
            <label
              className="flex items-center gap-1.5 cursor-pointer"
              htmlFor={`link-external-${i}`}
            >
              <Switch
                checked={link.isExternal}
                onCheckedChange={(v) =>
                  updateLink(i, { ...link, isExternal: v })
                }
                data-ocid={`index_editor.link.external.${i + 1}`}
              />
              <span className="text-xs text-muted-foreground">New tab</span>
            </label>
            <button
              type="button"
              aria-label="Remove link"
              onClick={() => removeLink(i)}
              className="p-1 rounded hover:bg-destructive/10 text-destructive"
              data-ocid={`index_editor.link.delete_button.${i + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addLink()}
          data-ocid="index_editor.link.add_button"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Link
        </Button>
        {SUGGESTED_LINKS.filter(
          (s) => !links.some((l) => l.label === s.label),
        ).map((s) => (
          <Button
            key={s.label}
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground h-7"
            onClick={() => addLink(s)}
            data-ocid={`index_editor.link.suggest.${s.label.replace(/\s+/g, "_").toLowerCase()}`}
          >
            + {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Cards Manager ───────────────────────────────────────────────────

function FeatureCardsManager({
  cards,
  onChange,
}: {
  cards: FeatureCard[];
  onChange: (cards: FeatureCard[]) => void;
}) {
  function addCard() {
    onChange([
      ...cards,
      {
        id: genId(),
        icon: "Star",
        title: "New Feature",
        description: "",
        order: cards.length,
      },
    ]);
  }

  function updateCard(id: string, updated: FeatureCard) {
    onChange(cards.map((c) => (c.id === id ? updated : c)));
  }

  function removeCard(id: string) {
    onChange(cards.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-3">
      {cards.length === 0 && (
        <div
          className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground"
          data-ocid="index_editor.features.empty_state"
        >
          Default feature cards will be shown. Add custom cards to override.
        </div>
      )}
      {cards.map((card, i) => (
        <div
          key={card.id}
          className="grid grid-cols-[80px_1fr_1fr_auto] gap-2 items-start p-3 rounded-lg border border-border bg-card"
          data-ocid={`index_editor.feature.item.${i + 1}`}
        >
          <div className="space-y-1">
            <Label className="text-xs">Icon</Label>
            <select
              className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
              value={card.icon}
              onChange={(e) =>
                updateCard(card.id, { ...card, icon: e.target.value })
              }
              data-ocid={`index_editor.feature.icon.${i + 1}`}
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Title</Label>
            <Input
              value={card.title}
              onChange={(e) =>
                updateCard(card.id, { ...card, title: e.target.value })
              }
              placeholder="Feature title"
              className="h-8 text-sm"
              data-ocid={`index_editor.feature.title.${i + 1}`}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description</Label>
            <Input
              value={card.description}
              onChange={(e) =>
                updateCard(card.id, { ...card, description: e.target.value })
              }
              placeholder="Short description"
              className="h-8 text-sm"
              data-ocid={`index_editor.feature.desc.${i + 1}`}
            />
          </div>
          <button
            type="button"
            aria-label="Remove"
            onClick={() => removeCard(card.id)}
            className="mt-5 p-1 rounded hover:bg-destructive/10 text-destructive"
            data-ocid={`index_editor.feature.delete_button.${i + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addCard}
        data-ocid="index_editor.feature.add_button"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Feature Card
      </Button>
    </div>
  );
}

// ─── Live Preview Panel ───────────────────────────────────────────────────────

function LivePreview({ config }: { config: IndexPageConfig }) {
  const bgColor = config.heroBgColor || "#1e3a8a";
  const textColor = config.heroTextColor || "#ffffff";
  return (
    <div
      className="rounded-xl overflow-hidden border border-border shadow-sm text-[10px]"
      data-ocid="index_editor.preview"
    >
      {/* Simulated navbar */}
      <div className="h-7 bg-card border-b border-border flex items-center px-3 gap-2">
        <BookMarked className="h-3 w-3 text-primary" />
        <span className="font-semibold text-[10px] text-foreground truncate">
          {config.heroTitle || "School Name"}
        </span>
      </div>
      {/* Hero preview */}
      <div
        className="relative h-24 flex items-center px-4"
        style={{ backgroundColor: bgColor }}
      >
        {config.heroImages?.[0] && (
          <img
            src={config.heroImages[0]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="relative z-10">
          <p
            className="font-bold text-[11px] leading-tight"
            style={{ color: textColor }}
          >
            {config.heroTitle || "School Name"}
          </p>
          <p
            className="text-[9px] mt-0.5 opacity-80"
            style={{ color: textColor }}
          >
            {config.heroSubtitle || "Tagline"}
          </p>
          <div className="flex gap-1 mt-2">
            <div
              className="rounded px-2 py-0.5 text-[8px] font-medium"
              style={{
                backgroundColor: config.ctaButtonColor || "#c9a84c",
                color: "#fff",
              }}
            >
              {config.ctaButtonText || "Login"}
            </div>
            {(config.customLinks ?? []).slice(0, 2).map((l, i) => (
              <div
                key={String(i)}
                className="rounded px-2 py-0.5 text-[8px] border"
                style={{ borderColor: `${textColor}60`, color: textColor }}
              >
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sections */}
      {config.sections
        .filter((s) => s.isVisible)
        .slice(0, 2)
        .map((s) => (
          <div
            key={s.id}
            className="px-3 py-2 border-t border-border"
            style={s.bgColor ? { backgroundColor: s.bgColor } : {}}
          >
            <p
              className="font-semibold text-[9px]"
              style={s.textColor ? { color: s.textColor } : {}}
            >
              {s.title}
            </p>
            {s.description && (
              <p className="text-[8px] text-muted-foreground mt-0.5 line-clamp-1">
                {s.description}
              </p>
            )}
          </div>
        ))}
      {!config.isPublished && (
        <div className="px-3 py-1.5 bg-amber-50 border-t border-amber-200">
          <p className="text-[9px] text-amber-700 font-medium">
            ⚠️ Not published — visitors see minimal page
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Editor Page ───────────────────────────────────────────────────────────

export default function IndexPageEditorPage() {
  const { data: savedConfig, isLoading } = useGetIndexPageConfig();
  const saveConfig = useSaveIndexPageConfig();

  const [config, setConfig] = useState<IndexPageConfig>(EMPTY_CONFIG);
  const [dirty, setDirty] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (savedConfig) {
      setConfig(savedConfig);
      setDirty(false);
    }
  }, [savedConfig]);

  function update(partial: Partial<IndexPageConfig>) {
    setConfig((c) => ({ ...c, ...partial }));
    setDirty(true);
  }

  function updateSection(updated: IndexPageSection) {
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

  function addSection(type: string) {
    const newSection: IndexPageSection = {
      id: genId(),
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
    setAddSectionOpen(false);
    setDirty(true);
  }

  async function handleSave() {
    try {
      await saveConfig.mutateAsync(config);
      setDirty(false);
      toast.success("Landing page configuration saved");
    } catch {
      toast.error("Failed to save. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="index_editor.loading_state"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6" data-ocid="index_editor.page">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Layout className="h-6 w-6 text-primary" /> Landing Page Editor
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customise the public landing page. Changes only go live when
            published.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <span
              className="text-xs text-amber-600 font-medium px-2 py-1 bg-amber-50 border border-amber-200 rounded-md"
              data-ocid="index_editor.unsaved_indicator"
            >
              Unsaved
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            data-ocid="index_editor.preview_button"
          >
            <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saveConfig.isPending}
            data-ocid="index_editor.save_button"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            {saveConfig.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1fr_300px] gap-6">
        {/* ── Left: editor forms */}
        <div className="space-y-5">
          {/* Publish toggle */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" /> Publish Status
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {config.isPublished
                      ? "Public visitors see the full landing page."
                      : "Public visitors see only a login button. Publish to show the full page."}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={config.isPublished ? "default" : "outline"}>
                    {config.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <Switch
                    checked={config.isPublished}
                    onCheckedChange={(v) => update({ isPublished: v })}
                    data-ocid="index_editor.publish.toggle"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  H
                </span>
                Hero Section
              </CardTitle>
              <CardDescription className="text-xs">
                Title, subtitle, CTA button, background colors and images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Hero Title (School Name)</Label>
                <Input
                  value={config.heroTitle}
                  onChange={(e) => update({ heroTitle: e.target.value })}
                  placeholder="School name or main headline"
                  data-ocid="index_editor.hero_title.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Hero Subtitle / Tagline</Label>
                <Input
                  value={config.heroSubtitle}
                  onChange={(e) => update({ heroSubtitle: e.target.value })}
                  placeholder="Tagline or short description"
                  data-ocid="index_editor.hero_subtitle.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">CTA Button Text</Label>
                <Input
                  value={config.ctaButtonText}
                  onChange={(e) => update({ ctaButtonText: e.target.value })}
                  placeholder="e.g. Login to Dashboard"
                  data-ocid="index_editor.cta_text.input"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Hero Background</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.heroBgColor || "#1e3a5f"}
                      onChange={(e) => update({ heroBgColor: e.target.value })}
                      className="h-9 w-12 rounded border border-input cursor-pointer p-0.5"
                      data-ocid="index_editor.hero_bg_color.input"
                    />
                    <Input
                      value={config.heroBgColor}
                      onChange={(e) => update({ heroBgColor: e.target.value })}
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
                        update({ heroTextColor: e.target.value })
                      }
                      className="h-9 w-12 rounded border border-input cursor-pointer p-0.5"
                      data-ocid="index_editor.hero_text_color.input"
                    />
                    <Input
                      value={config.heroTextColor}
                      onChange={(e) =>
                        update({ heroTextColor: e.target.value })
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
                        update({ ctaButtonColor: e.target.value })
                      }
                      className="h-9 w-12 rounded border border-input cursor-pointer p-0.5"
                      data-ocid="index_editor.cta_color.input"
                    />
                    <Input
                      value={config.ctaButtonColor}
                      onChange={(e) =>
                        update({ ctaButtonColor: e.target.value })
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
                onChange={(url) => update({ heroImageFileId: url })}
                onRemove={() => update({ heroImageFileId: "" })}
                shape="rect"
                ocid="index_editor.hero_image.upload_button"
              />
              <HeroImagesManager
                images={config.heroImages ?? []}
                onChange={(imgs) => update({ heroImages: imgs })}
              />
            </CardContent>
          </Card>

          {/* Custom Links */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  L
                </span>
                Custom Links
              </CardTitle>
              <CardDescription className="text-xs">
                Quick-access buttons shown in the hero area (e.g. Online
                Admission, Certificate Verification)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomLinksManager
                links={config.customLinks ?? []}
                onChange={(links) => update({ customLinks: links })}
              />
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                  F
                </span>
                Feature Cards
              </CardTitle>
              <CardDescription className="text-xs">
                Cards shown in the Features section. Leave empty to use default
                cards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FeatureCardsManager
                cards={config.featureCards ?? []}
                onChange={(cards) => update({ featureCards: cards })}
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
                    Reorder, toggle visibility, and edit each page section
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddSectionOpen(true)}
                  data-ocid="index_editor.add_section.open_modal_button"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {sortedSections.length === 0 ? (
                <div
                  className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground"
                  data-ocid="index_editor.sections.empty_state"
                >
                  <Layout className="h-6 w-6 mx-auto mb-2 opacity-30" />
                  <p>No sections yet — click “Add Section” to get started.</p>
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
              data-ocid="index_editor.save_bottom.save_button"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {saveConfig.isPending ? "Saving…" : "Save Landing Page"}
            </Button>
          </div>
        </div>

        {/* ── Right: live preview */}
        <div className="hidden xl:block">
          <div className="sticky top-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Live Preview
            </p>
            <LivePreview config={config} />
            <p className="text-[10px] text-muted-foreground text-center">
              Preview updates as you edit
            </p>
          </div>
        </div>
      </div>

      {/* Add Section Dialog */}
      <Dialog open={addSectionOpen} onOpenChange={setAddSectionOpen}>
        <DialogContent
          className="max-w-sm"
          data-ocid="index_editor.add_section.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {SECTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addSection(type)}
                className="rounded-lg border border-border p-3 text-left hover:bg-muted transition-colors capitalize text-sm font-medium"
                data-ocid={`index_editor.add_section.${type}`}
              >
                {type}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          className="max-w-sm"
          data-ocid="index_editor.preview_modal"
        >
          <DialogHeader>
            <DialogTitle>Landing Page Preview</DialogTitle>
          </DialogHeader>
          <LivePreview config={config} />
          <p className="text-xs text-muted-foreground">
            {config.isPublished
              ? "✅ This page is live — visitors will see the full landing page."
              : "⚠️ Not published — visitors see only a login button until you publish."}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
