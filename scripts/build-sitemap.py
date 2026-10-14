#!/usr/bin/env python3
"""Write sitemap.xml: every page (index.html) in this repo, with the date of its
last commit. Run from the repo root after adding or changing pages:
    python3 scripts/build-sitemap.py
Pages listed in SKIP have no content worth indexing yet."""
import os, subprocess
from xml.sax.saxutils import escape

BASE = 'https://srbhchandra.github.io/'
SKIP = set()  # e.g. {'drafts/'}

pages = []
for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('tools', 'scripts', 'node_modules')]
    if 'index.html' in files:
        path = os.path.relpath(root, '.').replace(os.sep, '/')
        path = '' if path == '.' else path + '/'
        if path in SKIP:
            continue
        day = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', root], capture_output=True, text=True).stdout.strip()
        pages.append((path, day))
pages.sort(key=lambda p: (p[0].count('/'), p[0]))
with open('sitemap.xml', 'w') as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for path, day in pages:
        f.write(f'  <url><loc>{escape(BASE + path)}</loc>' + (f'<lastmod>{day}</lastmod>' if day else '') + '</url>\n')
    f.write('</urlset>\n')
print(f'sitemap.xml: {len(pages)} pages')
