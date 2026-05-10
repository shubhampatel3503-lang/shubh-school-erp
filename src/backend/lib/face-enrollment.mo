import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/face-enrollment";

/// Domain logic for student face enrollment management.
module {

  /// Enroll a student's face (creates or updates the enrollment record).
  /// descriptorJson — JSON-serialised Float array (128 values) from face-api.js;
  ///                   pass empty string "" when only photo-URL enrollment is used.
  public func enroll(
    enrollments    : Map.Map<Text, Types.FaceEnrollmentRecord>,
    studentId      : Text,
    admNo          : Text,
    enrolledBy     : Text,
    photoUrl       : ?Text,
    descriptorJson : Text,
    date           : Text,
  ) : Types.FaceEnrollmentRecord {
    let rec : Types.FaceEnrollmentRecord = {
      studentId;
      admNo;
      faceEnrolled       = true;
      faceEnrollmentDate = ?date;
      enrolledBy;
      photoUrl;
      descriptorJson;
      updatedAt          = Time.now();
    };
    enrollments.add(studentId, rec);
    rec
  };

  /// Revoke / clear a student's face enrollment (sets faceEnrolled = false).
  public func revoke(
    enrollments : Map.Map<Text, Types.FaceEnrollmentRecord>,
    studentId   : Text,
  ) : () {
    switch (enrollments.get(studentId)) {
      case (?rec) {
        enrollments.add(studentId, {
          rec with
          faceEnrolled = false;
          updatedAt    = Time.now();
        })
      };
      case null {};
    }
  };

  /// Return the enrollment record for a single student.
  public func get(
    enrollments : Map.Map<Text, Types.FaceEnrollmentRecord>,
    studentId   : Text,
  ) : ?Types.FaceEnrollmentRecord {
    enrollments.get(studentId)
  };

  /// Return all enrolled student IDs (faceEnrolled = true, bare studentId keys only).
  public func getEnrolledIds(
    enrollments : Map.Map<Text, Types.FaceEnrollmentRecord>,
  ) : [Text] {
    enrollments.entries()
      |> List.fromIter<(Text, Types.FaceEnrollmentRecord)>(_)
      |> _.filterMap(
           func(kv) {
             let (k, v) = kv;
             // Skip attendance log entries keyed as "studentId#date"
             if (v.faceEnrolled and not k.contains(#char('#'))) { ?k } else { null }
           })
      |> _.toArray()
  };

  /// Return all enrollment records (bare studentId keys only — excludes attendance log entries).
  public func getAll(
    enrollments : Map.Map<Text, Types.FaceEnrollmentRecord>,
  ) : [Types.FaceEnrollmentRecord] {
    enrollments.entries()
      |> List.fromIter<(Text, Types.FaceEnrollmentRecord)>(_)
      |> _.filterMap<(Text, Types.FaceEnrollmentRecord), Types.FaceEnrollmentRecord>(
           func(kv) {
             let (k, v) = kv;
             if (k.contains(#char('#'))) { null } else { ?v }
           })
      |> _.toArray()
  };

  /// Check whether a student currently has an active face enrollment.
  public func isEnrolled(
    enrollments : Map.Map<Text, Types.FaceEnrollmentRecord>,
    studentId   : Text,
  ) : Bool {
    switch (enrollments.get(studentId)) {
      case (?rec) rec.faceEnrolled;
      case null   false;
    }
  };

}
