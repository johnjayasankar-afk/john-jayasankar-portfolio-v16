#!/usr/bin/env python3
"""Static generator for johnjayasankar.com. Dev-only: tools/ is excluded from
the deploy by .vercelignore.

    python3 tools/build.py

Writes every page as a plain HTML document with the shared chrome, plus
sitemap.xml, robots.txt and assets/js/jj-data.js (the command palette index).
Content lives in data_*.py; this file only decides structure. It refuses to
write a page with an em or en dash in it, and it checks that every internal
link and in-page anchor it wrote actually resolves."""

import hashlib
import html
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from data_systems_a import SYSTEMS_A  # noqa: E402
from data_systems_b import SYSTEMS_B  # noqa: E402
import data_pages as P  # noqa: E402
import stories  # noqa: E402
import ideas  # noqa: E402

SYSTEMS = SYSTEMS_A + SYSTEMS_B
BY = {s['slug']: s for s in SYSTEMS}
FACETS = [('agents', 'Agents'), ('markets', 'Markets'), ('independent', 'Labs')]
FACET_NAME = dict(FACETS)
LABS = [BY[slug] for slug in P.LABS['order']]
DOM = P.SITE['domain']
EMAIL = P.SITE['email']
RESUME = P.SITE['resume']
LABS_URL = P.SITE['labs']
LASTMOD = '2026-09-13'

# Optical heights for the investor marks, matched by eye to a shared cap height.
MARK_H = {'accel': 18, 'thoma-bravo': 20, 'firstmark': 13, 'spectrum-equity': 28,
          'dawn-capital': 13.5, 'allianz-x': 25, 'lseg': 14, 'cme-group': 21,
          'jpx': 16, 'trading-technologies': 19}

NEWTAB = '<span class="sr-only"> (opens in a new tab)</span>'
V = {}


def icon(cls, body, size=16):
    return ('<svg class="ico %s" viewBox="0 0 16 16" width="%d" height="%d" aria-hidden="true" focusable="false">%s</svg>'
            % (cls, size, size, body))


STROKE = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'
ARROW = icon('ico--arrow', '<path d="M3 8h9.5M8.5 4l4 4-4 4" %s/>' % STROKE)
EXTI = icon('ico--ext', '<path d="M5 4.5h6.5V11M11.5 4.5l-7 7" %s/>' % STROKE)
CHEV = icon('ico--chev', '<path d="M4.5 6.5 8 10l3.5-3.5" %s/>' % STROKE, 12)
SEARCH = icon('ico--search', '<circle cx="7" cy="7" r="4.4" fill="none" stroke="currentColor" stroke-width="1.5"/>'
                             '<path d="m10.4 10.4 3.1 3.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>', 15)
UP = icon('ico--up', '<path d="M8 13V3.5M4 7.5l4-4 4 4" %s/>' % STROKE)


# ----------------------------------------------------------------------------
# helpers
# ----------------------------------------------------------------------------
def esc(s):
    return html.escape(str(s), quote=True)


def mval(v):
    """A metric value or heading. The arrow in '3.5h → 8m' is drawn, and read as 'to'."""
    return esc(v).replace('→', '<i class="to" aria-hidden="true">→</i><span class="sr-only"> to </span>')


def plain(v):
    return str(v).replace('→', 'to')


def render(tpl, **kw):
    def sub(m):
        key = m.group(1)
        if key not in kw:
            raise KeyError('missing template value: ' + key)
        return str(kw[key])
    return re.sub(r'\{\{(\w+)\}\}', sub, tpl)


