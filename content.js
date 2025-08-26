class TextReader {
  constructor() {
    this.floatingButton = null;
    this.textDisplay = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    this.createFloatingButton();
    this.createTextDisplay();
    this.addEventListeners();
    this.updateButtonVisibility();
  }

  createFloatingButton() {
    // Remover botón existente si hay uno
    const existingButton = document.querySelector('.floating-button');
    if (existingButton) {
      existingButton.remove();
    }

    this.floatingButton = document.createElement('button');
    this.floatingButton.className = 'floating-button';
    this.floatingButton.innerHTML = '📝';
    this.floatingButton.title = 'Leer texto del campo seleccionado';
    document.body.appendChild(this.floatingButton);
  }

  createTextDisplay() {
    // Remover display existente si hay uno
    const existingDisplay = document.querySelector('.text-display');
    if (existingDisplay) {
      existingDisplay.remove();
    }

    this.textDisplay = document.createElement('div');
    this.textDisplay.className = 'text-display hidden';
    document.body.appendChild(this.textDisplay);
  }

  addEventListeners() {
    this.floatingButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleTextDisplay();
    });

    // Cerrar el display al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (this.isVisible && 
          !this.floatingButton.contains(e.target) && 
          !this.textDisplay.contains(e.target)) {
        this.hideTextDisplay();
      }
    });

    // Actualizar cuando cambia el foco o el contenido
    document.addEventListener('focusin', this.handleFocusChange.bind(this));
    document.addEventListener('focusout', this.handleFocusChange.bind(this));
    document.addEventListener('input', this.handleFocusChange.bind(this));
    
    // También verificar periódicamente por cambios
    setInterval(() => this.updateButtonVisibility(), 1000);
  }

  handleFocusChange() {
    this.updateButtonVisibility();
  }

  isTextElement(element) {
    if (!element) return false;
    
    const textElements = [
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"])',
      'textarea',
      '[contenteditable="true"]'
    ];
    
    return textElements.some(selector => element.matches(selector));
  }

  getFocusedTextElement() {
    const activeElement = document.activeElement;
    
    // Verificar si el elemento activo es un campo de texto
    if (this.isTextElement(activeElement)) {
      return activeElement;
    }
    
    // Buscar en elementos anidados (útil para editores ricos)
    if (activeElement.querySelector) {
      const nestedTextElement = activeElement.querySelector(
        'input, textarea, [contenteditable="true"]'
      );
      if (nestedTextElement && this.isTextElement(nestedTextElement)) {
        return nestedTextElement;
      }
    }
    
    return null;
  }

  getElementText(element) {
    if (!element) return '';
    
    try {
      if (element.tagName === 'TEXTAREA' || element.type === 'text' || element.type === 'password' || element.type === 'email' || element.type === 'search' || element.type === 'url') {
        return element.value || '';
      } else if (element.isContentEditable) {
        return element.textContent || element.innerText || '';
      } else if (element.tagName === 'INPUT') {
        return element.value || '';
      }
    } catch (e) {
      console.log('Error reading text:', e);
    }
    
    return '';
  }

  updateButtonVisibility() {
    const textElement = this.getFocusedTextElement();
    
    if (textElement) {
      this.floatingButton.style.display = 'flex';
      this.floatingButton.title = 'Leer texto: ' + (textElement.placeholder || textElement.name || 'Campo de texto');
    } else {
      this.floatingButton.style.display = 'none';
    }
  }

  toggleTextDisplay() {
    if (this.isVisible) {
      this.hideTextDisplay();
    } else {
      this.showTextDisplay();
    }
  }

  showTextDisplay() {
    const textElement = this.getFocusedTextElement();
    
    if (textElement) {
      const text = this.getElementText(textElement);
      
      if (text.trim()) {
        this.textDisplay.textContent = text;
        this.textDisplay.classList.remove('hidden');
        this.isVisible = true;
        
        // Posicionar cerca del botón
        const buttonRect = this.floatingButton.getBoundingClientRect();
        this.textDisplay.style.bottom = `${window.innerHeight - buttonRect.top + 10}px`;
        this.textDisplay.style.right = `${window.innerWidth - buttonRect.right}px`;
        
        // Añadir scroll si el texto es muy largo
        this.textDisplay.style.overflowY = text.length > 500 ? 'auto' : 'hidden';
      } else {
        this.textDisplay.textContent = 'No hay texto en el campo seleccionado';
        this.textDisplay.classList.remove('hidden');
        this.isVisible = true;
      }
    } else {
      this.textDisplay.textContent = 'Selecciona primero un campo de texto (input, textarea)';
      this.textDisplay.classList.remove('hidden');
      this.isVisible = true;
      
      // Ocultar automáticamente después de 3 segundos
      setTimeout(() => {
        this.hideTextDisplay();
      }, 3000);
    }
  }

  hideTextDisplay() {
    this.textDisplay.classList.add('hidden');
    this.isVisible = false;
  }
}

// Función para inicializar con retry en caso de errores
function initializeTextReader() {
  try {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => new TextReader(), 1000);
      });
    } else {
      setTimeout(() => new TextReader(), 1000);
    }
  } catch (error) {
    console.error('Error initializing TextReader:', error);
    // Reintentar después de 2 segundos
    setTimeout(initializeTextReader, 2000);
  }
}

// Inicializar la extensión
initializeTextReader();

// También reinicializar cuando la página cambie (SPA)
let lastHref = document.location.href;
setInterval(() => {
  if (lastHref !== document.location.href) {
    lastHref = document.location.href;
    setTimeout(initializeTextReader, 1000);
  }
}, 1000);