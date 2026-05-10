import Debug "mo:core/Debug";

/// Types for HR subject assignment with class range.
/// A teacher can be assigned a subject with a class range (e.g. Hindi, Class 2 to Class 6).
module {

  /// Represents a teacher's subject assignment with an optional class range.
  /// minClass and maxClass are human-readable labels like "Class 2", "Class 6", "Play Way", "LKG".
  /// When both are null the assignment covers a single class (classLevel).
  public type SubjectAssignment = {
    id          : Text;
    staffId     : Text;
    subjectId   : Text;
    subjectName : Text;   // denormalised for display
    minClass    : ?Text;  // e.g. "Class 2" — null means not ranged
    maxClass    : ?Text;  // e.g. "Class 6" — null means not ranged
    session     : Text;
    createdAt   : Int;
  };

  /// Lightweight view returned by getAllSubjectAssignments / getSubjectAssignmentsByStaff.
  public type SubjectAssignmentView = {
    id          : Text;
    staffId     : Text;
    staffName   : Text;
    subjectId   : Text;
    subjectName : Text;
    minClass    : ?Text;
    maxClass    : ?Text;
    session     : Text;
  };

}
