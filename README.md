# WebAR Visualizer - Realidad Aumentada en el Navegador

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](https://github.com)
[![A-Frame](https://img.shields.io/badge/A--Frame-1.4.0-orange)](https://aframe.io)
[![AR.js](httpsimg.shields.io/badge/AR.js-3.4.0-green)](https://ar-js-org.github.io/AR.js)

---

## 📱 Descripción

**WebAR Visualizer** es una aplicación web de Realidad Aumentada que permite experimentar con objetos 3D directamente en el navegador web, sin necesidad de instalar aplicaciones nativas. El proyecto utiliza tecnologías web abiertas y estándar para ofrecer una experiencia de AR accesible desde cualquier dispositivo compatible.

Esta aplicación está diseñada para demostrar las capacidades de la realidad aumentada basada en marcadores (marker-based AR), utilizando el marker estándar Hiro como punto de referencia para superponer objetos virtuales en el mundo real. Los usuarios pueden interactuar con los objetos 3D modificando sus propiedades en tiempo real, lo que la convierte en una herramienta educativa y de demostración ideal para proyectos de AR web.

El proyecto es completamente responsivo y funciona tanto en dispositivos de escritorio como móviles, adaptándose a diferentes tamaños de pantalla y capacidades de hardware. La interfaz de usuario es intuitiva y está diseñada siguiendo las mejores prácticas de UX para aplicaciones de realidad aumentada.

---

## ✨ Características Principales

| Característica | Descripción |
|----------------|-------------|
| 🎯 **Marker Tracking** | Detección y seguimiento del marker Hiro en tiempo real |
| 🎨 **Cambio de Color** | 8 colores disponibles para personalizar el objeto 3D |
| 📐 **FormasGeométricas** | 4 formas: Cubo, Esfera, Cilindro y Cono |
| 📏 **Escala Ajustable** | Control de tamaño de 0.5x a 2.0x |
| 👆 **Gesto Táctil** | Pinch-to-zoom para escalar en dispositivos móviles |
| 🔒 **Validación de Seguridad** | Verificación de HTTPS y permisos de cámara |
| 📱 **Diseño Responsive** | Adaptable a cualquier tamaño de pantalla |
| ⚡ **Sin Instalación** | Funciona directamente en el navegador |

### Lista de funciones interactivas:

- [x] Iniciar/detener experiencia AR con un botón
- [x] Panel de control flotante con opciones de personalización
- [x] Indicador de estado en tiempo real
- [x] Mensajes de error descriptivos para problemas comunes
- [x] Animación de rotación del objeto 3D
- [x] Compatible con cámaras frontales y traseras

---

## 🛠️ Tecnologías Usadas

### Frameworks Principales

| Tecnología | Descripción | Enlace |
|------------|-------------|--------|
| **A-Frame** | Framework WebVR/WebAR de código abierto | [Sitio Web](https://aframe.io) |
| **AR.js** | Librería ligera para AR en la web | [GitHub](https://github.com/AR-js-org/AR.js) |

### Tecnologías Web

- **HTML5** - Estructura semántica de la aplicación
- **CSS3** - Estilos con variables CSS y animaciones
- **JavaScript (ES6+)** - Lógica de la aplicación
- **WebRTC** - Acceso a la cámara del dispositivo

### Herramientas de Desarrollo

- **Visual Studio Code** - Editor de código recomendado
- **Git** - Control de versiones
- **GitHub Pages** - Despliegue estático

---

## 🚀 Cómo Ejecutarlo Localmente

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local o extensión de VS Code para Live Server

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/tu-usuario/webar-visualizer.git
   cd webar-visualizer
   ```

2. **Iniciar servidor local**

   Si tienes Python instalado:
   ```bash
   python -m http.server 8000
   ```

   O si prefieres Node.js con http-server:
   ```bash
   npx http-server -p 8000
   ```

   O simplemente usa la extensión **Live Server** en VS Code.

3. **Acceder a la aplicación**

   Abre tu navegador y visita:
   ```
   http://localhost:8000
   ```

> **⚠️ Importante**: La aplicación requiere HTTPS para acceder a la cámara en dispositivos móviles. En local (`localhost`) funciona sin HTTPS.

---

## 📡 Cómo Desplegar en GitHub Pages

### Paso 1: Preparar el Repositorio

1. Crea un repositorio nuevo en GitHub llamado `webar-visualizer`
2. Sube los archivos del proyecto:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/webar-visualizer.git
   git push -u origin main
   ```

### Paso 2: Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Navega a **Settings** (Configuración)
3. En el menú lateral, haz clic en **Pages**
4. En la sección **Build and deployment**:
   - **Source**: Selecciona "Deploy from a branch"
   - **Branch**: Selecciona `main` y `/ (root)`
   - Click en **Save**

### Paso 3: Configurar HTTPS (Opcero pero Recomendado)

GitHub Pages proporciona automáticamente un certificado SSL. Tu aplicación será accesible vía:
```
https://tu-usuario.github.io/webar-visualizer/
```

### Solución de Problemas Comunes

| Problema | Solución |
|----------|----------|
| La cámara no funciona | Asegúrate de usar HTTPS (GitHub Pages lo proporciona) |
| Marker no detectado | Usa el marker Hiro oficial, asegúrate de buena iluminación |
| Error de permisos | Permite el acceso a la cámara en la configuración del navegador |

---

## 📲 Cómo Acceder Desde el Móvil

### Requisitos

- Dispositivo móvil con cámara
- Navegador Chrome (Android) o Safari (iOS)
- Conexión HTTPS (automático en GitHub Pages)

### Pasos para Conectar

1. **Obtener la URL**

   Anota la URL de tu aplicación desplegada:
   ```
   https://tu-usuario.github.io/webar-visualizer/
   ```

2. **Preparar el Marker**

   Descarga e imprime el marker Hiro:
   > ![Marker Hiro](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)
   
   [Descargar Marker Hiro](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png)

3. **Iniciar la Aplicación**

   - Abre la URL en tu navegador móvil
   - Toca el botón "Iniciar AR"
   - Permite el acceso a la cámara cuando se solicite
   - Apunta la cámara hacia el marker Hiro

4. **Interactuar con el Objeto**

   - Usa los controles en pantalla para cambiar color y forma
   - Arrastra para rotar la vista
   - Usa el gesto de pellizco para escalar

---

## 📸 Capturas de Pantalla

### Pantalla de Inicio

```
┌─────────────────────────────────┐
│                                 │
│         [LOGO ANIMADO]          │
│                                 │
│       WebAR Visualizer          │
│   Realidad Aumentada en el      │
│         Navegador               │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ✓ Cámara compatible     │   │
│  │ ✓ Marker Hiro           │   │
│  │ ✓ Navegador moderno    │   │
│  └─────────────────────────┘   │
│                                 │
│     [ INICIAR EXPERIENCIA ]    │
│                                 │
└─────────────────────────────────┘
```

### Interfaz AR Activa

```
┌─────────────────────────────────┐
│  ● Buscando marker...          │ ← Indicador de estado
│                                 │
│                                 │
│      [Objeto 3D flotando]      │ ← Marker Hiro detectado
│                                 │
│                                 │
├─────────────────────────────────┤
│  ┌─────────────────────────┐   │
│  │ Color    ● ● ● ● ● ●   │   │
│  │ Forma    [□][○][△][⬡]  │   │
│  │ Escala   [────●────]   │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Panel de Controles

```
┌─────────────────────────────────┐
│  Controles del Objeto    ✕    │
│  ─────────────────────────     │
│                                 │
│  Color                  Azul   │
│  [🔴][🔵][🟢][🟡][🟣][🟠]      │
│                                 │
│  Forma                 Cubo    │
│  [Cubo][Esfera][Cilindro][Cono]│
│                                 │
│  Escala               1.0x     │
│  [────────●────────────]       │
│                                 │
└─────────────────────────────────┘
```

---

## 🔮 Posibles Mejoras y Características Futuras

### Funcionalidades Planificadas

- [ ] **Más tipos de markers**: Soporte para markers personalizados (Kanji, Letter, pattern)
- [ ] **Múltiples objetos**: Añadir múltiples objetos 3D simultáneamente
- [ ] **Modelos 3D personalizados**: Importar modelos .gltf/.glb externos
- [ ] **Interacción táctil avanzada**: Arrastrar, soltar y posicionar objetos
- [ ] **Modo multiplayer**: Compartir experiencia AR en tiempo real
- [ ] **Realidad Mixta**: Soporte para dispositivos HoloLens y Magic Leap
- [ ] **Almacenamiento local**: Guardar preferencias del usuario
- [ ] **Analytics**: Métricas de uso y comportamiento

### Optimizaciones Técnicas

- [ ] Implementar WebXR para mejor rendimiento
- [ ] Compresión de activos para cargas más rápidas
- [ ] Progressive Web App (PWA) con Service Workers
- [ ] Soporte sin conexión parcial
- [ ] Optimización para dispositivos de bajo rendimiento

### Mejoras de UI/UX

- [ ] Temas personalizables (oscuro/claro)
- [ ] Tutorial interactivo integrado
- [ ] Sonidos y retroalimentación háptica
- [ ] Modo de demostración automático

---

## 📄 Licencia

MIT License

Copyright (c) 2024 WebAR Visualizer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 📬 Información de Contacto

### Para Preguntas y Soporte

- **Email**: contacto@webar-visualizer.com
- **GitHub Issues**: [Abrir un issue](https://github.com/tu-usuario/webar-visualizer/issues)
- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/webar-visualizer/wiki)

### Recursos Adicionales

| Recurso | Enlace |
|---------|--------|
| Marker Hiro | [Descargar](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png) |
| Documentación A-Frame | [Visitar](https://aframe.io/docs/1.4.0/) |
| Documentación AR.js | [Visitar](https://ar-js-org.github.io/AR.js/docs/) |
| Ejemplos de AR.js | [Galería](https://ar-js-org.github.io/AR.js/three.js/examples/marker-based.html) |

---

<div align="center">

**WebAR Visualizer** - Experimenta la Realidad Aumentada en tu navegador

*Hecho con ❤️ usando A-Frame y AR.js*

</div>
