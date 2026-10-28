# Mobile Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Make content accessible on mobile by removing persistent sidebars and fixing list/edit width constraints.
**Architecture:** Reuse one responsive navigation wrapper for main and content-type navigation. Keep desktop content mounted once, and use an accessible mobile dialog for navigation. Use explicit styled layout wrappers for list/edit controls.
**Tech Stack:** React, TypeScript, styled-components, existing Strapi design system, Jest, Playwright.
**Spec:** docs/superpowers/specs/2026-10-28-mobile-admin-design.md

## Global Constraints

- Base: v4; target PR: rkkmkkfx/strapi v4. No merge.
- Mobile breakpoint below 768 CSS pixels. Check 320, 375, 768 and 1280.
- Preserve permissions, routes, forms, validation and publish workflow.
- No dependency upgrades; new labels use react-intl.

## Review Focus

- Keyboard focus must not enter hidden navigation; test closed/open behavior.
- Route/search changes must close drawers; test route transitions.
- Resizing to desktop must release scroll lock; test media query transitions.
- Long titles and tables must not expand the page; browser-check real layout wrappers.
- Dirty-form navigation must keep existing router blocking behavior; do not manually replace links.

### Task 1: Responsive navigation

**Files:** Create layouts/ResponsiveNavigation.tsx and layouts/tests/ResponsiveNavigation.test.tsx under packages/core/admin/admin/src; modify layouts/AppLayout.tsx and content-manager/pages/App.tsx.
**Interfaces:** ResponsiveNavigation({ children: ReactNode, label: string, id: string }): JSX.Element. Shared mobile navigation close event ensures at most one open panel.

- [ ] Write tests for opening, Escape/close, focus return, background scroll restoration, route change, breakpoint changes and mutually exclusive panels.
- [ ] Run focused tests and observe missing behavior.
- [ ] Implement wrapper and wire main and content-manager navigation; set flex child min-width:0 and full available width.
- [ ] Run focused tests; commit navigation.

### Task 2: List/edit layouts

**Files:** Create content-manager/components/ResponsiveLayouts.tsx; modify content-manager/pages/ListView/ListViewPage.tsx, content-manager/pages/EditView/EditViewPage.tsx and its components/Header.tsx.
**Interfaces:** Styled wrappers ResponsiveHeaderLayout, ResponsiveActionLayout, ResponsiveContentLayout, ResponsivePagination and ScrollableTable; use existing design-system prop types.

- [ ] Add browser regression coverage for available content width, long titles, wrapping controls, and contained table overflow.
- [ ] Observe failures against existing layouts.
- [ ] Implement scoped responsive wrappers, full-width edit columns and wrapping action groups.
- [ ] Run focused and relevant existing tests, lint/type checks and browser checks; commit layouts.

### Task 3: Review and delivery

- [ ] Review complete diff independently, fix material findings and verify.
- [ ] Record exact checks and environment limitations.
- [ ] Push feat/mobile-admin and open PR into fork v4 with scope and validation.
