#!/usr/bin/env python3
"""Add ?v=<content hash> to local script and stylesheet links in every page, so
browsers fetch fresh files after a push (GitHub Pages caches files for 10 minutes).
Run from the repo root before committing: python3 scripts/bust-cache.py"""
import hashlib, os, re

def stamp(page):
    html = open(page).read()
    base = os.path.dirname(page)
    def fix(m):
        attr, url = m.group(1), m.group(2)
        path = url.split('?')[0]
        if path.startswith(('http:', 'https:', '//')) or not path.endswith(('.js', '.css')):
            return m.group(0)
        f = os.path.join('.', path.lstrip('/')) if path.startswith('/') else os.path.join(base, path)
        if not os.path.exists(f):
            return m.group(0)
        v = hashlib.sha1(open(f, 'rb').read()).hexdigest()[:8]
        return f'{attr}="{path}?v={v}"'
    new = re.sub(r'\b(src|href)="([^"]+)"', fix, html)
    if new != html:
        open(page, 'w').write(new)
        print('updated', page)

for root, dirs, files in os.walk('.'):
    dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('private', 'node_modules', 'tools', 'scripts')]
    for f in files:
        if f.endswith('.html') and not f.startswith('google'):
            stamp(os.path.join(root, f))
