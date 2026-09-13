"""Page-level content: chrome, home, labs, work, approach, about, writing,
simple, 404.

Copy is taken from johnjayasankar.com (captured September 2026) so every claim,
number and link on the rebuilt site matches the live one. The Labs page and the
home Labs section use the wording of John's Labs site (labs.johnjayasankar.com)
for RideLens, Daylight, and RailDrop.

Fields named *_html are small trusted fragments authored here: links, <kbd> and
<b> only. Everything else is plain text and is escaped by the generator."""

SITE = dict(
    name='John Jayasankar',
    role='Lead Product Manager',
    city='New York',
    year='2026',
    domain='https://johnjayasankar.com',
    email='johnjayasankar@gmail.com',
    linkedin='https://www.linkedin.com/in/johnjayasankar',
    substack='https://substack.com/@johnjayasankar',
    labs='https://labs.johnjayasankar.com/',
    resume='/John_Jayasankar_Resume.pdf',
    og_image='/assets/img/og.jpg',
    og_alt='John Jayasankar · Lead Product Manager · production AI agents and 0→1 financial infrastructure',
    tagline='I like to ship AI agents into high-stakes financial workflows.',
)

PRODUCTS = dict(
    ridelens=('RideLens', 'https://ride-lens2.vercel.app/'),
    daylight=('Daylight', 'https://daylight-app-wine.vercel.app/'),
    raildrop=('RailDrop', 'https://rail-drop3.vercel.app/'),
)

NAV = [('Work', '/work', 'work'), ('Labs', '/labs', 'labs'), ('Approach', '/approach', 'approach'),
       ('About', '/about', 'about'), ('Writing', '/writing', 'writing')]

SITE_LINKS = [('Work', '/work'), ('Labs', '/labs'), ('Approach', '/approach'), ('About', '/about'),
              ('Writing', '/writing'), ('Simple', '/simple')]

# (label, href, opens elsewhere)
ELSEWHERE = [
    ('Email', 'mailto:johnjayasankar@gmail.com', False),
    ('LinkedIn', 'https://www.linkedin.com/in/johnjayasankar', True),
    ('Résumé', '/John_Jayasankar_Resume.pdf', True),
    ('Substack', 'https://substack.com/@johnjayasankar', True),
    ('Labs', 'https://labs.johnjayasankar.com/', True),
]

# The Work menu in the header, and the footer, group every case this way.
WORK_GROUPS = [('Production AI', ['iport', 'coco', 'platform']),
               ('Market infrastructure', ['cross-currency', 'valuation', 'fx-compression', 'margin-simulator']),
               ('Labs', ['ridelens', 'daylight', 'raildrop'])]

# Investors and acquirers of the companies John worked at. Same set, same
# order, as the strip on the live site. Files live in assets/img/vc-<key>.svg.
MARKS = [
    ('accel', 'Accel'), ('thoma-bravo', 'Thoma Bravo'), ('firstmark', 'FirstMark Capital'),
    ('spectrum-equity', 'Spectrum Equity'), ('dawn-capital', 'Dawn Capital'), ('allianz-x', 'Allianz X'),
    ('lseg', 'London Stock Exchange Group'), ('cme-group', 'CME Group'),
    ('jpx', 'Japan Exchange Group'), ('trading-technologies', 'Trading Technologies'),
]

META = dict(
    home=('John Jayasankar · Lead Product Manager',
          'John Jayasankar is a Lead Product Manager in New York building production AI agents and 0→1 financial infrastructure. AI agents, fintech, and high-stakes workflows.'),
    work=('Work · John Jayasankar',
          'Selected systems: production AI agents and 0→1 financial infrastructure, with measured change.'),
    labs=('Labs · John Jayasankar',
          'RideLens, Daylight, and RailDrop: independent products John Jayasankar designed, built, and shipped live end-to-end.'),
    approach=('Approach · John Jayasankar',
              'Agents should earn autonomy. Context, typed tools, human gates, and evidence.'),
    about=('About · John Jayasankar',
           'Lead Product Manager in New York. Production AI agents and 0→1 financial infrastructure.'),
    writing=('Writing · John Jayasankar',
             'Three short theses on AI product economics, autonomy, and infrastructure. Longer notes land on Substack when they exist.'),
    simple=('John Jayasankar',
            'John Jayasankar. Lead Product Manager in New York. Production AI agents, financial infrastructure, RideLens, RailDrop, and Daylight.'),
    notfound=('Not found · John Jayasankar', 'This page is not on johnjayasankar.com.'),
)

