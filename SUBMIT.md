# Run and submit

## 1. Open the project

Extract the ZIP. In VS Code, choose **File → Open Folder**, then open `atomity-option-a`.

Open **Terminal → New Terminal**. Make sure `package.json` is visible in this folder. If you see a “package.json not found” error, open this project folder instead of its parent.

Install [Node.js](https://nodejs.org/en/download) version 22.12 or newer, then run:

```bash
npm install
npm run dev
```

Open the address printed in the terminal. Keep the terminal running. Press **Ctrl+C** when you want to stop the site.

## 2. Check it before sending

- Scroll down: the section enters first, then the chart bars grow in order.
- Click a cluster, then a namespace. Check the pod costs. Use “All clusters” to return.
- Open Developer Tools → Network. Filter by `products`. A successful first load should make one request; changing layers and theme should not add requests.
- Check 375 px, 768 px, and 1280 px widths in responsive mode. Only the detailed table should scroll sideways.
- Use Tab, Shift+Tab, and Enter to explore. Check the focus indicator and both themes.
- Enable reduced motion in your operating system or browser tools. Reload: content should appear without movement.
- To check loading, use Slow 3G and reload. To check the error state, block the API request and reload. Unblock it and select “Try again.”

Run:

```bash
npm test
npm run build
```

Read the README and the main components. Make any changes you want and be ready to explain the data flow, the two selected IDs, the cache settings, and the animations.

## 3. Put the project on GitHub

The download includes `atomity-history.bundle`. It preserves the real development commits.

1. Install [Git](https://git-scm.com/downloads) if needed.
2. On GitHub, create a new repository named `atomity-frontend-challenge`.
3. Choose **Public**. Leave “Add a README”, `.gitignore`, and license unchecked because the project already has its files.
4. In the terminal inside the extracted `atomity-option-a` folder, run:

```bash
git clone atomity-history.bundle ../atomity-github
cd ../atomity-github
git remote set-url origin https://github.com/YOUR-USERNAME/atomity-frontend-challenge.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Sign in if Git asks. This creates a sibling folder called `atomity-github`; use that folder for future edits. Clone the bundle before making personal edits, or copy your edited files into this new folder and commit them before pushing.

Do not upload the ZIP through GitHub's file-upload page; that would lose the included history. Do not squash the existing commits. Add new commits for your own actual changes.

Your repository link will be:

```text
https://github.com/YOUR-USERNAME/atomity-frontend-challenge
```

## 4. Deploy on Vercel

The public demo provided with the project can be used as the live link. To host a copy from your own GitHub account, follow these [Vercel instructions for Vite](https://vercel.com/docs/frameworks/frontend/vite):

1. Sign in to Vercel and choose **Add New → Project**.
2. Import `atomity-frontend-challenge` from GitHub.
3. Keep the framework as **Vite** and the root directory as the repository root.
4. Use build command `npm run build` and output directory `dist`.
5. Use a supported Node.js version of 22.12 or newer. No environment variables are required.
6. Select **Deploy**. Copy the finished public URL.
7. Open both your repository and live demo in a private/incognito window. A reviewer must be able to access them without your account.

## 5. Submit

Reply to the original Atomity email before the stated deadline: **Friday, 18 September, 23:59**. The repository must contain `README.md`.

Replace both bracketed links in this message:

```text
Hello Team Atomity,

Please find my Frontend Engineering Challenge submission below. I chose Option A and used React, Framer Motion, JavaScript, and Tailwind CSS.

GitHub repository: [your public GitHub repository link]
Live demo: [your public live demo link]

The README explains the approach, data fetching, caching, animations, and tradeoffs.

Thank you for the opportunity.

Best regards,
Chamoth Herath
```
