// api-handler.js - Convertido a IIFE usando mensajes de constants.js
(function() {
  class APIHandler {
    constructor() {
      this.provider = null;
      this.apiKey = null;
    }

    // Inicializar con el proveedor seleccionado
    async initialize() {
      const config = await chrome.storage.local.get([
        window.STORAGE_KEYS.SELECTED_AI_PROVIDER,
        window.STORAGE_KEYS.CHAT_GPT_API_KEY,
        window.STORAGE_KEYS.GEMINI_API_KEY
      ]);

      this.provider = config[window.STORAGE_KEYS.SELECTED_AI_PROVIDER] || window.AI_PROVIDERS.CHAT_GPT;
      
      if (this.provider === window.AI_PROVIDERS.CHAT_GPT) {
        this.apiKey = config[window.STORAGE_KEYS.CHAT_GPT_API_KEY];
      } else if (this.provider === window.AI_PROVIDERS.GEMINI) {
        this.apiKey = config[window.STORAGE_KEYS.GEMINI_API_KEY];
      }

      return !!this.apiKey;
    }

    // Analizar texto con el proveedor configurado
    async analyzeText(text) {
      if (!this.apiKey) {
        throw new Error('API key no configurada');
      }

      const fullPrompt = `${window.PROMPTS.ANALYSIS}\n\n${text}`;

      switch (this.provider) {
        case window.AI_PROVIDERS.CHAT_GPT:
          return this.analyzeWithChatGPT(fullPrompt);
        case window.AI_PROVIDERS.GEMINI:
          return this.analyzeWithGemini(fullPrompt);
        default:
          throw new Error('Proveedor de IA no soportado');
      }
    }

    // Método específico para ChatGPT
    async analyzeWithChatGPT(prompt) {
      const response = await fetch(window.API_CONFIG[window.AI_PROVIDERS.CHAT_GPT].endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: window.API_CONFIG[window.AI_PROVIDERS.CHAT_GPT].model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1, // Baja temperatura para respuestas más determinísticas
          max_tokens: 10 // Solo necesitamos un número
        })
      });

      if (!response.ok) {
        throw new Error(`Error de API ChatGPT: ${response.status}`);
      }

      const data = await response.json();
      return this.processAIResponse(data.choices[0].message.content);
    }

    // Método específico para Gemini
    async analyzeWithGemini(prompt) {
      const modelName = window.API_CONFIG[window.AI_PROVIDERS.GEMINI].model;
      const url = `${window.API_CONFIG[window.AI_PROVIDERS.GEMINI].endpoint}/${modelName}:generateContent?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error de API Gemini: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return this.processAIResponse(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error('Estructura de respuesta inesperada de Gemini API');
      }
    }

    // Procesar la respuesta de la IA y convertirla al mensaje predefinido
    processAIResponse(aiResponse) {
      // Extraer solo el número de la respuesta
      const responseMatch = aiResponse.trim().match(/[123]/);
      const resultCode = responseMatch ? responseMatch[0] : '1'; // Por defecto asumir que es apropiado
      
      return window.RESPONSE_MESSAGES[resultCode] || window.RESPONSE_MESSAGES[1];
    }

    // Verificar si una API key es válida
    async validateAPIKey(provider, apiKey) {
      if (provider === window.AI_PROVIDERS.CHAT_GPT) {
        return apiKey.startsWith('sk-') && apiKey.length > 30;
      } else if (provider === window.AI_PROVIDERS.GEMINI) {
        return apiKey.startsWith('AIza') && apiKey.length > 30;
      }
      return false;
    }
  }

  // Hacer la clase disponible globalmente
  window.APIHandler = APIHandler;
})();