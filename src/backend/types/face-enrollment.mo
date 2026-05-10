/// Types for student face enrollment (using student photo or camera capture).
module {

  /// Enrollment record for a student's face data.
  /// When faceEnrolled is true the student can be identified by camera attendance.
  /// descriptorJson stores a JSON-serialised Float array (128 values from face-api.js)
  /// so the descriptor survives canister upgrades in plain Text form.
  public type FaceEnrollmentRecord = {
    studentId          : Text;
    admNo              : Text;   // admission number — used as lookup key by face-api.js
    faceEnrolled       : Bool;
    faceEnrollmentDate : ?Text;  // dd/mm/yyyy when enrolled
    enrolledBy         : Text;   // username of enroller
    photoUrl           : ?Text;  // source photo used for enrollment
    descriptorJson     : Text;   // JSON array of 128 floats from face-api.js (\"{}\") or empty
    updatedAt          : Int;
  };

  /// Joined view returned to the frontend — enrollment record + student display fields.
  public type FaceEnrollmentView = {
    studentId  : Text;
    admNo      : Text;
    name       : Text;
    classLevel : Text;
    section    : Text;
    photoUrl   : ?Text;
    descriptorJson : Text;
    enrolled   : Bool;
    enrolledAt : ?Text;
    enrolledBy : Text;
  };

}
