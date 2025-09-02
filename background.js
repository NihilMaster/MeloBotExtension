// background.js
let pendingTabId = null;
let targetUrl = '';

// Escuchar cuando se intente abrir una pestaña
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'OPEN_FORM_WITH_PRESET') {
    targetUrl = request.url;
    pendingTabId = null;

    chrome.tabs.create({ url: request.url, active: true }, (tab) => {
      pendingTabId = tab.id;
    });

    sendResponse({ tabId: tab.id });
  }
});

// Cuando la navegación se complete, inyectar script
chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.tabId === pendingTabId && details.url.startsWith('https://sensibilizacion.ciberpaz.gov.co')) {
    console.log('✅ Navegación completada en:', details.url);

    // Pequeño retraso para asegurar que Vue cargue
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      await chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: function () {
          const selectId = 'dynamic_field_1755278395714';
          const valueToSelect = 'Chomelo';

          function log(msg) {
            console.log('[Extensión] ' + msg);
          }

          log('🔍 Buscando campo: ' + selectId);

          let intentos = 0;
          const maxIntentos = 60;
          const interval = setInterval(() => {
            const select = document.getElementById(selectId);
            if (select) {
              select.value = valueToSelect;
              ['input', 'change'].forEach(eventType => {
                select.dispatchEvent(new Event(eventType, { bubbles: true }));
              });
              log('✅ ¡Grupo seleccionado!: ' + valueToSelect);
              select.style.border = '2px solid green';
              clearInterval(interval);
            } else if (++intentos >= maxIntentos) {
              log('❌ No se encontró el campo');
              clearInterval(interval);
            }
          }, 500);
        },
        world: 'MAIN'
      });
    } catch (error) {
      console.error('❌ Error al inyectar:', error);
    }

    // Limpiar
    pendingTabId = null;
  }
});