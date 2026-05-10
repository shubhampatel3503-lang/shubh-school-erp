import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { IndexPageConfig, IndexPageSection } from "@/hooks/useBackend";
import { useGetIndexPageConfig, useSchoolInfo } from "@/hooks/useBackend";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ExternalLink,
  GraduationCap,
  IndianRupee,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Icon map & built-in feature cards ──────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Users,
  IndianRupee,
  ClipboardCheck,
  Award,
  MessageSquare,
  BookMarked,
  Phone,
  Mail,
};

const BUILTIN_FEATURES = [
  {
    icon: "GraduationCap",
    title: "Academics",
    desc: "Classes, subjects, syllabi, and timetables managed seamlessly.",
  },
  {
    icon: "Users",
    title: "Students",
    desc: "Complete student lifecycle from admission to alumni.",
  },
  {
    icon: "IndianRupee",
    title: "Fee Management",
    desc: "Automated fee collection with receipts, reminders, and reports.",
  },
  {
    icon: "ClipboardCheck",
    title: "Attendance",
    desc: "Multi-mode daily attendance tracking with analytics.",
  },
  {
    icon: "Award",
    title: "Examinations",
    desc: "Smart exam scheduling, results, and bulk printing.",
  },
];

// ─── Hero Image Slider ───────────────────────────────────────────────────────

interface HeroSliderProps {
  images: string[];
  textColor: string;
}

