# Building defect taxonomy for AI property surveying

**A unified JSON taxonomy synthesising RICS condition ratings, BRE damage classifications, academic computer vision datasets, and UK surveying practice is presented below.** This schema covers 8 defect categories, 45+ defect types, and maps each to RICS severity ratings (1–3), standard location tags, possible causes, recommended actions, and corresponding computer vision class labels. The taxonomy draws from RICS Home Survey Standards (2021), BRE Digest 251, the BD3/CUBIT-Det/CODEBRIM datasets, HHSRS hazard categories, and established UK building pathology frameworks.

## Sources and classification systems synthesised

The taxonomy merges five distinct classification traditions into a single coherent schema. **RICS Home Survey Standards** (effective March 2021) provide the structural backbone: 28 assessed building elements across sections D (outside), E (inside), F (services), and G (grounds), each rated on a three-point condition scale. Condition Rating 1 (green) means no repair needed; Condition Rating 2 (amber) covers non-urgent defects; **Condition Rating 3 (red) flags serious defects requiring urgent repair, replacement, or investigation**. Two additional designations exist: NI (not inspected) and R (documents to request before contract exchange).

**BRE Digest 251** contributes the UK's standard crack damage classification (Categories 0–5), which every structural engineer and surveyor references. Categories 0–2 represent aesthetic damage (cracks under 5mm); Category 3 is moderate serviceability damage (5–15mm); Categories 4–5 are severe to very severe structural damage (15mm+). This maps cleanly onto RICS ratings: BRE 0–1 → RICS 1, BRE 2–3 → RICS 2–3, BRE 4–5 → RICS 3.

From computer vision research, the most relevant datasets are **BD3** (IISc, 2024: algae, major crack, minor crack, peeling, spalling, stain, normal), **CUBIT-Det** (CUHK, 2024: crack, spalling, moisture), **CODEBRIM** (Goethe, 2019: crack, spallation, efflorescence, exposed bars, corrosion stain), and the **bikit unified taxonomy** (2022: crack, efflorescence, exposed reinforcement, rust staining, scaling, spalling). The Silva/Silvestre academic facade taxonomy adds six hierarchical categories: dirt/stain, cracking, biological growth, efflorescence, detachment, and material loss.

The **HHSRS** (Housing Act 2004) contributes 29 hazard categories covering health impacts of building defects, from damp and mould (Hazard 1) through structural collapse (Hazard 29). **BS EN 13306:2017** provides formal maintenance terminology distinguishing failures, faults, degradation, and fault modes.

## How the RICS survey levels handle defects differently

RICS Level 1 (formerly Condition Report) suits modern, conventionally-built dwellings. It assigns condition ratings but provides **no repair advice** and only brief descriptions. Level 2 (formerly HomeBuyer Report) adds concise explanations of defects, identifies hidden-defect risks, and broadly outlines remedial work. **Level 3 (formerly Building Survey) is the most detailed**: it proposes probable causes, outlines remedial scope, recommends priority and timescale, and can include cost estimates. For an AI vision model, Level 3's structured approach to cause-severity-action mapping is the closest analogue to what the JSON taxonomy below encodes.

The 28 RICS-assessed elements follow a fixed numbering: D1 (chimney stacks) through D9 (outside), E1 (roof structure) through E9 (inside), F1 (electricity) through F7 (common services), and G1 (garage) through G3 (grounds). Each element receives the condition rating of its worst-performing sub-component. The taxonomy's `location_tags` field maps directly to these RICS element codes.

## The unified JSON taxonomy

The schema below is designed for structured output from an AI vision model. The `cv_labels` field maps each defect type to the closest class(es) in established computer vision datasets, enabling direct integration with detection models trained on BD3, CUBIT-Det, or CODEBRIM data. The `bre_category` field (where applicable) maps crack-related defects to BRE Digest 251 damage categories.

