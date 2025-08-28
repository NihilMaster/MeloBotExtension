document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('api-key-input');
  const saveButton = document.getElementById('save-api-key');
  const statusMessage = document.getElementById('status-message');
  
  // Cargar API key guardada al abrir el popup
  chrome.storage.local.get(['chatgptApiKey'], function(result) {
    if (result.chatgptApiKey) {
      apiKeyInput.value = result.chatgptApiKey;
    }
  });
  
  // Guardar API key
  saveButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (apiKey) {
      chrome.storage.local.set({chatgptApiKey: apiKey}, function() {
        showStatus('API key guardada correctamente', 'success');
      });
    } else {
      showStatus('Por favor ingresa una API key válida', 'error');
    }
  });
  
  // Función para mostrar mensajes de estado
  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 3000);
  }
  
  console.log('Text Reader extension loaded');
});