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
 doc='<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M9.5 13h6M9.5 16.5h6"/>'
 sparkles='<path d="M12 3l1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4z"/><path d="M18.5 13l.8 2.4 2.4.8-2.4.8-.8 2.4-.8-2.4-2.4-.8 2.4-.8z"/>'
 chat='<path d="M4 5h16v11H9l-4 4v-4H4z"/>'
 bot='<rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4.5V8M8.5 13h.01M15.5 13h.01"/><path d="M3 12.5h2M19 12.5h2"/>'
}
function Ico($k){
  if(-not $k){ return '<svg class="mono" viewBox="0 0 24 24" aria-hidden="true">'+$mono['spark']+'</svg>' }
  if($k.StartsWith('mono:')){ $m=$mono[$k.Substring(5)]; if(-not $m){$m=$mono['spark']}; return '<svg class="mono" viewBox="0 0 24 24" aria-hidden="true">'+$m+'</svg>' }
  $d=$lib.$k; if(-not $d){ return '<svg class="mono" viewBox="0 0 24 24" aria-hidden="true">'+$mono['spark']+'</svg>' }
  return '<svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="'+$d+'"/></svg>'
}
$sec = @{
 appdev    = @{name='App Development';   slug='/app-development-sunriver-consulting'}
 business  = @{name='Business Solutions';slug='/business-solutions-sunriver-consulting'}
 compliance= @{name='Compliance Audits'; slug='/compliance-audits-sunriver-consulting'}
 database  = @{name='Database Solutions';slug='/database-solutions-sunriver-consulting'}
 webdev    = @{name='Web Development';    slug='/web-development-sunriver-consulting'}
 ai        = @{name='AI Solutions';       slug='/ai-solutions-sunriver-consulting'}
}
$mark = '<svg viewBox="0 0 64 66" width="26" height="27" aria-hidden="true"><defs><radialGradient id="srSun" cx="36%" cy="32%" r="72%"><stop offset="0%" stop-color="#FBC34A"/><stop offset="82%" stop-color="#8FC740"/></radialGradient><linearGradient id="srWater" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#3E9DB8"/><stop offset="100%" stop-color="#FBC34A"/></linearGradient></defs><circle cx="32" cy="21" r="15" fill="url(#srSun)"/><g fill="url(#srWater)"><rect x="9" y="43" width="46" height="4.8" rx="2.4"/><rect x="16" y="51.5" width="32" height="4.8" rx="2.4" opacity="0.82"/><rect x="22" y="60" width="20" height="4.8" rx="2.4" opacity="0.55"/></g></svg>'
function Btns($arr){ '<div class="srh-hero__ctas" style="justify-content:center;">'+(($arr|%{'<a class="srh-btn '+$_.c+'" href="'+$_.h+'">'+$_.t+'</a>'}) -join '')+'</div>' }

