import Map   "mo:core/Map";
import List  "mo:core/List";
import Types "../types/messaging";

module {

  // ── Save a new DirectMessage to the store ──────────────────────────────
  public func save(
    store : Map.Map<Text, Types.DirectMessage>,
    msg   : Types.DirectMessage,
  ) : Types.DirectMessage {
    store.add(msg.id, msg);
    msg
  };

  // ── Retrieve last N messages sorted by sentAt descending ───────────────
  public func recent(
    store : Map.Map<Text, Types.DirectMessage>,
    limit : Nat,
  ) : [Types.DirectMessage] {
    let all = store.values()
      |> List.fromIter<Types.DirectMessage>(_)
      |> _.sort<Types.DirectMessage>(
           func(a : Types.DirectMessage, b : Types.DirectMessage) {
             // Descending: compare b vs a
             b.sentAt.compare(a.sentAt)
           }
         );
    let sz = all.size();
    let take = if (limit < sz) { limit } else { sz };
    all.sliceToArray(0, take)
  };

  // ── Retrieve all messages sent to a specific student ───────────────────
  public func byRecipient(
    store      : Map.Map<Text, Types.DirectMessage>,
    studentId  : Text,
  ) : [Types.DirectMessage] {
    store.values()
      |> List.fromIter<Types.DirectMessage>(_)
      |> _.filter(func(m : Types.DirectMessage) : Bool {
           switch (m.toStudentId) {
             case (?sid) sid == studentId;
             case null   false;
           }
         })
      |> _.toArray()
  };

  // ── Update the deliveryStatus of a message ─────────────────────────────
  public func updateStatus(
    store  : Map.Map<Text, Types.DirectMessage>,
    id     : Text,
    status : Text,
  ) : Bool {
    switch (store.get(id)) {
      case (?m) {
        store.add(id, { m with deliveryStatus = status });
        true
      };
      case null false;
    }
  };

}
