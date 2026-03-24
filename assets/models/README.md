# Modelos 3D para WebAR

Este directorio está destinado a almacenar modelos 3D personalizados para la aplicación WebAR.

## Formatos Soportados

Los formatos de modelo 3D soportados son:

- **.glb** - GL Transmission Format (binario) - Recomendado
- **.gltf** - GL Transmission Format (JSON)

## Cómo Agregar Modelos 3D Personalizados

1. Coloca tus archivos `.glb` o `.gltf` en este directorio (`assets/models/`)
2. Asegúrate de que el modelo tenga texturas embebidas o en la carpeta correcta
3. Verifica que el tamaño del modelo sea оптимизирован para web (recomendado < 5MB)

## Cómo Modificar index.html para Usar Modelos Personalizados

Para usar un modelo personalizado en lugar del predeterminado, necesitas modificar el archivo `index.html`:

### Opción 1: Cambiar la URL del modelo en el código

Busca en `index.html` la sección donde se carga el modelo y cambia la ruta:

```javascript
// Busca esta línea en el código
const modelUrl = 'assets/models/tu-modelo.glb';
```

### Opción 2: Modificar el elemento HTML

Si usas un elemento específico para el modelo, cambia el atributo:

```html
<a-entity 
  gltf-model="assets/models/tu-modelo.glb"
  ar-marker="preset: hiro">
</a-entity>
```

## Ejemplo de Código para Cargar un Modelo

### Usando A-Frame (Recomendado)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://aframe.io/releases/1.4.0/aframe.min.js"></script>
  <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
</head>
<body style="margin: 0; overflow: hidden;">
  <a-scene embedded arjs>
    <!-- Cargar modelo personalizado -->
    <a-entity 
      gltf-model="assets/models/mi-modelo.glb"
      scale="0.5 0.5 0.5"
      position="0 0 0"
      ar-marker="preset: hiro">
    </a-entity>
    <a-entity camera></a-entity>
  </a-scene>
</body>
</html>
```

### Usando Three.js Directamente

```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

loader.load(
  'assets/models/mi-modelo.glb',
  function(gltf) {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, 0);
    scene.add(model);
  },
  function(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% cargado');
  },
  function(error) {
    console.error('Error al cargar el modelo:', error);
  }
);
```

## Optimización de Modelos

Para obtener mejores resultados:

1. **Comprime el modelo** - Usa herramientas como gltf-pipeline o Draco
2. **Reduce polígonos** - Elimina geometría innecesaria
3. **Optimiza texturas** - Usa resoluciones apropiadas (máximo 2048x2048)
4. **Embebe texturas** - Para modelos pequeños, embedding texturas mejora el rendimiento

## Herramientas Recomendadas

- [glTF Pipeline](https://github.com/CesiumGS/gltf-pipeline) - Compresión y optimización
- [Blender](https://www.blender.org/) - Modelado y exportación
- [MeshLab](https://www.meshlab.net/) - Limpieza de mallas
- [gltf.pmnd.rs](https://gltf.pmnd.rs/) - Visualizador y conversor online