# ---- Tier-1 parent (.srh) with modal-preview cards that link onward ----
function ParentPage($data,$subs){
  $hctas=@(@{t='Get a Quick Estimate';h=$Q;c='srh-btn--primary'},@{t='Schedule a Consultation';h=$S;c='srh-btn--ghost'})
  $ctab=@(@{t='Get a Quick Estimate';h=$Q;c='srh-btn--primary'},@{t='Contact us';h=$C;c='srh-btn--light'})
  $i=0
  $cardsHtml = (@($data.cards)|%{
    $cls='srh-card'
    $prev = $_.d; if($subs -and $subs[$i]){ $prev = $subs[$i].lead }
    $i++
    '        <button class="'+$cls+'" type="button" data-modal data-href="'+$_.h+'"><span class="srh-card__logo">'+(Ico $_.i)+'</span><h3 class="srh-card__title">'+$_.t+'</h3><p class="srh-card__desc">'+$_.d+'</p><span class="srh-card__more">'+$prev+'</span></button>'
  }) -join "`n"
@"
<!--
  templateType: page
  isAvailableForNewContent: true
  label: $($data.label)
  screenshot_path: ../../images/template-previews/home.jpg
-->
{#
  Tier-1 service page (.srh green-gold + smoke). Cards open a preview modal;
  the modal links onward to the deep (.srd) page. Does not touch live Home.
#}
{% extends "../layouts/base.html" %}

{% block body %}
<div class="srh">
  <section class="srh-band">
    <canvas class="srh-band__canvas" data-srx-shader="smoke-veil" aria-hidden="true"></canvas>
    <div class="srh-band__inner srx-reveal" style="text-align:center;max-width:920px;">
      <span class="srh-eyebrow">$($data.ey)</span>
      <h1 class="srh-h1" style="max-width:20ch;margin-inline:auto;">$($data.h1)</h1>
      <p class="srh-lead" style="margin-inline:auto;">$($data.lead)</p>
      $(Btns $hctas)
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
      $(Btns $ctab)
    </div>
  </section>
</div>
{% endblock body %}
"@
}

# ---- Tier-2 deep page (.srd): white sheet on the green + smoke ----
function DeepPage($sp,$moreArr,$s,$headIcon){
  $chips = (@($sp.cards)|%{ '<span class="srd-chip">'+(Ico $_.i)+$_.t+'</span>' }) -join ''
  $n=0
  $acc = (@($sp.cards)|%{
    $body = $_.d; if($moreArr -and $moreArr[$n]){ $body = $moreArr[$n] }
    $n++
    '          <div class="srh-faq__item"><button class="srh-faq__q" type="button">'+$_.t+'</button><div class="srh-faq__a"><div>'+$body+'</div></div></div>'
  }) -join "`n"
  $cols = (@($sp.cards)|%{ '<p>'+$_.d+'</p>' }) -join ''
  $hic = $headIcon; if(-not $hic){ $hic = $sp.cards[0].i }
@"
<!--
  templateType: page
  isAvailableForNewContent: true
  label: $($sp.label)
  screenshot_path: ../../images/template-previews/home.jpg
-->
{#
  Tier-2 deep-dive page (.srd) -- white sheet on the green + smoke (warms to
  ember on scroll). Dropdowns + multi-column detail. Linked from the
  $($s.name) page modal. Does not touch live Home.
#}
{% extends "../layouts/base.html" %}

{% block body %}
<div class="srd">
  <div class="srd__sky" aria-hidden="true"></div>
  <canvas class="srd__canvas" data-srx-shader="smoke-veil" aria-hidden="true"></canvas>
  <div class="srd__wrap">
    <div class="srd-top">
      <a class="srd-brand" href="/">$mark<span>Sun<b>River</b></span></a>
      <a class="srd-back" href="$($s.slug)">&larr; $($s.name)</a>
    </div>
    <div class="srd-sheet srx-reveal">
      <div class="srd-head">
        <span class="srd-head__ic">$(Ico $hic)</span>
        <div><span class="srd-eyebrow">$($sp.ey)</span><h1 class="srd-h1">$($sp.h1)</h1></div>
      </div>
      <p class="srd-lead">$($sp.lead)</p>
      <div class="srd-cta">
        <a class="srh-btn srh-btn--primary" href="$Q">Get a quick estimate &rarr;</a>
        <a class="srh-btn srh-btn--ghost" href="$S">Book a consultation</a>
      </div>
      <div class="srd-stack"><span class="srd-stack__lab">Scope</span>$chips</div>
      <h2 class="srd-sectit">What we focus on</h2>
      <div class="srh-faq">
$acc
      </div>
      <h2 class="srd-sectit">Why it matters</h2>
      <div class="srd-cols">$cols</div>
      <div class="srd-end">
        <h3>$($sp.cta.h)</h3>
        <p>$($sp.cta.p)</p>
        <div class="srd-cta">
          <a class="srh-btn srh-btn--primary" href="$Q">Get a Quick Estimate &rarr;</a>
          <a class="srh-btn srh-btn--ghost" href="$C">Contact us</a>
        </div>
      </div>
    </div>
  </div>
</div>
{% endblock body %}
"@
}

$enc = New-Object System.Text.UTF8Encoding $false
$count=0
Get-ChildItem "$root\_content\*.json" | Where-Object { $_.Name -notlike '*.more.json' } | ForEach-Object {
  $base = $_.BaseName
  $s = $sec[$base]
  $data = Get-Content $_.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
  $mf = $_.FullName -replace '\.json$','.more.json'
  $moredata = $null; if(Test-Path $mf){ $moredata = Get-Content $mf -Raw -Encoding UTF8 | ConvertFrom-Json }
  $subs = @($data.subpages)
  [System.IO.File]::WriteAllText("$pdir\$($data.parent.file)", (ParentPage $data.parent $subs), $enc); $count++
  Write-Output ("TIER1 {0}" -f $data.parent.file)
  $j=0
  foreach($sp in $subs){
    $arr=$null; if($moredata){ $arr = $moredata.($sp.file) }
    $hic=$null; if($data.parent.cards[$j]){ $hic=$data.parent.cards[$j].i }
    [System.IO.File]::WriteAllText("$pdir\$($sp.file)", (DeepPage $sp $arr $s $hic), $enc); $count++
    $j++
    Write-Output ("  TIER2 {0}" -f $sp.file)
  }
}
Write-Output ("DONE: {0} files" -f $count)
