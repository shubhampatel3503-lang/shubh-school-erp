import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  type ClassTimetableData,
  type TimetablePeriodConfig,
  buildDefaultPeriodConfigs,
  computeEndTime,
  useUpdateClassTimetable,
} from "@/hooks/useTimetable";
import { Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  timetable: ClassTimetableData;
  onTimetableChange?: (updated: ClassTimetableData) => void;
}

export function PeriodConfigPanel({ timetable, onTimetableChange }: Props) {
  const updateTimetable = useUpdateClassTimetable();
  const [configs, setConfigs] = useState<TimetablePeriodConfig[]>(() =>
    timetable.periodConfigs.length
      ? [...timetable.periodConfigs]
      : buildDefaultPeriodConfigs(8, "08:00", 45),
  );
  const [dirty, setDirty] = useState(false);

  const update = (idx: number, patch: Partial<TimetablePeriodConfig>) => {
    setConfigs((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    );
    setDirty(true);
  };

  const addPeriod = () => {
    const last = configs[configs.length - 1];
    const lastStart = last?.startTime ?? "08:00";
    const lastDur = last?.durationMinutes ?? 45;
    const [h, m] = lastStart.split(":").map(Number);
    const nextMins = h * 60 + m + lastDur;
    const nh = Math.floor(nextMins / 60);
    const nm = nextMins % 60;
    const nextNum = Math.max(...configs.map((c) => c.periodNumber), 0) + 1;
    setConfigs((prev) => [
      ...prev,
      {
        periodNumber: nextNum,
        startTime: `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`,
        durationMinutes: 45,
        isInterval: false,
      },
    ]);
    setDirty(true);
  };

  const addInterval = () => {
    const last = configs[configs.length - 1];
    const lastStart = last?.startTime ?? "10:30";
    const lastDur = last?.durationMinutes ?? 45;
    const [h, m] = lastStart.split(":").map(Number);
    const nextMins = h * 60 + m + lastDur;
    const nh = Math.floor(nextMins / 60);
    const nm = nextMins % 60;
    // Use fractional number to not collide with period numbers
    const existing = configs.filter((c) => c.isInterval).length + 1;
    setConfigs((prev) => [
      ...prev,
      {
        periodNumber: -existing, // negative = interval slot
        startTime: `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`,
        durationMinutes: 15,
        isInterval: true,
        label: "Break",
      },
    ]);
    setDirty(true);
  };

  const remove = (idx: number) => {
    setConfigs((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const resetDefaults = () => {
    const fresh = buildDefaultPeriodConfigs(8, "08:00", 45);
    setConfigs(fresh);
    setDirty(true);
  };

  const handleSave = async () => {
    const updated: ClassTimetableData = {
      ...timetable,
      periodConfigs: configs,
    };
    try {
      await updateTimetable.mutateAsync({
        id: timetable.id,
        timetable: updated,
      });
      onTimetableChange?.(updated);
      setDirty(false);
      toast.success("Period configuration saved.");
    } catch {
      toast.error("Failed to save period configuration.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Period Configuration</h3>
          <p className="text-xs text-muted-foreground">
            Set different durations per period. Mark intervals as breaks.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={resetDefaults}
            data-ocid="period-config.reset_button"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Defaults
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={!dirty || updateTimetable.isPending}
            data-ocid="period-config.save_button"
          >
            <Save className="h-3.5 w-3.5 mr-1" /> Save
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {configs.map((cfg, idx) => (
          <div
            key={`${cfg.periodNumber}-${idx}`}
            className={`flex items-end gap-2 p-2 rounded-lg border ${
              cfg.isInterval
                ? "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                : "bg-card border-border"
            }`}
          >
            {/* Type badge */}
            <div className="flex flex-col gap-1 w-20 flex-shrink-0">
              <Badge
                variant={cfg.isInterval ? "secondary" : "outline"}
                className="text-[10px] px-1.5 py-0 self-start"
              >
                {cfg.isInterval ? "Break" : `P${cfg.periodNumber}`}
              </Badge>
            </div>

            {/* Label (for intervals) */}
            {cfg.isInterval && (
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Label</Label>
                <Input
                  value={cfg.label ?? "Break"}
                  onChange={(e) => update(idx, { label: e.target.value })}
                  className="h-7 text-xs w-24"
                  data-ocid={`period-config.label_input.${idx}`}
                />
              </div>
            )}

            {/* Start time */}
            <div className="flex flex-col gap-1">
              <Label className="text-[10px]">Start Time</Label>
              <Input
                type="time"
                value={cfg.startTime}
                onChange={(e) => update(idx, { startTime: e.target.value })}
                className="h-7 text-xs w-28"
                data-ocid={`period-config.start_input.${idx}`}
              />
            </div>

            {/* Duration */}
            <div className="flex flex-col gap-1">
              <Label className="text-[10px]">Duration (min)</Label>
              <Input
                type="number"
                min={5}
                max={120}
                value={cfg.durationMinutes}
                onChange={(e) =>
                  update(idx, { durationMinutes: Number(e.target.value) })
                }
                className="h-7 text-xs w-20"
                data-ocid={`period-config.duration_input.${idx}`}
              />
            </div>

            {/* End time preview */}
            {cfg.startTime && (
              <div className="flex flex-col gap-1">
                <Label className="text-[10px]">Ends</Label>
                <div className="h-7 flex items-center text-xs text-muted-foreground">
                  {computeEndTime(cfg.startTime, cfg.durationMinutes)}
                </div>
              </div>
            )}

            {/* Is interval toggle */}
            <div className="flex flex-col gap-1 items-center">
              <Label className="text-[10px]">Break?</Label>
              <Switch
                checked={cfg.isInterval}
                onCheckedChange={(v) => update(idx, { isInterval: v })}
                data-ocid={`period-config.interval_switch.${idx}`}
              />
            </div>

            {/* Remove */}
            <button
              type="button"
              aria-label="Remove period"
              onClick={() => remove(idx)}
              className="mb-0.5 p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
              data-ocid={`period-config.delete_button.${idx}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addPeriod}
          data-ocid="period-config.add_period_button"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Period
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addInterval}
          data-ocid="period-config.add_break_button"
        >
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Break
        </Button>
      </div>
    </div>
  );
}
