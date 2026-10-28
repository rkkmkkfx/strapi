# Mobile admin layout regression checks

This browser fixture renders the production `AppLayout`, `ContentManagerLayout`,
responsive content wrappers, and Strapi design-system navigation, grids and table.
It checks 320px, 375px, 768px and 1280px viewports, long titles, contained table
scrolling, form submission, modal keyboard focus, route dismissal and resizing.
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
