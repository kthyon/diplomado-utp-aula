# diplomado-utp-aula

Aula interactiva de Machine Learning y Deep Learning v2.0 ·Ing. Cristian Alvarado · UTP

## Aula UTP · Guía de uso

Aula interactiva de los módulos 5 (Machine Learning) y 6 (Deep Learning) del Diplomado en Ciencia de Datos para Agronegocios, 2026–2.

Web: https://kthyon.github.io/diplomado-utp-aula/

## Qué incluye

8 clases y 24 temas con una capacidad práctica, un concepto, un ejemplo resuelto y un laboratorio final. Cada laboratorio propone una construcción verificable: tablas de predicciones, reglas de alerta, mapas, pronósticos, pruebas o registros de detección. Incluye pasos para trabajar en una copia personal del cuaderno, comprobación, aplicación a otra operación y una ampliación opcional con código. La bitácora conserva resultados y decisiones con el mismo guardado de notas. Los exploradores son didácticos; los entrenamientos e inferencias se realizan en los cuadernos indicados.

## Entrada y apertura de clases

Antes de entrar a cualquier contenido, incluido el laboratorio mediante un enlace directo, cada estudiante debe escribir su nombre y apellidos. Un correo o alias no reemplaza el nombre. El correo es opcional y admite cualquier proveedor. El nombre y el avance se conservan en el navegador; conectar el registro permite sincronizarlos desde la vista autenticada del aula.

Cada encuentro abre todos sus temas a las **00:00 de su fecha, hora de Colombia (America/Bogota)**. Una vez abierto, permanece disponible, sin fecha de cierre. Las ocho fechas están en `docs/content.js:COURSES`: 23, 24, 30 y 31 de octubre; 6, 7, 13 y 14 de noviembre de 2026. El progreso es voluntario: marcar un tema como visto no es un requisito para abrir el siguiente.

La vista docente autenticada muestra los 24 temas y todos los cuadernos desde el primer día. El rol lo verifica el backend con la identidad del docente y `ADMIN_EMAIL`; no depende del nombre escrito, del hash de la URL ni del almacenamiento local. Entra desde **Espacio docente** y usa **Abrir aula docente** desde el panel del grupo.

`docs/access-policy.js` calcula la apertura acumulativa. `docs/releases.json` documenta la política y ya no contiene decisiones manuales de apertura. El antiguo flujo de desbloqueo se sustituye por una comprobación del calendario. La apertura organiza la navegación pedagógica; los archivos del repositorio y de GitHub Pages siguen siendo públicos.

La bienvenida muestra **Generalidades 2** incrustada desde Google Slides al entrar por primera vez en una asignatura. La marca se guarda por navegador, compartida por ambas asignaturas. Se puede reabrir con **Ver generalidades** y proyectar en otra pestaña; los cambios de la presentación original se consultan al abrir o actualizar el visor.

La navegación incluye acceso por teclado, foco visible, estado de página, títulos de ventanas y menú móvil que retira los enlaces ocultos del recorrido del teclado. Se respeta la preferencia de movimiento reducido.

## Copias de Colab

Los ocho notebooks están versionados sin resultados de ejecución. El botón de cada tema abre el cuaderno desde este repositorio en Colab. Cada usuario elige **Archivo → Guardar una copia en Drive** y trabaja en su copia y su entorno; no modifica la referencia ni la copia de otra persona. Cambiar el repositorio no actualiza copias personales ya guardadas.

Los cuadernos pueden reunir varios temas: se indica qué parte corresponde a cada clase. La secuencia del sitio no impide descargar un notebook completo desde GitHub.

Los cuadernos de ML provienen de los materiales revisados en este hilo. Los de DL provienen del laboratorio ilustrado y del registro visual YOLO existentes en Drive. Se conservaron código y explicaciones, se retiraron salidas y se añadió la instrucción de copia personal. Para GPU, instalaciones y descargas, sigue las indicaciones de cada cuaderno.

## Desarrollo y publicación

Sitio estático sin instalación ni dependencias de construcción. Sirve `docs/` con un servidor HTTP. Ejecuta `node --test tests/*.test.mjs` y comprueba sintaxis con `node --check docs/app.js` y `node --check docs/simulators.js`.

GitHub Pages debe usar **GitHub Actions** como fuente. `pages.yml` comprueba y publica cada commit a main. `desbloquear.yml` solo verifica el calendario y ya no modifica ni publica habilitaciones.

El progreso del estudiante se guarda en localStorage, con exportación e importación JSON. Al conectar el registro, el avance y las notas se sincronizan con la base privada del curso y el docente puede consultarlos. Google Fonts y los enlaces externos tienen sus propios servicios. El aula no incluye analíticas.

## Mantenimiento desde el hilo de GPT

Cuando se cambien conceptos, gráficos, ejemplos o cuadernos en este hilo, actualizar las copias y la interfaz correspondiente, comprobarlas, crear un commit y verificar GitHub Pages. No basta con modificar Drive. Conservar las fechas del calendario al hacer cambios editoriales; cualquier modificación de fechas debe ser explícita. No es un monitor automático del chat: se realiza al trabajar en las siguientes solicitudes de este hilo.

