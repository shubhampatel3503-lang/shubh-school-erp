import Map               "mo:core/Map";
import Types             "../types/index-page-config";
import IndexPageConfigLib "../lib/index-page-config";

/// Public endpoints for reading and saving the index-page design configuration.
mixin (
  indexPageConfigStore : Map.Map<Text, Types.IndexPageConfig>
) {

  /// Return the current index-page configuration, or null if not yet saved.
  public query func getIndexPageConfig() : async ?Types.IndexPageConfig {
    IndexPageConfigLib.getIndexPageConfig(indexPageConfigStore)
  };

  /// Save (upsert) the full index-page configuration.
  public shared func saveIndexPageConfig(config : Types.IndexPageConfig) : async () {
    IndexPageConfigLib.saveIndexPageConfig(indexPageConfigStore, config)
  };
};

