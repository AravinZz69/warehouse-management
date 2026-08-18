export function cleanAndParseJSON<T>(rawText: string): T {
  let cleaned = rawText.trim();
  // Strip Markdown code fence blocks ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error(`Failed to parse AI response into valid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}
