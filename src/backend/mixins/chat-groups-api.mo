import Map     "mo:core/Map";
import List    "mo:core/List";
import Time    "mo:core/Time";
import Runtime "mo:core/Runtime";

/// Chat auto-group creation helpers — idempotent class+section and route group creation.
mixin (
  chatRooms : Map.Map<Text, {
    id : Text; name : Text;
    roomType : { #Direct; #ClassGroup; #RouteGroup; #General };
    members : [Text]; createdBy : Text; createdAt : Int;
  }>,
) {

  public type ClassLevelV = {
    #PlayWay; #LKG; #UKG;
    #Class1; #Class2; #Class3; #Class4; #Class5; #Class6;
    #Class7; #Class8; #Class9; #Class10; #Class11; #Class12
  };

  type RoomRec = {
    id : Text; name : Text;
    roomType : { #Direct; #ClassGroup; #RouteGroup; #General };
    members : [Text]; createdBy : Text; createdAt : Int;
  };

  func clToText(cl : ClassLevelV) : Text {
    switch (cl) {
      case (#PlayWay) "Play Way"; case (#LKG) "LKG"; case (#UKG) "UKG";
      case (#Class1)  "Class 1";  case (#Class2)  "Class 2";  case (#Class3)  "Class 3";
      case (#Class4)  "Class 4";  case (#Class5)  "Class 5";  case (#Class6)  "Class 6";
      case (#Class7)  "Class 7";  case (#Class8)  "Class 8";  case (#Class9)  "Class 9";
      case (#Class10) "Class 10"; case (#Class11) "Class 11"; case (#Class12) "Class 12";
    }
  };

  public shared func ensureClassGroupsExist(
    classLevels : [ClassLevelV],
    sectionNames : [Text],
  ) : async [RoomRec] {
    let created = List.empty<RoomRec>();
    for (cl in classLevels.values()) {
      for (sec in sectionNames.values()) {
        let roomName = clToText(cl) # " - " # sec;
        let existing = chatRooms.values()
          |> List.fromIter<RoomRec>(_)
          |> _.find(func(r : RoomRec) : Bool {
              r.roomType == #ClassGroup and r.name == roomName
            });
        switch (existing) {
          case (?room) { created.add(room) };
          case null {
            let roomId = "cg_" # roomName
              .replace(#char(' '), "")
              .replace(#char('-'), "");
            let room : RoomRec = {
              id = roomId; name = roomName;
              roomType = #ClassGroup;
              members = [];
              createdBy = "system";
              createdAt = Time.now();
            };
            chatRooms.add(roomId, room);
            created.add(room);
          };
        };
      };
    };
    created.toArray()
  };

  public shared func ensureRouteGroupsExist(
    routeList : [{ id : Text; name : Text }]
  ) : async [RoomRec] {
    let created = List.empty<RoomRec>();
    for (route in routeList.values()) {
      let roomName = "Route: " # route.name;
      let existing = chatRooms.values()
        |> List.fromIter<RoomRec>(_)
        |> _.find(func(r : RoomRec) : Bool {
            r.roomType == #RouteGroup and r.name == roomName
          });
      switch (existing) {
        case (?room) { created.add(room) };
        case null {
          let roomId = "rg_" # route.id;
          let room : RoomRec = {
            id = roomId; name = roomName;
            roomType = #RouteGroup;
            members = [];
            createdBy = "system";
            createdAt = Time.now();
          };
          chatRooms.add(roomId, room);
          created.add(room);
        };
      };
    };
    created.toArray()
  };
}
