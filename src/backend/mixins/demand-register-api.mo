import Map    "mo:core/Map";
import List   "mo:core/List";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import DRTypes "../types/demand-register";

/// Public API mixin for the Demand Register report.
/// Injected state mirrors main.mo's live collections.
mixin (
  studentsV2         : Map.Map<Text, {
    id                    : Text;
    admNo                 : Text;
    fullName              : Text;
    fatherName            : Text;
    motherName            : Text;
    fatherMobile          : Text;
    motherMobile          : ?Text;
    dateOfBirth           : Text;
    gender                : Text;
    currentAddress        : Text;
    permanentAddress      : Text;
    classLevel            : {
      #PlayWay; #LKG; #UKG;
      #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
      #Class7; #Class8; #Class9; #Class10; #Class11; #Class12
    };
    sectionId             : Text;
    session               : Text;
    photoUrl              : ?Text;
    status                : { #Active; #Discontinued; #Graduated };
    bloodGroup            : ?Text;
    religion              : ?Text;
    category              : ?Text;
    aadhaarNo             : ?Text;
    transportRouteId      : ?Text;
    transportPickupPointId: ?Text;
    busNo                 : ?Text;
    createdAt             : Int;
    mobile                : ?Text;
    srNo                  : ?Text;
    penNo                 : ?Text;
    apaarNo               : ?Text;
    prevSchool            : ?Text;
    admissionDate         : ?Text;
  }>,
  feeHeadings        : Map.Map<Text, {
    id               : Text;
    name             : Text;
    description      : ?Text;
    isActive         : Bool;
    applicableMonths : [Text];
  }>,
  feePlans           : Map.Map<Text, {
    id             : Text;
    classLevel     : {
      #PlayWay; #LKG; #UKG;
      #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
      #Class7; #Class8; #Class9; #Class10; #Class11; #Class12
    };
    sectionId      : ?Text;
    session        : Text;
    monthlyAmounts : [(Text, Nat)];
  }>,
  feePayments        : Map.Map<Text, {
    id                    : Text;
    studentId             : Text;
    sessionId             : Text;
    receiptNo             : Text;
    paymentDate           : Text;
    items                 : [{ headingId : Text; month : Text; amount : Nat }];
    otherFee              : ?{ description : Text; amount : Nat };
    totalDue              : Nat;
    totalAmount           : Nat;
    balance               : Nat;
    paymentMode           : Text;
    upiRef                : ?Text;
    remarks               : ?Text;
    createdBy             : Text;
    isDeleted             : Bool;
    createdAt             : Int;
    lateFees              : Nat;
    discountTotal         : Nat;
    balanceCarriedForward : Float;
  }>,
  studentOldBalances : Map.Map<Text, {
    id        : Text;
    studentId : Text;
    sessionId : Text;
    amount    : Float;
    previousYearDue : ?Float;
    addedAt   : Int;
  }>,
) {

  func classLevelToText(cl : { #PlayWay; #LKG; #UKG; #Class1; #Class2; #Class3; #Class4; #Class5; #Class6; #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 }) : Text {
    switch (cl) {
      case (#PlayWay) "Play Way";
      case (#LKG)     "LKG";
      case (#UKG)     "UKG";
      case (#Class1)  "Class 1";
      case (#Class2)  "Class 2";
      case (#Class3)  "Class 3";
      case (#Class4)  "Class 4";
      case (#Class5)  "Class 5";
      case (#Class6)  "Class 6";
      case (#Class7)  "Class 7";
      case (#Class8)  "Class 8";
      case (#Class9)  "Class 9";
      case (#Class10) "Class 10";
      case (#Class11) "Class 11";
      case (#Class12) "Class 12";
    }
  };

  /// Returns true if the student has already paid for (headingId, month).
  func isPaid(studentId : Text, headingId : Text, month : Text) : Bool {
    feePayments.values()
      |> List.fromIter<{ id : Text; studentId : Text; sessionId : Text; items : [{ headingId : Text; month : Text; amount : Nat }]; isDeleted : Bool }>(_)
      |> _.any(func(p : {
            id : Text; studentId : Text; sessionId : Text;
            items : [{ headingId : Text; month : Text; amount : Nat }];
            isDeleted : Bool;
          }) : Bool {
          p.studentId == studentId and not p.isDeleted and
          p.items.any(func(it : { headingId : Text; month : Text; amount : Nat }) : Bool {
            it.headingId == headingId and it.month == month
          })
        })
  };

  /// Compute and return the fees-dues list (Demand Register).
  public query func getDemandRegister(filter : DRTypes.DemandRegisterFilter) : async [DRTypes.DemandRegisterEntry] {
    let result = List.empty<DRTypes.DemandRegisterEntry>();

    // Iterate all students, applying optional class/section filters

    let allStudentsList = studentsV2.values() |> List.fromIter<{ id : Text; admNo : Text; fullName : Text; fatherName : Text; fatherMobile : Text; classLevel : { #PlayWay; #LKG; #UKG; #Class1; #Class2; #Class3; #Class4; #Class5; #Class6; #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 }; sectionId : Text; session : Text; status : { #Active; #Discontinued; #Graduated } }>(_);

    allStudentsList.forEach(func(s) {
      // Skip discontinued/graduated students and wrong session
      if (s.status == #Discontinued) return;
      if (s.session != filter.sessionId) return;

      // Class filter (text comparison)
      let sClassName = classLevelToText(s.classLevel);
      switch (filter.classFilter) {
        case (?cls) { if (sClassName != cls) return };
        case null {};
      };
      // Section filter
      switch (filter.sectionFilter) {
        case (?sec) { if (s.sectionId != sec) return };
        case null {};
      };

      // Find fee plan: section-specific preferred, class-level fallback
      let sectionPlan = feePlans.values()
        |> List.fromIter<{ id : Text; session : Text; sectionId : ?Text; monthlyAmounts : [(Text, Nat)] }>(_)
        |> _.find(func(p : { id : Text; session : Text; sectionId : ?Text; monthlyAmounts : [(Text, Nat)] }) : Bool {
            p.session == filter.sessionId and
            (switch (p.sectionId) { case (?sid) sid == s.sectionId; case null false })
          });
      let planOpt = switch (sectionPlan) {
        case (?p) ?p;
        case null {
          feePlans.values()
            |> List.fromIter<{ id : Text; session : Text; sectionId : ?Text; monthlyAmounts : [(Text, Nat)] }>(_)
            |> _.find(func(p : { id : Text; session : Text; sectionId : ?Text; monthlyAmounts : [(Text, Nat)] }) : Bool {
                p.session == filter.sessionId and p.sectionId == null
              })
        };
      };

      var totalDueForStudent : Nat = 0;
      let duesPerHeading = List.empty<(Text, Text, Nat)>();
      let unpaidMonthsSet = Map.empty<Text, Bool>();

      switch (planOpt) {
        case (?plan) {
          for ((headingId, monthlyAmt) in plan.monthlyAmounts.values()) {
            // Apply headingIds filter
            if (filter.headingIds.size() > 0 and
                filter.headingIds.find(func(hid : Text) : Bool { hid == headingId }) == null) {
              // skip — heading not in filter
            } else {
              switch (feeHeadings.get(headingId)) {
                case (?heading) {
                  if (heading.isActive) {
                    // Effective months = intersection of filter.months ∩ heading.applicableMonths
                    // (if heading.applicableMonths is empty → applies to all filter months)
                    let effectiveMonths : [Text] =
                      if (heading.applicableMonths.size() == 0) {
                        filter.months
                      } else {
                        filter.months.filter(func(m : Text) : Bool {
                          heading.applicableMonths.find(func(hm : Text) : Bool { hm == m }) != null
                        })
                      };

                    // Find unpaid months
                    let unpaidMonths = effectiveMonths.filter(func(m : Text) : Bool {
                      not isPaid(s.id, headingId, m)
                    });

                    if (unpaidMonths.size() > 0) {
                      let amtDue = monthlyAmt * unpaidMonths.size();
                      totalDueForStudent += amtDue;
                      let monthsStr = unpaidMonths.foldLeft("", func(acc : Text, m : Text) : Text {
                        if (acc == "") m else acc # ", " # m
                      });
                      duesPerHeading.add((heading.name, monthsStr, amtDue));
                      for (m in unpaidMonths.values()) {
                        unpaidMonthsSet.add(m, true);
                      };
                    };
                  }
                };
                case null {}; // heading deleted — skip
              }
            }
          }
        };
        case null {};
      };

      // Old balance
      var oldBal : Nat = 0;
      studentOldBalances.forEach(func(_k, b) {
        if (b.studentId == s.id and b.sessionId == filter.sessionId and b.amount > 0.0) {
          let balInt : Int = b.amount.toInt();
          if (balInt > 0) { oldBal += Int.abs(balInt) };
        }
      });

      let totalDue = totalDueForStudent + oldBal;
      if (totalDue > 0) {
        let unpaidMonthsArr = unpaidMonthsSet.keys() |> List.fromIter(_) |> _.toArray();
        result.add({
          studentId      = s.id;
          studentName    = s.fullName;
          admNo          = s.admNo;
          className      = sClassName;
          section        = s.sectionId;
          phone          = s.fatherMobile;
          fatherName     = s.fatherName;
          duesPerHeading = duesPerHeading.toArray();
          totalDue;
          oldBalance     = oldBal;
          months         = unpaidMonthsArr;
        });
      };
    });

    result.toArray()
  };
};