# Case descriptions the live site uses in place of the lede for search/social.
CASE_DESC = dict(
    ridelens='Every ride, one comparison. Uber, Lyft, Empower, and Curb ranked before you book.',
    raildrop='Know when your train gets cheaper. Watch Amtrak listed fares across your window. Never invent a price.',
    daylight='Adaptive display lighting for macOS. Warmth and brightness on a schedule you set - offline and explainable.',
)

# art: the line drawing on each principle card (drawn in the generator)
TENETS = [
    dict(n='01', art='workflow', title='Start with the workflow.',
         body='Map handoffs, exceptions, and the cost of being wrong before choosing a model. If the operating model would not change, it is not an agent problem.',
         links=[('I-Port', '/work/iport')]),
    dict(n='02', art='ladder', title='Agents should earn autonomy.',
         body='Context, bounded tools, deterministic services, and human control are the product. Model capability is one layer. Scope expands when evidence says it should.',
         links=[('CoCo', '/work/coco'), ('Platform', '/work/platform')]),
    dict(n='03', art='rings', title='Reliability is a feature.',
         body='In markets and in agents, a late failure is a product failure. Validation, evals, and operator visibility belong in the design, not in the cleanup.',
         links=[('Valuation', '/work/valuation'), ('FX', '/work/fx-compression')]),
]

NOTES = [
    dict(id='routing-intelligence', tag='AI product economics', cover='Routing intelligence',
         title='How much intelligence is this user action worth?',
         dek='Routing intelligence is a unit-economics decision.', href='/writing#routing-intelligence'),
    dict(id='autonomy', tag='Agent controls', cover='Earned autonomy',
         title='Autonomy is a product decision, not a model capability.',
         dek='Evidence, reversibility, and control determine where an agent should be allowed to act.', href='/approach'),
    dict(id='infrastructure', tag='Fintech × AI', cover='Infrastructure first',
         title='The hardest AI products are often infrastructure products.',
         dek='Data quality, APIs, entitlements, and workflow design decide whether the model actually ships.', href='/work'),
]

