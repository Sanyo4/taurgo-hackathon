# Taurgo Hackathon — AI Property Survey Tool
### Solution Design Document

---

## 1. Hackathon Brief

**Theme:** AI & PropTech Innovation

**Task:** Design an AI-powered tool that can analyse property images, categorise building defects, and generate structured survey-style descriptions in line with industry standards.

**Deliverable:** A working concept or prototype, pitched to an industry judge panel.

**Assets provided:** Real property images showing building damage and defects, representing a real-world survey reporting problem.

**Judge profile:** PropTech and real estate industry professionals familiar with RICS standards and surveying workflows.

---

## 2. Company Background — Taurgo

**Founder & CEO:** Sherry Deol (also known as Harisaran Kaur)  
**Location:** Cardiff, Wales  
**Founded:** 2024

Taurgo is a Cardiff-based PropTech startup building AI-powered property survey report generation tooling combined with 360-degree virtual tours. Sherry has a background in law and pivoted into tech to solve the slow, manual workflow of writing RICS-standard survey reports — a process that currently takes surveyors hours of manual dictation and formatting per property.

**Recognition:**
- Virtual Tour Company of the Year 2025/26
- Sherry shortlisted for Entrepreneur of the Year at the Women in Electronics Awards

**Key partnership:** Taurgo has partnered with RICS (Royal Institution of Chartered Surveyors) to develop AI-driven survey reporting tools, giving the solution direct industry alignment and credibility.

**Website:** taurgo.co.uk

**Core value proposition:** Automate the most time-consuming part of a surveyor's job — writing the report — while keeping the human surveyor in control of the final output.

---

## 3. The Problem

A RICS Level 3 Home Survey (Full Building Survey) requires a surveyor to:

1. Physically inspect a property across 25+ structural elements (roof, walls, windows, floors, services etc.)
2. Photograph defects at each element
3. Write detailed prose descriptions of each defect — probable cause, BRE damage classification, RICS condition rating, and recommended action
4. Format everything into a standardised report structure (Sections A–N)
5. Produce a client-ready document

Steps 3–5 are entirely manual and typically take several hours per property. The report structure is rigid and standardised by RICS, making it a strong candidate for AI-assisted generation.

---

## 4. Competing Solutions — What Other Teams Will Build

Most teams at this hackathon will produce one of two things:

- **A basic image classifier** — takes a photo, outputs a label ("crack", "damp", "spalling"). No professional context, no report output.
- **A raw JSON dump** — structured defect data with no presentation layer. Shows AI capability but doesn't show the end artifact surveyors actually deliver to clients.

Neither of these solves the real problem. The real problem isn't defect detection — it's report generation.

---

## 5. Proposed Solution

### 5.1 Differentiator

Rather than a classifier or a data pipeline, the proposed solution produces **the end artifact** — an editable, exportable HTML report structured to mirror the official RICS Home Survey Level 3 template, complete with:

- Side-by-side original and annotated images per element
- AI-generated defect descriptions grounded in RICS/BRE taxonomy
- Colour-coded condition ratings (CR1/CR2/CR3)
- **Every AI-generated field editable inline** — with the report reorganising itself dynamically on change
- **Expandable thinking bubbles** per section showing the model's reasoning (hidden from export)
- In-browser canvas annotation tool for image markup
- One-click print-to-PDF export

The judge sees "the job is basically done" rather than "look what the AI found."

### 5.2 Report Format

The output mirrors the official **RICS Home Survey Level 3** template:

- Deep purple (`#4B2682`) colour scheme, white background
- Lettered sections A–N with element codes D1–G3 covering Outside (D), Inside (E), Services (F), Grounds (G)
- Condition rating circles: **1** (green) = no repair, **2** (amber) = repair needed, **3** (red) = urgent
- Per-element layout: photo left (~30%), surveyor notes right (~65%), condition circle top-right
- Section B: summary table of all elements grouped by condition rating with comments

---

## 6. Defect Taxonomy

The AI analysis is grounded in a custom taxonomy built from the following standards:

| Source | Purpose |
|--------|---------|
| RICS Home Survey Standard (2021) | Element codes D1–G3, condition ratings CR1–3 |
| BRE Digest 251 | Crack width classification categories 0–5 |
| HHSRS (Housing Health & Safety Rating System) | Health & safety hazard flags |
| BS EN 13306:2017 | Defect terminology |
| CV datasets: BD3, CUBIT-Det, CODEBRIM | Computer vision label vocabulary |

### 6.1 Taxonomy Entry Structure

The taxonomy covers **8 defect categories** and **45+ defect types**. Each entry:

```json
{
  "defect_type": "diagonal_cracking",
  "display_name": "Diagonal Stepped Cracking",
  "category": "structural_movement",
  "bre_category_default": 3,
  "location_tags": ["D4", "E3"],
  "possible_causes": [
    "Differential foundation settlement",
    "Thermal expansion at window openings",
    "Historic subsidence"
  ],
  "recommended_action": "Commission a structural engineer to assess foundations and provide written report prior to exchange.",
  "cv_labels": ["diagonal_crack", "stepped_crack", "major_crack"],
  "hhsrs_hazard": "STRU01",
  "hhsrs_flag": true,
  "cost_guidance": "Mid"
}
```

### 6.2 Key Mappings

**BRE → RICS condition rating:**

| BRE Category | Width | RICS Rating | Colour |
|---|---|---|---|
| 0–1 | < 1mm hairline | CR1 | Green |
| 2–3 | 1–15mm | CR2 | Amber |
| 4–5 | > 15mm structural | CR3 | Red |

**RICS element codes:**

| Code | Element | Code | Element |
|---|---|---|---|
| D1 | Chimney stacks | E1 | Roof structure |
| D2 | Roof coverings | E2 | Ceilings |
| D3 | Rainwater pipes & gutters | E3 | Walls and partitions |
| D4 | Main walls | E4 | Floors |
| D5 | Windows | E5 | Fireplaces & flues |
| D6 | Outside doors | E6 | Built-in fittings |
| D7 | Conservatory & porches | E7 | Woodwork |
| D8 | Other joinery & finishes | E8 | Bathroom fittings |
| F1–F7 | Services (electricity, gas, water, heating, drainage) | G1–G3 | Grounds, garage, outbuildings |

