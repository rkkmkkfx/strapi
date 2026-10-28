# Mobile Admin UX Revision Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans; implement inline with one final independent review.

**Goal:** Replace the utilitarian mobile retrofit with coherent navigation, list and editor experiences.
**Architecture:** Keep desktop and backend behavior. Use an app-bar drawer for global navigation, native collection select for context, shared mobile cards driven by existing list handlers, and a sticky editor action strip.
**Tech Stack:** Existing React, TypeScript, Strapi design system, styled-components, Jest and Playwright.
**Spec:** docs/superpowers/specs/2026-10-28-mobile-admin-design.md (approved UX revision).

## Global Constraints

- Same fork, v4 base, feat/mobile-admin branch and PR #1; no merge.
- Mobile below 768px; test 320, 375, 768, 1280 CSS pixels.
- Keep permissions, query state, navigation guards and workflows; reuse handlers.
- New labels use react-intl; honor reduced motion and keyboard accessibility.

## Review Focus

- Backdrop dismissal and focus return must work without closing on interior clicks.
- Collection changes blocked by dirty-form guards must retain the current option.
- Mobile cards must preserve selection, clone/delete confirmation and permissions.
- Sticky editor actions must remain visible without covering focused fields.
- Breakpoint changes must preserve entered values and release modal scroll locks.

### Task 1: Navigation

- [x] Add failing browser checks for one app bar, native collection picker, backdrop dismissal and touch targets; add collection guard unit tests.
- [x] Update ResponsiveNavigation, AppLayout, main LeftMenu and ContentManagerLayout; create ContentTypeSelector using existing authorized links.
- [x] Verify focus, guard, query and resize behavior with focused tests.

### Task 2: Content workflows

- [x] Add failing browser checks for mobile cards, table switch, separate editor, sticky actions and field preservation across resizing.
- [x] Add MobileContentList and wire it to existing list context/handlers. Reuse existing delete confirmation through a presentation option on Table.Root.
- [x] Add editor-only sticky action strip with existing save/publish actions; keep desktop behavior.
- [x] Replace mixed fixture with separate list/editor routes and production components; verify types, lint, focused/browser and full admin tests.

### Task 3: Review and delivery

- [x] Independently review the final changes and fix material issues.
- [x] Capture list/editor/drawer screenshots; update PR #1 with scope and verification.
