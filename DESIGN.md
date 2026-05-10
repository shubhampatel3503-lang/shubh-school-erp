# Design Brief: SHUBH SCHOOL ERP

## Tone
Institutional prestige with modern clarity. Authoritative yet approachable. Navy + gold conveys tradition (institutional heritage) and aspiration (excellence).

## Palette
| Token | OKLCH | Purpose |
|-------|-------|---------|
| Primary | `0.32 0.12 260` | Deep navy — institutional authority, trustworthy |
| Accent | `0.72 0.18 60` | Gold/amber — prestige, highlights, active states |
| Foreground | `0.22 0.04 254` | Dark navy text on light backgrounds |
| Background | `0.98 0.01 210` | Warm off-white, subtle blue undertone |
| Muted | `0.88 0.02 260` | Subtle grey for secondary content |
| Card | `1.0 0 0` | Pure white for content containers |
| Sidebar | `0.18 0.08 254` | Dark navy for main navigation |
| Destructive | `0.55 0.22 25` | Red for warnings/deletions |

## Typography
- **Display:** Space Grotesk (geometric, modern, institutional) — headings, module labels
- **Body:** DM Sans (highly legible, neutral) — all text, forms, tables
- **Mono:** Geist Mono (technical content) — code blocks, references

## Elevation & Depth
- **Cards:** Subtle shadow (`shadow-sm` on hover) + left blue border stripe (`border-l-4 border-l-primary`)
- **Data tables:** Alternating row backgrounds (`even:bg-muted/30`), clean borders
- **Modals:** `shadow-elevated` (0 4px 12px 0 rgba(0,0,0,0.12))
- **No gloss:** Minimal shadow depth; rely on borders and background tones for hierarchy

## Structural Zones
| Zone | Treatment | Purpose |
|------|-----------|---------|
| Header | White bg, `border-b border-border` | App title, user menu, minimal decoration |
| Sidebar | Deep navy bg, white text, gold accents | Module navigation, always visible |
| Content | Light background, white cards | Dashboard, forms, grids |
| Data Tables | White bg, alternating rows `bg-muted/30` | Student grids, fee tables, attendance lists |
| Footer | Muted background, subtle border | Rarely used; when present: `bg-muted/20 border-t` |

## Component Patterns
- **Buttons:** Primary (navy bg, white text), secondary (white bg, navy text, border), danger (red bg)
- **Badges:** `.badge-primary`, `.badge-accent`, `.badge-muted` — inline display for module status
- **Cards:** `.card-module` (left stripe + shadow), `.card-metric` (for dashboard stats)
- **Forms:** Label + input, required indicator via asterisk, error state in red
- **Sidebar links:** Navy bg at rest, gold bg when active (`.sidebar-link-active`)

## Motion
- **Transitions:** All interactive elements use `transition-smooth` (0.3s cubic-bezier)
- **Entrance:** `.animate-fade-in` for page loads, `.animate-slide-up` for modals
- **Hover:** Subtle shadow increase, no color flash

## Spacing & Rhythm
- **Base unit:** 4px; multiples: 8, 12, 16, 24, 32, 40, 48
- **Density:** Compact for data-heavy screens (tight row height, smaller padding)
- **Module cards:** 1.5rem padding (institutional spacing)

## Differentiation
Dark navy sidebar + white content creates instant visual hierarchy. Gold accents reserved for badges, module labels, and key actions. Designed for 8–12 hour workdays with minimal cognitive load. Academic focus: clean borders and legible typography trump decorative elements.

## Constraints
- No random gradients; only solid colors from palette
- No blur effects or glassmorphism
- No animated backgrounds
- Icons white on navy sidebar, primary color on white backgrounds
- Responsive: mobile sidebar collapses, stacks into hamburger menu

