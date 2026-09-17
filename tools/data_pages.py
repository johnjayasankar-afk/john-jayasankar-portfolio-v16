"""Page-level content: chrome, home, labs, work, approach, about, writing,
simple, 404.

Copy is taken from johnjayasankar.com (captured September 2026) so every claim,
number and link on the rebuilt site matches the live one. The Labs page and the
home Labs section use the wording of John's Labs site (labs.johnjayasankar.com)
for RideLens, Daylight, RailDrop, and Gridiron.

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
    tagline='I build AI agents for high-stakes financial workflows.',
)

PRODUCTS = dict(
    ridelens=('RideLens', 'https://ride-lens2.vercel.app/'),
    daylight=('Daylight', 'https://daylight-app-wine.vercel.app/'),
    raildrop=('RailDrop', 'https://rail-drop3.vercel.app/'),
    gridiron=('Gridiron', 'https://gridiron-pink-chi.vercel.app/'),
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
]

# The Work menu in the header, and the footer, group every case this way.
WORK_GROUPS = [('Production AI', ['setup-agent', 'incident-agent', 'platform']),
               ('Market infrastructure', ['cross-currency', 'valuation', 'fx-compression', 'margin-simulator']),
               ('Labs', ['ridelens', 'daylight', 'raildrop', 'gridiron'])]

# The strip under the home showcase: the ground the work covers, in the words of
# the skills on John's résumé. (icon from stories.ICONS, label)
DOMAINS = [
    ('spark', 'Production AI agents'), ('sliders', 'Derivatives compression'), ('network', 'MCP servers'),
    ('calc', 'Initial margin'), ('check', 'Agent evals'), ('refresh', 'FX forwards & NDFs'),
    ('shield', 'Human-in-the-loop controls'), ('columns', 'Portfolio optimization'), ('layers', 'Tool calling'),
    ('lock', 'CCP clearing'), ('plus', '0→1 launches'), ('route', 'Platform & API products'),
]

# One line at the foot of every page; the full text is LEGAL, at /legal.
LEGAL_LINE = ('Personal site. The views here are my own, not those of any employer. '
              'Company names and logos identify companies only and do not imply endorsement.')

LEGAL = dict(
    kicker='Disclaimer',
    h1=('A personal site.', 'The views here are my own.'),
    lede='What this site is, what it is not, and how to reach me about it.',
    parts=[
        ('My own views', ['This is my personal website, and the opinions on it are my own. Nothing here is written on behalf of, '
                          'reviewed by, or endorsed by any company I work for or have worked for, or by their parent companies, '
                          'investors, clients or partners.']),
        ('Built on my own time', ['I built this site and every Labs product on my own time, with my own resources. None of them '
                                  'is a product of, or endorsed by, any employer.']),
        ('About the case studies', ['Case studies describe my role in team work, in general terms. Product names, client details '
                                    'and other confidential information are left out, and dollar figures from that work are masked. '
                                    'Diagrams are illustrations made for this site, not real systems or interfaces.']),
        ('Names and logos', ['Company and service names and logos belong to their owners and appear only to identify them, such as '
                             'where I have worked or what a Labs product uses. Their appearance does not mean that any company '
                             'sponsors, endorses, or is affiliated with me or this site.']),
        ('Not advice', ['Nothing on this site is investment, financial, betting, legal, or tax advice. Prices, fares, and odds in '
                        'the Labs case studies are shown for information only.']),
        ('Corrections', ['If something here should be corrected or removed, email '
                         '<a href="mailto:johnjayasankar@gmail.com">johnjayasankar@gmail.com</a>.']),
    ],
)

META = dict(
    home=('John Jayasankar · Lead Product Manager, Production AI Agents',
          'Lead Product Manager in New York building production AI agents and 0→1 financial infrastructure at Quantile (LSEG), plus independent products on Labs.'),
    work=('Work · John Jayasankar',
          'Case studies by John Jayasankar: production AI agents and market infrastructure at Quantile (LSEG) and OpenGamma, plus four independent products.'),
    labs=('Independent products · John Jayasankar',
          'RideLens, Daylight, RailDrop, and Gridiron: independent products John Jayasankar designed, built, and shipped live end-to-end.'),
    approach=('Approach · John Jayasankar',
              'How John Jayasankar builds AI agents for high-stakes work: domain context, typed actions, deterministic services, human approval, and evals.'),
    about=('About · John Jayasankar',
           'John Jayasankar is a Lead Product Manager in New York at Quantile (LSEG), previously OpenGamma, building production AI agents and financial infrastructure.'),
    writing=('Writing · John Jayasankar',
             'Three short theses by John Jayasankar on AI product economics, agent autonomy, and why the hardest AI products are infrastructure products.'),
    legal=('Disclaimer · John Jayasankar',
           'John Jayasankar’s personal site. The views are his own, and no company named here sponsors, endorses or is affiliated with it.'),
    simple=('John Jayasankar',
            'John Jayasankar. Lead Product Manager in New York. Production AI agents, financial infrastructure, RideLens, Daylight, RailDrop, and Gridiron.'),
    notfound=('Not found · John Jayasankar', 'This page is not on johnjayasankar.com.'),
)

# Case descriptions the live site uses in place of the lede for search/social.
CASE_DESC = dict(
    **{'setup-agent': 'Case study: a production AI agent that cut compression-run setup from 3.5 hours to 8 minutes and tripled run volume at constant headcount.',
       'incident-agent': 'Case study: an MCP-backed incident triage agent that cut expert investigation from 4.5 hours to 11 minutes and escalations to engineering by 78%.',
       'cross-currency': 'Case study: a 0→1 launch of multilateral cross-currency compression across 12 currency pairs, with 34% more notional reduction per run for 18 banks.',
       'valuation': 'Case study: dual-source valuation that surfaced discrepancies 48 hours earlier and cut failed-run resubmissions 91% across 24 banks.',
       'fx-compression': 'Case study: FX forward and NDF compression with clearing-house margin inside the optimizer, reaching 100% proposal acceptance across 40+ live runs.',
       'platform': 'Case study: one human-supervised control pattern across five enterprise agent systems, with MCP servers, typed actions, approval gates, and evals.',
       'margin-simulator': 'Case study: a 0→1 pre-trade margin simulator at OpenGamma that compared a trade’s initial margin across venues before execution.'},
    ridelens='Every ride, one comparison. Uber, Lyft, Empower, and Curb ranked before you book.',
    raildrop='Know when your train gets cheaper. RailDrop watches listed Amtrak fares across your travel window and never invents a price.',
    daylight='Adaptive display lighting for macOS: warmth and brightness on a schedule you set, offline and explainable.',
    gridiron='Every game. Every drive. One view. A live NFL and college football command center with a 3D field for every game and odds from named sources.',
)

# art: the line drawing on each principle card (drawn in the generator)
TENETS = [
    dict(n='01', art='workflow', title='Start with the workflow.',
         body='Map handoffs, exceptions, and the cost of being wrong before choosing a model. If the operating model would not change, it is not an agent problem.',
         links=[('Setup Agent', '/work/setup-agent')]),
    dict(n='02', art='ladder', title='Agents should earn autonomy.',
         body='Context, bounded tools, deterministic services, and human control are the product. Autonomy grows one rung at a time, on evidence.',
         links=[('Incident Agent', '/work/incident-agent'), ('Agent Platform', '/work/platform')]),
    dict(n='03', art='rings', title='Reliability is a feature.',
         body='In markets and in agents, a late failure is a product failure. Validation, evals, and operator visibility belong in the design, not in the cleanup.',
         links=[('Valuation', '/work/valuation'), ('FX & NDF', '/work/fx-compression')]),
]

NOTES = [
    dict(id='routing-intelligence', tag='AI product economics', cover='Routing intelligence', go='Read the thesis',
         title='How much intelligence is this user action worth?',
         dek='Routing intelligence is a unit-economics decision.', href='/writing#routing-intelligence'),
    dict(id='autonomy', tag='Agent controls', cover='Earned autonomy', go='See the approach',
         title='Autonomy is a product decision, not a model capability.',
         dek='Evidence, reversibility, and control determine where an agent should be allowed to act.', href='/approach'),
    dict(id='infrastructure', tag='Fintech × AI', cover='Infrastructure first', go='See the work',
         title='The hardest AI products are often infrastructure products.',
         dek='Data quality, APIs, entitlements, and workflow design decide whether the model actually ships.', href='/work'),
]

HOME = dict(
    badge='Lead Product Manager · New York',
    h1=('I build production AI agents', 'and 0→1 financial infrastructure.'),
    lede='For high-stakes workflows. At Quantile (LSEG), that means agents that cut expert work from hours to minutes, and market infrastructure used by global banks. Outside work, I ship independent products end-to-end: RideLens, Daylight, RailDrop, and Gridiron.',
    career=['Quantile (LSEG)', 'OpenGamma', 'Wells Fargo'],
    hero=dict(
        title='Agents + markets · Quantile systems',
        sub='Production AI · human gate · multilateral compression',
        big='Hours → minutes', big_sub='',
        foot=('Schematic · Quantile systems', 'Offsets inside a risk envelope'),
        phases=[('Agents', .15, 'Operations and incident agents: expert work compressed from hours to minutes.'),
                ('Gate', .48, 'Human approval sits between agent intent and irreversible action.'),
                ('Market', .82, 'Cross-currency compression: multilateral offsets cut 34% more notional per run.')],
    ),
    # the tabbed showcase under the hero; the first tab is the hero story above
    show=[dict(key='agents', tab='Agents + gate', link=('Production AI on Work', '/work?f=agents')),
          dict(key='markets', tab='Market infrastructure', slug='cross-currency', link=('Read the cross-currency case', '/work/cross-currency')),
          dict(key='labs', tab='Labs', slug='ridelens', link=('Explore Labs', '/labs'))],
    proof=[('3.5h → 8m', 'expert setup, now an agent', '/work/setup-agent'),
           ('750+', 'senior eng hours returned a year', '/work/incident-agent'),
           ('+34%', 'notional reduction per run', '/work/cross-currency'),
           ('100%', 'acceptance, 40+ live runs', '/work/fx-compression')],
    strip=dict(label='What I work across', note='Production AI, market infrastructure, and 0→1 product work'),
    featured=dict(
        n='01', kicker='Selected work',
        h2=('Production AI inside live operations.', '0→1 infrastructure in rates, FX, and cross-currency.'),
        lede='Two production AI agents that cut expert work from hours to minutes, and market infrastructure that unlocked previously ineligible notional.',
        slugs=['setup-agent', 'incident-agent', 'cross-currency']),
    ledger=dict(
        kicker='Also shipped', h2='Supporting systems from Quantile and OpenGamma.',
        slugs=['valuation', 'fx-compression', 'platform', 'margin-simulator'],
        link=('All work', '/work')),
    # before and after: every figure is a case study's own number
    before_after=dict(
        n='02', kicker='Measured change',
        h2=('Before and after.', 'What five shipped systems changed.'),
        lede='Each row is one system from the case studies: how the work ran before it shipped, and what changed after. Select a row to read the case.',
        link=('All work', '/work'),
        toggle=('Before', 'After'),
        foot='Figures from each case study',
        rows=[dict(slug='setup-agent', name='Setup Agent', what='Compression-run setup',
                   before='3.5 hours, owned by senior engineering', after='8 minutes in operations, 3× run volume'),
              dict(slug='incident-agent', name='Incident Agent', what='Incident investigation',
                   before='4.5 hours, paged to engineering by default', after='11 minutes, 78% fewer escalations'),
              dict(slug='cross-currency', name='Cross-Currency', what='Multilateral compression',
                   before='Bilateral netting only; network offsets unused', after='18 banks, 34% more notional reduction per run'),
              dict(slug='valuation', name='Dual-Source Valuation', what='Valuation discrepancies',
                   before='Found late, a discrepancy could halt a live cycle', after='Surfaced 48 hours earlier, 91% fewer failed-run resubmissions'),
              dict(slug='fx-compression', name='FX & NDF Compression', what='FX proposals',
                   before='Late validation made good math fail in production', after='100% proposal acceptance across 40+ live runs')]),
    labs=dict(
        n='03', kicker='Labs',
        h2=('Instruments I shipped.', 'Four independent products, built end-to-end.'),
        lede='Consumer tools, a live football command center, and a native macOS app, each designed, built, and shipped live. No demos.',
        link=('Visit Labs', 'https://labs.johnjayasankar.com/'), more=('The Labs page', '/labs')),
    approach=dict(
        n='04', kicker='Approach',
        h2=('Agents should earn autonomy.', 'Model capability is only one layer.'),
        lede='Consequential workflows need context, bounded tools, deterministic services, human control, and evidence that the system deserves more scope.',
        link=('Full approach', '/approach')),
    writing=dict(
        n='05', kicker='Writing',
        h2=('Notes, not essays.', 'Short theses on agents and markets.'),
        lede='Three short theses on AI product economics, autonomy, and infrastructure.',
        link=('All notes', '/writing')),
    contact=dict(
        n='06', kicker='Contact', h2='Hiring for production AI or market infrastructure?',
        lede='I ship agents that change how real operations run and market infrastructure used by global banks, and I build independent products end-to-end. If that is the bar for your team, email me.'),
    hint='j / k sections & systems · Enter on a system · y link · t top · e email · ⌘K jump',
)

LABS = dict(
    kicker='Labs',
    h1=('Instruments I shipped.', 'Independent products, built end-to-end.'),
    lede='Consumer tools, a live football command center, and a native macOS app, each designed, built, and shipped live. Separate from the day job. No demos.',
    order=['ridelens', 'daylight', 'raildrop', 'gridiron'],
    shared=dict(
        n=None, kicker='What they share',
        h2=('Four products, one discipline.', 'Honest about what they know.'),
        lede='Each draws a hard line between what it knows and what it would be tempting to guess.'),
    cta=dict(h2='Every build lives on Labs.',
             lede='The Labs site keeps the whole bench in one place, each product one click from live.',
             link=('Visit Labs', 'https://labs.johnjayasankar.com/')),
    hint='j / k products · Enter opens the case · 1-4 phases · ⌘K jump',
)

WORK = dict(
    kicker='Work', h1=('What I shipped,', 'and what it changed.'),
    lede='Production AI inside live operations. 0→1 infrastructure in rates, FX, and cross-currency. Then RideLens, Daylight, RailDrop, and Gridiron: independent products built end-to-end and shipped live. Filter by Agents, Markets, or Labs for the path that matches the role you are hiring for.',
    facets=[('all', 'All'), ('agents', 'Agents'), ('markets', 'Markets'), ('independent', 'Labs')],
    hint='1-4 facets · j / k ledger · Enter opens · y link · ⌘K jump',
)

APPROACH = dict(
    kicker='Approach', h1=('Model capability', 'is only one layer.'),
    lede='Consequential workflows need context, bounded tools, deterministic services, human control, and evidence that the system deserves more scope. That is the product.',
    bay=dict(
        title='Agent Platform & Controls',
        sub='Five layers, in the order a request passes through them',
        big='5', big_sub='systems, one control model',
        foot=('Schematic · five systems, one control plane', 'Evals decide the next inch'),
    ),
    # (layer, what it is, phase tab) - the tab order matches the platform case
    layers=[('Domain context', 'MCP + APIs', 'Context'),
            ('Typed actions', 'Pydantic bounds', 'Actions'),
            ('Deterministic services', 'outside the model', 'Services'),
            ('HITL gates', 'consequential steps', 'HITL'),
            ('Eval / QA', 'prototype → production', 'Eval')],
    layer_note='Five systems. Same control interfaces.',
    principles=dict(n=None, kicker='Principles', h2=('Three rules I build by.', 'In markets and in agents.')),
    ladder=dict(
        n=None, kicker='Autonomy ladder', h2='Scope expands when the evidence says it should.',
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
    bio=['I build AI agents and financial infrastructure for complex, high-stakes workflows. Lead PM at Quantile (LSEG), shipping production agents and 0→1 products used by global banks. The work has cut expert workflows from hours to minutes, scaled operations without added headcount, and generated $XM+ in new and expansion ARR.',
         'Previously I originated a pre-trade margin simulator at OpenGamma. I trained in markets where precision is not optional, then brought that standard to agents.',
         'I want to do this next at AI-native startups or in big tech, on teams that treat product craft as a competitive advantage. My deepest domain expertise is in fintech, and I am open to hard applications of AI in any domain. If you are working on one, get in touch.'],
    edu=dict(school='Haverford College', degree='B.A., Economics & Linguistics',
             note='GPA 3.9 · cum laude · High Honors in Linguistics · 2022', logo='haverford'),
    path='Financial systems → product ownership → production AI',
    hint='j / k through experience & skills · y link · ⌘K jump',
    experience=[
        dict(id='quantile', company='Quantile Technologies', logo='quantile', place='New York',
             parent='An LSEG business · acquired for up to £274M',
             cases=[('Setup Agent', '/work/setup-agent', '3.5h → 8m', 'setup time'),
                    ('Incident Agent', '/work/incident-agent', '4.5h → 11m', 'investigation'),
                    ('Cross-Currency', '/work/cross-currency', '+34%', 'reduction per run'),
                    ('Valuation', '/work/valuation', '−91%', 'resubmissions'),
                    ('FX & NDF', '/work/fx-compression', '40+', 'live runs'),
                    ('Agent Platform', '/work/platform', '5', 'enterprise systems')],
             roles=[('Lead Product Manager, Portfolio Optimization', 'Sep 2025 to Present',
                     ['Shipping production AI agents and a reusable human-supervised architecture across enterprise financial workflows.',
                      'Launched a compression setup agent and an incident triage agent that cut expert work from hours to minutes.']),
                    ('Product Manager, Portfolio Optimization', 'Jul 2023 to Sep 2025',
                     ['Generated $XM+ in new and expansion ARR by owning discovery, strategy, launch, and GTM for optimization products used by global banks.',
                      '0→1 launches in multilateral cross-currency compression, dual-source valuation, and FX and NDF compression.'])]),
        dict(id='opengamma', company='OpenGamma', logo='opengamma', place='New York',
             parent='Acquired by Trading Technologies',
             cases=[('Margin Simulator', '/work/margin-simulator', '0→1', 'originated and shipped')],
             roles=[('Product Analyst', 'Jul 2022 to Jun 2023',
                     ['Originated and shipped a 0→1 pre-trade margin simulator used in front-office workflows.',
                      'Led discovery across trading, treasury, risk, and operations; adoption across 20+ enterprise clients.'])]),
    ],
    earlier=[('Wells Fargo', 'wells-fargo', '2021', 'Summer Analyst, FX / Rates Trading'),
             ('Wharton School', 'wharton', '2021', 'Research Assistant, reporting quality & incentives'),
             ('Hartford Funds', 'hartford-funds', 'Prior', 'Summer Intern, Mutual Funds & ETFs'),
             ('Ocean Trail Partners', 'ocean-trail', 'Prior', 'Private Equity Summer Intern')],
    labs=dict(kicker='Independent', h2='Labs, outside the day job.',
              lede='RideLens, Daylight, RailDrop, and Gridiron are mine end-to-end: product, design, and the build, shipped live.'),
    skills=dict(
        kicker='Skills',
        lede='What I bring to agent and market systems.',
        groups=[('AI & systems', ['AI agents', 'LLM orchestration', 'MCP servers', 'Tool calling', 'HITL controls', 'Agent evals & QA', 'Pydantic actions']),
                ('Product', ['0→1 strategy', 'Enterprise discovery', 'Platform / API products', 'GTM', 'Pricing & packaging', 'Activation']),
                ('Domain', ['Financial infrastructure', 'Portfolio optimization', 'Derivatives compression', 'Margin & risk', 'FX / NDFs', 'CCP workflows']),
                ('Build', ['Python', 'SQL', 'AWS', 'API design'])],
        links=[('See the systems', '/work'), ('Control model', '/approach')]),
    glossary=dict(
        kicker='Plain terms', h2='The ideas behind the work, in plain English.',
        lede='Derivatives and agent systems come with jargon. These are the terms my case studies lean on, one line each.',
        terms=[('Notional', 'The face amount a derivative is written on, not the money at risk.'),
               ('Compression', 'Retiring offsetting trades so gross notional falls and risk holds.'),
               ('Multilateral', 'Offsets found across many firms at once, not pair by pair.'),
               ('Initial margin', 'Collateral posted up front against what a position could lose.'),
               ('CCP', 'A central counterparty between both sides of a cleared trade.'),
               ('Cross-currency swap', 'Exchanging interest and principal in two currencies over time.'),
               ('NDF', 'A currency forward settled as one net payment, usually in dollars.'),
               ('MCP', 'Model Context Protocol, a standard way to plug tools into agents.'),
               ('Human in the loop', 'A person approves an agent’s consequential step before it runs.'),
               ('Evals', 'Repeatable tests that show whether an agent is ready to ship.')]),
)

WRITING = dict(
    kicker='Writing · short theses',
    h1=('Three notes on agents,', 'markets, and product economics.'),
    lede='Intentionally short: how I think about AI product economics, autonomy, and infrastructure. Longer writing will go to Substack.',
    follow='Follow on Substack',
    hint='j / k theses · Enter when linked · y link · ⌘K jump',
    foot='Notes in progress. Follow on Substack',
)

SIMPLE = dict(
    tagline='I build AI agents for high-stakes financial workflows.',
    sections=[('dhead', 'Top'), ('history', 'Timeline'), ('bio', 'Bio'), ('selected-systems', 'Selected systems'),
              ('build', 'How I build'), ('writing', 'Featured writing'), ('pet-projects', 'Independent products'),
              ('outcomes', 'Selected outcomes'), ('misc', 'Misc')],
    timeline=[
        dict(span='2025 to present', logo='quantile', alt='Quantile Technologies',
             html=['I am Lead Product Manager for Portfolio Optimization at <a href="https://www.quantile.com/">Quantile Technologies</a> (an <a href="https://www.lseg.com/">LSEG</a> business). I ship production AI agents and a reusable human-supervised architecture across enterprise financial workflows. <a href="/work/setup-agent">A compression setup agent</a> collapsed a 3.5-hour expert setup bottleneck to 8 minutes and scaled run volume 3× at constant headcount. <a href="/work/incident-agent">An incident triage agent</a> returned 750+ senior engineering hours a year by diagnosing incidents before they escalated. <a href="/work/platform">The agent platform</a> made context, tools, actions, and evaluation reusable across five enterprise agent systems.']),
        dict(span='2023 to 2025', logo='quantile', alt='Quantile Technologies',
             html=['I was Product Manager for Portfolio Optimization at Quantile. I owned discovery, strategy, launch, and GTM for optimization products used by global banks, and the work generated $XM+ in new and expansion ARR across rates, FX, and cross-currency. That meant 0→1 launches in multilateral compression, valuation/validation, and FX.',
                   'A few of the systems from this stretch: <a href="/work/cross-currency">Multilateral cross-currency compression</a> made $X.XT of previously ineligible bilateral notional available across 12 currency pairs. <a href="/work/valuation">Dual-source valuation</a> surfaced valuation discrepancies 48 hours earlier and cut failed-run resubmissions 91%. <a href="/work/fx-compression">FX forward and NDF compression</a> embedded margin intelligence in the optimizer and hit 100% proposal acceptance across 40+ live runs.']),
        dict(span='2022 to 2023', logo='opengamma', alt='OpenGamma',
             html=['I was a Product Analyst at <a href="https://opengamma.com/">OpenGamma</a>, later acquired by Trading Technologies. I originated and shipped a 0→1 <a href="/work/margin-simulator">pre-trade margin simulator</a> used in front-office workflows. I led discovery across trading, treasury, risk, and operations, with adoption across 20+ enterprise clients. The point was simple: capital should be a decision before you execute, not a surprise after.']),
        dict(span='2021', logo='wells-fargo', alt='Wells Fargo',
             html=['Summer Analyst on the FX / Rates trading desk at Wells Fargo. This is where I learned that in markets, a late failure is not an ops inconvenience. It is the product.']),
        dict(span='2021', logo='wharton', alt='Wharton School',
             html=['Research Assistant at the Wharton School, working on reporting quality and incentives. Useful training for caring about whether a number is actually true before anyone acts on it.']),
        dict(span='Earlier', logo='hartford-funds', alt='Hartford Funds',
             html=['Summer Intern at Hartford Funds on Mutual Funds & ETFs. Early market-structure reps before I moved fully into product.']),
        dict(span='Earlier', logo='ocean-trail', alt='Ocean Trail Partners',
             html=['Private Equity Summer Intern at Ocean Trail Partners. Early diligence reps.']),
        dict(span='2018 to 2022', logo='haverford', alt='Haverford College',
             html=['B.A. in Economics &amp; Linguistics at <a href="https://www.haverford.edu/">Haverford College</a>. GPA 3.9, cum laude, High Honors in Linguistics. I liked the combination: models of behavior on one side, precision about language and meaning on the other. That pairing still shows up in how I design agent boundaries.']),
    ],
    bio_html='John Jayasankar is a Lead Product Manager in New York. He builds production AI agents and 0→1 financial infrastructure for complex, high-stakes workflows. At Quantile (LSEG) he has shipped agents and optimization products used by global banks. Previously he originated a pre-trade margin simulator at OpenGamma. Independently he built and shipped <a href="https://ride-lens2.vercel.app/">RideLens</a>, <a href="https://daylight-app-wine.vercel.app/">Daylight</a>, <a href="https://rail-drop3.vercel.app/">RailDrop</a>, and <a href="https://gridiron-pink-chi.vercel.app/">Gridiron</a>, collected on <a href="https://labs.johnjayasankar.com/">Labs</a>.',
    systems=[('setup-agent', 'Setup Agent', '3.5h setup → 8 minutes'),
             ('incident-agent', 'Incident Agent', '750+ eng hours returned / year'),
             ('cross-currency', 'Cross-Currency', '34% more reduction per run'),
             ('valuation', 'Valuation', '48h earlier discrepancy signal'),
             ('fx-compression', 'FX & NDF', '100% proposal acceptance'),
             ('platform', 'Agent Platform', 'Reusable agent control spine'),
             ('margin-simulator', 'Margin Simulator', 'Pre-trade margin decisions'),
             ('ridelens', 'RideLens', 'Every ride, one comparison'),
             ('daylight', 'Daylight', 'Your screen, through the day'),
             ('raildrop', 'RailDrop', 'Know when your train gets cheaper'),
             ('gridiron', 'Gridiron', 'Every game. Every drive. One view.')],
    build_html='Agents should earn autonomy. I start with the workflow, then give the system only the context, tools, and typed actions it needs, with a human gate on anything consequential. Model capability is one layer. Autonomy grows one rung at a time, on evidence. <a href="/approach">More on the control model</a>.',
    writing_html='Short theses for now. Longer notes land on <a href="https://substack.com/@johnjayasankar">Substack</a>.',
    pets_intro_html='Four independent products with case writeups, all shipped live and collected on <a href="https://labs.johnjayasankar.com/">Labs</a>.',
    pets=[
        dict(slug='ridelens', html='<a href="https://ride-lens2.vercel.app/">RideLens</a> is every ride, one comparison. Live roads. Real rate cards. Uber, Lyft, Empower, and Curb ranked before you book. I built it end-to-end because I was tired of opening four apps and guessing. <a href="/work/ridelens">RideLens case writeup</a>.'),
        dict(slug='daylight', html='<a href="https://daylight-app-wine.vercel.app/">Daylight</a> is adaptive display lighting for macOS: warmth and brightness on a schedule you set, entirely offline, with a printed six-layer precedence ladder and three levels of certainty about whether a change actually took. <a href="/work/daylight">Daylight case writeup</a>.'),
        dict(slug='raildrop', html='<a href="https://rail-drop3.vercel.app/">RailDrop</a> watches Amtrak listed fares across your travel window and emails only when a qualifying option improves. It fails honestly when the source is down and never invents fees, fares, or fake itineraries. <a href="/work/raildrop">RailDrop case writeup</a>.'),
        dict(slug='gridiron', html='<a href="https://gridiron-pink-chi.vercel.app/">Gridiron</a> follows every live NFL and college football game on its own 3D field, with the reported ball spot, win probability, and odds from named sources. It draws only what a provider reported, and says so when something is missing. <a href="/work/gridiron">Gridiron case writeup</a>.'),
    ],
    outcomes=[('setup-agent', 'Quantile · 2025', 'Setup 3.5h → 8m · 3× run volume · 0 AI config errors / 6 mo'),
              ('incident-agent', 'Quantile · 2025', 'Investigation 4.5h → 11m · −78% escalations · domain MCP'),
              ('cross-currency', 'Quantile · 2024', '18 banks · 12 currency pairs · +34% notional reduction / run'),
              ('valuation', 'Quantile · 2024', '48h earlier detection · −91% resubmissions · 24 banks'),
              ('fx-compression', 'Quantile · 2024', '40+ live runs · 100% proposal acceptance · −94% live failures'),
              ('margin-simulator', 'OpenGamma · 2022 to 2023', '0→1 front-office product · adoption across 20+ enterprise clients')],
    misc_html=[
        'The denser version of this site, with interactive systems diagrams, lives on the <a href="/">full site</a> (or press <kbd>F</kbd>).',
        'Independent products live on <a href="https://labs.johnjayasankar.com/">Labs</a>, and on the <a href="/labs">Labs page</a> of the full site.',
        'Short theses on agent economics and control are on the <a href="/writing">Writing page</a>. Longer notes will go to <a href="https://substack.com/@johnjayasankar">Substack</a>.',
        'Based in New York. Best email is under the envelope icon above (press <kbd>E</kbd>, <kbd>Esc</kbd> to hide), or just <a href="mailto:johnjayasankar@gmail.com">johnjayasankar@gmail.com</a>.',
        'Résumé as a PDF: <a href="/John_Jayasankar_Resume.pdf">John_Jayasankar_Resume.pdf</a>.',
        'Shortcuts: <kbd>⌘K</kbd> jump · <kbd>j</kbd> / <kbd>k</kbd> sections · <kbd>Y</kbd> copy section · <kbd>F</kbd> full site · <kbd>E</kbd> email · <kbd>T</kbd> top. Section titles are deep links.',
        'This simple page is intentionally light: one layout, timeline, bio, and links. The full site is allowed to be heavier because the products are.',
    ],
    foot='John Jayasankar · Lead Product Manager · New York',
)

NOT_FOUND = dict(
    kicker='404 · Off-map', h1=('This page is', 'not in the system.'),
    lede='The URL does not match a case, note, or live product. The work is still here, just not at this address.',
    hint='Press ⌘K to jump anywhere',
)
