import Map          "mo:core/Map";
import List         "mo:core/List";
import Float        "mo:core/Float";
import Time         "mo:core/Time";
import FeeExtrasTypes "../types/fee-extras";
import PromotionTypes "../types/promotion";

/// Public API for bulk student promotion and promotion preview.
mixin (
  students      : Map.Map<Text, {
    id               : Text;
    admNo            : Text;
    fullName         : Text;
    fatherName       : Text;
    motherName       : Text;
    fatherMobile     : Text;
    motherMobile     : ?Text;
    dateOfBirth      : Text;
    gender           : Text;
    currentAddress   : Text;
    permanentAddress : Text;
    classLevel       : { #PlayWay; #LKG; #UKG;
                         #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
                         #Class7; #Class8; #Class9; #Class10; #Class11; #Class12 };
    sectionId        : Text;
    session          : Text;
    photoUrl         : ?Text;
    status           : { #Active; #Discontinued; #Graduated };
    bloodGroup       : ?Text;
    religion         : ?Text;
    category         : ?Text;
    aadhaarNo        : ?Text;
    transportRouteId : ?Text;
    transportPickupPointId : ?Text;
    busNo            : ?Text;
    createdAt        : Int;
    mobile           : ?Text;
    srNo             : ?Text;
    penNo            : ?Text;
    apaarNo          : ?Text;
    prevSchool       : ?Text;
    admissionDate    : ?Text;
  }>,
  feePayments    : Map.Map<Text, {
    id         : Text;
    studentId  : Text;
    sessionId  : Text;
    totalDue   : Nat;
    totalAmount : Nat;
    isDeleted  : Bool;
    receiptNo  : Text;
    paymentDate : Text;
    items : [{ headingId : Text; month : Text; amount : Nat }];
    otherFee : ?{ description : Text; amount : Nat };
    balance : Nat;
    paymentMode : Text;
    upiRef : ?Text;
    remarks : ?Text;
    createdBy : Text;
    createdAt : Int;
    lateFees : Nat;
    discountTotal : Nat;
    balanceCarriedForward : Float;
  }>,
  studentDiscounts  : Map.Map<Text, FeeExtrasTypes.StudentDiscount>,
  studentOldBalances : Map.Map<Text, FeeExtrasTypes.StudentOldBalance>,
  nextIdRef : { var value : Nat },
) {

  type PromClassLevel = {
    #PlayWay; #LKG; #UKG;
    #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
    #Class7; #Class8; #Class9; #Class10; #Class11; #Class12
  };

  type PromStudent = {
    id               : Text;
    admNo            : Text;
    fullName         : Text;
    fatherName       : Text;
    motherName       : Text;
    fatherMobile     : Text;
    motherMobile     : ?Text;
    dateOfBirth      : Text;
    gender           : Text;
    currentAddress   : Text;
    permanentAddress : Text;
    classLevel       : PromClassLevel;
    sectionId        : Text;
    session          : Text;
    photoUrl         : ?Text;
    status           : { #Active; #Discontinued; #Graduated };
    bloodGroup       : ?Text;
    religion         : ?Text;
    category         : ?Text;
    aadhaarNo        : ?Text;
    transportRouteId : ?Text;
    transportPickupPointId : ?Text;
    busNo            : ?Text;
    createdAt        : Int;
    mobile           : ?Text;
    srNo             : ?Text;
    penNo            : ?Text;
    apaarNo          : ?Text;
    prevSchool       : ?Text;
    admissionDate    : ?Text;
  };

  /// Promotion order: returns next ClassLevel or null for Class12 (graduate).
  func nextClass(c : PromClassLevel) : ?PromClassLevel {
    switch c {
      case (#PlayWay) ?#LKG;
      case (#LKG)     ?#UKG;
      case (#UKG)     ?#Class1;
      case (#Class1)  ?#Class2;
      case (#Class2)  ?#Class3;
      case (#Class3)  ?#Class4;
      case (#Class4)  ?#Class5;
      case (#Class5)  ?#Class6;
      case (#Class6)  ?#Class7;
      case (#Class7)  ?#Class8;
      case (#Class8)  ?#Class9;
      case (#Class9)  ?#Class10;
      case (#Class10) ?#Class11;
      case (#Class11) ?#Class12;
      case (#Class12) null;
    }
  };

  func genNextId() : Text {
    let id = nextIdRef.value;
    nextIdRef.value += 1;
    id.toText()
  };

  type FeePaymentSlice = {
    id : Text; studentId : Text; sessionId : Text;
    totalDue : Nat; totalAmount : Nat; isDeleted : Bool;
    receiptNo : Text; paymentDate : Text;
    items : [{ headingId : Text; month : Text; amount : Nat }];
    otherFee : ?{ description : Text; amount : Nat };
    balance : Nat; paymentMode : Text; upiRef : ?Text;
    remarks : ?Text; createdBy : Text; createdAt : Int;
    lateFees : Nat; discountTotal : Nat; balanceCarriedForward : Float;
  };

  /// Compute old balance for a student in a session (totalDue - totalPaid).
  func computeOldBalance(studentId : Text, sessionId : Text) : Float {
    feePayments.values()
      |> List.fromIter<FeePaymentSlice>(_)
      |> _.filter(func(p : FeePaymentSlice) : Bool {
          p.studentId == studentId and p.sessionId == sessionId and not p.isDeleted
        })
      |> _.foldLeft(0.0, func(acc : Float, p : FeePaymentSlice) : Float {
          acc + p.totalDue.toFloat() - p.totalAmount.toFloat()
        })
  };

  /// Copy all discounts for a student to a new session tag
  /// (discounts are session-independent; this is a no-op since discounts carry forward automatically,
  ///  but we ensure a clean new-session set by re-tagging if needed).
  /// In this implementation, discounts are keyed by student+heading and are already
  /// global — no copy needed. This function is a hook for future session-scoped discounts.
  func copyDiscounts(_studentId : Text, _fromSession : Text, _toSession : Text) : () {
    // Discounts are already carried forward globally.
    // Future: if discounts become session-scoped, copy them here.
    ()
  };

  /// Count discounts for a student.
  func countDiscounts(studentId : Text) : Nat {
    studentDiscounts.values()
      |> List.fromIter<FeeExtrasTypes.StudentDiscount>(_)
      |> _.filter(func(d : FeeExtrasTypes.StudentDiscount) : Bool { d.studentId == studentId })
      |> _.size()
  };

  // ── Public Endpoints ────────────────────────────────────────────────────────

  /// Preview which students will be promoted from fromClass in fromSession.
  public query func getPromotionPreview(
    fromClass   : PromClassLevel,
    fromSession : Text,
  ) : async [PromotionTypes.PromotionPreviewItem] {
    let matching = students.values()
      |> List.fromIter<PromStudent>(_)
      |> _.filter(func(s : PromStudent) : Bool {
          s.classLevel == fromClass and s.session == fromSession and s.status == #Active
        });
    matching.map<PromStudent, PromotionTypes.PromotionPreviewItem>(func(s : PromStudent) : PromotionTypes.PromotionPreviewItem {
      let bal = computeOldBalance(s.id, fromSession);
      {
        studentId    = s.id;
        fullName     = s.fullName;
        admNo        = s.admNo;
        oldBalance   = bal;
        discountCount = countDiscounts(s.id);
        hasTransport = switch (s.transportRouteId) { case null false; case (?_) true };
      }
    })
    |> _.toArray()
  };

  /// Promote all active students from fromClass/fromSession to the next class in newSession.
  /// - Class12 students are graduated (isDiscontinued = true).
  /// - transportRouteId is carried forward unchanged.
  /// - StudentOldBalance is saved for newSession = totalDue - totalPaid in fromSession.
  public shared func promoteBulkStudents(
    fromClass     : PromClassLevel,
    fromSession   : Text,
    newSession    : Text,
    targetSection : ?Text,
  ) : async PromotionTypes.PromotionResult {
    let matching = students.values()
      |> List.fromIter<PromStudent>(_)
      |> _.filter(func(s : PromStudent) : Bool {
          s.classLevel == fromClass and s.session == fromSession and s.status == #Active
        })
      |> _.toArray();

    var promoted : Nat = 0;
    let errors = List.empty<Text>();

    for (student in matching.values()) {
      // Compute old balance in fromSession and save for newSession
      let bal = computeOldBalance(student.id, fromSession);
      if (bal > 0.0) {
        let balId = genNextId();
        let balRecord : FeeExtrasTypes.StudentOldBalance = {
          id        = balId;
          studentId = student.id;
          sessionId = newSession;
          amount    = bal;
          previousYearDue = null;
          addedAt   = Time.now();
        };
        studentOldBalances.add(balId, balRecord);
      };

      // Copy discounts (currently a no-op, carried forward automatically)
      copyDiscounts(student.id, fromSession, newSession);

      let section = switch (targetSection) {
        case (?s) s;
        case null student.sectionId;
      };

      switch (nextClass(student.classLevel)) {
        case null {
          // Class12 → graduate
          let updated : PromStudent = {
            student with
            session   = newSession;
            sectionId = section;
            status    = #Graduated;
          };
          students.add(student.id, updated);
          promoted += 1;
        };
        case (?nc) {
          let updated : PromStudent = {
            student with
            classLevel = nc;
            session    = newSession;
            sectionId  = section;
          };
          students.add(student.id, updated);
          promoted += 1;
        };
      };
    };

    { promoted; failed = 0; errors = errors.toArray() }
  };
  /// Promote ALL active students in ALL classes from fromSession to toSession in one call.
  /// Iterates every ClassLevel in school order (Play Way → Class 12).
  /// Class 12 students are graduated. Per-class old-balance is computed and stored.
  /// Returns total promoted, total failed (always 0), total graduated, and per-class breakdown.
  public shared func promoteAllClasses(
    fromSession : Text,
    toSession   : Text,
  ) : async PromotionTypes.PromotionAllResult {
    let allClasses : [PromClassLevel] = [
      #PlayWay, #LKG, #UKG,
      #Class1, #Class2, #Class3, #Class4, #Class5, #Class6,
      #Class7, #Class8, #Class9, #Class10, #Class11, #Class12
    ];
    var totalPromoted  : Nat = 0;
    var totalGraduated : Nat = 0;
    let breakdown = List.empty<PromotionTypes.PromotionClassBreakdown>();

    for (cl in allClasses.values()) {
      let matching = students.values()
        |> List.fromIter<PromStudent>(_)
        |> _.filter(func(s : PromStudent) : Bool {
            s.classLevel == cl and s.session == fromSession and s.status == #Active
          })
        |> _.toArray();

      var clPromoted  : Nat = 0;
      var clGraduated : Nat = 0;

      for (student in matching.values()) {
        let bal = computeOldBalance(student.id, fromSession);
        if (bal > 0.0) {
          let balId = genNextId();
          studentOldBalances.add(balId, {
            id              = balId;
            studentId       = student.id;
            sessionId       = toSession;
            amount          = bal;
            previousYearDue = null;
            addedAt         = Time.now();
          });
        };
        copyDiscounts(student.id, fromSession, toSession);

        switch (nextClass(student.classLevel)) {
          case null {
            students.add(student.id, { student with session = toSession; status = #Graduated });
            clGraduated += 1;
          };
          case (?nc) {
            students.add(student.id, { student with classLevel = nc; session = toSession });
            clPromoted += 1;
          };
        };
      };

      let className = switch cl {
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
      };

      if (clPromoted + clGraduated > 0) {
        breakdown.add({
          className;
          promoted  = clPromoted;
          failed    = 0;
          graduated = clGraduated;
        });
      };
      totalPromoted  += clPromoted;
      totalGraduated += clGraduated;
    };

    {
      totalPromoted;
      totalFailed    = 0;
      totalGraduated;
      breakdown      = breakdown.toArray();
    }
  };
};
