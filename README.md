# srbhchandra.github.io

My personal site and public-work hub — projects, data visualizations, writing,
and links. Served via GitHub Pages at **https://srbhchandra.github.io**.

## Structure

```
index.html              Landing page (about, projects, links)
assets/style.css        Shared styles
projects/
  man-utd-xg/           Manchester United xG vs xGA visualization
    index.html          Project write-up
    chart.html          Interactive Plotly chart (loads plotly.js from CDN)
    man-utd-xg.png      Static export
travel/
  index.html            Travel landing page (list of itineraries)
  central-europe/       14-day Czechia/Poland/Slovakia/Hungary/Austria/Slovenia/Italy itinerary
blog/                   Writing (placeholder; add a generator when posts start)
```

## Adding a public artifact from a private repo

Export the artifact (PNG / self-contained or CDN-based HTML) and drop it under
`projects/<slug>/`, then add a card linking to it on `index.html`.

## Things to personalize

- Tagline and about text in `index.html` (marked with `TODO`)
- Add a `resume.pdf` to the repo root (the Résumé link points there)
