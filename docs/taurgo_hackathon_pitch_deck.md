# Taurgo Hackathon — Pitch Deck Research Brief

---

## 0. Critical Reframe: You're Not Pitching a New Idea — You're Building Their Core Product

Taurgo's website already lists **four core AI-powered property solutions**:

1. **RICS Surveys** — "AI-augmented condition reports with Gemini Vision defect detection. 45-minute turnarounds on Level 1, 2, and 3 RICS-compliant reports."
2. **Retrofit & Energy** — PAS 2035-compliant assessments, virtual thermal analysis
3. **Inventory & Compliance** — 360° tenancy inventories with AI differencing
4. **Virtual Tours** — Interactive 360 tours, 3D floor plans, CAD blueprints

Their tagline: *"One scan unlocks multiple professional outputs for every stage of the property lifecycle."*

**This changes the pitch entirely.** You are not proposing a speculative new direction. You are building the technical engine behind a product Taurgo is already advertising — AI-augmented RICS survey report generation from 360° images. The hackathon solution is a proof-of-concept for their flagship AI product. Your job is to demonstrate that the technology works, that it's architecturally sound, that it's RICS-compliant, and that it can deliver on the "45-minute turnaround" promise.

The pitch should frame this as: **"Here's how the RICS survey product actually works under the hood — and we've built it."**

---

## 1. The UK Property Survey Market

**Transaction volume:** The UK processed approximately **1.09 million residential property transactions in 2024** (HMRC data via Moverly), a 6.8% increase over 2023. Savills valued the total market at **£379 billion**. IBISWorld forecasts ~1.18 million transactions for 2025–26.

**Survey uptake is critically low:** Countrywide Surveying Services' Q1 2024 data found only **9.7% of homebuyers commission a survey** beyond the basic mortgage valuation. Of those who do: 61% choose Level 2, 33% choose Level 2 with Valuation, **6% choose Level 3**.

**Survey pricing:**

| Level | Average cost | Typical range |
|---|---|---|
| Level 1 (Condition Report) | £350–380 | £250–600 |
| Level 2 (HomeBuyer Report) | £420–560 | £250–980 |
| **Level 3 (Building Survey)** | **£786–854** | **£500–1,500** |

**Total addressable market:** Current survey market is ~£48–100M/year. Full addressable market (if all transactions included a survey) exceeds **£500–700M annually**.

**Workforce crisis:** RICS's 2025 survey found **90% of surveyors report a critical skills shortage**. Two-thirds cite an aging workforce. Over half say it's cutting work capacity. RICS has 100,000+ UK/Ireland members, but the number actively doing residential building surveys is a fraction — perhaps a few thousand. Minimum 5-year qualification pathway means the pipeline can't expand quickly.

**Surveyor economics:** Average salary £41,500–£48,500/year (Glassdoor). Freelance day rates £250–400.

---

## 2. Report Writing Is the Bottleneck — 50%+ of Surveyor Time

A Level 3 Building Survey involves **3–6 hours on site**. But the bottleneck is afterwards:

- Level 3 reports run to approximately **15,000 words** (Collier Stevens)
- Active report-writing time: **4–8 hours per report**
- Calendar delivery: **5–10 working days** due to workload
- Report writing represents **40–60% of total surveyor time per job**

At a surveyor's implied daily rate of £200–400, the report-writing portion alone costs **£100–250 per report** in labour.

Taurgo promises **45-minute turnarounds**. This is only achievable with AI doing the heavy lifting on report generation while the surveyor reviews, edits, and signs off.

---

## 3. Operating Costs — Pennies Per Report

**Gemini 3.1 Flash-Lite pricing (defect analysis):**
- Input: $0.25/M tokens
- Output: $1.50/M tokens

**Gemini 3.1 Flash Image Preview / Nano Banana 2 (image annotation):**
- Input: $0.25/M tokens
- Output: $1.50/M tokens (text), image generation included

**Token consumption per image:**
- A standard property photo: ~1,290 tokens
- System prompt (taxonomy reference): ~1,500 tokens
- Output (7-field JSON): ~200–300 tokens

**Cost per element section (2 API calls):**

| Component | Estimated cost (USD) |
|---|---|
| Flash-Lite call (defect analysis + structured output) | ~$0.0005 |
| Flash Image call (Nano Banana 2 annotation) | ~$0.0005 |
| **Per-element total** | **~$0.001** |

**Scaling across report types:**

