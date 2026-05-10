import { createActor } from "@/backend";
import type { ModulePermission } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type FrontendUserAccount,
  useCreateUser,
  useGetAllUsers,
  useUpdateUser,
} from "@/hooks/useBackend";
import { cn, downloadCSV, formatDateTime } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { AuditLog, UserRole } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  UserCog,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ─── Constants ─────────────────────────────────────────────────────────────────
const ROLES: UserRole[] = [
  "Admin",
  "Teacher",
  "Student",
  "Parent",
  "Accountant",
  "Librarian",
  "SuperAdmin",
];

const ALL_ROLES: string[] = [
  "Admin",
  "Principal",
  "Accountant",
  "Teacher",
  "Student",
  "Parent",
  "Driver",
  "Librarian",
];

const MODULES = [
  { id: "academics", label: "Academics" },
  { id: "students", label: "Students" },
  { id: "fees", label: "Fees" },
  { id: "attendance", label: "Attendance" },
  { id: "hr", label: "HR" },
  { id: "transport", label: "Transport" },
  { id: "reports", label: "Reports" },
  { id: "communication", label: "Communication" },
  { id: "library", label: "Library" },
  { id: "inventory", label: "Inventory" },
  { id: "analytics", label: "Analytics" },
  { id: "expenses", label: "Expenses" },
  { id: "settings", label: "Settings" },
  { id: "users", label: "Users" },
  { id: "timetable", label: "Timetable" },
  { id: "examination", label: "Examination" },
  { id: "syllabus", label: "Syllabus" },
  { id: "chat", label: "Chat" },
];

const AUDIT_LOGS: AuditLog[] = [];

const PERM_ACTIONS: Array<{
  key: keyof ModulePermission;
  label: string;
  color: string;
}> = [
  { key: "canView", label: "V", color: "text-blue-600" },
  { key: "canCreate", label: "C", color: "text-green-600" },
  { key: "canEdit", label: "E", color: "text-amber-600" },
  { key: "canDelete", label: "D", color: "text-destructive" },
  { key: "canExport", label: "X", color: "text-purple-600" },
];

