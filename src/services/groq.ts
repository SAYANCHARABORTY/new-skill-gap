import { StudentProfile, SkillGapItem, AIAnalysisResult } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const STORAGE_KEY_USER_GROQ_KEY = 'skillbridge_groq_api_key';

export function getGroqApiKey(): string {
  // Check local storage override first (set via UI), then Vite environment variable
  const storedKey = localStorage.getItem(STORAGE_KEY_USER_GROQ_KEY);
  if (storedKey && storedKey.trim().length > 0) {
    return storedKey.trim();
  }
  const envKey = (import.meta.env.VITE_GROQ_API_KEY as string) || '';
  return envKey.trim();
}

export function setGroqApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY_USER_GROQ_KEY, key.trim());
}

export function hasGroqApiKey(): boolean {
  const key = getGroqApiKey();
  return Boolean(key && key.length > 5 && !key.includes('YOUR_GROQ_API_KEY'));
}

export interface AnalyzeSkillGapParams {
  studentName: string;
  targetRole: string;
  skills: Array<{ name: string; proficiency?: string }>;
  college?: string;
  degree?: string;
  learningInterests?: string[];
  activeIndustryRequirements?: string[];
}

const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant'
];

async function executeGroqRequest(
  apiKey: string,
  payloadBuilder: (model: string) => object
): Promise<{ ok: boolean; status: number; data?: any; errorMsg?: string }> {
  let lastError = 'No response';
  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payloadBuilder(model))
      });

      if (response.ok) {
        const json = await response.json();
        return { ok: true, status: response.status, data: json };
      }

      const errJson = await response.json().catch(() => ({}));
      const errMessage = errJson?.error?.message || `HTTP ${response.status}`;
      lastError = errMessage;

      // If the model does not exist or isn't accessible, try the next model in the list
      if (
        response.status === 404 ||
        errMessage.includes('does not exist') ||
        errMessage.includes('model_not_found') ||
        errMessage.includes('decommissioned')
      ) {
        continue;
      } else {
        // If it's an auth error or rate limit, break immediately
        return { ok: false, status: response.status, errorMsg: errMessage };
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'Network error';
    }
  }
  return { ok: false, status: 500, errorMsg: lastError };
}

/**
 * Analyzes the student's real skills against their target career role using Groq AI.
 * Returns a validated, structured AIAnalysisResult with a dynamic 0-100 score.
 */
