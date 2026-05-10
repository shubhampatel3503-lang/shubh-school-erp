/// Pure domain helpers for student promotion.
/// The bulk of promotion logic lives in mixins/promotion-api.mo
/// (which has access to the state maps).
/// This file exposes only stateless utilities.
module {
  public type ClassLevel = {
    #PlayWay; #LKG; #UKG;
    #Class1;  #Class2;  #Class3;  #Class4;  #Class5;  #Class6;
    #Class7;  #Class8;  #Class9;  #Class10; #Class11; #Class12
  };

  /// Returns the next ClassLevel in Indian school order,
  /// or null when the student has reached Class12 (should be graduated).
  public func nextClass(c : ClassLevel) : ?ClassLevel {
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
      case (#Class12) null;   // graduate
    }
  };
};
