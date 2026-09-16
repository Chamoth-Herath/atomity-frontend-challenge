# Run and submit

## 1. Open the project

Extract the ZIP. In VS Code, choose **File → Open Folder**, then open the folder that contains `package.json`.

Open **Terminal → New Terminal** and run:

```bash
npm install
npm run dev
```

Use Node.js **22.12 or newer**. Open the local address printed in the terminal. Keep the terminal running while you test the site, and press **Ctrl+C** when you want to stop it.

After the first successful install, keep the generated `package-lock.json` in the project and commit it with the rest of the source.

## 2. Check the final build before submitting

- Scroll to the explorer and confirm the section enters with staggered motion rather than everything animating at once.
- Click a cluster, then a namespace, then inspect a pod. Use the breadcrumb to return to earlier levels.
- Hover/focus chart items and table rows. The matching item should stay linked between chart and table.
- Click anywhere on a Cluster or Namespace table row and confirm it drills into the matching next level.
- Open Developer Tools → Network and filter by `products`. The first load should request the API data once; changing layers or switching theme should not create redundant requests.
- Check **375 px**, **768 px**, and **1280 px** widths. The chart and table should stay aligned, and the table should remain compact **without a horizontal scrollbar**.
- Use **Tab**, **Shift+Tab**, **Enter**, and **Space** to test keyboard navigation and visible focus states.
- Switch between light and dark mode and confirm text, borders, chart bars, table rows, and focus states remain readable.
- Enable reduced motion in the operating system or browser tools, reload, and confirm animations are removed or simplified.
- Test loading with network throttling. Test the error state by temporarily blocking the API request, then unblock it and use **Try again**.

Run the final verification commands:

```bash
npm test
npm run build
```

Or run both with:

```bash
npm run verify
```

Do not submit until the production build finishes successfully.

## 3. Put this exact final version on GitHub

Use a **public** repository named `atomity-frontend-challenge`.

If you already created the repository, copy/replace its working files with this final version, then commit the real changes incrementally. Do not replace the repository with an older bundle or an earlier CSS Modules version.

Typical commands from your repository folder are:

```bash
git status
git add .
git commit -m "refine final cost explorer experience"
git push origin main
```

If you are creating the repository for the first time:

```bash
git init
git add .
git commit -m "build initial cost explorer"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/atomity-frontend-challenge.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

Important before submission:

- The repository must contain this **Tailwind CSS** version.
- Keep `package-lock.json` in the repository after running `npm install`.
- Keep meaningful development commits; do not squash everything into one giant final commit.
- Open the repository in a private/incognito window to confirm reviewers can access it without signing in.

## 4. Deploy this exact final version

Deploy from the same GitHub repository that contains the final code. Vercel is the simplest option for this Vite project.

1. Sign in to Vercel and choose **Add New → Project**.
2. Import `atomity-frontend-challenge` from GitHub.
3. Keep the framework as **Vite** and the root directory as the repository root.
4. Use build command `npm run build` and output directory `dist` if Vercel does not detect them automatically.
5. Use Node.js **22.12 or newer**. No environment variables are required.
6. Deploy and copy the finished public URL.
7. Open the live URL in a private/incognito window.
8. Compare the deployed site with your local final build to make sure it is this same Tailwind version, not an earlier deployment.

## 5. Final submission checklist

Before sending the email, confirm all of these are true:

- Public GitHub repository opens without signing in.
- Live demo opens without signing in.
- GitHub and live demo show the **same final version**.
- `README.md` explains the feature choice, animation approach, token/style architecture, data fetching, caching, libraries, tradeoffs, and future improvements.
- `package-lock.json` is committed.
- `npm test` passes.
- `npm run build` passes.
- Responsive checks at 375 px, 768 px, and 1280 px are clean.
- No console errors appear during normal use.

Then send:

```text
Hello Team Atomity,

Please find my Frontend Engineering Challenge submission below. I chose Option A and built the feature using React, Framer Motion, JavaScript, and Tailwind CSS.

GitHub repository: [your public GitHub repository link]
Live demo: [your public live demo link]

The README explains my approach to the interaction, animation, data fetching, caching, styling architecture, and tradeoffs.

Thank you for the opportunity.

Best regards,
Chamoth Herath
```
