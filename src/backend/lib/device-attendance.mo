import Map "mo:core/Map";
import List "mo:core/List";
import Types "../types/device-attendance";

module {

  public type DeviceAttendanceRecord = Types.DeviceAttendanceRecord;
  public type StaffAttendanceRecord  = Types.StaffAttendanceRecord;
  public type AttendanceDevice       = Types.AttendanceDevice;
  public type PayrollCalculation     = Types.PayrollCalculation;

  // ─── Student device attendance ────────────────────────────────────────────

  /// Save a student device attendance record and return its assigned id.
  public func record(
    deviceAttendance : Map.Map<Nat, DeviceAttendanceRecord>,
    nextId : { var value : Nat },
    rec : DeviceAttendanceRecord
  ) : Nat {
    let id = nextId.value;
    nextId.value += 1;
    deviceAttendance.add(id, { rec with id });
    id
  };

  /// Update the outTime for an existing student record. Returns true if found.
  public func markOut(
    deviceAttendance : Map.Map<Nat, DeviceAttendanceRecord>,
    recordId : Nat,
    outTime : Text
  ) : Bool {
    switch (deviceAttendance.get(recordId)) {
      case (?rec) {
        deviceAttendance.add(recordId, { rec with outTime = ?outTime });
        true
      };
      case null false;
    }
  };

  /// Return all student records for a given date.
  public func getByDate(
    deviceAttendance : Map.Map<Nat, DeviceAttendanceRecord>,
    date : Text
  ) : [DeviceAttendanceRecord] {
    deviceAttendance.values()
      |> List.fromIter<DeviceAttendanceRecord>(_)
      |> _.filter(func(r : DeviceAttendanceRecord) : Bool { r.date == date })
      |> _.toArray()
  };

  /// Return all student records for a given student id.
  public func getByStudent(
    deviceAttendance : Map.Map<Nat, DeviceAttendanceRecord>,
    studentId : Nat
  ) : [DeviceAttendanceRecord] {
    deviceAttendance.values()
      |> List.fromIter<DeviceAttendanceRecord>(_)
      |> _.filter(func(r : DeviceAttendanceRecord) : Bool { r.studentId == studentId })
      |> _.toArray()
  };

  /// Return student records filtered by date and device type text tag.
  public func getByDateAndType(
    deviceAttendance : Map.Map<Nat, DeviceAttendanceRecord>,
    date : Text,
    deviceTypeTag : Text
  ) : [DeviceAttendanceRecord] {
    deviceAttendance.values()
      |> List.fromIter<DeviceAttendanceRecord>(_)
      |> _.filter(func(r : DeviceAttendanceRecord) : Bool {
          r.date == date and deviceToText(r.deviceType) == deviceTypeTag
        })
      |> _.toArray()
  };

  // ─── Staff device attendance ──────────────────────────────────────────────

  /// Record a staff attendance IN entry. Returns the new record id.
  public func recordStaff(
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    nextId : { var value : Nat },
    staffId : Text,
    staffName : Text,
    date : Text,
    month : Nat,
    year : Nat,
    deviceType : AttendanceDevice,
    inTime : Text
  ) : Nat {
    let id = nextId.value;
    nextId.value += 1;
    let rec : StaffAttendanceRecord = {
      id; staffId; staffName; deviceType;
      inTime = ?inTime; outTime = null;
      date; month; year;
    };
    staffAttendance.add(id, rec);
    id
  };

  /// Update the outTime for a staff attendance record. Returns true if found.
  public func markStaffOut(
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    recordId : Nat,
    outTime : Text
  ) : Bool {
    switch (staffAttendance.get(recordId)) {
      case (?rec) {
        staffAttendance.add(recordId, { rec with outTime = ?outTime });
        true
      };
      case null false;
    }
  };

  /// Return all staff attendance records for a given date.
  public func getStaffByDate(
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    date : Text
  ) : [StaffAttendanceRecord] {
    staffAttendance.values()
      |> List.fromIter<StaffAttendanceRecord>(_)
      |> _.filter(func(r : StaffAttendanceRecord) : Bool { r.date == date })
      |> _.toArray()
  };

  /// Return all staff attendance records for a given staff member.
  public func getByStaff(
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    staffId : Text
  ) : [StaffAttendanceRecord] {
    staffAttendance.values()
      |> List.fromIter<StaffAttendanceRecord>(_)
      |> _.filter(func(r : StaffAttendanceRecord) : Bool { r.staffId == staffId })
      |> _.toArray()
  };

  /// Return staff attendance records filtered by date and device type tag.
  public func getStaffByDateAndType(
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    date : Text,
    deviceTypeTag : Text
  ) : [StaffAttendanceRecord] {
    staffAttendance.values()
      |> List.fromIter<StaffAttendanceRecord>(_)
      |> _.filter(func(r : StaffAttendanceRecord) : Bool {
          r.date == date and deviceToText(r.deviceType) == deviceTypeTag
        })
      |> _.toArray()
  };

  /// Return all staff attendance records for a given staff member in a specific month/year.
  public func getByStaffAndMonth(
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    staffId : Text,
    month : Nat,
    year : Nat
  ) : [StaffAttendanceRecord] {
    staffAttendance.values()
      |> List.fromIter<StaffAttendanceRecord>(_)
      |> _.filter(func(r : StaffAttendanceRecord) : Bool {
          r.staffId == staffId and r.month == month and r.year == year
        })
      |> _.toArray()
  };

  /// Calculate payroll for a staff member based on attendance records.
  /// workingDays — total working days in the month as set by admin.
  /// staffSalary — the staff's monthly salary.
  public func calculatePayroll(
    staffAttendance : Map.Map<Nat, StaffAttendanceRecord>,
    staffId : Text,
    staffName : Text,
    staffSalary : Nat,
    month : Nat,
    year : Nat,
    workingDays : Nat
  ) : PayrollCalculation {
    let records = getByStaffAndMonth(staffAttendance, staffId, month, year);

    // Count unique dates (each date = 1 present day)
    let dateSet = Map.empty<Text, Bool>();
    var faceCount    : Nat = 0;
    var rfidCount    : Nat = 0;
    var biometricCount : Nat = 0;
    var qrCount      : Nat = 0;

    for (r in records.values()) {
      dateSet.add(r.date, true);
      switch (r.deviceType) {
        case (#Face)          { faceCount      += 1 };
        case (#RFID)          { rfidCount      += 1 };
        case (#ESSLBiometric) { biometricCount += 1 };
        case (#QR)            { qrCount        += 1 };
      }
    };

    let presentDays = dateSet.size();
    let absentDays  = if (workingDays >= presentDays) { Nat.sub(workingDays, presentDays) } else { 0 };

    // netPay = (presentDays / workingDays) × monthlySalary  (integer arithmetic)
    let netPay : Nat =
      if (workingDays == 0) { 0 }
      else { staffSalary * presentDays / workingDays };

    {
      staffId;
      staffName;
      month;
      year;
      monthlySalary  = staffSalary;
      workingDays;
      presentDays;
      absentDays;
      netPay;
      faceCount;
      rfidCount;
      biometricCount;
      qrCount;
    }
  };

  // ─── Helpers ─────────────────────────────────────────────────────────────

  /// Convert AttendanceDevice variant to Text tag.
  public func deviceToText(d : AttendanceDevice) : Text {
    switch (d) {
      case (#Face)          "Face";
      case (#RFID)          "RFID";
      case (#ESSLBiometric) "ESSLBiometric";
      case (#QR)            "QR";
    }
  };

};
