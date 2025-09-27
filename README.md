# 📖 Melo-bot - README

## 🌟 CiberPaz (MinTIC)

> *CiberPaz es un programa que moviliza a los colombianos para ejercer su ciudadanía digital y hacer un uso consciente, empático, incluyente, seguro y responsable de la tecnología.*

Este proceso se desarrolla a través de una hackatón, en la cual **Chomelo** participa con Melo-bot como propuesta de concurso.

*Para ampliar el alcance de esta iniciativa, te invitamos encarecidamente a diligenciar el siguiente formulario escaneando el QR:*

[![QR Ciberpaz](img/QR.png)](https://sensibilizacion.ciberpaz.gov.co/#/data-ciberpaz/response/116?type=public)

*O si prefieres, también puedes acceder directamente a través de este [enlace al formulario](https://sensibilizacion.ciberpaz.gov.co/#/data-ciberpaz/response/116?type=public).*

En esta hackatón, Melo-bot se ha desarrollado con el fin de promover la comunicación digital y la conciencia de los usuarios sobre la importancia de la privacidad en la era digital.

## 🛡️ ¿Qué es Melo-bot?

Melo-bot es una extensión de navegador innovadora que **analiza en tiempo real** el contenido de los campos de texto en páginas web, utilizando inteligencia artificial para detectar lenguaje ofensivo y promover una comunicación digital más respetuosa.

## ✨ Características Principales

- 🔍 **Detección inteligente** de campos de texto editables
- 🤖 **Soporte múltiple** de APIs de IA (ChatGPT y Gemini)
- 🎯 **Tres niveles de detección**: contenido apropiado, palabras ofensivas y discurso de odio
- 💾 **Almacenamiento local** seguro de API keys
- 🎨 **Interfaz amigable** con mensajes constructivos
- ⚡ **Funcionamiento en tiempo real** sin afectar el rendimiento
- 🌐 **Compatibilidad** con todo tipo de campos de texto modernos

## 📊 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg) | ES6+ | Lógica principal de la extensión |
| ![Chrome Extension](https://img.shields.io/badge/Chrome%20Extension-MV3-blue.svg) | Manifest V3 | Estructura de extensión moderna |
| ![OpenAI API](https://img.shields.io/badge/OpenAI-API-green.svg) | v1 | Análisis de contenido con ChatGPT |
| ![Gemini API](https://img.shields.io/badge/Gemini-API-orange.svg) | v1beta | Análisis alternativo con Gemini |
| ![CSS3](https://img.shields.io/badge/CSS3-Styles-blue.svg) | CSS3 | Estilos y animaciones |
| ![HTML5](https://img.shields.io/badge/HTML5-Structure-red.svg) | HTML5 | Estructura de popup |

## 📁 Estructura del Proyecto

```text
Melo-bot/
│
├── 📄 manifest.json          # Configuración de la extensión
├── 📄 content.js             # Lógica principal de inyección
├── 📄 api-handler.js         # Manejador de APIs de IA
├── 📄 constants.js           # Constantes y configuraciones
├── 📄 popup.js               # Lógica del popup de configuración
├── 📄 popup.html             # Interfaz de configuración
├── 📄 styles.css             # Estilos unificados
├── 📄 README.md
│
├───📂 .github/               # Configuración de GitHub
│   └───📂 workflows/         # Flujos de trabajo de GitHub Actions
│       └── 📄 update-readme.yml  # Flujo de trabajo para actualizar la fecha
│
└───📂 img/               # Assets visuales
    ├── 📄 icon16.png       # Icono 16x16px
    ├── 📄 icon48.png       # Icono 48x48px
    ├── 📄 icon128.png      # Icono 128x128px
    └── 📄 QR.png           # QR Módulo Ciberpaz
```

## 🚀 Instalación

### Método 1: Desde Chrome Web Store

*Próximamente disponible.*

### Método 2: Instalación manual

1. **Descarga** el código fuente del proyecto
2. Abre **Chrome** y ve a `chrome://extensions/`
3. Habilita el **Modo desarrollador** (toggle en la esquina superior derecha)
4. Haz clic en **Cargar descomprimida**
5. Selecciona la carpeta donde descargaste el proyecto
6. ¡La extensión estará instalada! 🎉

## ⚙️ Configuración

### Obtención de API Keys

#### Para OpenAI (ChatGPT)

1. Visita [platform.openai.com](https://platform.openai.com)
2. Inicia sesión o crea una cuenta
3. Ve a **API Keys** → **Create new secret key**
4. Copia la clave que comienza con `sk-`

#### Para Google Gemini

1. Visita [aistudio.google.com](https://aistudio.google.com)
2. Haz clic en **Get API Key**
3. Crea una nueva clave API
4. Copia la clave que comienza con `AIza`

### Configuración de la extensión

1. Haz clic en el icono de Melo-bot en la barra de extensiones 🛡️
2. Selecciona tu proveedor de IA preferido
3. Ingresa tu API key correspondiente
4. Haz clic en **Guardar configuración**
5. ¡Estás listo para usar Melo-bot! ✅

## 🎮 Cómo usar

1. **Navega** a cualquier página web con campos de texto
2. **Selecciona** o haz clic en un campo de texto (input, textarea, editores ricos)
3. **Aparecerá** el botón flotante de Melo-bot 📝
4. **Haz clic** en el botón para analizar el contenido
5. **Recibe** retroalimentación inmediata sobre tu texto

### Tipos de respuestas

| Estado | Icono | Mensaje | Significado |
|---|---|---|---|
| ✅ **Aprobado** | 🌟 | "¡Excelente! Tu mensaje es respetuoso y apropiado. 🌟 Sigue comunicándote de manera positiva." | Contenido apropiado |
| ⚠️ **Advertencia** | ⚠️ | "⚠️ Tu texto contiene palabras que pueden ser ofensivas. Te invitamos a expresarte de manera más respetuosa." | Palabras ofensivas |
| ❌ **Crítico** | 🚫 | "🚫 Hemos detectado discurso de odio en tu mensaje. Por favor, reconsidera tu forma de expresión y promueve un ambiente de respeto para todos." | Discurso de odio |

## 🔧 Soporte técnico

### Navegadores compatibles

- ✅ Google Chrome 88+
- ✅ Microsoft Edge 88+
- ✅ Opera 74+
- ✅ Brave 1.3+

### Solución de problemas

#### Error común: "API key no configurada"

- Verifica que hayas guardado la API key correctamente
- Confirma que seleccionaste el proveedor correcto

#### Error común: "Error de API"

- Verifica que tu API key sea válida y tenga saldo
- Revisa que tengas conexión a internet

#### El botón no aparece

- Asegúrate de que el campo de texto esté enfocado
- Verifica que el campo tenga contenido

## 🤝 Contribuir

¡Agradecemos las contribuciones! Para contribuir:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🏆 Reconocimientos

Desarrollado con ❤️ para **CiberPaz** - Promoviendo un internet más seguro y respetuoso para todos.

## 📞 Soporte y contacto

¿Tienes preguntas o necesitas ayuda?  
📧 Email: <cadalagu@hotmail.com>  
🐛 Reportar issues: [GitHub Issues](https://github.com/NihilMaster/MeloBotExtension/issues)  
💬 Website: [Website de Chomelo](https://www.chomelo.org/melobot)

---

**⭐ ¿Te gusta Melo-bot? ¡Dale una estrella en GitHub!**

*Última actualización: 27 de September de 2025 📅
