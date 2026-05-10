module {

  public type AttendanceDevice = {
    #Face;
    #RFID;
    #ESSLBiometric;
    #QR;
  };

  // Mirrors ClassLevel from main.mo — kept here for domain isolation
  public type ClassLevel = {
    #PlayWay; #LKG; #UKG;
    #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
    #Class7; #Class8; #Class9; #Class10; #Class11; #Class12;
  };

  /// Student device attendance (face/RFID/biometric IN+OUT for class).
  public type DeviceAttendanceRecord = {
    id : Nat;
    studentId : Nat;
    studentName : Text;
    classLevel : ClassLevel;
    section : Text;
    deviceType : AttendanceDevice;
    inTime : ?Text;
    outTime : ?Text;
    date : Text;
    status : Text;
  };

  /// Staff device attendance for payroll calculation.
  public type StaffAttendanceRecord = {
    id : Nat;
    staffId : Text;
    staffName : Text;
    deviceType : AttendanceDevice;
    inTime : ?Text;
    outTime : ?Text;
    date : Text;     // dd/mm/yyyy
    month : Nat;     // 1–12
    year : Nat;      // e.g. 2025
  };

  /// Payroll calculation result returned to the frontend.
  public type PayrollCalculation = {
    staffId      : Text;
    staffName    : Text;
    month        : Nat;
    year         : Nat;
    monthlySalary : Nat;
    workingDays  : Nat;
    presentDays  : Nat;
    absentDays   : Nat;
    netPay       : Nat;
    faceCount    : Nat;
    rfidCount    : Nat;
    biometricCount : Nat;
    qrCount      : Nat;
  };

};
