"""Ideas: the writing covers and the Approach principles, drawn in the stories'
language: a dotted stage, white cards, mono labels, mint for what settled, amber
for the gate, sky for context, and motion that tells one idea at a time.

Nothing here states a fact about a system. Labels are the words of each note's or
principle's own copy, and the autonomy rungs are the ladder on the Approach page.
Markup follows tools/stories.py: data-on specs, s-var values, one resting step.
Positions are in em inside a fixed box; the SVG under each box uses ten units per
em, so a path and the card it joins always meet."""

from stories import ICONS, Mk, esc, ico, in_spec, stage

ICONS.update(
    branch='<circle cx="3.8" cy="8" r="1.6"/><circle cx="12.2" cy="3.6" r="1.4"/><circle cx="12.2" cy="12.4" r="1.4"/>'
           '<path d="M5.4 8h5.4M5.2 7.2c2.6-.4 3.6-3.1 5.6-3.5M5.2 8.8c2.6.4 3.6 3.1 5.6 3.5"/>',
    eye='<path d="M1.8 8S4.2 3.7 8 3.7 14.2 8 14.2 8 11.8 12.3 8 12.3 1.8 8 1.8 8z"/><circle cx="8" cy="8" r="1.9"/>',
    list='<path d="M6.2 4.4h7M6.2 8h7M6.2 11.6h7"/><circle cx="3.2" cy="4.4" r=".7" fill="currentColor" stroke="none"/>'
         '<circle cx="3.2" cy="8" r=".7" fill="currentColor" stroke="none"/><circle cx="3.2" cy="11.6" r=".7" fill="currentColor" stroke="none"/>',
)

STEP_MS = 4200
RUNGS = ['Conventional', 'Copilot', 'Assistive', 'Supervised', 'Bounded', 'Autonomous']


def at(x, y, w=None, h=None, extra=''):
    """Absolute placement by top-left corner, in em."""
    s = 'left:%gem;top:%gem' % (x, y)
    if w is not None:
        s += ';width:%gem' % w
    if h is not None:
        s += ';height:%gem' % h
    return s + (';' + extra if extra else '')


def vals(values):
    return ';'.join('--v%d:%g' % (i, v) for i, v in enumerate(values))


def box(inner, w, h, svg='', cls=''):
    svg_html = ('<svg class="i-svg" viewBox="0 0 %g %g" aria-hidden="true" focusable="false">%s</svg>' % (w * 10, h * 10, svg)) if svg else ''
    return '<div class="i-box%s" style="width:%gem;height:%gem">%s%s</div>' % ((' ' + cls) if cls else '', w, h, svg_html, inner)


def path(m, d, cls='i-path', on=None, delay=None):
    """A connector. i-path is the drawn line; i-run is a light that travels along it
    once per phase; i-lit draws the line in, and stays, for the phase."""
    a, c = ' d="%s"' % d, cls
    if not cls.startswith('i-path'):
        a += ' pathLength="100"'
    if on is not None:
        a += ' data-on="%s"' % on
        if in_spec(on, m.rest):
            c += ' is-on'
    if delay is not None:
        a += ' style="--rd:%gs"' % delay
    return '<path class="%s"%s/>' % (c, a)


def pin(m, inner, on, x, y, d=0):
    """A positioned element that fades in with its phase."""
    return m.el('span', 's-fx i-pin', inner, on, at(x, y, extra='--d:%g' % d))


# ----------------------------------------------------------------------------
# Writing 01 · How much intelligence is this user action worth?
# ----------------------------------------------------------------------------
TIERS = [('Rules', '$'), ('Small model', '$$'), ('Frontier model', '$$$')]
STAKES = ['Low stakes', 'Routine', 'High stakes']


def note_routing(m):
    ys = [0.1, 3.75, 7.4]
    tiers = ''.join(m.el('span', 'i-card i-tier', '<span class="i-tier__n">%s</span><span class="i-tier__c">%s</span>%s' % (
        esc(name), cost, m.fx(ico('check'), str(i), 'i-tier__ok', d=15)), str(i), at(16, ys[i], 11, 2.5))
        for i, (name, cost) in enumerate(TIERS))
    meter = ''.join(m.el('i', 'i-meter__b', '', '%d-' % j) for j in range(3))
    action = '<span class="i-card i-action" style="%s"><span class="s-k">User action</span>%s<span class="i-meter">%s</span></span>' % (
        at(0, 1.4, 8.2, 7.2), m.swap(*[m.fx(esc(t), str(i), 'i-action__t') for i, t in enumerate(STAKES)]), meter)
    router = '<span class="i-router" style="%s">%s</span>' % (at(10.8, 3.8, 2.4, 2.4), ico('branch'))
    routes = ['M132 50C146 50 146 13.5 160 13.5', 'M132 50H160', 'M132 50C146 50 146 86.5 160 86.5']
    svg = (path(m, 'M82 50H108') + ''.join(path(m, d) for d in routes)
           + ''.join(path(m, d, 'i-lit', str(i), .95) for i, d in enumerate(routes))
           + ''.join(path(m, 'M82 50H108', 'i-run', str(i), .15) + path(m, d, 'i-run', str(i), .6) for i, d in enumerate(routes)))
    return box(action + router + tiers, 27, 10, svg) + m.chip('A unit-economics decision', 'ink', cls='i-cap')


