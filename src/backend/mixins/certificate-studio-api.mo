import Map    "mo:core/Map";
import Time   "mo:core/Time";
import Types  "../types/certificate-studio";
import CertLib "../lib/certificate-studio";

/// Public certificate-studio endpoints.
/// Receives the shared certTemplates map from main.mo.
mixin (certTemplates : Map.Map<Text, Types.CertificateTemplate>, nextIdRef : { var value : Nat }) {

  /// Save (create or update) a certificate template.
  public shared func saveCertificateTemplate(
    id          : Text,
    name        : Text,
    templateType: Text,
    elementsJson: Text,
    thumbnail   : Text,
    isDefault   : Bool,
    createdBy   : Text,
  ) : async Types.CertificateTemplate {
    // If id is empty, generate a new one; otherwise upsert
    let templateId = if (id == "") {
      let newId = nextIdRef.value;
      nextIdRef.value += 1;
      newId.toText()
    } else {
      id
    };
    let template : Types.CertificateTemplate = {
      id          = templateId;
      name;
      templateType;
      elementsJson;
      thumbnail;
      isDefault;
      createdBy;
      updatedAt   = Time.now();
    };
    CertLib.save(certTemplates, template)
  };

  /// Return all certificate templates.
  public query func getCertificateTemplates() : async [Types.CertificateTemplate] {
    CertLib.list(certTemplates)
  };

  /// Return a single template by id.
  public query func getCertificateTemplateById(id : Text) : async ?Types.CertificateTemplate {
    CertLib.getById(certTemplates, id)
  };

  /// Delete a certificate template.
  public shared func deleteCertificateTemplate(id : Text) : async () {
    CertLib.remove(certTemplates, id)
  };

  /// Set one template as the default for its type.
  public shared func setDefaultCertificateTemplate(id : Text) : async () {
    CertLib.setDefault(certTemplates, id)
  };
};
