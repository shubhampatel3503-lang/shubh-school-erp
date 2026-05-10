import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  CheckCircle2,
  CreditCard,
  Fingerprint,
  QrCode,
  ScanFace,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AttendanceSettings {
  face: boolean;
  rfid: boolean;
  essl: boolean;
  qr: boolean;
}

const SYSTEMS: {
  key: keyof AttendanceSettings;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  ocid: string;
}[] = [
  {
    key: "face",
    label: "Face Recognition",
    description:
      "Uses mobile/laptop camera to auto-identify students. No hardware needed.",
    icon: ScanFace,
    color: "text-violet-700",
    bg: "bg-violet-50",
    ocid: "settings.attendance_system.face",
  },
  {
    key: "essl",
    label: "ESSL Biometric",
    description:
      "IP-based ZKTeco/ESSL fingerprint devices. Configure IP and port in Devices settings.",
    icon: Fingerprint,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    ocid: "settings.attendance_system.essl",
  },
  {
    key: "rfid",
    label: "RFID Reader",
    description:
      "USB or IP-based RFID card readers. Students/staff tap their card to mark attendance.",
    icon: CreditCard,
    color: "text-sky-700",
    bg: "bg-sky-50",
    ocid: "settings.attendance_system.rfid",
  },
  {
    key: "qr",
    label: "QR Code Scanner",
    description:
      "Camera-based QR scanner. Students show their printed QR code to mark attendance.",
    icon: QrCode,
    color: "text-amber-700",
    bg: "bg-amber-50",
    ocid: "settings.attendance_system.qr",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 10 8"
      className="w-2.5 h-2.5 text-primary-foreground"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 4l3 3L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AttendanceSystemsSection() {
  const { actor } = useActor(createActor);
  const [settings, setSettings] = useState<AttendanceSettings>({
    face: true,
    rfid: true,
    essl: true,
    qr: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!actor) return;
      try {
        const s = await actor.getAttendanceSettings();
        setSettings({ face: s.face, rfid: s.rfid, essl: s.essl, qr: s.qr });
      } catch {
        // keep defaults
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [actor]);

  async function handleSave() {
    if (!actor) {
      toast.error("Backend not connected");
      return;
    }
    setSaving(true);
    try {
      await actor.saveAttendanceSettings(settings);
      toast.success("Attendance system settings saved");
    } catch {
      toast.error("Failed to save attendance settings");
    } finally {
      setSaving(false);
    }
  }

  function toggle(key: keyof AttendanceSettings) {
    setSettings((s) => ({ ...s, [key]: !s[key] }));
  }

  const activeCount = Object.values(settings).filter(Boolean).length;

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanFace className="h-5 w-5 text-primary" />
          Attendance Systems
        </CardTitle>
        <CardDescription>
          Choose which attendance methods are active. Inactive systems will be
          hidden from the Attendance page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading attendance settings…
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {SYSTEMS.map(
                ({ key, label, description, icon: Icon, color, bg, ocid }) => {
                  const active = settings[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      className={[
                        "w-full flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer select-none text-left",
                        active
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-muted/20 opacity-60",
                      ].join(" ")}
                      onClick={() => toggle(key)}
                      data-ocid={ocid}
                      aria-pressed={active}
                    >
                      <div
                        className={[
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                          bg,
                        ].join(" ")}
                      >
                        <Icon className={["w-4 h-4", color].join(" ")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {label}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {description}
                        </p>
                      </div>
                      <div
                        className={[
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                          active
                            ? "bg-primary border-primary"
                            : "bg-background border-muted-foreground/30",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {active && <CheckIcon />}
                      </div>
                    </button>
                  );
                },
              )}
            </div>

            {activeCount === 0 && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                ⚠️ At least one attendance system must be active.
              </p>
            )}

            <Button
              onClick={handleSave}
              disabled={saving || activeCount === 0}
              data-ocid="settings.attendance_systems.save_button"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {saving ? "Saving…" : "Save Attendance Settings"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
