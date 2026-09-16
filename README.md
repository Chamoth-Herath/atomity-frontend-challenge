# Atomity — Cost Explorer

A small, interactive cloud cost explorer built with **React, Framer Motion, JavaScript, and CSS Modules**.

## Feature choice

**Option A, 0:30–0:40.** The reference moves from clusters to namespaces to pods, using a chart and a cost table. This is a useful way to answer one question: where is the money going?

This version keeps that flow and turns it into a connected inspection experience. Hovering or focusing a chart item highlights the matching table row (and vice versa), the cost insight updates from the resource being inspected, and the pod level adds a compact resource-cost composition view. Click a bar or resource name to explore. Use the breadcrumb to go back. Pods are the final level.

## Run locally

Install Node.js **22.12 or newer**. Open a terminal in this folder, beside `package.json`:

```bash
npm ci
npm run dev
```

Open the local address printed in the terminal. Internet access is needed to load the example data.

```bash
npm test         # Check the data calculations and caching
npm run build   # Create the production files in dist/
npm run preview # Open the production build locally
```

## How the code fits together

| File or folder | Job |
| --- | --- |
| `src/App.jsx` | Page header, introduction, feature, and footer |
| `src/components/CostExplorer.jsx` | Current location and the three-level explorer |
| `src/components/BarChart.jsx` | Chart bars and their scroll animations |
| `src/components/ResourceTable.jsx` | Exact costs and keyboard-accessible drill-down buttons |
| `src/components/Breadcrumbs.jsx` | Navigation back to a parent level |
| `src/components/AnimatedNumber.jsx` | Smoothly counts the total |
| `src/components/StatusView.jsx` | Loading, offline, empty, and error messages |
| `src/components/ThemeToggle.jsx` | Theme preference, saved on this device |
| `src/data/costs.js` | Fetches, checks, groups, and adds up API data |
| `src/data/queryClient.js` | Shared request cache settings |
| `src/hooks/useCosts.js` | Gives the component its query state |
| `src/tokens.css` | Shared colors, spacing, corners, and typeface |
| `tests/` | Focused tests for totals, invalid data, and request reuse |

The flow is: **API → cost groups → cached query → explorer → chart and table**. Only two selected group IDs are stored in React state. Both views use the same rows, so their amounts stay in sync.

## Data and caching

The page requests up to 64 records from the [DummyJSON Products API](https://dummyjson.com/docs/products). It uses product prices as example monthly pod costs. Four pods make a namespace; four namespaces make a cluster. A shorter response still works.

These are **illustrative costs, not actual cloud measurements**. Each price is split into CPU (45%), RAM (25%), storage (10%), GPU (12%), and network (the remainder, about 8%). Amounts are stored as integer cents. The remainder keeps every row and group total exact. Efficiency is an example derived from the product discount percentage: `(total − example waste) / total`. Parent efficiency is weighted by cost. Zero-cost resources use 100% to avoid division by zero.

TanStack Query keeps data fresh for **5 minutes** and retains inactive data for **30 minutes**. There is one QueryClient outside the React component tree. Requests in progress are shared, including a brief StrictMode unmount/remount. Changing layers or theme does not start another request. A fresh revisit displays the cache immediately. A stale mount or reconnect may refresh in the background; there is no polling. A full browser reload starts a new in-memory cache.

The request times out after 10 seconds and retries once on failure. Loading, offline, error, retry, empty, and success states are handled. A failed background update keeps the last good data visible. No hardcoded fallback hides a failed API request.

## Animation

Motion is deliberately staged instead of starting everything at once. Framer Motion's `useInView` reveals the explorer heading and panel first, then staggers the summary metrics and chart heading. The chart has its own observer, so each column fades in and each bar grows from the bottom with a short stagger. Table rows reveal in sequence when the table enters view, and the three explanatory layer cards use a separate scroll-triggered stagger lower on the page.

Key numeric values count smoothly: total monthly cost, resource count, largest-share percentage, and chart value labels. Moving between cluster, namespace, and pod views uses a tightly damped spring so the transition feels responsive without bounce or overshoot. Hover feedback stays subtle: chart items lift slightly with a soft shadow, the matching chart/table item stays in focus while unrelated rows soften, and guide cards move only a couple of pixels. At pod level, the cost-mix segments reveal in sequence so the drill-down ends with a useful resource breakdown rather than another decorative animation.

Transforms and opacity do the main work, using an ease-out curve for entrances and a controlled spring for layer changes. `useReducedMotion`, `MotionConfig`, and the CSS `prefers-reduced-motion` media query remove motion when requested. There is no scroll hijacking, looping decoration, or animation added only for decoration; only the loading placeholder pulses while a request is pending.

## Styles and accessibility

All component colors reference variables in `tokens.css`. Dark mode overrides the same variables. CSS Modules keep each component's styles local. The only fixed colors outside the token file are in the standalone favicon asset.

Container queries adapt the feature at 48 rem and 30 rem. Native CSS nesting keeps related rules together. `:has()` highlights a table row when its button is hovered or focused. `color-mix()` makes the panel shadow. Logical properties and `clamp()` handle spacing and fluid sizing.

The layout is designed for desktop, 768 px tablet, and 375 px mobile. The detailed table stays inside the same visual width as the chart and does not use a horizontal scrollbar. At tablet and phone widths, type and spacing compress carefully so every cost column remains visible.

The page uses semantic headings, a section, breadcrumb navigation, and a real table. Interactive chart bars and resource names are native buttons. Focus moves to the new layer heading after navigation. Screen readers receive the final total instead of every animation frame. Both themes have visible focus styles and readable text contrast.

## Libraries and decisions

- **React / React DOM:** components and a small amount of local state.
- **Framer Motion:** scroll entrances, bar motion, and number counting.
- **TanStack Query:** shared async state, retries, and request caching.
- **Vite / its React plugin:** local development and production builds.
- **CSS Modules:** component styles without another styling dependency.
- **Node's built-in test runner:** a few useful tests without another test library.

The app was written from an empty folder. No UI kit, site template, chart library, or pre-made components are used. JavaScript keeps the scope small and follows the requested stack. The chart intentionally has only four bars per level. A real backend, date filtering, and a full dashboard would make this challenge larger than it needs to be.

## Validation and next improvements

The cost-calculation test suite and source syntax checks pass in this build environment. The project still includes the cache tests; run `npm ci`, `npm test`, and `npm run build` locally before submission to verify the installed dependencies, browser layout, keyboard interaction, and live API response. `SUBMIT.md` contains the short manual check to run before submitting.

With more time: connect a real cloud-cost API, add browser tests for navigation and reduced motion, then consider TypeScript for the response and resource types.

AI assistance was used during implementation. The commit history records the actual development stages.

See [SUBMIT.md](./SUBMIT.md) for GitHub and deployment steps.
