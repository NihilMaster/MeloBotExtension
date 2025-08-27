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
  if (!element || element.offsetParent === null) return false;
  
  // Verificar si el elemento tiene tamaño mínimo para ser interactivo
  const rect = element.getBoundingClientRect();
  if (rect.width < 10 || rect.height < 10) return false;
  
  // Elementos de formulario estándar
  const standardTextElements = [
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"])',
    'textarea'
  ];
  
  // Elementos editables modernos (incluyendo frameworks comunes)
  const editableElements = [
    '[contenteditable="true"]',
    '.ProseMirror', // Editor ProseMirror
    '.CodeMirror', // Editor CodeMirror
    '.ql-editor', // Quill Editor
    '.public-DraftEditor-content', // Draft.js (Facebook)
    '.cke_editable', // CKEditor
    '.tox-edit-area', // TinyMCE
    '.monaco-editor' // Monaco Editor (VSCode)
  ];
  
  return standardTextElements.some(selector => element.matches(selector)) ||
         editableElements.some(selector => element.matches(selector)) ||
         this.isNestedEditable(element);
  }

  // Nuevo método para detectar elementos editables anidados
  isNestedEditable(element) {
    // Buscar hacia arriba en el árbol DOM para encontrar un contenedor editable
    let parent = element;
    while (parent && parent !== document.body) {
        if (parent.hasAttribute('contenteditable') && 
            parent.getAttribute('contenteditable') === 'true') {
        return true;
        }
        
        // Verificar clases comunes de editores
        const classList = parent.classList;
        if (classList) {
        for (const cls of classList) {
            if (cls.includes('editor') || 
                cls.includes('Editor') || 
                cls.includes('edit') ||
                cls.includes('ProseMirror') ||
                cls.includes('CodeMirror')) {
            return true;
            }
        }
        }
        
        parent = parent.parentElement;
    }
    return false;
  }

  getFocusedTextElement() {
    const activeElement = document.activeElement;
    
    // Verificar si el elemento activo es un campo de texto
    if (this.isTextElement(activeElement)) {
        return activeElement;
    }
    
    // Si es un iframe, buscar en su documento (para editores embebidos)
    if (activeElement.tagName === 'IFRAME') {
        try {
        const iframeDoc = activeElement.contentDocument;
        if (iframeDoc && iframeDoc.activeElement) {
            const iframeActiveElement = iframeDoc.activeElement;
            if (this.isTextElement(iframeActiveElement)) {
            return iframeActiveElement;
            }
        }
        } catch (e) {
        // Política de mismo origen
        }
    }
    
    // Buscar elementos editables que puedan tener el foco real
    // (muchos editores modernos manejan el foco de manera no convencional)
    const potentialEditors = document.querySelectorAll(
        '.ProseMirror, .CodeMirror, [contenteditable="true"]'
    );
    
    for (const editor of potentialEditors) {
        if (editor.contains(activeElement) || this.hasVisibleSelection(editor)) {
        return editor;
        }
    }
    
    // Buscar en elementos anidados
    if (activeElement.querySelector) {
        const nestedTextElement = activeElement.querySelector(
        'input, textarea, [contenteditable="true"], .ProseMirror, .CodeMirror'
        );
        if (nestedTextElement && this.isTextElement(nestedTextElement)) {
        return nestedTextElement;
        }
    }
    
    return null;
  }

  // Método auxiliar para detectar si un elemento tiene selección visible
  hasVisibleSelection(element) {
    try {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return element.contains(range.commonAncestorContainer);
        }
    } catch (e) {
        // Ignorar errores de selección
    }
    return false;
  }

  getElementText(element) {
  if (!element) return '';
  
  try {
    // Elementos de formulario estándar
    if (element.tagName === 'TEXTAREA' || 
        (element.tagName === 'INPUT' && 
         ['text', 'password', 'email', 'search', 'url', 'tel'].includes(element.type))) {
      return element.value || '';
    } 
    // Elementos editables modernos
    else if (element.isContentEditable || 
             element.classList.contains('ProseMirror') ||
             element.classList.contains('CodeMirror') ||
             this.isNestedEditable(element)) {
      
      // Para editores de código, intentar obtener el texto de forma específica
      if (element.classList.contains('CodeMirror') || 
          element.closest('.CodeMirror')) {
        return this.getCodeMirrorText(element);
      }
      
      // Para editores de texto enriquecido, obtener texto plano
      return element.textContent || element.innerText || '';
    } 
    // Entradas estándar
    else if (element.tagName === 'INPUT') {
      return element.value || '';
    }
  } catch (e) {
    console.log('Error reading text:', e);
  }
  
  return '';
  }

  // Método específico para extraer texto de CodeMirror
  getCodeMirrorText(element) {
    try {
        // Intentar acceder a la API de CodeMirror si está disponible
        const codeMirrorElement = element.closest('.CodeMirror') || element;
        if (codeMirrorElement.CodeMirror) {
        return codeMirrorElement.CodeMirror.getValue();
        }
        
        // Fallback: buscar el área de texto real
        const textArea = codeMirrorElement.querySelector('textarea');
        if (textArea) {
        return textArea.value;
        }
        
        // Último recurso: obtener texto del contenido
        return codeMirrorElement.textContent || '';
    } catch (e) {
        console.log('Error extracting CodeMirror text:', e);
        return element.textContent || '';
    }
  }

  updateButtonVisibility() {
    const textElement = this.getFocusedTextElement();
    
    if (textElement && this.hasContent(textElement)) {
      this.floatingButton.style.display = 'flex';
      
      // Mejorar el texto del tooltip
      let fieldName = textElement.placeholder || textElement.name || textElement.id || '';
      if (!fieldName && textElement.classList.contains('ProseMirror')) {
      fieldName = 'Editor de texto';
      } else if (!fieldName && textElement.classList.contains('CodeMirror')) {
      fieldName = 'Editor de código';
      }
      
      this.floatingButton.title = 'Leer texto: ' + fieldName;
      this.currentTextElement = textElement;
    } else {
        this.floatingButton.style.display = 'none';
        this.currentTextElement = null;
    }
  }

  // Verificar si el elemento tiene contenido visible
  hasContent(element) {
    const text = this.getElementText(element);
    if (text.trim() !== '') return true;
    
    // Para editores modernos, podrían tener contenido HTML pero texto vacío
    if (element.isContentEditable || 
        element.classList.contains('ProseMirror') ||
        element.classList.contains('CodeMirror')) {
      return element.children.length > 0 || 
            element.querySelector('*') !== null;
    }
    
    return false;
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