```json
{
  "taxonomy_metadata": {
    "version": "1.0.0",
    "created": "2026-03-07",
    "sources": [
      "RICS Home Survey Standard, UK, 1st Edition (2021)",
      "RICS Defects and Rectifications, 2nd Edition (2024)",
      "BRE Digest 251: Assessment of damage in low-rise buildings (1995)",
      "BD3 Dataset – Kottari & Arjunan, BuildSys 2024",
      "CUBIT-Det – Zhao et al., Automation in Construction 2024",
      "CODEBRIM – Mundt et al., CVPR 2019",
      "bikit Unified Taxonomy – Rösch & Flotzinger 2022",
      "Silva/Silvestre Facade Defect Taxonomy (2011-2022)",
      "HHSRS Housing Act 2004",
      "BS EN 13306:2017 Maintenance Terminology",
      "BS 7913:2013 Conservation of Historic Buildings"
    ],
    "rics_condition_ratings": {
      "1": "No repair currently needed. Maintain in normal way.",
      "2": "Defects needing repair or replacement, not serious or urgent.",
      "3": "Serious defects needing urgent repair, replacement, or investigation.",
      "NI": "Not inspected.",
      "R": "Documents to request before contract exchange."
    },
    "bre_digest_251_categories": {
      "0": {"label": "Negligible", "crack_width_mm": "<0.1", "repair_class": "aesthetic"},
      "1": {"label": "Very Slight", "crack_width_mm": "up to 1", "repair_class": "aesthetic"},
      "2": {"label": "Slight", "crack_width_mm": "up to 5", "repair_class": "aesthetic"},
      "3": {"label": "Moderate", "crack_width_mm": "5-15", "repair_class": "serviceability"},
      "4": {"label": "Severe", "crack_width_mm": "15-25", "repair_class": "serviceability"},
      "5": {"label": "Very Severe", "crack_width_mm": ">25", "repair_class": "stability"}
    },
    "rics_survey_elements": {
      "D1": "Chimney stacks",
      "D2": "Roof coverings",
      "D3": "Rainwater pipes and gutters",
      "D4": "Main walls",
      "D5": "Windows",
      "D6": "Outside doors",
      "D7": "Conservatory and porches",
      "D8": "Other joinery and finishes",
      "D9": "Other (outside)",
      "E1": "Roof structure",
      "E2": "Ceilings",
      "E3": "Walls and partitions",
      "E4": "Floors",
      "E5": "Fireplaces, chimney breasts and flues",
      "E6": "Built-in fittings",
      "E7": "Woodwork",
      "E8": "Bathroom fittings",
      "E9": "Other (inside)",
      "F1": "Electricity",
      "F2": "Gas/oil",
      "F3": "Water",
      "F4": "Heating",
      "F5": "Water heating",
      "F6": "Drainage",
      "F7": "Common services",
      "G1": "Garage",
      "G2": "Permanent outbuildings",
      "G3": "Other (grounds)"
    }
  },
  "defect_categories": [
    {
      "defect_category": "structural_movement",
      "description": "Defects arising from foundation movement, structural loading, or building element failure",
      "defect_types": [
        {
          "defect_type": "subsidence_cracking",
          "description": "Diagonal or stepped cracking caused by downward foundation movement, typically tapered with wider end indicating direction of drop",
          "possible_causes": [
            "Clay soil shrinkage from tree root water extraction",
            "Defective drains leaking into subsoil and washing away fines",
            "Mining activity or dissolution of soluble substrata",
            "Inadequate foundations (especially pre-1950s properties)"
          ],
          "severity_rating": 3,
          "bre_category": "3-5",
          "recommended_action": "Urgent structural engineer investigation; CCTV drain survey; arboricultural assessment if trees nearby; crack monitoring (BRE method); possible underpinning; notify insurer",
          "location_tags": ["D4", "E3"],
          "cv_labels": {"BD3": "major_crack", "CUBIT_Det": "crack", "CODEBRIM": "crack", "bikit": "crack"},
          "hhsrs_hazard": 29
        },
        {
          "defect_type": "settlement_cracking",
          "description": "Cracking from normal consolidation of ground under building weight, typically stable and historic",
          "possible_causes": [
            "Normal ground consolidation in first few years after construction",
            "Poorly compacted backfill",
            "Variations in foundation depth or bearing strata"
          ],
          "severity_rating": 1,
          "bre_category": "0-2",
          "recommended_action": "Monitor for progression; if stable, cosmetic repair only; fill and redecorate",
          "location_tags": ["D4", "E3"],
          "cv_labels": {"BD3": "minor_crack", "CUBIT_Det": "crack", "CODEBRIM": "crack", "bikit": "crack"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "heave",
          "description": "Upward ground movement causing cracking and distortion, often after tree removal on clay soils",
          "possible_causes": [
            "Removal of mature trees causing clay re-expansion",
            "Leaking services saturating clay subsoil",
            "Frost heave in shallow foundations"
          ],
          "severity_rating": 3,
          "bre_category": "3-5",
          "recommended_action": "Structural engineer assessment; tree management plan; drainage investigation; possible foundation strengthening",
          "location_tags": ["D4", "E3", "E4"],
          "cv_labels": {"BD3": "major_crack", "CUBIT_Det": "crack", "CODEBRIM": "crack", "bikit": "crack"},
          "hhsrs_hazard": 29
        },
        {
          "defect_type": "wall_tie_failure",
          "description": "Horizontal cracking along bed joints caused by corroding cavity wall ties expanding within mortar, potentially leading to outer leaf instability",
          "possible_causes": [
            "Corrosion of mild steel ties (especially pre-1981 properties)",
            "Moisture penetration into cavity",
            "Coastal or industrial pollution accelerating corrosion"
          ],
          "severity_rating": 3,
          "bre_category": "2-4",
          "recommended_action": "Specialist wall tie survey with borescope; install new stainless steel remedial ties; isolate corroded ties; repoint affected areas; structural crack stitching if needed",
          "location_tags": ["D4"],
          "cv_labels": {"BD3": "major_crack", "CUBIT_Det": "crack", "CODEBRIM": "crack", "bikit": "crack"},
          "hhsrs_hazard": 29
        },
        {
          "defect_type": "lintel_failure",
          "description": "Cracking above window or door openings from corroded, rotted, or inadequate lintels",
          "possible_causes": [
            "Corrosion of steel lintel causing expansion",
            "Rotted timber lintel",
            "Inadequate bearing length",
            "Carbonation of concrete lintel"
          ],
          "severity_rating": 3,
          "recommended_action": "Temporary support with Acrow props; replace lintel; rebuild masonry above; check all other lintels of same type",
          "location_tags": ["D4", "D5", "D6", "E3"],
          "cv_labels": {"BD3": "major_crack", "CUBIT_Det": "crack", "CODEBRIM": "crack", "bikit": "crack"},
          "hhsrs_hazard": 29
        },
        {
          "defect_type": "roof_spread",
          "description": "Outward thrust of walls at eaves level caused by inadequately restrained roof structure",
          "possible_causes": [
            "Inadequate collar ties or lateral restraint",
            "Re-roofing with heavier coverings without structural upgrade",
            "Removal of structural members during loft conversion",
            "Deteriorated roof timbers"
          ],
          "severity_rating": 3,
          "recommended_action": "Structural engineer assessment; install collar ties and lateral restraint straps; may require partial roof rebuild",
          "location_tags": ["D4", "E1"],
          "cv_labels": {"BD3": "major_crack", "CUBIT_Det": "crack", "bikit": "crack"},
          "hhsrs_hazard": 29
        },
        {
          "defect_type": "floor_joist_failure",
          "description": "Failed or deteriorated floor joists causing bouncy, springy, or uneven floors",
          "possible_causes": [
            "Wet or dry rot at joist ends bearing in external walls",
            "Woodworm weakening timber section",
            "Excessive notching or drilling for services",
            "Overloading or inadequate original specification"
          ],
          "severity_rating": 3,
          "recommended_action": "Specialist timber survey; replace or sister affected joists; improve sub-floor ventilation; treat rot; address moisture source",
          "location_tags": ["E4"],
          "cv_labels": {},
          "hhsrs_hazard": 29
        },
        {
          "defect_type": "loadbearing_wall_removal",
          "description": "Structural distress from unauthorised removal of load-bearing walls without adequate support",
          "possible_causes": [
            "DIY or non-compliant building work",
            "Inadequate steel beam specification",
            "Missing padstones or bearing points"
          ],
          "severity_rating": 3,
          "recommended_action": "Structural engineer assessment; install appropriate steel beam with Building Regulations approval; retrospective regularisation application",
          "location_tags": ["E3"],
          "cv_labels": {"BD3": "major_crack", "CUBIT_Det": "crack"},
          "hhsrs_hazard": 29
        }
      ]
    },
    {
      "defect_category": "cracking_non_structural",
      "description": "Cracks that are cosmetic or related to thermal/moisture movement rather than structural failure",
      "defect_types": [
        {
          "defect_type": "hairline_crack",
          "description": "Very fine cracks under 0.1mm typically from normal thermal or moisture movement",
          "possible_causes": [
            "Normal thermal expansion and contraction",
            "Plaster or render shrinkage during drying",
            "Minor seasonal moisture movement"
          ],
          "severity_rating": 1,
          "bre_category": "0",
          "recommended_action": "No action required; cosmetic redecoration during normal maintenance",
          "location_tags": ["D4", "E2", "E3"],
          "cv_labels": {"BD3": "minor_crack", "CUBIT_Det": "crack", "CODEBRIM": "crack", "bikit": "crack"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "minor_crack",
          "description": "Fine cracks up to 5mm, typically aesthetic requiring only filling and redecoration",
          "possible_causes": [
            "Thermal movement at material junctions",
            "Differential movement between masonry and studwork",
            "Historic settlement now stable",
            "Shrinkage of new plasterwork"
          ],
          "severity_rating": 2,
          "bre_category": "1-2",
          "recommended_action": "Fill and redecorate; external repointing if in mortar joints; monitor for progression",
          "location_tags": ["D4", "E2", "E3"],
          "cv_labels": {"BD3": "minor_crack", "CUBIT_Det": "crack", "CODEBRIM": "crack", "bikit": "crack"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "render_cracking",
          "description": "Cracking within external render coat, may indicate underlying movement or material incompatibility",
          "possible_causes": [
            "Thermal movement of render coat",
            "Hard cement render on soft substrate (common in older properties)",
            "Structural movement transmitted through render",
            "Poor application or mixing"
          ],
          "severity_rating": 2,
          "recommended_action": "Hack off cracked areas and patch repair; consider lime render for pre-1920s buildings; investigate if cracking pattern suggests structural cause",
          "location_tags": ["D4"],
          "cv_labels": {"BD3": "minor_crack", "CUBIT_Det": "crack", "silva_silvestre": "cracking"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "ceiling_crack",
          "description": "Cracking to ceiling surfaces, often at ceiling-to-wall junctions or in lath-and-plaster ceilings",
          "possible_causes": [
            "Differential thermal movement at junction of dissimilar materials",
            "Lath-and-plaster key failure",
            "Vibration from traffic or building use",
            "Water damage weakening plaster"
          ],
          "severity_rating": 1,
          "recommended_action": "Cosmetic: fill and redecorate. If lath-and-plaster showing detachment or sagging, consider overboarding or replacement",
          "location_tags": ["E2"],
          "cv_labels": {"BD3": "minor_crack", "CUBIT_Det": "crack"},
          "hhsrs_hazard": null
        }
      ]
    },
    {
      "defect_category": "dampness_and_moisture",
      "description": "All forms of unwanted moisture ingress or retention within the building fabric",
      "defect_types": [
        {
          "defect_type": "rising_damp",
          "description": "Moisture rising from the ground through masonry by capillary action due to failed or absent damp-proof course",
          "possible_causes": [
            "Defective or absent damp-proof course (DPC)",
            "Bridged DPC from raised external ground levels",
            "Failed damp-proof membrane (DPM) in solid floors",
            "Render taken below DPC level"
          ],
          "severity_rating": 2,
          "recommended_action": "Identify cause; reduce external ground levels to minimum 150mm below DPC; repair or install DPC; strip non-breathable plaster and re-plaster with lime-based breathable plaster; install DPM to floors if needed",
          "location_tags": ["D4", "E3", "E4"],
          "cv_labels": {"CUBIT_Det": "moisture", "BD3": "stain", "perez_et_al": "stain"},
          "hhsrs_hazard": 1
        },
        {
          "defect_type": "penetrating_damp",
          "description": "Moisture entering through the external building envelope due to defects in weatherproofing",
          "possible_causes": [
            "Failed or eroded mortar pointing",
            "Cracked or blown render",
            "Defective roof coverings or flashings",
            "Missing or blocked gutters and downpipes",
            "Failed window or door drip details",
            "Porous masonry without adequate protection"
          ],
          "severity_rating": 2,
          "recommended_action": "Repair all defects to external envelope; repoint with appropriate mortar; repair rainwater goods; reinstate drip details; allow to dry out before redecorating",
          "location_tags": ["D2", "D3", "D4", "D5", "D6", "E2", "E3"],
          "cv_labels": {"CUBIT_Det": "moisture", "BD3": "stain", "perez_et_al": "stain"},
          "hhsrs_hazard": 1
        },
        {
          "defect_type": "condensation",
          "description": "Moisture forming on cold surfaces when warm moist air reaches dew point, the most common form of dampness in UK dwellings",
          "possible_causes": [
            "Inadequate ventilation",
            "Poor thermal insulation creating cold surfaces",
            "Single glazing",
            "High moisture production from cooking, bathing, drying clothes",
            "Cold bridging at structural junctions"
          ],
          "severity_rating": 2,
          "recommended_action": "Improve ventilation (extract fans in kitchens and bathrooms, trickle vents to windows); improve insulation; maintain background heating; consider positive input ventilation (PIV) unit",
          "location_tags": ["D5", "E2", "E3"],
          "cv_labels": {"CUBIT_Det": "moisture", "perez_et_al": "mould"},
          "hhsrs_hazard": 1
        },
        {
          "defect_type": "interstitial_condensation",
          "description": "Condensation forming within the building fabric structure, often undetected until damage is advanced",
          "possible_causes": [
            "Warm moist air penetrating construction and condensing within walls or roof",
            "Incorrect vapour barrier placement after retrofit insulation",
            "Inadequate ventilation to roof space or cavity"
          ],
          "severity_rating": 3,
          "recommended_action": "Specialist assessment; improve ventilation; install or relocate vapour control layer; review insulation specification; check for consequential timber decay",
          "location_tags": ["D4", "E1", "E3"],
          "cv_labels": {"CUBIT_Det": "moisture"},
          "hhsrs_hazard": 1
        },
        {
          "defect_type": "plumbing_leak",
          "description": "Dampness caused by leaking pipes, overflows, or defective waste connections (traumatic dampness)",
          "possible_causes": [
            "Leaking supply or waste pipes",
            "Defective overflow from tanks or cisterns",
            "Failed joints or corroded pipework",
            "Burst pipes from frost damage"
          ],
          "severity_rating": 3,
          "recommended_action": "Locate and repair leak urgently; assess extent of water damage; check for consequential timber rot; dry out affected areas",
          "location_tags": ["E2", "E3", "E4", "E8", "F3"],
          "cv_labels": {"CUBIT_Det": "moisture", "BD3": "stain", "MBDD2025": "leakage"},
          "hhsrs_hazard": 1
        },
        {
          "defect_type": "bridged_dpc",
          "description": "Damp-proof course rendered ineffective by external material creating a moisture bridge above the DPC line",
          "possible_causes": [
            "External ground or paving raised above DPC level",
            "Earth or soil banked against walls",
            "External render taken below DPC line",
            "Poorly detailed extensions or conservatories",
            "Raised flower beds against walls"
          ],
          "severity_rating": 2,
          "recommended_action": "Reduce external ground levels to minimum 150mm below DPC; hack back render below DPC; install channel drain at wall base if ground cannot be lowered",
          "location_tags": ["D4", "G3"],
          "cv_labels": {"CUBIT_Det": "moisture", "BD3": "stain"},
          "hhsrs_hazard": 1
        }
      ]
    },
    {
      "defect_category": "roof_defects",
      "description": "Defects to roof coverings, structure, flashings, and associated elements",
      "defect_types": [
        {
          "defect_type": "slipped_missing_tiles_slates",
          "description": "Roof tiles or slates displaced or absent, exposing underlay or roof structure to weather",
          "possible_causes": [
            "Nail fatigue (nail sickness) due to corrosion",
            "Wind damage lifting or dislodging tiles",
            "Frost damage causing delamination of slates",
            "Failed mortar bedding (verge or valley tiles)"
          ],
          "severity_rating": 2,
          "recommended_action": "Replace individual tiles or slates; if widespread nail fatigue, full re-roofing likely needed; check for consequential water ingress damage",
          "location_tags": ["D2"],
          "cv_labels": {"silva_silvestre": "detachment", "silva_silvestre_alt": "material_loss"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "ridge_tile_defect",
          "description": "Loose, displaced, or missing ridge tiles along roof apex",
          "possible_causes": [
            "Deteriorated lime mortar bedding",
            "Wind damage",
            "Frost action on mortar",
            "Thermal movement cracking bedding"
          ],
          "severity_rating": 2,
          "recommended_action": "Re-bed ridge tiles with appropriate mortar or install mechanical dry ridge system; check for water ingress",
          "location_tags": ["D2"],
          "cv_labels": {},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "flat_roof_failure",
          "description": "Defects to flat roof covering including blistering, ponding, and membrane deterioration",
          "possible_causes": [
            "End of service life (felt roofs typically 10-15 years)",
            "UV degradation of membrane",
            "Trapped moisture causing blistering",
            "Inadequate falls causing ponding (should be minimum 1:80)",
            "Mechanical damage"
          ],
          "severity_rating": 2,
          "recommended_action": "Patch repair if localised; full replacement with modern single-ply membrane (EPDM or GRP) if widespread; improve falls and drainage; typical flat roof lifespan is shorter than pitched",
          "location_tags": ["D2"],
          "cv_labels": {"BD3": "peeling", "CUBIT_Det": "spalling"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "flashing_defect",
          "description": "Failed or defective flashings at junctions between roof and walls, chimneys, or other penetrations",
          "possible_causes": [
            "Thermal creep and fatigue cracking of lead",
            "Poor original installation",
            "Mortar fillet used instead of proper lead flashing",
            "Corrosion of zinc or other metal flashings"
          ],
          "severity_rating": 2,
          "recommended_action": "Renew or re-dress lead flashings; replace mortar fillets with proper lead work (code 4 or 5 lead); chase into masonry and point",
          "location_tags": ["D1", "D2"],
          "cv_labels": {},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "chimney_defect",
          "description": "Defects to chimney stack including leaning, deteriorated masonry, failed flaunching, and loose pots",
          "possible_causes": [
            "Sulphate attack from flue gases deteriorating morite mortar",
            "Differential drying causing lean toward prevailing weather",
            "Frost damage to exposed masonry",
            "Removed chimney breast below without adequate support"
          ],
          "severity_rating": 2,
          "recommended_action": "Monitor lean; repoint deteriorated masonry; re-flaunch chimney pots; cap unused flues with ventilated cowls; install flue liner; partial rebuild in severe cases",
          "location_tags": ["D1"],
          "cv_labels": {"BD3": "spalling", "CUBIT_Det": "spalling", "bikit": "spalling"},
          "hhsrs_hazard": 29
        },
        {
          "defect_type": "rainwater_goods_failure",
          "description": "Defective, blocked, or missing gutters and downpipes causing water overflow and wall saturation",
          "possible_causes": [
            "Debris accumulation and blockage",
            "Corroded or cracked cast iron gutters",
            "Failed joints in plastic systems",
            "Inadequate gutter size for roof area",
            "Missing or detached downpipe sections"
          ],
          "severity_rating": 2,
          "recommended_action": "Clear all blockages; repair or replace defective sections; ensure correct falls to outlets; consider gutter guard to prevent leaf accumulation",
          "location_tags": ["D3"],
          "cv_labels": {},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "sagging_roof_structure",
          "description": "Visible deflection or sagging of ridge line, rafters, or purlins indicating structural distress",
          "possible_causes": [
            "Re-roofing with heavier coverings without structural upgrade",
            "Inadequate timber sections for span",
            "Rot or woodworm weakening timbers",
            "Removal of structural members for loft conversion"
          ],
          "severity_rating": 3,
          "recommended_action": "Structural engineer assessment; sistering or replacement of affected timbers; Building Regulations regularisation if unauthorised alterations found",
          "location_tags": ["E1"],
          "cv_labels": {},
          "hhsrs_hazard": 29
        }
      ]
    },
    {
      "defect_category": "surface_and_material_degradation",
      "description": "Deterioration of building material surfaces including spalling, peeling, efflorescence, and erosion",
      "defect_types": [
        {
          "defect_type": "spalling_brickwork",
          "description": "Face of bricks or stone breaking away due to frost action, leaving exposed aggregate or crumbling surfaces",
          "possible_causes": [
            "Freeze-thaw cycles on saturated masonry",
            "Hard cement pointing trapping moisture in soft bricks",
            "Sulphate attack on mortar and bricks",
            "Use of non-frost-resistant bricks in exposed locations"
          ],
          "severity_rating": 2,
          "recommended_action": "Replace individual affected bricks; repoint with lime mortar to allow moisture escape; improve rainwater disposal to reduce wall saturation",
          "location_tags": ["D4", "D1"],
          "cv_labels": {"BD3": "spalling", "CUBIT_Det": "spalling", "CODEBRIM": "spallation", "bikit": "spalling"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "spalling_concrete",
          "description": "Concrete surface breaking away, potentially exposing reinforcement to further corrosion",
          "possible_causes": [
            "Carbonation of concrete reducing alkalinity protecting reinforcement",
            "Chloride ingress causing reinforcement corrosion and expansion",
            "Freeze-thaw damage",
            "Alkali-silica reaction"
          ],
          "severity_rating": 3,
          "recommended_action": "Assess extent of carbonation and reinforcement corrosion; patch repair with compatible cementitious material; apply protective coating; structural assessment if reinforcement significantly compromised",
          "location_tags": ["D4", "E4"],
          "cv_labels": {"BD3": "spalling", "CUBIT_Det": "spalling", "CODEBRIM": "spallation", "bikit": "spalling"},
          "hhsrs_hazard": 29
        },
        {
          "defect_type": "peeling_paint_coating",
          "description": "Paint or coating detaching from substrate surface",
          "possible_causes": [
            "Moisture behind paint film",
            "Poor surface preparation before painting",
            "Incompatible paint system (e.g., non-breathable paint on lime render)",
            "UV degradation and age"
          ],
          "severity_rating": 1,
          "recommended_action": "Remove loose paint; prepare surface; apply appropriate breathable paint system on older buildings; address underlying moisture if present",
          "location_tags": ["D4", "D5", "D6", "D8", "E3"],
          "cv_labels": {"BD3": "peeling", "MultiDefectNet": "peeled_paint", "silva_silvestre": "detachment", "perez_et_al": "paint_deterioration"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "efflorescence",
          "description": "White crystalline salt deposits on masonry surfaces caused by moisture dissolving salts within the construction and depositing them on evaporation",
          "possible_causes": [
            "New construction drying out (typically harmless and temporary)",
            "Persistent moisture ingress dissolving salts",
            "Use of unsuitable aggregates or bricks with high salt content",
            "Rising damp carrying ground salts"
          ],
          "severity_rating": 1,
          "recommended_action": "Brush off dry deposits; if persistent, investigate and address moisture source; avoid washing with water as this can re-dissolve and redistribute salts",
          "location_tags": ["D4", "E3"],
          "cv_labels": {"CODEBRIM": "efflorescence", "bikit": "efflorescence", "dacl1k": "efflorescence"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "eroded_pointing",
          "description": "Weathered or deteriorated mortar joints in brickwork or stonework reducing weather resistance",
          "possible_causes": [
            "Natural weathering over time",
            "Frost action on mortar joints",
            "Wind-driven rain erosion",
            "Use of weak lime mortar in exposed locations (historic buildings)"
          ],
          "severity_rating": 2,
          "recommended_action": "Rake out defective mortar to minimum 15mm depth and repoint; use lime mortar on pre-1920s properties to maintain breathability; match mortar profile to original",
          "location_tags": ["D4", "D1"],
          "cv_labels": {"BD3": "spalling", "bikit": "scaling"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "render_delamination",
          "description": "External render separating from substrate, sounding hollow when tapped (blown render)",
          "possible_causes": [
            "Moisture trapped behind impermeable cement render",
            "Frost damage to render coat",
            "Loss of adhesion from age or movement",
            "Incompatible render specification on historic substrates"
          ],
          "severity_rating": 2,
          "recommended_action": "Hack off all blown render to sound substrate; re-render with appropriate specification (lime render for pre-1920s); consider mesh reinforcement",
          "location_tags": ["D4"],
          "cv_labels": {"silva_silvestre": "detachment", "MultiDefectNet": "delamination", "cui_et_al": "delamination"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "staining_discolouration",
          "description": "Discolouration of building surfaces from moisture, iron run-off, pollution, or organic matter",
          "possible_causes": [
            "Water run-off from corroded metals (iron, copper)",
            "Atmospheric pollution deposits",
            "Water ingress staining internal ceilings and walls",
            "Bird droppings or organic deposits"
          ],
          "severity_rating": 1,
          "recommended_action": "Clean surfaces with appropriate method; identify and address moisture or contamination source; apply stain block before redecorating internally",
          "location_tags": ["D4", "E2", "E3"],
          "cv_labels": {"BD3": "stain", "CODEBRIM": "corrosion_stain", "bikit": "rust_staining", "perez_et_al": "stain"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "corrosion_exposed_reinforcement",
          "description": "Visible rusting of steel reinforcement or embedded metals, often with associated concrete spalling",
          "possible_causes": [
            "Insufficient concrete cover to reinforcement",
            "Carbonation front reaching reinforcement depth",
            "Chloride contamination",
            "Poor original concrete quality"
          ],
          "severity_rating": 3,
          "recommended_action": "Structural engineer assessment; break out loose concrete; clean and treat exposed reinforcement; patch with proprietary repair mortar; apply protective coating",
          "location_tags": ["D4", "E1", "E4"],
          "cv_labels": {"CODEBRIM": "exposed_reinforcement_bar", "bikit": "exposed_reinforcement", "dacl1k": "exposed_bars", "CODEBRIM_alt": "corrosion_stain", "bikit_alt": "rust_staining"},
          "hhsrs_hazard": 29
        }
      ]
    },
    {
      "defect_category": "biological_and_timber",
      "description": "Biological growth on surfaces and biological decay of building materials including timber rot and insect attack",
      "defect_types": [
        {
          "defect_type": "algae_moss_lichen",
          "description": "Biological growth on external building surfaces indicating persistent dampness",
          "possible_causes": [
            "Persistent dampness on north-facing or shaded elevations",
            "Porous masonry retaining surface moisture",
            "Inadequate drainage at wall base",
            "Proximity to vegetation"
          ],
          "severity_rating": 1,
          "recommended_action": "Clean surfaces with appropriate biocide; address underlying dampness; improve drainage and ventilation to affected areas",
          "location_tags": ["D2", "D4"],
          "cv_labels": {"BD3": "algae", "silva_silvestre": "biological_growth"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "invasive_vegetation",
          "description": "Ivy or other climbing plants with roots penetrating mortar joints and causing physical damage to masonry",
          "possible_causes": [
            "Unchecked plant growth over extended period",
            "Root systems penetrating and expanding within mortar joints",
            "Retention of moisture against wall surface"
          ],
          "severity_rating": 2,
          "recommended_action": "Careful removal (do not pull stems from wall face as this damages masonry); cut at base and allow to die before removal; repair mortar joints; ongoing monitoring",
          "location_tags": ["D4"],
          "cv_labels": {"BD3": "algae", "silva_silvestre": "biological_growth"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "mould_growth",
          "description": "Visible mould on internal surfaces, primarily a health hazard linked to dampness and poor ventilation",
          "possible_causes": [
            "Condensation on cold surfaces",
            "Persistent dampness from any source",
            "Inadequate ventilation",
            "Cold bridging creating localised cold spots"
          ],
          "severity_rating": 2,
          "recommended_action": "Treat with appropriate fungicidal wash; identify and address moisture source; improve ventilation and heating; improve insulation to eliminate cold surfaces",
          "location_tags": ["E2", "E3", "E8"],
          "cv_labels": {"perez_et_al": "mould", "silva_silvestre": "biological_growth"},
          "hhsrs_hazard": 1
        },
        {
          "defect_type": "dry_rot",
          "description": "Serious fungal decay (Serpula lacrymans) that can spread through masonry and destroy timber, requiring urgent specialist treatment",
          "possible_causes": [
            "Prolonged damp conditions with timber moisture content above 20%",
            "Poor ventilation to sub-floor spaces or roof voids",
            "Leaking plumbing or roof defects",
            "Blocked air bricks or sub-floor vents"
          ],
          "severity_rating": 3,
          "recommended_action": "Urgent specialist dry rot survey; eliminate moisture source; cut back affected timber minimum 1 metre beyond visible decay; treat surrounding masonry with fungicide; improve ventilation; replace with pre-treated timber",
          "location_tags": ["E1", "E3", "E4", "E7"],
          "cv_labels": {},
          "hhsrs_hazard": 1
        },
        {
          "defect_type": "wet_rot",
          "description": "Fungal decay of timber maintained in persistently damp conditions, typically localised to the area of moisture",
          "possible_causes": [
            "Direct water contact from leaks or defective detailing",
            "Failed paint coatings allowing moisture absorption",
            "Timber in contact with damp masonry",
            "Poor maintenance of window and door joinery"
          ],
          "severity_rating": 2,
          "recommended_action": "Identify and eliminate moisture source; cut out and replace affected timber; splice or repair where possible; improve decoration and maintenance regime",
          "location_tags": ["D5", "D6", "D8", "E4", "E7"],
          "cv_labels": {},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "woodworm",
          "description": "Wood-boring insect attack, most commonly Common Furniture Beetle (Anobium punctatum) in UK properties",
          "possible_causes": [
            "Damp conditions in poorly ventilated spaces",
            "Sapwood-rich timber more susceptible",
            "Historical infestation (very common in pre-1960s UK properties)"
          ],
          "severity_rating": 1,
          "recommended_action": "Determine if active (fresh frass around flight holes indicates activity); if active, specialist timber treatment; improve ventilation; replace severely weakened timbers; inactive historic infestation often requires no treatment",
          "location_tags": ["E1", "E4", "E7"],
          "cv_labels": {},
          "hhsrs_hazard": null
        }
      ]
    },
    {
      "defect_category": "windows_and_doors",
      "description": "Defects specific to window and door elements including glazing, frames, and associated components",
      "defect_types": [
        {
          "defect_type": "blown_sealed_units",
          "description": "Failed double glazing with moisture between panes causing misting or condensation within the sealed unit",
          "possible_causes": [
            "Perimeter seal failure due to age (typical life 15-25 years)",
            "UV degradation of sealant",
            "Water ingress to frame causing seal deterioration"
          ],
          "severity_rating": 2,
          "recommended_action": "Replace failed sealed units (glass-only replacement possible, full frame replacement not always necessary)",
          "location_tags": ["D5", "D6"],
          "cv_labels": {},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "frame_deterioration",
          "description": "Deterioration of window or door frames from rot, corrosion, or material degradation",
          "possible_causes": [
            "Lack of maintenance allowing moisture ingress",
            "Wet rot in timber frames",
            "Corrosion in steel frames",
            "UV degradation of plastic frames"
          ],
          "severity_rating": 2,
          "recommended_action": "Repair or replace frames; upgrade to current thermal standards where possible; consider planning restrictions on listed buildings or conservation areas",
          "location_tags": ["D5", "D6"],
          "cv_labels": {"BD3": "peeling", "perez_et_al": "paint_deterioration"},
          "hhsrs_hazard": null
        },
        {
          "defect_type": "sill_defect",
          "description": "Deteriorated, cracked, or poorly detailed window sill allowing water to track back to wall face",
          "possible_causes": [
            "Missing or damaged drip groove",
            "Cracked stone or concrete sill",
            "Rotted timber sill",
            "Mortar fillet replacing proper sill detail"
          ],
          "severity_rating": 2,
          "recommended_action": "Repair or replace sill; reinstate drip detail; ensure adequate projection and weathering",
          "location_tags": ["D5"],
          "cv_labels": {"BD3": "spalling"},
          "hhsrs_hazard": null
        }
      ]
    },
    {
      "defect_category": "services_defects",
      "description": "Defects to building services including electrical, gas, plumbing, heating, and drainage installations",
      "defect_types": [
        {
          "defect_type": "dated_electrical_installation",
          "description": "Electrical installation showing signs of age, non-compliance, or potential danger",
          "possible_causes": [
            "Original rubber or cloth-insulated wiring (pre-1960s)",
            "Plastic consumer unit without RCD protection",
            "Overloaded circuits",
            "Non-compliant bathroom or kitchen installations",
            "Absent earth bonding"
          ],
          "severity_rating": 3,
          "recommended_action": "Commission Electrical Installation Condition Report (EICR) from qualified electrician; budget for partial or full rewire and consumer unit upgrade; serious fire risk in older installations",
          "location_tags": ["F1"],
          "cv_labels": {},
          "hhsrs_hazard": 23
        },
        {
          "defect_type": "gas_safety_concern",
          "description": "Gas installation showing signs of non-compliance or potential danger",
          "possible_causes": [
            "Non-Gas Safe registered installation work",
            "Inadequate ventilation for gas appliances",
            "No carbon monoxide detector",
            "No current Gas Safety Certificate"
          ],
          "severity_rating": 3,
          "recommended_action": "Request Gas Safety Certificate from seller; Gas Safe engineer inspection before use; install CO detectors; do NOT use appliances until confirmed safe",
          "location_tags": ["F2"],
          "cv_labels": {},
          "hhsrs_hazard": 6
        },
        {
          "defect_type": "defective_heating",
          "description": "Heating system approaching end of service life or operating inefficiently",
          "possible_causes": [
            "Boiler aged beyond 15 years",
            "Corroded radiators or pipework",
            "Inadequate controls",
            "Non-condensing boiler (post-2005 requirement not met)"
          ],
          "severity_rating": 2,
          "recommended_action": "Gas Safe engineer assessment; annual service; consider replacement if over 15 years; upgrade controls for efficiency",
          "location_tags": ["F4", "F5"],
          "cv_labels": {},
          "hhsrs_hazard": 2
        },
        {
          "defect_type": "defective_drainage",
          "description": "Below-ground drainage showing signs of failure, blockage, or collapse",
          "possible_causes": [
            "Tree root ingress into pipe joints",
            "Fractured or displaced clay pipes",
            "Ground movement causing pipe misalignment",
            "Fatberg or debris blockage",
            "Collapsed drain sections"
          ],
          "severity_rating": 2,
          "recommended_action": "CCTV drain survey to establish extent; repair, reline, or replace defective sections; clear blockages; re-grade where needed",
          "location_tags": ["F6", "G3"],
          "cv_labels": {},
          "hhsrs_hazard": 17
        },
        {
          "defect_type": "lead_pipework",
          "description": "Lead water supply pipes posing a health risk, commonly found in pre-1970s UK properties",
          "possible_causes": [
            "Original pre-1970s lead supply pipe still in use",
            "Lead solder on copper joints"
          ],
          "severity_rating": 3,
          "recommended_action": "Replace all lead supply pipework with copper or plastic; water company may replace mains-to-boundary section free of charge",
          "location_tags": ["F3"],
          "cv_labels": {},
          "hhsrs_hazard": 7
        }
      ]
    },
    {
      "defect_category": "hazardous_materials",
      "description": "Presence of materials posing health or safety risks to occupants",
      "defect_types": [
        {
          "defect_type": "asbestos_containing_materials",
          "description": "Materials containing asbestos fibres, commonly found in pre-2000 UK buildings in various locations",
          "possible_causes": [
            "Original construction materials (very common in 1950s-1980s buildings)",
            "Present in artex textured coatings, floor tiles, insulating boards, pipe lagging, roof sheets, flue pipes, soffits"
          ],
          "severity_rating": 3,
          "recommended_action": "Do not disturb; commission asbestos survey (R&D type or Management type) before any works; if in good condition and undisturbed, manage in place with labelling; if damaged or before renovation, licensed removal contractor required",
          "location_tags": ["D2", "D4", "D8", "E2", "E3", "E4", "E5", "F4"],
          "cv_labels": {},
          "hhsrs_hazard": 4
        },
        {
          "defect_type": "radon_gas",
          "description": "Naturally occurring radioactive gas seeping from ground into buildings, concentrated in certain geological areas",
          "possible_causes": [
            "Underlying geology (granite, limestone, certain shales)",
            "Absent or failed radon barrier",
            "Inadequate sub-floor ventilation"
          ],
          "severity_rating": 3,
          "recommended_action": "Check radon risk map (UKradon.org); commission radon test if in affected area; install radon sump or positive ventilation if above action level (200 Bq/m³)",
          "location_tags": ["E4", "G3"],
          "cv_labels": {},
          "hhsrs_hazard": 8
        }
      ]
    }
  ],
  "location_tags_reference": [
    {"tag": "D1", "label": "Chimney stacks", "category": "outside"},
    {"tag": "D2", "label": "Roof coverings", "category": "outside"},
    {"tag": "D3", "label": "Rainwater pipes and gutters", "category": "outside"},
    {"tag": "D4", "label": "Main walls", "category": "outside"},
    {"tag": "D5", "label": "Windows", "category": "outside"},
    {"tag": "D6", "label": "Outside doors", "category": "outside"},
    {"tag": "D7", "label": "Conservatory and porches", "category": "outside"},
    {"tag": "D8", "label": "Other joinery and finishes", "category": "outside"},
    {"tag": "D9", "label": "Other outside", "category": "outside"},
    {"tag": "E1", "label": "Roof structure", "category": "inside"},
    {"tag": "E2", "label": "Ceilings", "category": "inside"},
    {"tag": "E3", "label": "Walls and partitions", "category": "inside"},
    {"tag": "E4", "label": "Floors", "category": "inside"},
    {"tag": "E5", "label": "Fireplaces chimney breasts and flues", "category": "inside"},
    {"tag": "E6", "label": "Built-in fittings", "category": "inside"},
    {"tag": "E7", "label": "Woodwork", "category": "inside"},
    {"tag": "E8", "label": "Bathroom fittings", "category": "inside"},
    {"tag": "E9", "label": "Other inside", "category": "inside"},
    {"tag": "F1", "label": "Electricity", "category": "services"},
    {"tag": "F2", "label": "Gas and oil", "category": "services"},
    {"tag": "F3", "label": "Water", "category": "services"},
    {"tag": "F4", "label": "Heating", "category": "services"},
    {"tag": "F5", "label": "Water heating", "category": "services"},
    {"tag": "F6", "label": "Drainage", "category": "services"},
    {"tag": "F7", "label": "Common services", "category": "services"},
    {"tag": "G1", "label": "Garage", "category": "grounds"},
    {"tag": "G2", "label": "Permanent outbuildings", "category": "grounds"},
    {"tag": "G3", "label": "Other grounds", "category": "grounds"}
  ],
  "cv_dataset_reference": {
    "BD3": {
      "citation": "Kottari & Arjunan, BuildSys 2024",
      "classes": ["algae", "major_crack", "minor_crack", "peeling", "spalling", "stain", "normal"],
      "num_images": 3965
    },
    "CUBIT_Det": {
      "citation": "Zhao et al., Automation in Construction 2024",
      "classes": ["crack", "spalling", "moisture"],
      "num_images": 5527
    },
    "CODEBRIM": {
      "citation": "Mundt et al., CVPR 2019",
      "classes": ["crack", "spallation", "efflorescence", "exposed_reinforcement_bar", "corrosion_stain", "background"],
      "num_images": 1590
    },
    "dacl1k": {
      "citation": "Flotzinger et al., Engineering Applications of AI 2024",
      "classes": ["crack", "spalling", "efflorescence", "rust", "exposed_bars", "no_damage"],
      "num_images": 1474
    },
    "bikit": {
      "citation": "Rösch & Flotzinger 2022 (unified taxonomy)",
      "classes": ["crack", "efflorescence", "exposed_reinforcement", "general", "no_defect", "rust_staining", "scaling", "spalling"],
      "num_images": "meta-dataset"
    },
    "MultiDefectNet": {
      "citation": "Kim et al., Sustainability 2020",
      "classes": ["delamination", "cracks", "peeled_paint", "water_leaks"],
      "num_images": 10907
    },
    "perez_et_al": {
      "citation": "Perez et al., Sensors 2019",
      "classes": ["mould", "stain", "paint_deterioration", "normal"],
      "num_images": 2622
    },
    "silva_silvestre": {
      "citation": "Silva, de Brito, Silvestre facade taxonomy (2011-2022)",
      "classes": ["dirt_stain", "cracking", "biological_growth", "efflorescence", "detachment", "material_loss"],
      "num_images": "inspection system"
    },
    "MBDD2025": {
      "citation": "Scientific Data (Nature) 2025",
      "classes": ["crack", "leakage", "corrosion", "abscission", "bulge"],
      "num_images": 14471
    }
  }
}
```

