import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddStaff, useStaff, useUpdateStaff } from "@/hooks/useBackend";
import { downloadCSVString } from "@/lib/utils";
import type { Staff } from "@/types";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  RefreshCw,
  UploadCloud,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ParsedRow {
  rowNum: number;
  staffCode: string;
  fullName: string;
  designation: string;
  department: string;
  mobile: string;
  email: string;
  dateOfJoining: string;
  basicSalary: number;
  gender: "Male" | "Female" | "Other";
}

interface ImportResult {
  rowNum: number;
  staffCode: string;
  fullName: string;
  status: "added" | "updated" | "failed";
  error?: string;
}

type ImportPhase = "idle" | "preview" | "importing" | "done";

const SAMPLE_TEMPLATE_CSV = [
  "Employee ID,Full Name,Designation,Department,Mobile,Email,Date of Joining (dd/mm/yyyy),Basic Salary,Gender",
  "ST001,Ramesh Mishra,PGT Science,Science,9876543210,ramesh@school.in,01/07/2020,35000,Male",
  "ST002,Sunita Verma,TGT Maths,Mathematics,9123456780,sunita@school.in,15/06/2022,28000,Female",
  "ST003,Anil Sharma,Admin Officer,Administration,9000011111,anil@school.in,10/03/2019,22000,Male",
].join("\n");

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function normaliseDate(raw: string): string {
  if (!raw) return "";
  // Accept dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd
  const dmY = raw.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
  if (dmY)
    return `${dmY[1].padStart(2, "0")}/${dmY[2].padStart(2, "0")}/${dmY[3]}`;
  const Ymd = raw.match(/^(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})$/);
  if (Ymd)
    return `${Ymd[3].padStart(2, "0")}/${Ymd[2].padStart(2, "0")}/${Ymd[1]}`;
  return raw;
}