def fingerprint(rel):
    path = os.path.join(ROOT, rel)
    if not os.path.exists(path):
        return 'dev'
    with open(path, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()[:10]


def img_v(rel):
    """An image URL stamped with its content hash, like the CSS and JS."""
    return '/%s?v=%s' % (rel, fingerprint(rel))


def og_img():
    return DOM + img_v(P.SITE['og_image'].lstrip('/'))


def svg_ratio(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        svg = f.read()
    m = re.search(r'viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)', svg)
    if m:
        return float(m.group(1)) / float(m.group(2))
    w = re.search(r'\swidth="([\d.]+)', svg)
    h = re.search(r'\sheight="([\d.]+)', svg)
    return float(w.group(1)) / float(h.group(1))


def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)
    return rel


def is_ext(href):
    return href.startswith('http') or href.endswith('.pdf')


def link(label_html, href, cls='', arrow=False):
    """Off-site links and the résumé PDF open in a new tab, and say so."""
    c = ' class="%s"' % cls if cls else ''
    if is_ext(href):
        return '<a%s href="%s" target="_blank" rel="noopener">%s%s%s</a>' % (c, esc(href), label_html, EXTI, NEWTAB)
    return '<a%s href="%s">%s%s</a>' % (c, esc(href), label_html, ARROW if arrow else '')


def btn(label, href, kind='primary', size='', arrow=None):
    cls = 'btn btn--' + kind + ((' btn--' + size) if size else '')
    if arrow is None:
        arrow = not is_ext(href)
    return link('<span>%s</span>' % esc(label), href, cls, arrow)


def tlink(label, href, cls='tlink'):
    return link('<span>%s</span>' % esc(label), href, cls, True)


def mail(extra=''):
    return ('<div class="mail%s"><a class="mail__addr" href="mailto:%s">%s</a>'
            '<button class="mail__copy" type="button" data-copy-email>Copy</button></div>') % (
        (' ' + extra) if extra else '', EMAIL, EMAIL)


def hint(text):
    return '<p class="hint" data-kbd>%s</p>' % esc(text)


def slabel(n, text, dark=False):
    num = '<span class="slabel__n">%s</span>' % esc(n) if n else ''
    return '<p class="slabel%s">%s<span class="slabel__t">%s</span></p>' % (' slabel--dark' if dark else '', num, esc(text))


def heading(parts, hid, level='h2', cls='h2'):
    """A two-tone heading: the second clause is set in the quieter tone."""
    if isinstance(parts, (tuple, list)):
        inner = '%s <span class="tone">%s</span>' % (mval(parts[0]), mval(parts[1]))
    else:
        inner = mval(parts)
    return '<%s class="%s" id="%s">%s</%s>' % (level, cls, hid, inner, level)


NUM = re.compile(r'\d+(?:\.\d+)?')


def count_attr(v):
    """Figures with one plain number count up when they arrive; ranges and
    before/after pairs are left alone."""
    s = str(v)
    if '→' in s:
        return ''
    nums = NUM.findall(s)
    if len(nums) != 1 or re.search(r'[A-Za-z]', s.split(nums[0], 1)[0]):
        return ''
    return ' data-count'


def stat(v, k, cls='stat'):
    return '<li class="%s"><b class="stat__v"%s>%s</b><span class="stat__k">%s</span></li>' % (cls, count_attr(v), mval(v), esc(k))


def rd(i):
    return ' style="--rd:%d"' % i


def host(url):
    return re.sub(r'^https?://', '', url).rstrip('/')


CONTINUE = ('<a class="continue" href="/" data-continue hidden><span class="continue__k">Continue</span>'
            '<span class="continue__l" data-continue-label></span>'
            '<span class="continue__w" data-continue-when></span></a>')


# ----------------------------------------------------------------------------
# chrome
# ----------------------------------------------------------------------------
HEAD = """<!doctype html>
<html lang="en" data-page="{{page}}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{{title}}</title>
<meta name="description" content="{{desc}}">
<link rel="canonical" href="{{url}}">
<meta name="author" content="John Jayasankar">
<meta name="robots" content="{{robots}}">
<meta name="theme-color" content="{{theme}}">
<meta property="og:site_name" content="John Jayasankar">
<meta property="og:locale" content="en_US">
<meta property="og:type" content="{{ogtype}}">
<meta property="og:title" content="{{title}}">
<meta property="og:description" content="{{desc}}">
<meta property="og:url" content="{{url}}">
<meta property="og:image" content="{{ogimg}}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{{ogalt}}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{title}}">
<meta name="twitter:description" content="{{desc}}">
<meta name="twitter:image" content="{{ogimg}}">
<meta name="twitter:image:alt" content="{{ogalt}}">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
{{preload}}<link rel="stylesheet" href="/assets/css/{{sheet}}?v={{v}}">
{{ld}}</head>
"""

PRELOAD = '<link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>\n'

CHROME = """<a class="skip" href="#main">Skip to content</a>
<div class="progress" aria-hidden="true"><i data-scrollbar></i></div>
<header class="hdr" data-hdr>
  <div class="hdr__bar">
    <a class="brand" href="/" aria-label="John Jayasankar, home"><span class="orb" aria-hidden="true"></span><span class="brand__name">John Jayasankar</span></a>
    <nav class="hdr__nav" aria-label="Primary">{{nav}}<span class="nav__hl" aria-hidden="true"></span></nav>
    <div class="hdr__tools">
      <button class="kbtn" type="button" data-cmdk aria-label="Search and jump anywhere" aria-keyshortcuts="Meta+K Control+K">{{search}}<span class="kbtn__k"><span data-modkey>⌘</span>K</span></button>
      {{resume}}
      <a class="btn btn--primary btn--sm hdr__cta" href="mailto:{{email}}"><span>Email me</span></a>
      <button class="menu" type="button" aria-expanded="false" aria-controls="drawer" data-menu><span class="sr-only">Menu</span><i></i><i></i></button>
    </div>
  </div>
  <div class="drawer" id="drawer" data-drawer hidden>
    <nav class="drawer__nav" aria-label="Site menu">{{drawer}}</nav>
    <div class="drawer__tools"><a class="btn btn--primary" href="mailto:{{email}}"><span>Email me</span></a>{{dresume}}<button class="btn btn--ghost" type="button" data-cmdk><span>Search</span><span class="kbtn__k"><span data-modkey>⌘</span>K</span></button></div>
  </div>
</header>
"""

FOOTER = """<footer class="ftr">
  <div class="ftr__card" data-spot>
    <div class="stripes stripes--ftr" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="ftr__in">
      <div class="ftr__grid">
        <div class="ftr__id">
          <a class="brand brand--light" href="/" aria-label="John Jayasankar, home"><span class="orb" aria-hidden="true"></span><span class="brand__name">John Jayasankar</span></a>
          <p class="ftr__role">Lead Product Manager · New York</p>
          <p class="ftr__quote">“{{tagline}}”</p>
          <div class="ftr__cta"><a class="btn btn--mint" href="mailto:{{email}}"><span>Email me</span>{{arrow}}</a>{{resume}}</div>
        </div>
        <nav class="ftr__col" aria-label="Site"><p class="ftr__h">Site</p>{{site}}</nav>
        <nav class="ftr__col" aria-label="Selected work"><p class="ftr__h">Work</p>{{work}}</nav>
        <nav class="ftr__col" aria-label="Labs"><p class="ftr__h">Labs</p>{{labs}}</nav>
        <nav class="ftr__col" aria-label="Elsewhere"><p class="ftr__h">Elsewhere</p>{{elsewhere}}</nav>
      </div>
      <p class="ftr__word" aria-hidden="true">Jayasankar<span>.</span></p>
      <div class="ftr__base"><span>© {{year}} John Jayasankar</span><span class="ftr__locus" data-locus-label>{{label}}</span><span>New York<span class="ftr__clock" data-clock hidden></span></span></div>
    </div>
  </div>
</footer>
"""

TOTOP = '<button class="totop" type="button" data-totop aria-label="Back to top">%s</button>\n' % UP

OVERLAYS = TOTOP + """<div class="toast" role="status" aria-live="polite" data-toast></div>
<div class="gchip" data-gchip hidden><p data-gchip-text></p><button type="button" data-gchip-close>Got it</button></div>
<div class="cmdk" data-cmdk-root hidden>
  <div class="cmdk__scrim" data-cmdk-close></div>
  <div class="cmdk__panel" role="dialog" aria-modal="true" aria-labelledby="cmdk-title">
    <p class="sr-only" id="cmdk-title">Jump anywhere</p>
    <div class="cmdk__bar">
      <span class="cmdk__glyph" aria-hidden="true">""" + SEARCH + """</span>
      <input class="cmdk__input" data-cmdk-input type="text" role="combobox" aria-expanded="true" aria-controls="cmdk-list" aria-autocomplete="list" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Search systems, pages and notes, or type ? for keys">
      <button class="cmdk__esc" type="button" data-cmdk-close>Esc</button>
    </div>
    <ul class="cmdk__list" id="cmdk-list" role="listbox" aria-label="Results" data-cmdk-list></ul>
    <p class="cmdk__foot" aria-hidden="true"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></p>
  </div>
</div>
"""


def marks(dup):
    out = []
    for key, name in P.MARKS:
        ar = svg_ratio('assets/img/vc-%s.svg' % key)
        label = '' if dup else ' role="img" aria-label="%s"' % esc(name)
        out.append('<li class="mq__item"><span class="mark" style="--m:url(/assets/img/vc-%s.svg);--ar:%.4f;--h:%gpx"%s></span></li>'
                   % (key, ar, MARK_H[key], label))
    return ''.join(out)


def mark_span(key, max_w, max_h, prefix='logo'):
    """A logo drawn through a CSS mask in currentColor, sized to fit a box."""
    ar = svg_ratio('assets/img/%s-%s.svg' % (prefix, key))
    return ('<span class="mark" style="--m:url(/assets/img/%s-%s.svg);--ar:%.4f;--h:%.1fpx" aria-hidden="true"></span>'
            % (prefix, key, ar, min(max_h, max_w / ar)))


def mega():
    cols = []
    for gname, slugs in P.WORK_GROUPS:
        items = ''.join('<a class="mega__link" href="/work/%s"><span class="mega__name">%s</span><span class="mega__m">%s · %s</span></a>'
                        % (s, esc(BY[s]['name']), mval(BY[s]['ledger'][1]), esc(BY[s]['ledger'][2])) for s in slugs)
        cols.append('<div class="mega__col"><p class="mega__h">%s</p>%s</div>' % (esc(gname), items))
    lead = ('<div class="mega__lead"><p class="mega__h">Overview</p>'
            '<a class="mega__big" href="/work"><span>All work</span><small>%02d systems, filterable</small></a>'
            '<a class="mega__big" href="/approach"><span>Approach</span><small>The control model</small></a>'
            '<a class="mega__card" href="/labs"><img src="/assets/img/work/daylight.jpg" alt="" width="640" height="400" loading="lazy" decoding="async">'
            '<span class="mega__card-t">Labs</span><small>RideLens, Daylight, and RailDrop</small></a></div>') % len(SYSTEMS)
    lead = lead.replace('/assets/img/work/daylight.jpg', img_v('assets/img/work/daylight.jpg'))
    return '<div class="mega" id="mega-work" data-mega-panel><div class="mega__grid">%s%s</div></div>' % (lead, ''.join(cols))


def chrome_top(page, section=None):
    nav = []
    for label, href, key in P.NAV:
        cur = ' aria-current="page"' if key == page else (' aria-current="true"' if key == section else '')
        if key == 'work':
            nav.append('<div class="nav__item" data-mega><a class="nav__link" href="/work"%s>Work</a>'
                       '<button class="nav__more" type="button" aria-expanded="false" aria-controls="mega-work" data-mega-btn>'
                       '<span class="sr-only">Show the work menu</span>%s</button>%s</div>' % (cur, CHEV, mega()))
        else:
            nav.append('<a class="nav__link" href="%s"%s>%s</a>' % (href, cur, esc(label)))
    drawer = ''.join('<a class="drawer__link" href="%s"%s><span>%s</span>%s</a>'
                     % (href, ' aria-current="page"' if href == '/' + page else '', esc(label), ARROW) for label, href in P.SITE_LINKS)
    return render(CHROME, nav=''.join(nav), drawer=drawer, search=SEARCH, email=EMAIL,
                  resume=btn('Résumé', RESUME, 'ghost', 'sm').replace('class="btn btn--ghost btn--sm"', 'class="btn btn--ghost btn--sm hdr__resume"'),
                  dresume=btn('Résumé', RESUME, 'ghost'))


def footer(label):
    site = ''.join('<a href="%s">%s</a>' % (h, esc(l)) for l, h in P.SITE_LINKS)
    work = ''.join('<a href="/work/%s">%s</a>' % (s, esc(BY[s]['name']))
                   for _, slugs in P.WORK_GROUPS[:2] for s in slugs)
    labs = ''.join('<a href="/work/%s">%s</a>' % (s['slug'], esc(s['name'])) for s in LABS) + link('Labs site', LABS_URL)
    elsewhere = ''.join(link(esc(l), h) if ext else '<a href="%s">%s</a>' % (esc(h), esc(l)) for l, h, ext in P.ELSEWHERE)
    return render(FOOTER, year=P.SITE['year'], label=esc(label), tagline=esc(P.SITE['tagline']), email=EMAIL, arrow=ARROW,
                  resume=btn('Résumé', RESUME, 'night'), site=site, work=work, labs=labs, elsewhere=elsewhere)


def scripts():
    out = ['<script src="/assets/js/jj-data.js?v=%s" defer></script>' % V['data'],
           '<script src="/assets/js/site.js?v=%s" defer></script>' % V['site']]
    return '\n'.join(out) + '\n'


def ld_block(ld):
    if not ld:
        return ''
    return '<script type="application/ld+json">%s</script>\n' % json.dumps(ld, ensure_ascii=False).replace('</', '<\\/')


def shell(page, path, title, desc, label, body, og_type='website', robots='index, follow', ld=None, section=None):
    return ''.join([
        render(HEAD, page=page, title=esc(title), desc=esc(desc), url=esc(DOM + path), robots=robots, theme='#f8f6f1',
               ogtype=og_type, ogimg=esc(og_img()), ogalt=esc(P.SITE['og_alt']), preload=PRELOAD,
               sheet='site.css', v=V['css'], ld=ld_block(ld)),
        '<body data-label="%s">\n' % esc(label),
        chrome_top(page, section),
        '<main id="main" tabindex="-1">\n', body, '</main>\n',
        footer(label),
        OVERLAYS,
        scripts(),
        '</body>\n</html>\n',
    ])


def person_ld():
    return {
        '@context': 'https://schema.org', '@type': 'Person', 'name': 'John Jayasankar',
        'jobTitle': 'Lead Product Manager', 'url': DOM + '/', 'image': DOM + '/assets/img/portrait-sq.jpg',
        'email': 'mailto:' + EMAIL,
        'address': {'@type': 'PostalAddress', 'addressLocality': 'New York', 'addressRegion': 'NY', 'addressCountry': 'US'},
        'worksFor': {'@type': 'Organization', 'name': 'Quantile Technologies'},
        'alumniOf': {'@type': 'CollegeOrUniversity', 'name': 'Haverford College'},
        'sameAs': [P.SITE['linkedin'], P.SITE['substack']],
    }


# ----------------------------------------------------------------------------
# the diagram bay
# ----------------------------------------------------------------------------
# live telemetry: the phase the story is in and whether it is playing or held
TELE = ('<p class="tele" aria-hidden="true"><span class="tele__dot"></span><span data-bay-phase>{{i}} / {{n}}</span>'
        '<span data-bay-state>Auto</span></p>')

BAY_COMPACT = """<figure class="bay bay--compact" id="{{hid}}" data-bay aria-label="{{title}}">
{{screen}}
<div class="bay__ctl"><div class="bay__tabs" role="group" aria-label="{{title}}: phases">{{tabs}}</div>{{tele}}</div>
<figcaption class="bay__cap"><span class="bay__note" data-bay-note>{{cap0}}</span><span class="bay__foot">{{foot}}</span><span class="sr-only" aria-live="polite" data-bay-live></span></figcaption>
</figure>
"""

BAY_STEPS = """<figure class="bay bay--steps" id="{{hid}}" data-bay aria-labelledby="{{hid}}-t">
<div class="bay__main">
<div class="bay__head"><div class="bay__id"><p class="bay__t" id="{{hid}}-t">{{title}}</p><p class="bay__s">{{sub}}</p></div><p class="bay__big"><b>{{big}}</b>{{bigsub}}</p></div>
{{screen}}
<p class="bay__foot">{{foot}}</p>
</div>
<figcaption class="bay__side">
<p class="bay__side-h"><span>{{side}}</span><span class="bay__keys">1-{{n}} · select to hold</span></p>
<ol class="bay__steps" aria-label="{{title}}: phases">{{items}}</ol>
<p class="bay__read"><span class="bay__read-k">{{readk}}</span>{{readt}}</p>
<div class="bay__status">{{tele}}<span class="rail" aria-hidden="true">{{ticks}}<i class="rail__play" data-bay-play></i></span></div>
<span class="sr-only" aria-live="polite" data-bay-live></span>
</figcaption>
</figure>
"""

BAY_STEP = ('<li><button type="button" class="step" data-stop="{{stop}}" data-caption="{{cap}}" aria-pressed="{{pressed}}">'
            '<span class="step__n" aria-hidden="true">{{num}}</span><span class="step__body"><span class="step__l">{{label}}</span>{{det}}'
            '<span class="step__t">{{txt}}</span></span><span class="step__prog" aria-hidden="true"><i data-prog></i></span></button></li>')


def bay(hid, story, title, sub, big, big_sub, foot, phases, variant='compact', steps=None, side='Phases'):
    """A bay: the system's story with its phase controls and captions. Phases sit
    evenly around the story's clock, and the page is written at the story's
    resting phase, so controls, caption and picture agree before any script runs."""
    n = len(phases)
    st = stories.STORIES[story]
    assert st['n'] == n, 'story %s has %d steps for %d phases' % (story, st['n'], n)
    rest = st['rest']
    stops = [(i + .5) / n for i in range(n)]
    foot_items = foot if isinstance(foot, (tuple, list)) else [foot]
    foot_html = ' · '.join(esc(x) for x in foot_items)
    screen = stories.render(story)
    tele = render(TELE, i='%02d' % (rest + 1), n='%02d' % n)
    if variant == 'steps':
        ticks = ''.join('<i class="rail__tick" style="left:%.1f%%"></i>' % (stop * 100) for stop in stops)
        items = []
        for i, (tab, _, cap) in enumerate(phases):
            name, det = steps[i] if steps else (tab, '')
            items.append(render(BAY_STEP, stop='%g' % stops[i], cap=esc(cap), pressed='true' if i == rest else 'false',
                                num='%02d' % (i + 1), label=esc(name),
                                det=('<span class="step__det">%s</span>' % mval(det)) if det else '', txt=esc(cap)))
        kind, _, text = st['label'].partition(': ')
        return render(BAY_STEPS, hid=hid, title=esc(title), sub=esc(sub), big=mval(big),
                      bigsub=('<span>%s</span>' % mval(big_sub)) if big_sub else '', screen=screen, foot=foot_html,
                      side=esc(side), n=n, items=''.join(items), tele=tele, ticks=ticks,
                      readk=esc('Reading the %s interface' % kind.split(' ')[0].lower()), readt=esc(text[0].upper() + text[1:]))
    tabs = ''.join('<button type="button" class="ptab" data-stop="%g" data-caption="%s" aria-pressed="%s">'
                   '<span class="ptab__n" aria-hidden="true">%d</span><span class="ptab__l">%s</span>'
                   '<span class="ptab__prog" aria-hidden="true"><i data-prog></i></span></button>'
                   % (stops[i], esc(cap), 'true' if i == rest else 'false', i + 1, esc(tab))
                   for i, (tab, _, cap) in enumerate(phases))
    return render(BAY_COMPACT, hid=hid, title=esc(title), screen=screen, tabs=tabs, tele=tele,
                  cap0=esc(phases[rest][2]), foot=foot_html)


def system_bay(s, hid, variant):
    b = s['bay']
    return bay(hid, s['slug'], b['title'], b['sub'], b['big'], b['big_sub'], b['foot'], s['phases'], variant)


# ----------------------------------------------------------------------------
# shared blocks
# ----------------------------------------------------------------------------
def tenets(level='h3'):
    out = []
    for i, t in enumerate(P.TENETS):
        links = '<span class="sep" aria-hidden="true">·</span>'.join(
            '<a class="tlink" href="%s"><span>%s</span></a>' % (h, esc(l)) for l, h in t['links'])
        out.append('<article class="tenet" data-reveal%s><div class="tenet__art">%s</div><p class="tenet__n">%s</p>'
                   '<%s class="tenet__t">%s</%s><p class="tenet__b">%s</p><p class="tenet__rel"><span>In the work</span>%s</p></article>'
                   % (rd(i), ideas.render(ideas.TENET_KEYS[t['art']], attrs=' data-thumb data-autoplay'), t['n'], level, esc(t['title']), level, esc(t['body']), links))
    return ''.join(out)


def note_cards(level='h3', page=False):
    out = []
    for i, n in enumerate(P.NOTES):
        href = n['href']
        if page and href.startswith('/writing#'):
            href = href[len('/writing'):]
        ident = (' id="%s" data-locus data-label="%s" data-href="%s"' % (n['id'], esc(n['title']), href)) if page else ''
        out.append('<li class="ncard ncard--%d"%s data-reveal%s><a class="ncard__a" href="%s">'
                   '<div class="ncard__cover">%s</div>'
                   '<div class="ncard__body"><p class="ncard__tag">%02d · %s</p><%s class="ncard__t">%s</%s>'
                   '<p class="ncard__d">%s</p><p class="ncard__go"><span>Read</span>%s</p></div></a></li>'
                   % (i + 1, ident, rd(i), href, ideas.render(ideas.NOTE_KEYS[n['id']], attrs=' data-thumb data-autoplay'), i + 1, esc(n['tag']), level, esc(n['title']), level,
                      esc(n['dek']), ARROW))
    return ''.join(out)


def pagehead(label, kicker, h1, lede, extra='', cls='', n=None):
    return ('<section class="phead%s" id="top" data-locus data-label="%s"><div class="wrap phead__in" data-reveal>%s%s'
            '<p class="phead__lede">%s</p>%s</div></section>\n') % (
        cls, esc(label), slabel(n, kicker), heading(h1, 'page-title', 'h1', 'h1'), esc(lede), extra)


def shead(n, kicker, h2, hid, lede=None, aside='', cls='', dark=False):
    head = slabel(n, kicker, dark) + heading(h2, hid) + (('<p class="shead__lede">%s</p>' % esc(lede)) if lede else '')
    if 'shead--split' in cls:
        head = '<div>%s</div>' % head
    return '<div class="shead%s" data-reveal>%s%s</div>' % (cls, head, aside)


def marquee(label, note):
    return ('<section class="mq" aria-label="%s"><div class="wrap mq__head"><p class="mq__label">%s</p><p class="mq__note">%s</p></div>'
            '<div class="mq__view"><ul class="mq__track">%s</ul><ul class="mq__track" aria-hidden="true">%s</ul></div></section>\n') % (
        esc(label), esc(label), esc(note), marks(False), marks(True))


# ----------------------------------------------------------------------------
# home
# ----------------------------------------------------------------------------
HERO_TPL = """<section class="hero" id="top" data-locus data-label="Top" aria-labelledby="hero-h">
  <div class="hero__in wrap">
    <p class="badge hero__badge"><span class="badge__dot" aria-hidden="true"></span>{{badge}}<span class="badge__clock" data-clock hidden></span></p>
    <h1 class="hero__h1" id="hero-h"><span class="hero__line">{{h1a}}</span> <span class="hero__line tone">{{h1b}}</span></h1>
    <p class="hero__lede">{{lede}}</p>
    <div class="actions hero__actions">{{actions}}</div>
    <ul class="hero__career" aria-label="Career">{{career}}</ul>
    {{cont}}
  </div>
  <div class="hero__stage">
    <div class="stripes" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <div class="wrap hero__show">{{show}}</div>
    <div class="wrap proof"><ul class="proof__grid" aria-label="Measured outcomes">{{proof}}</ul></div>
  </div>
</section>
"""

FCARD_TPL = """<article class="fcard{{wide}}" id="{{slug}}" data-locus data-label="{{short}}" data-href="/work/{{slug}}" aria-labelledby="{{slug}}-title" data-reveal{{rd}}>
  <div class="fcard__copy">
    <p class="fcard__meta"><span class="idchip">{{id}}</span><span class="fcard__kind">{{kind}}</span><span class="fcard__ctx">{{ctx}}</span></p>
    <h3 class="fcard__h" id="{{slug}}-title"><a href="/work/{{slug}}">{{title}}</a></h3>
    <p class="fcard__p">{{lede}}</p>
    <ul class="stats stats--card">{{metrics}}</ul>
    <p class="fcard__go">{{go}}</p>
  </div>
  <div class="fcard__bay">{{bay}}</div>
</article>
"""

LABCARD_TPL = """<article class="labcard" id="lab-{{slug}}" data-locus data-label="{{name}}" data-href="/work/{{slug}}" aria-labelledby="lab-{{slug}}-h" data-wake data-reveal{{rd}}>
  <a class="labcard__screen" href="/work/{{slug}}" tabindex="-1" aria-hidden="true">{{story}}</a>
  <div class="labcard__body">
    <p class="labcard__k"><span>{{n}}</span> / {{cat}}</p>
    <h3 class="labcard__h" id="lab-{{slug}}-h"><a href="/work/{{slug}}">{{name}}</a></h3>
    <p class="labcard__tag">{{tagline}}</p>
    <p class="labcard__p">{{blurb}}</p>
    <p class="labcard__links">{{case}}{{open}}</p>
  </div>
</article>
"""


# the showcase tabs on the narrowest phones, where the full names cannot sit side by side
SHOW_SHORT = {'Agents + gate': 'Agents', 'Market structure': 'Markets'}


def showcase():
    H = P.HOME
    hb = H['hero']
    tabs, panels = [], []
    for i, t in enumerate(H['show']):
        key = t['key']
        if key == 'agents':
            b = bay('bay-show-' + key, 'hero', hb['title'], hb['sub'], hb['big'], hb['big_sub'], hb['foot'], hb['phases'], 'steps')
        else:
            b = system_bay(BY[t['slug']], 'bay-show-' + key, 'steps')
        sel = i == 0
        tabs.append('<button type="button" class="seg__btn show__tab" role="tab" id="show-tab-%s" aria-controls="show-%s" '
                    'aria-selected="%s" tabindex="%s" data-show-tab>%s<span class="show__fill" aria-hidden="true"><i></i></span></button>'
                    % (key, key, 'true' if sel else 'false', '0' if sel else '-1',
                       ('<span class="show__tl show__tl--long">%s</span><span class="show__ts">%s</span>' % (esc(t['tab']), esc(SHOW_SHORT[t['tab']])))
                       if t['tab'] in SHOW_SHORT else '<span class="show__tl">%s</span>' % esc(t['tab'])))
        panels.append('<div class="show__panel" role="tabpanel" id="show-%s" aria-labelledby="show-tab-%s"%s>%s<p class="show__more">%s</p></div>'
                      % (key, key, '' if sel else ' hidden', b, tlink(t['link'][0], t['link'][1])))
    return ('<div class="show" data-show data-reveal><div class="show__bar"><div class="seg" role="tablist" aria-label="Featured systems" data-seg>%s'
            '<span class="seg__ind" aria-hidden="true"></span></div></div><div class="show__panels">%s</div></div>') % (
        ''.join(tabs), ''.join(panels))


def feature_card(s, i, wide=False):
    ctx = s['org'] + ((' · ' + s['year']) if s['year'] else '')
    return render(FCARD_TPL, wide=' fcard--wide' if wide else '', slug=s['slug'], short=esc(s['short']), rd=rd(i),
                  id=s['id'], kind=esc(s['kind']), ctx=esc(ctx), title=esc(s['title']), lede=esc(s['lede']),
                  metrics=''.join(stat(v, k) for v, k in s['metrics']), go=tlink('Read the case', '/work/' + s['slug']),
                  bay=system_bay(s, 'bay-' + s['slug'], 'compact'))


def lab_card(s, i):
    L = s['lab']
    return render(LABCARD_TPL, slug=s['slug'], name=esc(s['name']), rd=rd(i), story=stories.render(s['slug'], attrs=' data-thumb data-autoplay'), n=L['n'], cat=esc(L['cat']),
                  tagline=esc(L['tagline']), blurb=esc(L['blurb']), case=tlink('Case study', '/work/' + s['slug']),
                  open=link('<span>Open %s</span>' % esc(s['name']), s['live'], 'tlink tlink--quiet'))


def home():
    H = P.HOME
    actions = btn('Selected work', '/work', 'primary', 'lg') + btn('Résumé', RESUME, 'ghost', 'lg')
    career = ''.join('<li>%s</li>' % esc(c) for c in H['career'])
    proof = ''.join('<li class="proof__item"><a href="%s"><b class="proof__v"%s>%s</b><span class="proof__k">%s</span></a></li>'
                    % (h, count_attr(v), mval(v), esc(k)) for v, k, h in H['proof'])
    hero = render(HERO_TPL, badge=esc(H['badge']), h1a=mval(H['h1'][0]), h1b=mval(H['h1'][1]), lede=esc(H['lede']),
                  actions=actions, career=career, cont=CONTINUE, show=showcase(), proof=proof)

    F, L = H['featured'], H['ledger']
    cards = ''.join(feature_card(BY[slug], i, wide=(i == len(F['slugs']) - 1)) for i, slug in enumerate(F['slugs']))
    rows = []
    for slug in L['slugs']:
        s = BY[slug]
        kind, v, unit = s['ledger']
        rows.append('<li><a class="lrow" href="/work/%s"><span class="lrow__id">%s</span><span class="lrow__name">%s</span>'
                    '<span class="lrow__kind">%s</span><span class="lrow__m"><b>%s</b> %s</span><span class="lrow__go">%s</span></a></li>'
                    % (slug, s['id'], esc(s['name']), esc(kind), mval(v), esc(unit), ARROW))
    featured = ('<section class="sect" id="featured" data-locus data-label="Selected work" aria-labelledby="featured-h"><div class="wrap">'
                '%s<div class="fgrid">%s</div>'
                '<div class="ledger" id="ledger" data-locus data-label="Also shipped" data-reveal>'
                '<div class="ledger__head"><div><p class="ledger__k">%s</p><h3 class="ledger__h">%s</h3></div>%s</div>'
                '<ul class="lrows">%s</ul></div></div></section>\n') % (
        shead(F['n'], F['kicker'], F['h2'], 'featured-h', F['lede'], cls=' shead--center'), cards,
        esc(L['kicker']), esc(L['h2']), tlink(L['link'][0], L['link'][1]), ''.join(rows))

    BA = H['before_after']
    ba_rows = ''.join(
        '<li><a class="ba__row" href="/work/%s" style="--i:%d"><span class="ba__n" aria-hidden="true">%02d</span>'
        '<span class="ba__what"><b>%s</b><small>%s</small></span>'
        '<span class="ba__val"><span class="ba__v ba__v--before" data-ba-before aria-hidden="true">%s</span>'
        '<span class="ba__v ba__v--after" data-ba-after>%s</span></span><span class="ba__go">%s</span></a></li>'
        % (r['slug'], i, i + 1, esc(r['name']), esc(r['what']), esc(r['before']), esc(r['after']), ARROW)
        for i, r in enumerate(BA['rows']))
    before_after = ('<section class="sect" id="before-after" data-locus data-label="Before and after" aria-labelledby="ba-h"><div class="wrap ba__grid">'
                    '<div class="ba__copy" data-reveal>%s%s<p class="shead__lede">%s</p>%s</div>'
                    '<div class="ba" data-ba data-state="after" data-reveal style="--rd:1"><div class="ba__bar">'
                    '<div class="seg" role="group" aria-label="Show the work before or after" data-seg>'
                    '<button type="button" class="seg__btn" data-ba-set="before" aria-pressed="false">%s</button>'
                    '<button type="button" class="seg__btn" data-ba-set="after" aria-pressed="true">%s</button>'
                    '<span class="seg__ind" aria-hidden="true"></span></div></div>'
                    '<ol class="ba__rows">%s</ol><p class="ba__foot">%s</p></div></div></section>\n') % (
        slabel(BA['n'], BA['kicker']), heading(BA['h2'], 'ba-h'), esc(BA['lede']), tlink(BA['link'][0], BA['link'][1]),
        esc(BA['toggle'][0]), esc(BA['toggle'][1]), ba_rows, esc(BA['foot']))

    Lb = H['labs']
    labs = ('<section class="sect labsband" id="labs" data-locus data-label="Labs" aria-labelledby="labs-h"><div class="labsband__card" data-spot><div class="wrap">'
            '%s<div class="labgrid">%s</div></div></div></section>\n') % (
        shead(Lb['n'], Lb['kicker'], Lb['h2'], 'labs-h', Lb['lede'], cls=' shead--center shead--dark', dark=True,
              aside='<div class="actions actions--center">%s%s</div>' % (btn(Lb['link'][0], Lb['link'][1], 'mint'),
                                                                        btn(Lb['more'][0], Lb['more'][1], 'night'))),
        ''.join(lab_card(s, i) for i, s in enumerate(LABS)))

    A = H['approach']
    approach = ('<section class="sect" id="approach" data-locus data-label="Approach" aria-labelledby="approach-h"><div class="wrap">'
                '%s<div class="tenets">%s</div></div></section>\n') % (
        shead(A['n'], A['kicker'], A['h2'], 'approach-h', cls=' shead--split',
              aside='<div class="shead__aside"><p class="shead__lede">%s</p>%s</div>' % (esc(A['lede']), tlink(A['link'][0], A['link'][1]))),
        tenets())

    Wr = H['writing']
    writing = ('<section class="sect" id="writing" data-locus data-label="Writing" aria-labelledby="writing-h"><div class="wrap">'
               '%s<ol class="ncards">%s</ol></div></section>\n') % (
        shead(Wr['n'], Wr['kicker'], Wr['h2'], 'writing-h', cls=' shead--split',
              aside='<div class="shead__aside"><p class="shead__lede">%s</p>%s</div>' % (esc(Wr['lede']), tlink(Wr['link'][0], Wr['link'][1]))),
        note_cards())

    C = H['contact']
    contact = ('<section class="sect contact" id="contact" data-locus data-label="Contact" aria-labelledby="contact-h"><div class="wrap">'
               '<div class="contact__card" data-reveal><div class="contact__l" data-spot>%s<h2 class="contact__h" id="contact-h">%s</h2>'
               '<span class="contact__orb" aria-hidden="true"></span></div>'
               '<div class="contact__r"><p class="contact__k">Get in touch</p><p class="contact__p">%s</p>%s<div class="actions">%s</div>%s</div>'
               '</div></div></section>\n') % (
        slabel(C['n'], C['kicker'], dark=True), esc(C['h2']), esc(C['lede']), mail(),
        btn('Email me', 'mailto:' + EMAIL, 'primary', arrow=True) + btn('LinkedIn', P.SITE['linkedin'], 'ghost') + btn('Résumé', RESUME, 'ghost'),
        hint(H['hint']))

    body = hero + marquee(H['marks']['label'], H['marks']['note']) + featured + before_after + labs + approach + writing + contact
    title, desc = P.META['home']
    return shell('home', '/', title, desc, 'Home', body, ld=person_ld())


# ----------------------------------------------------------------------------
# labs
# ----------------------------------------------------------------------------
LABFEAT_TPL = """<section class="labfeat{{rev}}" id="{{slug}}" data-locus data-label="{{name}}" data-href="/work/{{slug}}" aria-labelledby="{{slug}}-h">
  <div class="wrap labfeat__grid">
    <div class="labfeat__copy" data-reveal>
      <p class="labfeat__k"><span class="labfeat__n">{{n}}</span> / {{cat}}</p>
      <h2 class="labfeat__h" id="{{slug}}-h">{{name}}</h2>
      <p class="labfeat__tag">{{tagline}}</p>
      <p class="labfeat__blurb">{{blurb}}</p>
      <ul class="ticks">{{does}}</ul>
      <ul class="stats stats--row">{{metrics}}</ul>
      <div class="actions">{{actions}}</div>
    </div>
    <div class="labfeat__bay" data-reveal style="--rd:1">{{bay}}</div>
  </div>
</section>
"""


def labs_page():
    L = P.LABS
    acts = btn('Visit Labs', LABS_URL, 'primary', 'lg') + btn('Labs on Work', '/work?f=independent', 'ghost', 'lg')
    index = ''.join('<li><a class="labindex__a" href="#%s"><span class="labindex__n">%s</span><span class="labindex__name">%s</span>'
                    '<span class="labindex__tag">%s</span></a></li>' % (s['slug'], s['lab']['n'], esc(s['name']), esc(s['lab']['tagline']))
                    for s in LABS)
    extra = '<div class="actions actions--center">%s</div><ul class="labindex" aria-label="Products on this page">%s</ul>%s' % (acts, index, CONTINUE)
    head = pagehead('Labs', L['kicker'], L['h1'], L['lede'], extra, cls=' phead--center')
    feats = []
    for i, s in enumerate(LABS):
        lab = s['lab']
        feats.append(render(LABFEAT_TPL, rev=' labfeat--rev' if i % 2 else '', slug=s['slug'], name=esc(s['name']), n=lab['n'],
                            cat=esc(lab['cat']), tagline=esc(lab['tagline']), blurb=esc(lab['blurb']),
                            does=''.join('<li>%s</li>' % esc(x) for x in lab['does']),
                            metrics=''.join(stat(v, k) for v, k in s['metrics']),
                            actions=btn('Read the case study', '/work/' + s['slug'], 'primary') + btn('Open ' + s['name'], s['live'], 'ghost'),
                            bay=system_bay(s, 'bay-' + s['slug'], 'compact')))
    Sh = L['shared']
    # each card is watermarked with the product's own vocabulary
    words = dict(ridelens='Route Price Soonest Value Estimate Range Upfront', daylight='Schedule Resolve Explain Asked Accepted Confirmed',
                 raildrop='Booked Watching Board Alert Listed Honest')
    rules = ''.join('<li class="rule" data-words="%s" data-reveal%s><p class="rule__k">%s · %s</p><p class="rule__h">%s</p><p class="rule__p">%s</p></li>'
                    % (esc(' '.join([words[s['slug']]] * 3)), rd(i), esc(s['name']), esc(s['lab']['cat']), esc(s['lab']['rule']),
                       esc(s['lab']['rule_body'])) for i, s in enumerate(LABS))
    shared = ('<section class="sect" id="shared" data-locus data-label="What they share" aria-labelledby="shared-h"><div class="wrap">'
              '%s<ul class="rules">%s</ul></div></section>\n') % (
        shead(Sh['n'], Sh['kicker'], Sh['h2'], 'shared-h', Sh['lede'], cls=' shead--center'), rules)
    C = L['cta']
    visit = ('<section class="sect sect--tight" id="visit" data-locus data-label="Visit Labs" aria-labelledby="visit-h"><div class="wrap">'
             '<a class="visit" href="%s" target="_blank" rel="noopener" data-spot data-reveal><span class="visit__orb" aria-hidden="true"></span>'
             '<span class="visit__copy"><span class="visit__k">%s</span><h2 class="visit__h" id="visit-h">%s</h2><span class="visit__p">%s</span></span>'
             '<span class="visit__go btn btn--mint"><span>%s</span>%s</span>%s</a><div class="rows__foot">%s</div></div></section>\n') % (
        esc(LABS_URL), esc(host(LABS_URL)), esc(C['h2']), esc(C['lede']), esc(C['link'][0]), EXTI, NEWTAB, hint(L['hint']))
    body = head + ''.join(feats) + shared + visit
    title, desc = P.META['labs']
    return shell('labs', '/labs', title, desc, 'Labs', body)


# ----------------------------------------------------------------------------
# work
# ----------------------------------------------------------------------------
WROW_TPL = """<li class="wrow" id="{{slug}}" data-facet="{{facet}}" data-locus data-label="{{short}}" data-href="/work/{{slug}}" data-wake>
  <a class="wrow__main" href="/work/{{slug}}">
    <p class="wrow__meta"><span class="idchip">{{id}}</span><span class="fchip fchip--{{facet}}">{{fname}}</span><span class="wrow__org">{{org}}</span></p>
    <h2 class="wrow__title">{{title}}</h2>
    <p class="wrow__role">{{role}}</p>
    <p class="wrow__lede">{{lede}}</p>
    <p class="wrow__metrics">{{metrics}}</p>
    <p class="wrow__go"><span>Read the case</span>{{arrow}}</p>
  </a>
  <div class="wrow__aside">
    <div class="wrow__story" aria-hidden="true">{{story}}</div>
    <p class="wrow__phases">{{phases}}</p>
    {{live}}
  </div>
</li>
"""


def work():
    W = P.WORK
    counts = {'all': len(SYSTEMS)}
    for key, _ in FACETS:
        counts[key] = sum(1 for s in SYSTEMS if s['facet'] == key)
    facets = ''.join('<button type="button" class="seg__btn facet" data-facet="%s" aria-pressed="%s"><span class="facet__l">%s</span>'
                     '<span class="facet__n" aria-hidden="true">%02d</span></button>' % (key, 'true' if i == 0 else 'false', esc(label), counts[key])
                     for i, (key, label) in enumerate(W['facets']))
    rows = []
    for s in SYSTEMS:
        org = s['org'] + ((' · ' + s['year']) if s['year'] else '')
        metrics = ''.join('<span class="wmetric"><b>%s</b><i>%s</i></span>' % (mval(v), esc(k)) for v, k in s['metrics'])
        live = link('<span>Open %s</span>' % esc(s['name']), s['live'], 'tlink wrow__live') if s.get('live') else ''
        rows.append(render(WROW_TPL, slug=s['slug'], facet=s['facet'], short=esc(s['short']), id=s['id'],
                           fname=FACET_NAME[s['facet']], title=esc(s['title']), role=esc(s['role']), lede=esc(s['lede']),
                           metrics=metrics, org=esc(org), story=stories.render(s['slug'], attrs=' data-thumb data-autoplay'), arrow=ARROW,
                           phases=' <span class="wrow__arr" aria-hidden="true">→</span> '.join(
                               '<span data-phase="%d"%s>%s</span>' % (j, ' class="is-cur"' if j == stories.STORIES[s['slug']]['rest'] else '', esc(p[0]))
                               for j, p in enumerate(s['phases'])), live=live))
    extra = ('<div class="phead__tools"><div class="seg seg--facets" role="group" aria-label="Filter by capability" data-seg>%s'
             '<span class="seg__ind" aria-hidden="true"></span></div><p class="work__locus" data-work-locus>%s</p></div>%s') % (
        facets, esc('01/%02d · %s' % (len(SYSTEMS), SYSTEMS[0]['short'])), CONTINUE)
    body = (pagehead('Work', W['kicker'], W['h1'], W['lede'], extra)
            + '<section class="sect sect--flush" aria-label="Systems ledger"><div class="wrap">'
            + '<ol class="wrows" data-rows>%s</ol>' % ''.join(rows)
            + '<div class="rows__foot">%s<button class="tbtn" type="button" data-copy-link>Copy link</button></div>' % hint(W['hint'])
            + '<p class="sr-only" aria-live="polite" data-facet-live></p></div></section>\n')
    title, desc = P.META['work']
    return shell('work', '/work', title, desc, 'Work', body)


# ----------------------------------------------------------------------------
# case
# ----------------------------------------------------------------------------
CASE_TPL = """<section class="casehead" id="top">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="{{sec_href}}">{{sec}}</a><span aria-hidden="true">/</span><span aria-current="page">{{name}}</span></nav>
    <div class="casehead__grid">
      <div class="casehead__copy" data-reveal>
        <p class="casehead__k"><span class="idchip">{{id}}</span><span>{{kind}}</span><span class="casehead__read">{{read}} read</span></p>
        <h1 class="casehead__h" id="case-title">{{title}}</h1>
        <p class="casehead__lede">{{lede}}</p>
        <ul class="chips casehead__meta" aria-label="Case facts">{{meta}}</ul>
        <div class="actions">{{actions}}</div>
      </div>
      <ul class="casehead__metrics" aria-label="Headline metrics" data-reveal style="--rd:1">{{metrics}}</ul>
    </div>
  </div>
</section>
<section class="casebay" aria-label="System diagram"><div class="wrap" data-reveal>{{bay}}</div></section>
<div class="beatbar" data-beatbar>
  <div class="beatbar__in">
    <p class="beatbar__id"><b>{{short}}</b><span data-beat-name>{{b0}}</span><span class="beatbar__idx" data-beat-idx>01/{{nb}}</span></p>
    <nav class="beatbar__nav" aria-label="Case sections">{{toc}}</nav>
    <div class="beatprog" aria-hidden="true" data-beatprog>{{segs}}</div>
  </div>
</div>
<section class="casebody">
  <div class="wrap casebody__grid">
    <aside class="caseside" aria-label="Case facts and contents">
      <div class="caseside__card">
        <dl class="facts">{{facts}}</dl>
        <p class="caseside__h">On this page</p>
        <nav class="toc" aria-label="On this page">{{toc}}</nav>
        <div class="caseside__tools"><button class="tbtn" type="button" data-copy-beat>Copy · <span data-beat-name>{{b0}}</span></button><button class="tbtn" type="button" data-copy-brief>Copy brief</button></div>
      </div>
    </aside>
    <article class="casearticle" aria-labelledby="case-title">
{{beats}}
{{closeout}}
    </article>
  </div>
</section>
<script type="application/json" id="brief">{{brief}}</script>
"""

EMBED_TPL = """<figure class="embed" data-embed>
<div class="embed__bar" aria-hidden="true"><span class="embed__dots"><i></i><i></i><i></i></span><span class="embed__url">{{host}}</span><span class="embed__live"><i></i>Live</span></div>
<div class="embed__frame"><p class="embed__wait" data-embed-wait>Opening the live product.</p><iframe src="{{src}}" title="{{name}} live preview" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe></div>
<figcaption class="embed__cap">Live product preview · the working app, not a mock · scroll inside the frame to explore. If it stays blank, open the product in a new tab - some browsers block embeds.</figcaption>
</figure>"""

CLOSE_TPL = """<div class="closeout">
  <a class="nextcard" href="/work/{{nslug}}">
    <span class="nextcard__copy"><small>Next system</small><strong>{{nname}}</strong><em><b>{{nv}}</b> · {{nk}}</em><span class="nextcard__go"><span>Read the case</span>{{arrow}}</span></span>
    <span class="nextcard__img"><img src="{{nimg}}" alt="" width="640" height="400" loading="lazy" decoding="async"></span>
  </a>
  <div class="closeout__tools"><button class="tbtn" type="button" data-copy-brief>Copy brief</button><a class="tbtn" href="/work">All systems</a><a class="tbtn" href="/labs">Labs</a><a class="tbtn" href="/approach">Approach</a></div>
  {{mail}}
  <p class="also"><span class="also__k">Also see</span>{{also}}</p>
</div>
<nav class="casenav" aria-label="Adjacent cases">
  <a class="casenav__a" href="/work/{{pslug}}" rel="prev" data-adj="prev"><small>Previous</small><strong>{{pname}}</strong></a>
  <a class="casenav__a casenav__a--next" href="/work/{{nslug}}" rel="next" data-adj="next"><small>Next</small><strong>{{nname}}</strong></a>
</nav>
{{hint}}"""


def beat_html(s, bt, j):
    k = bt['kind']
    note = ('<p class="beat__note">%s</p>' % esc(bt['note'])) if bt.get('note') else ''
    if k == 'text':
        inner = '<p class="beat__p">%s</p>' % esc(bt['body'])
    elif k == 'list':
        inner = '<ul class="ticks">%s</ul>' % ''.join('<li>%s</li>' % esc(x) for x in bt['body'])
    elif k == 'flow':
        inner = '<ol class="flow">%s</ol>' % ''.join(
            '<li class="flow__step"><span class="flow__k"><i>%02d</i>%s</span><strong>%s</strong><p>%s</p></li>' % (i + 1, esc(a), esc(b), esc(c))
            for i, (a, b, c) in enumerate(bt['body']))
    elif k == 'role':
        inner = '<p class="beat__p">%s</p><ul class="chips">%s</ul>' % (
            esc(bt['body']), ''.join('<li>%s</li>' % esc(x) for x in bt['tags'].split(' · ')))
    elif k == 'grid':
        inner = '<ul class="gridl%s">%s</ul>' % (' gridl--3' if len(bt['body']) % 3 == 0 and len(bt['body']) != 6 else '',
                                                  ''.join('<li><b>%s</b><p>%s</p></li>' % (esc(a), esc(b)) for a, b in bt['body']))
    elif k == 'specs':
        inner = '<dl class="specs">%s</dl>' % ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (esc(a), esc(b)) for a, b in bt['body'])
    elif k == 'live':
        inner = '<p class="beat__p">%s</p>' % esc(bt['body'])
        if s.get('embed'):
            inner += render(EMBED_TPL, src=esc(s['live']), host=esc(host(s['live'])), name=esc(s['name']))
        inner += '<p class="beat__cta">%s</p>' % btn('Open ' + s['name'], s['live'], 'primary')
    else:
        raise ValueError('unknown beat kind: ' + k)
    key = bt['key']
    return ('<section class="beat beat--%s" id="%s" data-beat data-locus data-label="%s" aria-labelledby="%s-h">'
            '<header class="beat__head"><span class="beat__n" aria-hidden="true">%02d</span><h2 class="beat__h" id="%s-h">%s</h2></header>%s%s</section>\n') % (
        k, key, esc(bt['label']), key, j + 1, key, esc(bt['title']), inner, note)


