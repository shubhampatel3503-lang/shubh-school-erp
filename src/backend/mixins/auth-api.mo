import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import AuthLib "../lib/auth";
import AuthTypes "../types/auth";
import Nat "mo:core/Nat";

/// Auth mixin — username/password login, user management, and role permissions.
mixin (
  appUsers           : Map.Map<Text, AuthTypes.AppUser>,
  nextAppUserId      : { var value : Nat },
  rolePermissions    : Map.Map<Text, AuthTypes.RolePermissions>,
  userRoleMap        : Map.Map<Text, AuthTypes.UserRole>   // userId (Text) -> role
) {

  // ── Login ────────────────────────────────────────────────────────────────

  /// Authenticate with username + password.
  public shared func loginUser(
    username : Text,
    password : Text
  ) : async { #ok : { userId : Nat; username : Text; role : Text }; #err : Text } {
    AuthLib.login(appUsers, username, password)
  };

  // ── User management ──────────────────────────────────────────────────

  /// Return all app users.
  public query func getAppUsers() : async [AuthTypes.AppUser] {
    appUsers.values() |> List.fromIter<AuthTypes.AppUser>(_) |> _.toArray()
  };

  /// Create or update an app user.
  public shared func upsertAppUser(
    username : Text,
    password : Text,
    role     : Text,
    isActive : Bool
  ) : async Nat {
    let resolvedRole = switch (AuthLib.textToRole(role)) {
      case (?r) r;
      case null #Teacher;  // safe fallback
    };
    switch (appUsers.get(username)) {
      case (?existing) {
        // Update in-place
        let updated : AuthTypes.AppUser = {
          existing with
          passwordHash = if (password == "") existing.passwordHash else AuthLib.doHashPassword(password);
          role         = resolvedRole;
          isActive;
        };
        appUsers.add(username, updated);
        // Sync role map
        userRoleMap.add(existing.id.toText(), resolvedRole);
        existing.id
      };
      case null {
        let id = nextAppUserId.value;
        nextAppUserId.value += 1;
        let newUser : AuthTypes.AppUser = {
          id;
          username;
          passwordHash = AuthLib.doHashPassword(password);
          role         = resolvedRole;
          isActive;
        };
        appUsers.add(username, newUser);
        userRoleMap.add(id.toText(), resolvedRole);
        id
      };
    }
  };

  /// Change password for the authenticated user (old password required).
  public shared func changePassword(
    username    : Text,
    oldPassword : Text,
    newPassword : Text
  ) : async { #ok; #err : Text } {
    switch (appUsers.get(username)) {
      case null { #err("User not found") };
      case (?user) {
        if (not user.isActive) { return #err("Account is disabled") };
        if (user.passwordHash != AuthLib.doHashPassword(oldPassword)) {
          return #err("Current password is incorrect")
        };
        if (newPassword.size() < 4) {
          return #err("New password must be at least 4 characters")
        };
        appUsers.add(username, { user with passwordHash = AuthLib.doHashPassword(newPassword) });
        #ok
      };
    }
  };

  /// Admin-only: forcefully reset a user's password without knowing the old one.
  public shared func resetUserPasswordAdmin(
    adminUsername : Text,
    targetUsername : Text,
    newPassword    : Text
  ) : async { #ok; #err : Text } {
    // Verify caller is admin
    switch (appUsers.get(adminUsername)) {
      case null { return #err("Admin not found") };
      case (?admin) {
        if (admin.role != #Admin) { return #err("Only Admin can reset passwords") };
      };
    };
    switch (appUsers.get(targetUsername)) {
      case null { #err("Target user not found") };
      case (?user) {
        appUsers.add(targetUsername, { user with passwordHash = AuthLib.doHashPassword(newPassword) });
        #ok
      };
    }
  };

  /// Toggle isActive status for a user by username.
  public shared func setAppUserActive(username : Text, isActive : Bool) : async Bool {
    switch (appUsers.get(username)) {
      case null    false;
      case (?user) {
        appUsers.add(username, { user with isActive });
        true
      };
    }
  };

  // ── Role permissions ────────────────────────────────────────────────

  /// Return stored role permissions for all roles.
  public query func getRolePermissions() : async [AuthTypes.RolePermissions] {
    rolePermissions.values() |> List.fromIter<AuthTypes.RolePermissions>(_) |> _.toArray()
  };

  /// Admin-callable: replace the module permissions for a specific role.
  public shared ({ caller = _ }) func updateRolePermissions(
    role        : AuthTypes.UserRole,
    permissions : [AuthTypes.ModulePermission]
  ) : async () {
    let roleKey = AuthLib.roleToText(role);
    let current : AuthTypes.RolePermissions = switch (rolePermissions.get(roleKey)) {
      case (?rp) rp;
      case null  ({ role = role; modulePermissions = [] });
    };
    rolePermissions.add(roleKey, { current with modulePermissions = permissions });
  };

  /// Check whether a user (by userId Text) has a permission on a module.
  public query func checkPermission(userId : Text, moduleId : Text, action : Text) : async Bool {
    let role = switch (userRoleMap.get(userId)) {
      case (?r) r;
      case null return false;
    };
    AuthLib.checkPerm(rolePermissions, role, moduleId, action)
  };

  /// Return the full module permission list for the user's role.
  public query func getUserPermissions(userId : Text) : async [AuthTypes.ModulePermission] {
    let role = switch (userRoleMap.get(userId)) {
      case (?r) r;
      case null return [];
    };
    let roleKey = AuthLib.roleToText(role);
    switch (rolePermissions.get(roleKey)) {
      case null  [];
      case (?rp) rp.modulePermissions;
    }
  };

};
