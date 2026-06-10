$ErrorActionPreference='Stop'
$root='C:\Users\maxca\Documents\workspace\hubspot-SunRiverConsulting'
$pdir="$root\theme\templates\pages"
$lib = Get-Content "$root\_icons.json" -Raw -Encoding UTF8 | ConvertFrom-Json
$Q='/quote-sunriver-consulting'; $S='/schedule-a-consultation-sunriver-consulting'; $C='/contact'
$mono = @{
 shield='<path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z"/><path d="M9 12l2 2 4-4.5"/>'
 globe='<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z"/>'
 monitor='<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>'
 database='<ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-13"/><path d="M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3"/>'
 gauge='<path d="M5 18a8 8 0 1 1 14 0"/><path d="M12 12l3.6-2.4"/><circle cx="12" cy="12" r="1.3"/>'
 lock='<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
 wrench='<path d="M15 7a4 4 0 0 1-5.2 4.8L5 16.6 7.4 19l4.8-4.8A4 4 0 0 0 17 9l-2.2 2.2-2-2L15 7z"/>'
 compass='<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2z"/>'
 chart='<path d="M4 20V10M10 20V4M16 20v-7"/><path d="M2 20h20"/>'
 phone='<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><line x1="10.5" y1="18.5" x2="13.5" y2="18.5"/>'
 calendar='<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3"/>'
 pin='<path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
 users='<circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 7.5a3 3 0 0 1 0 5.8"/><path d="M20.5 19a5.5 5.5 0 0 0-3-4.9"/>'
 spark='<path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/>'
 sparkles='<path d="M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4z"/><path d="M18.5 13l.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8z"/>'
 layers='<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 12l9 5 9-5"/>'
 doc='<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9.5 13h6M9.5 16.5h6"/>'
 bot='<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4.5V8M8.5 13h.01M15.5 13h.01"/><path d="M3 12.5h2M19 12.5h2"/>'
 chat='<path d="M4 5h16v11H9l-4 4v-4H4z"/>'
}
function Ico($k,$cls){
  if(-not $cls){$cls=''}
  if(-not $k){ return '<svg class="mono'+$cls+'" viewBox="0 0 24 24" aria-hidden="true">'+$mono['spark']+'</svg>' }
  if($k.StartsWith('mono:')){ $m=$mono[$k.Substring(5)]; if(-not $m){$m=$mono['spark']}; return '<svg class="mono'+$cls+'" viewBox="0 0 24 24" aria-hidden="true">'+$m+'</svg>' }
  $d=$lib.$k; if(-not $d){ return '<svg class="mono'+$cls+'" viewBox="0 0 24 24" aria-hidden="true">'+$mono['spark']+'</svg>' }
  return '<svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="'+$d+'"/></svg>'
}
function Anchor($href){ ($href -replace '^/','') -replace '-sunriver-consulting$','' }
$mark = '<svg viewBox="0 0 64 66" width="26" height="27" aria-hidden="true"><defs><radialGradient id="srSun" cx="36%" cy="32%" r="72%"><stop offset="0%" stop-color="#FBC34A"/><stop offset="82%" stop-color="#8FC740"/></radialGradient><linearGradient id="srWater" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#3E9DB8"/><stop offset="100%" stop-color="#FBC34A"/></linearGradient></defs><circle cx="32" cy="21" r="15" fill="url(#srSun)"/><g fill="url(#srWater)"><rect x="9" y="43" width="46" height="4.8" rx="2.4"/><rect x="16" y="51.5" width="32" height="4.8" rx="2.4" opacity="0.82"/><rect x="22" y="60" width="20" height="4.8" rx="2.4" opacity="0.55"/></g></svg>'

