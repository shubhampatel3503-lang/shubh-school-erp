import { cZ as useGetIndexPageConfig, c_ as useSaveIndexPageConfig, r as reactExports, j as jsxRuntimeExports, e as Button, d0 as Eye, cY as Globe, t as Badge, L as Label, I as Input, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, F as ue, c$ as EyeOff, dN as BookMarked } from "./index-pMBTUEbj.js";
import { I as ImageUploadField } from "./ImageUploadField-BvVIDeMZ.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, d as CardDescription } from "./card-r-j30wiQ.js";
import { S as Switch } from "./switch-CzdiPi9K.js";
import { T as Textarea } from "./textarea-CDK2p2Hu.js";
import { P as PanelsTopLeft, I as Images } from "./panels-top-left-qY-D8_28.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { U as Upload } from "./upload-BicUPgyg.js";
import { L as Link2 } from "./link-2-CVZXb_90.js";
import { G as GripVertical } from "./grip-vertical-CWSfxBAQ.js";
import { a as ChevronUp, C as ChevronDown } from "./index-Nv6ob_Pe.js";
import "./image-DqsyHurY.js";
const SECTION_TYPES = [
  "features",
  "about",
  "contact",
  "testimonials",
  "custom"
];
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
  "Globe"
];
const SUGGESTED_LINKS = [
  { label: "Online Admission", url: "#admission", isExternal: false },
  { label: "Certificate Verification", url: "#verify", isExternal: false },
  { label: "Student Portal", url: "/login", isExternal: false },
  {
    label: "School Website",
    url: "https://yourschool.edu.in",
    isExternal: true
  }
];
const EMPTY_CONFIG = {
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
  isPublished: false
};
function genId() {
  return `item-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
}
function HeroImagesManager({
  images,
  onChange
}) {
  const fileRef = reactExports.useRef(null);
  function handleFile(file) {
    const url = URL.createObjectURL(file);
    onChange([...images, url]);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Images, { className: "h-3.5 w-3.5" }),
      " Slider Images"
    ] }),
    images.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: images.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative group rounded-lg overflow-hidden w-24 h-16 border border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src,
              alt: `Slide ${i + 1}`,
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Remove",
              onClick: () => onChange(images.filter((_, j) => j !== i)),
              className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-white" })
            }
          )
        ]
      },
      src + String(i)
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: () => {
          var _a;
          return (_a = fileRef.current) == null ? void 0 : _a.click();
        },
        "data-ocid": "index_editor.slider_image.upload_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
          " Add Slide Image"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "file",
        ref: fileRef,
        accept: "image/*",
        className: "hidden",
        onChange: (e) => {
          var _a;
          const f = (_a = e.target.files) == null ? void 0 : _a[0];
          if (f) handleFile(f);
          e.target.value = "";
        }
      }
    )
  ] });
}
function SectionEditor({
  section,
  index,
  total,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border rounded-lg bg-card overflow-hidden",
      "data-ocid": `index_editor.section.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs shrink-0 capitalize", children: section.sectionType }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground flex-1 truncate min-w-0", children: section.title || "(untitled)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Move up",
                disabled: index === 0,
                onClick: () => onMoveUp(index),
                className: "p-1 rounded hover:bg-muted disabled:opacity-30",
                "data-ocid": `index_editor.section.move_up.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Move down",
                disabled: index === total - 1,
                onClick: () => onMoveDown(index),
                className: "p-1 rounded hover:bg-muted disabled:opacity-30",
                "data-ocid": `index_editor.section.move_down.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": section.isVisible ? "Hide" : "Show",
                onClick: () => onChange({ ...section, isVisible: !section.isVisible }),
                className: "p-1 rounded hover:bg-muted",
                "data-ocid": `index_editor.section.toggle.${index + 1}`,
                children: section.isVisible ? /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-3.5 w-3.5 text-muted-foreground" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": expanded ? "Collapse" : "Edit",
                onClick: () => setExpanded((v) => !v),
                className: "p-1 rounded hover:bg-muted",
                "data-ocid": `index_editor.section.edit_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  ChevronDown,
                  {
                    className: `h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Delete",
                onClick: () => onDelete(section.id),
                className: "p-1 rounded hover:bg-destructive/10 text-destructive",
                "data-ocid": `index_editor.section.delete_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border px-3 py-3 space-y-3 bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Section Title" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: section.title,
                  onChange: (e) => onChange({ ...section, title: e.target.value }),
                  placeholder: "Section title",
                  className: "h-8 text-sm",
                  "data-ocid": `index_editor.section.title.${index + 1}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Section Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  className: "w-full h-8 rounded-md border border-input bg-background px-3 text-sm",
                  value: section.sectionType,
                  onChange: (e) => onChange({ ...section, sectionType: e.target.value }),
                  "data-ocid": `index_editor.section.type.${index + 1}`,
                  children: SECTION_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, className: "capitalize", children: t }, t))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 2,
                value: section.description,
                onChange: (e) => onChange({ ...section, description: e.target.value }),
                placeholder: "Section description",
                className: "text-sm resize-none",
                "data-ocid": `index_editor.section.description.${index + 1}`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Background Color" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: section.bgColor || "#ffffff",
                    onChange: (e) => onChange({ ...section, bgColor: e.target.value }),
                    className: "h-8 w-10 rounded border border-input cursor-pointer p-0.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: section.bgColor,
                    onChange: (e) => onChange({ ...section, bgColor: e.target.value }),
                    placeholder: "#ffffff",
                    className: "h-8 text-sm"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Text Color" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: section.textColor || "#000000",
                    onChange: (e) => onChange({ ...section, textColor: e.target.value }),
                    className: "h-8 w-10 rounded border border-input cursor-pointer p-0.5"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: section.textColor,
                    onChange: (e) => onChange({ ...section, textColor: e.target.value }),
                    placeholder: "#000000",
                    className: "h-8 text-sm"
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function CustomLinksManager({
  links,
  onChange
}) {
  function addLink(suggested) {
    const newLink = {
      label: (suggested == null ? void 0 : suggested.label) ?? "New Link",
      url: (suggested == null ? void 0 : suggested.url) ?? "",
      isExternal: (suggested == null ? void 0 : suggested.isExternal) ?? false,
      order: links.length
    };
    onChange([...links, newLink]);
  }
  function updateLink(index, updated) {
    onChange(links.map((l, i) => i === index ? updated : l));
  }
  function removeLink(index) {
    onChange(links.filter((_, i) => i !== index));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    links.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border border-dashed border-border py-6 text-center",
        "data-ocid": "index_editor.links.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-6 w-6 mx-auto mb-2 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No custom links yet" })
        ]
      }
    ),
    links.map((link, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 p-3 rounded-lg border border-border bg-card",
        "data-ocid": `index_editor.link.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Label" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: link.label,
                  onChange: (e) => updateLink(i, { ...link, label: e.target.value }),
                  placeholder: "e.g. Online Admission",
                  className: "h-8 text-sm",
                  "data-ocid": `index_editor.link.label.${i + 1}`
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: link.url,
                  onChange: (e) => updateLink(i, { ...link, url: e.target.value }),
                  placeholder: "https://... or /path",
                  className: "h-8 text-sm",
                  "data-ocid": `index_editor.link.url.${i + 1}`
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-1.5 cursor-pointer",
                htmlFor: `link-external-${i}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Switch,
                    {
                      checked: link.isExternal,
                      onCheckedChange: (v) => updateLink(i, { ...link, isExternal: v }),
                      "data-ocid": `index_editor.link.external.${i + 1}`
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "New tab" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "aria-label": "Remove link",
                onClick: () => removeLink(i),
                className: "p-1 rounded hover:bg-destructive/10 text-destructive",
                "data-ocid": `index_editor.link.delete_button.${i + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] })
        ]
      },
      String(i)
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: () => addLink(),
          "data-ocid": "index_editor.link.add_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
            " Add Link"
          ]
        }
      ),
      SUGGESTED_LINKS.filter(
        (s) => !links.some((l) => l.label === s.label)
      ).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          className: "text-xs text-muted-foreground h-7",
          onClick: () => addLink(s),
          "data-ocid": `index_editor.link.suggest.${s.label.replace(/\s+/g, "_").toLowerCase()}`,
          children: [
            "+ ",
            s.label
          ]
        },
        s.label
      ))
    ] })
  ] });
}
function FeatureCardsManager({
  cards,
  onChange
}) {
  function addCard() {
    onChange([
      ...cards,
      {
        id: genId(),
        icon: "Star",
        title: "New Feature",
        description: "",
        order: cards.length
      }
    ]);
  }
  function updateCard(id, updated) {
    onChange(cards.map((c) => c.id === id ? updated : c));
  }
  function removeCard(id) {
    onChange(cards.filter((c) => c.id !== id));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    cards.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground",
        "data-ocid": "index_editor.features.empty_state",
        children: "Default feature cards will be shown. Add custom cards to override."
      }
    ),
    cards.map((card, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-[80px_1fr_1fr_auto] gap-2 items-start p-3 rounded-lg border border-border bg-card",
        "data-ocid": `index_editor.feature.item.${i + 1}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Icon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "w-full h-8 rounded-md border border-input bg-background px-2 text-xs",
                value: card.icon,
                onChange: (e) => updateCard(card.id, { ...card, icon: e.target.value }),
                "data-ocid": `index_editor.feature.icon.${i + 1}`,
                children: ICON_OPTIONS.map((ic) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ic, children: ic }, ic))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: card.title,
                onChange: (e) => updateCard(card.id, { ...card, title: e.target.value }),
                placeholder: "Feature title",
                className: "h-8 text-sm",
                "data-ocid": `index_editor.feature.title.${i + 1}`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: card.description,
                onChange: (e) => updateCard(card.id, { ...card, description: e.target.value }),
                placeholder: "Short description",
                className: "h-8 text-sm",
                "data-ocid": `index_editor.feature.desc.${i + 1}`
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": "Remove",
              onClick: () => removeCard(card.id),
              className: "mt-5 p-1 rounded hover:bg-destructive/10 text-destructive",
              "data-ocid": `index_editor.feature.delete_button.${i + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ]
      },
      card.id
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        variant: "outline",
        size: "sm",
        onClick: addCard,
        "data-ocid": "index_editor.feature.add_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
          " Add Feature Card"
        ]
      }
    )
  ] });
}
function LivePreview({ config }) {
  var _a;
  const bgColor = config.heroBgColor || "#1e3a8a";
  const textColor = config.heroTextColor || "#ffffff";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl overflow-hidden border border-border shadow-sm text-[10px]",
      "data-ocid": "index_editor.preview",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-7 bg-card border-b border-border flex items-center px-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "h-3 w-3 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-[10px] text-foreground truncate", children: config.heroTitle || "School Name" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative h-24 flex items-center px-4",
            style: { backgroundColor: bgColor },
            children: [
              ((_a = config.heroImages) == null ? void 0 : _a[0]) && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: config.heroImages[0],
                  alt: "",
                  className: "absolute inset-0 w-full h-full object-cover opacity-40"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "font-bold text-[11px] leading-tight",
                    style: { color: textColor },
                    children: config.heroTitle || "School Name"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-[9px] mt-0.5 opacity-80",
                    style: { color: textColor },
                    children: config.heroSubtitle || "Tagline"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 mt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "rounded px-2 py-0.5 text-[8px] font-medium",
                      style: {
                        backgroundColor: config.ctaButtonColor || "#c9a84c",
                        color: "#fff"
                      },
                      children: config.ctaButtonText || "Login"
                    }
                  ),
                  (config.customLinks ?? []).slice(0, 2).map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "rounded px-2 py-0.5 text-[8px] border",
                      style: { borderColor: `${textColor}60`, color: textColor },
                      children: l.label
                    },
                    String(i)
                  ))
                ] })
              ] })
            ]
          }
        ),
        config.sections.filter((s) => s.isVisible).slice(0, 2).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-t border-border",
            style: s.bgColor ? { backgroundColor: s.bgColor } : {},
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "font-semibold text-[9px]",
                  style: s.textColor ? { color: s.textColor } : {},
                  children: s.title
                }
              ),
              s.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] text-muted-foreground mt-0.5 line-clamp-1", children: s.description })
            ]
          },
          s.id
        )),
        !config.isPublished && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-1.5 bg-amber-50 border-t border-amber-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-amber-700 font-medium", children: "⚠️ Not published — visitors see minimal page" }) })
      ]
    }
  );
}
function IndexPageEditorPage() {
  const { data: savedConfig, isLoading } = useGetIndexPageConfig();
  const saveConfig = useSaveIndexPageConfig();
  const [config, setConfig] = reactExports.useState(EMPTY_CONFIG);
  const [dirty, setDirty] = reactExports.useState(false);
  const [addSectionOpen, setAddSectionOpen] = reactExports.useState(false);
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (savedConfig) {
      setConfig(savedConfig);
      setDirty(false);
    }
  }, [savedConfig]);
  function update(partial) {
    setConfig((c) => ({ ...c, ...partial }));
    setDirty(true);
  }
  function updateSection(updated) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.map((s) => s.id === updated.id ? updated : s)
    }));
    setDirty(true);
  }
  function deleteSection(id) {
    setConfig((c) => ({
      ...c,
      sections: c.sections.filter((s) => s.id !== id)
    }));
    setDirty(true);
  }
  function moveSection(index, dir) {
    setConfig((c) => {
      const arr = [...c.sections];
      const target = dir === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= arr.length) return c;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return { ...c, sections: arr.map((s, i) => ({ ...s, order: i + 1 })) };
    });
    setDirty(true);
  }
  function addSection(type) {
    const newSection = {
      id: genId(),
      sectionType: type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: "",
      imageFileId: "",
      bgColor: "",
      textColor: "",
      isVisible: true,
      order: config.sections.length + 1
    };
    setConfig((c) => ({ ...c, sections: [...c.sections, newSection] }));
    setAddSectionOpen(false);
    setDirty(true);
  }
  async function handleSave() {
    try {
      await saveConfig.mutateAsync(config);
      setDirty(false);
      ue.success("Landing page configuration saved");
    } catch {
      ue.error("Failed to save. Please try again.");
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center py-20",
        "data-ocid": "index_editor.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" })
      }
    );
  }
  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "index_editor.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PanelsTopLeft, { className: "h-6 w-6 text-primary" }),
          " Landing Page Editor"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Customise the public landing page. Changes only go live when published." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        dirty && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-xs text-amber-600 font-medium px-2 py-1 bg-amber-50 border border-amber-200 rounded-md",
            "data-ocid": "index_editor.unsaved_indicator",
            children: "Unsaved"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setPreviewOpen(true),
            "data-ocid": "index_editor.preview_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 mr-1.5" }),
              " Preview"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: handleSave,
            disabled: saveConfig.isPending,
            "data-ocid": "index_editor.save_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1.5" }),
              saveConfig.isPending ? "Saving…" : "Save"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid xl:grid-cols-[1fr_300px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-sm text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-primary" }),
              " Publish Status"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: config.isPublished ? "Public visitors see the full landing page." : "Public visitors see only a login button. Publish to show the full page." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: config.isPublished ? "default" : "outline", children: config.isPublished ? "Published" : "Draft" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: config.isPublished,
                onCheckedChange: (v) => update({ isPublished: v }),
                "data-ocid": "index_editor.publish.toggle"
              }
            )
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary", children: "H" }),
              "Hero Section"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Title, subtitle, CTA button, background colors and images" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Hero Title (School Name)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: config.heroTitle,
                  onChange: (e) => update({ heroTitle: e.target.value }),
                  placeholder: "School name or main headline",
                  "data-ocid": "index_editor.hero_title.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Hero Subtitle / Tagline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: config.heroSubtitle,
                  onChange: (e) => update({ heroSubtitle: e.target.value }),
                  placeholder: "Tagline or short description",
                  "data-ocid": "index_editor.hero_subtitle.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "CTA Button Text" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: config.ctaButtonText,
                  onChange: (e) => update({ ctaButtonText: e.target.value }),
                  placeholder: "e.g. Login to Dashboard",
                  "data-ocid": "index_editor.cta_text.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Hero Background" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "color",
                      value: config.heroBgColor || "#1e3a5f",
                      onChange: (e) => update({ heroBgColor: e.target.value }),
                      className: "h-9 w-12 rounded border border-input cursor-pointer p-0.5",
                      "data-ocid": "index_editor.hero_bg_color.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: config.heroBgColor,
                      onChange: (e) => update({ heroBgColor: e.target.value }),
                      placeholder: "#1e3a5f",
                      className: "h-9 text-sm"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Hero Text Color" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "color",
                      value: config.heroTextColor || "#ffffff",
                      onChange: (e) => update({ heroTextColor: e.target.value }),
                      className: "h-9 w-12 rounded border border-input cursor-pointer p-0.5",
                      "data-ocid": "index_editor.hero_text_color.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: config.heroTextColor,
                      onChange: (e) => update({ heroTextColor: e.target.value }),
                      placeholder: "#ffffff",
                      className: "h-9 text-sm"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "CTA Button Color" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "color",
                      value: config.ctaButtonColor || "#c9a84c",
                      onChange: (e) => update({ ctaButtonColor: e.target.value }),
                      className: "h-9 w-12 rounded border border-input cursor-pointer p-0.5",
                      "data-ocid": "index_editor.cta_color.input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: config.ctaButtonColor,
                      onChange: (e) => update({ ctaButtonColor: e.target.value }),
                      placeholder: "#c9a84c",
                      className: "h-9 text-sm"
                    }
                  )
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ImageUploadField,
              {
                label: "Hero Background Image (fallback)",
                value: config.heroImageFileId,
                onChange: (url) => update({ heroImageFileId: url }),
                onRemove: () => update({ heroImageFileId: "" }),
                shape: "rect",
                ocid: "index_editor.hero_image.upload_button"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HeroImagesManager,
              {
                images: config.heroImages ?? [],
                onChange: (imgs) => update({ heroImages: imgs })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary", children: "L" }),
              "Custom Links"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Quick-access buttons shown in the hero area (e.g. Online Admission, Certificate Verification)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            CustomLinksManager,
            {
              links: config.customLinks ?? [],
              onChange: (links) => update({ customLinks: links })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary", children: "F" }),
              "Feature Cards"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs", children: "Cards shown in the Features section. Leave empty to use default cards." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            FeatureCardsManager,
            {
              cards: config.featureCards ?? [],
              onChange: (cards) => update({ featureCards: cards })
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-5 w-5 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary", children: "S" }),
                "Sections Manager"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs mt-0.5", children: "Reorder, toggle visibility, and edit each page section" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => setAddSectionOpen(true),
                "data-ocid": "index_editor.add_section.open_modal_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }),
                  " Add Section"
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: sortedSections.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground",
              "data-ocid": "index_editor.sections.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PanelsTopLeft, { className: "h-6 w-6 mx-auto mb-2 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "No sections yet — click “Add Section” to get started." })
              ]
            }
          ) : sortedSections.map((section, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            SectionEditor,
            {
              section,
              index: i,
              total: sortedSections.length,
              onChange: updateSection,
              onDelete: deleteSection,
              onMoveUp: (idx) => moveSection(idx, "up"),
              onMoveDown: (idx) => moveSection(idx, "down")
            },
            section.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
          dirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-600 font-medium", children: "You have unsaved changes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleSave,
              disabled: saveConfig.isPending,
              className: "ml-auto",
              "data-ocid": "index_editor.save_bottom.save_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2" }),
                saveConfig.isPending ? "Saving…" : "Save Landing Page"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden xl:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Live Preview" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LivePreview, { config }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground text-center", children: "Preview updates as you edit" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addSectionOpen, onOpenChange: setAddSectionOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-sm",
        "data-ocid": "index_editor.add_section.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Section" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: SECTION_TYPES.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => addSection(type),
              className: "rounded-lg border border-border p-3 text-left hover:bg-muted transition-colors capitalize text-sm font-medium",
              "data-ocid": `index_editor.add_section.${type}`,
              children: type
            },
            type
          )) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: previewOpen, onOpenChange: setPreviewOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        className: "max-w-sm",
        "data-ocid": "index_editor.preview_modal",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Landing Page Preview" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LivePreview, { config }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: config.isPublished ? "✅ This page is live — visitors will see the full landing page." : "⚠️ Not published — visitors see only a login button until you publish." })
        ]
      }
    ) })
  ] });
}
export {
  IndexPageEditorPage as default
};
