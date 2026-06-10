# SunRiver — FINAL Wiring Guide (anchor architecture, ~20 pages total)

Architecture: tier-2 service pages have MODAL cards; each card's "Learn more"
jumps to that area's single DEEP DIVE page at an #anchor. All 3rd-level nav
items point at deep-dive anchors — no extra pages per sub-service.

Old per-sub-service templates are relabeled "zz OLD (use DEEP DIVE pages)" —
ignore them in the picker.

## A. SWITCH existing pages (page → Settings → Edit template)

| Nav title | URL | Template |
|---|---|---|
| About | /about | SunRiver - About |
| About → News | /news-sunriver-consulting | SunRiver - News |
| About → Our Team | /our-team-sunriver-consulting | SunRiver - Our Team (restyled, same bios) |
| Solutions/Products | /solutions-products-sunriver-consulting | SunRiver - Solutions & Products |
| → App Development | /app-development-sunriver-consulting | SunRiver - App Development |
| → Business Solutions | /business-solutions-sunriver-consulting | SunRiver - Business Solutions |
| → Compliance Audits | /compliance-audits-sunriver-consulting | SunRiver - Compliance Audits |
| → Database Solutions | /database-solutions-sunriver-consulting | SunRiver - Database Solutions |
| → Web Development | /web-development-sunriver-consulting | SunRiver - Web Development |
| Pricing | /pricing | SunRiver - Pricing |
| Pricing → Get a Quote | /quote-sunriver-consulting | SunRiver - Get a Quote (form: click module, pick form) |
| Pricing → Remote Consultation | /schedule-a-consultation-sunriver-consulting | SunRiver - Remote Consultation (click module, pick meeting link) |
| Contact | /contact | SunRiver - Contact (click module, pick form) |

## B. CREATE 7 new pages (create page → template → slug → publish)

| Template | Slug (all end -sunriver-consulting) |
|---|---|
| SunRiver - AI Solutions | /ai-solutions |
| SunRiver - App Development DEEP DIVE | /app-development-deep-dive |
| SunRiver - Business Solutions DEEP DIVE | /business-solutions-deep-dive |
| SunRiver - Compliance Audits DEEP DIVE | /compliance-audits-deep-dive |
| SunRiver - Database Solutions DEEP DIVE | /database-solutions-deep-dive |
| SunRiver - Web Development DEEP DIVE | /web-development-deep-dive |
| SunRiver - AI Solutions DEEP DIVE | /ai-solutions-deep-dive |

(The deep-dive slugs MUST match exactly — the modals link to them.)

## C. Point 3rd-level nav items at deep-dive anchors

App Development children → /app-development-deep-dive-sunriver-consulting + :
  #android · #apple-ios · #desktop-app · #web-app
Business Solutions children → /business-solutions-deep-dive-sunriver-consulting + :
  #aws-integration · #cascade-cms · #ci-cd · #google-analytics-4 · #hubspot-cms ·
  #hubspot-crm · #microsoft-365 · #salesforce-crm · #servicenow-itms
Compliance Audits children → /compliance-audits-deep-dive-sunriver-consulting + :
  #penetration-testing · #threat-modeling · #wcag · #508-compliance
Database Solutions children → /database-solutions-deep-dive-sunriver-consulting + :
  #database-administration · #database-analysis · #database-development · #database-design
Web Development children → /web-development-deep-dive-sunriver-consulting + :
  #custom-website · #hubspot-website · #squarespace · #wordpress
AI Solutions children (optional new nav) → /ai-solutions-deep-dive-sunriver-consulting + :
  #ai-strategy · #ai-assistants · #ai-automation · #ai-training · #ai-private · #ai-governance

Also add nav item: AI Solutions → /ai-solutions-sunriver-consulting (under Solutions/Products).

## D. Home (last, carefully)
CLONE the live Home → set the clone to "SunRiver - Home (brand + smoke)" →
preview → publish the clone. Never edit the original.

## E. Reminders
- Quote page + Contact page: click the form module, choose your HubSpot form.
- Remote Consultation: click the meetings module, choose your meeting link.
- Pricing: drop your two founder photos into the photo slots.
- Page math: 13 existing + 7 new = 20 pages. Under the 30 limit with room to grow.