$sec = @{
 appdev    = @{name='App Development';    t2='/app-development-sunriver-consulting';    deep='/app-development-deep-dive-sunriver-consulting';    t2file='AppDevelopment-Brand.html';    deepfile='AppDevelopment-DeepDive-Brand.html';    deeplabel='SunRiver - App Development DEEP DIVE' }
 business  = @{name='Business Solutions'; t2='/business-solutions-sunriver-consulting'; deep='/business-solutions-deep-dive-sunriver-consulting'; t2file='BusinessSolutions-Brand.html'; deepfile='BusinessSolutions-DeepDive-Brand.html'; deeplabel='SunRiver - Business Solutions DEEP DIVE' }
 compliance= @{name='Compliance Audits';  t2='/compliance-audits-sunriver-consulting';  deep='/compliance-audits-deep-dive-sunriver-consulting';  t2file='ComplianceAudits-Brand.html';  deepfile='ComplianceAudits-DeepDive-Brand.html';  deeplabel='SunRiver - Compliance Audits DEEP DIVE' }
 database  = @{name='Database Solutions'; t2='/database-solutions-sunriver-consulting'; deep='/database-solutions-deep-dive-sunriver-consulting'; t2file='DatabaseSolutions-Brand.html'; deepfile='DatabaseSolutions-DeepDive-Brand.html'; deeplabel='SunRiver - Database Solutions DEEP DIVE' }
 webdev    = @{name='Web Development';    t2='/web-development-sunriver-consulting';    deep='/web-development-deep-dive-sunriver-consulting';    t2file='WebDevelopment-Brand.html';    deepfile='WebDevelopment-DeepDive-Brand.html';    deeplabel='SunRiver - Web Development DEEP DIVE' }
 ai        = @{name='AI Solutions';       t2='/ai-solutions-sunriver-consulting';       deep='/ai-solutions-deep-dive-sunriver-consulting';       t2file='AISolutions-Brand.html';       deepfile='AISolutions-DeepDive-Brand.html';       deeplabel='SunRiver - AI Solutions DEEP DIVE' }
}

