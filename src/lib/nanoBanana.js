import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
})

export async function annotateImage(imageBase64, mimeType, analysisResult) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: [
        {
          inlineData: {
            mimeType,
            data: imageBase64,
          },
        },
        `You are a building surveyor annotating a property defect image.
The defect has been classified as: ${analysisResult.defect_type} (${analysisResult.description}).
Element: ${analysisResult.element_code}
Condition Rating: ${analysisResult.condition_rating}

Please annotate the image by:
1. Drawing a red circle or outline around the area of the defect
2. Adding a text label with the defect type
3. Adding an arrow pointing to the specific area of concern

Return the annotated image.`,
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    })

    // Extract image part from response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            data: part.inlineData.data,
            mimeType: part.inlineData.mimeType || 'image/png',
          }
        }
      }
    }

    return null
  } catch (err) {
    console.warn('Annotation failed (non-critical):', err.message)
    return null
  }
}