def brief_text(s):
    lines = [s['name'] + ' · ' + s['id'], s['title'],
             ' · '.join(x for x in [s['org'], s['stage'], s['year'], s['role']] if x), '', s['lede'], '',
             ' · '.join('%s %s' % (v, k) for v, k in s['metrics'])]
    impact = [b for b in s['beats'] if b['key'] == 'impact']
    if impact:
        lines += ['', 'Impact: ' + impact[0]['body']]
    if s.get('live'):
        lines += ['', 'Live: ' + s['live']]
    lines += ['', DOM + '/work/' + s['slug']]
    return '\n'.join(lines)


def case(s, idx):
    n = len(SYSTEMS)
    prv, nxt = SYSTEMS[(idx - 1) % n], SYSTEMS[(idx + 1) % n]
    beats = s['beats']
    keys = [b['key'] for b in beats]
    assert len(set(keys)) == len(keys), s['slug']
    jump = 'impact' if 'impact' in keys else ('built' if 'built' in keys else keys[0])
    jump_label = [b['label'] for b in beats if b['key'] == jump][0]
    metrics = ''.join('<li><button type="button" class="cmetric" data-jump="%s" aria-label="%s: %s. Jump to %s.">'
                      '<b class="stat__v"%s>%s</b><span>%s</span></button></li>'
                      % (jump, esc(plain(v)), esc(k), esc(jump_label), count_attr(v), mval(v), esc(k)) for v, k in s['metrics'])
    lab = s['facet'] == 'independent'
    acts = []
    if s.get('live'):
        acts.append(btn('Open ' + s['name'], s['live'], 'primary'))
    acts.append(btn('All Labs' if lab else 'All systems', '/labs' if lab else '/work', 'ghost' if s.get('live') else 'primary', arrow=False))
    acts.append(btn('Next: ' + nxt['name'], '/work/' + nxt['slug'], 'ghost'))
    meta = ''.join('<li>%s</li>' % esc(x) for x in [s['org'], s['stage'], s['year'], s['role']] if x)
    toc = ''.join('<a href="#%s" data-beat-link="%s"><span>%02d</span>%s</a>' % (b['key'], b['key'], j + 1, esc(b['label']))
                  for j, b in enumerate(beats))
    facts = [('Status', s['stage']), ('Domain', s['org']), ('My role', s['role']), ('Internal', s['name'])]
    if s['year']:
        facts.append(('Year', s['year']))
    facts_html = ''.join('<div><dt>%s</dt><dd>%s</dd></div>' % (k, mval(v)) for k, v in facts)
    if s.get('live'):
        facts_html += '<div><dt>Live</dt><dd>%s</dd></div>' % link('<span>Open %s</span>' % esc(s['name']), s['live'], 'tlink')
    also = '<span class="sep" aria-hidden="true">·</span>'.join(
        '<a class="tlink" href="/work/%s"><span>%s</span></a>' % (a, esc(BY[a]['name'])) for a in s['also'])
    closeout = render(CLOSE_TPL, nimg=img_v('assets/img/work/%s.jpg' % nxt['slug']), nslug=nxt['slug'], nname=esc(nxt['name']), nv=mval(nxt['ledger'][1]), nk=esc(nxt['ledger'][2]),
                      pslug=prv['slug'], pname=esc(prv['name']), mail=mail(), also=also, arrow=ARROW,
                      hint=hint('1-%d beats · j / k · ← → adjacent · y link · b brief' % min(9, len(beats))))
    body = render(CASE_TPL, sec='Labs' if lab else 'Work', sec_href='/labs' if lab else '/work',
                  id=s['id'], name=esc(s['name']), kind=esc(s['kind']), read=esc(s['read']), title=esc(s['title']),
                  lede=esc(s['lede']), meta=meta, actions=''.join(acts), metrics=metrics,
                  bay=system_bay(s, 'bay-case', 'steps'), short=esc(s['short']), b0=esc(beats[0]['label']),
                  nb='%02d' % len(beats), toc=toc, segs=''.join('<i data-seg="%s"></i>' % k for k in keys), facts=facts_html,
                  beats=''.join(beat_html(s, b, j) for j, b in enumerate(beats)), closeout=closeout,
                  brief=json.dumps({'text': brief_text(s)}, ensure_ascii=False).replace('</', '<\\/'))
    desc = P.CASE_DESC.get(s['slug'], s['lede'])
    ld = [{'@context': 'https://schema.org', '@type': 'TechArticle', 'headline': s['title'], 'description': desc,
           'author': {'@type': 'Person', 'name': 'John Jayasankar', 'url': DOM + '/'}, 'about': s['org'],
           'url': DOM + '/work/' + s['slug'], 'image': og_img()},
          {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
              {'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': DOM + '/'},
              {'@type': 'ListItem', 'position': 2, 'name': 'Labs' if lab else 'Work', 'item': DOM + ('/labs' if lab else '/work')},
              {'@type': 'ListItem', 'position': 3, 'name': s['name'], 'item': DOM + '/work/' + s['slug']}]}]
    return shell('case', '/work/' + s['slug'], s['name'] + ' · John Jayasankar', desc, s['short'], body,
                 og_type='article', ld=ld, section='labs' if lab else 'work')


