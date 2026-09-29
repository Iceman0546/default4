# Think Differently — GitHub Pages version

This package is prepared for GitHub Pages static hosting.

## Important
The website files are at the repository root. Do **not** put the contents inside another
`think-differently-option6-v15-hostable/` folder, otherwise the root URL can return GitHub's 404.

## Option A — Deploy from a branch
1. Create/open your GitHub repository.
2. Upload **the contents of this package** so `index.html` is visible at the repository root.
3. Commit the files to your chosen branch (usually `main`).
4. On GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select `main` and `/ (root)`, then Save.
7. Wait for the Pages deployment to finish.

## Option B — GitHub Actions
This package also contains `.github/workflows/pages.yml`.
If you choose GitHub Actions as the Pages source, the workflow will publish the static site.

## What was fixed
- Moved `index.html` to the published root.
- Kept all existing HTML/CSS/JS/images and their working relative paths.
- Removed Flask server files that GitHub Pages cannot execute.
- Removed Python `__pycache__` artifacts.
- Added `.nojekyll` for predictable static-file serving.
- Added a root-level `404.html`.
- Added this deployment guide.

This is a static website; the chatbot is client-side JavaScript and does not require Flask.
