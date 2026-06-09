$ErrorActionPreference='Stop'
$root='C:\Users\maxca\Documents\workspace\hubspot-SunRiverConsulting'
$pdir="$root\theme\templates\pages"
$Q='/quote-sunriver-consulting'; $S='/schedule-a-consultation-sunriver-consulting'; $C='/contact'
$HERO='../../modules/SR - Hero Spotlight'; $CARDS='../../modules/SR - Service Cards'; $CTA='../../modules/SR - CTA Banner'
$enc = New-Object System.Text.UTF8Encoding $false

function UrlObj($h){ '{ "type": "EXTERNAL", "href": "' + $h + '", "content_id": null }' }
function CardJson($arr){
  $items = $arr | ForEach-Object {
    '        { "icon_text": "' + $_.i + '", "title": "' + ($_.t -replace '"','') + '", "description": "<p>' + $_.d + '</p>", "link_text": "Learn more", "card_link": ' + (UrlObj $_.h) + ' }'
  }
  ($items -join ",`n")
}
# $p: file,label, hero@{ey,h1,lead}, hctas(2)@{t,h}, cey,ch, cards[@{i,t,d,h}], cta@{h,p,t,href}
function Dnd($p){
  $h1c=$p.hctas[0]; $h2c=$p.hctas[1]
@"
<!--
  templateType: page
  isAvailableForNewContent: true
  label: $($p.label)
  screenshot_path: ../../images/template-previews/home.jpg
-->
{#
  Editable (drag-and-drop) version, built from SR-* widget modules. Selectable
  on an existing page and fully editable in the CMS. Same .srh look (child.css).
#}
{% extends "../layouts/base.html" %}

{% block body %}
{% dnd_area "main_content" label="Page content" %}

  {% dnd_section padding={ 'top': 0, 'bottom': 0, 'left': 0, 'right': 0 } %}
    {% dnd_module
      path="$HERO",
      eyebrow="$($p.hero.ey)",
      heading="$($p.hero.h1)",
      subheading="<p>$($p.hero.lead)</p>",
      primary_cta_text="$($h1c.t)",
      primary_cta_url=$(UrlObj $h1c.h),
      secondary_cta_text="$($h2c.t)",
      secondary_cta_url=$(UrlObj $h2c.h)
    %}{% end_dnd_module %}
  {% end_dnd_section %}

  {% dnd_section padding={ 'top': 0, 'bottom': 0, 'left': 0, 'right': 0 } %}
    {% dnd_module path="$CARDS", section_eyebrow="$($p.cey)", section_heading="$($p.ch)" %}
      {% module_attribute "columns" %}3{% end_module_attribute %}
      {% module_attribute "cards" is_json=True %}
      [
$(CardJson $p.cards)
      ]
      {% end_module_attribute %}
    {% end_dnd_module %}
  {% end_dnd_section %}

  {% dnd_section padding={ 'top': 0, 'bottom': 0, 'left': 0, 'right': 0 } %}
    {% dnd_module
      path="$CTA",
      heading="$($p.cta.h)",
      subheading="$($p.cta.p)",
      cta_text="$($p.cta.t)",
      cta_url=$(UrlObj $p.cta.href)
    %}{% end_dnd_module %}
  {% end_dnd_section %}

{% end_dnd_area %}
{% endblock body %}
"@
}

$defH = @(@{t='Get a Quick Estimate';h=$Q},@{t='Schedule a Consultation';h=$S})
$defCta = @{h='Ready to grow with confidence?';p='Tell us where you want to go and we will show you the road.';t='Schedule a Consultation';href=$S}
$count=0

# ---- service tree + AI from _content JSON ----
Get-ChildItem "$root\_content\*.json" | Where-Object { $_.Name -notlike '*.more.json' } | ForEach-Object {
  $data = Get-Content $_.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  # parent
  $pcards = @($data.parent.cards) | ForEach-Object { @{ i=$_.i; t=$_.t; d=$_.d; h=$_.h } }
  $pfile = $data.parent.file -replace '-Brand\.html$','-DnD.html'
  $p = @{ file=$pfile; label=($data.parent.label + ' (editable)'); hero=@{ey=$data.parent.ey;h1=$data.parent.h1;lead=$data.parent.lead}; hctas=$defH; cey='Explore'; ch='What we do.'; cards=$pcards; cta=@{h=$data.parent.cta.h;p=$data.parent.cta.p;t='Get a Quick Estimate';href=$Q} }
  [System.IO.File]::WriteAllText("$pdir\$pfile", (Dnd $p), $enc); $count++
  foreach($sp in @($data.subpages)){
    $scards = @($sp.cards) | ForEach-Object { @{ i=$_.i; t=$_.t; d=$_.d; h=$Q } }
    $sfile = $sp.file -replace '-Brand\.html$','-DnD.html'
    $dp = @{ file=$sfile; label=($sp.label + ' (editable)'); hero=@{ey=$sp.ey;h1=$sp.h1;lead=$sp.lead}; hctas=$defH; cey='In scope'; ch='What we focus on.'; cards=$scards; cta=@{h=$sp.cta.h;p=$sp.cta.p;t='Get a Quick Estimate';href=$Q} }
    [System.IO.File]::WriteAllText("$pdir\$sfile", (Dnd $dp), $enc); $count++
  }
}

# ---- bespoke pages (inline specs) ----
$bespoke = @(
 @{ file='SolutionsProducts-DnD.html'; label='SunRiver - Solutions & Products (editable)'; hero=@{ey='Solutions &amp; Products';h1='Everything you need, under one roof.';lead='Six service areas, one senior team &mdash; pick where you want to grow.'}; hctas=$defH; cey='Explore'; ch='Our services.';
   cards=@(
    @{i='apple';t='App Development';d='Native, cross-platform, and web apps.';h='/app-development-sunriver-consulting'}
    @{i='amazonaws';t='Business Solutions';d='AWS, Microsoft 365, Salesforce, HubSpot, ServiceNow.';h='/business-solutions-sunriver-consulting'}
    @{i='mono:lock';t='Compliance Audits';d='Pen testing, threat modeling, WCAG and 508.';h='/compliance-audits-sunriver-consulting'}
    @{i='postgresql';t='Database Solutions';d='SQL and NoSQL administration, design, development.';h='/database-solutions-sunriver-consulting'}
    @{i='wordpress';t='Web Development';d='Custom, HubSpot, WordPress, Squarespace.';h='/web-development-sunriver-consulting'}
    @{i='mono:sparkles';t='AI Solutions';d='Practical AI adoption, assistants, and training &mdash; no hype.';h='/ai-solutions-sunriver-consulting'});
   cta=@{h='Ready to scope it?';p='Get a fixed-fee estimate, fast.';t='Get a Quick Estimate';href=$Q} }
 @{ file='About-DnD.html'; label='SunRiver - About (editable)'; hero=@{ey='About';h1='Senior people, doing senior work.';lead='Based in Helena, Montana &mdash; championing successful tech adoption so no one gets left behind.'}; hctas=@(@{t='Meet the team';h='/our-team-sunriver-consulting'},@{t='Contact us';h=$C}); cey='How we work'; ch='Four promises we keep.';
   cards=@(
    @{i='mono:wrench';t='Senior-only';d='The person who scopes your project is the person who builds it.';h=$C}
    @{i='mono:gauge';t='Fixed-fee';d='A written scope and a number before we start.';h=$Q}
    @{i='mono:shield';t='Accessible &amp; secure';d='WCAG, 508, and security built in from day one.';h='/compliance-audits-sunriver-consulting'}
    @{i='mono:compass';t='Yours to keep';d='Documentation and code your team can actually extend.';h=$C}
    @{i='mono:globe';t='Montana-based';d='Local roots in Helena, serving teams nationwide.';h=$C}
    @{i='mono:sparkles';t='Fair pricing';d='A fraction of what the big logos charge.';h='/pricing'});
   cta=@{h='Want the full story?';p='We would love to tell you how we work.';t='Schedule a Consultation';href=$S} }
 @{ file='News-DnD.html'; label='SunRiver - News (editable)'; hero=@{ey='Newsroom';h1='What is new at SunRiver.';lead='Product notes, security advisories, and the occasional Montana sunrise.'}; hctas=@(@{t='Contact us';h=$C},@{t='Schedule a Consultation';h=$S}); cey='From the team'; ch='What we write about.';
   cards=@(
    @{i='mono:sparkles';t='Product';d='Feature releases and platform improvements.';h=$C}
    @{i='mono:shield';t='Security';d='Advisories, hardening notes, and compliance updates.';h='/compliance-audits-sunriver-consulting'}
    @{i='mono:doc';t='Guides';d='Practical how-tos for the tools we implement.';h=$C}
    @{i='mono:users';t='Company';d='Team news from our Helena, Montana home base.';h='/our-team-sunriver-consulting'}
    @{i='mono:chart';t='Case notes';d='What we learned shipping real client work.';h=$C}
    @{i='mono:calendar';t='Events';d='Where to find us and what we are speaking about.';h=$C});
   cta=@{h='Want updates?';p='Reach out and we will keep you posted.';t='Contact us';href=$C} }
 @{ file='Team-DnD.html'; label='SunRiver - Our Team (editable)'; hero=@{ey='Our Team';h1='One senior team, many disciplines.';lead='No hand-offs between strangers. The people who scope your work are the people who build it.'}; hctas=@(@{t='Work with us';h=$C},@{t='Schedule a Consultation';h=$S}); cey='Under one roof'; ch='Disciplines we cover.';
   cards=@(
    @{i='mono:wrench';t='Engineering';d='Senior software engineers across web, mobile, and cloud.';h='/app-development-sunriver-consulting'}
    @{i='mono:sparkles';t='Design';d='Product and brand design, accessible by default.';h='/web-development-sunriver-consulting'}
    @{i='mono:shield';t='Security';d='Penetration testing, threat modeling, and compliance.';h='/compliance-audits-sunriver-consulting'}
    @{i='mono:database';t='Data';d='Database design, administration, and analytics.';h='/database-solutions-sunriver-consulting'}
    @{i='amazonaws';t='Cloud &amp; Ops';d='AWS and Azure provisioning, CI/CD, and monitoring.';h='/business-solutions-sunriver-consulting'}
    @{i='mono:users';t='Delivery';d='One accountable team from kickoff to hand-off.';h=$C});
   cta=@{h='Like how we work?';p='Tell us what you are building.';t='Schedule a Consultation';href=$S} }
 @{ file='Quote-DnD.html'; label='SunRiver - Get a Quote (editable)'; hero=@{ey='Get a Quote';h1='A fixed price, fast.';lead='Tell us what you are trying to do. We will scope it and send a number &mdash; usually within a few days.'}; hctas=@(@{t='Start your estimate';h=$C},@{t='Schedule a Consultation';h=$S}); cey='Process'; ch='How it works.';
   cards=@(
    @{i='mono:doc';t='1 / Tell us';d='Share your goal, constraints, and timeline.';h=$C}
    @{i='mono:gauge';t='2 / We scope';d='We map the work and the risks &mdash; no fluff.';h=$C}
    @{i='mono:sparkles';t='3 / Fixed price';d='You get a clear scope and a number to approve.';h=$C});
   cta=@{h='Ready?';p='Send us the details and we will get to work.';t='Contact us';href=$C} }
 @{ file='ScheduleConsultation-DnD.html'; label='SunRiver - Remote Consultation (editable)'; hero=@{ey='Remote Consultation';h1='Talk to a real engineer.';lead='Book a remote consultation &mdash; no sales script, just a senior engineer and your questions.'}; hctas=@(@{t='Schedule now';h=$S},@{t='Contact us';h=$C}); cey='What to expect'; ch='Thirty focused minutes.';
   cards=@(
    @{i='mono:calendar';t='Pick a time';d='Grab a slot that works for you.';h=$S}
    @{i='mono:users';t='Meet the team';d='Talk to the people who would do the work.';h='/our-team-sunriver-consulting'}
    @{i='mono:compass';t='Leave with a plan';d='Walk away with clear next steps, free.';h=$S});
   cta=@{h='Got 30 minutes?';p='Let us point you in the right direction.';t='Schedule a Consultation';href=$S} }
 @{ file='Pricing-DnD.html'; label='SunRiver - Pricing (editable)'; hero=@{ey='Pricing';h1='Know the number before we start.';lead='Honest, local, and a fraction of agency rates &mdash; fixed fees with no surprise invoices.'}; hctas=$defH; cey='Engagements'; ch='Three ways to work with us.';
   cards=@(
    @{i='mono:sparkles';t='Project &mdash; from $2,500';d='A fixed scope and a fixed price. Best for a defined build.';h=$Q}
    @{i='mono:gauge';t='Retainer &mdash; from $250/mo';d='A monthly block of senior time for ongoing work.';h=$Q}
    @{i='mono:lock';t='Audit &mdash; from $1,200';d='A one-time assessment with a clear action plan.';h='/compliance-audits-sunriver-consulting'});
   cta=@{h='Want a real number?';p='Tell us the goal and we will send a fixed-fee quote.';t='Get a Quick Estimate';href=$Q} }
)
foreach($b in $bespoke){ [System.IO.File]::WriteAllText("$pdir\$($b.file)", (Dnd $b), $enc); $count++; Write-Output ("  bespoke {0}" -f $b.file) }

Write-Output ("DONE: {0} DnD templates" -f $count)