# ----------------------------------------------------------------------------
# approach
# ----------------------------------------------------------------------------
def approach():
    A = P.APPROACH
    b = A['bay']
    layers = bay('bay-layers', 'platform', b['title'], b['sub'], b['big'], b['big_sub'], b['foot'], BY['platform']['phases'],
                 'steps', steps=[(name, det) for name, det, _ in A['layers']], side='Control layers')
    L = A['ladder']
    rungs = ''.join('<li><button type="button" class="rung" data-rung="%d" aria-pressed="%s" style="--i:%d">'
                    '<span class="rung__bar" aria-hidden="true"></span><small>%02d</small><b>%s</b><span class="rung__d">%s</span></button></li>'
                    % (i, 'true' if i == L['active'] else 'false', i, i + 1, esc(name), esc(d))
                    for i, (name, d) in enumerate(L['rungs']))
    active = L['rungs'][L['active']]
    Pr = A['principles']
    body = (pagehead('Approach', A['kicker'], A['h1'], A['lede'], CONTINUE)
            + ('<section class="sect sect--flush" id="layers" data-locus data-label="Control layers" aria-label="Control layers">'
               '<div class="wrap" data-reveal>%s<p class="layers__note">%s</p></div></section>\n') % (layers, esc(A['layer_note']))
            + ('<section class="sect" id="principles" data-locus data-label="Principles" aria-labelledby="principles-h"><div class="wrap">'
               '%s<div class="tenets">%s</div></div></section>\n') % (shead(Pr['n'], Pr['kicker'], Pr['h2'], 'principles-h', cls=' shead--center'), tenets('h3'))
            + ('<section class="sect" id="ladder" data-locus data-label="Autonomy ladder" aria-labelledby="ladder-h"><div class="wrap">'
               '%s<div class="ladder__vis" data-reveal style="--rd:1"><p class="ladder__locus" data-ladder-locus>%s</p>'
               '<ol class="rungs" aria-label="Autonomy ladder">%s</ol>'
               '<p class="ladder__read" data-ladder-read aria-live="polite"><b>%s</b> %s</p></div>'
               '<div class="rows__foot">%s</div></div></section>\n') % (
                shead(L['n'], L['kicker'], L['h2'], 'ladder-h', cls=' shead--split',
                      aside='<div class="shead__aside"><p class="shead__lede">%s</p>%s</div>' % (esc(L['lede']), tlink(L['link'][0], L['link'][1]))),
                esc('%02d / %02d · %s' % (L['active'] + 1, len(L['rungs']), active[0])), rungs,
                esc(active[0]), esc(active[1]), hint(A['hint'])))
    title, desc = P.META['approach']
    return shell('approach', '/approach', title, desc, 'Approach', body)


