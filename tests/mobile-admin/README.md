# Mobile admin layout regression checks

This browser fixture renders the production `AppLayout`, `ContentManagerLayout`,
responsive content wrappers, collection picker, shared mobile cards, and Strapi design-system navigation, grids and table.
It checks separate list/editor screens at 320px, 375px, 768px and 1280px, long titles, contained table scrolling, selection/sorting, form submission, modal keyboard focus, backdrop/Escape dismissal, resizing, 200% text enlargement and reduced motion. The editor uses a sticky action strip below the app bar.
It does not start a Strapi backend or exercise real API writes or publishing.

From the repository root, after installing workspace dependencies:

```sh
yarn playwright install chromium
yarn playwright test --config tests/mobile-admin/playwright.config.ts
yarn tsc -p tests/mobile-admin/tsconfig.json
yarn workspace @strapi/admin-test-utils build
yarn workspace @strapi/admin test:front --runInBand --runTestsByPath admin/src/layouts/tests/ResponsiveNavigation.test.tsx
```

For an existing Chromium installation, set
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium` before the browser command.
The fixture server binds to localhost on port 4317; no production server is used.
The browser fixture uses local English labels and sample entries solely for tests.

The previews at `/list` and `/editor` are sample-content component screens. They do not connect to production data. Screenshot capture waits for reduced-motion rendering so the drawer is fully visible.
