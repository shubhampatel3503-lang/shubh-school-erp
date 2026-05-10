module {

  public type UserRole = {
    #Admin;
    #Principal;
    #Teacher;
    #Student;
    #Parent;
    #Accountant;
    #Librarian;
    #Driver;
  };

  public type AppUser = {
    id : Nat;
    username : Text;
    passwordHash : Text;
    role : UserRole;
    isActive : Bool;
  };

  public type LoginResult = {
    #ok : { userId : Nat; username : Text; role : Text };
    #err : Text;
  };

  /// Per-module permission flags for a given role.
  public type ModulePermission = {
    moduleId  : Text;   // e.g. "students", "fees", "hr"
    canView   : Bool;
    canCreate : Bool;
    canEdit   : Bool;
    canDelete : Bool;
    canExport : Bool;
  };

  /// Full permission set for one role.
  public type RolePermissions = {
    role              : UserRole;
    modulePermissions : [ModulePermission];
  };

};