function parseFile(text: string): ParsedRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  // Skip header
  return lines.slice(1).map((line, idx) => {
    const cols = parseCSVLine(line);
    return {
      rowNum: idx + 2,
      staffCode: cols[0] ?? "",
      fullName: cols[1] ?? "",
      designation: cols[2] ?? "",
      department: cols[3] ?? "",
      mobile: cols[4] ?? "",
      email: cols[5] ?? "",
      dateOfJoining: normaliseDate(cols[6] ?? ""),
      basicSalary: Number.parseInt(cols[7] ?? "0") || 0,
      gender: (["Male", "Female", "Other"].includes(cols[8] ?? "")
        ? cols[8]
        : "Male") as "Male" | "Female" | "Other",
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

export function StaffImportDialog({ open, onClose, onDone }: Props) {
  const { data: existingStaff = [] } = useStaff();
  const addStaff = useAddStaff();
  const updateStaff = useUpdateStaff();

  const [phase, setPhase] = useState<ImportPhase>("idle");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [results, setResults] = useState<ImportResult[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const staff = existingStaff as Staff[];

  function reset() {
    setPhase("idle");
    setRows([]);
    setFileName("");
    setProgress({ done: 0, total: 0 });
    setResults([]);
    setIsDragging(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function processFile(file: File) {
    const text = await file.text();
    const parsed = parseFile(text);
    if (parsed.length === 0) {
      toast.error("No data rows found. Check the file format.");
      return;
    }
    setFileName(file.name);
    setRows(parsed);
    setPhase("preview");
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  async function runImport(rowsToImport: ParsedRow[], retrying = false) {
    setPhase("importing");
    setProgress({ done: 0, total: rowsToImport.length });
    if (!retrying) setResults([]);

    const batch: ImportResult[] = [];

    for (let i = 0; i < rowsToImport.length; i++) {
      const row = rowsToImport[i];
      setProgress({ done: i, total: rowsToImport.length });

      const existing = staff.find(
        (s) => s.staffCode.toLowerCase() === row.staffCode.toLowerCase(),
      );

      // Retry up to 2 extra times on failure
      let lastError = "";
      let succeeded = false;
      let wasUpdate = !!existing;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const payload = {
            staffCode: row.staffCode || `TCH${Date.now()}`,
            fullName: row.fullName,
            designation: row.designation || "Staff",
            department: row.department || "Administration",
            mobile: row.mobile,
            email: row.email,
            address: "",
            dateOfJoining: row.dateOfJoining,
            basicSalary: row.basicSalary,
          };
          if (existing) {
            await updateStaff.mutateAsync({ id: existing.id, ...payload });
          } else {
            await addStaff.mutateAsync(payload);
          }
          succeeded = true;
          break;
        } catch (err) {
          lastError = err instanceof Error ? err.message : "Unknown error";
          if (attempt < 2) await new Promise((r) => setTimeout(r, 600));
        }
      }

      batch.push({
        rowNum: row.rowNum,
        staffCode: row.staffCode,
        fullName: row.fullName,
        status: succeeded ? (wasUpdate ? "updated" : "added") : "failed",
        error: succeeded ? undefined : lastError,
      });
    }

    setProgress({ done: rowsToImport.length, total: rowsToImport.length });
    if (retrying) {
      // Merge retry results back
      setResults((prev) => {
        const map = new Map(prev.map((r) => [r.rowNum, r]));
        for (const b of batch) map.set(b.rowNum, b);
        return Array.from(map.values()).sort((a, b) => a.rowNum - b.rowNum);
      });
    } else {
      setResults(batch);
    }
    setPhase("done");
    onDone();
  }

  function retryFailed() {
    const failedRowNums = new Set(
      results.filter((r) => r.status === "failed").map((r) => r.rowNum),
    );
    const toRetry = rows.filter((r) => failedRowNums.has(r.rowNum));
    runImport(toRetry, true);
  }

  function downloadFailedRows() {
    const failed = results.filter((r) => r.status === "failed");
    const failedRowNums = new Set(failed.map((r) => r.rowNum));
    const failedData = rows.filter((r) => failedRowNums.has(r.rowNum));
    const header =
      "Employee ID,Full Name,Designation,Department,Mobile,Email,Date of Joining,Basic Salary,Error";
    const csvRows = failedData.map((r) => {
      const err = results.find((res) => res.rowNum === r.rowNum)?.error ?? "";
      return [
        r.staffCode,
        r.fullName,
        r.designation,
        r.department,
        r.mobile,
        r.email,
        r.dateOfJoining,
        r.basicSalary,
        `"${err}"`,
      ].join(",");
    });
    downloadCSVString(
      [header, ...csvRows].join("\n"),
      "staff-import-failed.csv",
    );
  }

  const addedCount = results.filter((r) => r.status === "added").length;
  const updatedCount = results.filter((r) => r.status === "updated").length;
  const failedCount = results.filter((r) => r.status === "failed").length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        data-ocid="hr.import_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud className="size-5 text-primary" />
            Bulk Staff Import
          </DialogTitle>
        </DialogHeader>

        {/* Download template link always visible */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-lg px-3 py-2 bg-muted/30">
          <FileText className="size-4 shrink-0" />
          <span>File must be CSV (.csv). Columns must match the template.</span>
          <button
            type="button"
            onClick={() =>
              downloadCSVString(
                SAMPLE_TEMPLATE_CSV,
                "staff-import-template.csv",
              )
            }
            className="ml-auto flex items-center gap-1 text-primary hover:underline font-medium"
            data-ocid="hr.import_download_template"
          >
            <Download className="size-3.5" /> Download Template
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* ── IDLE: drop zone ── */}
          {phase === "idle" && (
            <button
              type="button"
              className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-14 transition-colors cursor-pointer bg-transparent ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/20"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              data-ocid="hr.import_dropzone"
            >
              <UploadCloud className="size-10 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium text-foreground">
                  Drop CSV file here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse — .csv, .txt
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileInput}
              />
            </button>
          )}

          {/* ── PREVIEW ── */}
          {phase === "preview" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="size-4 text-primary" />
                  <span className="font-medium">{fileName}</span>
                  <span className="text-muted-foreground">
                    — {rows.length} row{rows.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="hr.import_clear_file"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">
                          Row
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">
                          Emp ID
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">
                          Designation
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">
                          Dept
                        </th>
                        <th className="px-3 py-2 text-left font-semibold text-foreground">
                          Mobile
                        </th>
                        <th className="px-3 py-2 text-right font-semibold text-foreground">
                          Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 10).map((r) => {
                        const isDupe = staff.some(
                          (s) =>
                            s.staffCode.toLowerCase() ===
                            r.staffCode.toLowerCase(),
                        );
                        return (
                          <tr
                            key={r.rowNum}
                            className="border-t border-border hover:bg-muted/20"
                          >
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {r.rowNum}
                            </td>
                            <td className="px-3 py-1.5 font-mono">
                              {r.staffCode}
                              {isDupe && (
                                <span className="ml-1 text-amber-600 text-[10px] font-semibold">
                                  UPDATE
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-1.5 font-medium">
                              {r.fullName}
                            </td>
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {r.designation}
                            </td>
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {r.department}
                            </td>
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {r.mobile}
                            </td>
                            <td className="px-3 py-1.5 text-right">
                              ₹{r.basicSalary.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {rows.length > 10 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30 border-t border-border">
                    Showing first 10 rows — {rows.length - 10} more will be
                    imported
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Rows with existing Employee IDs will be{" "}
                <span className="text-amber-600 font-semibold">updated</span>.
                New IDs will be{" "}
                <span className="text-green-600 font-semibold">added</span>.
              </p>
            </div>
          )}

          {/* ── IMPORTING ── */}
          {phase === "importing" && (
            <div
              className="flex flex-col items-center gap-5 py-10"
              data-ocid="hr.import_loading_state"
            >
              <Loader2 className="size-10 text-primary animate-spin" />
              <div className="text-center">
                <p className="font-medium text-foreground">Importing staff…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {progress.done} / {progress.total} processed
                </p>
              </div>
              <div className="w-full max-w-xs bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* ── DONE ── */}
          {phase === "done" && (
            <div className="space-y-4" data-ocid="hr.import_success_state">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-green-500/10 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {addedCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Added</p>
                </div>
                <div className="rounded-lg border border-border bg-amber-500/10 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-amber-600">
                    {updatedCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Updated
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-destructive/10 px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-destructive">
                    {failedCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Failed</p>
                </div>
              </div>

              {/* Detailed results */}
              {results.length > 0 && (
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-y-auto max-h-52">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">
                            Row
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Emp ID
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Name
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Status
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Note
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map((r) => (
                          <tr key={r.rowNum} className="border-t border-border">
                            <td className="px-3 py-1.5 text-muted-foreground">
                              {r.rowNum}
                            </td>
                            <td className="px-3 py-1.5 font-mono">
                              {r.staffCode}
                            </td>
                            <td className="px-3 py-1.5">{r.fullName}</td>
                            <td className="px-3 py-1.5">
                              {r.status === "added" && (
                                <span className="flex items-center gap-1 text-green-600 font-semibold">
                                  <CheckCircle2 className="size-3" /> Added
                                </span>
                              )}
                              {r.status === "updated" && (
                                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                                  <RefreshCw className="size-3" /> Updated
                                </span>
                              )}
                              {r.status === "failed" && (
                                <span className="flex items-center gap-1 text-destructive font-semibold">
                                  <AlertCircle className="size-3" /> Failed
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-1.5 text-muted-foreground text-[11px]">
                              {r.error ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="border-t border-border pt-3 flex-wrap gap-2">
          {phase === "idle" && (
            <Button
              variant="outline"
              onClick={handleClose}
              data-ocid="hr.import_cancel_button"
            >
              Cancel
            </Button>
          )}

          {phase === "preview" && (
            <>
              <Button
                variant="outline"
                onClick={reset}
                data-ocid="hr.import_back_button"
              >
                Back
              </Button>
              <Button
                onClick={() => runImport(rows)}
                data-ocid="hr.import_submit_button"
              >
                <UploadCloud className="size-4 mr-1.5" />
                Import All ({rows.length})
              </Button>
            </>
          )}

          {phase === "importing" && (
            <Button variant="outline" disabled>
              <Loader2 className="size-4 mr-1.5 animate-spin" /> Importing…
            </Button>
          )}

          {phase === "done" && (
            <>
              {failedCount > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadFailedRows}
                    data-ocid="hr.import_download_failed_button"
                  >
                    <Download className="size-4 mr-1.5" /> Download Failed (
                    {failedCount})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={retryFailed}
                    data-ocid="hr.import_retry_failed_button"
                  >
                    <RefreshCw className="size-4 mr-1.5" /> Retry Failed
                  </Button>
                </>
              )}
              <Button onClick={handleClose} data-ocid="hr.import_close_button">
                Done
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