# ----------------------------------------------------------------------------
# about
# ----------------------------------------------------------------------------
ABOUT_TPL = """<section class="phead phead--about" id="top" data-locus data-label="About">
  <div class="wrap about__grid">
    <div class="about__copy" data-reveal>
      {{label}}
      <h1 class="h1" id="page-title">{{h1}}</h1>
      <div class="about__bio">{{bio}}</div>
      <div class="actions">{{acts}}</div>
      {{mail}}
      {{cont}}
    </div>
    <div class="about__media" data-reveal style="--rd:1">
      <div class="portrait"><img src="/assets/img/portrait-sq.jpg" srcset="/assets/img/portrait-sq-480.jpg 480w, /assets/img/portrait-sq.jpg 768w" sizes="(min-width: 1024px) 440px, 92vw" width="768" height="768" alt="John Jayasankar" fetchpriority="high" decoding="async"></div>
      <div class="edu" id="education"><span class="edu__logo">{{emark}}</span><div><h2 class="edu__school">{{school}}</h2><p class="edu__deg">{{degree}}</p><p class="edu__note">{{enote}}</p></div></div>
    </div>
  </div>
</section>
<section class="sect" id="experience" aria-labelledby="exp-h">
  <div class="wrap">
    <div class="shead shead--split" data-reveal><div>{{explabel}}<h2 class="h2" id="exp-h">{{path}}</h2></div><div class="shead__aside">{{hint}}</div></div>
    <div class="expgrid">{{exp}}</div>
  </div>
</section>
<section class="sect sect--tight" aria-label="Earlier roles, Labs and skills">
  <div class="wrap about__more">
    <section class="panel earlier" id="earlier" data-locus data-label="Earlier" aria-labelledby="earlier-h" data-reveal><p class="panel__k">Before product</p><h2 class="panel__h" id="earlier-h">Earlier</h2><ul class="earlier__list">{{early}}</ul></section>
    <section class="panel alabs" id="independent" data-locus data-label="Labs" aria-labelledby="alabs-h" data-reveal style="--rd:1"><p class="panel__k">{{alk}}</p><h2 class="panel__h" id="alabs-h">{{alh}}</h2><p class="panel__p">{{allede}}</p><ul class="alabs__list">{{alabs}}</ul><p class="panel__more">{{alink}}</p></section>
    <section class="panel skills" id="skills" data-locus data-label="Skills" aria-labelledby="skills-h" data-reveal style="--rd:2"><p class="panel__k">What I bring</p><h2 class="panel__h" id="skills-h">{{skk}}</h2><p class="panel__p">{{skl}}</p><div class="skills__cols">{{groups}}</div><p class="panel__more">{{sklinks}}</p></section>
  </div>
</section>
<section class="sect" id="institutional" data-locus data-label="Institutional context" aria-labelledby="inst-h">
  <div class="wrap"><div class="inst" data-spot data-reveal><div class="inst__copy">{{instlabel}}<h2 class="inst__h" id="inst-h">{{insth}}</h2><p class="inst__p">{{instl}}</p></div><ul class="inst__grid">{{inst}}</ul></div></div>
</section>
"""