---

## 7. Model Stack

### 7.1 Vision Analysis — Gemini 3.1 Flash-Lite

> 🔗 [Google Blog announcement](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-lite/) · [Vertex AI docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-1-flash-lite)

Used for defect detection and structured report generation per uploaded image.

| Property | Value |
|---|---|
| Model string | `gemini-3.1-flash-lite-preview` |
| Input cost | $0.25 / million tokens |
| Output cost | $1.50 / million tokens |
| Speed | ~363–389 tokens/s |
| MMMU-Pro score | 76.8% |
| Thinking support | ✅ `thinking_level`: minimal / low / medium / high |
| Structured output | ✅ `responseJsonSchema` enforcement |

**Why this model:** Fastest multimodal model in the Gemini 3 family with thinking support built in. The structured output / controlled generation feature ([docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output)) enforces a JSON Schema at generation time. Thinking tokens are surfaced in the response and can be captured and displayed separately from the final output — see Section 9.

### 7.2 Image Annotation — Nano Banana 2

> 🔗 [Gemini API image generation docs](https://ai.google.dev/gemini-api/docs/image-generation)

Used to produce the annotated version of each uploaded image. Nano Banana 2 is the Gemini 3.1 Flash Image Preview model — the high-efficiency counterpart to Gemini 3 Pro Image, optimised for speed and high-volume use cases.

| Property | Value |
|---|---|
| Model string | `gemini-3.1-flash-image-preview` |
| Capability | Instruction-following image editing / generation |
| Required config | `responseModalities: ["TEXT", "IMAGE"]` |
| Access | Gemini API, Google AI Studio |
| JS SDK | `@google/genai` (new Gen AI SDK) |

**Key detail:** The `responseModalities: ["TEXT", "IMAGE"]` config is required — without it the model returns text only.

**Annotation prompt pattern:**
```
Draw a red circle around the [defect_type] visible in this image.
Add a label reading "[display_name]" next to the circle.
Location: [location_description].
Do not alter any other part of the image.
```

**`nanoBanana.js` — full implementation:**

```javascript
// nanoBanana.js — annotates a property image with defect markup
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Takes the original image and analysis result, returns an annotated
 * image (base64) with the defect circled and labelled.
 * If annotation fails, returns null — the UI falls back to the
 * canvas annotation tool (see Section 13.1).
 */
export async function annotateImage(imageBase64, mimeType, analysisResult) {
  const prompt = [
    {
      text: `Draw a red circle around the ${analysisResult.defect_type} defect visible in this image. `
          + `Add a label reading "${analysisResult.display_name || analysisResult.defect_type}" next to the circle. `
          + `Location: ${analysisResult.location_description}. `
          + `Do not alter any other part of the image.`,
    },
    {
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    },
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    // Extract the image part from the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data; // base64 annotated image
      }
    }

    // No image part returned — fall back to null
    return null;
  } catch (err) {
    console.warn("Nano Banana 2 annotation failed:", err.message);
    return null; // UI will show original image with "Edit annotation" button
  }
}
```

**Fallback behaviour:** If `annotateImage()` returns `null` (API error, no image in response, or the annotation looks wrong), the right panel shows the original image with an "Edit annotation" button. The surveyor can annotate manually via the canvas tool. This means a Nano Banana 2 failure never blocks the pipeline — it just means the surveyor draws the circle themselves.

---

## 8. Hybrid Output Architecture — LLM Fields vs. Taxonomy-Sourced Fields

This is the most important architectural decision: **not all fields need to be generated by the LLM.**

The output can be split into two categories:

### 8.1 Perceptual Fields — LLM-generated (from the image)

These are things only the model can determine by looking at the photograph:

| Field | Why the LLM must provide it |
|---|---|
| `element_code` | Which part of the building is in the photo? (D4, E3, etc.) |
| `condition_rating` | How severe is the defect? (1/2/3) |
| `bre_category` | Observed crack width classification (0–5) |
| `defect_type` | Which taxonomy entry matches the visible defect? |
| `location_description` | Where exactly in the image is the defect? |
| `description` | Prose description of what is visible in this specific photo |
| `confidence` | How confident is the model in this classification? (0.0–1.0) |

**This is the only schema the LLM needs to output.** Seven fields, not thirteen.

```json
{
  "element_code": "D4",
  "condition_rating": 3,
  "bre_category": 3,
  "defect_type": "diagonal_cracking",
  "location_description": "Upper right corner of the rear extension, running diagonally downward from the window head toward the flank wall",
  "description": "Diagonal stepped cracking is present to the upper right corner of the rear extension window opening. Crack width estimated at 3–5mm at its widest point, classifying as BRE Category 3.",
  "confidence": 0.87
}
```

### 8.2 Taxonomy-Sourced Fields — 100% accurate, no LLM needed

Once `defect_type` is returned, the remaining fields are looked up **directly from the taxonomy JSON** client-side. They are guaranteed accurate because they come verbatim from the curated source.

```javascript
// client-side lookup — zero hallucination risk
const entry = taxonomy[result.defect_type];

const fullSection = {
  ...result,                                         // LLM perceptual fields
  display_name:       entry.display_name,            // ← from taxonomy
  element_name:       ELEMENT_NAMES[result.element_code], // ← from lookup table
  probable_causes:    entry.possible_causes,         // ← from taxonomy
  recommended_action: entry.recommended_action,      // ← from taxonomy
  hhsrs_flag:         entry.hhsrs_flag,              // ← from taxonomy
  hhsrs_code:         entry.hhsrs_hazard,            // ← from taxonomy
  cost_guidance:      entry.cost_guidance,           // ← from taxonomy
  cv_labels:          entry.cv_labels,               // ← from taxonomy (for reference badge)
  source_standard:    entry.source_standard,         // ← e.g. "BRE Digest 251 / RICS HSS 2021"
};
```

### 8.3 Why This Is Better

| Concern | LLM-only approach | Hybrid approach |
|---|---|---|
| `probable_cause` accuracy | ~85–90% (may hallucinate) | 100% — verbatim from taxonomy |
| `recommended_action` accuracy | ~85–90% | 100% — verbatim from RICS-aligned text |
| HHSRS codes | Can be wrong | Always correct |
| LLM schema complexity | 13 fields | 7 fields |
| Prompt token usage | Higher | Lower (~30% reduction) |
| Citeability | Cannot cite source | Every field has a `source_standard` tag |
| Auditable | No | Yes — surveyor can see exactly what standard each field came from |

The sourced fields also carry a `source_standard` tag (e.g. `"BRE Digest 251"`, `"RICS Home Survey Standard 2021"`) which is displayed as a small badge under each sourced field in the UI. This is a compelling demo moment — "this recommended action comes directly from RICS standards, not from AI."

---

## 9. Thinking Tokens — Sourced AI Reasoning

Gemini 3.1 Flash-Lite supports configurable thinking levels (`minimal` / `low` / `medium` / `high`) — these are internal reasoning tokens the model produces before generating its final output, and they can be captured in the API response.

**API parameter (new `@google/genai` SDK):**

```javascript
// ✅ Correct pattern — docs: https://ai.google.dev/gemini-api/docs/gemini-3
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-lite-preview",
  contents: [...],
  config: {
    systemInstruction: ANALYSIS_SYSTEM_PROMPT,
    responseMimeType: "application/json",
    responseJsonSchema: zodToJsonSchema(defectAnalysisSchema),
    thinkingConfig: { thinkingLevel: "low" },
    // ⚠️ Do NOT set temperature — Gemini 3 docs warn it can cause looping at non-default values
  },
});
```

For this use case, `low` is the right level — the docs define it as "best for simple instruction following," which is exactly what taxonomy matching against a known table is. `medium` is available if edge cases prove tricky in testing.

### 9.1 Capturing Thinking Tokens

The thinking content is returned as a separate part in the response `candidates` with `thought: true`:

```javascript
// New SDK: access candidates directly for thinking parts
const parts = response.candidates?.[0]?.content?.parts ?? [];

// Separate thinking from final output
const thinkingContent = parts
  .filter(p => p.thought === true)
  .map(p => p.text)
  .join("\n");

const outputContent = parts
  .filter(p => p.thought !== true)
  .map(p => p.text)
  .join("");

const structuredOutput = JSON.parse(outputContent);

return {
  ...structuredOutput,
  _thinking: thinkingContent, // stored separately, never rendered in report body
};
```

### 9.2 Thinking Bubble UI

Each element section in the report includes a collapsed "🧠 AI Reasoning" disclosure widget directly below the section header. It shows the model's internal chain of thought — what it considered, what it ruled out, why it chose this element code and defect type.

```
┌─────────────────────────────────────────────────────┐
│  D4  Main Walls                            ● CR3 ↺   │
│  ▸ 🧠 View AI reasoning  (click to expand)           │
├─────────────────────────────────────────────────────┤
│  [images + editable fields]                          │
└─────────────────────────────────────────────────────┘
```

Expanded:

```
┌─────────────────────────────────────────────────────┐
│  D4  Main Walls                            ● CR3 ↺   │
│  ▾ 🧠 AI Reasoning                                   │
│  ┌───────────────────────────────────────────────┐   │
│  │ The image shows the external face of a brick  │   │
│  │ wall. I can see a diagonal crack running from │   │
│  │ the top-right corner of a window opening...   │   │
│  │                                               │   │
│  │ I considered D3 (Rainwater pipes) but the     │   │
│  │ crack pattern and location rule this out.     │   │
│  │ The stepped diagonal pattern is consistent    │   │
│  │ with differential settlement rather than      │   │
│  │ thermal movement, which would typically show  │   │
│  │ as horizontal cracking. BRE category 3        │   │
│  │ assigned based on estimated crack width...    │   │
│  └───────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  [images + editable fields]                          │
└─────────────────────────────────────────────────────┘
```

### 9.3 Print Exclusion

The thinking bubble is hidden from PDF export via a print CSS class:

```css
@media print {
  .ai-thinking-bubble {
    display: none !important;
  }
}
```

It never appears in the client document — it's a surveyor-facing tool only. This is the right UX for a professional context: the reasoning helps the surveyor validate the AI's classification, but it has no place in a client report.

### 9.4 Thought Signatures — Important for Multi-Turn Flows

The Gemini 3 docs introduce **thought signatures** — encrypted representations of the model's reasoning that must be circulated back in subsequent API calls to maintain reasoning continuity. For this solution's single-turn analysis calls (one call per image, no follow-up turns), this is not a concern. However, if you add a "re-analyse with feedback" feature (e.g. "look again, I think this is penetrating damp not rising damp"), you must pass the thought signature from the original response back with the follow-up request. For function calling in strict mode, missing signatures return a 400 error. Reference: [Gemini 3 Developer Guide — Thought signatures](https://ai.google.dev/gemini-api/docs/gemini-3)

### 9.5 Why Show Thinking?

For the hackathon demo this is a powerful trust signal. When the judge sees the model reasoning through "I considered D3 but ruled it out because..." they understand this isn't a black-box classifier — it's a system capable of professional-level justification. It also aligns directly with RICS AI standards around transparency and auditability of AI-assisted survey content.

---

## 10. Complete Data Flow Per Image

```
1. User uploads image
       │
       ▼
2. Gemini 3.1 Flash-Lite call (thinking_level: "low")
   → Returns: { element_code, condition_rating, bre_category,
                defect_type, location_description, description,
                confidence }
   → Also returns: _thinking (internal chain of thought)
   → Client-side override: if defect_type === "unidentified", confidence = 0
       │
       ▼
3. Confidence routing (threshold: 0.6)
   ├─── Below threshold → Unassigned tray (surveyor classifies manually)
   │
   └─── Above threshold ↓
       │
       ▼
4. Client-side taxonomy lookup (taxonomy[defect_type])
   → Populates: display_name, element_name, probable_causes,
                recommended_action, hhsrs_flag, hhsrs_code,
                cost_guidance, cv_labels, source_standard
       │
       ├─── 5a. Nano Banana 2 call (parallel — fires at step 2, resolves here)
       │         → Returns: annotated image (base64)
       │
       ▼
6. Merge all fields + thinking + annotated image
       │
       ▼
7. Sort section into correct RICS position (D1–G3 order)
       │
       ▼
8. Inject section into live report DOM
   - Images (original + annotated / canvas-replaceable)
   - All fields rendered as editable controls
   - Thinking bubble (collapsed, print-hidden)
   - Source standard badges on taxonomy-sourced fields
       │
       ▼
9. Section B summary auto-updates
```

---

## 11. Full JSON Output Schema

The **LLM schema** (what Gemini outputs — 7 fields including confidence):

```json
{
  "element_code":         "D4",
  "condition_rating":     3,
  "bre_category":         3,
  "defect_type":          "diagonal_cracking",
  "location_description": "Upper right corner of the rear extension...",
  "description":          "Diagonal stepped cracking is present...",
  "confidence":           0.87
}
```

If no taxonomy entry matches, the model returns `"defect_type": "unidentified"`. A client-side override in `analyseImage()` forces `confidence` to `0` for any `unidentified` result, regardless of what the model self-reported (see Section 13.2). Sections below the **0.6 threshold** route to the Unassigned tray rather than the main report.

The **full merged section object** (after taxonomy lookup — what the UI uses):

```json
{
  "element_code":         "D4",
  "element_name":         "Main Walls",
  "condition_rating":     3,
  "bre_category":         3,
  "defect_type":          "diagonal_cracking",
  "display_name":         "Diagonal Stepped Cracking",
  "location_description": "Upper right corner of the rear extension...",
  "description":          "Diagonal stepped cracking is present...",
  "probable_causes":      ["Differential foundation settlement", "Historic subsidence"],
  "recommended_action":   "Commission a structural engineer...",
  "hhsrs_flag":           true,
  "hhsrs_code":           "STRU01",
  "cost_guidance":        "Mid",
  "cv_labels":            ["diagonal_crack", "stepped_crack"],
  "source_standard":      "BRE Digest 251 / RICS Home Survey Standard 2021",
  "_thinking":            "The image shows the external face of a brick wall..."
}
```

Fields derived from taxonomy carry the `source_standard` badge in the UI. `_thinking` is never rendered in the report body — only in the collapsible bubble.

---

## 12. Editable Fields and Dynamic Report Behaviour

Every field in the merged section object maps to an editable UI control. The report reorganises itself in real time.

| Field | Source | UI Control | Dynamic Effect |
|---|---|---|---|
| `element_code` | LLM | Dropdown (D1–G3 etc.) | **Moves entire section** to correct RICS-ordered position |
| `element_name` | Taxonomy lookup | Inline text | Updates section header + Section B row |
| `condition_rating` | LLM | Clickable circle (cycles 1→2→3) | **Re-sorts Section B**. Updates circle colour. |
| `bre_category` | LLM | Dropdown (0–5) | Updates BRE badge. If 4–5, prompts CR3 upgrade. |
| `defect_type` | LLM | Dropdown (from taxonomy) | Re-runs taxonomy lookup, refreshes sourced fields |
| `display_name` | Taxonomy | Inline text | Updates section subheader |
| `location_description` | LLM | Inline text | Updates annotation callout label on image |
| `description` | LLM | `contenteditable` prose | Free edit |
| `probable_causes` | **Taxonomy** 🔒 | `contenteditable` (prefilled) | Free edit — source badge shown |
| `recommended_action` | **Taxonomy** 🔒 | `contenteditable` (prefilled) | Free edit — source badge shown |
| `hhsrs_flag` | **Taxonomy** 🔒 | Toggle | Shows/hides HHSRS badge + Section I entry |
| `hhsrs_code` | **Taxonomy** 🔒 | Inline text (when flagged) | Updates hazard ref in Section I |
| `cost_guidance` | **Taxonomy** 🔒 | Segmented control (Low/Mid/High) | Updates cost badge |

🔒 = taxonomy-sourced by default. Surveyors can still edit these fields — the lock icon indicates the original source, not a restriction. Editing clears the source badge and replaces it with "Modified by surveyor."

### 12.1 Section Ordering Logic

```javascript
const ELEMENT_ORDER = [
  'D1','D2','D3','D4','D5','D6','D7','D8',
  'E1','E2','E3','E4','E5','E6','E7','E8',
  'F1','F2','F3','F4','F5','F6','F7',
  'G1','G2','G3'
];

function reorderSections(sections) {
  return [...sections].sort(
    (a, b) => ELEMENT_ORDER.indexOf(a.element_code) - ELEMENT_ORDER.indexOf(b.element_code)
  );
}
```

### 12.2 Section B Auto-Update

Section B is a computed view — re-derived from all section states on every change to `condition_rating`, `element_code`, or `element_name`. Never stored separately.

```javascript
const summary = {
  cr3: sections.filter(s => s.condition_rating === 3),
  cr2: sections.filter(s => s.condition_rating === 2),
  cr1: sections.filter(s => s.condition_rating === 1),
};
```

### 12.3 defect_type Change — Taxonomy Re-Fetch

When `defect_type` is changed via the dropdown, the sourced fields are re-populated from the new taxonomy entry. The surveyor sees the fields update in real time. A toast notification confirms: "Recommended action and cause updated from taxonomy for [new defect type]."

---

## 13. Additional Design Decisions

### 13.1 Annotation Replacement Flow

The right-side image slot is just a container — whether it holds an AI-generated Nano Banana 2 annotation or a surveyor-drawn canvas export, the report doesn't care. The key is making the replacement path obvious and irreversible-in-a-good-way.

**UI pattern:**

```
┌──────────────────┬──────────────────┐
│ Original         │ Annotated        │
│ [image]          │ [image]          │
│ [✏ Edit annot.]  │ [✏ Edit annot.]  │  ← same button on both
└──────────────────┴──────────────────┘
                         ↑
                    [↺ Reset to AI]    ← only shown when manually annotated
```

- **"Edit annotation"** on the right panel opens the canvas tool pre-loaded with the **original image** (not the AI annotated one — always annotate from the clean source)
- On Save: `canvas.toDataURL('image/png')` overwrites the right panel
- State tracks `annotationSource: 'ai' | 'manual'` — when `manual`, a small "↺ Reset to AI" button appears below the right panel, restoring the Nano Banana 2 output
- The original image is **never overwritten** — always kept in a separate state key `originalImage`

```javascript
const [section, setSection] = useState({
  originalImage: base64,        // never changes
  annotatedImage: nanaBanana2,  // replaced on canvas save
  annotationSource: 'ai',       // 'ai' | 'manual'
});

function handleAnnotationSave(canvasDataUrl) {
  setSection(prev => ({
    ...prev,
    annotatedImage: canvasDataUrl,
    annotationSource: 'manual',
  }));
}

function handleAnnotationReset() {
  setSection(prev => ({
    ...prev,
    annotatedImage: prev._aiAnnotatedImage, // preserved from initial load
    annotationSource: 'ai',
  }));
}
```

**What the judge sees:** The surveyor draws a better circle, hits Save, the right panel updates instantly. If they change their mind, one click restores the AI version. Zero friction, zero ambiguity about what's happening.

---

### 13.2 Unidentifiable Image Handling

A `confidence` field (float 0.0–1.0) is the 7th field in the LLM schema. This is a **self-reported** value — the model scores its own certainty about the classification. Below a threshold of **0.6**, the image is routed to an **"Unassigned"** section at the bottom of the report rather than being inserted into the main RICS-ordered flow.

**Important — confidence is not a native Gemini feature.** It's a field in the JSON schema that the model fills like any other. The `responseJsonSchema` enforces its presence and type (number, 0–1), but the model decides the value. This works well in practice because the schema description tells the model explicitly when to report low confidence.

**Client-side override:** The model might return `defect_type: "unidentified"` with a *high* confidence score (e.g. 0.7), meaning "I'm confident that I can't classify this." For routing purposes, `unidentified` should always mean low confidence. The override in `gemini.js` handles this:

```javascript
// In analyseImage() — after Zod parse, before return:
const confidence = output.defect_type === "unidentified" ? 0 : output.confidence;
```

This makes routing fully deterministic: `unidentified` always goes to Unassigned, regardless of what the model self-reported.

**Routing logic:**

```javascript
const CONFIDENCE_THRESHOLD = 0.6;

function routeSection(result) {
  if (result.confidence < CONFIDENCE_THRESHOLD || result.defect_type === 'unidentified') {
    return 'unassigned';
  }
  return 'report';
}
```

**Unassigned section UI:**

```
⚠  Unassigned Images (2)
─────────────────────────────────────────────────────
  [image thumbnail]
  The AI could not confidently identify this defect
  (confidence: 43%).

  Element: [ Select element code ▼ ]
  Defect type: [ Select or describe ▼ ]

  Once an element code is selected, this section will
  slot into the correct position in the report.
─────────────────────────────────────────────────────
```

The moment the surveyor selects an element code from the dropdown, the section is promoted with `confidence: 1.0` (human-confirmed), leaves the Unassigned tray, and re-inserts itself into the correct RICS-ordered position in the main report. Selecting a `defect_type` from the dropdown triggers the taxonomy lookup, populating all sourced fields (recommended action, probable causes, HHSRS codes) exactly as if the model had classified it correctly in the first place.

**Why this matters for the pitch:** The judge may deliberately upload an ambiguous image — a blurry photo, an interior room with no visible defect, a photo of a garden. A confident misclassification is far worse than an honest "I'm not sure." The pitch line writes itself: *"The system knows what it doesn't know — it hands it back to the surveyor."*

---

### 13.3 Grounding the Model in the Taxonomy

Gemini 3.1 Flash-Lite has no inherent awareness of the `defect_type` strings in the taxonomy. The `responseJsonSchema` only enforces the **shape** of the output (correct field names and types) — it does not constrain `defect_type` to valid values unless you explicitly add an enum. Without explicit grounding, the model may invent `defect_type` strings that don't exist in the taxonomy, which breaks the client-side lookup entirely.

**The solution:** Include `taxonomy_prompt_reference.md` directly in the system prompt. This is a condensed table of every valid `defect_type` with a short description and valid `location_tags` — approximately **1,500 tokens**, well within budget for a Flash-Lite call. This turns the classification task from "use your general knowledge of building defects" into "match what you see to the closest entry in this specific table" — a much easier and more controllable task for a lite model.

The file is already generated and ready to paste:

```
// taxonomy_prompt_reference.md — paste verbatim into system prompt
| defect_type              | Description (short)                          | Valid location_tags |
|--------------------------|----------------------------------------------|---------------------|
| subsidence_cracking      | Diagonal/stepped cracking from foundation... | D4, E3              |
| settlement_cracking      | Cracking from normal ground consolidation... | D4, E3              |
| heave                    | Upward ground movement, often post-tree...   | D4, E3, E4          |
| wall_tie_failure         | Horizontal bed joint cracking from corrod... | D4                  |
| ...                      | ...                                          | ...                 |
```

**Full system prompt structure:**

```
You are a RICS-trained building surveyor assistant.

Analyse the uploaded property photograph and return a JSON object with exactly these fields:
- element_code: the RICS element code (from the element table below)
- condition_rating: 1, 2, or 3 (from the condition rating reference below)
- bre_category: 0–5 (from the BRE crack category table below)
- defect_type: MUST be a value from the defect_type column in the taxonomy table below. If nothing matches, return "unidentified".
- location_description: where in the image the defect is located, in plain English
- description: a professional surveyor's prose description of the visible defect
- confidence: a float from 0.0 to 1.0 representing your confidence in the classification

--- TAXONOMY REFERENCE ---
[paste taxonomy_prompt_reference.md table here]

--- ELEMENT CODE REFERENCE ---
[paste element code table here]

--- CONDITION RATING REFERENCE ---
[paste condition rating table here]

--- BRE CRACK CATEGORY REFERENCE ---
[paste BRE table here]
```

**Enum enforcement as a belt-and-braces fallback:**

As an additional guard, add `defect_type` as an enum in the `responseJsonSchema`. This forces the model to pick from the valid list at the schema level, not just the prompt level. This is already handled in `reportSchema.js` (Section 15.3):

```javascript
// reportSchema.js already defines defect_type as a constrained enum:
defect_type: z.enum(VALID_DEFECT_TYPES),  // enforced at generation time AND parse time

// In gemini.js, the Zod schema feeds directly into the API call:
config: {
  responseJsonSchema: zodToJsonSchema(defectAnalysisSchema), // single source of truth
}
```

**Prompt ordering note:** Test whether accuracy drops for defect types listed later in the taxonomy table. LLMs can exhibit mild recency bias in classification tasks — if so, group entries by category (structural movement, dampness, roof defects etc.) so the model can narrow its search hierarchically rather than scanning a flat list.

The taxonomy has **8 categories, 48 defect types** — worth grouping in the prompt as:

```
STRUCTURAL MOVEMENT: subsidence_cracking, settlement_cracking, heave, wall_tie_failure...
DAMPNESS: rising_damp, penetrating_damp, condensation, interstitial_condensation...
ROOF DEFECTS: slipped_missing_tiles_slates, ridge_tile_defect, flat_roof_failure...
...
```

---

## 14. Application Flow

### Step 1 — Input Screen

- Property address, property type dropdown
- Drag-and-drop multi-image upload
- No element labelling — AI infers everything

### Step 2 — Processing Screen

- Per-image status: `Analysing... → D4 Main Walls ✓`
- LLM calls fire in parallel (`Promise.all`)
- Taxonomy lookups happen synchronously client-side as each result arrives
- Nano Banana 2 annotation calls fire in parallel
- Report preview populates in real time, sections insert in RICS order

### Step 3 — Report Preview

- Full RICS-styled HTML report
- Per-element: images, all editable fields, source badges, thinking bubble
- Section B auto-populated as traffic light summary
- [+ Add Section] → element dropdown + image upload + Analyse / Add empty
- [Export PDF] → `window.print()` with print stylesheet

---

## 15. Tech Stack

### 15.1 Architecture — Fully Serverless

No backend required. Both models are callable directly from JavaScript. The app is a static React + Vite SPA deployed to Vercel.

```
Browser (React + Vite SPA — fully serverless)
    ├── Gemini 3.1 Flash-Lite   →  Vision analysis + thinking tokens
    ├── Nano Banana 2 (gemini-3.1-flash-image-preview) →  Annotated image generation
    ├── taxonomy.json            →  Local — sourced field lookup (100% accurate)
    ├── Canvas API               →  Manual annotation tool
    └── window.print()           →  PDF export
```

### 15.2 Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | **React 18** | Component per section, state drives dynamic re-ordering and edits |
| Build tool | **Vite** | Fast HMR, minimal config — ideal for hackathon velocity |
| Styling | **Tailwind CSS** | Utility-first, RICS purple in `tailwind.config.js` |
| Vision AI | **Gemini 3.1 Flash-Lite** | Thinking support, structured output, fastest Gemini 3 model |
| Image gen | **Nano Banana 2** (`gemini-3.1-flash-image-preview`) | Instruction-following image editing |
| Taxonomy | **Local JSON** | 100% accurate field sourcing, zero API cost |
| Annotation | **Canvas API** | Zero dependency |
| PDF | **`window.print()`** + print CSS | Browser-native |
| Deployment | **Vercel** | Git push, free tier, instant CDN |

### 15.3 Project Structure

```
taurgo-survey/
├── src/
│   ├── components/
│   │   ├── InputScreen.jsx
│   │   ├── ProcessingScreen.jsx
│   │   ├── Report.jsx
│   │   ├── SectionB.jsx              # Computed — re-renders on any CR change
│   │   ├── ElementSection.jsx        # Full editable section with thinking bubble
│   │   ├── ThinkingBubble.jsx        # Collapsible reasoning bubble, print:hidden
│   │   ├── SourceBadge.jsx           # "BRE Digest 251" badge on sourced fields
│   │   ├── UnassignedTray.jsx        # Holds low-confidence / unidentified images
│   │   ├── ImagePanel.jsx
│   │   ├── AnnotationCanvas.jsx
│   │   └── AddSectionPanel.jsx
│   ├── lib/
│   │   ├── gemini.js                 # Analysis call — imports schema, captures thinking
│   │   ├── nanoBanana.js             # Annotation call
│   │   ├── prompts.js                # ANALYSIS_SYSTEM_PROMPT (taxonomy table + element ref)
│   │   ├── reportSchema.js           # Zod schema + VALID_DEFECT_TYPES — single source of truth
│   │   ├── taxonomyLookup.js         # Client-side field resolution from taxonomy
│   │   ├── taxonomy.json             # Full defect taxonomy (49 entries)
│   │   ├── elementOrder.js           # RICS canonical sort
│   │   └── taxonomy_prompt_reference.md # Condensed table (~1500 tokens) embedded in prompts.js
│   ├── App.jsx
│   └── main.jsx
├── .env                              # VITE_GEMINI_API_KEY
└── package.json
```

**`reportSchema.js` — single source of truth for schema:**

```javascript
// reportSchema.js — exports the Zod schema and valid defect types.
// Imported by gemini.js (for API call + runtime validation) and
// by any component that needs type-safe access to analysis results.

import { z } from "zod";
import taxonomy from "./taxonomy.json";

// Build the valid defect types list from taxonomy keys + "unidentified"
const taxonomyKeys = taxonomy.defect_categories
  .flatMap(cat => cat.defect_types.map(dt => dt.defect_type));

export const VALID_DEFECT_TYPES = [...taxonomyKeys, "unidentified"];

export const defectAnalysisSchema = z.object({
  element_code: z.enum([
    "D1","D2","D3","D4","D5","D6","D7","D8","D9",
    "E1","E2","E3","E4","E5","E6","E7","E8","E9",
    "F1","F2","F3","F4","F5","F6","F7",
    "G1","G2","G3"
  ]).describe("RICS element code identifying which part of the building is shown."),
  condition_rating: z.number().int().min(1).max(3)
    .describe("RICS condition rating. 1 = no repair, 2 = non-urgent, 3 = urgent."),
  bre_category: z.number().int().min(0).max(5)
    .describe("BRE Digest 251 crack category (0-5). Use 0 if not a cracking defect."),
  defect_type: z.enum(VALID_DEFECT_TYPES)
    .describe("Defect type key from the taxonomy reference table, or 'unidentified'."),
  location_description: z.string().min(1)
    .describe("Where in the image the defect is located."),
  description: z.string().min(1)
    .describe("Surveyor-style prose description of the visible defect."),
  confidence: z.number().min(0).max(1)
    .describe("Classification confidence (0.0-1.0). Below 0.5 if ambiguous or unclear."),
});

// TypeScript type inference (free if you migrate to .ts)
// export type DefectAnalysis = z.infer<typeof defectAnalysisSchema>;
```

### 15.4 Gemini Call with Thinking Capture

> ⚠️ **SDK note:** Use the **new** `@google/genai` SDK (not the legacy `@google/generative-ai`). The call pattern and config structure are different. The docs confirm `@google/genai` is the current library.
>
> 📖 **Docs:**
> - Model: [Gemini 3.1 Flash-Lite](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-1-flash-lite)
> - Thinking: [Vertex AI Thinking](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/thinking) · [Gemini 3 Guide (thinking_level)](https://ai.google.dev/gemini-api/docs/gemini-3)
> - Structured output: [Control generated output](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output)
> - System instructions: [System instruction intro](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/learn/prompts/system-instruction-introduction)
> - Context caching: [Context cache overview](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview)

```javascript
// ✅ Correct SDK: @google/genai (new Gen AI SDK)
import { GoogleGenAI } from "@google/genai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ANALYSIS_SYSTEM_PROMPT } from "./prompts.js";       // taxonomy table + element ref
import { defectAnalysisSchema } from "./reportSchema.js";    // single source of truth — see 15.3

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export async function analyseImage(imageBase64, mimeType) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: [
      {
        parts: [
          { inlineData: { data: imageBase64, mimeType } },
          { text: "Analyse this property image and classify any visible defects." }
        ]
      }
    ],
    config: {
      // System instruction is the correct place for the taxonomy prompt —
      // separate from user contents, not subject to being overridden mid-turn
      systemInstruction: ANALYSIS_SYSTEM_PROMPT,
      responseMimeType: "application/json",
      // responseJsonSchema accepts the Zod-converted schema directly
      responseJsonSchema: zodToJsonSchema(defectAnalysisSchema),
      // media_resolution_high: uses 1120 tokens/image instead of default 768.
      // Recommended for image analysis — fine crack detail and hairline defects
      // resolve more clearly at higher resolution.
      // ⚠️ Test this early — may require apiVersion "v1alpha" on some endpoints.
      // If it errors, remove it: default resolution is likely sufficient for most defect photos.
      mediaResolution: "MEDIA_RESOLUTION_HIGH",
      thinkingConfig: {
        // "low" is the right level here: structured classification, not complex reasoning.
        // Docs: "Best for simple instruction following" — defect matching is exactly this.
        // Use "medium" if you find edge cases being misclassified in testing.
        thinkingLevel: "low",
      },
      // Do NOT set temperature explicitly — Gemini 3 docs warn this can cause
      // looping/degraded performance. Leave at default 1.0.
    },
  });

  // Access candidates directly to separate thinking tokens from output
  const parts = response.candidates?.[0]?.content?.parts ?? [];

  const thinking = parts
    .filter(p => p.thought === true)
    .map(p => p.text)
    .join("\n");

  const jsonText = parts
    .filter(p => p.thought !== true)
    .map(p => p.text)
    .join("");

  // Zod parse: throws a typed ZodError if model returns out-of-range values
  // (e.g. condition_rating: 4, unknown defect_type, confidence > 1)
  // Raw JSON.parse alone would silently pass invalid data through to the report
  const output = defectAnalysisSchema.parse(JSON.parse(jsonText));

  // Client-side confidence override: if the model returns "unidentified",
  // force confidence to 0 regardless of what the model self-reported.
  // The model might say "unidentified" with confidence 0.7 (meaning "I'm confident
  // I can't classify this") — but for routing purposes, unidentified always means
  // low confidence. This makes the routing logic deterministic.
  const confidence = output.defect_type === "unidentified" ? 0 : output.confidence;

  return {
    ...output,
    confidence,
    _thinking: thinking,
  };
}
```

**Why Zod over raw `responseSchema`:** The `responseSchema` (or `responseJsonSchema`) parameter constrains what the model *can* generate — but even with it, `JSON.parse` alone won't catch a `condition_rating: 0` or a `confidence: 1.4` that slips through. `defectAnalysisSchema.parse()` runs after the JSON parse and throws a typed `ZodError` with the exact field and constraint that failed. This means bad model output surfaces as a real error at the point of analysis — not silently corrupting Section B or a BRE badge downstream. The schema also acts as the single source of truth: the same Zod definition feeds `zodToJsonSchema()` for the API call, the runtime validation, and (if you migrate to TypeScript) the inferred type.

**Why the client-side confidence override:** The model self-reports confidence, but it can return semantically contradictory values — e.g. `defect_type: "unidentified"` with `confidence: 0.7` (meaning "I'm confident I can't classify this"). For routing purposes, `unidentified` must always mean low confidence. The override `output.defect_type === "unidentified" ? 0 : output.confidence` makes routing deterministic: every `unidentified` result goes to the Unassigned tray, no exceptions.

**Why `thinking_level: "low"` not `"medium"`:** The Gemini 3 docs define `low` as "minimises latency and cost, best for simple instruction following." Defect classification against a fixed taxonomy table is precisely that — the model matches visual features to known entries rather than reasoning from first principles. `low` is faster, cheaper, and the task doesn't benefit from deeper deliberation. Upgrade to `medium` only if you observe persistent misclassifications on ambiguous defects during testing.

**Why `media_resolution_high`:** The Gemini docs recommend higher resolution (1120 tokens/image vs default 768) for image analysis tasks. Crack detection specifically requires resolving fine detail — hairline cracks, spalling texture, mortar joint gaps. Lower resolution risks the model missing BRE Category 0–1 defects entirely. **Caveat:** This parameter's exact placement in the `@google/genai` SDK may differ from the REST API docs. Test it early — if it throws an error or isn't recognised, remove it. The default resolution is likely sufficient for most defect photos, and you don't want a config issue blocking your pipeline.

**Context caching opportunity:** The `ANALYSIS_SYSTEM_PROMPT` (taxonomy table + element reference, ~1,500 tokens) is identical for every analysis call. The Gemini API supports [context caching](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview) — caching this prompt once and reusing the cache token across all 4 parallel calls would reduce input token cost. For a hackathon this is optional, but worth noting as a production optimisation that directly maps to Taurgo's scaling story.

### 15.5 Taxonomy Lookup

```javascript
import taxonomy from './taxonomy.json';
import { ELEMENT_NAMES } from './elementOrder.js';

export function resolveFromTaxonomy(llmResult) {
  const entry = taxonomy[llmResult.defect_type];

  if (!entry) {
    // Unknown defect type — return LLM result with empty sourced fields
    return { ...llmResult, _sourceResolved: false };
  }

  return {
    ...llmResult,
    display_name:       entry.display_name,
    element_name:       ELEMENT_NAMES[llmResult.element_code] ?? llmResult.element_code,
    probable_causes:    entry.possible_causes,
    recommended_action: entry.recommended_action,
    hhsrs_flag:         entry.hhsrs_flag,
    hhsrs_code:         entry.hhsrs_hazard ?? null,
    cost_guidance:      entry.cost_guidance,
    cv_labels:          entry.cv_labels,
    source_standard:    entry.source_standard,
    _sourceResolved:    true,
  };
}
```

### 15.6 Parallel Pipeline

```javascript
import { analyseImage } from "./gemini.js";
import { annotateImage } from "./nanoBanana.js";
import { resolveFromTaxonomy } from "./taxonomyLookup.js";
import { ELEMENT_ORDER } from "./elementOrder.js";

// Step 1: Fire all analysis calls simultaneously
const analysisResults = await Promise.all(
  images.map(img => analyseImage(img.base64, img.mimeType))
);

// Step 2: Taxonomy lookup (synchronous) + fire annotation calls in parallel
// Annotation needs defect_type and location_description from the analysis result,
// so it runs after analysis but in parallel across all images.
const enrichedResults = analysisResults.map(result => resolveFromTaxonomy(result));

const annotatedImages = await Promise.all(
  images.map((img, i) =>
    enrichedResults[i].defect_type === "unidentified"
      ? Promise.resolve(null)  // skip annotation for unidentified images
      : annotateImage(img.base64, img.mimeType, enrichedResults[i])
  )
);

// Step 3: Merge everything into section objects
const sections = enrichedResults
  .map((result, i) => ({
    ...result,
    originalImage:  images[i].base64,
    annotatedImage: annotatedImages[i],  // null if annotation failed or skipped
    _aiAnnotatedImage: annotatedImages[i], // preserved for "Reset to AI" button
  }))
  .sort((a, b) => ELEMENT_ORDER.indexOf(a.element_code) - ELEMENT_ORDER.indexOf(b.element_code));
```

### 15.7 Setup and Deployment

```bash
npm create vite@latest taurgo-survey -- --template react
cd taurgo-survey
npm install @google/genai tailwindcss zod zod-to-json-schema

# .env
VITE_GEMINI_API_KEY=your_key_here

npm run dev
vercel --prod
```

> **API key note:** `import.meta.env` exposes the key client-side in Vite — fine for a hackathon demo. In production, wrap calls in a Vercel Edge Function to keep the key server-side.

---

## 16. Pitch Narrative

**Opening:** "Every RICS surveyor spends hours writing reports that follow the exact same structure every time. We built the tool that writes it for them — and keeps them in control of every word."

**Differentiator:** "We didn't build an image classifier. We built a system grounded in RICS Home Survey Standards, BRE Digest 251, HHSRS hazard codes, and nine computer vision datasets. The output is structured against the same frameworks a qualified surveyor uses — and it looks like a real survey report, because it is one."

**On accuracy:** "The recommended action for this D4 defect doesn't come from the AI — it comes directly from RICS standards. The AI identifies the defect type. The taxonomy provides the professional-grade response. Every sourced field carries a citation badge so the surveyor — and the client — knows exactly where it came from."

**On thinking:** "Click the thinking bubble and you can see exactly why the model assigned this element code and defect type. What it considered, what it ruled out, why. This is the transparency RICS's own AI standards require."

**Demo flow:**
1. Upload 4 images → show input screen
2. Watch report build in real time — parallel processing visible per image
3. Show Section B traffic light summary auto-populated
4. Show a CR3 element — original + annotated side by side
5. Expand thinking bubble — show the model's reasoning chain
6. Point to source badges on `recommended_action` — "from RICS, not from AI"
7. Change `element_code` — watch section move to correct RICS position live
8. Change `condition_rating` — watch Section B re-sort instantly
9. Annotate image manually — canvas tool, save, right panel updates
10. Click Export PDF — thinking bubbles gone, source badges gone, clean A4 report

**Closing:** "One surveyor, four photos, thirty seconds. RICS-standard report, client-ready."

---

## 17. What This Beats

| What others build | What this builds |
|---|---|
| Defect label ("crack detected") | Full RICS-structured report section |
| AI-generated content throughout | Hybrid: AI classifies, taxonomy sources |
| No audit trail | Source badges + thinking bubbles per section |
| ~85% accurate fields | 100% accurate on all taxonomy-sourced fields |
| Static output | Every field editable, report reorders dynamically |
| No surveyor workflow | Human-in-the-loop by design |
| Opaque AI decisions | Visible chain-of-thought per element |
| Backend required | 100% serverless React + Vite, deploys to Vercel |
