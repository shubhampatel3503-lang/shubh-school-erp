import Time "mo:core/Time";

module {
  public type DeviceConfig = {
    deviceType : Text;       // "essl" | "rfid" | "face" | "qr"
    ipAddress  : ?Text;
    port       : ?Nat;
    deviceId   : ?Text;
    usbPort    : ?Text;
    updatedAt  : Int;
  };
}