HOME = dict(
    badge='Lead Product Manager · New York',
    h1=('I build production AI agents', 'and 0→1 financial infrastructure.'),
    lede='For high-stakes workflows. At Quantile (LSEG), that means agents that cut expert work from hours to minutes and market systems that make large books executable. Outside work, I ship independent products end-to-end: RideLens, RailDrop, and Daylight.',
    career=['Quantile (LSEG)', 'OpenGamma', 'Wells Fargo'],
    hero=dict(
        title='Agents + markets · one control model',
        sub='Production AI · shared human gate · multilateral compression',
        big='Hours → minutes', big_sub='',
        foot=('Schematic · same control spine across Quantile systems', 'Offsets inside a risk envelope'),
        phases=[('Agents', .15, 'I-Port and CoCo: expert work compressed from hours to minutes.'),
                ('Gate', .48, 'Human approval sits between agent intent and irreversible action.'),
                ('Market', .82, 'SwapAgent: multilateral offsets - $6.5T eligible under the same control model.')],
    ),
    # the tabbed showcase under the hero; the first tab is the hero story above
    show=[dict(key='agents', tab='Agents + gate', link=('Production AI on Work', '/work?f=agents')),
          dict(key='markets', tab='Market structure', slug='cross-currency', link=('Read the SwapAgent case', '/work/cross-currency')),
          dict(key='labs', tab='Labs', slug='ridelens', link=('Explore Labs', '/labs'))],
    proof=[('3.5h → 8m', 'expert setup, now an agent', '/work/iport'),
           ('3×', 'run volume, same headcount', '/work/iport'),
           ('$3M+', 'new and expansion ARR', '/work'),
           ('$6.5T', 'eligible notional unlocked', '/work/cross-currency')],
    marks=dict(label='Employer investors & acquirers', note='Backers and owners of the companies I have worked at, not personal endorsements'),
    featured=dict(
        n='01', kicker='Selected work',
        h2=('Production AI inside live operations.', '0→1 infrastructure in rates, FX, and cross-currency.'),
        lede='Two production AI agents that cut expert work from hours to minutes, and market infrastructure that unlocked previously ineligible notional.',
        slugs=['iport', 'coco', 'cross-currency']),
    ledger=dict(
        kicker='Also shipped', h2='Supporting systems from Quantile and OpenGamma.',
        slugs=['valuation', 'fx-compression', 'platform', 'margin-simulator'],
        link=('All systems on Work', '/work')),
    # before and after: every figure is a case study's own number
    before_after=dict(
        n='02', kicker='Measured change',
        h2=('Before and after.', 'What five shipped systems changed.'),
        lede='Each row is one system from the case studies: how the work ran before it shipped, and what changed after. Select a row to read the case.',
        link=('All systems on Work', '/work'),
        toggle=('Before', 'After'),
        foot='Figures from each case study',
        rows=[dict(slug='iport', name='I-Port', what='Compression-run setup',
                   before='3.5 hours, owned by senior engineering', after='8 minutes in operations, 3× run volume'),
              dict(slug='coco', name='QT CoCo', what='Incident investigation',
                   before='4.5 hours, paged to engineering by default', after='11 minutes, 78% fewer escalations'),
              dict(slug='cross-currency', name='LCH SwapAgent', what='Cross-currency compression',
                   before='Bilateral netting only; network offsets unused', after='$6.5T made eligible across 12 currency pairs'),
              dict(slug='valuation', name='Simplified Compression', what='Valuation discrepancies',
                   before='Found late, a discrepancy could halt a live cycle', after='Surfaced 48 hours earlier, 91% fewer failed-run resubmissions'),
              dict(slug='fx-compression', name='ForexClear', what='FX proposals',
                   before='Late validation made good math fail in production', after='100% proposal acceptance across 40+ live runs')]),
    labs=dict(
        n='03', kicker='Labs',
        h2=('Instruments I shipped.', 'Three independent products, built end-to-end.'),
        lede='Consumer tools and a native macOS app, each designed, built, and shipped live. No demos.',
        link=('Visit Labs', 'https://labs.johnjayasankar.com/'), more=('The Labs page', '/labs')),
    approach=dict(
        n='04', kicker='Approach',
        h2=('Agents should earn autonomy.', 'Model capability is only one layer.'),
        lede='Consequential workflows need context, bounded tools, deterministic services, human control, and evidence that the system deserves more scope.',
        link=('Full approach', '/approach')),
    writing=dict(
        n='05', kicker='Writing',
        h2=('Notes, not essays.', 'Short theses on agents and markets.'),
        lede='Three short theses on AI product economics, autonomy, and infrastructure. Longer notes land on Substack when they exist.',
        link=('All notes', '/writing')),
    contact=dict(
        n='06', kicker='Contact', h2='Hiring for production AI or market infrastructure?',
        lede='I ship agents that change real operations and systems that make large books executable, and I build independent products end-to-end. If that is the bar for your team, email me.'),
    hint='j / k sections & systems · Enter on a system · y link · t top · e email · ⌘K jump',
)

LABS = dict(
    kicker='Labs',
    h1=('Instruments I shipped.', 'Independent products, built end-to-end.'),
    lede='Consumer tools and a native macOS app, each designed, built, and shipped live. Separate from the day job. No demos.',
    order=['ridelens', 'daylight', 'raildrop'],
    shared=dict(
        n='04', kicker='What they share',
        h2=('Three products, one discipline.', 'Honest about what they know.'),
        lede='Each draws a hard line between what it knows and what it would be tempting to guess.'),
    cta=dict(h2='Every build lives on Labs.',
             lede='The Labs site keeps the whole bench in one place, each product one click from live.',
             link=('Visit Labs', 'https://labs.johnjayasankar.com/')),
    hint='j / k products · Enter opens the case · 1-4 phases · ⌘K jump',
)