export async function analyzeSkillGapWithGroq(
  params: AnalyzeSkillGapParams
): Promise<{ success: boolean; data?: AIAnalysisResult; error?: string }> {
  const apiKey = getGroqApiKey();

  if (!apiKey || apiKey.includes('YOUR_GROQ_API_KEY')) {
    return {
      success: false,
      error: 'Groq API key is not configured. Please add your key in .env (VITE_GROQ_API_KEY) or in the NIRVANA settings modal.'
    };
  }

  const skillsList = params.skills.map(s => `${s.name}${s.proficiency ? ` (${s.proficiency})` : ''}`).join(', ');
  const industryReqs = params.activeIndustryRequirements && params.activeIndustryRequirements.length > 0
    ? params.activeIndustryRequirements.join(', ')
    : 'Standard industry benchmarks for ' + params.targetRole;

  const systemPrompt = `
You are the SkillBridge Industry AI Evaluation Engine.
Your task is to analyze a candidate's actual registered skills against their target career role and real industry requisitions.

CRITICAL INSTRUCTIONS:
1. Evaluate the relationship:
   STUDENT SKILLS -> TARGET ROLE -> REQUIRED INDUSTRY SKILLS -> PRACTICAL READINESS.
2. Calculate a realistic Skill Readiness Score strictly from 0 to 100 based on actual competence and depth.
   - Do NOT base score purely on count of skills. For example, a student with C and HTML wanting to be "Full Stack Developer" should score low-to-moderate (e.g. 25-45) because core stack (Node, React, Databases) is missing.
   - A student with React, Node.js, TypeScript, PostgreSQL, Docker for "Full Stack Developer" should score high (e.g. 78-92).
3. Identify:
   - strongSkills: Skills the student already possesses that are directly aligned and foundational/advanced for the role.
   - moderateSkills: Skills the student knows partially or that are tangentially helpful.
   - weakSkills: Possessed skills that need deeper mastery for production environments.
   - missingSkills: Critical industry skills the student does NOT possess yet for this role.
   - industryRequiredSkills: The complete modern tech stack expected by top hiring companies.
   - recommendations: 4-6 prioritized practical next steps.
   - projects: 2-3 specific real-world production projects to build.
   - roadmap: 3-5 phase structured learning progression.
4. Output MUST be valid JSON adhering strictly to this schema:
{
  "score": number,
  "summary": string,
  "strongSkills": string[],
  "moderateSkills": string[],
  "weakSkills": string[],
  "missingSkills": string[],
  "industryRequiredSkills": string[],
  "recommendations": string[],
  "projects": string[],
  "roadmap": string[]
}
`;

  const userPrompt = `
CANDIDATE DOSSIER:
- Name: ${params.studentName || 'Student'}
- Target Career / Role: ${params.targetRole || 'Software Engineer'}
- Academic Background: ${params.degree || 'Degree unspecified'} from ${params.college || 'Institution unspecified'}
- Current Registered Skills: ${skillsList || 'None entered yet'}
- Learning Interests: ${(params.learningInterests || []).join(', ') || 'General'}
- Active Industry Demands from Recruiters: ${industryReqs}

Perform rigorous, genuine skill gap analysis and return the JSON object now.
`;

  try {
    const result = await executeGroqRequest(apiKey, (model) => ({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1500
    }));

    if (!result.ok) {
      return { success: false, error: result.errorMsg || 'Groq API request failed.' };
    }

    const rawContent = result.data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      return { success: false, error: 'Empty response payload received from Groq AI.' };
    }

    const parsed = JSON.parse(rawContent);

    // Validate and sanitize score
    let score = Number(parsed.score);
    if (isNaN(score)) score = 50;
    // Helper to safely extract string array from any LLM response format
    const toStringArray = (items: unknown): string[] => {
      if (!Array.isArray(items)) return [];
      return items.map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'number' || typeof item === 'boolean') return String(item);
        if (item && typeof item === 'object') {
          const obj = item as Record<string, unknown>;
          const title = obj.phase || obj.title || obj.name || obj.step || '';
          const desc = Array.isArray(obj.goals) 
            ? obj.goals.join(', ') 
            : (obj.description || obj.details || obj.goal || '');
          if (title && desc) return `${title}: ${desc}`;
          if (title) return String(title);
          if (desc) return String(desc);
          return Object.values(obj).filter(v => typeof v === 'string').join(' - ') || 'Item';
        }
        return String(item ?? '');
      }).filter(s => s.trim().length > 0);
    };

    const validatedResult: AIAnalysisResult = {
      score,
      summary: typeof parsed.summary === 'string' 
        ? parsed.summary 
        : `Skill Readiness evaluated at ${score}/100 for ${params.targetRole}.`,
      strongSkills: toStringArray(parsed.strongSkills),
      moderateSkills: toStringArray(parsed.moderateSkills),
      weakSkills: toStringArray(parsed.weakSkills),
      missingSkills: toStringArray(parsed.missingSkills),
      industryRequiredSkills: toStringArray(parsed.industryRequiredSkills),
      recommendations: toStringArray(parsed.recommendations),
      projects: toStringArray(parsed.projects),
      roadmap: toStringArray(parsed.roadmap),
      analyzedAt: new Date().toISOString()
    };

    return { success: true, data: validatedResult };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown network failure';
    return { success: false, error: `Skill Analysis failed: ${msg}. Check your connection or Groq configuration.` };
  }
}

export interface NirvanaContext {
  studentProfile?: StudentProfile | null;
  activeSkillGaps?: SkillGapItem[];
  industryRequirements?: string[];
  latestAnalysis?: AIAnalysisResult | null;
}

