module {
  /// A single configurable section on the public index page.
  public type IndexPageSection = {
    id          : Text;
    sectionType : Text;   // "hero" | "features" | "about" | "contact" | "testimonials" | "custom"
    title       : Text;
    description : Text;
    imageFileId : Text;
    bgColor     : Text;
    textColor   : Text;
    isVisible   : Bool;
    order       : Nat;
  };

  /// A custom link entry shown on the index page (e.g. Online Admission, Certificate Auth).
  public type CustomLink = {
    linkLabel   : Text;
    url        : Text;
    isExternal : Bool;
    order      : Nat;
  };

  /// Full configuration for the public-facing index / landing page.
  public type IndexPageConfig = {
    heroTitle       : Text;
    heroSubtitle    : Text;
    heroImageFileId : Text;
    heroBgColor     : Text;
    heroTextColor   : Text;
    ctaButtonText   : Text;
    ctaButtonColor  : Text;
    sections        : [IndexPageSection];
    customLinks     : [CustomLink];    // extra navigation links
    isPublished     : Bool;            // toggle page visibility
  };
};

