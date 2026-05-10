import { useUpdateBusLocation } from "@/hooks/useBackend";
import {
  Bus,
  MapPin,
  Navigation,
  Phone,
  Shield,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Driver Mobile Live Tracking Page ─────────────────────────────────────────
// Public route: /bus-track/:busId
// No auth required. Designed for the driver to open on their mobile browser.
// Uses navigator.geolocation.watchPosition + Wake Lock API to keep tracking
// active in the background.

export default function DriverTrackingPage() {
  // Extract busId from URL path (compatible with TanStack Router)
  const pathParts = window.location.pathname.split("/");
  const busIdFromUrl = pathParts[pathParts.length - 1] ?? "";
  const busId =
    busIdFromUrl && busIdFromUrl !== "bus-track" ? busIdFromUrl : "";

  const updateLocation = useUpdateBusLocation();

  const [status, setStatus] = useState<
    "idle" | "requesting" | "tracking" | "denied" | "error"
  >("idle");
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [busIdInput, setBusIdInput] = useState(busId);
  const [routeIdInput, setRouteIdInput] = useState("");
  const watchIdRef = useRef<number | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Release wake lock on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      wakeLockRef.current?.release();
    };
  }, []);

  async function requestWakeLock() {
    if ("wakeLock" in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // Wake lock not available — silently continue
      }
    }
  }

  // Re-acquire wake lock when page becomes visible again
  useEffect(() => {
    async function handleVisibilityChange() {
      if (
        document.visibilityState === "visible" &&
        status === "tracking" &&
        !wakeLockRef.current
      ) {
        if ("wakeLock" in navigator) {
          try {
            wakeLockRef.current = await navigator.wakeLock.request("screen");
          } catch {
            /* ignore */
          }
        }
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [status]);

  async function startTracking() {
    if (!busIdInput.trim()) {
      setErrorMsg("Please enter your Bus ID first.");
      return;
    }
    if (!navigator.geolocation) {
      setStatus("error");
      setErrorMsg("Geolocation is not supported on this device.");
      return;
    }
    setStatus("requesting");
    setErrorMsg("");

    await requestWakeLock();

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy: acc } = position.coords;
        setAccuracy(Math.round(acc));
        setLastUpdate(new Date().toLocaleTimeString("en-IN"));
        setStatus("tracking");
        setUpdateCount((c) => c + 1);

        updateLocation.mutate({
          busId: busIdInput.trim(),
          routeId: routeIdInput.trim() || "default",
          latitude,
          longitude,
        });
      },
      (err) => {
        if (err.code === 1) {
          setStatus("denied");
          setErrorMsg("Location permission denied.");
        } else {
          setStatus("error");
          setErrorMsg(`GPS error: ${err.message}`);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      },
    );
  }

  function stopTracking() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    wakeLockRef.current?.release();
    wakeLockRef.current = null;
    setStatus("idle");
    setAccuracy(null);
    setUpdateCount(0);
    setLastUpdate(null);
  }

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="driver_tracking.page"
    >
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Bus className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-display text-foreground">
            Bus Live Tracking
          </h1>
          <p className="text-xs text-muted-foreground">
            SHUBH SCHOOL ERP — Driver App
          </p>
        </div>
        {status === "tracking" && (
          <div className="ml-auto flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-green-600">LIVE</span>
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Bus ID input */}
        {status === "idle" && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h2 className="font-semibold text-foreground">Start Tracking</h2>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="busIdField"
              >
                Bus ID / Bus Number
              </label>
              <input
                id="busIdField"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground"
                placeholder="e.g. UP32-AB-1234"
                value={busIdInput}
                onChange={(e) => setBusIdInput(e.target.value)}
                data-ocid="driver_tracking.bus_id.input"
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="routeField"
              >
                Route ID (optional)
              </label>
              <input
                id="routeField"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground"
                placeholder="Leave blank if unsure"
                value={routeIdInput}
                onChange={(e) => setRouteIdInput(e.target.value)}
                data-ocid="driver_tracking.route_id.input"
              />
            </div>
            {errorMsg && (
              <p
                className="text-sm text-destructive"
                data-ocid="driver_tracking.error_state"
              >
                {errorMsg}
              </p>
            )}
            <button
              type="button"
              onClick={startTracking}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 active:opacity-80"
              data-ocid="driver_tracking.start_button"
            >
              <Navigation className="size-4" />
              Start Tracking
            </button>
          </div>
        )}

        {/* Requesting permission */}
        {status === "requesting" && (
          <div
            className="rounded-xl border border-border bg-card p-6 text-center space-y-3"
            data-ocid="driver_tracking.loading_state"
          >
            <div className="size-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Navigation className="size-7 text-primary animate-pulse" />
            </div>
            <p className="font-semibold text-foreground">
              Requesting GPS permission…
            </p>
            <p className="text-sm text-muted-foreground">
              Allow location access when prompted by your browser.
            </p>
          </div>
        )}

        {/* Tracking active */}
        {status === "tracking" && (
          <div className="space-y-4">
            {/* Status card */}
            <div
              className="rounded-xl border-2 border-green-500/40 bg-green-500/5 p-5 space-y-3"
              data-ocid="driver_tracking.active_card"
            >
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Wifi className="size-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-lg">
                    Tracking Active
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Bus:{" "}
                    <span className="font-semibold text-foreground">
                      {busIdInput}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-lg border border-border p-3 text-center">
                  <p className="text-2xl font-bold text-foreground font-display">
                    {updateCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Updates Sent
                  </p>
                </div>
                <div className="bg-card rounded-lg border border-border p-3 text-center">
                  <p className="text-2xl font-bold text-foreground font-display">
                    {accuracy !== null ? `${accuracy}m` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    GPS Accuracy
                  </p>
                </div>
              </div>

              {lastUpdate && (
                <p className="text-xs text-muted-foreground text-center">
                  Last update sent at {lastUpdate}
                </p>
              )}
            </div>

            {/* Important notice */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-1.5">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                ⚠ Keep this tab open
              </p>
              <p className="text-xs text-muted-foreground">
                Tracking stops if you close this tab or the browser. Keep your
                phone screen on while driving.
              </p>
            </div>

            <button
              type="button"
              onClick={stopTracking}
              className="w-full border border-destructive text-destructive rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 active:opacity-80 bg-destructive/5"
              data-ocid="driver_tracking.stop_button"
            >
              <WifiOff className="size-4" />
              Stop Tracking
            </button>
          </div>
        )}

        {/* Permission denied */}
        {status === "denied" && (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-4"
            data-ocid="driver_tracking.error_state"
          >
            <div className="flex items-center gap-3">
              <Shield className="size-8 text-destructive" />
              <div>
                <p className="font-semibold text-foreground">
                  Location Permission Denied
                </p>
                <p className="text-sm text-muted-foreground">
                  You need to allow location access to use this feature.
                </p>
              </div>
            </div>
            <div className="bg-card rounded-lg border border-border p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                How to enable on Android:
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal ml-4">
                <li>Tap the lock icon 🔒 in Chrome address bar</li>
                <li>
                  Tap <strong>Permissions</strong>
                </li>
                <li>
                  Set <strong>Location</strong> to Allow
                </li>
                <li>Reload this page</li>
              </ol>
              <p className="text-sm font-semibold text-foreground mt-3">
                How to enable on iPhone:
              </p>
              <ol className="text-xs text-muted-foreground space-y-1 list-decimal ml-4">
                <li>Go to Settings → Safari → Location</li>
                <li>
                  Set to <strong>Ask</strong> or <strong>Allow</strong>
                </li>
                <li>
                  Or: Settings → Privacy → Location Services → Safari Websites
                </li>
              </ol>
            </div>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setErrorMsg("");
              }}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm"
              data-ocid="driver_tracking.retry_button"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Generic error */}
        {status === "error" && (
          <div
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3"
            data-ocid="driver_tracking.error_state"
          >
            <p className="font-semibold text-destructive">GPS Error</p>
            <p className="text-sm text-muted-foreground">{errorMsg}</p>
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                setErrorMsg("");
              }}
              className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-semibold text-sm"
              data-ocid="driver_tracking.retry_button"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Instructions footer */}
        <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="size-4 text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">
              Driver Instructions
            </p>
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Bookmark this page for quick access each morning</li>
            <li>• Open this page before starting your route</li>
            <li>• Keep your mobile data on throughout the journey</li>
            <li>• Keep the screen on (connect to charger if possible)</li>
            <li>
              • Tap <strong>Stop Tracking</strong> when you reach the school
            </li>
          </ul>
        </div>

        {/* GPS accuracy indicator */}
        {status === "tracking" && accuracy !== null && (
          <div className="flex items-center gap-2 justify-center">
            <MapPin className="size-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              GPS Accuracy:{" "}
              {accuracy <= 10
                ? "🟢 Excellent"
                : accuracy <= 30
                  ? "🟡 Good"
                  : "🔴 Poor"}{" "}
              ({accuracy}m)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
