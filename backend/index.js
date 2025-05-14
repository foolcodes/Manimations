import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

if (!fs.existsSync("generated_scripts")) {
  fs.mkdirSync("generated_scripts", { recursive: true });
}
if (!fs.existsSync("videos")) {
  fs.mkdirSync("videos", { recursive: true });
}
app.use("/generated_scripts", express.static("generated_scripts"));
app.use("/videos", express.static("videos")); // Serve directly from videos directory

const cleanCodeResponse = (response) => {
  let cleanedCode = response;

  cleanedCode = cleanedCode.replace(/^```python\n/m, "");
  cleanedCode = cleanedCode.replace(/```$/m, "");
  cleanedCode = cleanedCode.replace(/^```\n/m, "");
  cleanedCode = cleanedCode.replace(/^```python$/m, "");
  cleanedCode = cleanedCode.replace(/^```$/m, "");

  return cleanedCode.trim();
};

const manimCode = async (req, res) => {
  console.log("Received request:", req.body);
  try {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ error: "Missing prompt in request body" });
    }

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API);
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `You are a Python code generator. Create ONLY executable Python code using Manim to visualize the following concept:

${userPrompt}
Requirements:

1. ONLY output Python code. No explanations or markdown.
2. Start with from manim import *
3. Define a Scene subclass named MyScene with a construct method.
4.Use only valid, executable Manim code that works with standard manim CLI (e.g., manim -pql file.py MyScene)
5.For all mathematical symbols, use LaTeX syntax inside MathTex(...) with raw strings (e.g., MathTex(r"\alpha + \beta = \gamma"))
6. NEVER use raw Unicode for Greek letters or math symbols. ALWAYS use LaTeX equivalents.
7. Do not use Text(...) for any content that includes math symbols — use MathTex(...) instead.
8. The code must be complete, syntactically correct, and ready to run.
9. NO broken LaTeX expressions — check escape sequences, backslashes, and curly braces carefully.
10. No comments, explanations, or markdown in the output — just the raw Python code block.
11. VERY IMPORTANT Dont forget to import necessary modules for the code you generate.
12. Use nicer colors.

Return just the Python code and nothing else.`
    );

    let generatedCode = result.response.text();

    if (!generatedCode) {
      return res.status(500).json({ error: "No code received from Gemini" });
    }

    generatedCode = cleanCodeResponse(generatedCode);

    const timestamp = Date.now();
    const scriptName = `manim_${timestamp}.py`;
    const filePath = path.join("generated_scripts", scriptName);
    fs.writeFileSync(filePath, generatedCode);

    // Ensure the output directory exists
    const outputDir = path.join("videos", `manim_${timestamp}`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    //  Manim script
    const outputFileName = `output_${timestamp}`;

    const renderCommand = `manim ${filePath} MyScene -qm -o ${outputFileName} --media_dir ./videos/manim_${timestamp}`;

    exec(renderCommand, (err, stdout, stderr) => {
      if (err) {
        console.error("Manim error:", stderr);
        return res.status(500).json({
          error: "Manim rendering failed",
          details: stderr,
          code: generatedCode,
        });
      }

      console.log("Manim output:", stdout);
      const videoFilename = `${outputFileName}.mp4`;

      const videoUrl = `/videos/manim_${timestamp}/videos/manim_${timestamp}/720p30/${videoFilename}`;

      const responseText = `Here's the result.`;

      console.log(responseText, videoUrl);

      return res.status(200).json({
        text: responseText,
        videoUrl: videoUrl,
        code: generatedCode,
        script: `/generated_scripts/${scriptName}`,
      });
    });
  } catch (error) {
    console.error("Server error:", error.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  }
};

app.post("/api/manim", manimCode);
app.get("/app/manim", (req, res) => {
  res.status(200).json("Manim API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