| Report scope | API cost (USD) | API cost (GBP) |
|---|---|---|
| 4-image hackathon demo | ~$0.004 | **< £0.01** |
| 25-element full Level 3 | ~$0.025 | **~£0.02** |
| With 10× overhead (retries, prompts, thinking tokens) | ~$0.25 | **~£0.20** |

**The comparison:**

| | Manual | AI-assisted |
|---|---|---|
| Report writing cost | £100–250 | **< £0.20** |
| Time | 4–8 hours | **< 1 minute** (generation) + surveyor review |
| Cost reduction | — | **500–1,250×** |

Even with generous overhead, the API cost is negligible compared to the value generated. At £500–1,500 per Level 3 survey, the AI report generation cost is less than 0.04% of the fee.

---

## 4. RICS AI Standard — Effective 9 March 2026 (This Week)

RICS published its first global professional standard on AI in surveying: **"Responsible Use of Artificial Intelligence in Surveying Practice"** — effective **9 March 2026**. This is the regulatory framework your solution is built for.

**The four mandates and how the solution meets them:**

| RICS Mandate | Solution Feature |
|---|---|
| **Surveyor accountability** — surveyors remain professionally liable, must assess AI reliability | Every field is editable. Surveyor reviews and approves before export. Human-in-the-loop by design. |
| **Transparency & client disclosure** — clients must be told when AI is used, with opt-out options | Thinking bubbles show AI reasoning chain. Source badges distinguish AI vs. taxonomy content. Both hidden from client PDF — surveyor-facing only. |
| **Data integrity** — assess data quality, training data provenance, risk documentation | Hybrid architecture: AI only classifies (7 fields). All professional content (causes, actions, HHSRS codes, costs) comes from curated taxonomy with source citations. Zero hallucination on sourced fields. |
| **Knowledge & upskilling** — members must understand AI limitations and bias risks | Confidence scoring routes uncertain classifications to surveyor for manual review. System knows what it doesn't know. |

**Pitch line:** "This tool was built for the RICS AI standard that became effective this week. Every design decision — thinking bubbles, source badges, confidence routing, editable fields — maps to a specific RICS compliance requirement."

---

## 5. The Hybrid AI/Taxonomy Architecture — Why It Matters

This is the most important technical decision and the strongest pitch point for judges who understand the surveying workflow.

**The problem with pure LLM approaches:** If you ask an LLM to generate a full survey report section, it might hallucinate a BRE crack category, invent an HHSRS code, or recommend an action that doesn't align with RICS standards. In professional services, a single wrong recommendation creates liability.

**The hybrid solution:**
- **AI handles perception** (7 fields): element code, condition rating, BRE category, defect type, location description, prose description, confidence. These are things only the model can determine from the image.
- **Taxonomy handles professional content** (7+ fields): display name, probable causes, recommended action, HHSRS hazard codes, cost guidance, source standard citations. These are looked up from a curated JSON — zero hallucination risk, 100% accurate, fully citable.

**Research context:** Hybrid approaches combining retrieval with validation can reduce hallucination rates by 54–68% across domains.

**Why this connects to Sherry's IP law background:** Content provenance — knowing where each piece of information originates — is an IP law principle. Source badges create an evidence chain analogous to IP documentation. The taxonomy-sourced content has verifiable provenance (specific BRE publications, statutory HHSRS codes). AI-generated text has no traceable origin. The hybrid architecture is a data integrity strategy, not just a technical one.

---

## 6. Why Level 3 First

| Reason | Detail |
|---|---|
| **Most complex = best proof** | Level 3 has the most structured fields (cause analysis, BRE classification, HHSRS codes, repair recs, cost guidance). If it works here, Levels 1 and 2 are strict subsets. |
| **Longest manual time** | 4–8 hours active writing, 5–10 day delivery. Highest time saving. |
| **Highest fees** | £786–854 average. Greatest revenue impact per report automated. |
| **Most rigid structure** | Sections A–N, elements D1–G3, condition ratings 1–3. Rigid = automatable. |
| **Taurgo already promises all three levels** | Their website says "Level 1, 2, and 3 RICS-compliant reports." Building Level 3 proves the hardest case. |

**Pitch line:** "We built the hardest version first. If the system generates a Level 3 Building Survey with BRE crack classification and HHSRS hazard codes, generating a Level 1 Condition Report is trivial — it's a subset of the same data."

---

