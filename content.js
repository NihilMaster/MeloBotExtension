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
  }

  createFloatingButton() {
    this.floatingButton = document.createElement('button');
    this.floatingButton.className = 'floating-button';
    this.floatingButton.innerHTML = '📝';
    this.floatingButton.title = 'Leer texto del campo seleccionado';
    document.body.appendChild(this.floatingButton);
  }

  createTextDisplay() {
    this.textDisplay = document.createElement('div');
    this.textDisplay.className = 'text-display hidden';
    document.body.appendChild(this.textDisplay);
  }

  addEventListeners() {
    this.floatingButton.addEventListener('click', () => {
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

    // Actualizar cuando cambia el foco
    document.addEventListener('focusin', (e) => {
      if (this.isTextElement(e.target)) {
        this.updateButtonPosition();
      }
    });
  }

  isTextElement(element) {
    const textElements = ['input', 'textarea', '[contenteditable="true"]'];
    return textElements.some(selector => 
      element.matches(selector) || 
      element.matches(`${selector}[contenteditable="true"]`)
    );
  }

  getFocusedTextElement() {
    const activeElement = document.activeElement;
    if (this.isTextElement(activeElement)) {
      return activeElement;
    }
    return null;
  }

  getElementText(element) {
    if (element.tagName === 'TEXTAREA' || element.type === 'text') {
      return element.value;
    } else if (element.isContentEditable) {
      return element.textContent || element.innerText;
    }
    return '';
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
        this.textDisplay.style.bottom = `${buttonRect.top + buttonRect.height + 10}px`;
        this.textDisplay.style.right = `${window.innerWidth - buttonRect.right}px`;
      } else {
        this.textDisplay.textContent = 'No hay texto en el campo seleccionado';
        this.textDisplay.classList.remove('hidden');
        this.isVisible = true;
      }
    } else {
      this.textDisplay.textContent = 'No hay ningún campo de texto seleccionado';
      this.textDisplay.classList.remove('hidden');
      this.isVisible = true;
    }
  }

  hideTextDisplay() {
    this.textDisplay.classList.add('hidden');
    this.isVisible = false;
  }

  updateButtonPosition() {
    // El botón ya está fijo en la esquina inferior derecha
  }
}

// Inicializar la extensión cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new TextReader();
  });
} else {
  new TextReader();
}