import { z } from 'zod'
import taxonomy from './taxonomy.json'
import { ELEMENT_ORDER } from './elementOrder'

// Extract all defect_type strings from nested taxonomy
const allDefectTypes = []
for (const category of taxonomy.defect_categories) {
  for (const entry of category.defect_types) {
    allDefectTypes.push(entry.defect_type)
  }
}
allDefectTypes.push('unidentified')

export const VALID_DEFECT_TYPES = allDefectTypes

// Zod schema for client-side validation
export const defectAnalysisSchema = z.object({
  element_code: z.enum(ELEMENT_ORDER),
  condition_rating: z.number().int().min(1).max(3),
  bre_category: z.number().int().min(0).max(5),
  defect_type: z.enum(VALID_DEFECT_TYPES),
  location_description: z.string(),
  description: z.string(),
  confidence: z.number().min(0).max(1),
})

// JSON Schema for Gemini API responseJsonSchema
export const defectAnalysisJsonSchema = {
  type: 'object',
  properties: {
    element_code: {
      type: 'string',
      enum: [...ELEMENT_ORDER],
    },
    condition_rating: {
      type: 'integer',
      minimum: 1,
      maximum: 3,
    },
    bre_category: {
      type: 'integer',
      minimum: 0,
      maximum: 5,
    },
    defect_type: {
      type: 'string',
      enum: [...allDefectTypes],
    },
    location_description: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1,
    },
  },
  required: [
    'element_code',
    'condition_rating',
    'bre_category',
    'defect_type',
    'location_description',
    'description',
    'confidence',
  ],
}
