import taxonomy from './taxonomy.json'

export const ELEMENT_ORDER = [
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7',
  'G1', 'G2', 'G3',
]

export const ELEMENT_NAMES = taxonomy.taxonomy_metadata.rics_survey_elements

export function reorderSections(sections) {
  return [...sections].sort((a, b) => {
    const idxA = ELEMENT_ORDER.indexOf(a.element_code)
    const idxB = ELEMENT_ORDER.indexOf(b.element_code)
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB)
  })
}
