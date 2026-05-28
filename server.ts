import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoints
  app.post("/api/analyze-journal", async (req, res) => {
    try {
      const { text } = req.body;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the following journal entry. Determine if it is gibberish or a meaningful text (even if short). Respond ONLY with a JSON object in this exact format:
{
  "isGibberish": boolean,
  "feedback": "A short, encouraging sentence about their journal entry, or telling them to try writing real words if it's gibberish."
}

Text to analyze:
"${text}"`
      });

      const responseText = response.text || "{}";
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      res.json(parsed);
    } catch (e: any) {
      console.error("Journal analysis error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/generate-flashcards", async (req, res) => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate 10 random general knowledge multiple-choice questions. 
Respond ONLY with a JSON array in this exact format:
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Berlin", "Paris", "Madrid"],
    "answerIndex": 2
  }
]`
      });

      const responseText = response.text || "[]";
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      res.json({ questions: parsed });
    } catch (e: any) {
      console.error("Flashcards generation error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
