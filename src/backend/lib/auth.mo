import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Types "../types/auth";

module {

  public type AppUser = Types.AppUser;
  public type UserRole = Types.UserRole;
  public type LoginResult = Types.LoginResult;
  public type ModulePermission = Types.ModulePermission;
  public type RolePermissions = Types.RolePermissions;

  // Passwords are stored as-is (hashing deferred; IC canister state is
  // not externally readable outside of controller access).
  func encodePassword(plain : Text) : Text { plain };

  /// Seed the default admin user into the map if absent.
  public func seedAdmin(appUsers : Map.Map<Text, AppUser>, nextUserId : { var value : Nat }) : () {
    if (appUsers.containsKey("admin")) return;
    let id = nextUserId.value;
    nextUserId.value += 1;
    appUsers.add("admin", {
      id;
      username     = "admin";
      passwordHash = encodePassword("admin123");
      role         = #Admin;
      isActive     = true;
    });
  };

  /// Register a non-admin user into appUsers so loginUser() can authenticate them.
  /// Idempotent: if username already exists the entry is updated in place.
  public func registerUser(
    appUsers   : Map.Map<Text, AppUser>,
    nextUserId : { var value : Nat },
    username   : Text,
    password   : Text,
    role       : UserRole
  ) : () {
    switch (appUsers.get(username)) {
      case (?existing) {
        // Update password and role; preserve id
        appUsers.add(username, { existing with
          passwordHash = encodePassword(password);
          role;
        });
      };
      case null {
        let id = nextUserId.value;
        nextUserId.value += 1;
        appUsers.add(username, {
          id;
          username;
          passwordHash = encodePassword(password);
          role;
          isActive = true;
        });
      };
    };
  };

  /// Validate username + password.
  public func login(
    appUsers : Map.Map<Text, AppUser>,
    username : Text,
    password : Text
  ) : LoginResult {
    switch (appUsers.get(username)) {
      case null    { #err("Invalid username or password") };
      case (?user) {
        if (not user.isActive) { return #err("Account is disabled") };
        if (user.passwordHash != encodePassword(password)) {
          return #err("Invalid username or password")
        };
        #ok({ userId = user.id; username = user.username; role = roleToText(user.role) })
      };
    }
  };

  /// Convert UserRole variant to Text.
  public func roleToText(role : UserRole) : Text {
    switch (role) {
      case (#Admin)      "Admin";
      case (#Principal)  "Principal";
      case (#Teacher)    "Teacher";
      case (#Student)    "Student";
      case (#Parent)     "Parent";
      case (#Accountant) "Accountant";
      case (#Librarian)  "Librarian";
      case (#Driver)     "Driver";
    }
  };

  /// Convert Text to UserRole variant.
  public func textToRole(text : Text) : ?UserRole {
    switch (text) {
      case "Admin"      ?#Admin;
      case "Principal"  ?#Principal;
      case "Teacher"    ?#Teacher;
      case "Student"    ?#Student;
      case "Parent"     ?#Parent;
      case "Accountant" ?#Accountant;
      case "Librarian"  ?#Librarian;
      case "Driver"     ?#Driver;
      case _            null;
    }
  };

  /// Encode a plain-text password (for upsert in mixin).
  public func doHashPassword(plain : Text) : Text { encodePassword(plain) };

  // ── Permission helpers ────────────────────────────────────────────────

  let ALL_MODULES : [Text] = [
    "academics", "students", "fees", "attendance", "hr",
    "transport", "reports", "communication", "library",
    "inventory", "analytics", "expenses", "settings",
    "users", "timetable", "examination", "syllabus", "chat"
  ];

  func fullPerm(moduleId : Text) : ModulePermission {
    { moduleId; canView = true; canCreate = true; canEdit = true; canDelete = true; canExport = true }
  };
  func viewOnly(moduleId : Text) : ModulePermission {
    { moduleId; canView = true; canCreate = false; canEdit = false; canDelete = false; canExport = false }
  };
  func viewExport(moduleId : Text) : ModulePermission {
    { moduleId; canView = true; canCreate = false; canEdit = false; canDelete = false; canExport = true }
  };
  func noAccess(moduleId : Text) : ModulePermission {
    { moduleId; canView = false; canCreate = false; canEdit = false; canDelete = false; canExport = false }
  };
  func viewCreate(moduleId : Text) : ModulePermission {
    { moduleId; canView = true; canCreate = true; canEdit = false; canDelete = false; canExport = false }
  };
  func viewCreateEdit(moduleId : Text) : ModulePermission {
    { moduleId; canView = true; canCreate = true; canEdit = true; canDelete = false; canExport = true }
  };

  public func defaultRolePermissions() : [RolePermissions] {
    [
      { role = #Admin;
        modulePermissions = ALL_MODULES.map<Text, ModulePermission>(func m = fullPerm(m)) },
      { role = #Principal;
        modulePermissions = ALL_MODULES.map<Text, ModulePermission>(func m {
          if (m == "users" or m == "settings") viewOnly(m) else viewCreateEdit(m)
        }) },
      { role = #Accountant;
        modulePermissions = ALL_MODULES.map<Text, ModulePermission>(func m {
          switch (m) {
            case "fees"          fullPerm(m);
            case "reports"       viewExport(m);
            case "students"      viewOnly(m);
            case "communication" viewCreate(m);
            case "inventory"     viewExport(m);
            case "expenses"      viewExport(m);
            case _               noAccess(m);
          }
        }) },
      { role = #Teacher;
        modulePermissions = ALL_MODULES.map<Text, ModulePermission>(func m {
          switch (m) {
            case "academics"   fullPerm(m);
            case "syllabus"    fullPerm(m);
            case "students"    viewOnly(m);
            case "attendance"  viewCreate(m);
            case "timetable"   viewOnly(m);
            case "examination" viewOnly(m);
            case "chat"        viewCreate(m);
            case "reports"     viewExport(m);
            case _             noAccess(m);
          }
        }) },
      { role = #Student;
        modulePermissions = ALL_MODULES.map<Text, ModulePermission>(func m {
          switch (m) {
            case "academics"  viewOnly(m);
            case "fees"       viewOnly(m);
            case "attendance" viewOnly(m);
            case "syllabus"   viewOnly(m);
            case "chat"       viewCreate(m);
            case _            noAccess(m);
          }
        }) },
      { role = #Parent;
        modulePermissions = ALL_MODULES.map<Text, ModulePermission>(func m {
          switch (m) {
            case "fees"       viewOnly(m);
            case "attendance" viewOnly(m);
            case _            noAccess(m);
          }
        }) },
      { role = #Driver;
        modulePermissions = ALL_MODULES.map<Text, ModulePermission>(func m {
          switch (m) {
            case "transport"  viewCreateEdit(m);
            case "attendance" viewCreate(m);
            case _            noAccess(m);
          }
        }) },
      { role = #Librarian;
        modulePermissions = ALL_MODULES.map<Text, ModulePermission>(func m {
          switch (m) {
            case "library"  fullPerm(m);
            case "students" viewOnly(m);
            case _          noAccess(m);
          }
        }) },
    ]
  };

  /// Seed default role permissions into the store (no-op if already populated).
  public func seedRolePermissions(store : Map.Map<Text, RolePermissions>) : () {
    if (not store.isEmpty()) return;
    for (rp in defaultRolePermissions().values()) {
      store.add(roleToText(rp.role), rp);
    };
  };

  /// Check if a role has a specific permission action on a module.
  public func checkPerm(
    store    : Map.Map<Text, RolePermissions>,
    role     : UserRole,
    moduleId : Text,
    action   : Text
  ) : Bool {
    switch (store.get(roleToText(role))) {
      case null false;
      case (?rp) {
        switch (rp.modulePermissions.find(func(mp : ModulePermission) : Bool { mp.moduleId == moduleId })) {
          case null false;
          case (?mp) {
            switch (action) {
              case "view"   mp.canView;
              case "create" mp.canCreate;
              case "edit"   mp.canEdit;
              case "delete" mp.canDelete;
              case "export" mp.canExport;
              case _        false;
            }
          };
        }
      };
    }
  };

};