def about():
    A = P.ABOUT
    exp = []
    for i, e in enumerate(A['experience']):
        start, end = e['roles'][-1][1].split(' to ')[0], e['roles'][0][1].split(' to ')[-1]
        cases = ''.join('<li><a class="casechip" href="%s"><span class="casechip__n">%s</span><span class="casechip__m"><b>%s</b> %s</span></a></li>'
                        % (href, esc(name), mval(v), esc(k)) for name, href, v, k in e['cases'])
        roles = ''.join('<div class="role"><h4 class="role__t">%s</h4><p class="role__d">%s</p><ul class="ticks ticks--sm">%s</ul></div>'
                        % (esc(t), esc(d), ''.join('<li>%s</li>' % esc(x) for x in items)) for t, d, items in e['roles'])
        exp.append(('<article class="exp" id="%s" data-locus data-label="%s" aria-labelledby="%s-h" data-reveal%s>'
                    '<div class="exp__brand"><span class="exp__tile">%s</span><span class="exp__when"><span>%s to %s</span><span>%s</span></span></div>'
                    '<h3 class="exp__co" id="%s-h">%s</h3><p class="exp__parent">%s</p>'
                    '<div class="exp__roles">%s</div><div class="exp__cases"><p class="exp__k">Selected cases from this role</p><ul>%s</ul></div></article>\n') % (
            e['id'], esc(e['company']), e['id'], rd(i), mark_span(e['logo'], 210, 34), esc(start), esc(end), esc(e['place']), e['id'], esc(e['company']),
            esc(e['parent']), roles, cases))
    early = []
    for co, logo, when, role in A['earlier']:
        early.append('<li class="early"><span class="early__top">%s<span class="early__when">%s</span></span>'
                     '<div class="early__body"><h3 class="early__co">%s</h3><p class="early__role">%s</p></div></li>'
                     % (mark_span(logo, 132, 24), esc(when), esc(co), esc(role)))
    AL = A['labs']
    alabs = ''.join('<li><a class="alab" href="/work/%s"><span class="alab__k">%s / %s</span><span class="alab__name">%s</span><span class="alab__tag">%s</span></a></li>'
                    % (s['slug'], s['lab']['n'], esc(s['lab']['cat']), esc(s['name']), esc(s['lab']['tagline'])) for s in LABS)
    Sk = A['skills']
    groups = ''.join('<div class="skills__g"><h3>%s</h3><ul class="chips">%s</ul></div>' % (esc(g), ''.join('<li>%s</li>' % esc(x) for x in items))
                     for g, items in Sk['groups'])
    E = A['edu']
    I = A['institutional']
    inst = ''.join('<li class="inst__item"><span class="mark" style="--m:url(/assets/img/vc-%s.svg);--ar:%.4f;--h:%gpx" aria-hidden="true"></span>'
                   '<span class="inst__name">%s</span></li>' % (key, svg_ratio('assets/img/vc-%s.svg' % key), round(MARK_H[key] * 1.15, 1), esc(name))
                   for key, name in P.MARKS)
    body = render(ABOUT_TPL, label=slabel(None, A['kicker']), h1=esc(A['h1']),
                  bio=''.join('<p>%s</p>' % esc(p) for p in A['bio']),
                  acts=btn('Email me', 'mailto:' + EMAIL, 'primary', arrow=True) + btn('Résumé', RESUME, 'ghost') + btn('LinkedIn', P.SITE['linkedin'], 'ghost'),
                  mail=mail(), cont=CONTINUE, emark=mark_span(E['logo'], 96, 30), school=esc(E['school']), degree=esc(E['degree']),
                  enote=esc(E['note']), explabel=slabel('01', 'Experience'), path=mval(A['path']), hint=hint(A['hint']),
                  exp=''.join(exp), early=''.join(early), alk=esc(AL['kicker']), alh=esc(AL['h2']), allede=esc(AL['lede']),
                  alabs=alabs, alink=tlink('The Labs page', '/labs'), skk=esc(Sk['kicker']), skl=esc(Sk['lede']), groups=groups,
                  sklinks='<span class="sep" aria-hidden="true">·</span>'.join(tlink(l, h) for l, h in Sk['links']),
                  instlabel=slabel('02', I['kicker'], dark=True), insth=esc(I['h2']), instl=esc(I['lede']), inst=inst)
    title, desc = P.META['about']
    return shell('about', '/about', title, desc, 'About', body, ld=person_ld())


