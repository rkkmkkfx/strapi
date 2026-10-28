# Mobile layouts for the Strapi v4 admin

## Intent

Improve the existing admin in `rkkmkkfx/strapi`, starting with mobile layouts.
The user selected adapting the existing admin instead of building a separate UI.
Base the work on branch `v4`, checked out at `7ad165f` (v4.26.2).

## Approaches

- **Selected: adapt existing React components and styled-components.** Reuse the
  design system, routes, permission checks, and content-manager behavior. This
  keeps upstream changes easier to incorporate.
- **Separate mobile interface:** offers independent layouts but duplicates
  functionality and ongoing maintenance. The user chose the existing admin.

## First delivery

1. **Navigation:** below 768 CSS pixels, replace the persistent main sidebar
   with a labeled menu button and an accessible drawer. Provide a close button,
   Escape dismissal, focus containment and restoration, background scroll
   locking, and dismissal on navigation. Closed navigation must be absent from
   the keyboard focus order. Keep the existing desktop sidebar behavior.
2. **Content navigation:** expose content types through a second labeled mobile
   toggle instead of a persistent second sidebar. Keep search, collection and
   single-type links. Never show both mobile navigation panels simultaneously.
3. **Content lists:** let page titles, search, filters, actions, and pagination
   wrap or stack. Confine horizontal scrolling to the data table, retaining
   columns, selection, sorting, and row actions. Do not replace tables with cards
   in this delivery.
4. **Content editing:** retain the existing responsive field grids, fix any
   outer-width constraints, reduce narrow-screen padding, and ensure metadata
   panels stack below fields. Let title and save/publish actions wrap without
   overlap. Preserve existing forms, permissions, confirmations and validation.

The 768px breakpoint and the precise spacing are implementation proposals,
chosen by the assistant. Use existing theme tokens where possible. Changes to
shared wrappers may benefit other pages, but this first delivery promises the
main navigation and content-manager list/edit flows only.

## Constraints and exclusions

Use the existing React, TypeScript, styled-components and design system. Do not
change APIs, content schemas, authorization, or the publish workflow. No new
mobile app, visual rebrand, broad settings/plugin redesign, or dependency upgrade.
Avoid global CSS selectors that assume undocumented design-system DOM structure.
All new visible labels use the existing internationalization mechanism.

## Validation and acceptance

- At widths 320, 375, 768 and 1280 CSS pixels, verify navigation and representative
  content list/edit pages. Only the table may require horizontal scrolling.
- Verify keyboard opening/closing, Escape, focus return, route changes, resizing
  across the breakpoint, and background scroll restoration.
- Verify search, sorting, pagination, row selection, and save/publish permissions
  remain functional; retain existing unsaved-change protection.
- Run focused component tests for mobile navigation interaction and relevant
  existing tests, lint and type checks. Use browser checks for actual responsive
  layout, recording any setup limitations instead of claiming unrun checks pass.

## Delivery and remaining builder choices

Implement on a feature branch from `v4` and open a pull request against this
fork's `v4` branch. Do not merge. The fork's default `develop` branch is not the
base. Builder chooses component factoring, test fixtures, exact spacing, and
whether to reuse a suitable existing accessible drawer primitive after inspection.
Scope any discovered plugin-specific issues to a later delivery.

## Approved UX revision

The user rejected the first presentation as insufficiently polished and approved
these suggestions with “Do suggestions”: one compact mobile app bar (hamburger,
section title, profile), one global drawer with expanded labels and backdrop
close, an inline native content-type picker, mobile content cards emphasizing
title/status/actions with an optional full table view, distinct list/editor
screens, and reachable editing actions. Retain existing permission checks,
filters, sort/query state, clone/delete confirmations and navigation guards.

Implementation choices: use a native select for collection switching; preserve
actual router guards. Use a sticky editor action strip below the app bar rather
than a fixed bottom bar so the keyboard cannot cover it. Reserve at least 44px
for primary touch controls, use existing theme tokens, honor reduced motion,
and avoid duplicating actions or form fields across breakpoints. WCAG 2.2 AA is
an evaluation target, not a claim of certification. Screenshots must distinguish
sample-content component previews from a live Strapi backend.
