// Load environment variables
require('dotenv').config();

// OpenAI API Configuration
const openaiConfig = {
    apiKey: process.env.OPENAI_API_KEY,
    imageSize: process.env.AI_IMAGE_SIZE || '1024x1024',
    imageQuality: process.env.AI_IMAGE_QUALITY || 'standard',
    imageStyle: process.env.AI_IMAGE_STYLE || 'vivid'
};

// Export configurations
module.exports = {
    openai: openaiConfig
}; 