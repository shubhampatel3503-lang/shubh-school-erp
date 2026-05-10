import Map  "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";

/// Custom student profile columns — admin-configurable extra fields.
mixin (
  customColumnDefs   : Map.Map<Text, { key : Text; columnLabel : Text; fieldType : Text }>,
  studentCustomData  : Map.Map<Text, Map.Map<Text, Text>>,
) {

  public shared func saveCustomStudentColumns(
    columns : [{ key : Text; columnLabel : Text; fieldType : Text }]
  ) : async () {
    customColumnDefs.clear();
    for (col in columns.values()) {
      customColumnDefs.add(col.key, col);
    };
  };

  public query func getCustomStudentColumns() : async [{ key : Text; columnLabel : Text; fieldType : Text }] {
    let l = List.empty<{ key : Text; columnLabel : Text; fieldType : Text }>();
    for ((_, col) in customColumnDefs.entries()) { l.add(col) };
    l.toArray()
  };

  public shared func updateStudentCustomData(studentId : Text, customData : [(Text, Text)]) : async () {
    let m = switch (studentCustomData.get(studentId)) {
      case (?existing) existing;
      case null {
        let fresh = Map.empty<Text, Text>();
        studentCustomData.add(studentId, fresh);
        fresh
      };
    };
    for ((k, v) in customData.values()) {
      m.add(k, v);
    };
  };

  public query func getStudentCustomData(studentId : Text) : async [(Text, Text)] {
    switch (studentCustomData.get(studentId)) {
      case (?m) m.toArray();
      case null [];
    }
  };
}