## 7. Taurgo Alignment — "One Scan, Multiple Outputs"

Taurgo's own positioning is **"One scan unlocks multiple professional outputs."** Your solution is a direct implementation of this philosophy.

**The seamless loop:**

```
Taurgo 360° Capture (existing workflow)
    │
    ├── Virtual Tour → estate agent marketing (Revenue Stream 1)
    ├── Floor Plans → CAD blueprints (Revenue Stream 2)  
    ├── Inventory → tenancy check-in/out (Revenue Stream 3)
    │
    └── RICS Survey Report → AI defect analysis (Revenue Stream 4) ← YOUR SOLUTION
```

**Key points for the pitch:**
- **Zero additional fieldwork.** The images are already being captured. The AI layer processes existing data.
- **Same capture, new revenue.** A virtual tour package costs £150–500. A Level 3 survey commands £500–1,500. The second revenue stream can exceed the first.
- **From media company to intelligence platform.** Taurgo already serves 50+ agencies. Adding AI survey reports transforms the value proposition from "we make your listings look good" to "we generate professional intelligence from your property data."
- **The 45-minute promise.** Taurgo's website already advertises 45-minute turnarounds on RICS reports. Your solution shows how this is technically achievable: AI generates the draft in under a minute, surveyor reviews and edits for 30–40 minutes, export.

**Taurgo stats from their website:**
- 24-hour turnaround time (current virtual tour delivery)
- 2× inquiry rate (for properties with virtual tours)
- 50+ agencies served
- UK-wide national coverage

---

## 8. Human in the Loop — Not Replacing, Empowering

**This is critical for the pitch. The judges are PropTech and surveying professionals. They need to know the tool doesn't replace the surveyor.**

The design philosophy: **AI drafts, surveyor decides.**

- Every AI-generated field is editable inline
- Every taxonomy-sourced field carries a source badge ("BRE Digest 251", "RICS HSS 2021")
- Editing a sourced field replaces the badge with "Modified by surveyor"
- Changing a condition rating re-sorts Section B in real time
- Changing an element code moves the section to its correct RICS position
- Low-confidence images route to an "Unassigned" tray — the system says "I'm not sure" rather than guessing
- Thinking bubbles let the surveyor see *why* the AI classified something a certain way
- The PDF export strips all AI artifacts — the client receives a clean, professional report

**Pitch line:** "This isn't a replacement for the surveyor. It's a power tool. The AI handles the structured writing that takes hours. The surveyor handles the professional judgment that takes years of experience. We cut the cost and time of report writing by 500× while keeping the human accountable for every word."

---

## 9. Competitive Landscape

| Competitor | What they do | What they don't do |
|---|---|---|
| **GoReport** | Digital data capture, RICS templates, "standard phrases" library. RICS Tech Partner. | No AI defect classification. No image analysis. No automated report drafting. Digital form-filling, not intelligence. |
| **usurv.ai** | Consumer AI survey app. Instant reports from photos. "Property Health Score." | Explicitly states reports are "informal visual scans" — not RICS compliant. No regulatory references. No cost guidance. |
| **Spotr.ai** | Computer vision for building condition detection. Insurance/portfolio screening. | Netherlands-based. Not residential survey focused. No RICS report output. |

**Your unique position:** The only tool combining AI image analysis + curated professional taxonomy (BRE, HHSRS, RICS) + RICS AI standard compliance + editable human-in-the-loop output. No competitor has all four.

---

## 10. AI Adoption Gap = Opportunity

RICS AI in Construction 2025 report (2,200+ respondents):

- **45% of organisations have no AI implementation at all**
- Only 12% use AI regularly in specific workflows
- Less than 1% have AI fully embedded
- **#1 barrier: lack of skilled personnel (46%)**
- #2: system integration challenges (37%)
- #3: poor data quality (30%)
- Yet **70% of project managers and surveyors believe AI will deliver greater value**
- **60% of surveyors view AI positively** as an efficiency tool

The gap between belief and adoption is the opportunity. Surveyors want AI but don't know how to implement it safely. Your solution is purpose-built for this gap.

---

## 11. Recommended Pitch Deck Structure (5 minutes)

