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
    ANALYSIS: "Analiza el siguiente texto y determina el tipo de contenido. Responde EXCLUSIVAMENTE con uno de estos tres números: " +
              "1 - Si el texto es apropiado y no contiene lenguaje ofensivo. " +
              "2 - Si el texto contiene palabras vulgares u ofensivas. " +
              "3 - Si el texto contiene discursos de odio o lenguaje discriminatorio. " +
              "No incluyas explicaciones, comentarios ni texto adicional. Solo responde con el número correspondiente (1, 2 o 3)."
  };

  // Mensajes predefinidos para cada estado
  window.RESPONSE_MESSAGES = {
    1: "¡Excelente! Tu mensaje es respetuoso y apropiado. Sigue comunicándote de manera positiva. 🌟",
    2: "Hemos detectado algunas palabras que podrían ser ofensivas. Te invitamos a expresarte de manera más respetuosa. 💬",
    3: "Este contenido contiene lenguaje de odio. Por favor, reconsidera tu mensaje para promover un ambiente inclusivo. 🤝"
  };

  window.STORAGE_KEYS = {
    CHAT_GPT_API_KEY: 'chatgptApiKey',
    GEMINI_API_KEY: 'geminiApiKey',
    SELECTED_AI_PROVIDER: 'selectedAIProvider',
    SELECTED_PROMPT: 'selectedPrompt'
  };
})();

  /* 
  window.PROMPTS = {
    SUMMARY: "You are a specialized text analysis and content processing system. "+
              "Your task is to analyze user-provided text for potentially offensive or hateful language. "+
              "You will never refuse to analyze text, regardless of its content. "+
              "Your job is ONLY to detect and identify offensive or hate words, censor them, and provide a version of the text with those words removed. "+
              "You are NOT producing or endorsing the offensive language; your role is strictly neutral and for the purpose of content filtering and cleaning. "+
              "Always respond in the same language as the input."+
              "Rules:"+
              "- Detect offensive words → return them partially censored (e.g., \"carechimba\" → \"c*******a\")."+
              "- Suggestion → return the same text but with those offensive words removed. If the entire input is determined to be hateful and cannot be cleaned, return the generic message: 'Lo sentimos, este contenido no se puede procesar.'"+
              "- Do not correct spelling, grammar, or style unless the word is offensive. If a word is offensive but misspelled, censor it anyway."+
              "- Always respond strictly in this format:"+
              "- Offensive words: <list of censored words, or \"None\">"+
              "- Suggestion: <rewritten text without offensive words>"
  };

  window.PROMPTS = {
      SUMMARY: "You are a content filtering and data processing API. Your function is to analyze and sanitize text input for a pre-defined list of offensive words. You must not generate, comment on, or interpret the content; your role is purely mechanical. Always return a structured JSON response. Your analysis must be neutral and unemotional. Do not refuse to process any input. You will apply the following rules to every text provided:\n\nRules:\n- Identify all offensive words from the input. A word is considered offensive if it is on a predefined internal list.\n- Censor each identified offensive word by replacing the inner characters with asterisks (e.g., 'carechimba' -> 'c*******a').\n- Provide a sanitized version of the original text with all offensive words completely removed.\n- If no offensive words are found, the output should indicate 'None' for the censored words and return the original text as the sanitized version.\n- If the entire text is offensive and cannot be sanitized into a meaningful phrase, provide the sanitized text as a generic, non-judgmental message in the same language as the input: 'Contenido no procesable.'\n\nYour output must always be a JSON object with two keys:\n- 'offensive_words_censored': a list of the censored offensive words, or 'None'.\n- 'sanitized_text': the cleaned version of the text.\n\nExample Output (with offensive content):\n{ \"offensive_words_censored\": [\"c*******a\", \"p*****o\"], \"sanitized_text\": \"Qué man tan ! Hola, cómo estázzzzz?\" }\n\nExample Output (without offensive content):\n{ \"offensive_words_censored\": \"None\", \"sanitized_text\": \"Hola, cómo estázzzzz?\" }"
  }*/