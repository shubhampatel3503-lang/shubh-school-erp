import Map    "mo:core/Map";
import List   "mo:core/List";
import Float  "mo:core/Float";
import Int    "mo:core/Int";
import DRTypes "../types/demand-register";

module {
  // ── Shared type aliases ──────────────────────────────────────────────────
  public type DemandRegisterFilter = DRTypes.DemandRegisterFilter;
  public type DemandRegisterEntry  = DRTypes.DemandRegisterEntry;

  public type Student = {
    id                   : Text;
    admNo                : Text;
    fullName             : Text;
    fatherName           : Text;
    fatherMobile         : Text;
    classLevel           : { toText : () -> Text }; // will use classLevelToText helper
    sectionId            : Text;
    session              : Text;
    status               : { #Active; #Discontinued; #Graduated };
  };

  public type FeeHeading = {
    id               : Text;
    name             : Text;
    isActive         : Bool;
    applicableMonths : [Text];
  };

  public type FeePlan = {
    id             : Text;
    session        : Text;
    sectionId      : ?Text;
    monthlyAmounts : [(Text, Nat)]; // (headingId, amountPerMonth)
  };

  public type FeePayment = {
    id        : Text;
    studentId : Text;
    sessionId : Text;
    items     : [{ headingId : Text; month : Text; amount : Nat }];
    isDeleted : Bool;
  };

  public type OldBalance = {
    studentId : Text;
    sessionId : Text;
    amount    : Float;
  };

  /// Check whether a payment item exists for (studentId, headingId, month) in the payments list.
  func isPaid(
    payments  : List.List<FeePayment>,
    studentId : Text,
    headingId : Text,
    month     : Text,
  ) : Bool {
    payments.any(func(p : FeePayment) : Bool {
      p.studentId == studentId and not p.isDeleted and
      p.items.any(func(it : { headingId : Text; month : Text; amount : Nat }) : Bool {
        it.headingId == headingId and it.month == month
      })
    })
  };

  /// Compute the Demand Register for the given filter.
  /// All maps are passed in from main.mo so this module stays stateless.
  public func compute<CL>(
    filter          : DemandRegisterFilter,
    allStudents     : List.List<{ id : Text; admNo : Text; fullName : Text; fatherName : Text;
                                  fatherMobile : Text; classLevel : CL; sectionId : Text;
                                  session : Text;
                                  status : { #Active; #Discontinued; #Graduated } }>,
    classLevelToText: CL -> Text,
    feeHeadingsMap  : Map.Map<Text, FeeHeading>,
    feePlansMap     : Map.Map<Text, FeePlan>,
    allPayments     : List.List<FeePayment>,
    oldBalancesMap  : Map.Map<Text, OldBalance>,
  ) : [DemandRegisterEntry] {

    let result = List.empty<DemandRegisterEntry>();

    // Filter students by session, class (text match), section (id match)
    let filtered = allStudents.filter(func(s) : Bool {
      if (s.status == #Discontinued) return false;
      if (s.session != filter.sessionId) return false;
      switch (filter.classFilter) {
        case (?cls) { if (classLevelToText(s.classLevel) != cls) return false };
        case null {};
      };
      switch (filter.sectionFilter) {
        case (?sec) { if (s.sectionId != sec) return false };
        case null {};
      };
      true
    });

    filtered.forEach(func(s) {
      // Find fee plan: section-specific first, then class-only fallback
      let planOpt : ?FeePlan = switch (
        feePlansMap.values()
          |> List.fromIter<FeePlan>(_)
          |> _.find(func(p : FeePlan) : Bool {
              p.session == filter.sessionId and
              (switch (p.sectionId) { case (?sid) sid == s.sectionId; case null false })
            })
      ) {
        case (?p) ?p;
        case null {
          feePlansMap.values()
            |> List.fromIter<FeePlan>(_)
            |> _.find(func(p : FeePlan) : Bool {
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
            // Skip if headingIds filter is non-empty and heading not included
            if (filter.headingIds.size() > 0 and
                filter.headingIds.find(func(hid : Text) : Bool { hid == headingId }) == null) {
              // heading excluded by filter
            } else {
              switch (feeHeadingsMap.get(headingId)) {
                case (?heading) {
                  if (not heading.isActive) {
                    // skip inactive headings
                  } else {
                    // Determine applicable months: intersection of filter.months and heading.applicableMonths
                    // If heading.applicableMonths is empty it applies to all months
                    let effectiveMonths : [Text] = if (heading.applicableMonths.size() == 0) {
                      filter.months
                    } else {
                      filter.months.filter(func(m : Text) : Bool {
                        heading.applicableMonths.find(func(hm : Text) : Bool { hm == m }) != null
                      })
                    };

                    // Find unpaid months for this student + heading
                    let unpaidMonths = effectiveMonths.filter(func(m : Text) : Bool {
                      not isPaid(allPayments, s.id, headingId, m)
                    });

                    if (unpaidMonths.size() > 0) {
                      let amtDue = monthlyAmt * unpaidMonths.size();
                      totalDueForStudent += amtDue;
                      // Build months string
                      let monthsStr = unpaidMonths.foldLeft("", func(acc : Text, m : Text) : Text {
                        if (acc == "") m else acc # ", " # m
                      });
                      duesPerHeading.add((heading.name, monthsStr, amtDue));
                      // Track distinct unpaid months
                      for (m in unpaidMonths.values()) {
                        unpaidMonthsSet.add(m, true);
                      };
                    };
                  }
                };
                case null {}; // heading deleted
              }
            }
          }
        };
        case null {}; // no fee plan found
      };

      // Old balance for this student in this session
      var oldBal : Nat = 0;
      oldBalancesMap.forEach(func(_k, b : OldBalance) {
        if (b.studentId == s.id and b.sessionId == filter.sessionId and b.amount > 0.0) {
          let balInt : Int = Float.toInt(b.amount);
          if (balInt > 0) { oldBal += Int.abs(balInt) };
        }
      });

      let totalDue = totalDueForStudent + oldBal;

      // Only include student if there is anything due
      if (totalDue > 0) {
        let unpaidMonthsArr = unpaidMonthsSet.keys() |> List.fromIter(_) |> _.toArray();
        result.add({
          studentId      = s.id;
          studentName    = s.fullName;
          admNo          = s.admNo;
          className      = classLevelToText(s.classLevel);
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
