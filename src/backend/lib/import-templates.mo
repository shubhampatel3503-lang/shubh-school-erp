import Debug "mo:core/Debug";

module {
  /// Return a CSV string (headers + 2 example rows) for the requested module.
  /// module_ must be one of: "students" | "staff" | "fees"
  /// Uses Indian conventions: INR (₹), class names (Play Way/LKG/UKG/Class 1-12), session YYYY-YY.
  public func getTemplate(module_ : Text) : Text {
    Debug.todo()
  };
};
