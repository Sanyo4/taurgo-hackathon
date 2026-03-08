import taxonomy from './taxonomy.json'

// Build flat index: defect_type string → full entry
const flatIndex = new Map()

for (const category of taxonomy.defect_categories) {
  for (const entry of category.defect_types) {
    flatIndex.set(entry.defect_type, {
      ...entry,
      defect_category: category.defect_category,
      category_description: category.description,
    })
  }
}

function toDisplayName(defectType) {
  return defectType
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function flattenCvLabels(cvLabels) {
  if (!cvLabels || typeof cvLabels !== 'object') return []
  return Object.values(cvLabels)
}

export function resolveFromTaxonomy(llmResult) {
  const entry = flatIndex.get(llmResult.defect_type)

  if (!entry) {
    return {
      ...llmResult,
      display_name: llmResult.defect_type === 'unidentified'
        ? 'Unidentified Defect'
        : toDisplayName(llmResult.defect_type),
      possible_causes: [],
      recommended_action: '',
      severity_rating: null,
      bre_category_range: null,
      location_tags: [],
      cv_labels: [],
      hhsrs_hazard: null,
      hhsrs_flag: false,
      defect_category: null,
      source_standard: null,
      _sourceResolved: false,
    }
  }

  return {
    ...llmResult,
    display_name: toDisplayName(entry.defect_type),
    possible_causes: entry.possible_causes || [],
    recommended_action: entry.recommended_action || '',
    severity_rating: entry.severity_rating,
    bre_category_range: entry.bre_category,
    location_tags: entry.location_tags || [],
    cv_labels: flattenCvLabels(entry.cv_labels),
    hhsrs_hazard: entry.hhsrs_hazard,
    hhsrs_flag: entry.hhsrs_hazard != null,
    defect_category: entry.defect_category,
    source_standard: 'RICS Home Survey Standard 2021',
    _sourceResolved: true,
  }
}

export function getAllDefectTypes() {
  return Array.from(flatIndex.keys())
}

export function getTaxonomyEntry(defectType) {
  return flatIndex.get(defectType) || null
}