# ----------------------------------------------------------------------------
# writing
# ----------------------------------------------------------------------------
def writing():
    W = P.WRITING
    extra = '<div class="actions">%s</div>%s' % (btn(W['follow'], P.SITE['substack'], 'primary', 'lg'), CONTINUE)
    body = (pagehead('Writing', W['kicker'], W['h1'], W['lede'], extra)
            + ('<section class="sect sect--flush" aria-label="Theses"><div class="wrap">'
               '<ol class="ncards ncards--page">%s</ol><div class="rows__foot">%s<button class="tbtn" type="button" data-copy-link>Copy link</button></div>'
               '<p class="notes__foot">%s</p></div></section>\n') % (
                note_cards('h2', page=True), hint(W['hint']), tlink(W['foot'], P.SITE['substack'])))
    title, desc = P.META['writing']
    return shell('writing', '/writing', title, desc, 'Writing', body)


# ----------------------------------------------------------------------------
# simple
# ----------------------------------------------------------------------------
ICONS = dict(
    linkedin='<svg class="iico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.5h4v11H3v-11zm6.5 0h3.8v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v5.69h-4v-5.05c0-1.2-.02-2.76-1.75-2.76-1.75 0-2.02 1.3-2.02 2.67v5.14h-4v-11z"/></svg>',
    substack='<svg class="iico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 3.5h16V6H4V3.5zm0 4.2h16v2.5H4V7.7zM4 12l8 4.6 8-4.6v8.5l-8-4.5-8 4.5V12z"/></svg>',
    resume='<svg class="iico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5M8.5 13h7M8.5 16.5h7"/></svg>',
    email='<svg class="iico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5l9 6 9-6"/></svg>',
)

SIMPLE_TPL = """<body class="simple" data-label="Simple">
<a class="skip" href="#history">Skip to timeline</a>
<main id="simple-main" aria-label="Simple portfolio">
<header id="dhead" class="container" data-sec data-label="Top">
  <div class="topline"><p class="locus" data-simple-locus aria-hidden="true">01 / {{nsec}} · Top</p><div class="topline__r"><button class="kbtn" type="button" data-cmdk aria-label="Open command palette" aria-keyshortcuts="Meta+K Control+K"><span data-modkey>⌘</span>K</button><a class="switch" href="/">Full site <span aria-hidden="true">→</span></a></div></div>
  <div class="row">
    <div id="dpic"><img src="/assets/img/portrait-sq-480.jpg" srcset="/assets/img/portrait-sq-240.jpg 240w, /assets/img/portrait-sq-480.jpg 480w" sizes="240px" width="240" height="240" alt="John Jayasankar" fetchpriority="high" decoding="async"></div>
    <div id="ddesc">
      <h1>John Jayasankar</h1>
      <p class="tagline">{{tagline}}</p>
      <div id="dico" role="group" aria-label="Profiles and contact">{{icons}}</div>
      <div id="demail" data-demail hidden><a href="mailto:{{email}}">{{email}}</a><button type="button" class="kbtn" data-copy-email>Copy</button></div>
    </div>
  </div>
</header>
<hr>
<section id="history" class="container" data-sec data-label="Timeline" aria-label="Career timeline" tabindex="-1">{{timeline}}</section>
<section id="bio" class="container" data-sec data-label="Bio" aria-labelledby="bio-t"><h2 class="ctitle" id="bio-t"><a href="#bio">bio</a></h2><p class="prose">{{bio}}</p></section>
<section id="selected-systems" class="container" data-sec data-label="Selected systems" aria-labelledby="sys-t"><h2 class="ctitle" id="sys-t"><a href="#selected-systems">selected systems</a></h2><ul class="cards">{{cards}}</ul></section>
<section id="build" class="container" data-sec data-label="How I build" aria-labelledby="build-t"><h2 class="ctitle" id="build-t"><a href="#build">how I build</a></h2><p class="prose">{{build}}</p></section>
<section id="writing" class="container" data-sec data-label="Featured writing" aria-labelledby="writing-t"><h2 class="ctitle" id="writing-t"><a href="#writing">featured writing</a></h2><p class="prose">{{writing}}</p><ul class="pubs">{{pubs}}</ul></section>
<section id="pet-projects" class="container" data-sec data-label="Pet projects" aria-labelledby="pets-t"><h2 class="ctitle" id="pets-t"><a href="#pet-projects">pet projects</a></h2><p class="prose">{{pets_intro}}</p>{{pets}}</section>
<section id="outcomes" class="container" data-sec data-label="Selected outcomes" aria-labelledby="out-t"><h2 class="ctitle" id="out-t"><a href="#outcomes">selected outcomes</a></h2>{{outcomes}}</section>
<section id="misc" class="container" data-sec data-label="Misc" aria-labelledby="misc-t"><h2 class="ctitle" id="misc-t"><a href="#misc">misc unsorted</a></h2><ul class="misc-list">{{misc}}</ul></section>
<footer class="container sfoot"><span>{{foot}}</span><a href="#dhead" data-totop-link>Top <span aria-hidden="true">↑</span></a></footer>
</main>
"""


