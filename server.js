const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const config = require('./config');

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: config.openai.apiKey
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Album Art Generation endpoint
app.post('/api/generate-art', async (req, res) => {
    try {
        const { prompt, style, text } = req.body;
        const enhancedPrompt = `Create album art in ${style} style with text "${text}": ${prompt}`;
        
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: enhancedPrompt,
            size: config.openai.imageSize,
            quality: config.openai.imageQuality,
            style: config.openai.imageStyle,
            n: 1,
        });

        res.json({ url: response.data[0].url });
    } catch (error) {
        console.error('Error generating album art:', error);
        res.status(500).json({ error: 'Failed to generate album art' });
    }
});

// Logo Generation endpoint
app.post('/api/generate-logo', async (req, res) => {
    try {
        const { name, style, color } = req.body;
        const prompt = `Create a ${style} style music producer logo for "${name}" using ${color} as the primary color. Make it professional and modern.`;
        
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            size: config.openai.imageSize,
            quality: config.openai.imageQuality,
            style: config.openai.imageStyle,
            n: 1,
        });

        res.json({ url: response.data[0].url });
    } catch (error) {
        console.error('Error generating logo:', error);
        res.status(500).json({ error: 'Failed to generate logo' });
    }
});

// Artist Style Analysis endpoint
app.post('/api/analyze-style', async (req, res) => {
    try {
        const { artistName, audioFeatures } = req.body;
        
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a professional music producer and sound engineer analyzing artist styles."
                },
                {
                    role: "user",
                    content: `Analyze the musical style of ${artistName} based on these audio features: ${JSON.stringify(audioFeatures)}`
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        res.json({ analysis: response.choices[0].message.content });
    } catch (error) {
        console.error('Error analyzing style:', error);
        res.status(500).json({ error: 'Failed to analyze style' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 