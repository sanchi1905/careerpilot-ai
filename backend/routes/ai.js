const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.post('/prep', requireAuth, async (req, res) => {
  const { company, role } = req.body;

  if (!company || !role) {
    return res.status(400).json({ error: 'Company and role are required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'AI API key not configured on server' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // The prompt format needs to explicitly request JSON to parse easily on frontend
    const prompt = `You are an expert tech recruiter and career coach. 
Given the role "${role}" at "${company}", provide exactly 3 likely interview questions a candidate might face, and 1 brief, actionable tip on how to stand out.
Return the result strictly as a valid JSON object (without markdown wrappers or code blocks) with this exact schema:
{
  "questions": ["Question 1", "Question 2", "Question 3"],
  "tip": "Your actionable tip here"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up potential markdown formatting (```json ... ```)
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const aiData = JSON.parse(text);
    return res.status(200).json(aiData);
  } catch (error) {
    console.error('[AI Error]', error);
    return res.status(500).json({ error: 'Failed to generate AI content', details: error.message });
  }
});

module.exports = router;
