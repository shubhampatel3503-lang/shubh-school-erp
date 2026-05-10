import Map   "mo:core/Map";
import Types "../types/index-page-config";

module {
  public type IndexPageConfig = Types.IndexPageConfig;
  public type ConfigStore     = Map.Map<Text, IndexPageConfig>;

  let CONFIG_KEY : Text = "default";

  public func getIndexPageConfig(store : ConfigStore) : ?IndexPageConfig {
    store.get(CONFIG_KEY)
  };

  public func saveIndexPageConfig(store : ConfigStore, config : IndexPageConfig) : () {
    store.add(CONFIG_KEY, config);
  };
};

