export default async function handler(req, res) {
    // Enable CORS for frontend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { prompt, systemInstruction } = req.body;

    // Get token from environment (Vercel secrets)
    const HF_TOKEN = process.env.VITE_HUGGING_FACE_TOKEN || process.env.HUGGING_FACE_TOKEN;

    if (!HF_TOKEN) {
        console.error('Server Error: Missing VITE_HUGGING_FACE_TOKEN');
        return res.status(500).json({ error: 'Server configuration error: Missing AI Token' });
    }

    // Llama 3 8B Instruct (Verified working on Serverless API)
    const MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct";
    const API_URL = "https://router.huggingface.co/v1/chat/completions";

    try {
        console.log(`Proxying request to Hugging Face: ${MODEL_ID}`);

        const messages = [];
        if (systemInstruction) {
            messages.push({ role: "system", content: systemInstruction });
        }
        messages.push({ role: "user", content: prompt });

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: messages,
                max_tokens: 1024,
                temperature: 0.7,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            console.error('Hugging Face API Error:', response.status, errData);

            // Check for loading state (common with free tier)
            if (errData.error && errData.error.includes("loading")) {
                return res.status(503).json({ error: "Model is loading. Please try again in 30 seconds." });
            }

            return res.status(response.status).json({
                error: errData.error?.message || errData.error || `Hugging Face API Error: ${response.status}`
            });
        }

        const result = await response.json();
        // OpenAI Format: choices[0].message.content
        const text = result.choices?.[0]?.message?.content || "No response generated.";
        return res.status(200).json({ text: text });

    } catch (error) {
        console.error('AI Proxy Error:', error);
        return res.status(500).json({ error: 'Internal Server Error: ' + error.message });
    }
}
