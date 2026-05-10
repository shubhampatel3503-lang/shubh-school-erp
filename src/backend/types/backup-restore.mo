/// Types for full-system backup and restore.
/// RestoreStats and RestoreResult are also declared inline in mixins/backup-restore-api.mo
/// for Motoko module boundary reasons; the two definitions must remain in sync.
module {

  /// Per-record error collected during restore.
  public type BackupError = {
    entityType : Text;
    recordId   : Text;
    reason     : Text;
  };

  /// Statistics returned by restoreFromBackup.
  public type RestoreStats = {
    students        : Nat;
    staff           : Nat;
    feePlans        : Nat;
    feeCollections  : Nat;
    classTimetables : Nat;
    inventory       : Nat;
    attendance      : Nat;
    total           : Nat;
  };

  /// Result of a restore operation with per-record error collection.
  public type RestoreResult = {
    success      : Bool;
    message      : Text;
    successCount : Nat;
    failCount    : Nat;
    skippedCount : Nat;
    errors       : [BackupError];
    recordCounts : RestoreStats;
  };

}
