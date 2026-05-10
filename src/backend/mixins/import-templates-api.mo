import Debug "mo:core/Debug";

/// Public endpoint for downloading import CSV templates.
mixin () {

  /// Return a CSV string with headers + 2 example rows for the given module.
  /// module_ must be one of: "students" | "staff" | "fees"
  public query func getImportTemplate(module_ : Text) : async Text {
    Debug.todo()
  };
};
