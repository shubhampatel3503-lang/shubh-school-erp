import Map "mo:core/Map";
import Nat "mo:core/Nat";
import SALib "../lib/subject-assignment";
import SATypes "../types/subject-assignment";

/// Public API mixin for HR subject assignments.
mixin (
  subjectAssignments : Map.Map<Text, SATypes.SubjectAssignment>,
  genSubjectAssignId : { var value : Nat },
) {

  /// Add a new subject assignment for a staff member with an optional class range.
  /// minClass / maxClass are human-readable labels like "Class 2" or "Play Way".
  public shared func addSubjectAssignment(
    staffId     : Text,
    subjectId   : Text,
    subjectName : Text,
    minClass    : ?Text,
    maxClass    : ?Text,
    session     : Text,
  ) : async { #ok : SATypes.SubjectAssignment; #err : Text } {
    let genId = func() : Text {
      genSubjectAssignId.value += 1;
      genSubjectAssignId.value.toText();
    };
    let record = SALib.create(subjectAssignments, genId, staffId, subjectId, subjectName, minClass, maxClass, session);
    #ok(record);
  };

  /// Update an existing subject assignment.
  public shared func updateSubjectAssignment(
    id          : Text,
    subjectId   : Text,
    subjectName : Text,
    minClass    : ?Text,
    maxClass    : ?Text,
    session     : Text,
  ) : async { #ok : Text; #err : Text } {
    if (SALib.update(subjectAssignments, id, subjectId, subjectName, minClass, maxClass, session)) {
      #ok(id);
    } else {
      #err("Subject assignment not found: " # id);
    };
  };

  /// Delete a subject assignment.
  public shared func deleteSubjectAssignment(
    id : Text,
  ) : async { #ok : Text; #err : Text } {
    SALib.remove(subjectAssignments, id);
    #ok(id);
  };

  /// Get all subject assignments for a specific staff member.
  public query func getSubjectAssignments(
    staffId : Text,
  ) : async [SATypes.SubjectAssignment] {
    SALib.getByStaff(subjectAssignments, staffId);
  };

  /// Get all subject assignments across all staff members.
  public query func getAllSubjectAssignments() : async [SATypes.SubjectAssignment] {
    SALib.getAll(subjectAssignments);
  };

}
