import { r as reactExports, j as jsxRuntimeExports, L as Label, l as LoaderCircle, aM as cn, e as Button } from "./index-pMBTUEbj.js";
import { I as Image } from "./image-DqsyHurY.js";
import { U as Upload } from "./upload-BicUPgyg.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
function ImageUploadField({
  label,
  value,
  onChange,
  onRemove,
  shape = "rect",
  className,
  ocid
}) {
  const fileRef = reactExports.useRef(null);
  const [error, setError] = reactExports.useState(null);
  const [uploading, setUploading] = reactExports.useState(false);
  function handleFile(file) {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG and PNG images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File must be smaller than 5 MB.");
      return;
    }
    setUploading(true);
    if (value == null ? void 0 : value.startsWith("blob:")) {
      URL.revokeObjectURL(value);
    }
    const objectUrl = URL.createObjectURL(file);
    setTimeout(() => {
      onChange(objectUrl);
      setUploading(false);
    }, 400);
  }
  function handleInputChange(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) handleFile(file);
    e.target.value = "";
  }
  function handleDrop(e) {
    var _a;
    e.preventDefault();
    const file = (_a = e.dataTransfer.files) == null ? void 0 : _a[0];
    if (file) handleFile(file);
  }
  function handleRemove() {
    if (value == null ? void 0 : value.startsWith("blob:")) URL.revokeObjectURL(value);
    onRemove == null ? void 0 : onRemove();
    onChange("");
  }
  const isAvatar = shape === "avatar";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("space-y-1.5", className), children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "relative shrink-0 border border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center",
            isAvatar ? "h-16 w-16 rounded-full" : "h-20 w-28 rounded-lg",
            value && "border-solid border-border"
          ),
          onDrop: handleDrop,
          onDragOver: (e) => e.preventDefault(),
          children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 text-muted-foreground animate-spin" }) : value ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: value,
              alt: "Preview",
              className: "h-full w-full object-cover",
              onError: (e) => {
                e.target.style.display = "none";
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-6 w-6 text-muted-foreground/50" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 pt-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => {
              var _a;
              return (_a = fileRef.current) == null ? void 0 : _a.click();
            },
            disabled: uploading,
            "data-ocid": ocid,
            className: "h-8 text-xs",
            children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }),
              "Uploading…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
              value ? "Change Image" : "Upload Image"
            ] })
          }
        ),
        value && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "sm",
            onClick: handleRemove,
            className: "h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10",
            "data-ocid": ocid ? `${ocid}_remove` : void 0,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Remove"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "JPG or PNG · max 5 MB" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", role: "alert", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileRef,
        type: "file",
        accept: "image/jpeg,image/jpg,image/png",
        className: "hidden",
        onChange: handleInputChange,
        "aria-label": label ?? "Upload image"
      }
    )
  ] });
}
export {
  ImageUploadField as I
};
