// constants.js - Convertido a IIFE
(function() {
  window.AI_PROVIDERS = {
    CHAT_GPT: 'chatgpt',
    GEMINI: 'gemini'
  };

  window.API_CONFIG = {
    [window.AI_PROVIDERS.CHAT_GPT]: {
      endpoint: 'https://api.openai.com/v1/chat/completions',
      model: 'gpt-3.5-turbo',
      requiredParams: ['model', 'messages', 'temperature', 'max_tokens']
    },
    [window.AI_PROVIDERS.GEMINI]: {
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
      model: 'gemini-2.0-flash',
      requiredParams: ['contents']
    }
  };

  window.PROMPTS = {
    SUMMARY: "Proporciona un resumen conciso del siguiente texto en español:",
    ANALYSIS: "Analiza el siguiente texto identificando puntos clave, sentimiento y sugerencias de mejora (responde en español):",
    SIMPLIFY: "Simplifica el siguiente texto haciéndolo más fácil de entender (responde en español):"
  };

  window.STORAGE_KEYS = {
    CHAT_GPT_API_KEY: 'chatgptApiKey',
    GEMINI_API_KEY: 'geminiApiKey',
    SELECTED_AI_PROVIDER: 'selectedAIProvider',
    SELECTED_PROMPT: 'selectedPrompt'
  };
})();