def simple():
    S = P.SIMPLE
    icons = (link(ICONS['linkedin'] + '<span class="sr-only">LinkedIn</span>', P.SITE['linkedin'])
             + link(ICONS['substack'] + '<span class="sr-only">Substack</span>', P.SITE['substack'])
             + link(ICONS['resume'] + '<span class="sr-only">Résumé (PDF)</span>', RESUME)
             + '<button type="button" aria-expanded="false" aria-controls="demail" data-email-toggle>%s<span class="sr-only">Show email address</span></button>' % ICONS['email'])
    timeline = []
    for i, e in enumerate(S['timeline']):
        r = svg_ratio('assets/img/logo-%s.svg' % e['logo'])
        max_h = 42 if r < 1.6 else 26
        w, h = (54, round(54 / r)) if r >= 54 / max_h else (round(max_h * r), max_h)
        timeline.append('<div class="entry"><div class="timespan">%s</div><div class="ico"><span class="entry-dot" aria-hidden="true"></span>'
                        '<span class="tile"><img src="/assets/img/logo-%s.svg" alt="%s" width="%d" height="%d"%s decoding="async"></span></div>'
                        '<div class="desc">%s</div></div>' % (esc(e['span']), e['logo'], esc(e['alt']), w, h,
                                                            ' loading="lazy"' if i > 2 else '', ''.join('<p>%s</p>' % x for x in e['html'])))
    cards = ''.join('<li class="card"><a href="/work/%s"><img src="%s" alt="" width="480" height="300" loading="lazy" decoding="async">'
                    '<strong>%s</strong><span>%s</span></a></li>' % (slug, img_v('assets/img/work/%s.jpg' % slug), esc(name), esc(cap))
                    for slug, name, cap in S['systems'])
    pubs = ''.join('<li><a class="pub-title" href="%s">%s</a> · %s</li>' % (n['href'], esc(n['title']), esc(n['dek'])) for n in P.NOTES)
    pets = ''.join('<div class="project"><div class="pico"><a href="/work/%s" tabindex="-1" aria-hidden="true"><img src="%s" alt="" width="480" height="300" loading="lazy" decoding="async"></a></div>'
                   '<div class="pdesc">%s</div></div>' % (p['slug'], img_v('assets/img/work/%s.jpg' % p['slug']), p['html']) for p in S['pets'])
    outcomes = ''.join('<div class="pub"><a class="pub-title" href="/work/%s">%s</a><div class="pub-venue">%s</div><div class="pub-authors">%s</div></div>'
                       % (slug, esc(BY[slug]['title']), esc(venue), esc(line)) for slug, venue, line in S['outcomes'])
    misc = ''.join('<li>%s</li>' % x for x in S['misc_html'])
    title, desc = P.META['simple']
    head = render(HEAD, page='simple', title=esc(title), desc=esc(desc), url=esc(DOM + '/simple'), robots='index, follow',
                  theme='#ffffff', ogtype='profile', ogimg=esc(og_img()), ogalt=esc(P.SITE['og_alt']),
                  preload=PRELOAD, sheet='simple.css', v=V['scss'], ld=ld_block(person_ld()))
    body = render(SIMPLE_TPL, nsec='%02d' % len(S['sections']), tagline=esc(S['tagline']), icons=icons, email=EMAIL,
                  timeline=''.join(timeline), bio=S['bio_html'], cards=cards, build=S['build_html'],
                  writing=S['writing_html'], pubs=pubs, pets_intro=S['pets_intro_html'], pets=pets, outcomes=outcomes,
                  misc=misc, foot=esc(S['foot']))
    return head + body + OVERLAYS.replace(TOTOP, '') + scripts() + '</body>\n</html>\n'


# ----------------------------------------------------------------------------
# 404
# ----------------------------------------------------------------------------
def notfound():
    N = P.NOT_FOUND
    acts = (btn('Home', '/', 'primary') + btn('Selected systems', '/work', 'ghost') + btn('Labs', '/labs', 'ghost')
            + btn('Simple', '/simple', 'ghost'))
    extra = ('<p class="nf__path"><span>Requested</span><code data-nf-path>/</code></p>'
             '<div class="nf__recent" data-nf-recent hidden><p class="nf__k">Recent</p><ul data-nf-list></ul></div>'
             '<div class="actions">%s</div>%s') % (acts, hint(N['hint']))
    body = pagehead('Not found', N['kicker'], N['h1'], N['lede'], extra, cls=' phead--nf')
    title, desc = P.META['notfound']
    return shell('notfound', '/404', title, desc, 'Not found', body, robots='noindex, follow')


# ----------------------------------------------------------------------------
# data, sitemap, robots
# ----------------------------------------------------------------------------
def data_js():
    systems = []
    for s in SYSTEMS:
        v, k = s['metrics'][0]
        systems.append(dict(slug=s['slug'], id=s['id'], name=s['name'], short=s['short'], title=s['title'],
                            facet=s['facet'], kind=s['kind'], org=s['org'], year=s['year'] or '', metric=[v, k],
                            live=s.get('live') or '', beats=[[b['key'], b['label']] for b in s['beats']]))
    data = dict(
        systems=systems,
        notes=[dict(title=n['title'], tag=n['tag'], dek=n['dek'], href=n['href']) for n in P.NOTES],
        pages=[['Home', '/'], ['Work', '/work'], ['Labs', '/labs'], ['Approach', '/approach'], ['About', '/about'],
               ['Writing', '/writing'], ['Simple', '/simple']],
        links=dict(email=EMAIL, linkedin=P.SITE['linkedin'], substack=P.SITE['substack'], resume=RESUME, labs=LABS_URL,
                   products=[[name, url] for name, url in P.PRODUCTS.values()]),
    )
    return ('/* generated by tools/build.py - do not edit */\nwindow.JJ = '
            + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')


def sitemap():
    paths = ['/', '/work', '/labs', '/approach', '/writing', '/about', '/simple'] + ['/work/' + s['slug'] for s in SYSTEMS]
    urls = ''.join('  <url><loc>%s%s</loc><lastmod>%s</lastmod></url>\n' % (DOM, '' if p == '/' else p, LASTMOD) for p in paths)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + urls.replace('<loc>%s</loc>' % DOM, '<loc>%s/</loc>' % DOM) + '</urlset>\n')


def robots():
    return 'User-agent: *\nAllow: /\nDisallow: /research/\n\nSitemap: %s/sitemap.xml\n' % DOM


# ----------------------------------------------------------------------------
# checks
# ----------------------------------------------------------------------------
def check(files):
    problems, missing_src = [], set()
    for rel in files:
        if not rel.endswith('.html'):
            continue
        with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
            text = f.read()
        for bad in ('—', '–'):
            if bad in text:
                i = text.index(bad)
                problems.append('%s: dash %r near %r' % (rel, bad, text[max(0, i - 40):i + 40]))
        ids = set(re.findall(r'\sid="([^"]+)"', text))
        for href in re.findall(r'href="(#[^"]*)"', text):
            if href != '#' and href[1:] not in ids:
                problems.append('%s: in-page anchor %s has no target' % (rel, href))
        for ref in re.findall(r'aria-(?:controls|labelledby)="([^"]+)"', text):
            for one in ref.split():
                if one not in ids:
                    problems.append('%s: aria reference %s has no target' % (rel, one))
        for href in re.findall(r'href="(/[^"#?]*)', text):
            if not resolves(href):
                problems.append('%s: link %s goes nowhere' % (rel, href))
        for src in re.findall(r'(?:src|srcset)="(/[^" ?]+)', text):
            if not resolves(src):
                missing_src.add(src)
        for dup in [i for i in ids if len(re.findall(r'\sid="%s"' % re.escape(i), text)) > 1]:
            problems.append('%s: duplicate id %s' % (rel, dup))
    return problems, sorted(missing_src)


def resolves(href):
    if href == '/':
        return True
    path = os.path.join(ROOT, href.lstrip('/'))
    return os.path.isfile(path) or os.path.isfile(path + '.html')


def main():
    written = [write('assets/js/jj-data.js', data_js())]
    for key, rel in (('css', 'assets/css/site.css'), ('scss', 'assets/css/simple.css'), ('site', 'assets/js/site.js'),
                     ('data', 'assets/js/jj-data.js')):
        V[key] = fingerprint(rel)
    written.append(write('index.html', home()))
    written.append(write('labs.html', labs_page()))
    written.append(write('work.html', work()))
    for i, s in enumerate(SYSTEMS):
        written.append(write('work/%s.html' % s['slug'], case(s, i)))
    written.append(write('approach.html', approach()))
    written.append(write('about.html', about()))
    written.append(write('writing.html', writing()))
    written.append(write('simple.html', simple()))
    written.append(write('404.html', notfound()))
    written.append(write('sitemap.xml', sitemap()))
    written.append(write('robots.txt', robots()))
    problems, missing = check(written)
    for m in missing:
        print('note: referenced asset not present yet:', m)
    if problems:
        for p in problems:
            print('ERROR', p)
        sys.exit(1)
    print('built %d files, %d systems, checks clean' % (len(written), len(SYSTEMS)))


if __name__ == '__main__':
    main()