export async function askNirvana(
  userQuery: string,
  history: Array<{ sender: 'user' | 'nirvana'; text: string }>,
  context?: NirvanaContext
): Promise<{ text: string; error?: string }> {
  const apiKey = getGroqApiKey();

  if (!apiKey || apiKey.includes('YOUR_GROQ_API_KEY')) {
    return {
      text: 'AI Guide is not configured yet. Please add the Groq API key in NIRVANA Settings or in your .env file (VITE_GROQ_API_KEY).',
      error: 'MISSING_API_KEY'
    };
  }

  // Construct context prompt using REAL student information only
  let studentContextPrompt = 'STUDENT CONTEXT: No student is currently logged in or profile is empty.';
  
  if (context?.studentProfile) {
    const p = context.studentProfile;
    const skillsList = p.skills && p.skills.length > 0 
      ? p.skills.map(s => `${s.name} (${s.proficiency})`).join(', ')
      : 'No skills added yet';

    studentContextPrompt = `
CURRENT LOGGED-IN STUDENT INFORMATION (REAL DATA ONLY):
- Name: ${p.name || 'Not provided'}
- College: ${p.college || 'Not specified'}
- Degree & Branch: ${p.degree || ''} ${p.branch || ''} (Year: ${p.year || 'Not specified'})
- Target Career/Role: ${p.targetCareer || 'Not specified'}
- Actual Registered Skills: ${skillsList}
- Learning Interests: ${(p.learningInterests || []).join(', ') || 'None specified'}
- Student Bio: ${p.bio || 'None'}
`;
  }

  let analysisContextPrompt = '';
  if (context?.latestAnalysis) {
    const a = context.latestAnalysis;
    analysisContextPrompt = `
LATEST GROQ SKILL READINESS EVALUATION:
- Readiness Score: ${a.score} / 100
- Strong Skills: ${a.strongSkills.join(', ') || 'None'}
- Moderate Skills: ${a.moderateSkills.join(', ') || 'None'}
- Missing Critical Skills: ${a.missingSkills.join(', ') || 'None'}
- Recommended Action Plan: ${a.recommendations.join('; ')}
`;
  }

  let marketGapPrompt = '';
  if (context?.activeSkillGaps && context.activeSkillGaps.length > 0) {
    const missingSkills = context.activeSkillGaps
      .filter(g => !g.isPossessedByStudent)
      .map(g => g.skill);
    const matchedSkills = context.activeSkillGaps
      .filter(g => g.isPossessedByStudent)
      .map(g => g.skill);

    marketGapPrompt = `
ACTIVE REAL INDUSTRY REQUISITIONS DETECTED:
- Required skills currently lacking in student's profile: ${missingSkills.length > 0 ? missingSkills.join(', ') : 'None identified'}
- Real skills student already possesses matching industry: ${matchedSkills.length > 0 ? matchedSkills.join(', ') : 'None matching yet'}
`;
  }

  const systemPrompt = `
You are NIRVANA — the cybernetic AI Guide of SkillBridge ("LEARN × PRACTICE × GET PLACED").
Your visual and vocal persona is sharp, encouraging, technical, structured, and futuristic (gaming HUD / cyber mentor style).

BEHAVIORAL RULES:
1. You are a practical educational and career assistant.
2. Ground all advice strictly in the student's REAL profile and AI Skill Analysis data provided below.
3. NEVER invent or hallucinate the student's skills, credentials, degree, or background.
4. If no student information exists, politely advise: "Complete your SkillBridge profile so NIRVANA can provide personalized guidance."
5. If specific details are missing to answer a question, explicitly ask for them rather than making them up.
6. NEVER promise or guarantee jobs, internships, or placements.
7. Provide structured, actionable learning paths, skill-gap roadmaps, practical project ideas, and interview prep.
8. Use clear formatting with bullet points and bold headers. Keep tone professional yet futuristic.

${studentContextPrompt}
${analysisContextPrompt}
${marketGapPrompt}
`;

  const messagesPayload = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    })),
    { role: 'user', content: userQuery }
  ];

  try {
    const result = await executeGroqRequest(apiKey, (model) => ({
      model,
      messages: messagesPayload,
      temperature: 0.6,
      max_tokens: 1200
    }));

    if (!result.ok) {
      return {
        text: `NIRVANA link error: ${result.errorMsg || 'Groq connection failed'}. Please verify your Groq API key.`,
        error: result.errorMsg
      };
    }

    const reply = result.data?.choices?.[0]?.message?.content || 'NIRVANA signal received, but response payload was empty.';
    return { text: reply };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown network failure';
    return {
      text: `NIRVANA Uplink disrupted: ${msg}. Check network connectivity and Groq API settings.`,
      error: msg
    };
  }
}