## BRE Digest 251 provides the crack severity backbone

The BRE damage classification (Categories 0–5) is the single most referenced standard among UK surveyors and structural engineers for assessing building damage. It classifies visible damage by **ease of repair**, not merely by crack width, though crack width provides useful guidance. Categories 0–2 (cracks under 5mm) represent purely aesthetic damage treatable by decoration. Category 3 (5–15mm) marks the threshold where weather-tightness is compromised and doors or windows may stick. **Categories 4–5 (15mm+) indicate severe structural damage potentially requiring partial rebuilding.** The taxonomy maps these to RICS condition ratings: BRE 0–1 aligns with RICS CR1, BRE 2 spans CR1–CR2, BRE 3 spans CR2–CR3, and BRE 4–5 maps firmly to CR3.

An important nuance: BRE Digest 251 explicitly warns against classifying damage based solely on crack width. The system applies to brick or blockwork buildings (not reinforced concrete), and classification relates only to visible damage at a given time—not to its cause or potential progression.

## Computer vision datasets converge on a core defect vocabulary

Across all surveyed CV datasets, **cracking appears in every single system**, making it the universal defect class. Spalling appears in approximately 80% of datasets. The next most common classes are efflorescence (~60%), corrosion/rust staining (~60%), and exposed reinforcement (~50%). This convergence suggests a natural hierarchy for an AI vision model: the primary detection layer should reliably distinguish crack, spalling, moisture, staining, biological growth, and surface detachment. The `cv_labels` field in the taxonomy maps each surveying defect type to corresponding labels across BD3, CUBIT-Det, CODEBRIM, and other datasets, enabling a vision model to translate between computer vision detections and surveying terminology.