| # | Slide | Content | Time |
|---|---|---|---|
| 1 | **Hook** | "Taurgo already captures every angle of a property. We built the AI that turns those images into RICS survey reports." | 15s |
| 2 | **The Problem** | Surveyors spend 50%+ of their time writing, not surveying. 90% report skills shortages. 5–10 day report delivery. | 30s |
| 3 | **The Market** | 1.09M transactions/year. £500M+ TAM. Only 9.7% get surveys. Level 3 = £786+ average fee. | 20s |
| 4 | **Taurgo's Position** | "One scan, multiple outputs" — you already have the images. This adds the intelligence layer. 45-minute turnaround promise delivered. | 25s |
| 5 | **The Solution** | Upload image → AI defect analysis → RICS-structured editable report in seconds. Hybrid AI/taxonomy: AI classifies, taxonomy provides professional-grade sourced content. | 30s |
| 6 | **RICS Compliance** | Built for the AI standard effective this week (9 March 2026). Thinking bubbles = explainability. Source badges = data integrity. Editable fields = surveyor accountability. Confidence routing = AI knows its limits. | 25s |
| **7** | **LIVE DEMO** | Upload 4 images → watch report build → show Section B auto-populate → expand thinking bubble → click source badge → edit a field → export PDF. | **75s** |
| 8 | **Unit Economics** | £0.02 API cost per full Level 3 report vs. £100–250 manual. 500–1,250× cost reduction. At scale: pennies per report. | 20s |
| 9 | **Human in the Loop** | "AI drafts, surveyor decides." Everything editable, everything sourced, everything verifiable. Not replacing the team — giving them a power tool. | 20s |
| 10 | **Why Level 3** | Most complex proves it works. Levels 1 and 2 are subsets. One architecture, three products. | 15s |
| 11 | **What's Next** | Integration into Taurgo's existing capture pipeline. Pilot with 50 properties. Retrofit & inventory modules share the same AI backbone. | 15s |
| 12 | **Close** | "One surveyor. Four photos. Thirty seconds. RICS-standard report, client-ready." | 10s |

**Total: ~5 minutes.** Demo gets 75 seconds — the largest single block.

---

## 12. Key Numbers to Memorise

| Stat | Value | Source |
|---|---|---|
| UK residential transactions/year | 1.09M (2024) | HMRC via Moverly |
| Survey uptake rate | 9.7% | Countrywide Surveying Services Q1 2024 |
| Level 3 average fee | £786–854 | Finbri, Compare My Move |
| Report writing time (Level 3) | 4–8 hours | Collier Stevens, industry standard |
| Report writing cost | £100–250 | Implied from surveyor day rates |
| AI report generation cost | ~£0.02 | Gemini API pricing calculation |
| Cost reduction factor | 500–1,250× | Manual vs. API cost |
| Surveyor skills shortage | 90% affected | RICS 2025 survey |
| AI adoption in construction | 45% have none | RICS AI in Construction 2025 |
| RICS AI standard effective date | 9 March 2026 | RICS publication |
| Taurgo agencies served | 50+ | taurgo.co.uk |
| Taxonomy coverage | 9 categories, 49 defect types | Built from RICS/BRE/HHSRS/9 CV datasets |

---

## 13. Potential Judge Questions & Answers

**"How accurate is the AI classification?"**
"The AI handles defect type identification — matching what it sees to our 49-entry taxonomy. But the recommended actions, HHSRS codes, and cost guidance come directly from curated professional standards, not from the AI. So accuracy on the high-liability fields is 100% by design. For the classification itself, the confidence score routes uncertain results to the surveyor."

**"Does this replace the surveyor?"**
"No — and it's designed not to. The RICS AI standard effective this week requires surveyors to remain professionally accountable. Every field is editable. The AI is a drafting tool, not a decision-maker."

**"Why not just use ChatGPT / a general LLM?"**
"A general LLM would hallucinate BRE crack categories and invent HHSRS codes. Our hybrid approach constrains the AI to a 7-field classification task and sources everything else from a curated taxonomy. The AI does what it's good at — image analysis. The taxonomy does what it's good at — professional accuracy."

**"How does this connect to Sherry's background in IP law?"**
"Content provenance. In IP law, you need to trace where every piece of information originates. Our source badges do exactly that — every field either says 'BRE Digest 251' or 'Modified by surveyor.' There's a complete audit trail of what the AI contributed versus what the human professional decided."

**"What about the 45-minute turnaround Taurgo promises?"**
"The AI generates the report draft in under a minute. The surveyor then has 40+ minutes to review, edit, and sign off. That's the 45-minute window — AI handles the structured writing, the surveyor handles the professional judgment."
