const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

export const generateAIResponse = async (prompt) => {
    if (!API_KEY) {
        return "AI service is not configured. Please provide a valid API key in the .env file.";
    }

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173", // Required by OpenRouter
                "X-Title": "placely.ai",
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001", // Using a fast, capable model
                "messages": [
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content || "No response received.";
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "Sorry, I couldn't generate a response at this time. Please check your API key and connection.";
    }
};
