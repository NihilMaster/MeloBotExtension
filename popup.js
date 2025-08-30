document.addEventListener('DOMContentLoaded', function() {
  const chatGptKeyInput = document.getElementById('chatgpt-api-key');
  const geminiKeyInput = document.getElementById('gemini-api-key');
  const saveButton = document.getElementById('save-api-keys');
  const providerSelect = document.getElementById('ai-provider');
  const statusMessage = document.getElementById('status-message');
  
  // Mostrar u ocultar campos según el proveedor seleccionado
  function updateUI() {
    const selectedProvider = providerSelect.value;
    
    if (selectedProvider === 'chatgpt') {
      document.getElementById('chatgpt-key-section').style.display = 'block';
      document.getElementById('gemini-key-section').style.display = 'none';
    } else if (selectedProvider === 'gemini') {
      document.getElementById('chatgpt-key-section').style.display = 'none';
      document.getElementById('gemini-key-section').style.display = 'block';
    }
  }
  
  // Cargar configuración guardada
  chrome.storage.local.get([
    window.STORAGE_KEYS.CHAT_GPT_API_KEY,
    window.STORAGE_KEYS.GEMINI_API_KEY,
    window.STORAGE_KEYS.SELECTED_AI_PROVIDER
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
    
    updateUI();
  });
  
  // Guardar configuración
  saveButton.addEventListener('click', function() {
    const chatGptKey = chatGptKeyInput.value.trim();
    const geminiKey = geminiKeyInput.value.trim();
    const selectedProvider = providerSelect.value;
    
    const config = {
      [window.STORAGE_KEYS.SELECTED_AI_PROVIDER]: selectedProvider
    };
    
    // Solo guardar la clave si tiene valor
    if (chatGptKey) {
      config[window.STORAGE_KEYS.CHAT_GPT_API_KEY] = chatGptKey;
    } else {
      // Si está vacío, eliminar del almacenamiento
      chrome.storage.local.remove(window.STORAGE_KEYS.CHAT_GPT_API_KEY);
    }
    
    if (geminiKey) {
      config[window.STORAGE_KEYS.GEMINI_API_KEY] = geminiKey;
    } else {
      chrome.storage.local.remove(window.STORAGE_KEYS.GEMINI_API_KEY);
    }
    
    chrome.storage.local.set(config, function() {
      if (chrome.runtime.lastError) {
        showStatus('Error al guardar: ' + chrome.runtime.lastError.message, 'error');
      } else {
        showStatus('Configuración guardada correctamente', 'success');
      }
    });
  });
  
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