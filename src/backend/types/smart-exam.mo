module {

  // Mirrors ClassLevel from main.mo — kept here for domain isolation
  public type ClassLevel = {
    #PlayWay; #LKG; #UKG;
    #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
    #Class7; #Class8; #Class9; #Class10; #Class11; #Class12;
  };

  public type SmartTimetableEntry = {
    date : Text;
    day : Text;
    classLevel : ClassLevel;
    subjectName : Text;
    position : Nat;
    isLocked : Bool;
  };

  public type SmartExamTimetable = {
    id : Nat;
    examName : Text;
    sessionId : Text;
    startDate : Text;
    endDate : Text;
    startTime : Text;
    endTime : Text;
    participatingClasses : [ClassLevel];
    entries : [SmartTimetableEntry];
    status : Text;
  };

  /// Parameters for generating a smart exam schedule.
  public type GenerateScheduleParams = {
    examName     : Text;
    sessionId    : Text;
    startDate    : Text;   // dd/mm/yyyy
    endDate      : Text;   // dd/mm/yyyy
    startTime    : Text;
    endTime      : Text;
    participatingClasses : [ClassLevel];
    // Per-class subject list: (classLevel, [subjectName])
    classSubjects : [(ClassLevel, [Text])];
  };

};
