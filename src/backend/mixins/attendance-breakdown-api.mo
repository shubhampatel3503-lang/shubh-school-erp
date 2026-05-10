import Map  "mo:core/Map";
import List "mo:core/List";
import DevAttTypes "../types/device-attendance";

/// Attendance class/section and staff breakdown for dashboard widgets.
/// Also merges device attendance (face/RFID/ESSL/QR) with manual attendance.
mixin (
  attendance : Map.Map<Text, {
    id : Text; studentId : Text; date : Text;
    status : { #Present; #Absent; #Late; #Leave };
    remarks : ?Text; markedBy : Text;
  }>,
  students : Map.Map<Text, {
    id : Text; admNo : Text; fullName : Text; fatherName : Text; motherName : Text;
    fatherMobile : Text; motherMobile : ?Text; dateOfBirth : Text; gender : Text;
    currentAddress : Text;
    permanentAddress : Text;
    classLevel : { #PlayWay; #LKG; #UKG;
                   #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
                   #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 };
    sectionId : Text; session : Text; photoUrl : ?Text;
    status : { #Active; #Discontinued; #Graduated };
    bloodGroup : ?Text; religion : ?Text; category : ?Text;
    aadhaarNo : ?Text; transportRouteId : ?Text; transportPickupPointId : ?Text;
    busNo : ?Text; createdAt : Int;
    mobile : ?Text; srNo : ?Text; penNo : ?Text; apaarNo : ?Text;
    prevSchool : ?Text; admissionDate : ?Text;
  }>,
  sections : Map.Map<Text, {
    id : Text;
    classLevel : { #PlayWay; #LKG; #UKG;
                   #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
                   #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 };
    sectionName : Text; roomNo : ?Text; teacherId : ?Text;
  }>,
  staff : Map.Map<Text, {
    id : Text; employeeId : Text; fullName : Text; designation : Text;
    department : Text; mobile : Text; email : ?Text; address : Text;
    dateOfJoining : Text; salary : Nat;
    status : { #Active; #Inactive };
    photoUrl : ?Text; aadhaarNo : ?Text; bankAccount : ?Text;
    ifscCode : ?Text; createdAt : Int;
  }>,
  staffAttendance : Map.Map<Nat, DevAttTypes.StaffAttendanceRecord>,
  deviceAttendance : Map.Map<Nat, DevAttTypes.DeviceAttendanceRecord>,
) {

  public type AttendanceBreakdownRow = {
    classLevelText : Text;
    sectionId      : Text;
    sectionName    : Text;
    presentCount   : Nat;
    absentCount    : Nat;
    totalCount     : Nat;
  };

  public type StaffAttBreakdown = {
    presentCount : Nat;
    totalCount   : Nat;
    staffList    : [{ staffId : Text; name : Text; status : Text; inTime : ?Text; outTime : ?Text }];
  };

  func classLevelText(cl : { #PlayWay; #LKG; #UKG; #Class1; #Class2; #Class3; #Class4; #Class5; #Class6; #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 }) : Text {
    switch (cl) {
      case (#PlayWay) "Play Way"; case (#LKG) "LKG"; case (#UKG) "UKG";
      case (#Class1)  "Class 1";  case (#Class2)  "Class 2";  case (#Class3)  "Class 3";
      case (#Class4)  "Class 4";  case (#Class5)  "Class 5";  case (#Class6)  "Class 6";
      case (#Class7)  "Class 7";  case (#Class8)  "Class 8";  case (#Class9)  "Class 9";
      case (#Class10) "Class 10"; case (#Class11) "Class 11"; case (#Class12) "Class 12";
    }
  };

  /// Returns merged present student IDs for a date from manual + device attendance.
  /// studentId is Text in manual attendance; DeviceAttendanceRecord.studentId is Nat — convert to Text.
  func mergedPresentStudentIds(date : Text) : Map.Map<Text, Bool> {
    let presentSet = Map.empty<Text, Bool>();
    // Manual attendance
    for ((_, r) in attendance.entries()) {
      if (r.date == date) {
        switch (r.status) {
          case (#Present or #Late) { presentSet.add(r.studentId, true) };
          case _ {};
        };
      };
    };
    // Device attendance (face/RFID/ESSL/QR) — studentId is Nat, convert to Text
    for ((_, dr) in deviceAttendance.entries()) {
      if (dr.date == date) {
        presentSet.add(dr.studentId.toText(), true);
      };
    };
    presentSet
  };

  public query func getAttendanceBreakdown(date : Text, session : Text) : async [AttendanceBreakdownRow] {
    // Build studentId → present flag, merging manual + device attendance
    let presentIds = mergedPresentStudentIds(date);
    // Back-compat: also build a map including absent records from manual attendance
    let attMap = Map.empty<Text, { status : { #Present; #Absent; #Late; #Leave } }>();
    for ((_, r) in attendance.entries()) {
      if (r.date == date) {
        attMap.add(r.studentId, { status = r.status });
      };
    };

    // Accumulators per sectionId
    let sectionPresent = Map.empty<Text, Nat>();
    let sectionAbsent  = Map.empty<Text, Nat>();
    let sectionTotal   = Map.empty<Text, Nat>();

    for ((_, s) in students.entries()) {
      if (s.session == session and s.status == #Active) {
        let sid = s.sectionId;
        let tot = switch (sectionTotal.get(sid))   { case (?n) n; case null 0 };
        let pre = switch (sectionPresent.get(sid)) { case (?n) n; case null 0 };
        let abs = switch (sectionAbsent.get(sid))  { case (?n) n; case null 0 };
        sectionTotal.add(sid, tot + 1);
        // Present if in manual-present set OR in device attendance set
        if (presentIds.get(s.id) != null) {
          sectionPresent.add(sid, pre + 1);
        } else {
          switch (attMap.get(s.id)) {
            case (?att) {
              switch (att.status) {
                case (#Present or #Late)  { sectionPresent.add(sid, pre + 1) };
                case (#Absent  or #Leave) { sectionAbsent.add(sid, abs + 1) };
              };
            };
            case null { sectionAbsent.add(sid, abs + 1) };
          };
        };
      };
    };

    let result = List.empty<AttendanceBreakdownRow>();
    for ((secId, total) in sectionTotal.entries()) {
      let present = switch (sectionPresent.get(secId)) { case (?n) n; case null 0 };
      let absent  = switch (sectionAbsent.get(secId))  { case (?n) n; case null 0 };
      let (secName, clText) : (Text, Text) = switch (sections.get(secId)) {
        case (?sec) (sec.sectionName, classLevelText(sec.classLevel));
        case null ("", "");
      };
      result.add({
        classLevelText = clText;
        sectionId      = secId;
        sectionName    = secName;
        presentCount   = present;
        absentCount    = absent;
        totalCount     = total;
      });
    };
    result.toArray()
  };

  public query func getStaffAttendanceBreakdown(date : Text) : async StaffAttBreakdown {
    // Build staffId → attendance record for date
    let attMap = Map.empty<Text, DevAttTypes.StaffAttendanceRecord>();
    for ((_, r) in staffAttendance.entries()) {
      if (r.date == date) {
        attMap.add(r.staffId, r);
      };
    };

    var totalCount   : Nat = 0;
    var presentCount : Nat = 0;
    let staffList = List.empty<{ staffId : Text; name : Text; status : Text; inTime : ?Text; outTime : ?Text }>();

    for ((_, s) in staff.entries()) {
      if (s.status == #Active) {
        totalCount += 1;
        switch (attMap.get(s.id)) {
          case (?rec) {
            // Has an attendance record for today → Present
            presentCount += 1;
            staffList.add({
              staffId = s.id;
              name    = s.fullName;
              status  = "Present";
              inTime  = rec.inTime;
              outTime = rec.outTime;
            });
          };
          case null {
            staffList.add({
              staffId = s.id;
              name    = s.fullName;
              status  = "Absent";
              inTime  = null;
              outTime = null;
            });
          };
        };
      };
    };

    { presentCount; totalCount; staffList = staffList.toArray() }
  };

  /// Summary of today's attendance across ALL sources (manual + device) for both
  /// students and staff. Used by the dashboard Today Attendance widget.
  public type AttendanceSummaryToday = {
    presentStudents : Int;
    totalStudents   : Int;
    presentStaff    : Int;
    totalStaff      : Int;
  };

  public query func getAttendanceSummaryToday(date : Text, session : Text) : async AttendanceSummaryToday {
    // ── Students ─────────────────────────────────────────────────────────────
    let presentStudentIds = mergedPresentStudentIds(date);
    var totalStudents : Int = 0;
    var presentStudents : Int = 0;
    for ((_, s) in students.entries()) {
      if (s.session == session and s.status == #Active) {
        totalStudents += 1;
        if (presentStudentIds.get(s.id) != null) {
          presentStudents += 1;
        };
      };
    };

    // ── Staff ────────────────────────────────────────────────────────────────
    // Build staffId → present flag from device attendance records
    let presentStaffIds = Map.empty<Text, Bool>();
    for ((_, r) in staffAttendance.entries()) {
      if (r.date == date) {
        presentStaffIds.add(r.staffId, true);
      };
    };
    var totalStaff : Int = 0;
    var presentStaff : Int = 0;
    for ((_, s) in staff.entries()) {
      if (s.status == #Active) {
        totalStaff += 1;
        if (presentStaffIds.get(s.id) != null) {
          presentStaff += 1;
        };
      };
    };

    { presentStudents; totalStudents; presentStaff; totalStaff }
  };
}