function HeroSlider({ images, textColor }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = images.length;

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + total) % total),
    [total],
  );
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, total, next]);

  if (total === 0) return null;

  const arrowStyle: React.CSSProperties = {
    color: textColor || "#ffffff",
    borderColor: `${textColor || "#ffffff"}40`,
    backgroundColor: `${textColor || "#ffffff"}15`,
  };

  return (
    <>
      {/* Slides */}
      {images.map((src, i) => (
        <div
          key={src + String(i)}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/60 to-accent/30" />
        </div>
      ))}

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={arrowStyle}
            data-ocid="hero.slider.prev"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-sm transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={arrowStyle}
            data-ocid="hero.slider.next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
          data-ocid="hero.slider.dots"
        >
          {images.map((_, i) => (
            <button
              key={String(i)}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setCurrent(i)}
              className="h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              style={{
                width: i === current ? "24px" : "8px",
                backgroundColor:
                  i === current
                    ? textColor || "#ffffff"
                    : `${textColor || "#ffffff"}55`,
              }}
              data-ocid={`hero.slider.dot.${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Pause/resume on hover — invisible overlay */}
      <div
        className="absolute inset-0 z-10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-hidden
      />
    </>
  );
}

// ─── Section renderers ───────────────────────────────────────────────────────────────

function HeroSection({
  config,
  school,
}: {
  config: IndexPageConfig;
  school: { name: string; photoUrl?: string } | undefined;
}) {
  const sliderImages: string[] = (() => {
    if (config.heroImages && config.heroImages.length > 0)
      return config.heroImages;
    if (config.heroImageFileId) return [config.heroImageFileId];
    if (school?.photoUrl) return [school.photoUrl];
    return ["/assets/generated/school-hero.dim_1200x600.jpg"];
  })();
  const hasCustomBg = !!config.heroBgColor;
  const textColor = config.heroTextColor || "#ffffff";
  const sortedLinks = [...(config.customLinks ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  return (
    <section
      className="relative min-h-[70vh] flex items-center overflow-hidden"
      style={hasCustomBg ? { backgroundColor: config.heroBgColor } : {}}
      data-ocid="hero.section"
    >
      {!hasCustomBg && <div className="absolute inset-0 bg-primary" />}
      <HeroSlider images={sliderImages} textColor={textColor} />
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
          style={{ color: textColor }}
        >
          <h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            style={{ color: textColor }}
          >
            {config.heroTitle}
          </h1>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: `${textColor}cc` }}
          >
            {config.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg"
                style={
                  config.ctaButtonColor
                    ? {
                        backgroundColor: config.ctaButtonColor,
                        color: "#fff",
                        borderColor: config.ctaButtonColor,
                      }
                    : {}
                }
                data-ocid="hero.login_button"
              >
                {config.ctaButtonText || "Login to Dashboard"}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="backdrop-blur-sm"
              style={{
                borderColor: `${textColor}50`,
                color: textColor,
                backgroundColor: `${textColor}15`,
              }}
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="hero.about_button"
            >
              Learn More
            </Button>
            {sortedLinks.map((link, i) => (
              <a
                key={link.url + String(i)}
                href={link.url}
                target={link.isExternal ? "_blank" : undefined}
                rel={link.isExternal ? "noreferrer noopener" : undefined}
                data-ocid={`hero.custom_link.${i + 1}`}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="backdrop-blur-sm font-semibold"
                  style={{
                    borderColor: `${textColor}60`,
                    color: textColor,
                    backgroundColor: `${textColor}20`,
                  }}
                >
                  {link.label}
                  {link.isExternal && <ExternalLink className="ml-2 h-4 w-4" />}
                </Button>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection({
  section,
  config,
}: { section: IndexPageSection; config: IndexPageConfig }) {
  const style: React.CSSProperties = {};
  if (section.bgColor) style.backgroundColor = section.bgColor;
  if (section.textColor) style.color = section.textColor;
  const cards =
    config.featureCards && config.featureCards.length > 0
      ? config.featureCards.map((fc) => ({
          icon: ICON_MAP[fc.icon] ?? MessageSquare,
          title: fc.title,
          desc: fc.description,
        }))
      : BUILTIN_FEATURES.map((f) => ({
          icon: ICON_MAP[f.icon] ?? MessageSquare,
          title: f.title,
          desc: f.desc,
        }));
  return (
    <section
      className="py-20"
      style={Object.keys(style).length ? style : undefined}
      id="features"
      data-ocid="features.section"
    >
      <div className={!section.bgColor ? "bg-muted/30" : ""}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">
              {section.title || "Complete School Management"}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {section.description}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cards.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="card-module"
                  data-ocid={`features.item.${i + 1}`}
                >
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutSection({
  section,
  school,
}: {
  section: IndexPageSection;
  school:
    | { address?: string; phone?: string; email?: string; photoUrl?: string }
    | undefined;
}) {
  const imgSrc =
    section.imageFileId ||
    school?.photoUrl ||
    "/assets/generated/school-hero.dim_1200x600.jpg";
  const style: React.CSSProperties = {};
  if (section.bgColor) style.backgroundColor = section.bgColor;
  return (
    <section
      className="py-20"
      style={Object.keys(style).length ? style : undefined}
      id="about"
      data-ocid="about.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge-muted mb-4 inline-flex">About Us</span>
            <h2
              className="font-display text-3xl font-bold text-foreground mb-4"
              style={section.textColor ? { color: section.textColor } : {}}
            >
              {section.title || "Excellence in Education"}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {section.description}
            </p>
            <div className="space-y-3">
              {school?.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {school.address}
                  </span>
                </div>
              )}
              {school?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-accent shrink-0" />
                  <a
                    href={`tel:${school.phone}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {school.phone}
                  </a>
                </div>
              )}
              {school?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-accent shrink-0" />
                  <a
                    href={`mailto:${school.email}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {school.email}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-elevated aspect-video"
          >
            <img
              src={imgSrc}
              alt="School campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ section }: { section: IndexPageSection }) {
  const style: React.CSSProperties = {};
  if (section.bgColor) style.backgroundColor = section.bgColor;
  return (
    <section
      className="py-20"
      style={Object.keys(style).length ? style : undefined}
      id="contact"
      data-ocid="contact.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Phone className="size-6 text-primary" />
        </div>
        <h2
          className="font-display text-3xl font-bold text-foreground mb-4"
          style={section.textColor ? { color: section.textColor } : {}}
        >
          {section.title || "Contact Us"}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          {section.description}
        </p>
      </div>
    </section>
  );
}

function TestimonialsSection({ section }: { section: IndexPageSection }) {
  const style: React.CSSProperties = {};
  if (section.bgColor) style.backgroundColor = section.bgColor;
  return (
    <section
      className="py-20"
      style={Object.keys(style).length ? style : undefined}
      id="testimonials"
      data-ocid="testimonials.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="size-6 text-primary" />
          </div>
          <h2
            className="font-display text-3xl font-bold text-foreground"
            style={section.textColor ? { color: section.textColor } : {}}
          >
            {section.title || "What People Say"}
          </h2>
          {section.description && (
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              {section.description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function CustomSection({ section }: { section: IndexPageSection }) {
  const style: React.CSSProperties = {};
  if (section.bgColor) style.backgroundColor = section.bgColor;
  return (
    <section
      className="py-20"
      style={Object.keys(style).length ? style : undefined}
      data-ocid={`custom_section.${section.id}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className={
            section.imageFileId
              ? "grid lg:grid-cols-2 gap-12 items-center"
              : "max-w-2xl mx-auto text-center"
          }
        >
          <div>
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="size-5 text-primary" />
            </div>
            <h2
              className="font-display text-3xl font-bold text-foreground mb-4"
              style={section.textColor ? { color: section.textColor } : {}}
            >
              {section.title}
            </h2>
            {section.description && (
              <p className="text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            )}
          </div>
          {section.imageFileId && (
            <div className="rounded-2xl overflow-hidden shadow-elevated aspect-video">
              <img
                src={section.imageFileId}
                alt={section.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="animate-pulse" data-ocid="landing.loading_state">
      <div className="h-16 bg-card border-b border-border" />
      <div className="min-h-[60vh] bg-primary/20 flex items-center px-8">
        <div className="space-y-4 max-w-xl">
          <Skeleton className="h-14 w-96" />
          <Skeleton className="h-5 w-80" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-40" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>
      </div>
      <div className="py-20 px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto mb-12" />
          <div className="grid grid-cols-5 gap-6">
            {(["sk1", "sk2", "sk3", "sk4", "sk5"] as const).map((sk) => (
              <Skeleton key={sk} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PublicLandingPage() {
  const { data: school } = useSchoolInfo();
  const { data: rawConfig, isLoading } = useGetIndexPageConfig();

  if (isLoading) {
    return (
      <PublicLayout>
        <PageSkeleton />
      </PublicLayout>
    );
  }

  // No config or not published — show minimal placeholder
  if (!rawConfig || !rawConfig.isPublished) {
    return (
      <PublicLayout>
        <nav className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                <BookMarked className="size-5 text-primary-foreground" />
              </div>
              <p className="font-bold font-display text-foreground text-sm">
                {school?.name ?? "SHUBH SCHOOL ERP"}
              </p>
            </div>
            <Link to="/login">
              <Button
                size="sm"
                className="font-semibold"
                data-ocid="public.login_button"
              >
                Login to ERP
              </Button>
            </Link>
          </div>
        </nav>
        <div
          className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background"
          data-ocid="landing.placeholder"
        >
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary mb-6">
            <BookMarked className="size-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            {school?.name ?? "SHUBH SCHOOL ERP"}
          </h1>
          <p className="text-muted-foreground mb-8 text-center max-w-sm">
            School Management System
          </p>
          <Link to="/login">
            <Button
              size="lg"
              className="font-semibold"
              data-ocid="landing.login_button"
            >
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const config = rawConfig;
  const visibleSections = [...config.sections]
    .filter((s) => s.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <PublicLayout>
      <nav className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
              <BookMarked className="size-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold font-display text-foreground text-sm leading-none">
                {school?.name ?? config.heroTitle ?? "SHUBH SCHOOL ERP"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                School Management System
              </p>
            </div>
          </div>
          <Link to="/login">
            <Button
              data-ocid="public.login_button"
              size="sm"
              className="font-semibold"
            >
              Login to ERP
            </Button>
          </Link>
        </div>
      </nav>
      <HeroSection config={config} school={school} />
      {visibleSections.map((section) => {
        switch (section.sectionType) {
          case "features":
            return (
              <FeaturesSection
                key={section.id}
                section={section}
                config={config}
              />
            );
          case "about":
            return (
              <AboutSection
                key={section.id}
                section={section}
                school={school}
              />
            );
          case "contact":
            return <ContactSection key={section.id} section={section} />;
          case "testimonials":
            return <TestimonialsSection key={section.id} section={section} />;
          case "custom":
            return <CustomSection key={section.id} section={section} />;
          default:
            return null;
        }
      })}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookMarked className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {school?.name ?? "SHUBH SCHOOL ERP"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </PublicLayout>
  );
}