# ---- Tier-2: hero + MODAL cards (Learn more -> deep#anchor) + CTA ----
function Tier2($data,$subs,$area){
  $i=0
  $cardsHtml = (@($data.cards)|%{
    $anchor = Anchor $_.h
    $sub = $null; if($subs -and $subs[$i]){ $sub = $subs[$i] }
    $prev = $_.d; if($sub){ $prev = $sub.lead }
    $lis = ''; if($sub){ $lis = (@($sub.cards)|%{ '<li>'+$_.t+'</li>' }) -join '' }
    $moreHtml = '<p>'+$prev+'</p>'
    if($lis){ $moreHtml += '<div class="srh-modal__cap2">What&rsquo;s inside</div><ul class="srh-modal__list">'+$lis+'</ul>' }
    $i++
    '        <button class="srh-card" type="button" data-modal data-href="'+$area.deep+'#'+$anchor+'"><span class="srh-card__logo">'+(Ico $_.i)+'</span><h3 class="srh-card__title">'+$_.t+'</h3><p class="srh-card__desc">'+$_.d+'</p><span class="srh-card__more">'+$moreHtml+'</span></button>'
  }) -join "`n"
@"
<!--
  templateType: page
  isAvailableForNewContent: true
  label: SunRiver - $($area.name)
  screenshot_path: ../../images/template-previews/home.jpg
-->
{# Tier-2 service page. Cards open a preview modal; Learn more jumps to the
   $($area.name) DEEP DIVE page at that item's anchor. Does not touch live Home. #}
{% extends "../layouts/base.html" %}

{% block body %}
<div class="srh">
  <section class="srh-band">
    <canvas class="srh-band__canvas" data-srx-shader="smoke-veil" aria-hidden="true"></canvas>
    <div class="srh-band__inner srx-reveal" style="text-align:center;max-width:920px;">
      <span class="srh-eyebrow">$($data.ey)</span>
      <h1 class="srh-h1" style="max-width:20ch;margin-inline:auto;">$($data.h1)</h1>
      <p class="srh-lead" style="margin-inline:auto;">$($data.lead)</p>
      <div class="srh-hero__ctas" style="justify-content:center;"><a class="srh-btn srh-btn--primary" href="$Q">Get a Quick Estimate</a><a class="srh-btn srh-btn--ghost" href="$S">Schedule a Consultation</a></div>
    </div>
  </section>
  <section class="srh-sec">
    <div class="srh-sec__inner">
      <div class="srx-reveal" style="text-align:center;max-width:720px;margin:0 auto;">
        <span class="srh-eyebrow" style="color:var(--river);">Explore</span>
        <h2 class="srh-h2">What we do.</h2>
        <p class="srh-lead" style="margin-inline:auto;">Tap any card for a quick look &mdash; then dive into the full detail.</p>
      </div>
      <div class="srh-cards" style="margin-top:2.4rem;">
$cardsHtml
      </div>
    </div>
  </section>
  <section class="srh-band srh-band--rev srh-cta">
    <canvas class="srh-band__canvas" data-srx-shader="smoke-veil" aria-hidden="true"></canvas>
    <div class="srh-band__inner srx-reveal" style="text-align:center;">
      <h2 class="srh-h2">$($data.cta.h)</h2>
      <p class="srh-lead" style="margin-inline:auto;">$($data.cta.p)</p>
      <div class="srh-hero__ctas" style="justify-content:center;"><a class="srh-btn srh-btn--primary" href="$Q">Get a Quick Estimate</a><a class="srh-btn srh-btn--light" href="$C">Contact us</a></div>
    </div>
  </section>
</div>
  {% dnd_area "flex" label="Optional extra content" %}{% end_dnd_area %}
{% endblock body %}
"@
}

# ---- Deep dive: ALL of an area's tier-3 sheets on ONE page, anchored ----
function Deep($data,$moredata,$area){
  $j=0
  $sheets = (@($data.subpages)|%{
    $sp = $_
    $pcard = $data.parent.cards[$j]
    $anchor = Anchor $pcard.h
    $hic = $pcard.i
    $arr = $null; if($moredata){ $arr = $moredata.($sp.file) }
    $chips = (@($sp.cards)|%{ '<span class="srd-chip">'+(Ico $_.i)+$_.t+'</span>' }) -join ''
    $n=0
    $acc = (@($sp.cards)|%{
      $body = $_.d; if($arr -and $arr[$n]){ $body = $arr[$n] }
      $n++
      '        <div class="srh-faq__item"><button class="srh-faq__q" type="button">'+$_.t+'</button><div class="srh-faq__a"><div>'+$body+'</div></div></div>'
    }) -join "`n"
    $j++
@"

    <div class="srd-sheet srd-collapse srx-reveal" id="$anchor">
      <button class="srd-head srd-collapse__head" type="button" aria-expanded="false">
        <span class="srd-head__ic">$(Ico $hic)</span>
        <div><span class="srd-eyebrow">$($sp.ey)</span><h2 class="srd-h1">$($sp.h1)</h2></div>
        <span class="srd-collapse__chev" aria-hidden="true">+</span>
      </button>
      <div class="srd-sheet__body">
        <p class="srd-lead">$($sp.lead)</p>
        <div class="srd-stack"><span class="srd-stack__lab">Scope</span>$chips</div>
        <h3 class="srd-sectit">What we focus on</h3>
        <div class="srh-faq">
$acc
        </div>
        <div class="srd-cta" style="margin-top:24px;">
          <a class="srh-btn srh-btn--primary" href="$Q">Get a quick estimate &rarr;</a>
          <a class="srh-btn srh-btn--ghost" href="$S">Book a consultation</a>
        </div>
      </div>
    </div>
"@
  }) -join "`n"
@"
<!--
  templateType: page
  isAvailableForNewContent: true
  label: $($area.deeplabel)
  screenshot_path: ../../images/template-previews/home.jpg
-->
{# ONE deep-dive page for ALL $($area.name) sub-services (anchored sheets).
   Linked from the $($area.name) page modals and the 3rd-level nav items
   (e.g. $($area.deep)#<anchor>). Does not touch live Home. #}
{% extends "../layouts/base.html" %}

{% block body %}
<div class="srd">
  <div class="srd__sky" aria-hidden="true"></div>
  <canvas class="srd__canvas" data-srx-shader="smoke-veil" aria-hidden="true"></canvas>
  <div class="srd__wrap">
    <div class="srd-top">
      <a class="srd-brand" href="/">$mark<span>Sun<b>River</b></span></a>
      <a class="srd-back" href="$($area.t2)">&larr; $($area.name)</a>
    </div>
$sheets

    <div class="srd-sheet srx-reveal">
      <div class="srd-end" style="margin-top:0;">
        <h3>$($data.parent.cta.h)</h3>
        <p>$($data.parent.cta.p)</p>
        <div class="srd-cta" style="justify-content:center;">
          <a class="srh-btn srh-btn--primary" href="$Q">Get a Quick Estimate &rarr;</a>
          <a class="srh-btn srh-btn--ghost" href="$C">Contact us</a>
        </div>
      </div>
    </div>
  </div>
</div>
  {% dnd_area "flex" label="Optional extra content" %}{% end_dnd_area %}
{% endblock body %}
"@
}

$enc = New-Object System.Text.UTF8Encoding $false
$count=0
Get-ChildItem "$root\_content\*.json" | Where-Object { $_.Name -notlike '*.more.json' } | ForEach-Object {
  $base = $_.BaseName
  $s2 = $sec[$base]
  $data = Get-Content $_.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  $mf = $_.FullName -replace '\.json$','.more.json'
  $moredata = $null; if(Test-Path $mf){ $moredata = Get-Content $mf -Raw -Encoding UTF8 | ConvertFrom-Json }
  $subs = @($data.subpages)
  [System.IO.File]::WriteAllText("$pdir\$($s2.t2file)", (Tier2 $data.parent $subs $s2), $enc); $count++
  [System.IO.File]::WriteAllText("$pdir\$($s2.deepfile)", (Deep $data $moredata $s2), $enc); $count++
  Write-Output ("{0}: tier2 + deep written" -f $s2.name)
}
Write-Output ("DONE: {0} templates" -f $count)
