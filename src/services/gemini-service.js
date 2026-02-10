// Gemini AI Service - Handles all AI API calls
// Uses Google Gemini Free Tier API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Send a prompt to Gemini and get a response
 * @param {string} prompt - The prompt to send
 * @param {string} systemInstruction - System context for the AI
 * @returns {Promise<string>} - The AI response text
 */
export async function askGemini(prompt, systemInstruction = '') {
    try {
        const contents = [];

        if (systemInstruction) {
            contents.push({
                role: 'user',
                parts: [{ text: systemInstruction }]
            });
            contents.push({
                role: 'model',
                parts: [{ text: 'Understood. I will follow these instructions.' }]
            });
        }

        contents.push({
            role: 'user',
            parts: [{ text: prompt }]
        });

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Gemini API error');
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

/**
 * Ask Gemini and parse JSON from response
 */
export async function askGeminiJSON(prompt, systemInstruction = '') {
    const fullInstruction = systemInstruction + '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no extra text. Just pure JSON.';
    const text = await askGemini(prompt, fullInstruction);

    // Clean response - remove markdown code blocks if present
    let cleaned = text.trim();
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    cleaned = cleaned.trim();

    try {
        return JSON.parse(cleaned);
    } catch (e) {
        console.warn('Failed to parse Gemini JSON, returning raw text:', cleaned);
        return { summary: cleaned, recommendations: [], tips: [] };
    }
}

/**
 * Generate AI Workout Plan
 */
export async function generateWorkoutPlan(userProfile) {
    const { age, weight, height, goal, experience, daysPerWeek } = userProfile;

    const systemInstruction = `You are an expert fitness coach AI. Generate personalized workout plans based on user data. Always respond in structured JSON format.`;

    const prompt = `Generate a ${daysPerWeek || 5}-day weekly workout plan for:
- Age: ${age} years
- Weight: ${weight} kg
- Height: ${height} cm
- Goal: ${goal}
- Experience: ${experience}

Respond ONLY with this JSON structure:
{
  "planName": "Plan name",
  "summary": "Brief overview of the plan",
  "weeklyPlan": [
    {
      "day": "Day 1",
      "focus": "Muscle group focus",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": 3,
          "reps": "10-12",
          "rest": "60 sec",
          "tip": "Brief form tip"
        }
      ],
      "duration": "45 min"
    }
  ],
  "tips": ["tip1", "tip2", "tip3"]
}`;

    return await askGeminiJSON(prompt, systemInstruction);
}

/**
 * Generate AI Diet Plan
 */
export async function generateDietPlan(userProfile, dietPreferences) {
    const { age, weight, height, goal } = userProfile;
    const { dietType, budget, mealsPerDay } = dietPreferences;

    const systemInstruction = `You are an expert nutritionist AI. Create personalized diet plans with Indian food options. Always respond in structured JSON format.`;

    const prompt = `Create a daily meal plan for:
- Age: ${age}, Weight: ${weight}kg, Height: ${height}cm
- Goal: ${goal}
- Diet: ${dietType} (veg/non-veg/vegan)
- Budget: ${budget}
- Meals per day: ${mealsPerDay || 4}

Respond ONLY with this JSON structure:
{
  "dailyCalories": 2200,
  "proteinTarget": "120g",
  "summary": "Brief diet overview",
  "meals": [
    {
      "meal": "Breakfast",
      "time": "8:00 AM",
      "items": ["food item 1", "food item 2"],
      "calories": 500,
      "protein": "25g"
    }
  ],
  "tips": ["tip1", "tip2"],
  "supplementSuggestions": ["suggestion1"]
}`;

    return await askGeminiJSON(prompt, systemInstruction);
}

/**
 * AI Chat for Members - Fitness Coach
 */
export async function chatWithCoach(message, userContext) {
    const systemInstruction = `You are "FitBot" - a friendly AI fitness coach inside the Fit Track Pro gym app. 
  
You help gym members with:
- Workout advice and exercise form tips
- Diet and nutrition guidance
- Motivation and fitness tips
- Answer questions about their progress

User Context:
- Name: ${userContext.name || 'Member'}
- Goal: ${userContext.goal || 'General Fitness'}
- Weight: ${userContext.weight || 'Not set'}kg
- Plan: ${userContext.plan || 'Not set'}
- Trainer: ${userContext.trainerName || 'Not assigned'}

Keep responses concise (2-4 sentences max), friendly, and motivational. Use emojis occasionally. If asked about something unrelated to fitness, politely redirect to fitness topics.`;

    return await askGemini(message, systemInstruction);
}

/**
 * AI Chat for Owners - Business Assistant
 */
export async function chatWithBusinessAI(message, businessContext) {
    const systemInstruction = `You are "BizBot" - an AI business assistant for gym owner in the Fit Track Pro app.

You help gym owners with:
- Business insights and analytics
- Member retention strategies
- Revenue optimization tips
- Gym management advice

Gym Context:
- Gym Name: ${businessContext.gymName || 'My Gym'}
- Total Members: ${businessContext.memberCount || 0}
- Total Trainers: ${businessContext.trainerCount || 0}
- Paid Bills: ${businessContext.paidBills || 0}
- Unpaid Bills: ${businessContext.unpaidBills || 0}
- Total Revenue: ₹${businessContext.totalRevenue || 0}

Keep responses concise, data-driven, and actionable. Focus on business growth.`;

    return await askGemini(message, systemInstruction);
}

/**
 * AI Chat for Trainers - Coaching Assistant
 */
export async function chatWithTrainerAI(message, trainerContext) {
    const systemInstruction = `You are "CoachBot" - an AI coaching assistant for gym trainers in the Fit Track Pro app.

You help trainers with:
- Client performance analysis
- Workout programming advice
- Member progress insights
- Training methodology tips

Trainer Context:
- Name: ${trainerContext.name || 'Trainer'}
- Specialization: ${trainerContext.specialization || 'General'}
- Assigned Members: ${trainerContext.memberCount || 0}

Keep responses concise and focused on coaching excellence.`;

    return await askGemini(message, systemInstruction);
}

/**
 * Generate Progress Insights
 */
export async function generateProgressInsights(progressData) {
    const systemInstruction = `You are a fitness data analyst. Analyze member progress and provide actionable insights. Respond in JSON format.`;

    const prompt = `Analyze this gym member's progress data and provide insights:
${JSON.stringify(progressData)}

Respond with JSON:
{
  "overallScore": 75,
  "summary": "Brief progress summary",
  "insights": [
    { "type": "positive/warning/info", "text": "insight text" }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "predictedGoalDate": "estimated date to reach goal"
}`;

    return await askGeminiJSON(prompt, systemInstruction);
}
