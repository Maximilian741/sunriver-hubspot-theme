# SunRiver — FINAL Wiring Guide (nav item → template)

Design: blue brand bands + ember CTAs + interactive smoke; deep pages warm
blue → ember on scroll. Every template exists in TWO flavors:
- **`SunRiver - X`** — the exact 1:1 designed page (switchable; content edits = code)
- **`SunRiver - X (editable)`** — same look, built from SR widgets; drag-and-drop
  editable in the CMS (hero text, cards, icons, CTA)

Pick ONE flavor per page (1:1 for max polish, editable for self-service).
Both switch onto existing pages with no error.

## A. Existing pages — just switch the template (Settings → Template)

| Nav item | Existing URL | Template (1:1) | Or editable |
|---|---|---|---|
| About | /about | SunRiver - About | SunRiver - About (editable) |
| About → News | /news-sunriver-consulting | SunRiver - News | SunRiver - News (editable) |
| About → Our Team | /our-team-sunriver-consulting | SunRiver - Our Team | SunRiver - Our Team (editable) |
| Solutions/Products | /solutions-products-sunriver-consulting | SunRiver - Solutions & Products | … (editable) |
| → App Development | /app-development-sunriver-consulting | SunRiver - App Development | … (editable) |
| → Business Solutions | /business-solutions-sunriver-consulting | SunRiver - Business Solutions | … (editable) |
| → Compliance Audits | /compliance-audits-sunriver-consulting | SunRiver - Compliance Audits | … (editable) |
| → Database Solutions | /database-solutions-sunriver-consulting | SunRiver - Database Solutions | … (editable) |
| → Web Development | /web-development-sunriver-consulting | SunRiver - Web Development | … (editable) |
| Pricing | /pricing | SunRiver - Pricing (estimator+founder) | SunRiver - Pricing (editable) |
| Pricing → Get a Quote | /quote-sunriver-consulting | SunRiver - Get a Quote | … (editable) |
| Pricing → Remote Consultation | /schedule-a-consultation-sunriver-consulting | SunRiver - Remote Consultation | … (editable) |
| Contact | /contact | SunRiver - Contact (real form module) | — |

## B. NEW pages — create page → pick template → set slug → publish
(Deepest nav items currently link to their parent URL; after creating, repoint
the nav item to the new slug. All slugs end `-sunriver-consulting`.)

### App Development children
| Nav item | Template | New slug |
|---|---|---|
| Android | SunRiver - Android Apps | /android |
| Apple/iOS | SunRiver - iOS & iPadOS Apps | /apple-ios |
| Desktop App | SunRiver - Desktop Apps | /desktop-app |
| Web App | SunRiver - Web Apps (PWA) | /web-app |

### Business Solutions children
| AWS Integration | SunRiver - AWS Integration | /aws-integration |
| Cascade CMS | SunRiver - Cascade CMS | /cascade-cms |
| CI/CD | SunRiver - CI/CD Pipelines | /ci-cd |
| Google Analytics 4 | SunRiver - Google Analytics 4 | /google-analytics-4 |
| HubSpot CMS | SunRiver - HubSpot CMS | /hubspot-cms |
| HubSpot CRM | SunRiver - HubSpot CRM | /hubspot-crm |
| Microsoft 365 | SunRiver - Microsoft 365 | /microsoft-365 |
| Salesforce CRM | SunRiver - Salesforce CRM | /salesforce-crm |
| ServiceNow ITMS | SunRiver - ServiceNow ITSM | /servicenow-itms |

### Compliance Audits children
| Penetration Testing | SunRiver - Penetration Testing | /penetration-testing |
| Threat Modeling | SunRiver - Threat Modeling | /threat-modeling |
| WCAG 2.0–2.2 | SunRiver - WCAG 2.2 Audits | /wcag |
| 508 Compliance | SunRiver - Section 508 Compliance | /508-compliance |

### Database Solutions children
| Administration | SunRiver - Database Administration | /database-administration |
| Analysis | SunRiver - Data Analysis | /database-analysis |
| Development | SunRiver - Database Development | /database-development |
| Design | SunRiver - Database Design | /database-design |

### Web Development children
| Custom Website | SunRiver - Custom Websites | /custom-website |
| HubSpot | SunRiver - HubSpot Websites | /hubspot-website |
| SquareSpace | SunRiver - Squarespace Sites | /squarespace |
| WordPress | SunRiver - WordPress Development | /wordpress |

### AI Solutions (NEW section — add to nav under Solutions/Products)
| AI Solutions (parent) | SunRiver - AI Solutions | /ai-solutions |
| AI Strategy & Adoption | SunRiver - AI Strategy & Adoption | /ai-strategy |
| Custom AI Assistants | SunRiver - Custom AI Assistants | /ai-assistants |
| Workflow Automation | SunRiver - AI Workflow Automation | /ai-automation |
| Training & Coaching | SunRiver - AI Training & Coaching | /ai-training |
| Private & Secure AI | SunRiver - Private & Secure AI | /ai-private |
| AI Audits & Governance | SunRiver - AI Audits & Governance | /ai-governance |

## C. Home (careful)
Clone the live Home page → set the CLONE to `SunRiver - Home (brand + smoke)`
→ preview → publish the clone. NEVER edit the original.

## D. After switching
- Contact: click the form module in the editor and pick your HubSpot form.
- Pricing: drop your two photos into the founder photo slots (image modules).
- Order matters: create the Section-B pages BEFORE switching parents in
  Section A (parent cards + modals link to the new slugs).
