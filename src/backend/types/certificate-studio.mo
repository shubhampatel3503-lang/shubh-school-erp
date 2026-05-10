module {
  /// Extended CertificateTemplate with drag-and-drop element positions stored as JSON blob.
  public type CertificateTemplate = {
    id          : Text;
    name        : Text;
    templateType: Text;       // e.g. "bonafide", "character", "sports", "transfer"
    elementsJson: Text;       // serialised [{type, x, y, w, h, value, ...}] blob
    thumbnail   : Text;       // base64 or URL preview
    isDefault   : Bool;
    createdBy   : Text;
    updatedAt   : Int;        // nanoseconds since epoch
  };
};
