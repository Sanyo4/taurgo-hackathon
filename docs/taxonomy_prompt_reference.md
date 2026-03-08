# Defect Taxonomy Reference (for LLM prompt)

Use this table to match visible defects to the correct `defect_type` string.
Return ONLY a `defect_type` value from this list. If nothing matches, return `"unidentified"`.

| defect_type | Description (short) | Valid location_tags |
|---|---|---|
| `subsidence_cracking` | Diagonal or stepped cracking caused by downward foundation movement, typicall... | D4, E3 |
| `settlement_cracking` | Cracking from normal consolidation of ground under building weight, typically... | D4, E3 |
| `heave` | Upward ground movement causing cracking and distortion, often after tree remo... | D4, E3, E4 |
| `wall_tie_failure` | Horizontal cracking along bed joints caused by corroding cavity wall ties exp... | D4 |
| `lintel_failure` | Cracking above window or door openings from corroded, rotted, or inadequate l... | D4, D5, D6, E3 |
| `roof_spread` | Outward thrust of walls at eaves level caused by inadequately restrained roof... | D4, E1 |
| `floor_joist_failure` | Failed or deteriorated floor joists causing bouncy, springy, or uneven floors | E4 |
| `loadbearing_wall_removal` | Structural distress from unauthorised removal of load-bearing walls without a... | E3 |
| `hairline_crack` | Very fine cracks under 0.1mm typically from normal thermal or moisture movement | D4, E2, E3 |
| `minor_crack` | Fine cracks up to 5mm, typically aesthetic requiring only filling and redecor... | D4, E2, E3 |
| `render_cracking` | Cracking within external render coat, may indicate underlying movement or mat... | D4 |
| `ceiling_crack` | Cracking to ceiling surfaces, often at ceiling-to-wall junctions or in lath-a... | E2 |
| `rising_damp` | Moisture rising from the ground through masonry by capillary action due to fa... | D4, E3, E4 |
| `penetrating_damp` | Moisture entering through the external building envelope due to defects in we... | D2, D3, D4, D5, D6, E2, E3 |
| `condensation` | Moisture forming on cold surfaces when warm moist air reaches dew point, the ... | D5, E2, E3 |
| `interstitial_condensation` | Condensation forming within the building fabric structure, often undetected u... | D4, E1, E3 |
| `plumbing_leak` | Dampness caused by leaking pipes, overflows, or defective waste connections (... | E2, E3, E4, E8, F3 |
| `bridged_dpc` | Damp-proof course rendered ineffective by external material creating a moistu... | D4, G3 |
| `slipped_missing_tiles_slates` | Roof tiles or slates displaced or absent, exposing underlay or roof structure... | D2 |
| `ridge_tile_defect` | Loose, displaced, or missing ridge tiles along roof apex | D2 |
| `flat_roof_failure` | Defects to flat roof covering including blistering, ponding, and membrane det... | D2 |
| `flashing_defect` | Failed or defective flashings at junctions between roof and walls, chimneys, ... | D1, D2 |
| `chimney_defect` | Defects to chimney stack including leaning, deteriorated masonry, failed flau... | D1 |
| `rainwater_goods_failure` | Defective, blocked, or missing gutters and downpipes causing water overflow a... | D3 |
| `sagging_roof_structure` | Visible deflection or sagging of ridge line, rafters, or purlins indicating s... | E1 |
| `spalling_brickwork` | Face of bricks or stone breaking away due to frost action, leaving exposed ag... | D4, D1 |
| `spalling_concrete` | Concrete surface breaking away, potentially exposing reinforcement to further... | D4, E4 |
| `peeling_paint_coating` | Paint or coating detaching from substrate surface | D4, D5, D6, D8, E3 |
| `efflorescence` | White crystalline salt deposits on masonry surfaces caused by moisture dissol... | D4, E3 |
| `eroded_pointing` | Weathered or deteriorated mortar joints in brickwork or stonework reducing we... | D4, D1 |
| `render_delamination` | External render separating from substrate, sounding hollow when tapped (blown... | D4 |
| `staining_discolouration` | Discolouration of building surfaces from moisture, iron run-off, pollution, o... | D4, E2, E3 |
| `corrosion_exposed_reinforcement` | Visible rusting of steel reinforcement or embedded metals, often with associa... | D4, E1, E4 |
| `algae_moss_lichen` | Biological growth on external building surfaces indicating persistent dampness | D2, D4 |
| `invasive_vegetation` | Ivy or other climbing plants with roots penetrating mortar joints and causing... | D4 |
| `mould_growth` | Visible mould on internal surfaces, primarily a health hazard linked to dampn... | E2, E3, E8 |
| `dry_rot` | Serious fungal decay (Serpula lacrymans) that can spread through masonry and ... | E1, E3, E4, E7 |
| `wet_rot` | Fungal decay of timber maintained in persistently damp conditions, typically ... | D5, D6, D8, E4, E7 |
| `woodworm` | Wood-boring insect attack, most commonly Common Furniture Beetle (Anobium pun... | E1, E4, E7 |
| `blown_sealed_units` | Failed double glazing with moisture between panes causing misting or condensa... | D5, D6 |
| `frame_deterioration` | Deterioration of window or door frames from rot, corrosion, or material degra... | D5, D6 |
| `sill_defect` | Deteriorated, cracked, or poorly detailed window sill allowing water to track... | D5 |
| `dated_electrical_installation` | Electrical installation showing signs of age, non-compliance, or potential da... | F1 |
| `gas_safety_concern` | Gas installation showing signs of non-compliance or potential danger | F2 |
| `defective_heating` | Heating system approaching end of service life or operating inefficiently | F4, F5 |
| `defective_drainage` | Below-ground drainage showing signs of failure, blockage, or collapse | F6, G3 |
| `lead_pipework` | Lead water supply pipes posing a health risk, commonly found in pre-1970s UK ... | F3 |
| `asbestos_containing_materials` | Materials containing asbestos fibres, commonly found in pre-2000 UK buildings... | D2, D4, D8, E2, E3, E4, E5, F4 |
| `radon_gas` | Naturally occurring radioactive gas seeping from ground into buildings, conce... | E4, G3 |

## Element Code Reference

| Code | Element |
|---|---|
| D1 | Chimney stacks |
| D2 | Roof coverings |
| D3 | Rainwater pipes and gutters |
| D4 | Main walls |
| D5 | Windows |
| D6 | Outside doors |
| D7 | Conservatory and porches |
| D8 | Other joinery and finishes |
| D9 | Other (outside) |
| E1 | Roof structure |
| E2 | Ceilings |
| E3 | Walls and partitions |
| E4 | Floors |
| E5 | Fireplaces, chimney breasts and flues |
| E6 | Built-in fittings |
| E7 | Woodwork |
| E8 | Bathroom fittings |
| E9 | Other (inside) |
| F1 | Electricity |
| F2 | Gas/oil |
| F3 | Water |
| F4 | Heating |
| F5 | Water heating |
| F6 | Drainage |
| F7 | Common services |
| G1 | Garage |
| G2 | Permanent outbuildings |
| G3 | Other (grounds) |

## Condition Rating Reference

| Rating | Meaning |
|---|---|
| 1 | No repair needed |
| 2 | Non-urgent repair needed |
| 3 | Urgent repair/investigation needed |

## BRE Crack Categories

| BRE Cat | Width | Severity |
|---|---|---|
| 0 | <0.1mm | Negligible |
| 1 | up to 1mm | Very slight |
| 2 | up to 5mm | Slight |
| 3 | 5-15mm | Moderate |
| 4 | 15-25mm | Severe |
| 5 | >25mm | Very severe |