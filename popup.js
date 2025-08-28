// popup.js - Modificado para usar variables globales
document.addEventListener('DOMContentLoaded', function() {
  const chatGptKeyInput = document.getElementById('chatgpt-api-key');
  const geminiKeyInput = document.getElementById('gemini-api-key');
  const saveButton = document.getElementById('save-api-keys');
  const providerSelect = document.getElementById('ai-provider');
  const promptSelect = document.getElementById('prompt-type');
  const statusMessage = document.getElementById('status-message');
  
  // Cargar configuración guardada
  chrome.storage.local.get([
    window.STORAGE_KEYS.CHAT_GPT_API_KEY,
    window.STORAGE_KEYS.GEMINI_API_KEY,
    window.STORAGE_KEYS.SELECTED_AI_PROVIDER,
    window.STORAGE_KEYS.SELECTED_PROMPT
  ], function(result) {
    if (result[window.STORAGE_KEYS.CHAT_GPT_API_KEY]) {
      chatGptKeyInput.value = result[window.STORAGE_KEYS.CHAT_GPT_API_KEY];
    }
    if (result[window.STORAGE_KEYS.GEMINI_API_KEY]) {
      geminiKeyInput.value = result[window.STORAGE_KEYS.GEMINI_API_KEY];
    }
    if (result[window.STORAGE_KEYS.SELECTED_AI_PROVIDER]) {
      providerSelect.value = result[window.STORAGE_KEYS.SELECTED_AI_PROVIDER];
    }
    if (result[window.STORAGE_KEYS.SELECTED_PROMPT]) {
      promptSelect.value = result[window.STORAGE_KEYS.SELECTED_PROMPT];
    }
    
    updateUI();
  });
  
  // Guardar configuración
  saveButton.addEventListener('click', function() {
    const chatGptKey = chatGptKeyInput.value.trim();
    const geminiKey = geminiKeyInput.value.trim();
    const selectedProvider = providerSelect.value;
    const selectedPrompt = promptSelect.value;
    
    const config = {
      [window.STORAGE_KEYS.SELECTED_AI_PROVIDER]: selectedProvider,
      [window.STORAGE_KEYS.SELECTED_PROMPT]: selectedPrompt
    };
    
    if (chatGptKey) {
      config[window.STORAGE_KEYS.CHAT_GPT_API_KEY] = chatGptKey;
    }
    
    if (geminiKey) {
      config[window.STORAGE_KEYS.GEMINI_API_KEY] = geminiKey;
    }
    
    chrome.storage.local.set(config, function() {
      showStatus('Configuración guardada correctamente', 'success');
      updateUI();
    });
  });
  
  // Actualizar UI según el proveedor seleccionado
  function updateUI() {
    const selectedProvider = providerSelect.value;
    document.querySelectorAll('.api-key-section').forEach(section => {
      section.style.display = 'none';
    });
    
    if (selectedProvider === window.AI_PROVIDERS.CHAT_GPT) {
      document.getElementById('chatgpt-key-section').style.display = 'block';
    } else if (selectedProvider === window.AI_PROVIDERS.GEMINI) {
      document.getElementById('gemini-key-section').style.display = 'block';
    }
  }
  
  // Mostrar mensajes de estado
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 3000);
  }
  
  // Event listeners para cambios
  providerSelect.addEventListener('change', updateUI);
  
  console.log('Text Reader extension loaded');
});