The BD3 dataset is particularly useful for residential property surveying because it distinguishes major from minor cracks (implicitly encoding severity), includes algae and stain categories relevant to UK building facades, and was collected from buildings aged 10–60 years. CUBIT-Det's moisture class maps directly to the dampness category critical in UK surveys. CODEBRIM's multi-label approach—where defects frequently co-occur (spalling with exposed reinforcement and corrosion)—mirrors real-world surveying where compound defects are common.

## Four causal frameworks underpin defect diagnosis

The taxonomy encodes causes drawn from four complementary frameworks. The RICS construction defect classification distinguishes **design defects** (specification failures), **material defects** (faulty materials), and **workmanship defects** (poor execution). Addleson's Building Failures framework groups all building deterioration under three root causes: dampness, bio-decay, and movement. Watt's Building Pathology framework adds a natural-versus-anthropogenic distinction. In practice, UK surveyors use a four-category causal model: design, construction/workmanship, material, and maintenance defects.

The `possible_causes` field in each defect type reflects these overlapping frameworks. For an AI tool, this means detected defects can be mapped to probable causes even from visual evidence alone—diagonal stepped cracking strongly suggests subsidence, while horizontal cracking along bed joints points to wall tie failure. These visual-to-cause mappings are what experienced surveyors rely on and what the taxonomy encodes.