WORK = dict(
    kicker='Work', h1=('What I shipped,', 'and what it changed.'),
    lede='Production AI inside live operations. 0→1 infrastructure in rates, FX, and cross-currency. Then RideLens, RailDrop, and Daylight: independent products built end-to-end and shipped live. Filter by Agents, Markets, or Labs for the path that matches the role you are hiring for.',
    facets=[('all', 'All'), ('agents', 'Agents'), ('markets', 'Markets'), ('independent', 'Labs')],
    hint='1-4 facets · j / k ledger · Enter opens · y link · ⌘K jump',
)

APPROACH = dict(
    kicker='Approach', h1=('Model capability', 'is only one layer.'),
    lede='Consequential workflows need context, bounded tools, deterministic services, human control, and evidence that the system deserves more scope. That is the product.',
    bay=dict(
        title='AI Platform & Controls',
        sub='One plug path · five systems · scope expands when evals say so',
        big='5', big_sub='shared control model',
        foot=('Schematic · five systems, one control plane', 'Scope expands when evals say so'),
    ),
    # (layer, what it is, phase tab) - the tab order matches the platform case
    layers=[('Domain context', 'MCP + APIs', 'Context'),
            ('Typed actions', 'Pydantic bounds', 'Actions'),
            ('Deterministic services', 'outside the model', 'Services'),
            ('HITL gates', 'consequential steps', 'HITL'),
            ('Eval / QA', 'prototype → production', 'Eval')],
    layer_note='Five systems. Same control interfaces.',
    principles=dict(n='02', kicker='Principles', h2=('Three rules I build by.', 'In markets and in agents.')),
    ladder=dict(
        n='03', kicker='Autonomy ladder', h2='Scope expands when the evidence says it should.',
        lede='I standardized this pattern across five enterprise systems: reusable MCP servers, domain APIs, Pydantic-typed actions, deterministic services, human approval, and evaluation baselines.',
        link=('Platform case', '/work/platform'),
        rungs=[('Conventional', 'Rules and scripts. No agent required.'),
               ('Copilot', 'Recommend actions. Human decides.'),
               ('Assistive', 'Retrieve and draft. Human executes.'),
               ('Supervised', 'Act with approval. Human remains the gate.'),
               ('Bounded', 'Act inside policy. Evals decide the next inch.'),
               ('Autonomous', 'Act within a proven envelope. Evidence first.')],
        active=3),
    hint='1-5 layers · j / k when ladder in view · y link · ⌘K jump',
)

