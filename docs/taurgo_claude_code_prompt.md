Build the Taurgo AI Property Survey Tool as specified in taurgo-hackathon-solution.md.

This is a React + Vite SPA that analyses property defect images using Gemini 3.1 Flash-Lite and generates editable RICS Level 3 survey reports. The full architecture, file structure, API call patterns, component breakdown, and data flow are documented in the spec.

Reference files:
- taurgo-hackathon-solution.md → full spec (architecture, code, components, API patterns)
- taxonomy.json → defect taxonomy, goes in src/lib/taxonomy.json
- taxonomy_prompt_reference.md → condensed table for the LLM system prompt, embedded in src/lib/prompts.js
- rhs_level_three.pdf → the official RICS Level 3 report template — match the visual layout, purple (#4B2682) colour scheme, section structure (A–N), condition rating circles (green/amber/red), and per-element layout with photo left, notes right

Priority order — build in this sequence:
1. Project scaffolding: Vite + React + Tailwind + dependencies (@google/genai, zod, zod-to-json-schema)
2. src/lib/ first: reportSchema.js (Zod schema), prompts.js (system prompt with taxonomy table), elementOrder.js, taxonomyLookup.js, gemini.js (analyseImage function with thinking capture + confidence override)
3. InputScreen.jsx: property address + drag-and-drop multi-image upload
4. ProcessingScreen.jsx: parallel Promise.all analysis calls with per-image status
5. Report.jsx + ElementSection.jsx: RICS-styled report with editable fields, condition rating circles, source badges, thinking bubbles (collapsed, print:hidden)
6. SectionB.jsx: computed summary table, auto-updates on any condition rating change
7. UnassignedTray.jsx: holds images below 0.6 confidence threshold, element code dropdown promotes to main report
8. AnnotationCanvas.jsx + ImagePanel.jsx: canvas tool for manual annotation, save replaces right panel, reset restores AI version
9. Print CSS: @media print hides thinking bubbles, source badges, edit controls — clean A4 export via window.print()
10. nanoBanana.js: Nano Banana 2 annotation calls (parallel with analysis)

Do NOT create a backend. All API calls happen client-side. The API key is in .env as VITE_GEMINI_API_KEY.

Read the spec thoroughly before starting — every code pattern, schema definition, and design decision is documented there.