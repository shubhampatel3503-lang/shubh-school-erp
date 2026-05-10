import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import FELib "../lib/face-enrollment";
import FETypes "../types/face-enrollment";

/// Public API mixin for student face enrollment.
/// State slice injected: faceEnrollments (keyed by studentId for enrollment records,
/// and by "studentId#date" for face-attendance log entries).
mixin (
  faceEnrollments : Map.Map<Text, FETypes.FaceEnrollmentRecord>,
) {

  // ───────────────────────────────────────────────────────────────────────────
  // ENROLLMENT
  // ───────────────────────────────────────────────────────────────────────────

  /// Enroll a student's face for attendance recognition.
  /// Stores the photoUrl, descriptorJson (128-float JSON array from face-api.js),
  /// and sets faceEnrolled = true. Re-enrollment overwrites the existing record.
  public shared func enrollStudentFace(
    studentId      : Text,
    admNo          : Text,
    enrolledBy     : Text,
    photoUrl       : ?Text,
    descriptorJson : Text,
    date           : Text,
  ) : async { #ok : FETypes.FaceEnrollmentRecord; #err : Text } {
    if (studentId == "") {
      return #err("studentId must not be empty")
    };
    let rec = FELib.enroll(
      faceEnrollments, studentId, admNo, enrolledBy, photoUrl, descriptorJson, date
    );
    #ok(rec)
  };

  /// Remove a student's face enrollment — sets faceEnrolled = false.
  public shared func revokeFaceEnrollment(
    studentId : Text,
  ) : async { #ok : Text; #err : Text } {
    switch (faceEnrollments.get(studentId)) {
      case null {
        #err("No enrollment found for student: " # studentId)
      };
      case (?_) {
        FELib.revoke(faceEnrollments, studentId);
        #ok("Enrollment revoked")
      };
    }
  };

  /// Alias kept for backward compatibility (same as revokeFaceEnrollment).
  public shared func revokeStudentFaceEnrollment(
    studentId : Text,
  ) : async { #ok : Text; #err : Text } {
    switch (faceEnrollments.get(studentId)) {
      case null {
        #err("No enrollment found for student: " # studentId)
      };
      case (?_) {
        FELib.revoke(faceEnrollments, studentId);
        #ok("Enrollment revoked")
      };
    }
  };

  /// Return whether a student has an active face enrollment.
  public query func isFaceEnrolled(
    studentId : Text,
  ) : async Bool {
    FELib.isEnrolled(faceEnrollments, studentId)
  };

  /// Return the face enrollment record for a specific student, if any.
  public query func getStudentFaceEnrollment(
    studentId : Text,
  ) : async ?FETypes.FaceEnrollmentRecord {
    FELib.get(faceEnrollments, studentId)
  };

  /// Return all enrolled student IDs (faceEnrolled = true).
  public query func getEnrolledStudentIds() : async [Text] {
    FELib.getEnrolledIds(faceEnrollments)
  };

  /// Return all currently active (faceEnrolled = true) enrollment records
  /// together with their descriptorJson so the client can load face descriptors
  /// and continuously recognise faces from camera frames.
  public query func getFaceEnrolledStudents() : async [FETypes.FaceEnrollmentRecord] {
    FELib.getAll(faceEnrollments)
      |> List.fromArray<FETypes.FaceEnrollmentRecord>(_)
      |> _.filter(func(r : FETypes.FaceEnrollmentRecord) : Bool { r.faceEnrolled })
      |> _.toArray()
  };

  /// Return all face enrollment records (enrolled and revoked), excluding
  /// attendance log entries (which are keyed with "#" in their key).
  public query func getAllFaceEnrollments() : async [FETypes.FaceEnrollmentRecord] {
    FELib.getAll(faceEnrollments)
  };

  // ───────────────────────────────────────────────────────────────────────────
  // FACE ATTENDANCE LOG
  // ───────────────────────────────────────────────────────────────────────────

  /// Mark face attendance for a student identified by the client-side
  /// face-recognition engine (face-api.js running in the browser).
  /// confidence — match score between 0.0 and 1.0.
  /// Creates a lightweight attendance log entry keyed by "studentId#date"
  /// alongside the full DeviceAttendanceRecord written by device-attendance-api.
  public shared func markFaceAttendance(
    studentId   : Text,
    studentName : Text,
    classLevel  : Text,
    section     : Text,
    date        : Text,
    time        : Text,
    confidence  : Float,
  ) : async { #ok : Text; #err : Text } {
    if (studentId == "") {
      return #err("studentId must not be empty")
    };
    // Verify the student has an active face enrollment
    switch (faceEnrollments.get(studentId)) {
      case null {
        return #err("Student not enrolled for face attendance: " # studentId)
      };
      case (?rec) {
        if (not rec.faceEnrolled) {
          return #err("Face enrollment revoked for student: " # studentId)
        };
      };
    };
    // Store face-attendance log entry keyed by studentId#date
    let logKey = studentId # "#" # date;
    let logRec : FETypes.FaceEnrollmentRecord = {
      studentId;
      admNo              = (switch (faceEnrollments.get(studentId)) {
        case (?r) r.admNo;
        case null "";
      });
      faceEnrolled       = true;
      faceEnrollmentDate = ?date;
      enrolledBy         = "face-auto";
      photoUrl           = ?("conf:" # debug_show(confidence) # ";time:" # time # ";cls:" # classLevel # ";sec:" # section);
      descriptorJson     = "";
      updatedAt          = Time.now();
    };
    faceEnrollments.add(logKey, logRec);
    #ok("Attendance marked for " # studentName # " at " # time)
  };

  /// Return all face-attendance log entries for a given date (returns records
  /// whose key matches "*#<date>" pattern).
  public query func getFaceAttendanceByDate(
    date : Text,
  ) : async [FETypes.FaceEnrollmentRecord] {
    let suffix = "#" # date;
    faceEnrollments.entries()
      |> List.fromIter<(Text, FETypes.FaceEnrollmentRecord)>(_)
      |> _.filterMap<(Text, FETypes.FaceEnrollmentRecord), FETypes.FaceEnrollmentRecord>(
           func(kv) {
             let (k, v) = kv;
             if (k.endsWith(#text suffix)) { ?v } else { null }
           })
      |> _.toArray()
  };

}
