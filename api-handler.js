// api-handler.js - Convertido a IIFE usando mensajes de constants.js
(function() {
  class APIHandler {
    constructor() {
      this.provider = null;
      this.apiKey = null;
    }

    async initialize() {
      try {
        // Usar mensajería para obtener la configuración
        const config = await chrome.runtime.sendMessage({
          type: 'GET_STORAGE_CONFIG'
        });
        
        this.provider = config.selectedAIProvider || 'chatgpt';
        
        if (this.provider === 'chatgpt') {
          this.apiKey = config.chatGptApiKey;
        } else if (this.provider === 'gemini') {
          this.apiKey = config.geminiApiKey;
        }

        return !!this.apiKey;
      } catch (error) {
        console.error('Error initializing APIHandler:', error);
        return false;
      }
    }

    // Analizar texto con el proveedor configurado
    async analyzeText(text) {
      if (!this.apiKey) {
        throw new Error('API key no configurada');
      }

      const fullPrompt = `${window.PROMPTS.ANALYSIS}\n\n${text}`;

      let resultCode;
      switch (this.provider) {
        case window.AI_PROVIDERS.CHAT_GPT:
          resultCode = await this.analyzeWithChatGPT(fullPrompt);
          break;
        case window.AI_PROVIDERS.GEMINI:
          resultCode = await this.analyzeWithGemini(fullPrompt);
          break;
        default:
          throw new Error('Proveedor de IA no soportado');
      }
      
      return {
        message: window.RESPONSE_MESSAGES[resultCode] || window.RESPONSE_MESSAGES[1],
        statusCode: resultCode,
        color: window.STATUS_COLORS[resultCode] || window.STATUS_COLORS[1]
      };
    }

    // Método específico para ChatGPT (optimizado)
    async analyzeWithChatGPT(prompt) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos

      try {
        const response = await fetch(window.API_CONFIG[window.AI_PROVIDERS.CHAT_GPT].endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo-instruct', // Modelo más rápido
            prompt: prompt,
            max_tokens: 5, // Solo necesitamos 1-3 caracteres de respuesta
            temperature: 0.1 // Más determinístico
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Error de API ChatGPT: ${response.status}`);
        }

        const data = await response.json();
        return this.processAIResponse(data.choices[0].text);
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Tiempo de espera agotado. Por favor, intenta con un texto más corto.');
        }
        throw error;
      }
    }

    // Método específico para Gemini (optimizado)
    async analyzeWithGemini(prompt) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout de 10 segundos

      try {
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
            }],
            generationConfig: {
              maxOutputTokens: 5, // Respuesta muy corta
              temperature: 0.1 // Más determinístico
            }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

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
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error('Tiempo de espera agotado. Por favor, intenta con un texto más corto.');
        }
        throw error;
      }
    }

    // Procesar la respuesta de la IA y convertirla al mensaje predefinido
    processAIResponse(aiResponse) {
      // Extraer solo el número de la respuesta
      const responseMatch = aiResponse.trim().match(/[123]/);
      return responseMatch ? responseMatch[0] : '1'; // Por defecto asumir que es apropiado
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