module {
  /// Filter parameters for the Demand Register report.
  public type DemandRegisterFilter = {
    sessionId    : Text;
    classFilter  : ?Text;  // class name text e.g. "Class 5"
    sectionFilter: ?Text;  // section id
    months       : [Text]; // e.g. ["April", "May", "June"]
    headingIds   : [Text]; // empty = all headings
  };

  /// One row in the Demand Register output.
  /// duesPerHeading: array of (headingName, monthsString, amount)
  ///   where monthsString is comma-separated unpaid months for that heading.
  public type DemandRegisterEntry = {
    studentId      : Text;
    studentName    : Text;
    admNo          : Text;
    className      : Text;
    section        : Text;
    phone          : Text;
    fatherName     : Text;
    duesPerHeading : [(Text, Text, Nat)]; // (headingName, monthsString, amount)
    totalDue       : Nat;
    oldBalance     : Nat;
    months         : [Text]; // distinct unpaid months across all headings
  };
};
