import Map              "mo:core/Map";
import List             "mo:core/List";
import Time             "mo:core/Time";
import DeviceConfigTypes "../types/device-config";

/// Persists ESSL / RFID / Face / QR device configuration settings.
mixin (
  deviceConfigs : Map.Map<Text, DeviceConfigTypes.DeviceConfig>,
) {

  public shared func saveDeviceConfig(
    deviceType : Text,
    config : {
      ipAddress : ?Text;
      port      : ?Nat;
      deviceId  : ?Text;
      usbPort   : ?Text;
    },
  ) : async () {
    let dc : DeviceConfigTypes.DeviceConfig = {
      deviceType;
      ipAddress = config.ipAddress;
      port      = config.port;
      deviceId  = config.deviceId;
      usbPort   = config.usbPort;
      updatedAt = Time.now();
    };
    deviceConfigs.add(deviceType, dc);
  };

  public query func getDeviceConfig(deviceType : Text) : async ?DeviceConfigTypes.DeviceConfig {
    deviceConfigs.get(deviceType)
  };

  public query func getAllDeviceConfigs() : async [DeviceConfigTypes.DeviceConfig] {
    let l = List.empty<DeviceConfigTypes.DeviceConfig>();
    for ((_, dc) in deviceConfigs.entries()) { l.add(dc) };
    l.toArray()
  };
}