ABOUT = dict(
    kicker='About', h1='Lead Product Manager in New York.',
    bio=['I build AI agents and financial infrastructure for complex, high-stakes workflows. Lead PM at Quantile (LSEG), shipping production agents and 0→1 products used by global banks. The work has cut expert workflows from hours to minutes, scaled operations without added headcount, and generated $3M+ in new and expansion ARR.',
         'Previously I originated a pre-trade margin simulator at OpenGamma. I trained in markets where precision is not optional, then brought that standard to agents.',
         'I want to do this at AI-native startups and in big tech alike: teams that treat product craft as a competitive advantage. Most of my domain expertise is in fintech, though I am open to any challenging application of AI. If that is a problem you want to tackle, get in touch.'],
    edu=dict(school='Haverford College', degree='B.A., Economics & Linguistics',
             note='GPA 3.9 · cum laude · Linguistics High Honors · 2022', logo='haverford'),
    path='Financial systems → product ownership → production AI',
    hint='j / k through experience & skills · y link · ⌘K jump',
    experience=[
        dict(id='quantile', company='Quantile Technologies', logo='quantile', place='New York',
             parent='An LSEG business · acquired for $370M',
             cases=[('I-Port', '/work/iport', '3.5h → 8m', 'setup time'),
                    ('CoCo', '/work/coco', '4.5h → 11m', 'investigation'),
                    ('Compression', '/work/cross-currency', '$6.5T', 'eligible notional'),
                    ('Valuation', '/work/valuation', '$6T+', 'cycle notional'),
                    ('FX', '/work/fx-compression', '40+', 'live runs'),
                    ('Platform', '/work/platform', '5', 'enterprise systems')],
             roles=[('Lead Product Manager, Portfolio Optimization', 'Sep 2025 to Present',
                     ['Shipping production AI agents and a reusable human-supervised architecture across enterprise financial workflows.',
                      'Generated $3M+ in new and expansion ARR across rates, FX, and cross-currency optimization.']),
                    ('Product Manager, Portfolio Optimization', 'Jul 2023 to Sep 2025',
                     ['Owned discovery, strategy, launch, and GTM for optimization products used by global banks.',
                      '0→1 launches in multilateral compression, valuation/validation, and FX, then the agent layer on top of those systems.'])]),
        dict(id='opengamma', company='OpenGamma', logo='opengamma', place='New York',
             parent='Acquired by Trading Technologies',
             cases=[('Margin simulator', '/work/margin-simulator', '0→1', 'originated and shipped')],
             roles=[('Product Analyst', 'Jul 2022 to Jun 2023',
                     ['Originated and shipped a 0→1 pre-trade margin simulator used in front-office workflows.',
                      'Led discovery across trading, treasury, risk, and operations; adoption across 20+ enterprise clients.'])]),
    ],
    earlier=[('Wells Fargo', 'wells-fargo', '2021', 'Summer Analyst, FX / Rates Trading'),
             ('Wharton School', 'wharton', '2021', 'Research Assistant, reporting quality & incentives'),
             ('Hartford Funds', 'hartford-funds', 'Prior', 'Summer Intern, Mutual Funds & ETFs'),
             ('Ocean Trail Partners', 'ocean-trail', 'Prior', 'Private Equity Summer Intern')],
    labs=dict(kicker='Independent', h2='Labs, outside the day job.',
              lede='RideLens, Daylight, and RailDrop are mine end-to-end: product, design, and the build, shipped live.'),
    skills=dict(
        kicker='Skills',
        lede='What I bring to agent and market systems - and the craft I hire for.',
        groups=[('AI & systems', ['AI agents', 'LLM orchestration', 'MCP servers', 'Tool calling', 'HITL controls', 'Agent evals & QA', 'Pydantic actions']),
                ('Product', ['0→1 strategy', 'Enterprise discovery', 'Platform / API products', 'GTM', 'Pricing & packaging', 'Activation']),
                ('Domain', ['Financial infrastructure', 'Portfolio optimization', 'Derivatives compression', 'Margin & risk', 'FX / NDFs', 'CCP workflows']),
                ('Build', ['Python', 'SQL', 'AWS', 'API design'])],
        links=[('See the systems', '/work'), ('Control model', '/approach')]),
    institutional=dict(
        kicker='Institutional context', h2='Who backed and acquired the companies I worked at.',
        lede='Investor and owner marks for Quantile, OpenGamma, and related platforms, not personal funding or endorsement. The strip on the home page is the same set. Useful context for the employers above; the work itself is on Work.'),
)

WRITING = dict(
    kicker='Writing · short theses · not full essays',
    h1=('Three notes on agents,', 'markets, and product economics.'),
    lede='Intentionally short. These theses show how I think about AI product economics, autonomy, and infrastructure, not long articles. Longer writing lands on Substack when it exists.',
    follow='Follow on Substack',
    hint='j / k theses · Enter when linked · y link · ⌘K jump',
    foot='Notes in progress. Follow on Substack',
)

