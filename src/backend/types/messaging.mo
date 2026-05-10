module {
  public type DirectMessage = {
    id           : Text;
    fromUsername : Text;
    toStudentId  : ?Text;
    toClassLevel : ?Text;
    toSection    : ?Text;
    channel      : Text;          // "whatsapp" | "sms" | "push" | "in-app"
    message      : Text;
    sentAt       : Text;          // ISO timestamp or dd/mm/yyyy HH:MM string
    deliveryStatus : Text;        // "pending" | "sent" | "failed"
    templateKey  : ?Text;         // key into appSettings.messageTemplates
  };
}
