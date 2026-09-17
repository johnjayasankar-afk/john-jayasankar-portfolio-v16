#!/usr/bin/env python3
"""Writes the dev pages for the stories. None of them is deployed.

    python3 tools/stories_lab.py

_stories.html  every story at the sizes the site shows it, at one step or playing:
               /_stories?only=setup-agent&step=1   /_stories?auto=1
_thumbs.html   each story at rest in an 800x500 frame, for assets/img/work/*.jpg
_og.html       the 1200x630 link-preview card (assets/img/og.jpg)
_og_cases.html one 1200x630 link-preview card per case (assets/img/og/<slug>.jpg)"""

import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

import stories  # noqa: E402
import ideas  # noqa: E402
from data_systems_a import SYSTEMS_A  # noqa: E402
from data_systems_b import SYSTEMS_B  # noqa: E402

# the writing covers and the principle drawings, at their card sizes
IDEA_FRAMES = dict(note=[('Note cover', 410, '5 / 4'), ('Note mobile', 338, '16 / 10'), ('Note phone', 280, '16 / 10')],
                   tenet=[('Principle', 365, '16 / 10'), ('Principle mobile', 330, '16 / 10'), ('Principle phone', 256, '16 / 10')])

# (label, width px, aspect ratio) for the places a story appears
FRAMES = [('Case bay', 846, '16 / 9'), ('Tablet bay', 700, '16 / 9'), ('Wide card', 660, '16 / 10'), ('Labs page', 646, '16 / 10'),
          ('Featured card', 568, '16 / 10'), ('Work row', 520, '520 / 300'), ('Labs card', 368, '16 / 11'), ('Mobile', 326, '4 / 3.4'),
          # the narrowest real frames: a 360px phone, and a 320px phone's bays, Labs cards and Work rows
          ('Phone 360', 288, '4 / 3.4'), ('Phone bay', 256, '4 / 3.4'), ('Phone card', 248, '16 / 11'), ('Phone row', 256, '256 / 220')]