SIMPLE = dict(
    tagline='I like to ship AI agents into high-stakes financial workflows.',
    sections=[('dhead', 'Top'), ('history', 'Timeline'), ('bio', 'Bio'), ('selected-systems', 'Selected systems'),
              ('build', 'How I build'), ('writing', 'Featured writing'), ('pet-projects', 'Pet projects'),
              ('outcomes', 'Selected outcomes'), ('misc', 'Misc')],
    timeline=[
        dict(span='2025 - present', logo='quantile', alt='Quantile Technologies',
             html=['I am Lead Product Manager for Portfolio Optimization at <a href="https://www.quantile.com/">Quantile Technologies</a> (an <a href="https://www.lseg.com/">LSEG</a> business). I ship production AI agents and a reusable human-supervised architecture across enterprise financial workflows. The work has generated $3M+ in new and expansion ARR across rates, FX, and cross-currency optimization.']),
        dict(span='2023 - 2025', logo='quantile', alt='Quantile Technologies',
             html=['I was Product Manager for Portfolio Optimization at Quantile. I owned discovery, strategy, launch, and GTM for optimization products used by global banks. That meant 0→1 launches in multilateral compression, valuation/validation, and FX, then putting an agent layer on top of those systems.',
                   'A few of the systems from this stretch: <a href="/work/iport">I-Port</a> collapsed a 3.5-hour expert setup bottleneck to 8 minutes and scaled run volume 3× at constant headcount. <a href="/work/coco">QT CoCo</a> returned 750+ senior engineering hours a year by diagnosing incidents before they escalated. <a href="/work/cross-currency">LCH SwapAgent</a> made $6.5T of previously ineligible bilateral notional available across 12 currency pairs. <a href="/work/valuation">Simplified Compression</a> surfaced valuation discrepancies 48 hours earlier and cut failed-run resubmissions 91%. <a href="/work/fx-compression">ForexClear</a> embedded margin intelligence in the optimizer and hit 100% proposal acceptance across 40+ live runs. <a href="/work/platform">The agent platform</a> made context, tools, actions, and evaluation reusable across five enterprise agents.']),
        dict(span='2022 - 2023', logo='opengamma', alt='OpenGamma',
             html=['I was a Product Analyst at <a href="https://opengamma.com/">OpenGamma</a>, later acquired by Trading Technologies. I originated and shipped a 0→1 <a href="/work/margin-simulator">pre-trade margin simulator</a> used in front-office workflows. I led discovery across trading, treasury, risk, and operations, with adoption across 20+ enterprise clients. The point was simple: capital should be a decision before you execute, not a surprise after.']),
        dict(span='2021', logo='wells-fargo', alt='Wells Fargo',
             html=['Summer Analyst on the FX / Rates trading desk at Wells Fargo. This is where I learned that in markets, a late failure is not an ops inconvenience. It is the product.']),
        dict(span='2021', logo='wharton', alt='Wharton School',
             html=['Research Assistant at the Wharton School, working on reporting quality and incentives. Useful training for caring about whether a number is actually true before anyone acts on it.']),
        dict(span='Earlier', logo='hartford-funds', alt='Hartford Funds',
             html=['Summer Intern at Hartford Funds on Mutual Funds & ETFs. Early market-structure reps before I moved fully into product.']),
        dict(span='Earlier', logo='ocean-trail', alt='Ocean Trail Partners',
             html=['Private Equity Summer Intern at Ocean Trail Partners. Diligence reps, then out.']),
        dict(span='2018 - 2022', logo='haverford', alt='Haverford College',
             html=['B.A. in Economics &amp; Linguistics at <a href="https://www.haverford.edu/">Haverford College</a>. GPA 3.9, cum laude, Linguistics High Honors. I liked the combination: models of behavior on one side, precision about language and meaning on the other. That pairing still shows up in how I design agent boundaries.']),
    ],
    bio_html='John Jayasankar is a Lead Product Manager in New York. He builds production AI agents and 0→1 financial infrastructure for complex, high-stakes workflows. At Quantile (LSEG) he has shipped agents and optimization products used by global banks. Previously he originated a pre-trade margin simulator at OpenGamma. Independently he built and shipped <a href="https://ride-lens2.vercel.app/">RideLens</a>, <a href="https://rail-drop3.vercel.app/">RailDrop</a>, and <a href="https://daylight-app-wine.vercel.app/">Daylight</a>, collected on <a href="https://labs.johnjayasankar.com/">Labs</a>.',
    systems=[('iport', 'I-Port', '3.5h setup → 8 minutes'),
             ('coco', 'QT CoCo', '750+ eng hours returned / year'),
             ('cross-currency', 'SwapAgent', '$6.5T notional made eligible'),
             ('valuation', 'Valuation', '48h earlier discrepancy signal'),
             ('fx-compression', 'ForexClear', '100% proposal acceptance'),
             ('platform', 'Platform', 'Reusable agent control spine'),
             ('margin-simulator', 'OpenGamma', 'Pre-trade margin decisions'),
             ('ridelens', 'RideLens', 'Every ride, one comparison'),
             ('daylight', 'Daylight', 'Your screen, through the day'),
             ('raildrop', 'RailDrop', 'Know when your train gets cheaper')],
    build_html='Agents should earn autonomy. I start with the workflow, then give the system only the context, tools, and typed actions it needs, with a human gate on anything consequential. Model capability is one layer. Scope expands when evidence says it should. <a href="/approach">More on the control model here</a>.',
    writing_html='Short theses for now. Longer notes land on <a href="https://substack.com/@johnjayasankar">Substack</a>.',
    pets_intro_html='My three best independent builds, all shipped live and collected on <a href="https://labs.johnjayasankar.com/">Labs</a>.',
    pets=[
        dict(slug='ridelens', html='<a href="https://ride-lens2.vercel.app/">RideLens</a> is every ride, one comparison. Live roads. Real rate cards. Uber, Lyft, Empower, and Curb ranked before you book. I built it end-to-end because I was tired of opening four apps and guessing. <a href="/work/ridelens">Case writeup</a>.'),
        dict(slug='daylight', html='<a href="https://daylight-app-wine.vercel.app/">Daylight</a> is adaptive display lighting for macOS: warmth and brightness on a schedule you set, entirely offline, with a printed six-layer precedence ladder and three levels of certainty about whether a change actually took. <a href="/work/daylight">Case writeup</a>.'),
        dict(slug='raildrop', html='<a href="https://rail-drop3.vercel.app/">RailDrop</a> watches Amtrak listed fares across your travel window and emails only when a qualifying option improves. It fails honestly when the source is down and never invents fees, fares, or fake itineraries. <a href="/work/raildrop">Case writeup</a>.'),
    ],
    outcomes=[('iport', 'Quantile · 2025', 'Setup 3.5h → 8m · 3× run volume · 0 AI config errors / 6 mo'),
              ('coco', 'Quantile · 2025', 'Investigation 4.5h → 11m · −78% escalations · domain MCP'),
              ('cross-currency', 'Quantile · LCH SwapAgent · 2024', '18 banks · 12 currency pairs · +34% notional reduction / run'),
              ('valuation', 'Quantile · 2024', '48h earlier detection · −91% resubmissions · 24 banks'),
              ('fx-compression', 'Quantile · ForexClear · 2024', '40+ live runs · 100% proposal acceptance · −94% live failures'),
              ('margin-simulator', 'OpenGamma · 2022 - 2023', '0→1 front-office product · adoption across 20+ enterprise clients')],
    misc_html=[
        'The denser version of this site, with interactive systems diagrams, lives on the <a href="/">full site</a> (or press <kbd>F</kbd>).',
        'Independent products live on <a href="https://labs.johnjayasankar.com/">Labs</a>, and on the <a href="/labs">Labs page</a> of the full site.',
        'I write short notes on agent economics and control on <a href="https://substack.com/@johnjayasankar">Substack</a>.',
        'Based in New York. Best email is under the envelope icon above (press <kbd>E</kbd>, <kbd>Esc</kbd> to hide), or just <a href="mailto:johnjayasankar@gmail.com">johnjayasankar@gmail.com</a>.',
        'Résumé as a PDF: <a href="/John_Jayasankar_Resume.pdf">John_Jayasankar_Resume.pdf</a>.',
        'Shortcuts: <kbd>⌘K</kbd> jump · <kbd>j</kbd> / <kbd>k</kbd> sections · <kbd>Y</kbd> copy section · <kbd>F</kbd> full site · <kbd>E</kbd> email · <kbd>T</kbd> top. Section titles are deep links.',
        'This simple page is intentionally light: one layout, timeline, bio, and links. The full site is allowed to be heavier because the products are.',
    ],
    foot='John Jayasankar · Lead Product Manager · New York',
)

NOT_FOUND = dict(
    kicker='404 · Off-map', h1=('This page is', 'not in the system.'),
    lede='The URL does not match a case, essay, or live product. The work is still here, just not at this address.',
    hint='Press ⌘K to jump anywhere',
)
