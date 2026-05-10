import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginUser } from "@/hooks/useBackend";
import { useAppStore } from "@/store/useAppStore";
import type { UserRole } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, GraduationCap, Loader2, PartyPopper } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Session persistence helpers ─────────────────────────────────────────────
const SESSION_KEY = "shubh-erp-session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface PersistedSession {
  userId: string;
  username: string;
  displayName: string;
  role: string;
  loginAt: number;
}

export function saveSession(data: PersistedSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {}
}

export function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as PersistedSession;
    if (Date.now() - s.loginAt > SESSION_TTL_MS) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

// ─── Welcome Modal ────────────────────────────────────────────────────────────
function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60"
      onClick={onClose}
      onKeyUp={(e) => e.key === "Escape" && onClose()}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="bg-card rounded-2xl shadow-2xl border border-border p-8 max-w-sm w-full mx-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <PartyPopper className="size-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Welcome to SHUBH SCHOOL ERP!
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          You are logged in as <strong>admin</strong>. Start by configuring your
          school info in Settings, then add classes, staff, and students.
        </p>
        <div className="bg-muted/40 rounded-lg p-3 mb-6 text-xs text-muted-foreground">
          Default login:{" "}
          <span className="font-mono font-semibold text-foreground">
            admin / admin123
          </span>
          <br />
          Change your password in Settings after setup.
        </div>
        <Button
          className="w-full"
          onClick={onClose}
          data-ocid="login.welcome.close_button"
        >
          Get Started
        </Button>
      </motion.div>
    </div>
  );
}

// ─── Forgot Password Modal ────────────────────────────────────────────────────
function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const { actor } = useActor(createActor);
  const currentRole = useAppStore((s) => s.currentRole);
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";
  const [adminUser, setAdminUser] = useState("admin");
  const [targetUser, setTargetUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleReset() {
    if (!targetUser.trim() || !newPassword.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSaving(true);
    try {
      if (actor) {
        const r = await actor.resetUserPasswordAdmin(
          adminUser,
          targetUser.trim(),
          newPassword.trim(),
        );
        if (r.__kind__ === "ok") {
          toast.success(`Password reset for ${targetUser} successfully.`);
          onClose();
          return;
        }
        toast.error(
          (r as { __kind__: "err"; err: string }).err ?? "Reset failed.",
        );
      } else {
        toast.error("Backend not available. Please try again.");
      }
    } catch {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent data-ocid="login.forgot_dialog">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
        </DialogHeader>
        {isAdmin ? (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              As an admin, you can reset any user's password.
            </p>
            <div className="space-y-1.5">
              <Label>Admin Username</Label>
              <Input
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="admin"
                data-ocid="login.forgot.admin_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Target Username (to reset)</Label>
              <Input
                value={targetUser}
                onChange={(e) => setTargetUser(e.target.value)}
                placeholder="Username to reset"
                data-ocid="login.forgot.target_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                data-ocid="login.forgot.password_input"
              />
            </div>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Contact your administrator to reset your password.
            </p>
            <div className="mt-4 p-3 rounded-lg bg-muted/40 text-xs text-muted-foreground">
              For staff accounts: username is{" "}
              <span className="font-mono font-semibold text-foreground">
                firstname.lastname
              </span>{" "}
              and default password is{" "}
              <span className="font-mono font-semibold text-foreground">
                Staff@EmployeeID
              </span>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="login.forgot.cancel_button"
          >
            Close
          </Button>
          {isAdmin && (
            <Button
              onClick={handleReset}
              disabled={saving}
              data-ocid="login.forgot.submit_button"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1" /> Resetting…
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── LoginPage ────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuthenticated, setUser, setRole } = useAppStore();
  const loginMutation = useLoginUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // On mount: if a valid persisted session exists, restore it without re-login
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time session restore
  useEffect(() => {
    const session = loadSession();
    if (session) {
      setRole(session.role as UserRole);
      setUser({
        id: session.userId,
        principal: "",
        fullName: session.displayName || session.username,
        email: "",
        mobile: "",
        role: session.role as UserRole,
        staffId: null,
        studentId: null,
        permissions: {},
        isActive: true,
        createdAt: new Date().toISOString(),
      });
      setAuthenticated(true);
      navigate({ to: "/dashboard" });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ username, password });
      if (result.success) {
        const displayName = result.displayName || result.username;
        const role = result.role as UserRole;

        // Persist session with 24h expiry
        saveSession({
          userId: String(result.userId),
          username: result.username,
          displayName,
          role: result.role,
          loginAt: Date.now(),
        });

        setRole(role);
        setUser({
          id: String(result.userId),
          principal: "",
          fullName: displayName,
          email: "",
          mobile: "",
          role,
          staffId: null,
          studentId: null,
          permissions: {},
          isActive: true,
          createdAt: new Date().toISOString(),
        });
        setAuthenticated(true);

        // Show welcome modal only on the very first login (admin seed)
        const isFirstLogin = result.isFirstLogin === true;
        if (isFirstLogin) {
          setShowWelcome(true);
        } else {
          navigate({ to: "/dashboard" });
        }
      } else {
        setError(
          "Invalid username or password. Please check your credentials.\nIf you recently added a staff member, try username: firstname.lastname and password: Staff@EmployeeID",
        );
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    }
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/85 to-primary/60 p-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative w-full max-w-sm"
      >
        {/* Brand header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex size-20 items-center justify-center rounded-2xl bg-primary-foreground/15 border border-primary-foreground/25 mb-5 shadow-lg"
          >
            <GraduationCap className="size-10 text-primary-foreground" />
          </motion.div>

          <h1 className="font-display text-3xl font-bold text-primary-foreground tracking-tight">
            SHUBH SCHOOL
          </h1>
          <p className="text-primary-foreground/80 text-sm font-medium mt-1 tracking-wide">
            ERP Management System
          </p>
        </div>

        {/* Login card */}
        <div className="bg-card rounded-2xl shadow-2xl border border-border p-8">
          <div className="mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">
              Sign In
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your credentials to access the portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="login-username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                autoComplete="username"
                autoFocus
                disabled={isLoading}
                className="h-11"
                data-ocid="login.username_input"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="login-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  autoComplete="current-password"
                  disabled={isLoading}
                  className="h-11 pr-11"
                  data-ocid="login.password_input"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  data-ocid="login.password_toggle"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive"
                data-ocid="login.error_state"
                role="alert"
              >
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 font-semibold text-base mt-2"
              disabled={isLoading}
              data-ocid="login.submit_button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Default:{" "}
              <span className="font-mono font-semibold text-foreground">
                admin / admin123
              </span>
            </p>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => setShowForgot(true)}
              data-ocid="login.forgot_password_link"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-primary-foreground/50 mt-6">
          © {new Date().getFullYear()} SHUBH SCHOOL ERP. All rights reserved.
        </p>
      </motion.div>

      {/* First-login welcome modal */}
      {showWelcome && (
        <WelcomeModal
          onClose={() => {
            setShowWelcome(false);
            navigate({ to: "/dashboard" });
          }}
        />
      )}

      {/* Forgot Password Modal */}
      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </div>
  );
}