LAB = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Story lab</title>
<link rel="stylesheet" href="/assets/css/site.css">
<style>
body { padding: 28px; background: var(--ground); }
.lab-sec { margin-bottom: 48px; }
.lab-h { margin: 0 0 14px; font: 500 13px/1 var(--mono); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); }
.lab-row { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 24px; }
.lab-f { display: grid; grid-template-columns: minmax(0, 1fr); gap: 8px; }
.lab-f > p { font: 400 12px/1 var(--mono); color: var(--ink-3); }
.lab-f .story { width: 100%; min-width: 0; aspect-ratio: var(--ar); }
</style>
<script src="/_stories.js" defer></script>
</head><body>
{{body}}
</body></html>
"""

THUMBS = """<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Story thumbnails</title>
<link rel="stylesheet" href="/assets/css/site.css">
<style>
html, body { margin: 0; background: var(--ground); }
.th { width: 800px; height: 500px; }
.th .story { width: 800px; height: 500px; aspect-ratio: auto; border-radius: 0; box-shadow: none; }
</style>
</head><body>
{{body}}
</body></html>
"""

OG = """<!doctype html>
<html lang="en" data-page="og">
<head>
<meta charset="utf-8">
<title>og card</title>
<link rel="stylesheet" href="/assets/css/site.css">
<style>
html, body { margin: 0; overflow: hidden; }
body { width: 1200px; height: 630px; }
.og {
  position: relative; isolation: isolate; box-sizing: border-box; width: 1200px; height: 630px; padding: 50px 52px 44px 60px;
  display: grid; grid-template-columns: 470px 1fr; gap: 40px; align-items: stretch; overflow: hidden;
  background-color: var(--ground);
  background-image: radial-gradient(60% 70% at 20% 0%, rgba(110, 231, 183, .28), transparent 70%), radial-gradient(circle at 1px 1px, rgba(28, 51, 38, .07) 1px, transparent 1.2px);
  background-size: auto, 24px 24px;
}
.og__copy { display: flex; flex-direction: column; }
.og__badge { align-self: flex-start; }
.og__name { margin-top: 26px; font: 450 60px/1 var(--sans); letter-spacing: -.05em; color: var(--ink); }
.og__lede { margin-top: 18px; font: 400 26px/1.22 var(--sans); letter-spacing: -.03em; color: var(--ink); }
.og__lede span { color: var(--tone); }
.og__career { margin-top: 16px; font: 500 14px/1.4 var(--sans); color: var(--ink-3); }
.og__proof { margin-top: auto; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.og__proof p { padding: 13px 14px 12px; border-radius: 16px; background: #fff; box-shadow: 0 0 0 1px var(--line), var(--sh-1); }
.og__proof b { display: block; font: 400 30px/1 var(--sans); letter-spacing: -.045em; color: var(--ink); white-space: nowrap; }
.og__proof span { display: block; margin-top: 7px; font: 400 13px/1.25 var(--sans); color: var(--ink-3); }
.og__stage { position: relative; display: flex; flex-direction: column; padding: 8px; border-radius: 30px; background: rgba(255, 255, 255, .7); box-shadow: 0 0 0 1px var(--line), 0 40px 80px -40px rgba(15, 42, 29, .55); }
.og__head { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 14px 12px; }
.og__head span:first-child { font: 500 12px/1.3 var(--mono); letter-spacing: .09em; text-transform: uppercase; color: var(--ink); }
.og__head span:last-child { font: 400 24px/1 var(--sans); letter-spacing: -.04em; color: var(--ink); white-space: nowrap; }
.og__stage .story { flex: 1; aspect-ratio: auto; border-radius: 22px; }
.og__stage .s-in { font-size: 17px; }
.og__stripes { position: absolute; z-index: -1; left: 520px; right: 0; bottom: 0; height: 250px; }
.og__stripes::after { content: ""; position: absolute; left: 0; right: 0; top: 88px; bottom: 0; background: var(--forest-3); }
.og__dom { position: absolute; left: 60px; bottom: 16px; font: 500 12px/1 var(--mono); letter-spacing: .04em; color: var(--ink-3); }
</style>
</head>
<body>
<div class="og">
  <div class="og__stripes stripes"><i></i><i></i><i></i><i></i></div>
  <div class="og__copy">
    <p class="badge og__badge"><span class="badge__dot"></span>Lead Product Manager · New York</p>
    <p class="og__name">John Jayasankar</p>
    <p class="og__lede">Production AI agents <span>and 0→1 financial infrastructure.</span></p>
    <p class="og__career">Quantile (LSEG) · OpenGamma · Wells Fargo</p>
    <div class="og__proof">
      <p><b>3.5h → 8m</b><span>expert setup, now an agent</span></p>
      <p><b>750+</b><span>senior eng hours returned a year</span></p>
      <p><b>+34%</b><span>notional reduction per run</span></p>
      <p><b>100%</b><span>acceptance, 40+ live runs</span></p>
    </div>
  </div>
  <div class="og__stage">
    <p class="og__head"><span>Agents + markets · Quantile systems</span><span>Hours → minutes</span></p>
    {{body}}
  </div>
  <p class="og__dom">johnjayasankar.com</p>
</div>
</body>
</html>
"""


OG_CASE_CSS = """
.og__kicker { align-self: flex-start; }
.og__title { margin-top: 24px; font: 450 42px/1.06 var(--sans); letter-spacing: -.045em; color: var(--ink); text-wrap: balance; }
.og__meta { margin-top: 16px; font: 500 14px/1.4 var(--sans); color: var(--ink-3); }
.og__proof--case { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.og__head--case span:first-child { max-width: 70%; }
.og-case + .og-case { margin-top: 0; }
"""


def og_case(s):
    """One link-preview card for a case: its title, context and first two figures beside its story at rest."""
    esc = stories.esc
    meta = ' · '.join(x for x in (s['org'], s['year'], s['role']) if x)
    proof = ''.join('<p><b>%s</b><span>%s</span></p>' % (esc(v), esc(k)) for v, k in s['metrics'][:2])
    b = s['bay']
    return ('<div class="og og-case" id="og-%s">'
            '<div class="og__stripes stripes"><i></i><i></i><i></i><i></i></div>'
            '<div class="og__copy"><p class="badge og__badge og__kicker"><span class="badge__dot"></span>%s · %s</p>'
            '<p class="og__title">%s</p><p class="og__meta">%s</p><div class="og__proof og__proof--case">%s</div></div>'
            '<div class="og__stage"><p class="og__head og__head--case"><span>%s</span><span>%s</span></p>%s</div>'
            '<p class="og__dom">johnjayasankar.com/work/%s</p></div>') % (
        s['slug'], esc(s['id']), esc(s['kind']), re.sub(r'(\d+(?:\.\d+)?-[a-z]+)', r'<span style="white-space: nowrap">\1</span>', esc(s['title'])), esc(meta), proof,
        esc(b['title']), esc(b['big']), stories.render(s['slug']), s['slug'])


def write(name, text):
    with open(os.path.join(ROOT, name), 'w', encoding='utf-8') as f:
        f.write(text)


def main():
    secs = []
    for key in stories.STORIES:
        frames = ''.join('<div class="lab-f" style="width:%dpx;--ar:%s"><p>%s · %dpx</p>%s</div>' % (w, ar, label, w, stories.render(key))
                         for label, w, ar in FRAMES)
        secs.append('<section class="lab-sec" data-lab="%s"><h2 class="lab-h">%s</h2><div class="lab-row">%s</div></section>' % (key, key, frames))
    for key, st in ideas.IDEAS.items():
        frames = ''.join('<div class="lab-f" style="width:%dpx;--ar:%s"><p>%s · %dpx</p>%s</div>' % (w, ar, label, w, ideas.render(key))
                         for label, w, ar in IDEA_FRAMES[st['kind']])
        secs.append('<section class="lab-sec" data-lab="%s"><h2 class="lab-h">%s</h2><div class="lab-row">%s</div></section>' % (key, key, frames))
    write('_stories.html', LAB.replace('{{body}}', '\n'.join(secs)))
    write('_thumbs.html', THUMBS.replace('{{body}}', '\n'.join('<div class="th" id="th-%s">%s</div>' % (k, stories.render(k))
                                                                for k in stories.STORIES)))
    write('_og.html', OG.replace('{{body}}', stories.render('hero')))
    cases = OG.split('<body>')[0].replace('</style>', OG_CASE_CSS + '</style>').replace('html, body { margin: 0; overflow: hidden; }', 'html, body { margin: 0; }').replace('body { width: 1200px; height: 630px; }', 'body { width: 1200px; }')
    write('_og_cases.html', cases + '<body>\n' + '\n'.join(og_case(s) for s in SYSTEMS_A + SYSTEMS_B) + '\n</body>\n</html>\n')
    print('wrote _stories.html, _thumbs.html, _og.html and _og_cases.html for %d stories' % len(stories.STORIES))


if __name__ == '__main__':
    main()
