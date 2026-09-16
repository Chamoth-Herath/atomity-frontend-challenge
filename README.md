# Atomity — Cloud Cost Explorer

This is my implementation of **Option A (0:30–0:40)** from the Atomity frontend challenge. I focused on the idea of drilling into cloud costs from **Cluster → Namespace → Pod** and kept it as one interactive section instead of trying to build a full dashboard.

## Why I chose Option A

I liked the drill-down idea because it gave me room to work on interaction, animation and data presentation together. The chart and table use the same data, so hovering one highlights the matching item in the other. Clicking a cluster or namespace moves to the next level, and the breadcrumb can be used to go back.

## Run locally

Node.js **22.12+** is recommended.

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm test
npm run build
npm run preview
npm run verify
```

`npm install` will also generate `package-lock.json`. I keep that file in the final repository so the same dependency versions are used during review and deployment.

## Project structure

```text
src/
  components/
    AnimatedNumber.jsx
    BarChart.jsx
    Breadcrumbs.jsx
    CostExplorer.jsx
    ResourceTable.jsx
    StatusView.jsx
    ThemeToggle.jsx
  data/
    costs.js
    queryClient.js
  hooks/
    useCosts.js
  utils/
    format.js
  App.jsx
  app.css
  main.jsx

tests/
  cache.test.js
  costs.test.js
```

I split the explorer into small components instead of keeping everything in one file. `CostExplorer` owns the current drill-down path, while the chart and table receive the same rows and active item.

## Data fetching and caching

The demo fetches data from the **DummyJSON Products API**. Product prices are used as sample monthly costs, then grouped into pods, namespaces and clusters so the UI can behave like a cloud-cost explorer.

The values are only demo data, not real cloud billing information.

I used **TanStack Query** for the request state and cache. The query uses a five-minute stale time and keeps inactive data for thirty minutes. That means moving between levels or changing the theme does not cause another API request, and revisiting the section can use the cached result immediately.

The UI also handles loading, error, retry, offline and empty states.

## Animation approach

I used **Framer Motion** and tried to keep the motion small and useful.

- The main explorer appears when it enters the viewport.
- Chart bars and table rows use short staggered entrances.
- Main numbers animate when their values change.
- Drill-down changes use a damped spring instead of a large bounce.
- Hover and focus states connect the chart and table visually.

I also use `useReducedMotion` and a `prefers-reduced-motion` CSS rule so the experience is simpler when reduced motion is enabled.

## Styling and design tokens

The project uses **Tailwind CSS v4** for component styling. Shared theme values are defined as CSS variables in `src/app.css` and reused from the components instead of scattering raw color values through the JSX.

The same token set is used by both light and dark themes. I also used `clamp()` for fluid sizing where it made sense.

The layout was written for the challenge review sizes:

- 1280px desktop
- 768px tablet
- 375px mobile

The cost table stays compact on smaller screens instead of adding a horizontal scrollbar.

## Accessibility

I included the basics I would expect in a real interface:

- semantic headings, section, navigation and table elements
- visible keyboard focus states
- Enter/Space support on clickable table rows
- native buttons for chart drill-down
- focus movement after changing levels
- reduced-motion support
- readable light and dark themes

## Libraries used

- **React** — UI and local drill-down state
- **Framer Motion** — scroll, number and transition animations
- **TanStack Query** — API state and caching
- **Tailwind CSS** — component styling
- **Vite** — development and production build
- **Node test runner** — small tests for cost logic and caching

I did not use MUI, Chakra, shadcn, a chart library or a pre-built UI template. The chart, table, breadcrumb, cards and theme control are built inside this project.

## Tradeoffs

I kept the challenge focused on one polished section. The API does not provide real cloud-cost data, so I transform public product data into a predictable hierarchy for the demo. I also stayed with JavaScript because the brief accepts it and I wanted to spend the challenge time on the interaction and motion rather than expanding the scope.

## What I would improve with more time

I would connect the interface to a real cloud-cost API, add browser-level tests for the full drill-down flow, and move the data models to TypeScript. I would also test more real-world datasets and edge cases beyond the challenge demo.

## Development note

I used AI as a support tool for parts of the implementation. I reviewed and tested the final code, and I can explain how the main pieces work and why I made the design decisions in this project.

See `SUBMIT.md` for the final GitHub and deployment checklist.
