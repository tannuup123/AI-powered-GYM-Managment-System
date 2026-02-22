// AI Service - Handles all AI API calls using Vercel Serverless Function (Proxy)
// This avoids CORS issues by routing requests through our own backend

/**
 * Send a prompt to AI Proxy (which calls Hugging Face)
 */
export async function askAI(prompt, systemInstruction = '') {
    try {
        const response = await fetch('/api/ai-proxy', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt,
                systemInstruction
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.error || `HTTP ${response.status}`;
            throw new Error(errMsg);
        }

        const result = await response.json();
        return result.text;

    } catch (error) {
        console.error('AI Service Error:', error);
        throw error;
    }
}

/**
 * Ask AI and parse JSON from response — robust parser
 */
export async function askAIJSON(prompt, systemInstruction = '') {
    const jsonInstruction = systemInstruction + '\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanation, no code fences. Just the raw JSON object.';

    // Retry logic for JSON parsing
    let attempts = 0;
    let lastError = null;
    while (attempts < 3) {
        try {
            const text = await askAI(prompt, jsonInstruction);

            // Clean response
            let cleaned = text.trim();

            // Remove markdown code blocks
            cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
            cleaned = cleaned.trim();

            // Find the first { and last }
            const start = cleaned.indexOf('{');
            const end = cleaned.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                cleaned = cleaned.substring(start, end + 1);
            }

            // Fix common AI JSON issues:
            // 1. Remove trailing commas before ] or }
            cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
            // 2. Fix single quotes to double quotes (careful with apostrophes)
            // 3. Remove comments
            cleaned = cleaned.replace(/\/\/[^\n]*/g, '');

            try {
                return JSON.parse(cleaned);
            } catch (parseErr) {
                // Try to fix truncated JSON by closing unclosed brackets
                let fixed = cleaned;
                let openBraces = (fixed.match(/{/g) || []).length;
                let closeBraces = (fixed.match(/}/g) || []).length;
                let openBrackets = (fixed.match(/\[/g) || []).length;
                let closeBrackets = (fixed.match(/\]/g) || []).length;

                // Remove any trailing incomplete key-value (e.g., `"key": "val` or `"key":`)
                fixed = fixed.replace(/,\s*"[^"]*"\s*:\s*("[^"]*)?$/g, '');
                fixed = fixed.replace(/,\s*{[^}]*$/g, '');

                // Re-count after cleanup
                openBraces = (fixed.match(/{/g) || []).length;
                closeBraces = (fixed.match(/}/g) || []).length;
                openBrackets = (fixed.match(/\[/g) || []).length;
                closeBrackets = (fixed.match(/\]/g) || []).length;

                // Close unclosed brackets/braces
                while (closeBrackets < openBrackets) { fixed += ']'; closeBrackets++; }
                while (closeBraces < openBraces) { fixed += '}'; closeBraces++; }

                // Remove trailing commas again after fixes
                fixed = fixed.replace(/,\s*([\]}])/g, '$1');

                return JSON.parse(fixed);
            }
        } catch (e) {
            console.warn(`JSON Parse Attempt ${attempts + 1} failed:`, e);
            lastError = e;
            attempts++;
        }
    }

    // All attempts failed - return a fallback structure
    console.error('All JSON parse attempts failed:', lastError);
    return {
        error: "Failed to parse AI response",
        raw: "The AI returned an invalid response. Please try again."
    };
}

// ==========================================
// Domain Specific Functions (Same Interface)
// ==========================================

/**
 * Generate AI Workout Plan
 */
export async function generateWorkoutPlan(userProfile) {
    const { age, weight, height, goal, experience, daysPerWeek } = userProfile;

    const systemInstruction = `You are an expert fitness coach. Generate a personalized weekly workout plan.
    
    Return a valid JSON object with this exact structure:
    {
      "planName": "string",
      "summary": "string",
      "weeklyPlan": [
        {
          "day": "Day 1",
          "focus": "string",
          "exercises": [
            { "name": "string", "sets": "number/string", "reps": "string", "rest": "string", "tip": "string" }
          ],
          "duration": "string"
        }
      ],
      "tips": ["string", "string"]
    }`;

    const prompt = `Create a ${daysPerWeek || 5}-day workout plan for:
    Age: ${age}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${goal}, Experience: ${experience}.`;

    return await askAIJSON(prompt, systemInstruction);
}

/**
 * Generate AI Diet Plan
 */
export async function generateDietPlan(userProfile, dietPreferences) {
    const { age, weight, height, goal } = userProfile;
    const { dietType, budget, mealsPerDay } = dietPreferences;

    const systemInstruction = `You are an expert nutritionist. Create a personalized daily meal plan.
    
    Return a valid JSON object with this exact structure:
    {
      "dailyCalories": number,
      "proteinTarget": "string",
      "summary": "string",
      "meals": [
        { "meal": "Breakfast", "time": "string", "items": ["string"], "calories": number, "protein": "string" }
      ],
      "tips": ["string"],
      "supplementSuggestions": ["string"]
    }`;

    const prompt = `Create a diet plan for:
    Age: ${age}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${goal}.
    Preferences: ${dietType}, Budget: ${budget}, Meals: ${mealsPerDay || 4}.`;

    return await askAIJSON(prompt, systemInstruction);
}

/**
 * AI Chat for Members - Fitness Coach
 */
export async function chatWithCoach(message, userContext) {
    const systemInstruction = `You are "FitBot", a friendly gym coach. 
    User: ${userContext.name}, Goal: ${userContext.goal}.
    Keep answers concise, motivating, and related to fitness.`;

    return await askAI(message, systemInstruction);
}

/**
 * AI Chat for Owners - Business Assistant
 */
export async function chatWithBusinessAI(message, businessContext) {
    const systemInstruction = `You are "BizBot", a smart business consultant for a gym owner.
    Context: ${businessContext.memberCount} members, ₹${businessContext.totalRevenue} revenue.
    Provide data-driven, actionable business advice. Keep it professional and concise.`;

    return await askAI(message, systemInstruction);
}

/**
 * AI Chat for Trainers - Coaching Assistant
 */
export async function chatWithTrainerAI(message, trainerContext) {
    const systemInstruction = `You are "CoachBot", an assistant for professional trainers.
    Expertise: ${trainerContext.specialization}.
    Provide technical, science-based training advice.`;

    return await askAI(message, systemInstruction);
}

/**
 * Generate Progress Insights
 */
export async function generateProgressInsights(progressData) {
    const systemInstruction = `Analyze fitness progress data and return JSON.
    Structure:
    {
      "overallScore": number,
      "summary": "string",
      "insights": [{ "type": "positive/warning", "text": "string" }],
      "recommendations": ["string"],
      "predictedGoalDate": "string"
    }`;

    const prompt = `Analyze this progress: ${JSON.stringify(progressData)}`;

    return await askAIJSON(prompt, systemInstruction);
}