# ----------------------------------------------------------------------------
# Writing 02 · Autonomy is a product decision, not a model capability.
# ----------------------------------------------------------------------------
CONDS = [('Evidence', 'list'), ('Reversibility', 'refresh'), ('Control', 'shield')]


def note_autonomy(m):
    steps = [1, 2, 3]
    notches = ''.join('<i class="i-notch" style="left:%g%%"></i>' % (i * 20) for i in range(6))
    nums = ''.join('<span class="i-num" style="left:%g%%">%02d</span>' % (i * 20, i + 1) for i in range(6))
    track = ('<span class="i-track"><i class="s-var i-fill" style="%s"></i>%s<i class="s-var i-lock" style="%s">%s</i>'
             '<i class="s-var i-knob" style="%s"></i></span><span class="i-nums">%s</span>') % (
        vals(steps), notches, vals([v + 1 for v in steps]), ico('lock'), vals(steps), nums)
    head = '<span class="i-head"><span class="s-k">Agent scope</span>%s</span>' % m.swap(
        *[m.chip(RUNGS[v], 'soft', 'layers', str(i)) for i, v in enumerate(steps)], cls='s-swap--end')
    conds = ''.join('<span class="s-chip i-cond" style="--i:%d">%s<span>%s</span></span>' % (i, ico(icon), esc(t))
                    for i, (t, icon) in enumerate(CONDS))
    return '<div class="i-card i-scope">%s%s</div><div class="i-conds">%s</div>' % (head, track, conds)


# ----------------------------------------------------------------------------
# Writing 03 · The hardest AI products are often infrastructure products.
# ----------------------------------------------------------------------------
STACK = ['Data quality', 'APIs', 'Entitlements', 'Workflow design']


def note_infra(m):
    # bottom up: two layers settle in the first phase, two in the second, then the model ships
    specs = [('0-', 5), ('0-', 17), ('1-', 5), ('1-', 17)]
    slabs = ''.join('<span class="i-slab"><span class="s-k">%02d</span><b>%s</b><span class="s-swap s-swap--st"><i class="i-ring"></i>%s</span></span>' % (
        k + 1, esc(STACK[k]), m.fx(ico('check'), specs[k][0], 's-st s-st--done', d=specs[k][1])) for k in reversed(range(4)))
    scans = m.el('i', 'i-scan i-scan--lo', '', '0') + m.el('i', 'i-scan i-scan--hi', '', '1')
    model = m.el('span', 'i-model', '<span class="i-model__b">%s<b>Model</b></span>%s' % (
        ico('spark'), m.swap(m.chip('Waiting on the stack', 'soft', 'clock', '0-1'), m.chip('Ships', 'mint', 'check', '2'))), '2')
    return '<div class="i-stack">%s<div class="i-slabs">%s%s</div></div>' % (model, slabs, scans)


# ----------------------------------------------------------------------------
# Principle 01 · Start with the workflow.
# ----------------------------------------------------------------------------
def p_workflow(m):
    def node(label, x, y, w, d, cls='', on=None):
        inner = '<span>%s</span>%s' % (esc(label), m.fx(ico('check'), '2', 'i-node__ok', d=d))
        return m.el('span', 'i-node' + ((' ' + cls) if cls else ''), inner, on, at(x, y, w, 2))
    nodes = (node('Request', .4, 5.5, 6.2, 3) + node('Handoff', 9.2, 1.6, 6.4, 6)
             + node('Exception', 9, 9.4, 6.8, 9, 'i-node--ex', '1') + node('Outcome', 21.2, 5.5, 6.4, 12))
    rh, ho = 'M66 65C80 65 80 26 92 26', 'M156 26C170 26 198 65 212 65'
    he, eo = 'M124 36V94', 'M158 104C176 104 196 65 212 65'
    svg = (path(m, rh) + path(m, ho) + path(m, he, 'i-path i-path--dash') + path(m, eo, 'i-path i-path--dash')
           + path(m, rh, 'i-run', '0', .2) + path(m, ho, 'i-run', '0', .95)
           + path(m, rh, 'i-run', '1', .2) + path(m, he, 'i-run i-run--amber', '1', .95) + path(m, eo, 'i-run i-run--amber', '1', 1.6)
           + path(m, rh, 'i-lit', '2', .15) + path(m, ho, 'i-lit', '2', .5) + path(m, he, 'i-lit i-lit--dash', '2', .5) + path(m, eo, 'i-lit i-lit--dash', '2', .85))
    cost = pin(m, m.chip('Cost of being wrong', 'amber', 'alert'), '1', 16.4, 10.7, 14)
    return box(nodes + cost, 28, 12, svg) + m.fx(m.chip('Then choose a model', '', 'spark', cls='s-chip--dash'), '2', 'i-cap', d=14)


