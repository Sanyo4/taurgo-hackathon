import { GoogleGenAI } from '@google/genai'
import { defectAnalysisSchema, defectAnalysisJsonSchema } from './reportSchema'
import { ANALYSIS_SYSTEM_PROMPT } from './prompts'

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
})

export async function analyseImage(imageBase64, mimeType) {
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: [
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
      'Analyse this property defect image and return the classification as specified.',
    ],
    config: {
      systemInstruction: ANALYSIS_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseJsonSchema: defectAnalysisJsonSchema,
      thinkingConfig: { thinkingLevel: 'low' },
    },
  })

  // Separate thinking parts from output
  let thinking = ''
  let jsonText = ''

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.thought) {
        thinking += part.text + '\n'
      } else if (part.text) {
        jsonText += part.text
      }
    }
  }

  if (!jsonText) {
    jsonText = response.text
  }

  const raw = JSON.parse(jsonText)
  const parsed = defectAnalysisSchema.parse(raw)

  // Client-side confidence override: unidentified → confidence = 0
  if (parsed.defect_type === 'unidentified') {
    parsed.confidence = 0
  }

  return {
    ...parsed,
    _thinking: thinking || null,
  }
}
