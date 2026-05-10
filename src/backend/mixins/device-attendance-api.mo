import Map "mo:core/Map";
import Nat "mo:core/Nat";
import DeviceAttLib "../lib/device-attendance";
import DeviceAttTypes "../types/device-attendance";

/// Device Attendance mixin — Face, RFID, ESSL Biometric, QR IN/OUT tracking
/// for both students and staff (payroll).
/// State slices injected: deviceAttendance, nextDeviceAttId, staffAttendance,
/// nextStaffAttId, staffMap (read-only reference to main staff map).
mixin (
  deviceAttendance  : Map.Map<Nat, DeviceAttTypes.DeviceAttendanceRecord>,
  nextDeviceAttId   : { var value : Nat },
  staffAttendance   : Map.Map<Nat, DeviceAttTypes.StaffAttendanceRecord>,
  nextStaffAttId    : { var value : Nat }
) {

  // ── Student device attendance ─────────────────────────────────────────────

  /// Record a student device attendance entry and return the new record id.
  public shared func recordDeviceAttendance(
    rec : DeviceAttTypes.DeviceAttendanceRecord
  ) : async Nat {
    DeviceAttLib.record(deviceAttendance, nextDeviceAttId, rec)
  };

  /// Update the out-time for a student record. Returns true if found.
  public shared func markDeviceOut(recordId : Nat, outTime : Text) : async Bool {
    DeviceAttLib.markOut(deviceAttendance, recordId, outTime)
  };

  /// Get all student device attendance records for a given date.
  public query func getDeviceAttendanceByDate(
    date : Text
  ) : async [DeviceAttTypes.DeviceAttendanceRecord] {
    DeviceAttLib.getByDate(deviceAttendance, date)
  };

  /// Get all student device attendance records for a given student id.
  public query func getDeviceAttendanceByStudent(
    studentId : Nat
  ) : async [DeviceAttTypes.DeviceAttendanceRecord] {
    DeviceAttLib.getByStudent(deviceAttendance, studentId)
  };

  /// Get student records filtered by date and device type tag
  /// ("Face", "RFID", "ESSLBiometric", "QR").
  public query func getDeviceAttendanceByDateAndType(
    date : Text,
    deviceType : Text
  ) : async [DeviceAttTypes.DeviceAttendanceRecord] {
    DeviceAttLib.getByDateAndType(deviceAttendance, date, deviceType)
  };

  // ── Staff device attendance ───────────────────────────────────────────────

  /// Record a staff attendance IN entry. Returns the new record id.
  public shared func recordStaffAttendance(
    staffId : Text,
    staffName : Text,
    date : Text,
    month : Nat,
    year : Nat,
    deviceType : Text,
    inTime : Text
  ) : async Nat {
    let devType : DeviceAttTypes.AttendanceDevice = switch (deviceType) {
      case "RFID"          #RFID;
      case "ESSLBiometric" #ESSLBiometric;
      case "QR"            #QR;
      case _               #Face;
    };
    DeviceAttLib.recordStaff(
      staffAttendance, nextStaffAttId,
      staffId, staffName, date, month, year, devType, inTime
    )
  };

  /// Update the out-time for a staff attendance record. Returns true if found.
  public shared func markStaffAttendanceOut(recordId : Nat, outTime : Text) : async Bool {
    DeviceAttLib.markStaffOut(staffAttendance, recordId, outTime)
  };

  /// Get all staff attendance records for a given date.
  public query func getStaffAttendanceByDate(
    date : Text
  ) : async [DeviceAttTypes.StaffAttendanceRecord] {
    DeviceAttLib.getStaffByDate(staffAttendance, date)
  };

  /// Get all staff attendance records for a given staff member.
  public query func getStaffAttendanceByStaff(
    staffId : Text
  ) : async [DeviceAttTypes.StaffAttendanceRecord] {
    DeviceAttLib.getByStaff(staffAttendance, staffId)
  };

  /// Get staff records filtered by date and device type tag.
  public query func getStaffAttendanceByDateAndType(
    date : Text,
    deviceType : Text
  ) : async [DeviceAttTypes.StaffAttendanceRecord] {
    DeviceAttLib.getStaffByDateAndType(staffAttendance, date, deviceType)
  };

  /// Get staff attendance records for a specific month and year.
  public query func getStaffAttendanceByMonth(
    staffId : Text,
    month : Nat,
    year : Nat
  ) : async [DeviceAttTypes.StaffAttendanceRecord] {
    DeviceAttLib.getByStaffAndMonth(staffAttendance, staffId, month, year)
  };

  /// Calculate payroll for a staff member from attendance records.
  /// staffSalary — pass the staff's current monthly salary.
  /// workingDays — total working days in the month.
  public query func getPayrollCalculation(
    staffId : Text,
    staffName : Text,
    staffSalary : Nat,
    month : Nat,
    year : Nat,
    workingDays : Nat
  ) : async DeviceAttTypes.PayrollCalculation {
    DeviceAttLib.calculatePayroll(
      staffAttendance, staffId, staffName, staffSalary,
      month, year, workingDays
    )
  };

};
