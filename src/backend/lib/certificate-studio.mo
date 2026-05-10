import Map   "mo:core/Map";
import List  "mo:core/List";
import Time  "mo:core/Time";
import Types "../types/certificate-studio";

module {
  public type CertificateTemplate = Types.CertificateTemplate;
  public type Store = Map.Map<Text, CertificateTemplate>;

  /// Upsert a certificate template (insert or overwrite by id).
  public func save(
    store      : Store,
    template   : CertificateTemplate,
  ) : CertificateTemplate {
    store.add(template.id, template);
    template
  };

  /// Return every template in the store.
  public func list(store : Store) : [CertificateTemplate] {
    store.values()
      |> List.fromIter<CertificateTemplate>(_)
      |> _.toArray()
  };

  /// Return a template by id, or null if not found.
  public func getById(store : Store, id : Text) : ?CertificateTemplate {
    store.get(id)
  };

  /// Delete a template by id.
  public func remove(store : Store, id : Text) : () {
    store.remove(id)
  };

  /// Mark one template as the default for its templateType,
  /// clearing the flag on all others of the same type.
  public func setDefault(store : Store, id : Text) : () {
    let templateType = switch (store.get(id)) {
      case (?t) t.templateType;
      case null { return };
    };
    store.forEach(func(k, t) {
      if (t.templateType == templateType) {
        store.add(k, { t with isDefault = (k == id); updatedAt = Time.now() })
      }
    })
  };
};
