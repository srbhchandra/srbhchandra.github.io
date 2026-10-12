# srbhchandra.github.io

My personal site and public-work hub — projects, data visualizations, writing,
and links. Served via GitHub Pages at **https://srbhchandra.github.io**.

## Structure

```
index.html              Landing page (about, projects, links)
assets/style.css        Shared styles
projects/
  man-utd-xg/           Manchester United expected-goals page. Build output only,
                        published by scripts/deploy-hub.sh in the private
                        football-performance-viz repo; don't edit by hand
    index.html          The whole page (text + Chart.js charts + data)
    man-utd-xg.png      Static export
  football-tactics-board/  Interactive tactics board (React app). Build output only,
                        published by `npm run deploy:hub` in the private
                        football-tactics-board repo; don't edit by hand
travel/
  index.html            Travel landing page (list of itineraries)
  central-europe/       14-day Czechia/Poland/Slovakia/Hungary/Austria/Slovenia/Italy itinerary
blog/                   Writing (placeholder; add a generator when posts start)
```

## Adding a public artifact from a private repo

Export the artifact (PNG / self-contained or CDN-based HTML) and drop it under
`projects/<slug>/`, then add a card linking to it on `index.html`.

For a built web app (Vite/React etc.), build with the subfolder as its base
path (e.g. `vite build --base=/projects/<slug>/`), or its asset URLs point at the
site root and the page loads blank. Automate the build-and-copy with a script in
the source repo, like `scripts/deploy-hub.sh` in football-tactics-board.

## Things to personalize

- Tagline and about text in `index.html` (marked with `TODO`)
- Add a `resume.pdf` to the repo root (the Résumé link points there)
