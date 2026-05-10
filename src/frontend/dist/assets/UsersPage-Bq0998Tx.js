import { ae as createLucideIcon, r as reactExports, j as jsxRuntimeExports, ce as UserCog, cX as Shield, a3 as useActor, ao as useQueryClient, d as useAppStore, dI as useGetAllUsers, dJ as useCreateUser, dK as useUpdateUser, I as Input, X, e as Button, l as LoaderCircle, aM as cn, D as Dialog, f as DialogContent, g as DialogHeader, h as DialogTitle, L as Label, c$ as EyeOff, d0 as Eye, k as DialogFooter, dL as formatDateTime, F as ue, ab as downloadCSV, ad as createActor } from "./index-pMBTUEbj.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CB1mPRaz.js";
import { S as Switch } from "./switch-CzdiPi9K.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-BHaERrR7.js";
import { D as Download } from "./download-BHLO7mQe.js";
import { S as Search } from "./search-ByT9I9Ba.js";
import { P as Plus } from "./plus-BwHq7I79.js";
import { P as Pencil } from "./pencil-CU7v6fNP.js";
import { T as Trash2 } from "./trash-2-Bjj2Bbor.js";
import { C as CircleCheck } from "./circle-check-B4s6AseI.js";
import { R as RotateCcw } from "./rotate-ccw-BQz6udQk.js";
import "./index-Nv6ob_Pe.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
];
const KeyRound = createLucideIcon("key-round", __iconNode);
const ROLES = [
  "Admin",
  "Teacher",
  "Student",
  "Parent",
  "Accountant",
  "Librarian",
  "SuperAdmin"
];
const ALL_ROLES = [
  "Admin",
  "Principal",
  "Accountant",
  "Teacher",
  "Student",
  "Parent",
  "Driver",
  "Librarian"
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
  { id: "chat", label: "Chat" }
];
const AUDIT_LOGS = [];
const PERM_ACTIONS = [
  { key: "canView", label: "V", color: "text-blue-600" },
  { key: "canCreate", label: "C", color: "text-green-600" },
  { key: "canEdit", label: "E", color: "text-amber-600" },
  { key: "canDelete", label: "D", color: "text-destructive" },
  { key: "canExport", label: "X", color: "text-purple-600" }
];
const ROLE_COLORS = {
  Admin: "bg-primary text-primary-foreground",
  SuperAdmin: "bg-primary text-primary-foreground",
  Principal: "bg-violet-600 text-white",
  Teacher: "bg-blue-600 text-white",
  Accountant: "bg-emerald-600 text-white",
  Librarian: "bg-amber-600 text-white",
  Student: "bg-muted text-muted-foreground border border-border",
  Parent: "bg-pink-100 text-pink-800 border border-pink-200",
  Driver: "bg-orange-100 text-orange-800 border border-orange-200"
};
function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  return Array.from(
    { length: 10 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
function defaultPermsForRole(role) {
  if (role === "Admin") {
    return Object.fromEntries(
      MODULES.map((m) => [
        m.id,
        {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canExport: true
        }
      ])
    );
  }
  if (role === "Accountant") {
    const allowed = /* @__PURE__ */ new Set(["fees", "reports", "expenses", "students"]);
    return Object.fromEntries(
      MODULES.map((m) => [
        m.id,
        allowed.has(m.id) ? {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: false,
          canExport: true
        } : {
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canExport: false
        }
      ])
    );
  }
  if (role === "Teacher" || role === "Principal") {
    const denied = /* @__PURE__ */ new Set(["users", "settings", "expenses"]);
    return Object.fromEntries(
      MODULES.map((m) => [
        m.id,
        denied.has(m.id) ? {
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canExport: false
        } : {
          canView: true,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canExport: false
        }
      ])
    );
  }
  if (role === "Student" || role === "Parent") {
    const allowed = /* @__PURE__ */ new Set([
      "fees",
      "academics",
      "attendance",
      "syllabus",
      "chat"
    ]);
    return Object.fromEntries(
      MODULES.map((m) => [
        m.id,
        {
          canView: allowed.has(m.id),
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canExport: false
        }
      ])
    );
  }
  return Object.fromEntries(
    MODULES.map((m) => [
      m.id,
      {
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canExport: false
      }
    ])
  );
}
function RolePermissionsTab() {
  const { actor, isFetching } = useActor(createActor);
  const currentRole = useAppStore((s) => s.currentRole);
  const isAdmin = currentRole === "Admin";
  const [matrix, setMatrix] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(null);
  async function loadPermissions() {
    if (!actor) return;
    setLoading(true);
    try {
      const result = await actor.getRolePermissions();
      const built = {};
      for (const rp of result) {
        const roleKey = String(rp.role);
        built[roleKey] = {};
        for (const mp of rp.modulePermissions) {
          built[roleKey][mp.moduleId] = {
            canView: mp.canView,
            canCreate: mp.canCreate,
            canEdit: mp.canEdit,
            canDelete: mp.canDelete,
            canExport: mp.canExport
          };
        }
        for (const mod of MODULES) {
          if (!built[roleKey][mod.id]) {
            built[roleKey][mod.id] = {
              canView: false,
              canCreate: false,
              canEdit: false,
              canDelete: false,
              canExport: false
            };
          }
        }
      }
      for (const role of ALL_ROLES) {
        if (!built[role]) {
          built[role] = defaultPermsForRole(role);
        }
      }
      setMatrix(built);
    } catch {
      const built = {};
      for (const role of ALL_ROLES) {
        built[role] = defaultPermsForRole(role);
      }
      setMatrix(built);
    } finally {
      setLoading(false);
    }
  }
  if (matrix === null && actor && !loading && !isFetching) {
    loadPermissions();
  }
  function togglePerm(role, moduleId, key) {
    if (role === "Admin" || !isAdmin) return;
    setMatrix((prev) => {
      var _a, _b, _c;
      if (!prev) return prev;
      return {
        ...prev,
        [role]: {
          ...prev[role],
          [moduleId]: {
            ...(_a = prev[role]) == null ? void 0 : _a[moduleId],
            [key]: !((_c = (_b = prev[role]) == null ? void 0 : _b[moduleId]) == null ? void 0 : _c[key])
          }
        }
      };
    });
  }
  async function saveRole(role) {
    if (!actor || !matrix) return;
    setSaving(role);
    try {
      const perms = MODULES.map((m) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
        return {
          moduleId: m.id,
          canView: !!((_b = (_a = matrix[role]) == null ? void 0 : _a[m.id]) == null ? void 0 : _b.canView),
          canCreate: !!((_d = (_c = matrix[role]) == null ? void 0 : _c[m.id]) == null ? void 0 : _d.canCreate),
          canEdit: !!((_f = (_e = matrix[role]) == null ? void 0 : _e[m.id]) == null ? void 0 : _f.canEdit),
          canDelete: !!((_h = (_g = matrix[role]) == null ? void 0 : _g[m.id]) == null ? void 0 : _h.canDelete),
          canExport: !!((_j = (_i = matrix[role]) == null ? void 0 : _i[m.id]) == null ? void 0 : _j.canExport)
        };
      });
      await actor.updateRolePermissions(role, perms);
      ue.success(`Permissions saved for ${role}`);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save permissions."
      );
    } finally {
      setSaving(null);
    }
  }
  function resetRole(role) {
    const defaults = defaultPermsForRole(role);
    setMatrix((prev) => prev ? { ...prev, [role]: defaults } : prev);
  }
  if (loading || !matrix) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-center py-20 text-muted-foreground",
        "data-ocid": "permissions.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 22, className: "animate-spin mr-2" }),
          " Loading permissions…"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-6", "data-ocid": "permissions.panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "Role & Module Permissions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600 font-bold", children: "V" }),
          "=View ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-600 font-bold", children: "C" }),
          "=Create ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-amber-600 font-bold", children: "E" }),
          "=Edit ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-bold", children: "D" }),
          "=Delete ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-600 font-bold", children: "X" }),
          "=Export"
        ] })
      ] }),
      !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "Only admin can edit permissions." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "text-xs min-w-max w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "sticky left-0 z-10 bg-muted/40 text-left px-3 py-2.5 font-semibold text-muted-foreground min-w-[120px]", children: "Module" }),
        ALL_ROLES.map((role) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-2 py-2.5 font-semibold text-muted-foreground min-w-[110px]",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold",
                    ROLE_COLORS[role] ?? "bg-muted text-muted-foreground"
                  ),
                  children: role
                }
              ),
              role !== "Admin" && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => saveRole(role),
                    disabled: saving === role,
                    className: "flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium",
                    "data-ocid": `permissions.save.${role.toLowerCase()}`,
                    children: [
                      saving === role ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 10, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 10 }),
                      "Save"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => resetRole(role),
                    className: "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-muted hover:bg-muted/80 transition-colors text-muted-foreground",
                    title: "Reset to defaults",
                    "data-ocid": `permissions.reset.${role.toLowerCase()}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 10 }),
                      " Reset"
                    ]
                  }
                )
              ] })
            ] })
          },
          role
        ))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: MODULES.map((mod) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border last:border-0 hover:bg-muted/10 transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "sticky left-0 z-10 bg-card px-3 py-2 font-medium text-foreground whitespace-nowrap", children: mod.label }),
            ALL_ROLES.map((role) => {
              var _a;
              const perms = ((_a = matrix[role]) == null ? void 0 : _a[mod.id]) ?? {};
              const isAdminRole = role === "Admin";
              return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-1", children: PERM_ACTIONS.map((action) => {
                const active = isAdminRole || !!perms[action.key];
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    title: `${role}: ${action.key.replace("can", "Can ")}`,
                    disabled: isAdminRole || !isAdmin,
                    onClick: () => togglePerm(role, mod.id, action.key),
                    className: cn(
                      "w-5 h-5 rounded text-[10px] font-bold transition-all border",
                      active ? cn(
                        "border-transparent",
                        action.color,
                        "bg-current/10"
                      ) : "border-border text-muted-foreground/30 bg-muted/20",
                      isAdminRole && "cursor-not-allowed opacity-80",
                      !isAdminRole && isAdmin && "cursor-pointer hover:scale-110",
                      !isAdmin && "cursor-default"
                    ),
                    "data-ocid": `permissions.${role.toLowerCase()}.${mod.id}.${action.key}`,
                    children: action.label
                  },
                  action.key
                );
              }) }) }, role);
            })
          ]
        },
        mod.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Admin role always has full access and cannot be modified. Changes take effect on next login." })
  ] });
}
function UserAccountsTab() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const currentRole = useAppStore((s) => s.currentRole);
  const isAdmin = currentRole === "Admin" || currentRole === "SuperAdmin";
  const { data: backendUsers = [], isLoading, refetch } = useGetAllUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const [search, setSearch] = reactExports.useState("");
  const [roleFilter, setRoleFilter] = reactExports.useState("all");
  const [open, setOpen] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    username: "",
    fullName: "",
    email: "",
    role: "Teacher",
    password: "",
    isActive: true
  });
  const [showPwdForm, setShowPwdForm] = reactExports.useState(false);
  const [formError, setFormError] = reactExports.useState("");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [resetUser, setResetUser] = reactExports.useState(null);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [showPwd, setShowPwd] = reactExports.useState(false);
  const [isResetting, setIsResetting] = reactExports.useState(false);
  const [deleteUser, setDeleteUser] = reactExports.useState(
    null
  );
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const filtered = reactExports.useMemo(
    () => backendUsers.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return u.fullName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
      }
      return true;
    }),
    [backendUsers, search, roleFilter]
  );
  function openAdd() {
    setForm({
      username: "",
      fullName: "",
      email: "",
      role: "Teacher",
      password: generatePassword(),
      isActive: true
    });
    setEditing(null);
    setFormError("");
    setShowPwdForm(false);
    setOpen(true);
  }
  function openEdit(u) {
    setForm({
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      password: "",
      isActive: u.isActive
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
    if (!editing) {
      const dup = backendUsers.find(
        (u) => u.username.toLowerCase() === form.username.toLowerCase()
      );
      if (dup) {
        setFormError(
          `Username "${form.username}" is already taken. Choose a different one.`
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
          isActive: form.isActive
        });
        ue.success("User updated successfully");
      } else {
        if (actor) {
          await actor.upsertAppUser(
            form.username,
            form.password,
            form.role,
            form.isActive
          );
          await qc.invalidateQueries({ queryKey: ["users"] });
          ue.success(`User "${form.username}" created successfully`);
        } else {
          await createUser.mutateAsync({
            username: form.username,
            fullName: form.fullName,
            role: form.role,
            permissions: []
          });
          ue.success("User created successfully");
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
  async function toggleActive(u) {
    try {
      await updateUser.mutateAsync({
        id: u.id,
        username: u.username,
        fullName: u.fullName,
        role: u.role,
        isActive: !u.isActive
      });
      refetch();
    } catch {
      ue.error("Failed to update user status.");
    }
  }
  function openReset(u) {
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
        newPassword
      );
      const displayPassword = typeof generated === "object" && generated !== null && "ok" in generated ? generated.ok ?? newPassword : newPassword;
      ue.success(
        `Password reset for ${resetUser.fullName}. New password: ${displayPassword}`
      );
      setResetUser(null);
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to reset password."
      );
    } finally {
      setIsResetting(false);
    }
  }
  async function confirmDelete() {
    if (!deleteUser || !actor) return;
    setIsDeleting(true);
    try {
      await updateUser.mutateAsync({
        id: deleteUser.id,
        username: deleteUser.username,
        fullName: deleteUser.fullName,
        role: deleteUser.role,
        isActive: false
      });
      ue.success(`User "${deleteUser.fullName}" deactivated successfully.`);
      setDeleteUser(null);
      refetch();
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to delete user."
      );
    } finally {
      setIsDeleting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 justify-between flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Search,
            {
              size: 13,
              className: "absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              className: "pl-8 h-8 text-xs w-52",
              placeholder: "Search users…",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              "data-ocid": "users.search_input"
            }
          ),
          search && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute right-2 top-1/2 -translate-y-1/2",
              onClick: () => setSearch(""),
              "data-ocid": "users.search_clear",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 12, className: "text-muted-foreground" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: roleFilter, onValueChange: setRoleFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 text-xs w-36",
              "data-ocid": "users.role_filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Roles" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Roles" }),
            ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: openAdd, "data-ocid": "users.add_button", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 14, className: "mr-1.5" }),
        " Add User"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden bg-card", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-center py-16 text-muted-foreground",
        "data-ocid": "users.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 22, className: "animate-spin mr-2" }),
          " Loading users…"
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-4 py-3 font-semibold text-muted-foreground", children: "Active" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-muted-foreground", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.map((u, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 table-row-alt hover:bg-muted/20 transition-colors",
            "data-ocid": `users.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: cn(
                      "size-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      u.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    ),
                    children: u.fullName.split(" ").slice(0, 2).map((w) => w[0]).join("")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: u.fullName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: u.email || u.username })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn(
                    "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                    ROLE_COLORS[u.role] ?? "bg-muted text-muted-foreground"
                  ),
                  children: u.role
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs font-mono", children: u.username }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: u.isActive,
                  onCheckedChange: () => toggleActive(u),
                  "data-ocid": `users.status.${i + 1}`
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8",
                    title: "Reset Password",
                    onClick: () => openReset(u),
                    "data-ocid": `users.reset_password.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 13 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8",
                    onClick: () => openEdit(u),
                    "data-ocid": `users.edit_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 })
                  }
                ),
                isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "size-8 text-destructive hover:text-destructive",
                    title: "Remove User",
                    onClick: () => setDeleteUser(u),
                    "data-ocid": `users.delete_button.${i + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 13 })
                  }
                )
              ] }) })
            ]
          },
          u.id
        )),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 5,
            className: "px-4 py-10 text-center text-muted-foreground text-sm",
            "data-ocid": "users.empty_state",
            children: "No users found."
          }
        ) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { style: { zIndex: 9999 }, "data-ocid": "users.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editing ? "Edit User" : "Add User" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "user-fullName", children: "Full Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "user-fullName",
                value: form.fullName,
                onChange: (e) => setForm((f) => ({ ...f, fullName: e.target.value })),
                placeholder: "Full name",
                "data-ocid": "users.fullname.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "user-username", children: [
              "Username ",
              !editing && "*"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "user-username",
                value: form.username,
                onChange: (e) => {
                  setForm((f) => ({ ...f, username: e.target.value }));
                  setFormError("");
                },
                placeholder: "e.g. rajesh.sharma",
                disabled: !!editing,
                "data-ocid": "users.username.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.role,
                onValueChange: (v) => setForm((f) => ({ ...f, role: v })),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "users.role.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r)) })
                ]
              }
            )
          ] }),
          !editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "user-password", children: "Password *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "user-password",
                  type: showPwdForm ? "text" : "password",
                  value: form.password,
                  onChange: (e) => setForm((f) => ({ ...f, password: e.target.value })),
                  placeholder: "Initial password",
                  className: "pr-10",
                  "data-ocid": "users.password.input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  tabIndex: -1,
                  onClick: () => setShowPwdForm((v) => !v),
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                  children: showPwdForm ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "user-email", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "user-email",
                type: "email",
                value: form.email,
                onChange: (e) => setForm((f) => ({ ...f, email: e.target.value })),
                placeholder: "user@school.in",
                "data-ocid": "users.email.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 col-span-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                checked: form.isActive,
                onCheckedChange: (v) => setForm((f) => ({ ...f, isActive: v })),
                "data-ocid": "users.active.switch"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "cursor-pointer", children: "Active" })
          ] })
        ] }),
        formError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2 border border-destructive/20",
            "data-ocid": "users.form.error_state",
            children: formError
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setOpen(false),
            disabled: isSaving,
            "data-ocid": "users.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: saveUser,
            disabled: isSaving || !form.fullName,
            "data-ocid": "users.submit_button",
            children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin mr-1.5" }),
              " Saving…"
            ] }) : editing ? "Save Changes" : "Add User"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!resetUser, onOpenChange: () => setResetUser(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      DialogContent,
      {
        style: { zIndex: 9999 },
        "data-ocid": "users.reset_password.dialog",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { size: 16, className: "text-accent" }),
            " Reset Password —",
            " ",
            resetUser == null ? void 0 : resetUser.fullName
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-3 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "A new password has been generated. Share it securely with the user." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 font-mono bg-muted/40 rounded-md px-3 py-2 text-sm border border-border", children: showPwd ? newPassword : "•".repeat(newPassword.length) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "size-9",
                  onClick: () => setShowPwd((v) => !v),
                  "data-ocid": "users.reset_password.toggle_show",
                  children: showPwd ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 15 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 15 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setNewPassword(generatePassword()),
                "data-ocid": "users.reset_password.regenerate_button",
                children: "Regenerate"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setResetUser(null),
                "data-ocid": "users.reset_password.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: confirmReset,
                disabled: isResetting,
                "data-ocid": "users.reset_password.confirm_button",
                children: [
                  isResetting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14, className: "mr-1.5" }),
                  "Confirm Reset"
                ]
              }
            )
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!deleteUser, onOpenChange: () => setDeleteUser(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { style: { zIndex: 9999 }, "data-ocid": "users.delete.dialog", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-destructive", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }),
        " Remove User — ",
        deleteUser == null ? void 0 : deleteUser.fullName
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "This will deactivate ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: deleteUser == null ? void 0 : deleteUser.fullName }),
        " (",
        deleteUser == null ? void 0 : deleteUser.username,
        "). They will no longer be able to log in."
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setDeleteUser(null),
            "data-ocid": "users.delete.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "destructive",
            onClick: confirmDelete,
            disabled: isDeleting,
            "data-ocid": "users.delete.confirm_button",
            children: [
              isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin mr-1.5" }) : null,
              "Deactivate User"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
function AuditLogTab() {
  const [userFilter, setUserFilter] = reactExports.useState("all");
  const [moduleFilter, setModuleFilter] = reactExports.useState("all");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const moduleNames = [...new Set(AUDIT_LOGS.map((l) => l.moduleName))];
  const userNames = [...new Set(AUDIT_LOGS.map((l) => l.userName))];
  const filtered = reactExports.useMemo(
    () => AUDIT_LOGS.filter((l) => {
      if (userFilter !== "all" && l.userName !== userFilter) return false;
      if (moduleFilter !== "all" && l.moduleName !== moduleFilter)
        return false;
      if (dateFrom && l.timestamp < dateFrom) return false;
      if (dateTo && l.timestamp > `${dateTo}T23:59:59`) return false;
      return true;
    }),
    [userFilter, moduleFilter, dateFrom, dateTo]
  );
  function exportLogs() {
    downloadCSV(
      filtered.map((l) => ({
        User: l.userName,
        Action: l.action,
        Module: l.moduleName,
        Details: l.details,
        Timestamp: l.timestamp
      })),
      "audit_log.csv"
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: userFilter, onValueChange: setUserFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 text-xs w-44",
              "data-ocid": "audit.user_filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Users" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Users" }),
            userNames.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: n, children: n }, n))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: moduleFilter, onValueChange: setModuleFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 text-xs w-40",
              "data-ocid": "audit.module_filter",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Modules" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Modules" }),
            moduleNames.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: m, children: m }, m))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              className: "h-8 text-xs w-36",
              value: dateFrom,
              onChange: (e) => setDateFrom(e.target.value),
              "data-ocid": "audit.date_from.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "to" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              className: "h-8 text-xs w-36",
              value: dateTo,
              onChange: (e) => setDateTo(e.target.value),
              "data-ocid": "audit.date_to.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: exportLogs,
          "data-ocid": "audit.export_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14, className: "mr-1.5" }),
            " Export"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40 sticky top-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Module" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 font-semibold text-muted-foreground", children: "Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 font-semibold text-muted-foreground", children: "Timestamp" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        filtered.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: "border-b border-border last:border-0 table-row-alt hover:bg-muted/20 transition-colors",
            "data-ocid": `audit.item.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground whitespace-nowrap", children: log.userName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: log.action }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-muted", children: log.moduleName }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  className: "px-4 py-3 text-muted-foreground text-xs max-w-sm truncate",
                  title: log.details,
                  children: log.details
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap", children: formatDateTime(log.timestamp) })
            ]
          },
          log.id
        )),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: 5,
            className: "px-4 py-10 text-center text-muted-foreground text-sm",
            "data-ocid": "audit.empty_state",
            children: "No audit log entries found."
          }
        ) })
      ] })
    ] }) })
  ] });
}
function UsersPage() {
  const [activeTab, setActiveTab] = reactExports.useState("accounts");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full min-h-0", "data-ocid": "users.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 py-4 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "User Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Accounts, role permissions, and audit trail" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: activeTab,
        onValueChange: setActiveTab,
        className: "flex flex-col flex-1 min-h-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b px-6 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsList,
            {
              className: "h-12 bg-transparent p-0 gap-1",
              "data-ocid": "users.tabs",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "accounts",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "users.accounts.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { size: 14 }),
                      " User Accounts"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "permissions",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "users.permissions.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 14 }),
                      " Role Permissions"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "audit",
                    className: "gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-3",
                    "data-ocid": "users.audit.tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 14 }),
                      " Audit Log"
                    ]
                  }
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-h-0 overflow-auto bg-background", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "accounts", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserAccountsTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "permissions", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RolePermissionsTab, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "audit", className: "m-0 p-0 h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuditLogTab, {}) })
          ] })
        ]
      }
    )
  ] });
}
export {
  UsersPage as default
};
