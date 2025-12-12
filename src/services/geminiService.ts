import { TranscriptionResult } from "../types";

// Cloudflare Worker Proxy URL - kein API-Key mehr nötig!
const WORKER_URL = "https://gemini-proxy.fischervorchdorf.workers.dev/";

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            const base64Content = base64Data.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Content,
                    mimeType: file.type,
                },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const transcribeKurrent = async (imageFile: File): Promise<TranscriptionResult> => {
    // Timeout after 60 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: Die Transkription dauert zu lange. Bitte versuchen Sie es mit einem kleineren Bild oder besserer Auflösung.')), 60000);
    });

    const transcriptionPromise = async (): Promise<TranscriptionResult> => {
        try {
            const imagePart = await fileToGenerativePart(imageFile);

            const systemInstruction = `
      Du bist ein Experte für alte deutsche Handschrift (Kurrentschrift/Sütterlin).
      Transkribiere den handgeschriebenen Text in moderne deutsche Schreibweise.
      
      Gib deine Antwort als JSON zurück:
      {"segments": [{"text": "Wort", "confidence": 95}]}
      
      - Teile den Text in Wörter oder kurze Phrasen
      - confidence: 95-100 (sehr sicher), 70-94 (ziemlich sicher), 0-69 (unsicher)
      - Bei unleserlichen Stellen: [?] mit niedriger Konfidenz
    `;

            const prompt = "Transkribiere diesen Kurrentschrift-Text. Gib JSON zurück.";

            // Cloudflare Worker Proxy Request
            const response = await fetch(WORKER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [imagePart, { text: prompt }]
                    }],
                    systemInstruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    generationConfig: {
                        temperature: 0.3,
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Worker request failed: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

            console.log("AI Response:", text);

            // Try to parse JSON response
            let parsed: any;
            try {
                // Try to extract JSON if it's wrapped in markdown code blocks
                const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
                const jsonText = jsonMatch ? jsonMatch[1] : text;
                parsed = JSON.parse(jsonText);
            } catch (parseError) {
                console.error("JSON parse failed, using fallback:", parseError);
                // Fallback: create simple segments from the raw text
                const words = text.split(/\s+/).filter((w: string) => w.length > 0);
                parsed = {
                    segments: words.map((word: string) => ({
                        text: word,
                        confidence: 75 // Medium confidence as fallback
                    }))
                };
            }

            if (!parsed.segments || !Array.isArray(parsed.segments)) {
                console.error("Invalid format, using text as single segment");
                parsed = {
                    segments: [{
                        text: text,
                        confidence: 50
                    }]
                };
            }

            // Build full text from segments
            const fullText = parsed.segments.map((seg: any) => seg.text).join(' ');

            return {
                segments: parsed.segments,
                fullText: fullText
            };

        } catch (error) {
            console.error("Kurrent transcription failed:", error);
            if (error instanceof Error) {
                console.error("Error message:", error.message);
                console.error("Error stack:", error.stack);
            }
            throw error;
        }
    };

    // Race between transcription and timeout
    return Promise.race([transcriptionPromise(), timeoutPromise]);
};
