// Gemini AI Integration — Uses real API when key is set, smart mock otherwise

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export interface StructuredReport {
  title: string;
  description: string;
  category: string;
  severity: number;
  peopleAffected: number;
  location: string;
  urgency: number;
}

export interface VolunteerMatchInsight {
  reasoning: string;
  topRecommendation: string;
  riskAssessment: string;
}

// ─── Core Report Processing ──────────────────────────────
export async function processReportWithAI(
  input: string,
  isImage: boolean = false
): Promise<StructuredReport> {
  if (!GEMINI_API_KEY) {
    await simulateDelay(1200); // Simulate processing time for demo
    return simulateReportResponse(input);
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a humanitarian crisis data analyst. Extract structured information from this field report.
              
Return ONLY valid JSON (no markdown, no code fences) with these exact fields:
- title (string, concise incident title, max 80 chars)
- description (string, clear summary of the situation)
- category (one of: health, food, disaster, shelter, logistics, education)
- severity (integer 1-10, where 10 is most severe)
- peopleAffected (integer, estimated number)
- location (string, best location description)
- urgency (integer 1-10, where 10 is most urgent)

Report: ${input}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.8,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return simulateReportResponse(input);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        title: String(parsed.title || input.slice(0, 60)),
        description: String(parsed.description || input),
        category: String(parsed.category || 'disaster'),
        severity: Math.min(10, Math.max(1, Number(parsed.severity) || 5)),
        peopleAffected: Math.max(1, Number(parsed.peopleAffected) || 50),
        location: String(parsed.location || 'Unknown'),
        urgency: Math.min(10, Math.max(1, Number(parsed.urgency) || 5)),
      };
    }
  } catch (error) {
    console.error('Gemini API call failed:', error);
  }

  return simulateReportResponse(input);
}

// ─── Volunteer Match Insights ────────────────────────────
export async function getMatchInsight(
  taskDescription: string,
  volunteerName: string,
  volunteerSkills: string[],
  matchScore: number
): Promise<VolunteerMatchInsight> {
  if (!GEMINI_API_KEY) {
    return {
      reasoning: `${volunteerName} is recommended based on proximity, skill alignment (${volunteerSkills.slice(0, 2).join(', ')}), and current availability. AI confidence: ${matchScore}%.`,
      topRecommendation: `Deploy ${volunteerName} immediately with a focus on ${volunteerSkills[0] || 'general support'}.`,
      riskAssessment: matchScore >= 80 ? 'Low risk — Strong match across all dimensions.' : 'Moderate risk — Consider backup volunteer.',
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an AI volunteer coordinator for disaster response. A task has been matched with a volunteer.

Task: ${taskDescription}
Volunteer: ${volunteerName}
Skills: ${volunteerSkills.join(', ')}
Match Score: ${matchScore}%

Return ONLY valid JSON with:
- reasoning (string, 2-3 sentences explaining why this volunteer is a good match)
- topRecommendation (string, 1 actionable sentence for the coordinator)
- riskAssessment (string, brief risk analysis of this assignment)`
            }]
          }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 300 }
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]) as VolunteerMatchInsight;
    }
  } catch (error) {
    console.error('Gemini match insight error:', error);
  }

  return {
    reasoning: `${volunteerName} is recommended based on proximity and skill alignment.`,
    topRecommendation: `Deploy ${volunteerName} with standard protocol.`,
    riskAssessment: matchScore >= 80 ? 'Low risk.' : 'Moderate risk.',
  };
}

// ─── Priority Scoring ────────────────────────────────────
export async function getAIPriorityScore(
  title: string,
  description: string,
  severity: number,
  peopleAffected: number
): Promise<number> {
  if (!GEMINI_API_KEY) {
    return severity * 0.5 + Math.min(peopleAffected / 500, 1) * 10 * 0.3 + severity * 0.2;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Rate the priority of this humanitarian crisis on a scale of 1.0 to 10.0. Return ONLY a JSON object: {"priority": number}

Title: ${title}
Description: ${description}
Severity: ${severity}/10
People Affected: ${peopleAffected}`
            }]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 50 }
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return Math.min(10, Math.max(1, Number(parsed.priority) || severity));
      }
    }
  } catch {}

  return severity;
}

// ─── Helpers ─────────────────────────────────────────────
function simulateDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function simulateReportResponse(input: string): StructuredReport {
  const lower = input.toLowerCase();
  let category = 'disaster';
  let severity = 7;
  let urgency = 7;

  if (lower.includes('medical') || lower.includes('health') || lower.includes('hospital') || lower.includes('medicine')) {
    category = 'health';
    severity = 8;
    urgency = 8;
  } else if (lower.includes('food') || lower.includes('hunger') || lower.includes('water') || lower.includes('nutrition')) {
    category = 'food';
    severity = 6;
    urgency = 7;
  } else if (lower.includes('shelter') || lower.includes('house') || lower.includes('tent') || lower.includes('homeless')) {
    category = 'shelter';
    severity = 5;
    urgency = 6;
  } else if (lower.includes('flood') || lower.includes('earthquake') || lower.includes('cyclone') || lower.includes('fire')) {
    category = 'disaster';
    severity = 9;
    urgency = 10;
  } else if (lower.includes('supply') || lower.includes('transport') || lower.includes('logistics') || lower.includes('delivery')) {
    category = 'logistics';
    severity = 6;
    urgency = 7;
  }

  // Extract number patterns for people affected
  const numberMatch = input.match(/(\d+)\s*(people|families|persons|residents|affected|stranded)/i);
  const peopleAffected = numberMatch ? parseInt(numberMatch[1]) * (numberMatch[2].toLowerCase() === 'families' ? 4 : 1) : Math.floor(Math.random() * 400) + 50;

  return {
    title: input.length > 80 ? input.slice(0, 77) + '...' : input.split('.')[0] || input.slice(0, 60),
    description: input,
    category,
    severity,
    peopleAffected,
    location: 'Kerala, India',
    urgency,
  };
}

export const isGeminiConfigured = !!GEMINI_API_KEY;
