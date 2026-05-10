import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface ImageUploadFieldProps {
  /** Label shown above the upload area */
  label?: string;
  /** Current image URL or object URL to preview */
  value?: string;
  /** Called with the new object URL (blob:) after a file is picked */
  onChange: (url: string) => void;
  /** Called when the image is removed */
  onRemove?: () => void;
  /** Preview shape: "rect" (default) or "avatar" */
  shape?: "rect" | "avatar";
  /** Additional class for the container */
  className?: string;
  /** data-ocid for the upload button */
  ocid?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export function ImageUploadField({
  label,
  value,
  onChange,
  onRemove,
  shape = "rect",
  className,
  ocid,
}: ImageUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleFile(file: File) {
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
    // Revoke previous blob URL to avoid memory leaks
    if (value?.startsWith("blob:")) {
      URL.revokeObjectURL(value);
    }
    const objectUrl = URL.createObjectURL(file);
    // Simulate brief upload tick for UX
    setTimeout(() => {
      onChange(objectUrl);
      setUploading(false);
    }, 400);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so picking same file fires onChange again
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleRemove() {
    if (value?.startsWith("blob:")) URL.revokeObjectURL(value);
    onRemove?.();
    onChange("");
  }

  const isAvatar = shape === "avatar";

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <Label>{label}</Label>}

      <div className="flex items-start gap-3">
        {/* Preview area */}
        <div
          className={cn(
            "relative shrink-0 border border-dashed border-border bg-muted/30 overflow-hidden flex items-center justify-center",
            isAvatar ? "h-16 w-16 rounded-full" : "h-20 w-28 rounded-lg",
            value && "border-solid border-border",
          )}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
          ) : value ? (
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-1.5 pt-0.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            data-ocid={ocid}
            className="h-8 text-xs"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {value ? "Change Image" : "Upload Image"}
              </>
            )}
          </Button>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
              data-ocid={ocid ? `${ocid}_remove` : undefined}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Remove
            </Button>
          )}

          <p className="text-xs text-muted-foreground">JPG or PNG · max 5 MB</p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="hidden"
        onChange={handleInputChange}
        aria-label={label ?? "Upload image"}
      />
    </div>
  );
}
