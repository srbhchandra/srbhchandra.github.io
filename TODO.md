# TODO

This repo is public, so this file is too (srbhchandra.github.io/TODO.md).

## Central Europe itinerary (travel/central-europe/)

- [x] Review places and order against the trip photos (GPS and times).
      Still without a pin: Hanging Umbrella Man, Soul Bistro (Brno), Punto Panoramico,
      Cascate di Limedes, Parcheggio Belvedere, Sentiero Natura Val Falcina.
- [x] Photos (#6): day photos, stop thumbnails, map pop-ups, full-screen viewer.
      Pipeline in travel/tools/photos/; the work folder stays local, in ~/Pictures.
- [ ] Planner (#5): "make it yours", fully static, no backend. A days slider
      (7–18) suggests what to cut or add; export the result as a file for Google
      My Maps, or as Google Maps links per day. Needs from Saurabh: the cut order
      for shorter trips and the add order for longer ones (candidates in
      the "Eastern Europe" planning page in Notion). Known so far: drop
      Bratislava first; Venice and Vienna were the least liked.
- [ ] Maybe (#4): drive profile per day (hours, elevation). Low priority; the
      walking was the fun part.

## Getting found (whole site)

- [x] Itinerary readable without JavaScript (travel/central-europe/tools/build.js bakes
      it into index.html; re-run after editing trip.js), itinerary.json, schema.org
      markup, link-preview tags, robots.txt, sitemap.xml (scripts/build-sitemap.py),
      llms.txt, cross-links between pages.
- [ ] Saurabh: after pushing, add the site to Google Search Console and Bing
      Webmaster Tools and submit https://srbhchandra.github.io/sitemap.xml.
- [ ] Football Tactics Board (its own repo): add a small "by Saurabh Bipin Chandra"
      link back to the site, and pick one main address (github.io or workers.dev)
      with a canonical tag on the other, since it's the same app twice.
- [ ] Man Utd xG page (built by its own repo): add the same author footer.
- [ ] Maybe: privacy-friendly visitor counts (Cloudflare Web Analytics or GoatCounter).
- [ ] Maybe: a personal domain for the whole site (and the apps as subdomains).
- [ ] Share the itinerary where trip planners ask (r/travel, r/solotravel, travel groups).

