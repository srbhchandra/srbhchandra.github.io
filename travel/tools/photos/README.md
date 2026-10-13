# Trip photos → itinerary pages

Turns a Google Photos album download into checked itinerary data and
publishable photos, on a Mac, without uploading anything. Used for
travel/central-europe.

Keep the work folder (photos, previews, results) outside this repo, e.g.
`~/Pictures/<trip>-work/`. The repo is public.

## Steps

1. **Download** the album (Google Photos → album → ⋮ → Download all).
2. **Build the tools** (Xcode command line tools):
   `swiftc -O analyse.swift -o phototool` and `swiftc -O export.swift -o export`
3. **Analyse every photo** in batches, deleting each batch after it is read:
   list the zip (`zipinfo -1 album.zip > <scratch>/ziplist.txt`), put the
   `phototool` binary at `<scratch>/phototool/phototool`, then
   `run_batches.sh <scratch> <workdir> album.zip`.
   Writes `results.jsonl` (GPS, time, camera, faces/people, aesthetics score)
   and 800px previews in `<workdir>/thumbs/`. Resumable.
4. **Settings** in `<workdir>/config.json`: `{"day1": "YYYY-MM-DD"}`, the
   date of day 1. It stays out of the repo so the travel dates aren't public.
5. **Export the itinerary** for the scripts:
   `node -e "global.window={};eval(require('fs').readFileSync('trip.js','utf8'));require('fs').writeFileSync('<workdir>/trip.json',JSON.stringify(window.TRIP))"`
6. **Check places and order**: `python3 -I timeline.py <workdir>/results.jsonl <workdir>/trip.json <workdir>/timeline.json`
   groups photos into visits and matches them to stops; unmatched visits are
   reverse-geocoded with Nominatim (1 request a second, cached).
7. **Shortlist and pick**: `python3 -I select.py <workdir>` then
   `python3 -I picker.py <workdir>`, open `<workdir>/picker.html`, pick, and
   "Download my picks". Shortlists drop photos with faces or prominent people;
   stop photos use geotagged photos only.
8. **Captions** for the day photos in `<workdir>/captions.json`
   (`{"1": "…", "2": "…"}`), then export:
   `python3 -I export_picks.py <workdir> album.zip picks.json photos photos.js ./export`
   (run in the trip folder). Output files are renamed (original names carry
   timestamps), resized, and carry no EXIF, GPS, dates or camera details.
