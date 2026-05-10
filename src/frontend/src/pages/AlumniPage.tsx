import DateInput from "@/components/shared/DateInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddAlumni,
  useAlumni,
  useDeleteAlumni,
  useUpdateAlumni,
} from "@/hooks/useBackend";
import { CLASS_LABELS, formatDate, generateId, getInitials } from "@/lib/utils";
import type { AlumniRecord } from "@/types";
import {
  Calendar,
  Download,
  Edit,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Users2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const BATCH_YEARS = Array.from({ length: 15 }, (_, i) => String(2025 - i));

type AlumniFormData = Omit<AlumniRecord, "id">;

const emptyForm = (): AlumniFormData => ({
  fullName: "",
  admNo: "",
  passOutYear: String(new Date().getFullYear()),
  classLevel: "Class12",
  mobile: "",
  email: "",
  careerField: "",
  currentOccupation: "",
  company: "",
  city: "",
  photoUrl: "",
  notes: "",
});

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────
function ConfirmDeleteDialog({
  open,
  name,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent
        className="max-w-sm"
        data-ocid="alumni.confirm_delete.dialog"
      >
        <DialogHeader>
          <DialogTitle>Delete Alumni Record?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{name}</strong>? This action
          cannot be undone.
        </p>
        <div className="flex gap-2 pt-2">
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onConfirm}
            data-ocid="alumni.confirm_delete.confirm_button"
          >
            Delete
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            data-ocid="alumni.confirm_delete.cancel_button"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Alumni Dialog ────────────────────────────────────────────────────────────
function AlumniDialog({
  open,
  onClose,
  record,
  onSave,
  isSaving,
}: {
  open: boolean;
  onClose: () => void;
  record: Partial<AlumniRecord> | null;
  onSave: (data: AlumniFormData & { id?: string }) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<AlumniFormData & { id?: string }>(() =>
    record?.id
      ? {
          id: record.id,
          fullName: record.fullName ?? "",
          admNo: record.admNo ?? "",
          passOutYear: record.passOutYear ?? String(new Date().getFullYear()),
          classLevel: record.classLevel ?? "Class12",
          mobile: record.mobile ?? "",
          email: record.email ?? "",
          careerField: record.careerField ?? "",
          currentOccupation: record.currentOccupation ?? "",
          company: record.company ?? "",
          city: record.city ?? "",
          photoUrl: record.photoUrl ?? "",
          notes: record.notes ?? "",
        }
      : emptyForm(),
  );

  const set = (k: keyof AlumniFormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  function handleSave() {
    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    onSave(form);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" data-ocid="alumni.record_dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            {record?.id ? "Edit Alumni Record" : "Add Alumni"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Full Name *</Label>
              <Input
                className="mt-1"
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="e.g. Rahul Sharma"
                data-ocid="alumni.name.input"
              />
            </div>
            <div>
              <Label>Admission Number</Label>
              <Input
                className="mt-1"
                value={form.admNo}
                onChange={(e) => set("admNo", e.target.value)}
                placeholder="ADM001"
                data-ocid="alumni.admno.input"
              />
            </div>
            <div>
              <Label>Graduation Year</Label>
              <Select
                value={form.passOutYear}
                onValueChange={(v) => set("passOutYear", v)}
              >
                <SelectTrigger className="mt-1" data-ocid="alumni.batch.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BATCH_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Class at Graduation</Label>
              <Select
                value={form.classLevel}
                onValueChange={(v) =>
                  set("classLevel", v as AlumniRecord["classLevel"])
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CLASS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mobile</Label>
              <Input
                className="mt-1"
                value={form.mobile}
                onChange={(e) => set("mobile", e.target.value)}
                placeholder="98XXXXXXXX"
                data-ocid="alumni.mobile.input"
              />
            </div>
            <div className="col-span-2">
              <Label>Email</Label>
              <Input
                className="mt-1"
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label>Career Field</Label>
              <Input
                className="mt-1"
                value={form.careerField}
                onChange={(e) => set("careerField", e.target.value)}
                placeholder="e.g. Engineering, Medicine"
              />
            </div>
            <div>
              <Label>Current Role</Label>
              <Input
                className="mt-1"
                value={form.currentOccupation}
                onChange={(e) => set("currentOccupation", e.target.value)}
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div>
              <Label>Company / Organization</Label>
              <Input
                className="mt-1"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="e.g. TCS, AIIMS"
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                className="mt-1"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="e.g. Bengaluru"
              />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea
                className="mt-1"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
                placeholder="Any additional notes..."
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={isSaving}
              data-ocid="alumni.record.save_button"
            >
              {isSaving ? "Saving..." : "Save Alumni"}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="alumni.record.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Alumni Events (local UI only) ────────────────────────────────────────────
interface AlumniEvent {
  id: string;
  name: string;
  date: string;
  venue: string;
  description: string;
  rsvpCount: number;
}

function EventDialog({
  open,
  onClose,
  onSave,
}: { open: boolean; onClose: () => void; onSave: (e: AlumniEvent) => void }) {
  const [form, setForm] = useState({
    name: "",
    date: "",
    venue: "",
    description: "",
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function handleSave() {
    if (!form.name || !form.date) {
      toast.error("Event name and date are required");
      return;
    }
    onSave({
      id: generateId(),
      name: form.name,
      date: form.date,
      venue: form.venue,
      description: form.description,
      rsvpCount: 0,
    });
    toast.success("Alumni event created");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm" data-ocid="alumni.event_dialog">
        <DialogHeader>
          <DialogTitle className="font-display">
            Create Alumni Event
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label>Event Name</Label>
            <Input
              className="mt-1"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Annual Alumni Meet"
              data-ocid="alumni.event_name.input"
            />
          </div>
          <div>
            <Label>Date</Label>
            <DateInput
              value={form.date}
              onChange={(iso) => set("date", iso)}
              className="mt-1"
              data-ocid="alumni.event_date.input"
            />
          </div>
          <div>
            <Label>Venue</Label>
            <Input
              className="mt-1"
              value={form.venue}
              onChange={(e) => set("venue", e.target.value)}
              placeholder="e.g. School Auditorium"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-1"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Event details..."
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={handleSave}
              data-ocid="alumni.event.submit_button"
            >
              Create Event
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="alumni.event.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AlumniPage() {
  const { data: alumni = [], isLoading } = useAlumni();
  const addAlumni = useAddAlumni();
  const updateAlumni = useUpdateAlumni();
  const deleteAlumni = useDeleteAlumni();

  const [events, setEvents] = useState<AlumniEvent[]>([]);
  const [alumniDialog, setAlumniDialog] = useState<{
    open: boolean;
    record: Partial<AlumniRecord> | null;
  }>({ open: false, record: null });
  const [eventOpen, setEventOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AlumniRecord | null>(null);
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");

  async function saveAlumni(data: AlumniFormData & { id?: string }) {
    try {
      if (data.id) {
        await updateAlumni.mutateAsync({
          ...data,
          id: data.id,
        } as AlumniRecord);
        toast.success("Alumni record updated");
      } else {
        const { id: _id, ...rest } = data;
        await addAlumni.mutateAsync(rest);
        toast.success("Alumni record added");
      }
      setAlumniDialog({ open: false, record: null });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save alumni record",
      );
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteAlumni.mutateAsync(id);
      toast.success("Alumni record deleted");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete alumni record",
      );
    } finally {
      setDeleteTarget(null);
    }
  }

  const filtered = alumni.filter((a) => {
    const matchSearch =
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.currentOccupation.toLowerCase().includes(search.toLowerCase()) ||
      (a.admNo ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBatch = batchFilter === "All" || a.passOutYear === batchFilter;
    return matchSearch && matchBatch;
  });

  const isSaving = addAlumni.isPending || updateAlumni.isPending;

  return (
    <div className="p-6 space-y-5 max-w-7xl" data-ocid="alumni.page">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users2 className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Alumni
          </h1>
          <p className="text-sm text-muted-foreground">
            Alumni directory, batch view, and events
          </p>
        </div>
        {alumni.length > 0 && (
          <Badge variant="secondary" className="ml-auto">
            {alumni.length} alumni
          </Badge>
        )}
      </div>

      <Tabs defaultValue="directory">
        <TabsList>
          <TabsTrigger value="directory" data-ocid="alumni.directory.tab">
            Directory
          </TabsTrigger>
          <TabsTrigger value="events" data-ocid="alumni.events.tab">
            Events
          </TabsTrigger>
        </TabsList>

        {/* Directory Tab */}
        <TabsContent value="directory" className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2 flex-1 max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search alumni..."
                  className="pl-8"
                  data-ocid="alumni.search_input"
                />
              </div>
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger
                  className="w-36"
                  data-ocid="alumni.batch_filter.select"
                >
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Batches</SelectItem>
                  {BATCH_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      Batch {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" data-ocid="alumni.export.button">
                <Download className="size-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={() => setAlumniDialog({ open: true, record: null })}
                data-ocid="alumni.add.open_modal_button"
              >
                <Plus className="size-4 mr-2" />
                Add Alumni
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2" data-ocid="alumni.loading_state">
              {[0, 1, 2, 3, 4].map((n) => (
                <Skeleton
                  key={`skel-${n}`}
                  className="h-14 w-full rounded-lg"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {[
                        "Alumni",
                        "Batch",
                        "Occupation",
                        "City",
                        "Mobile",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className={`px-4 py-3 font-semibold text-muted-foreground ${
                            h === "Actions" ? "text-right" : "text-left"
                          }`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a, i) => (
                      <tr
                        key={a.id}
                        className="border-b border-border/50 hover:bg-muted/20"
                        data-ocid={`alumni.item.${i + 1}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-primary">
                                {getInitials(a.fullName)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {a.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {CLASS_LABELS[a.classLevel]}
                                {a.admNo ? ` · ${a.admNo}` : ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-xs">
                            {a.passOutYear}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                          {[a.currentOccupation, a.company]
                            .filter(Boolean)
                            .join(" @ ") || "—"}
                        </td>
                        <td className="px-4 py-3">
                          {a.city ? (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MapPin className="size-3" />
                              {a.city}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {a.mobile ? (
                            <a
                              href={`tel:${a.mobile}`}
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <Phone className="size-3" />
                              {a.mobile}
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1 justify-end">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7"
                              onClick={() =>
                                setAlumniDialog({ open: true, record: a })
                              }
                              data-ocid={`alumni.edit.${i + 1}`}
                            >
                              <Edit className="size-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-7 text-destructive"
                              onClick={() => setDeleteTarget(a)}
                              data-ocid={`alumni.delete.${i + 1}`}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!isLoading && filtered.length === 0 && (
                  <div
                    className="py-12 text-center"
                    data-ocid="alumni.directory.empty_state"
                  >
                    <Users2 className="size-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-muted-foreground text-sm">
                      {alumni.length === 0
                        ? 'No alumni records yet. Click "Add Alumni" to get started.'
                        : "No alumni found matching your search"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button
              onClick={() => setEventOpen(true)}
              data-ocid="alumni.add_event.open_modal_button"
            >
              <Plus className="size-4 mr-2" />
              Create Event
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev, i) => (
              <div
                key={ev.id}
                className="rounded-xl border border-border bg-card p-5 space-y-3"
                data-ocid={`alumni.event.item.${i + 1}`}
              >
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    {ev.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    {formatDate(ev.date)}
                  </div>
                  {ev.venue && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {ev.venue}
                    </div>
                  )}
                </div>
                {ev.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ev.description}
                  </p>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <Badge variant="secondary" className="text-xs">
                    <Users2 className="size-3 mr-1" />
                    {ev.rsvpCount} RSVPs
                  </Badge>
                  <Button size="sm" variant="ghost" className="text-xs h-7">
                    Send Invite
                  </Button>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div
                className="col-span-3 py-12 text-center rounded-xl border border-border bg-card"
                data-ocid="alumni.events.empty_state"
              >
                <Calendar className="size-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-muted-foreground text-sm">
                  No events created yet. Click "Create Event" to add one.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlumniDialog
        open={alumniDialog.open}
        record={alumniDialog.record}
        onClose={() => setAlumniDialog({ open: false, record: null })}
        onSave={saveAlumni}
        isSaving={isSaving}
      />
      <EventDialog
        open={eventOpen}
        onClose={() => setEventOpen(false)}
        onSave={(e) => setEvents((p) => [e, ...p])}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        name={deleteTarget?.fullName ?? ""}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
