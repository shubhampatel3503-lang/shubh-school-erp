import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/subject-assignment";

/// Domain logic for HR subject assignments with class ranges.
module {

  /// Create a new SubjectAssignment record.
  public func create(
    assignments : Map.Map<Text, Types.SubjectAssignment>,
    genId       : () -> Text,
    staffId     : Text,
    subjectId   : Text,
    subjectName : Text,
    minClass    : ?Text,
    maxClass    : ?Text,
    session     : Text,
  ) : Types.SubjectAssignment {
    let id = genId();
    let assignment : Types.SubjectAssignment = {
      id;
      staffId;
      subjectId;
      subjectName;
      minClass;
      maxClass;
      session;
      createdAt = Time.now();
    };
    assignments.add(id, assignment);
    assignment
  };

  /// Update an existing SubjectAssignment.
  public func update(
    assignments : Map.Map<Text, Types.SubjectAssignment>,
    id          : Text,
    subjectId   : Text,
    subjectName : Text,
    minClass    : ?Text,
    maxClass    : ?Text,
    session     : Text,
  ) : Bool {
    switch (assignments.get(id)) {
      case (?existing) {
        assignments.add(id, { existing with subjectId; subjectName; minClass; maxClass; session });
        true
      };
      case null false;
    }
  };

  /// Delete a SubjectAssignment by id.
  public func remove(
    assignments : Map.Map<Text, Types.SubjectAssignment>,
    id          : Text,
  ) : () {
    assignments.remove(id)
  };

  /// Return all assignments for a given staffId.
  public func getByStaff(
    assignments : Map.Map<Text, Types.SubjectAssignment>,
    staffId     : Text,
  ) : [Types.SubjectAssignment] {
    let iter = assignments.values().filter(func(a : Types.SubjectAssignment) : Bool { a.staffId == staffId });
    iter.toArray();
  };

  /// Return all assignments across all staff.
  public func getAll(
    assignments : Map.Map<Text, Types.SubjectAssignment>,
  ) : [Types.SubjectAssignment] {
    assignments.values().toArray();
  };

}
