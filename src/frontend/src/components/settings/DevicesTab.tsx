import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DeviceConfig } from "@/hooks/useBackend";
import {
  useGetAllDeviceConfigs,
  useSaveDeviceConfig,
} from "@/hooks/useBackend";
import {
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Fingerprint,
  QrCode,
  Wifi,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Guide Accordion ──────────────────────────────────────────────────────────
function GuideAccordion({
  title,
  steps,
}: {
  title: string;
  steps: string[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
        onClick={() => setOpen((v) => !v)}
        data-ocid="device_settings.guide_toggle"
      >
        <span className="flex items-center gap-2">
          <span className="text-primary">📖</span> {title}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <ol className="px-4 py-3 space-y-1.5 bg-muted/10">
          {steps.map((step, i) => (
            <li
              key={step.slice(0, 30)}
              className="text-sm text-foreground flex gap-2"
            >
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ─── ESSL Biometric ──────────────────────────────────────────────────────────
function ESSLPanel({ saved }: { saved?: DeviceConfig }) {
  const [ip, setIp] = useState(saved?.ipAddress ?? "");
  const [port, setPort] = useState(String(saved?.port ?? 4370));
  const [deviceId, setDeviceId] = useState(saved?.deviceId ?? "");
  const [testing, setTesting] = useState(false);
  const save = useSaveDeviceConfig();

  useEffect(() => {
    if (saved) {
      setIp(saved.ipAddress ?? "");
      setPort(String(saved.port ?? 4370));
      setDeviceId(saved.deviceId ?? "");
    }
  }, [saved]);

  async function handleTest() {
    if (!ip.trim()) {
      toast.error("Enter IP address first");
      return;
    }
    setTesting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setTesting(false);
    toast.info(
      "Connection test is simulated. Actual ESSL ping requires device on the same network.",
    );
  }

  async function handleSave() {
    try {
      await save.mutateAsync({
        deviceType: "ESSLBiometric",
        ipAddress: ip.trim(),
        port: Number(port) || 4370,
        deviceId: deviceId.trim(),
        mode: "IP",
      });
      toast.success("ESSL Biometric configuration saved");
    } catch {
      toast.error("Failed to save configuration");
    }
  }

  return (
    <div className="space-y-4" data-ocid="device_settings.essl.panel">
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">IP Address</Label>
          <Input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="192.168.1.100"
            data-ocid="device_settings.essl.ip.input"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Port</Label>
          <Input
            type="number"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="4370"
            data-ocid="device_settings.essl.port.input"
          />
        </div>
        <div className="col-span-3 space-y-1">
          <Label className="text-xs">Device ID</Label>
          <Input
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="Shown on device label"
            data-ocid="device_settings.essl.device_id.input"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleTest}
          disabled={testing}
          data-ocid="device_settings.essl.test_button"
        >
          {testing ? "Testing…" : "Test Connection"}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={save.isPending}
          data-ocid="device_settings.essl.save_button"
        >
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
          {save.isPending ? "Saving…" : "Save"}
        </Button>
      </div>
      <GuideAccordion
        title="Setup Guide — ESSL Biometric"
        steps={[
          "Connect your ESSL device to the same network as this computer",
          "Note the IP address from the device display (usually 192.168.x.x)",
          "Default port is 4370. Device ID is shown on the device label",
          "Enter details above and click Save",
          "Go to Attendance › ESSL Biometric tab to record attendance",
          "The system will automatically pull IN/OUT records from the device",
        ]}
      />
    </div>
  );
}

// ─── Face Recognition ─────────────────────────────────────────────────────────
function FacePanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [permDenied, setPermDenied] = useState(false);
  const save = useSaveDeviceConfig();

  async function requestCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      for (const t of stream.getTracks()) t.stop();
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput");
      setCameras(cams);
      if (cams.length > 0) setSelectedCameraId(cams[0].deviceId);
      setPermDenied(false);
    } catch {
      setPermDenied(true);
      toast.error(
        "Camera permission denied. Please allow camera in browser settings.",
      );
    }
  }

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    if (!selectedCameraId) {
      if (videoRef.current) videoRef.current.srcObject = null;
      setStreaming(false);
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: { exact: selectedCameraId } } })
      .then((stream) => {
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreaming(true);
        }
      })
      .catch(() => {
        setStreaming(false);
      });
    return () => {
      if (currentStream) for (const t of currentStream.getTracks()) t.stop();
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [selectedCameraId]);

  async function handleSave() {
    try {
      await save.mutateAsync({
        deviceType: "Face",
        ipAddress: "",
        port: 0,
        deviceId: selectedCameraId,
        mode: "Camera",
      });
      toast.success("Face recognition camera saved");
    } catch {
      toast.error("Failed to save configuration");
    }
  }

  return (
    <div className="space-y-4" data-ocid="device_settings.face.panel">
      {cameras.length === 0 && !permDenied && (
        <Button
          type="button"
          onClick={requestCamera}
          data-ocid="device_settings.face.grant_camera_button"
        >
          <Camera className="h-4 w-4 mr-2" />
          Grant Camera Permission
        </Button>
      )}
      {permDenied && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          Camera access was denied. Please allow it in your browser's site
          settings and reload.
        </div>
      )}
      {cameras.length > 0 && (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Select Camera</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              value={selectedCameraId}
              onChange={(e) => setSelectedCameraId(e.target.value)}
              data-ocid="device_settings.face.camera.select"
            >
              {cameras.map((cam, i) => (
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          </div>
          {selectedCameraId && (
            <div className="rounded-lg overflow-hidden border border-border bg-black aspect-video max-h-48">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                data-ocid="device_settings.face.camera_preview"
              />
              {!streaming && (
                <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                  Loading camera…
                </div>
              )}
            </div>
          )}
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={save.isPending}
            data-ocid="device_settings.face.save_button"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            {save.isPending ? "Saving…" : "Save Camera Selection"}
          </Button>
        </div>
      )}
      <GuideAccordion
        title="Setup Guide — Face Recognition"
        steps={[
          'Click "Grant Camera Permission" to allow browser access to camera',
          "Select the camera (front or back) from the dropdown",
          "Go to Attendance › Face Recognition tab",
          "Students/staff faces will be scanned using the selected camera",
          "Works on any device with a camera — PC webcam, laptop, or mobile",
        ]}
      />
    </div>
  );
}

// ─── RFID Reader ─────────────────────────────────────────────────────────────
function RFIDPanel({ saved }: { saved?: DeviceConfig }) {
  const [mode, setMode] = useState<"USB" | "IP">(
    (saved?.mode as "USB" | "IP") ?? "USB",
  );
  const [ip, setIp] = useState(saved?.ipAddress ?? "");
  const [port, setPort] = useState(String(saved?.port ?? 4001));
  const save = useSaveDeviceConfig();

  useEffect(() => {
    if (saved) {
      setMode((saved.mode as "USB" | "IP") ?? "USB");
      setIp(saved.ipAddress ?? "");
      setPort(String(saved.port ?? 4001));
    }
  }, [saved]);

  async function handleSave() {
    try {
      await save.mutateAsync({
        deviceType: "RFID",
        ipAddress: mode === "IP" ? ip.trim() : "",
        port: mode === "IP" ? Number(port) || 4001 : 0,
        deviceId: "",
        mode,
      });
      toast.success("RFID configuration saved");
    } catch {
      toast.error("Failed to save configuration");
    }
  }

  return (
    <div className="space-y-4" data-ocid="device_settings.rfid.panel">
      <div className="flex gap-3">
        {(["USB", "IP"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              mode === m
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/40 text-foreground"
            }`}
            data-ocid={`device_settings.rfid.mode.${m.toLowerCase()}`}
          >
            {m === "USB" ? "USB Reader" : "IP-Based Reader"}
          </button>
        ))}
      </div>

      {mode === "USB" && (
        <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            USB RFID Reader — No Configuration Required
          </p>
          <p className="text-sm text-muted-foreground">
            Simply plug in your USB RFID reader. It works like a USB keyboard —
            when a card is scanned, the ID appears automatically in the
            attendance field.
          </p>
        </div>
      )}

      {mode === "IP" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">IP Address</Label>
            <Input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.168.1.101"
              data-ocid="device_settings.rfid.ip.input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Port</Label>
            <Input
              type="number"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="4001"
              data-ocid="device_settings.rfid.port.input"
            />
          </div>
        </div>
      )}

      <Button
        type="button"
        size="sm"
        onClick={handleSave}
        disabled={save.isPending}
        data-ocid="device_settings.rfid.save_button"
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
        {save.isPending ? "Saving…" : "Save"}
      </Button>

      <GuideAccordion
        title={
          mode === "USB" ? "Setup Guide — USB RFID" : "Setup Guide — IP RFID"
        }
        steps={
          mode === "USB"
            ? [
                "Plug in the USB RFID reader to this computer",
                'Select "USB Reader" mode above',
                "Go to Attendance › RFID tab",
                "When a student/staff scans their card, the ID auto-appears in the field",
              ]
            : [
                "Connect your IP RFID reader to the school network",
                "Enter its IP address and port above",
                "Click Save configuration",
                "Go to Attendance › RFID tab to test",
              ]
        }
      />
    </div>
  );
}

// ─── QR Code Scanner ─────────────────────────────────────────────────────────
function QRPanel({ saved }: { saved?: DeviceConfig }) {
  const [mode, setMode] = useState<"Scanner" | "Camera">(
    (saved?.mode as "Scanner" | "Camera") ?? "Scanner",
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const save = useSaveDeviceConfig();

  useEffect(() => {
    if (saved) setMode((saved.mode as "Scanner" | "Camera") ?? "Scanner");
  }, [saved]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (mode !== "Camera" || !selectedCameraId) {
      if (videoRef.current) videoRef.current.srcObject = null;
      return;
    }
    navigator.mediaDevices
      .getUserMedia({ video: { deviceId: { exact: selectedCameraId } } })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {});
    return () => {
      if (stream) for (const t of stream.getTracks()) t.stop();
    };
  }, [mode, selectedCameraId]);

  async function requestCamera() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      for (const t of s.getTracks()) t.stop();
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === "videoinput");
      setCameras(cams);
      if (cams.length > 0) setSelectedCameraId(cams[0].deviceId);
    } catch {
      toast.error("Camera permission denied.");
    }
  }

  async function handleSave() {
    try {
      await save.mutateAsync({
        deviceType: "QRCode",
        ipAddress: "",
        port: 0,
        deviceId: selectedCameraId,
        mode,
      });
      toast.success("QR Scanner configuration saved");
    } catch {
      toast.error("Failed to save configuration");
    }
  }

  return (
    <div className="space-y-4" data-ocid="device_settings.qr.panel">
      <div className="flex gap-3">
        {(["Scanner", "Camera"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              mode === m
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/40 text-foreground"
            }`}
            data-ocid={`device_settings.qr.mode.${m.toLowerCase()}`}
          >
            {m === "Scanner" ? "QR Scanner Device" : "Camera (Mobile/Webcam)"}
          </button>
        ))}
      </div>

      {mode === "Scanner" && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground">
            Plug in your USB QR scanner. It works like a keyboard — point it at
            a QR code and scan. Student QR codes can be printed from Student
            Profile › Print QR Card.
          </p>
        </div>
      )}

      {mode === "Camera" && (
        <div className="space-y-3">
          {cameras.length === 0 ? (
            <Button
              type="button"
              size="sm"
              onClick={requestCamera}
              data-ocid="device_settings.qr.grant_camera_button"
            >
              <Camera className="h-3.5 w-3.5 mr-1.5" />
              Grant Camera Permission
            </Button>
          ) : (
            <>
              <div className="space-y-1">
                <Label className="text-xs">Camera</Label>
                <select
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                  value={selectedCameraId}
                  onChange={(e) => setSelectedCameraId(e.target.value)}
                  data-ocid="device_settings.qr.camera.select"
                >
                  {cameras.map((cam, i) => (
                    <option key={cam.deviceId} value={cam.deviceId}>
                      {cam.label || `Camera ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              {selectedCameraId && (
                <div className="rounded-lg overflow-hidden border border-border aspect-video max-h-48">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    data-ocid="device_settings.qr.camera_preview"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Button
        type="button"
        size="sm"
        onClick={handleSave}
        disabled={save.isPending}
        data-ocid="device_settings.qr.save_button"
      >
        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
        {save.isPending ? "Saving…" : "Save"}
      </Button>

      <GuideAccordion
        title="Setup Guide — QR Code"
        steps={[
          "For QR Scanner Device: Plug in USB QR scanner — it works like a keyboard, point at QR code and scan",
          "For Camera: Click Grant Camera Permission, then point camera at student/staff QR badge",
          "Student QR codes can be generated from Student Profile › Print QR Card",
          "Go to Attendance › QR Code tab to record attendance",
        ]}
      />
    </div>
  );
}

// ─── Main DevicesTab ─────────────────────────────────────────────────────────
export function DevicesTab() {
  const { data: configs = {} } = useGetAllDeviceConfigs();

  return (
    <div className="space-y-4" data-ocid="device_settings.panel">
      {/* Info banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex gap-3">
        <Cpu className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-sm text-foreground">
          <p className="font-medium">Attendance Device Configuration</p>
          <p className="text-muted-foreground mt-0.5">
            Configure ESSL biometric, face recognition, RFID, and QR code
            devices for student and staff attendance.
          </p>
        </div>
      </div>

      <Tabs defaultValue="essl" data-ocid="device_settings.device_type.tab">
        <TabsList className="flex-wrap h-auto gap-1 mb-2">
          <TabsTrigger value="essl" data-ocid="device_settings.essl.tab">
            <Fingerprint className="h-3.5 w-3.5 mr-1.5" />
            ESSL Biometric
          </TabsTrigger>
          <TabsTrigger value="face" data-ocid="device_settings.face.tab">
            <Camera className="h-3.5 w-3.5 mr-1.5" />
            Face Recognition
          </TabsTrigger>
          <TabsTrigger value="rfid" data-ocid="device_settings.rfid.tab">
            <Wifi className="h-3.5 w-3.5 mr-1.5" />
            RFID Reader
          </TabsTrigger>
          <TabsTrigger value="qr" data-ocid="device_settings.qr.tab">
            <QrCode className="h-3.5 w-3.5 mr-1.5" />
            QR Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="essl">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-primary" />
                ESSL Biometric Device
              </CardTitle>
              <CardDescription className="text-xs">
                IP-based ESSL biometric reader (ZKTeco/eSSL). Default port:
                4370.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ESSLPanel saved={configs.ESSLBiometric} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="face">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                Face Recognition
              </CardTitle>
              <CardDescription className="text-xs">
                Uses browser camera on any device — PC webcam, laptop, or
                mobile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FacePanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfid">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Wifi className="h-4 w-4 text-primary" />
                RFID Reader
              </CardTitle>
              <CardDescription className="text-xs">
                USB reader (plug and play) or IP-based RFID device.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RFIDPanel saved={configs.RFID} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <QrCode className="h-4 w-4 text-primary" />
                QR Code Scanner
              </CardTitle>
              <CardDescription className="text-xs">
                USB QR scanner device or mobile/webcam camera.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QRPanel saved={configs.QRCode} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
