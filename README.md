# diplomado-utp-aula

Aula interactiva de Machine Learning y Deep Learning v2.0 ·Ing. Cristian Alvarado · UTP

## Aula UTP · Guía de uso

Aula interactiva de los módulos 5 (Machine Learning) y 6 (Deep Learning) del Diplomado en Ciencia de Datos para Agronegocios, 2026–2.

Web: https://kthyon.github.io/diplomado-utp-aula/

## Qué incluye

8 clases, 24 temas, 12 exploradores (regresión, imputación, matriz y umbral, DBSCAN, proyección PCA, comparación de ensambles, activaciones, gradiente, atención, tareas de visión, series y GridWorld), comprobaciones voluntarias, notas personales, insignias, búsqueda y biblioteca. Los exploradores son didácticos; no sustituyen entrenamientos ni evalúan modelos reales.

## Habilitación manual

Generalidades y dos exploradores introductorios están abiertos. Los temas de ambas asignaturas comienzan cerrados.

La bienvenida muestra **Generalidades 2** incrustada desde Google Slides al entrar por primera vez en una asignatura. La marca se guarda por navegador, compartida por ambas asignaturas; no es una marca por cuenta. Se puede reabrir con «Volver a ver la bienvenida» y proyectar en otra pestaña. Editar la presentación original se refleja al abrir o actualizar el visor, sin una copia ni otro commit. Si se borra el almacenamiento del navegador, la bienvenida aparecerá de nuevo. Las generalidades ya no se duplican como una página de texto.

1. Abre **Espacio del docente** en la web.
2. Selecciona una clase o un tema y pulsa **Preparar desbloqueo**.
3. En GitHub Actions, abre **Run workflow**, elige el destino indicado y ejecuta **Desbloquear temas de clase**.
4. El flujo habilita todos los temas hasta ese destino en la asignatura, guarda un commit y publica el estado nuevo. No abre temas por fecha.

Un estudiante debe recorrer y marcar como visto el tema anterior para entrar al siguiente que ya haya habilitado el docente. Esta secuencia es pedagógica: el sitio y su repositorio son públicos, no protegen archivos privados. Las insignias y puntos no son notas ni certificaciones.

La habilitación se conserva en `docs/releases.json`. El docente también puede editar ese archivo y guardar un commit. Para volver a bloquear temas, conserva un prefijo continuo de la lista de la asignatura; el test valida que no haya huecos. No hay contraseña ficticia ni tokens incrustados en JavaScript.

## Copias de Colab

Los ocho notebooks están versionados sin resultados de ejecución. El botón de cada tema abre el cuaderno desde este repositorio en Colab. Cada usuario elige **Archivo → Guardar una copia en Drive** y trabaja en su copia y su entorno; no modifica la referencia ni la copia de otra persona. Cambiar el repositorio no actualiza copias personales ya guardadas.

Los cuadernos pueden reunir varios temas: se indica qué parte corresponde a cada clase. La secuencia del sitio no impide descargar un notebook completo desde GitHub.

Los cuadernos de ML provienen de los materiales revisados en este hilo. Los de DL provienen del laboratorio ilustrado y del registro visual YOLO existentes en Drive. Se conservaron código y explicaciones, se retiraron salidas y se añadió la instrucción de copia personal. Para GPU, instalaciones y descargas, sigue las indicaciones de cada cuaderno.

## Desarrollo y publicación

Sitio estático sin instalación ni dependencias de construcción. Sirve `docs/` con un servidor HTTP. Ejecuta `node --test tests/*.test.mjs` y comprueba sintaxis con `node --check docs/app.js` y `node --check docs/simulators.js`.

GitHub Pages debe usar **GitHub Actions** como fuente. `pages.yml` comprueba y publica cada commit a main. `desbloquear.yml` publica directamente después de su commit porque los pushes con GITHUB_TOKEN no disparan un segundo workflow. Solo cuentas con permisos de escritura pueden ejecutar estos flujos.

El progreso del estudiante se guarda en localStorage, con exportación e importación JSON. No se envía a servidores ni se sincroniza entre dispositivos. Google Fonts y los enlaces externos tienen sus propios servicios. El aula no incluye analíticas.

## Mantenimiento desde el hilo de GPT

Cuando se cambien conceptos, gráficos, ejemplos o cuadernos en este hilo, actualizar las copias y la interfaz correspondiente, comprobarlas, crear un commit y verificar GitHub Pages. No basta con modificar Drive. Mantener el estado de habilitación manual existente; no abrir temas por una actualización editorial. No es un monitor automático del chat: se realiza al trabajar en las siguientes solicitudes de este hilo.

Fuentes primarias de conceptos se enlazan en cada tema. Los horarios y fechas corresponden al cronograma compartido. Las infografías son los apoyos visuales de DL creados previamente en este hilo.

## Taller visual para acompañar la clase

La portada presenta una herramienta de explicación y exploración. El taller contiene seis escenas isométricas: predicción de cosecha, decisiones de alerta, imputación de lluvia, activaciones, ajuste de un parámetro y tareas de visión. Cada escena tiene controles, tres escenarios preparados, inspección de objetos y una comparación A/B que conserva una copia independiente de los valores. La vista para proyectar oculta la navegación y amplía las etiquetas.

Los ejemplos son didácticos y están identificados como inventados. Las ilustraciones responden a los cálculos de scene-models.js; no ejecutan modelos de Colab ni simulan causalidad agronómica. La pérdida de entrenamiento se explica como una metáfora de un parámetro. La ruta de temas, su habilitación manual, las copias personales en Colab y la bienvenida con Generalidades 2 se conservan. Las escenas introductorias están disponibles para explicar en clase; no habilitan los cuadernos ni marcan temas como vistos.

Uso: abre Taller visual, elige una pregunta, guarda el escenario A, modifica B y compara las cifras y el dibujo. Pulsa Vista para proyectar para usarlo frente al grupo.

## Registro de estudiantes

El botón Registro rápido permite a cada estudiante crear su registro con nombre completo o correo UTP. El acceso se protege con ChatGPT; no se presenta el formulario como Google OAuth. Registro rápido abre la vista conectada del mismo taller. En ella, el avance y notas personales se guardan automáticamente; si falla la conexión, se conservan cambios pendientes en el navegador. Cada registro se asocia a una identidad autenticada; escribir el nombre de otro alumno no da acceso a sus datos.

Espacio docente abre la administración solo para el docente, identificado por ADMIN_EMAIL en el servicio. Allí aparecen los registros, temas vistos y notas. El backend y migraciones están en backend/; los datos nunca se publican en GitHub. Exportar descarga una copia privada y Vaciar registros borra el grupo en cascada, manteniendo el catálogo. Para retirar la integración: enabled:false en docs/database-config.js.