const ROLE_COLORS: Record<string, string> = {
  Admin: "bg-primary text-primary-foreground",
  SuperAdmin: "bg-primary text-primary-foreground",
  Principal: "bg-violet-600 text-white",
  Teacher: "bg-blue-600 text-white",
  Accountant: "bg-emerald-600 text-white",
  Librarian: "bg-amber-600 text-white",
  Student: "bg-muted text-muted-foreground border border-border",
  Parent: "bg-pink-100 text-pink-800 border border-pink-200",
  Driver: "bg-orange-100 text-orange-800 border border-orange-200",
};

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  return Array.from(
    { length: 10 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
}

// ─── Default module permissions per role ─────────────────────────────────────
function defaultPermsForRole(
  role: string,
): Record<string, Partial<ModulePermission>> {
  if (role === "Admin") {
    return Object.fromEntries(
      MODULES.map((m) => [
        m.id,
        {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canExport: true,
        },
      ]),
    );
  }
  if (role === "Accountant") {
    const allowed = new Set(["fees", "reports", "expenses", "students"]);
    return Object.fromEntries(
      MODULES.map((m) => [
        m.id,
        allowed.has(m.id)
          ? {
              canView: true,
              canCreate: true,
              canEdit: true,
              canDelete: false,
              canExport: true,
            }
          : {
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false,
              canExport: false,
            },
      ]),
    );
  }
  if (role === "Teacher" || role === "Principal") {
    const denied = new Set(["users", "settings", "expenses"]);
    return Object.fromEntries(
      MODULES.map((m) => [
        m.id,
        denied.has(m.id)
          ? {
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false,
              canExport: false,
            }
          : {
              canView: true,
              canCreate: false,
              canEdit: false,
              canDelete: false,
              canExport: false,
            },
      ]),
    );
  }
  if (role === "Student" || role === "Parent") {
    const allowed = new Set([
      "fees",
      "academics",
      "attendance",
      "syllabus",
      "chat",
    ]);
    return Object.fromEntries(
      MODULES.map((m) => [
        m.id,
        {
          canView: allowed.has(m.id),
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canExport: false,
        },
      ]),
    );
  }
  // Librarian, Driver, others
  return Object.fromEntries(
    MODULES.map((m) => [
      m.id,
      {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canExport: false,
      },
    ]),
  );
}

// ─── Role & Permissions Matrix Tab ────────────────────────────────────────────
function RolePermissionsTab() {
  const { actor, isFetching } = useActor(createActor);
  const currentRole = useAppStore((s) => s.currentRole);
  const isAdmin = currentRole === "Admin";

  // Local matrix state: role -> moduleId -> perms
  const [matrix, setMatrix] = useState<Record<
    string,
    Record<string, Partial<ModulePermission>>
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  async function loadPermissions() {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getRolePermissions();
      const built: Record<
        string,
        Record<string, Partial<ModulePermission>>
      > = {};
      for (const rp of result) {
        const roleKey = String(rp.role);
        built[roleKey] = {};
        for (const mp of rp.modulePermissions) {
          built[roleKey][mp.moduleId] = {
            canView: mp.canView,
            canCreate: mp.canCreate,
            canEdit: mp.canEdit,
            canDelete: mp.canDelete,
            canExport: mp.canExport,
          };
        }
        // Fill missing modules with defaults
        for (const mod of MODULES) {
          if (!built[roleKey][mod.id]) {
            built[roleKey][mod.id] = {
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false,
              canExport: false,
            };
          }
        }
      }
      // Fill missing roles with defaults
      for (const role of ALL_ROLES) {
        if (!built[role]) {
          built[role] = defaultPermsForRole(role);
        }
      }
      setMatrix(built);
    } catch {
      // Build defaults if backend unavailable
      const built: Record<
        string,
        Record<string, Partial<ModulePermission>>
      > = {};
      for (const role of ALL_ROLES) {
        built[role] = defaultPermsForRole(role);
      }
      setMatrix(built);
    } finally {
      setLoading(false);
    }
  }

  // Load on mount when actor becomes available
  if (matrix === null && actor && !loading && !isFetching) {
    loadPermissions();
  }

  function togglePerm(
    role: string,
    moduleId: string,
    key: keyof ModulePermission,
  ) {
    if (role === "Admin" || !isAdmin) return;
    setMatrix((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [role]: {
          ...prev[role],
          [moduleId]: {
            ...prev[role]?.[moduleId],
            [key]: !prev[role]?.[moduleId]?.[key],
          },
        },
      };
    });
  }

  async function saveRole(role: string) {
    if (!actor || !matrix) return;
    setSaving(role);
    try {
      const perms: ModulePermission[] = MODULES.map((m) => ({
        moduleId: m.id,
        canView: !!matrix[role]?.[m.id]?.canView,
        canCreate: !!matrix[role]?.[m.id]?.canCreate,
        canEdit: !!matrix[role]?.[m.id]?.canEdit,
        canDelete: !!matrix[role]?.[m.id]?.canDelete,
        canExport: !!matrix[role]?.[m.id]?.canExport,
      }));
      await actor.updateRolePermissions(role as never, perms);
      toast.success(`Permissions saved for ${role}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save permissions.",
      );
    } finally {
      setSaving(null);
    }
  }

  function resetRole(role: string) {
    const defaults = defaultPermsForRole(role);
    setMatrix((prev) => (prev ? { ...prev, [role]: defaults } : prev));
  }

  if (loading || !matrix) {
    return (
      <div
        className="flex items-center justify-center py-20 text-muted-foreground"
        data-ocid="permissions.loading_state"
      >
        <Loader2 size={22} className="animate-spin mr-2" /> Loading permissions…
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6" data-ocid="permissions.panel">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-semibold text-foreground text-sm">
            Role &amp; Module Permissions
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            <span className="text-blue-600 font-bold">V</span>=View&nbsp;
            <span className="text-green-600 font-bold">C</span>=Create&nbsp;
            <span className="text-amber-600 font-bold">E</span>=Edit&nbsp;
            <span className="text-destructive font-bold">D</span>=Delete&nbsp;
            <span className="text-purple-600 font-bold">X</span>=Export
          </p>
        </div>
        {!isAdmin && (
          <p className="text-xs text-muted-foreground italic">
            Only admin can edit permissions.
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="text-xs min-w-max w-full">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              <th className="sticky left-0 z-10 bg-muted/40 text-left px-3 py-2.5 font-semibold text-muted-foreground min-w-[120px]">
                Module
              </th>
              {ALL_ROLES.map((role) => (
                <th
                  key={role}
                  className="px-2 py-2.5 font-semibold text-muted-foreground min-w-[110px]"
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        ROLE_COLORS[role] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {role}
                    </span>
                    {role !== "Admin" && isAdmin && (
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => saveRole(role)}
                          disabled={saving === role}
                          className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium"
                          data-ocid={`permissions.save.${role.toLowerCase()}`}
                        >
                          {saving === role ? (
                            <Loader2 size={10} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={10} />
                          )}
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => resetRole(role)}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-muted hover:bg-muted/80 transition-colors text-muted-foreground"
                          title="Reset to defaults"
                          data-ocid={`permissions.reset.${role.toLowerCase()}`}
                        >
                          <RotateCcw size={10} /> Reset
                        </button>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((mod) => (
              <tr
                key={mod.id}
                className="border-b border-border last:border-0 hover:bg-muted/10 transition-colors"
              >
                <td className="sticky left-0 z-10 bg-card px-3 py-2 font-medium text-foreground whitespace-nowrap">
                  {mod.label}
                </td>
                {ALL_ROLES.map((role) => {
                  const perms = matrix[role]?.[mod.id] ?? {};
                  const isAdminRole = role === "Admin";
                  return (
                    <td key={role} className="px-2 py-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {PERM_ACTIONS.map((action) => {
                          const active = isAdminRole || !!perms[action.key];
                          return (
                            <button
                              key={action.key}
                              type="button"
                              title={`${role}: ${action.key.replace("can", "Can ")}`}
                              disabled={isAdminRole || !isAdmin}
                              onClick={() =>
                                togglePerm(role, mod.id, action.key)
                              }
                              className={cn(
                                "w-5 h-5 rounded text-[10px] font-bold transition-all border",
                                active
                                  ? cn(
                                      "border-transparent",
                                      action.color,
                                      "bg-current/10",
                                    )
                                  : "border-border text-muted-foreground/30 bg-muted/20",
                                isAdminRole && "cursor-not-allowed opacity-80",
                                !isAdminRole &&
                                  isAdmin &&
                                  "cursor-pointer hover:scale-110",
                                !isAdmin && "cursor-default",
                              )}
                              data-ocid={`permissions.${role.toLowerCase()}.${mod.id}.${action.key}`}
                            >
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Admin role always has full access and cannot be modified. Changes take
        effect on next login.
      </p>
    </div>
  );
}

// ─── User Accounts Tab ─────────────────────────────────────────────────────────
function UserAccountsTab() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const currentRole = useAppStore((s) => s.currentRole);
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";

  const { data: backendUsers = [], isLoading, refetch } = useGetAllUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Add/Edit dialog
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FrontendUserAccount | null>(null);
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    role: "Teacher" as UserRole,
    password: "",
    isActive: true,
  });
  const [showPwdForm, setShowPwdForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Reset password dialog
  const [resetUser, setResetUser] = useState<FrontendUserAccount | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Delete dialog
  const [deleteUser, setDeleteUser] = useState<FrontendUserAccount | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = useMemo(
    () =>
      backendUsers.filter((u) => {
        if (roleFilter !== "all" && u.role !== roleFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            u.fullName.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q)
          );
        }
        return true;
      }),
    [backendUsers, search, roleFilter],
  );

  function openAdd() {
    setForm({
      username: "",
      fullName: "",
      email: "",
      role: "Teacher",
      password: generatePassword(),
      isActive: true,
    });
    setEditing(null);
    setFormError("");
    setShowPwdForm(false);
    setOpen(true);
  }

  function openEdit(u: FrontendUserAccount) {
    setForm({
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role as UserRole,
      password: "",
      isActive: u.isActive,
    });
    setEditing(u);
    setFormError("");
    setShowPwdForm(false);
    setOpen(true);
  }

  async function saveUser() {
    setFormError("");
    if (!form.fullName.trim()) {
      setFormError("Full name is required.");
      return;
    }
    if (!editing && !form.username.trim()) {
      setFormError("Username is required.");
      return;
    }
    if (!editing && !form.password.trim()) {
      setFormError("Password is required.");
      return;
    }

    // Duplicate username check (for new users)
    if (!editing) {
      const dup = backendUsers.find(
        (u) => u.username.toLowerCase() === form.username.toLowerCase(),
      );
      if (dup) {
        setFormError(
          `Username "${form.username}" is already taken. Choose a different one.`,
        );
        return;
      }
    }

    setIsSaving(true);
    try {
      if (editing) {
        await updateUser.mutateAsync({
          id: editing.id,
          username: form.username || editing.username,
          fullName: form.fullName,
          role: form.role,
          isActive: form.isActive,
        });
        toast.success("User updated successfully");
      } else {
        // Use upsertAppUser for new users with password
        if (actor) {
          await actor.upsertAppUser(
            form.username,
            form.password,
            form.role,
            form.isActive,
          );
          await qc.invalidateQueries({ queryKey: ["users"] });
          toast.success(`User "${form.username}" created successfully`);
        } else {
          await createUser.mutateAsync({
            username: form.username,
            fullName: form.fullName,
            role: form.role,
            permissions: [],
          });
          toast.success("User created successfully");
        }
      }
      setOpen(false);
      refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save user.");
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleActive(u: FrontendUserAccount) {
    try {
      await updateUser.mutateAsync({
        id: u.id,
        username: u.username,
        fullName: u.fullName,
        role: u.role,
        isActive: !u.isActive,
      });
      refetch();
    } catch {
      toast.error("Failed to update user status.");
    }
  }

  function openReset(u: FrontendUserAccount) {
    setResetUser(u);
    setNewPassword(generatePassword());
    setShowPwd(false);
  }

  async function confirmReset() {
    if (!resetUser || !actor) return;
    setIsResetting(true);
    try {
      const generated = await actor.resetUserPassword(
        resetUser.username,
        newPassword,
      );
      const displayPassword =
        typeof generated === "object" && generated !== null && "ok" in generated
          ? ((generated as { ok: string | null }).ok ?? newPassword)
          : newPassword;
      toast.success(
        `Password reset for ${resetUser.fullName}. New password: ${displayPassword}`,
      );
      setResetUser(null);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to reset password.",
      );
    } finally {
      setIsResetting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteUser || !actor) return;
    setIsDeleting(true);
    try {
      // Use deleteUser via updateUser with disabled approach, or direct actor call
      // Backend has deleteUser via updateUser.mutate({isActive:false}) as soft-delete
      await updateUser.mutateAsync({
        id: deleteUser.id,
        username: deleteUser.username,
        fullName: deleteUser.fullName,
        role: deleteUser.role,
        isActive: false,
      });
      toast.success(`User "${deleteUser.fullName}" deactivated successfully.`);
      setDeleteUser(null);
      refetch();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete user.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              className="pl-8 h-8 text-xs w-52"
              placeholder="Search users…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="users.search_input"
            />
            {search && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setSearch("")}
                data-ocid="users.search_clear"
              >
                <X size={12} className="text-muted-foreground" />
              </button>
            )}
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger
              className="h-8 text-xs w-36"
              data-ocid="users.role_filter"
            >
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={openAdd} data-ocid="users.add_button">
          <Plus size={14} className="mr-1.5" /> Add User
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        {isLoading ? (
          <div
            className="flex items-center justify-center py-16 text-muted-foreground"
            data-ocid="users.loading_state"
          >
            <Loader2 size={22} className="animate-spin mr-2" /> Loading users…
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Role
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                  Username
                </th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
                  Active
                </th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr
                  key={u.id}
                  className="border-b border-border last:border-0 table-row-alt hover:bg-muted/20 transition-colors"
                  data-ocid={`users.item.${i + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          u.isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {u.fullName
                          .split(" ")
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {u.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {u.email || u.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                        ROLE_COLORS[u.role] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                    {u.username}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={u.isActive}
                      onCheckedChange={() => toggleActive(u)}
                      data-ocid={`users.status.${i + 1}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          title="Reset Password"
                          onClick={() => openReset(u)}
                          data-ocid={`users.reset_password.${i + 1}`}
                        >
                          <KeyRound size={13} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => openEdit(u)}
                        data-ocid={`users.edit_button.${i + 1}`}
                      >
                        <Pencil size={13} />
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          title="Remove User"
                          onClick={() => setDeleteUser(u)}
                          data-ocid={`users.delete_button.${i + 1}`}
                        >
                          <Trash2 size={13} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-muted-foreground text-sm"
                    data-ocid="users.empty_state"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent style={{ zIndex: 9999 }} data-ocid="users.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit User" : "Add User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="user-fullName">Full Name *</Label>
                <Input
                  id="user-fullName"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  placeholder="Full name"
                  data-ocid="users.fullname.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="user-username">
                  Username {!editing && "*"}
                </Label>
                <Input
                  id="user-username"
                  value={form.username}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, username: e.target.value }));
                    setFormError("");
                  }}
                  placeholder="e.g. rajesh.sharma"
                  disabled={!!editing}
                  data-ocid="users.username.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, role: v as UserRole }))
                  }
                >
                  <SelectTrigger data-ocid="users.role.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {!editing && (
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="user-password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="user-password"
                      type={showPwdForm ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                      placeholder="Initial password"
                      className="pr-10"
                      data-ocid="users.password.input"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPwdForm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPwdForm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-1.5 col-span-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="user@school.in"
                  data-ocid="users.email.input"
                />
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, isActive: v }))
                  }
                  data-ocid="users.active.switch"
                />
                <Label className="cursor-pointer">Active</Label>
              </div>
            </div>
            {formError && (
              <p
                className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2 border border-destructive/20"
                data-ocid="users.form.error_state"
              >
                {formError}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving}
              data-ocid="users.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveUser}
              disabled={isSaving || !form.fullName}
              data-ocid="users.submit_button"
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-1.5" /> Saving…
                </>
              ) : editing ? (
                "Save Changes"
              ) : (
                "Add User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetUser} onOpenChange={() => setResetUser(null)}>
        <DialogContent
          style={{ zIndex: 9999 }}
          data-ocid="users.reset_password.dialog"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound size={16} className="text-accent" /> Reset Password —{" "}
              {resetUser?.fullName}
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-3">
            <p className="text-sm text-muted-foreground">
              A new password has been generated. Share it securely with the
              user.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono bg-muted/40 rounded-md px-3 py-2 text-sm border border-border">
                {showPwd ? newPassword : "•".repeat(newPassword.length)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-9"
                onClick={() => setShowPwd((v) => !v)}
                data-ocid="users.reset_password.toggle_show"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNewPassword(generatePassword())}
              data-ocid="users.reset_password.regenerate_button"
            >
              Regenerate
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetUser(null)}
              data-ocid="users.reset_password.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmReset}
              disabled={isResetting}
              data-ocid="users.reset_password.confirm_button"
            >
              {isResetting ? (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              ) : (
                <CheckCircle2 size={14} className="mr-1.5" />
              )}
              Confirm Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <DialogContent style={{ zIndex: 9999 }} data-ocid="users.delete.dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 size={16} /> Remove User — {deleteUser?.fullName}
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-sm text-muted-foreground">
              This will deactivate <strong>{deleteUser?.fullName}</strong> (
              {deleteUser?.username}). They will no longer be able to log in.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteUser(null)}
              data-ocid="users.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              data-ocid="users.delete.confirm_button"
            >
              {isDeleting ? (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              ) : null}
              Deactivate User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Audit Log Tab ─────────────────────────────────────────────────────────────
function AuditLogTab() {
  const [userFilter, setUserFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const moduleNames = [...new Set(AUDIT_LOGS.map((l) => l.moduleName))];
  const userNames = [...new Set(AUDIT_LOGS.map((l) => l.userName))];

  const filtered = useMemo(
    () =>
      AUDIT_LOGS.filter((l) => {
        if (userFilter !== "all" && l.userName !== userFilter) return false;
        if (moduleFilter !== "all" && l.moduleName !== moduleFilter)
          return false;
        if (dateFrom && l.timestamp < dateFrom) return false;
        if (dateTo && l.timestamp > `${dateTo}T23:59:59`) return false;
        return true;
      }),
    [userFilter, moduleFilter, dateFrom, dateTo],
  );

  function exportLogs() {
    downloadCSV(
      filtered.map((l) => ({
        User: l.userName,
        Action: l.action,
        Module: l.moduleName,
        Details: l.details,
        Timestamp: l.timestamp,
      })),
      "audit_log.csv",
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 flex-wrap justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger
              className="h-8 text-xs w-44"
              data-ocid="audit.user_filter"
            >
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {userNames.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger
              className="h-8 text-xs w-40"
              data-ocid="audit.module_filter"
            >
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {moduleNames.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1.5">
            <Input
              type="date"
              className="h-8 text-xs w-36"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              data-ocid="audit.date_from.input"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="date"
              className="h-8 text-xs w-36"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              data-ocid="audit.date_to.input"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportLogs}
          data-ocid="audit.export_button"
        >
          <Download size={14} className="mr-1.5" /> Export
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 sticky top-0">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                User
              </th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                Action
              </th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                Module
              </th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">
                Details
              </th>
              <th className="text-right px-4 py-3 font-semibold text-muted-foreground">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log, i) => (
              <tr
                key={log.id}
                className="border-b border-border last:border-0 table-row-alt hover:bg-muted/20 transition-colors"
                data-ocid={`audit.item.${i + 1}`}
              >
                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                  {log.userName}
                </td>
                <td className="px-4 py-3 text-foreground">{log.action}</td>
                <td className="px-4 py-3">
                  <span className="badge-muted">{log.moduleName}</span>
                </td>
                <td
                  className="px-4 py-3 text-muted-foreground text-xs max-w-sm truncate"
                  title={log.details}
                >
                  {log.details}
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                  {formatDateTime(log.timestamp)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground text-sm"
                  data-ocid="audit.empty_state"
                >
                  No audit log entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("accounts");

  return (
    <div className="flex flex-col h-full min-h-0" data-ocid="users.page">
      <div className="bg-card border-b px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserCog className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              User Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Accounts, role permissions, and audit trail
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 min-h-0"
      >
        <div className="bg-card border-b px-6 flex-shrink-0">
          <TabsList
            className="h-12 bg-transparent p-0 gap-1"
            data-ocid="users.tabs"
          >
            <TabsTrigger
              value="accounts"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="users.accounts.tab"
            >
              <UserCog size={14} /> User Accounts
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="users.permissions.tab"
            >
              <Shield size={14} /> Role Permissions
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3"
              data-ocid="users.audit.tab"
            >
              <Download size={14} /> Audit Log
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 min-h-0 overflow-auto bg-background">
          <TabsContent value="accounts" className="m-0 p-0 h-full">
            <UserAccountsTab />
          </TabsContent>
          <TabsContent value="permissions" className="m-0 p-0 h-full">
            <RolePermissionsTab />
          </TabsContent>
          <TabsContent value="audit" className="m-0 p-0 h-full">
            <AuditLogTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
