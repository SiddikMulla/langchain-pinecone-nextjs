import { NextRequest, NextResponse } from 'next/server';
import { generateSpeech, TTSOptions } from '@/lib/tts';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
    try {
        console.log("TTS API route called");

        const { userId } = await auth();

        if (!userId) {
            console.log("Unauthorized access attempt");
            return NextResponse.json({ error: 'You must be signed in to use this feature.' }, { status: 401 });
        }

        const body = await request.json();
        console.log("Request body:", body);

        const { text, voice, responseFormat }: TTSOptions = body;

        if (!text || text.trim().length === 0) {
            console.log("Empty text provided");
            return NextResponse.json({ error: 'Please enter some text to convert to speech.' }, { status: 400 });
        }

        if (text.length > 5000) {
            console.log("Text too long:", text.length);
            return NextResponse.json({ error: 'The text is too long. Please keep it under 5000 characters.' }, { status: 400 });
        }

        if (!process.env.GROQ_API_KEY) {
            console.error("GROQ_API_KEY is not set in environment variables");
            return NextResponse.json({ error: 'Speech service is temporarily unavailable. Please try again later.' }, { status: 500 });
        }

        console.log("Generating speech for text length:", text.length);

        const audioBuffer = await generateSpeech({
            text,
            voice,
            responseFormat,
        });

        const base64Audio = audioBuffer.toString('base64');
        const mimeType = responseFormat === 'wav' ? 'audio/wav' : 'audio/mpeg';
        const audioDataUrl = `data:${mimeType};base64,${base64Audio}`;

        console.log("TTS generation successful, audio size:", audioBuffer.length);

        return NextResponse.json({
            success: true,
            audioUrl: audioDataUrl,
            message: 'Speech generated successfully!',
        });

    } catch (error: any) {
        console.error('TTS API error:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });

        let errorMessage = 'Something went wrong while generating speech. Please try again.';

        if (error.message.includes('Invalid API key')) {
            errorMessage = 'There was a problem connecting to the speech service. Please try again later.';
        } else if (error.message.includes('Rate limit')) {
            errorMessage = 'You’ve reached your daily limit for speech generation. Upgrade to Pro for higher limits.';
        } else if (error.message.includes('Invalid request')) {
            errorMessage = 'The input provided was not valid. Please check your text and try again.';
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