Fuentes primarias de conceptos se enlazan en cada tema. Los horarios y fechas corresponden al cronograma compartido. Las infografías son los apoyos visuales de DL creados previamente en este hilo.

## Taller visual para acompañar la clase

El acceso **Laboratorio visual** abre `laboratorio.html` con tres demostraciones adicionales: una red 2–3–1 que aprende una etiqueta de riego mediante retropropagación, una comparación de KNN con y sin estandarización y un conjunto de 100 piezas para explorar exactitud, recall y precisión. La red conserva sus pesos al cambiar las entradas; solo los botones de aprendizaje los ajustan. KNN calcula la escala con los seis registros de referencia, sin incluir la consulta. El ejemplo de métricas conserva las etiquetas y puntuaciones al mover el umbral y muestra la precisión como no definida cuando no hay alertas.

La entrada al laboratorio presenta historias animadas: una escena, una frase por momento y un botón de reproducción, con pausa, avance manual y reinicio. La historia de riego tiene cinco momentos y un invernadero original con planta Three.js; la respuesta final usa diez actualizaciones reales sobre el mismo ejemplo. Al volver atrás o repetir la historia se reconstruye el estado correspondiente, sin acumular entrenamiento. Los controles, cifras y cálculos se abren solo en «Explorar por mi cuenta». El cambio manual de datos pausa la historia y se identifica como exploración. La reproducción se detiene al ocultar la página; se respeta la preferencia de movimiento reducido.

Las ideas de riego, escalado y métricas se tomaron como referencia del canal Iterixs; se enlazan el reel de riego, el canal y fuentes técnicas primarias. El código, las ilustraciones y los datos del laboratorio son propios. Los datos y etiquetas son inventados; la escena de riego no es una recomendación agronómica. Incluye una escena Three.js, esquema alternativo, controles accesibles, adaptación móvil y vista para proyectar. No cambia el desbloqueo de temas ni registra calificaciones.

La portada presenta una herramienta de explicación y exploración. El taller contiene seis escenas isométricas: predicción de cosecha, decisiones de alerta, imputación de lluvia, activaciones, ajuste de un parámetro y tareas de visión. Cada escena tiene controles, tres escenarios preparados, inspección de objetos y una comparación A/B que conserva una copia independiente de los valores. La vista para proyectar oculta la navegación y amplía las etiquetas.

Los ejemplos son didácticos y están identificados como inventados. Las ilustraciones responden a los cálculos de scene-models.js; no ejecutan modelos de Colab ni simulan causalidad agronómica. La pérdida de entrenamiento se explica como una metáfora de un parámetro. La ruta de temas, su apertura por calendario, las copias personales en Colab y la bienvenida con Generalidades 2 se conservan. Las escenas introductorias están disponibles para explicar en clase; no habilitan los cuadernos ni marcan temas como vistos.

Uso: abre Taller visual, elige una pregunta, guarda el escenario A, modifica B y compara las cifras y el dibujo. Pulsa Vista para proyectar para usarlo frente al grupo.

## Registro de estudiantes

El acceso con el nombre del estudiante reúne su perfil y progreso; desde allí puede conectar su registro con nombre completo obligatorio y correo opcional de cualquier proveedor. El acceso se protege con ChatGPT; no se presenta el formulario como Google OAuth. Conectar mi registro abre la vista conectada del mismo taller. En ella, el avance y notas personales se guardan automáticamente; si falla la conexión, se conservan cambios pendientes en el navegador. Cada registro se asocia a una identidad autenticada; escribir el nombre de otro alumno no da acceso a sus datos.

Espacio docente abre la administración solo para el docente, identificado por ADMIN_EMAIL en el servicio. Allí aparecen los registros, temas vistos y notas. El backend y migraciones están en backend/; los datos nunca se publican en GitHub. Exportar descarga una copia privada y Vaciar registros borra el grupo en cascada, manteniendo el catálogo. Para retirar la integración: enabled:false en docs/database-config.js.

## Herramientas en la portada

La sección duplicada del taller en inicio se sustituye por una caja de herramientas: n8n para explorar integraciones, Hugging Face y accesos a OpenAI, Google AI Studio y Anthropic. Los enlaces apuntan a plataformas y catálogos de integración oficiales, sin fijar modelos ni versiones. El taller permanece en la navegación como sección propia. La aplicación no configura conexiones ni consume APIs de esos proveedores.

El catálogo de herramientas reúne 32 plataformas con el mismo formato, incluido n8n. Tiene búsqueda por tarea, filtros por seis usos y carga progresiva. Usa los logos oficiales almacenados en `docs/assets/tool-logos/`; el origen de cada archivo está en `sources.json`. No fijar nombres de modelos ni versiones.

## Revisión de octubre de 2026

La [auditoría](AUDITORIA.md) documenta cobertura, correcciones, fuentes y límites de verificación. Los 24 temas siguen el recorrido objetivo → concepto → ejemplo resuelto → laboratorio final, con una sección concreta del cuaderno para continuar. El acabado usa superficies claras, formas suaves y movimiento inspirado en Material 3 Expressive. El orbe conserva su red y movimiento, con volumen difuso y fondo independiente; se respetan los logos y los colores explicativos de los gráficos. Importar progreso conserva la cuenta actual, y las notas privadas del docente se mantienen separadas de las notas del estudiante.
