import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

export interface TTSOptions {
    text: string;
    voice?: "Aaliyah-PlayAI" | "Darnell-PlayAI" | "Ethan-PlayAI" | "Freya-PlayAI" | "Grace-PlayAI" | "Marley-PlayAI" | "Rebecca-PlayAI" | "Sean-PlayAI" | "Sofia-PlayAI" | "Zachary-PlayAI";
    responseFormat?: "wav";
}

export async function generateSpeech(options: TTSOptions): Promise<Buffer> {
    const { text, voice = "Aaliyah-PlayAI", responseFormat = "wav" } = options;

    try {
        console.log("Generating speech with Groq TTS...");

        const response = await groq.audio.speech.create({
            model: "playai-tts",
            voice: voice,
            response_format: responseFormat,
            input: text,
        });

        const buffer = Buffer.from(await response.arrayBuffer());
        console.log("Speech generated successfully, buffer size:", buffer.length);
        return buffer;
    } catch (error: any) {
        console.error("Groq TTS error details:", {
            message: error.message,
            response: error?.response?.data,
            status: error?.response?.status,
            stack: error.stack
        });

        // More specific error handling
        if (error?.response?.status === 401) {
            throw new Error("Invalid API key for Groq TTS");
        } else if (error?.response?.status === 429) {
            throw new Error("Rate limit exceeded for Groq TTS");
        } else if (error?.response?.status === 400) {
            throw new Error("Invalid request parameters for Groq TTS");
        } else {
            throw new Error(`Failed to generate speech: ${error.message}`);
        }
    }
}

// Alternative: Generate audio as data URL directly
export async function generateSpeechAsDataUrl(options: TTSOptions): Promise<string> {
    const buffer = await generateSpeech(options);
    const base64Audio = buffer.toString('base64');
    const mimeType = options.responseFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';
    return `data:${mimeType};base64,${base64Audio}`;
}

// Alternative: Generate audio as blob URL (for frontend use)
export function createAudioBlobUrl(buffer: Buffer, format: string = 'wav'): string {
    const mimeType = format === 'wav' ? 'audio/wav' : 'audio/mpeg';
    const blob = new Blob([buffer], { type: mimeType });
    return URL.createObjectURL(blob);
}