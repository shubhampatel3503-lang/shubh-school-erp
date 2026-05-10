module {
  /// Live GPS location record for a school bus.
  public type BusLocation = {
    busId      : Text;
    routeId    : Text;
    routeName  : Text;
    driverName : Text;
    latitude   : Float;
    longitude  : Float;
    updatedAt  : Int;    // nanoseconds since epoch
    isActive   : Bool;
  };
};