# ----------------------------------------------------------------------------
# Principle 02 · Agents should earn autonomy.
# ----------------------------------------------------------------------------
def p_ladder(m):
    steps = [1, 2, 3]
    bars = []
    for i in range(6):
        h = 1.6 + i * 1.25
        fill = {2: '1-', 3: '2-'}.get(i)
        nxt = {2: '0', 3: '1', 4: '2'}.get(i)
        lock = m.el('i', 'i-bar__lock', ico('lock'), nxt) if nxt else ''
        cls = 'i-bar' + (' i-bar--base' if i <= 1 else '')
        pos = at(i * 3.45, 9.4 - h, 2.7, h)
        bars.append((m.el('span', cls, lock, fill, pos) if fill else '<span class="%s" style="%s">%s</span>' % (cls, pos, lock))
                    + '<span class="i-num2" style="%s"><span>%02d</span></span>' % (at(i * 3.45, 9.75, 2.7), i + 1))
    agent = '<span class="s-var i-agent" style="%s">%s<i class="i-agent__dot"></i></span>' % (
        vals(steps), m.swap(*[m.chip(RUNGS[v], 'soft', None, str(i)) for i, v in enumerate(steps)], cls='i-agent__name'))
    ev = ''.join(m.el('i', 'i-ev__f', '', str(i)) for i in range(3))
    evidence = '<span class="i-ev" style="%s"><span class="s-k">Evidence</span><span class="s-track i-ev__t">%s</span></span>' % (at(0, 11.6, 20.1), ev)
    return box(''.join(bars) + agent + evidence, 20.1, 12.9)


# ----------------------------------------------------------------------------
# Principle 03 · Reliability is a feature.
# ----------------------------------------------------------------------------
def p_reliability(m):
    segs = [('Design', .5, 8), ('Build', 8, 15), ('Live', 15, 21.5), ('Cleanup', 21.5, 26.5)]
    track = ''.join('<i class="i-seg i-seg--%s" style="%s"></i>' % (n.lower(), at(a, 6.76, b - a, .5)) for n, a, b in segs)
    labels = ''.join('<span class="i-seglab i-seglab--%s" style="%s"><span>%s</span></span>' % (n.lower(), at(a, 7.95, b - a), n) for n, a, b in segs)
    checks = [('Validation', 3.2, 'shield', '0-', '0', 1.3), ('Evals', 7.8, 'list', '1-', '1', 1.3), ('Visibility', 12.2, 'eye', '2', None, .45)]
    cps = ''
    for name, x, icon, on, hit, cd in checks:
        cps += m.el('span', 'i-cp', ico(icon) + '<span class="i-cp__l">%s</span>' % name, on, at(x - 1.15, 5.86, 2.3, 2.3, '--cd:%gs' % cd))
        if hit is not None:
            # a fault travels from the start and is caught here, long before live
            cps += m.el('i', 'i-token', '', hit, at(.5, 6.56, .9, .9, '--x:%gem' % (x - 1.45)))
    live = m.el('i', 'i-live', '', '2', at(15, 6.7, 6.5, .62))
    caption = '<span class="i-pin i-pin--c" style="%s">%s</span>' % (at(13.5, 1.1), m.swap(
        m.chip('Caught in validation', 'mint', 'check', '0', 19), m.chip('Caught by evals', 'mint', 'check', '1', 19),
        m.chip('Caught before live', 'mint', 'check', '2', 8)))
    return box(track + live + labels + cps + caption, 27, 9.2)


# ----------------------------------------------------------------------------
# registry
# ----------------------------------------------------------------------------
IDEAS = {
    'note-routing': dict(group='markets', kind='note', n=3, rest=2, fn=note_routing, label='Routing intelligence'),
    'note-autonomy': dict(group='labs', kind='note', n=3, rest=2, fn=note_autonomy, label='Earned autonomy'),
    'note-infra': dict(group='agents', kind='note', n=3, rest=2, fn=note_infra, label='Infrastructure first'),
    'p-workflow': dict(group='agents', kind='tenet', n=3, rest=2, fn=p_workflow, label=''),
    'p-ladder': dict(group='labs', kind='tenet', n=3, rest=2, fn=p_ladder, label=''),
    'p-reliability': dict(group='markets', kind='tenet', n=3, rest=2, fn=p_reliability, label=''),
}
NOTE_KEYS = {'routing-intelligence': 'note-routing', 'autonomy': 'note-autonomy', 'infrastructure': 'note-infra'}
TENET_KEYS = {'workflow': 'p-workflow', 'ladder': 'p-ladder', 'rings': 'p-reliability'}


def render(key, attrs='', rest=None):
    """Ideas are decorative: the card around each one carries its words."""
    st = IDEAS[key]
    r = st['rest'] if rest is None else rest
    outer = '<p class="i-label">%s</p>' % esc(st['label']) if st['label'] else ''
    return stage(key, st['group'], st['n'], r, st['fn'](Mk(r)), st['label'], attrs + ' data-ms="%d"' % STEP_MS,
                 outer, hidden=True, cls='story--idea story--' + st['kind'])
