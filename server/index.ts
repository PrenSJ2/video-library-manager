import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { GoogleGenAI, Type } from '@google/genai';
import { Video } from '../types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// This determines the root of the project, whether running from ts-node or from compiled JS in dist/
const isProd = __dirname.includes('dist');
const rootPath = path.join(__dirname, isProd ? '..' : '', '..');
const videosFilePath = path.join(rootPath, 'data', 'videos.json');


app.use(express.json());

// In-memory store that gets initialized from the JSON file
let videoStore: Video[] = [];

const initializeVideoStore = async () => {
    try {
        const data = await fs.readFile(videosFilePath, 'utf-8');
        const videos: Video[] = JSON.parse(data);
        // Sort initial data by date descending (newest first)
        videos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        videoStore = videos;
        console.log('Video store initialized successfully.');
    } catch (error) {
        console.error('Failed to initialize video store:', error);
        // If the file doesn't exist or is invalid, start with an empty array
        videoStore = [];
    }
};

// --- API ROUTES ---

// API endpoint to get all videos
app.get('/api/videos', (req: Request, res: Response) => {
    res.json(videoStore);
});

// API endpoint to add a new video
app.post('/api/videos', async (req: Request, res: Response) => {
    const { title, tags } = req.body;

    // Server-side validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ message: 'Video title is required and must be a non-empty string.' });
    }
    if (title.trim().length > 100) {
        return res.status(400).json({ message: 'Video title cannot exceed 100 characters.' });
    }
    if (!Array.isArray(tags) || tags.length > 10) {
        return res.status(400).json({ message: 'Tags must be an array with a maximum of 10 tags.' });
    }

    const newVideo: Video = {
        id: `vid-${Date.now()}`,
        created_at: new Date().toISOString(),
        thumbnail_url: `https://picsum.photos/seed/${Date.now()}/400/225`,
        duration: Math.floor(Math.random() * 1800) + 300,
        views: Math.floor(Math.random() * 1000),
        title: title.trim(),
        tags: tags,
    };

    videoStore.unshift(newVideo); // Add to the beginning of the array
    
    res.status(201).json(newVideo);
});

// API endpoint to generate video ideas
app.post('/api/generate-ideas', async (req: Request, res: Response) => {
    const { topic } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        return res.status(400).json({ message: 'A topic is required.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not configured on the server.");
        return res.status(500).json({ message: "AI service is not configured correctly." });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 5 creative video ideas about: "${topic}".`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  video_ideas: {
                    type: Type.ARRAY,
                    description: "A list of 5 creative and unique video ideas.",
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING, description: "A catchy title." },
                        description: { type: Type.STRING, description: "A compelling description." },
                        tags: { type: Type.ARRAY, description: "Relevant keywords.", items: { type: Type.STRING } }
                      },
                      required: ["title", "description", "tags"],
                    },
                  },
                },
                required: ["video_ideas"],
              },
            },
        });
        
        const text = response.text;
        if (!text) {
          console.error("Gemini API returned an empty response.");
          return res.status(500).json({ message: 'AI service returned an empty response.' });
        }
        
        try {
          res.json(JSON.parse(text));
        } catch (parseError) {
          console.error("Failed to parse Gemini API response as JSON:", text, parseError);
          res.status(500).json({ message: 'AI service returned a malformed response.' });
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ message: 'Failed to generate ideas from AI service.' });
    }
});

// --- STATIC FILE SERVING ---

// Serve the directory containing the client bundle
app.use('/dist/client', express.static(path.join(rootPath, 'dist', 'client')));

// For any other GET request that isn't for an API endpoint or a static asset,
// serve the main index.html file. This allows client-side routing to take over.
app.get('*', (req: Request, res: Response) => {
    if (req.path.startsWith('/api/')) {
        // If an API call made it this far, it's a 404
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    // All other requests serve the SPA shell
    res.sendFile(path.join(rootPath, 'index.html'));
});

if (require.main === module) {
    app.listen(port, () => {
        initializeVideoStore();
        console.log(`Server listening at http://localhost:${port}`);
    });
} else {
    initializeVideoStore();
}

export default app;
