import Map          "mo:core/Map";
import MsgTypes     "../types/messaging";
import MessagingLib "../lib/messaging";

mixin (
  directMessages : Map.Map<Text, MsgTypes.DirectMessage>,
  messageTemplates : { var value : Map.Map<Text, Text> },
) {

  // ── Send (save) a direct message ──────────────────────────────────────
  public shared func sendDirectMessage(
    msg : MsgTypes.DirectMessage,
  ) : async MsgTypes.DirectMessage {
    MessagingLib.save(directMessages, msg)
  };

  // ── Get last N messages descending by sentAt ──────────────────────────
  public query func getDirectMessages(
    limit : Nat,
  ) : async [MsgTypes.DirectMessage] {
    MessagingLib.recent(directMessages, limit)
  };

  // ── Get all messages for a specific student ───────────────────────────
  public query func getDirectMessagesByRecipient(
    toStudentId : Text,
  ) : async [MsgTypes.DirectMessage] {
    MessagingLib.byRecipient(directMessages, toStudentId)
  };

  // ── Update delivery status ────────────────────────────────────────────
  public shared func updateMessageDeliveryStatus(
    id     : Text,
    status : Text,
  ) : async Bool {
    MessagingLib.updateStatus(directMessages, id, status)
  };

  // ── Get all message templates ─────────────────────────────────────────
  public query func getMessageTemplates() : async [(Text, Text)] {
    messageTemplates.value.toArray()
  };

  // ── Update (upsert) a message template ───────────────────────────────
  public shared func updateMessageTemplate(
    key      : Text,
    template : Text,
  ) : async () {
    messageTemplates.value.add(key, template)
  };

}
