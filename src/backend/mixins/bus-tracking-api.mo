import Map         "mo:core/Map";
import List        "mo:core/List";
import Time        "mo:core/Time";
import BusTypes    "../types/bus-tracking";

/// Provides live bus GPS tracking endpoints.
mixin (
  busLocations : Map.Map<Text, BusTypes.BusLocation>,
  routes       : Map.Map<Text, {
    id         : Text;
    routeName  : Text;
    routeNo    : Text;
    busNo      : Text;
    driverName : Text;
    driverMobile : Text;
    capacity   : Nat;
  }>,
) {

  /// Returns all stored bus GPS coordinates.
  public query func getBusLocations() : async [BusTypes.BusLocation] {
    busLocations.values() |> List.fromIter<BusTypes.BusLocation>(_) |> _.toArray()
  };

  /// Stores or updates the GPS location for a bus.
  /// Any caller can update (designed for GPS device HTTP push).
  public shared func updateBusLocation(
    busId     : Text,
    routeId   : Text,
    latitude  : Float,
    longitude : Float,
  ) : async () {
    // Resolve route name and driver name from routes map for display purposes.
    let (routeName, driverName) = switch (routes.get(routeId)) {
      case (?r) (r.routeName, r.driverName);
      case null (routeId, "");
    };
    // Preserve isActive from existing record; default true for new entries.
    let wasActive = switch (busLocations.get(busId)) {
      case (?existing) existing.isActive;
      case null        true;
    };
    busLocations.add(busId, {
      busId;
      routeId;
      routeName;
      driverName;
      latitude;
      longitude;
      updatedAt = Time.now();
      isActive  = wasActive;
    });
  };

  /// Mark a bus as active or inactive (admin only — frontend enforces auth).
  public shared func setBusActive(busId : Text, isActive : Bool) : async () {
    switch (busLocations.get(busId)) {
      case (?loc) { busLocations.add(busId, { loc with isActive }) };
      case null   {};
    }
  };
};
