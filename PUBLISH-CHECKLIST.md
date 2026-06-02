# SunRiver — Publish Checklist

All 46 templates live in HubSpot **Design Manager → `Atomic_Lite child/templates/pages/`**.
Publishing = create/switch pages in **Website → Pages**, then point the nav.
Do it in this order so internal links never 404.

> The deepest items' "Learn more" buttons and the parent cards link to the
> NEW slugs below. Create those pages FIRST, then switch the parents.

---

## ⚠️ Read first
- **Home:** `Home-Brand.html` is a COPY. Do NOT overwrite your live Home. If you
  want it, **clone** your live Home page, then set the clone's template to it.
- **Contact form** is a styled demo (shows a thank-you, doesn't capture leads).
  Swap in your HubSpot form module before relying on it (or ask me to wire it).
- **Pricing** is the live-estimator version. The full personable version
  (founder note + your photos + comparison) is still pending your inputs.
- **About / News / Our Team** are basic versions — you said you want a different
  style for those, so hold them if you like.

---

## STEP 1 — Create the NEW deep pages (these slugs don't exist yet)
For each: Website → Pages → **Create page** → pick the template → set the **slug** → Publish.
(All slugs end with `-sunriver-consulting`.)

### AI Solutions (brand-new section)
| Template | Slug |
|---|---|
| AISolutions-Brand | /ai-solutions |
| AIStrategy-Brand | /ai-strategy |
| AIAssistants-Brand | /ai-assistants |
| AIAutomation-Brand | /ai-automation |
| AITraining-Brand | /ai-training |
| AIPrivate-Brand | /ai-private |
| AIGovernance-Brand | /ai-governance |

### App Development
| Android-Brand | /android |
| AppleIOS-Brand | /apple-ios |
| DesktopApp-Brand | /desktop-app |
| WebApp-Brand | /web-app |

### Business Solutions
| AWSIntegration-Brand | /aws-integration |
| CascadeCMS-Brand | /cascade-cms |
| CICD-Brand | /ci-cd |
| GoogleAnalytics4-Brand | /google-analytics-4 |
| HubSpotCMS-Brand | /hubspot-cms |
| HubSpotCRM-Brand | /hubspot-crm |
| Microsoft365-Brand | /microsoft-365 |
| SalesforceCRM-Brand | /salesforce-crm |
| ServiceNowITMS-Brand | /servicenow-itms |

### Compliance Audits
| PenetrationTesting-Brand | /penetration-testing |
| ThreatModeling-Brand | /threat-modeling |
| WCAG-Brand | /wcag |
| Section508-Brand | /508-compliance |

### Database Solutions
| DatabaseAdministration-Brand | /database-administration |
| DatabaseAnalysis-Brand | /database-analysis |
| DatabaseDevelopment-Brand | /database-development |
| DatabaseDesign-Brand | /database-design |

### Web Development
| CustomWebsite-Brand | /custom-website |
| HubSpotWebsite-Brand | /hubspot-website |
| Squarespace-Brand | /squarespace |
| WordPress-Brand | /wordpress |

---

## STEP 2 — Switch your EXISTING pages to the new template
These pages already exist at their slugs — just edit each page and change its
**template** to the `SunRiver - …` one (no slug change needed):

| Existing page | Template |
|---|---|
| /about | About-Brand |
| /news-sunriver-consulting | News-Brand |
| /our-team-sunriver-consulting | Team-Brand |
| /solutions-products-sunriver-consulting | SolutionsProducts-Brand |
| /app-development-sunriver-consulting | AppDevelopment-Brand |
| /business-solutions-sunriver-consulting | BusinessSolutions-Brand |
| /compliance-audits-sunriver-consulting | ComplianceAudits-Brand |
| /database-solutions-sunriver-consulting | DatabaseSolutions-Brand |
| /web-development-sunriver-consulting | WebDevelopment-Brand |
| /pricing | Pricing-Brand |
| /quote-sunriver-consulting | Quote-Brand |
| /schedule-a-consultation-sunriver-consulting | ScheduleConsultation-Brand |
| /contact | Contact-Brand |

---

## STEP 3 — Wire the navigation
Settings → Navigation (or the menu in the theme):
- Add **AI Solutions** under Solutions/Products → `/ai-solutions-sunriver-consulting`.
- Re-point the deepest items (Android, AWS Integration, Penetration Testing, …)
  from their parent page to their new slug above.

## STEP 4 — Home (optional, careful)
Only if you want the new home: **clone** the live Home page, set the clone to
`Home-Brand`, preview, and publish the clone — don't edit the original.
