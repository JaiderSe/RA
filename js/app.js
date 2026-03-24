/**
 * ============================================
 * WebAR - Controlador Principal
 * Maneja la interfaz de usuario y la escena AR
 * Archivo: js/app.js
 * ============================================
 * 
 * Este módulo proporciona toda la funcionalidad necesaria para:
 * - Iniciar/detener la experiencia AR
 * - Cambiar color, forma y escala del objeto 3D
 * - Manejar gestos táctiles (pinch para escalar)
 * - Validar soporte de cámara y HTTPS
 * - Mostrar mensajes de error y estado
 */

(function() {
    'use strict';

    // ============================================
    // CONSTANTES DE CONFIGURACIÓN
    // ============================================

    /**
     * Colores disponibles para el objeto AR
     * Cada color incluye su código hexadecimal y nombre para mostrar
     */
    const COLORS = {
        RED: { hex: '#ff5252', name: 'Rojo' },
        BLUE: { hex: '#4a90d9', name: 'Azul' },
        GREEN: { hex: '#4caf50', name: 'Verde' },
        YELLOW: { hex: '#ffeb3b', name: 'Amarillo' },
        PURPLE: { hex: '#9c27b0', name: 'Morado' },
        ORANGE: { hex: '#ff9800', name: 'Naranja' }
    };

    /**
     * Formas geométricas disponibles para el objeto AR
     * Define la geometría A-Frame para cada forma
     */
    const SHAPES = {
        BOX: {
            id: 'box',
            name: 'Cubo',
            geometry: { primitive: 'box' }
        },
        SPHERE: {
            id: 'sphere',
            name: 'Esfera',
            geometry: { primitive: 'sphere', radius: 0.5 }
        },
        CYLINDER: {
            id: 'cylinder',
            name: 'Cilindro',
            geometry: { primitive: 'cylinder', radius: 0.4, height: 1 }
        },
        CONE: {
            id: 'cone',
            name: 'Cono',
            geometry: { primitive: 'cone', radiusBottom: 0.5, height: 1 }
        }
    };

    /**
     * Configuración de escala
     * Define los valores mínimo, máximo y paso del slider
     */
    const SCALE_CONFIG = {
        MIN: 0.5,
        MAX: 2.0,
        STEP: 0.1,
        DEFAULT: 1.0
    };

    /**
     * Configuración de animación del objeto
     */
    const ANIMATION_CONFIG = {
        property: 'rotation',
        to: '0 360 0',
        duration: 5000,
        easing: 'linear',
        loop: true
    };

    // ============================================
    // REFERENCIAS AL DOM
    // ============================================

    // Elementos principales de la interfaz
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');
    const arScene = document.getElementById('ar-scene');
    const controlsPanel = document.getElementById('controls-panel');
    const closeControlsBtn = document.getElementById('close-controls');
    const errorOverlay = document.getElementById('error-overlay');
    const errorMessage = document.getElementById('error-message');
    const retryBtn = document.getElementById('retry-btn');
    const arStatus = document.getElementById('ar-status');
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    // Elementos de control y visualización
    const colorValue = document.getElementById('color-value');
    const shapeValue = document.getElementById('shape-value');
    const scaleValue = document.getElementById('scale-value');
    const scaleSlider = document.getElementById('scale-slider');

    // Elementos del objeto AR en la escena
    const arObject = document.getElementById('ar-object');
    const markerHiro = document.getElementById('marker-hiro');

    // ============================================
    // ESTADO DE LA APLICACIÓN
    // ============================================

    let currentColor = COLORS.BLUE.hex;
    let currentShape = SHAPES.BOX.id;
    let currentScale = SCALE_CONFIG.DEFAULT;
    let isARActive = false;
    let initialPinchDistance = null;

    // ============================================
    // FUNCIONES DE INICIALIZACIÓN
    // ============================================

    /**
     * Inicialización principal de la aplicación
     * Configura todos los event listeners y valida el entorno
     */
    function init() {
        console.log('[WebAR] Inicializando aplicación...');

        // Validar que HTTPS esté disponible para acceso a cámara
        if (!checkHTTPS()) {
            console.warn('[WebAR] Advertencia: La aplicación debería ejecutarse sobre HTTPS');
        }

        // Configurar event listeners de la UI
        setupEventListeners();

        // Configurar eventos de la escena A-Frame
        setupARSceneEvents();

        // Configurar componentes de gestos de A-Frame
        setupGestureComponents();

        console.log('[WebAR] Aplicación inicializada correctamente');
    }

    /**
     * Verifica si el navegador soporta acceso a la cámara
     * @returns {Promise<boolean>} true si el soporte está disponible
     */
    async function checkCameraSupport() {
        console.log('[WebAR] Verificando soporte de cámara...');

        // Verificar si el navegador soporta getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showError('Tu navegador no soporta acceso a la cámara. Por favor, usa un navegador moderno como Chrome, Firefox o Safari.');
            return false;
        }

        try {
            // Intentar obtener acceso a la cámara para verificar permisos
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            // Liberar el stream inmediatamente después de la verificación
            stream.getTracks().forEach(track => track.stop());
            
            console.log('[WebAR] Soporte de cámara verificado correctamente');
            return true;
        } catch (error) {
            console.error('[WebAR] Error al verificar cámara:', error);
            
            // Determinar el tipo de error específico
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                showError('Se denegó el acceso a la cámara. Por favor, permite el acceso en la configuración de tu navegador y recarga la página.');
            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                showError('No se encontró una cámara en tu dispositivo. Asegúrate de tener una cámara conectada y funcionando.');
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                showError('La cámara está siendo utilizada por otra aplicación. Por favor, ciérrala e intenta de nuevo.');
            } else {
                showError('No se pudo acceder a la cámara: ' + error.message);
            }
            
            return false;
        }
    }

    /**
     * Verifica si la página está siendo servida sobre HTTPS
     * @returns {boolean} true si es HTTPS o localhost
     */
    function checkHTTPS() {
        const isHttps = window.location.protocol === 'https:';
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        
        return isHttps || isLocalhost;
    }

    // ============================================
    // FUNCIONES DE CONTROL AR
    // ============================================

    /**
     * Inicia la experiencia de Realidad Aumentada
     * Muestra la escena AR y los controles
     */
    async function startAR() {
        console.log('[WebAR] Iniciando experiencia AR...');
        
        // Validar soporte de cámara antes de iniciar
        const hasCameraSupport = await checkCameraSupport();
        if (!hasCameraSupport) {
            return;
        }

        // Mostrar indicador de estado
        updateStatus('Inicializando cámara...', false);
        arStatus.classList.add('visible');

        // Ocultar pantalla de inicio
        startScreen.classList.add('hidden');

        // Mostrar escena AR
        arScene.classList.add('visible');

        // Mostrar controles después de un breve retraso
        setTimeout(() => {
            controlsPanel.classList.add('visible');
        }, 2000);

        isARActive = true;

        // Verificar estado de la cámara después de un tiempo
        setTimeout(() => {
            verifyCameraStream();
        }, 5000);
    }

    /**
     * Detiene la experiencia de Realidad Aumentada
     * Oculta la escena AR y muestra la pantalla de inicio
     */
    function stopAR() {
        console.log('[WebAR] Deteniendo experiencia AR...');

        // Ocultar escena AR
        arScene.classList.remove('visible');

        // Ocultar controles
        controlsPanel.classList.remove('visible');

        // Ocultar indicador de estado
        arStatus.classList.remove('visible');

        // Mostrar pantalla de inicio
        startScreen.classList.remove('hidden');

        // Detener el stream de cámara si es posible
        const scene = document.querySelector('a-scene');
        if (scene && scene.canvas && scene.canvas.srcObject) {
            const tracks = scene.canvas.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }

        isARActive = false;
        
        console.log('[WebAR] Experiencia AR detenida');
    }

    /**
     * Verifica que el stream de cámara esté activo
     */
    function verifyCameraStream() {
        const scene = document.querySelector('a-scene');
        if (!scene) return;

        const video = scene.canvas;
        
        if (!video || video.readyState < 2) {
            console.warn('[WebAR] Advertencia: La cámara podría no estar funcionando correctamente');
            updateStatus('Advertencia: Verificando cámara...', true);
        } else {
            updateStatus('Marker detectado', false);
            statusDot.classList.add('ready');
        }
    }

    // ============================================
    // FUNCIONES DE MODIFICACIÓN DEL OBJETO
    // ============================================

    /**
     * Cambia el color del objeto AR
     * @param {string} color - Código hexadecimal del color
     */
    function changeColor(color) {
        console.log('[WebAR] Cambiando color a:', color);
        
        // Validar que sea un código de color válido
        if (!color || !/^#[0-9A-Fa-f]{6}$/.test(color)) {
            console.error('[WebAR] Color inválido:', color);
            return;
        }

        // Actualizar color actual
        currentColor = color;

        // Aplicar al objeto si está disponible
        if (arObject) {
            arObject.setAttribute('material', 'color', color);
        }
    }

    /**
     * Cambia la forma geométrica del objeto AR
     * @param {string} shape - Identificador de la forma (box, sphere, cylinder, cone)
     */
    function changeShape(shape) {
        console.log('[WebAR] Cambiando forma a:', shape);
        
        // Validar que la forma existe en la configuración
        const shapeConfig = SHAPES[shape.toUpperCase()];
        if (!shapeConfig) {
            console.error('[WebAR] Forma inválida:', shape);
            return;
        }

        // Actualizar forma actual
        currentShape = shape;

        // Aplicar geometría al objeto si está disponible
        if (arObject) {
            arObject.setAttribute('geometry', shapeConfig.geometry);
        }
    }

    /**
     * Cambia la escala del objeto AR
     * @param {number} scale - Factor de escala (entre 0.5 y 2.0)
     */
    function changeScale(scale) {
        console.log('[WebAR] Cambiando escala a:', scale);
        
        // Validar que la escala esté dentro de los límites
        const clampedScale = Math.max(SCALE_CONFIG.MIN, Math.min(SCALE_CONFIG.MAX, scale));
        
        // Actualizar escala actual
        currentScale = clampedScale;

        // Actualizar valor en el slider y display
        if (scaleSlider) {
            scaleSlider.value = clampedScale;
        }
        if (scaleValue) {
            scaleValue.textContent = clampedScale.toFixed(1) + 'x';
        }

        // Aplicar escala al objeto si está disponible
        if (arObject) {
            const scaleString = `${clampedScale} ${clampedScale} ${clampedScale}`;
            arObject.setAttribute('scale', scaleString);
        }
    }

    // ============================================
    // FUNCIONES DE INTERFAZ DE USUARIO
    // ============================================

    /**
     * Muestra un overlay de error con el mensaje especificado
     * @param {string} message - Mensaje de error a mostrar
     */
    function showError(message) {
        console.error('[WebAR] Mostrando error:', message);
        
        // Actualizar mensaje de error
        if (errorMessage) {
            errorMessage.textContent = message;
        }

        // Mostrar overlay
        if (errorOverlay) {
            errorOverlay.classList.add('visible');
        }

        // Ocultar indicador de estado
        if (arStatus) {
            arStatus.classList.remove('visible');
        }
    }

    /**
     * Oculta el overlay de error
     */
    function hideError() {
        console.log('[WebAR] Ocultando error');
        
        if (errorOverlay) {
            errorOverlay.classList.remove('visible');
        }
    }

    /**
     * Actualiza el indicador de estado de AR
     * @param {string} message - Mensaje a mostrar
     * @param {boolean} isError - Indica si es un mensaje de error/advertencia
     */
    function updateStatus(message, isError) {
        console.log('[WebAR] Actualizando estado:', message);
        
        // Actualizar texto del estado
        if (statusText) {
            statusText.textContent = message;
        }

        // Mostrar el indicador de estado
        if (arStatus) {
            arStatus.classList.add('visible');
        }

        // Actualizar estilo del indicador (listo/error)
        if (statusDot) {
            if (isError) {
                statusDot.classList.remove('ready');
            }
        }
    }

    // ============================================
    // CONFIGURACIÓN DE EVENT LISTENERS
    // ============================================

    /**
     * Configura todos los event listeners de la aplicación
     */
    function setupEventListeners() {
        // Botón de inicio AR
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                startAR();
            });
        }

        // Botón de cerrar controles
        if (closeControlsBtn) {
            closeControlsBtn.addEventListener('click', function() {
                controlsPanel.classList.remove('visible');
            });
        }

        // Botones de color
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                handleColorButtonClick(btn);
            });
        });

        // Botones de forma
        const shapeButtons = document.querySelectorAll('.shape-btn');
        shapeButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                handleShapeButtonClick(btn);
            });
        });

        // Slider de escala
        if (scaleSlider) {
            scaleSlider.addEventListener('input', function(event) {
                const scale = parseFloat(event.target.value);
                changeScale(scale);
            });
        }

        // Botón de reintentar en error
        if (retryBtn) {
            retryBtn.addEventListener('click', function() {
                handleRetry();
            });
        }

        // Evento de teclado para cerrar paneles con Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                if (errorOverlay && errorOverlay.classList.contains('visible')) {
                    hideError();
                }
                if (controlsPanel && controlsPanel.classList.contains('visible')) {
                    controlsPanel.classList.remove('visible');
                }
            }
        });
    }

    /**
     * Maneja el clic en un botón de color
     * @param {HTMLElement} btn - Elemento botón pulsado
     */
    function handleColorButtonClick(btn) {
        // Actualizar UI: quitar activo de todos, poner en el actual
        document.querySelectorAll('.color-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // Obtener color del dataset
        const color = btn.dataset.color;
        const colorName = btn.dataset.name;

        // Actualizar display de valor
        if (colorValue) {
            colorValue.textContent = colorName;
        }

        // Cambiar color del objeto
        if (color) {
            changeColor(color);
        }
    }

    /**
     * Maneja el clic en un botón de forma
     * @param {HTMLElement} btn - Elemento botón pulsado
     */
    function handleShapeButtonClick(btn) {
        // Actualizar UI: quitar activo de todos, poner en el actual
        document.querySelectorAll('.shape-btn').forEach(function(b) {
            b.classList.remove('active');
        });
        btn.classList.add('active');

        // Obtener forma del dataset
        const shape = btn.dataset.shape;
        const shapeName = btn.textContent;

        // Actualizar display de valor
        if (shapeValue) {
            shapeValue.textContent = shapeName;
        }

        // Cambiar forma del objeto
        if (shape) {
            changeShape(shape);
        }
    }

    /**
     * Maneja el clic en el botón de reintentar
     */
    function handleRetry() {
        hideError();
        
        // Recargar la página para reiniciar completamente
        location.reload();
    }

    /**
     * Configura los eventos de la escena A-Frame
     */
    function setupARSceneEvents() {
        const scene = document.querySelector('a-scene');
        
        if (!scene) {
            console.warn('[WebAR] No se encontró la escena A-Frame');
            return;
        }

        // Evento cuando la escena está lista
        scene.addEventListener('loaded', function() {
            console.log('[WebAR] Escena AR cargada correctamente');
        });

        // Evento de error de cámara
        scene.addEventListener('camera-error', function(event) {
            console.error('[WebAR] Error de cámara:', event.detail);
            handleCameraError(event.detail);
        });

        // Evento cuando se detecta el marker
        if (markerHiro) {
            markerHiro.addEventListener('markerFound', function() {
                console.log('[WebAR] Marker Hiro detectado');
                updateStatus('Marker detectado', false);
                if (statusDot) {
                    statusDot.classList.add('ready');
                }
            });

            markerHiro.addEventListener('markerLost', function() {
                console.log('[WebAR] Marker Hiro perdido');
                updateStatus('Buscando marker...', false);
                if (statusDot) {
                    statusDot.classList.remove('ready');
                }
            });
        }
    }

    /**
     * Maneja errores de cámara específicos
     * @param {Object} detail - Detalles del error
     */
    function handleCameraError(detail) {
        const message = detail.message || 'Error desconocido';

        // Determinar tipo de error y mostrar mensaje apropiado
        if (message.includes('Permission') || message.includes('NotAllowed')) {
            showError('Se denegó el acceso a la cámara. Por favor, permite el acceso en la configuración de tu navegador y recarga la página.');
        } else if (message.includes('NotFound') || message.includes('Device')) {
            showError('No se encontró una cámara en tu dispositivo. Asegúrate de tener una cámara conectada y funcionando.');
        } else if (message.includes('HTTPS') || message.includes('Secure')) {
            showError('Esta aplicación requiere HTTPS para acceder a la cámara. Por favor, usa una conexión segura o desplega en un servidor HTTPS.');
        } else {
            showError('No se pudo iniciar la cámara: ' + message + '. Por favor, verifica los permisos y recarga la página.');
        }
    }

    // ============================================
    // COMPONENTES DE GESTOS TÁCTILES
    // ============================================

    /**
     * Configura los componentes A-Frame para detección de gestos
     */
    function setupGestureComponents() {
        // Verificar que AFRAME esté disponible
        if (typeof AFRAME === 'undefined') {
            console.warn('[WebAR] A-Frame no está disponible');
            return;
        }

        // Registrar componente gesture-detector si no existe
        if (!AFRAME.components['gesture-detector']) {
            AFRAME.registerComponent('gesture-detector', {
                init: function() {
                    this.el.addEventListener('touchstart', this.onTouchStart.bind(this));
                    this.el.addEventListener('touchmove', this.onTouchMove.bind(this));
                    this.el.addEventListener('touchend', this.onTouchEnd.bind(this));
                },

                onTouchStart: function(evt) {
                    // Detectar cuando hay dos dedos (pinch)
                    if (evt.touches.length === 2) {
                        this.initialDistance = this.getDistance(evt.touches);
                        console.log('[WebAR] Inicio pinch - distancia inicial:', this.initialDistance);
                    }
                },

                onTouchMove: function(evt) {
                    // Manejar gesture de pinch
                    if (evt.touches.length === 2 && this.initialDistance) {
                        const currentDistance = this.getDistance(evt.touches);
                        const scaleFactor = currentDistance / this.initialDistance;

                        // Calcular nueva escala
                        let newScale = currentScale * scaleFactor;
                        newScale = Math.max(SCALE_CONFIG.MIN, Math.min(SCALE_CONFIG.MAX, newScale));

                        // Actualizar slider visual
                        if (scaleSlider) {
                            scaleSlider.value = newScale;
                        }
                        if (scaleValue) {
                            scaleValue.textContent = newScale.toFixed(1) + 'x';
                        }

                        // Aplicar al objeto
                        this.el.setAttribute('scale', `${newScale} ${newScale} ${newScale}`);
                        
                        // Actualizar estado
                        currentScale = newScale;

                        console.log('[WebAR] Pinch move - escala:', newScale);
                    }
                },

                onTouchEnd: function() {
                    this.initialDistance = null;
                    console.log('[WebAR] Fin pinch');
                },

                getDistance: function(touches) {
                    const dx = touches[0].clientX - touches[1].clientX;
                    const dy = touches[0].clientY - touches[1].clientY;
                    return Math.sqrt(dx * dx + dy * dy);
                }
            });
        }

        // Registrar componente gesture-handler si no existe
        if (!AFRAME.components['gesture-handler']) {
            AFRAME.registerComponent('gesture-handler', {
                init: function() {
                    // Click/tap para alternar animación
                    this.el.addEventListener('click', function() {
                        const animation = this.el.getAttribute('animation');
                        
                        if (animation) {
                            this.el.removeAttribute('animation');
                            console.log('[WebAR] Animación eliminada');
                        } else {
                            this.el.setAttribute('animation', ANIMATION_CONFIG);
                            console.log('[WebAR] Animación iniciada');
                        }
                    }.bind(this));

                    // Eventos de touch para gestos en el objeto
                    this.el.addEventListener('touchstart', function(evt) {
                        console.log('[WebAR] Touch start en objeto');
                    });
                }
            });
        }
    }

    // ============================================
    // INICIALIZACIÓN AL CARGAR EL DOM
    // ============================================

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // El DOM ya está cargado
        init();
    }

})();