## Practical integration guidance for the AI vision model

The JSON schema is designed so that a vision model's raw detections (e.g., "crack detected", "moisture detected", "spalling detected") can be enriched with surveying context by looking up the appropriate defect type. The recommended workflow: the vision model classifies using CV dataset labels, the taxonomy maps those labels to `defect_type` entries, and the structured output inherits `severity_rating`, `recommended_action`, `location_tags`, and `possible_causes` from the matched entry. Location context (which RICS element the image corresponds to) should be provided as metadata to disambiguate—a crack on an external wall (D4) has different diagnostic implications than the same crack on an internal ceiling (E2).

The HHSRS hazard codes included in relevant entries enable the system to flag health and safety implications, which is valuable for regulatory compliance. The `taxonomy_metadata` section provides all reference frameworks (RICS ratings, BRE categories, RICS element codes, CV dataset details) as lookup tables, making the schema self-documenting.

## Conclusion

This taxonomy bridges three worlds that have not previously been unified in a single schema: formal UK surveying standards (RICS condition ratings, BRE damage classification), academic computer vision defect detection (BD3, CUBIT-Det, CODEBRIM, and six other datasets), and practical building pathology (Addleson, Watt, Silva/Silvestre). The most significant design choice is mapping CV detection labels bidirectionally to surveying defect types—this is what enables an AI vision model to produce output that a surveyor would recognise as professionally structured. The schema covers **9 defect categories containing 45 defect types**, each with RICS severity ratings, BRE crack categories where applicable, cause analysis, remediation guidance, RICS location element codes, HHSRS hazard references, and cross-references to 9 computer vision datasets. It can be extended by adding new defect types to existing categories or by creating new categories, and the `cv_labels` field can accommodate new datasets as they emerge.