# Derrotero de usabilidad y contenido · Diplomado UTP
Fecha: 21 de octubre de 2026 · Preparado para Cristian Alvarado

## Decisión principal
La siguiente mejora debe concentrarse en jerarquía, continuidad de los ejemplos y dosificación. La web ya tiene muchas de las piezas de una buena herramienta docente: objetivos, casos resueltos, vocabulario, gráficos explicados, exploradores, comparación de escenarios, copias personales de Colab, proyección y progreso. Agregar más secciones o métodos no es la prioridad.

Este documento propone cambios; no los da por implementados. El modo oscuro neutral aprobado sí está publicado y se verificó en la web.

## Alcance y límites de la comparación
Se revisaron la portada y el explorador publicados, la estructura de las 24 guías locales, los enlaces e instrucciones de cuadernos y las revisiones pedagógicas existentes. Se contrastaron cinco referentes por patrones concretos, no por parecido de marca ni por tamaño de su catálogo. La revisión es experta: todavía no mide el comportamiento de estudiantes ni demuestra mejoras de aprendizaje.

No se volvió a ejecutar aquí cada cuaderno ni a revisar cada diapositiva original. La ejecución de ocho cuadernos/60 celdas está documentada en revision-colab-2026-10-20.md. No se eludieron las fechas ni los permisos docentes para inspeccionar materiales futuros: se consultó su fuente local.

## Referentes y qué tomar de ellos

| Referente primario | Patrón observado | Qué ya tiene UTP | Refinamiento propuesto |
|---|---|---|---|
| [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course), y su [lección de regresión](https://developers.google.com/machine-learning/crash-course/linear-regression) | Módulos identificables; objetivo, requisitos y duración estimada; datos y gráficos que desarrollan un mismo ejemplo. | Objetivos, antecedentes, casos, rutas por encuentro y fuentes. | Hacer visible la ruta esencial y el tiempo orientativo de cada actividad; mantener el mismo caso al pasar al cuaderno cuando sea viable. |
| [TensorFlow Playground](https://playground.tensorflow.org/) | Controles junto al resultado, pérdidas de entrenamiento/prueba, explicación de colores y enlace que conserva una configuración de la demostración. | Controles, datos, lectura, reinicio, comparación A/B y distinción entre entrenamiento e inferencia. | Permitir abrir directamente un tema/caso y compartir su configuración pública para que todos sigan la misma demostración. |
| [CNN Explainer](https://poloclub.github.io/cnn-explainer/) | Relación entre visión general y detalle de operaciones; explicación junto a las representaciones, con imágenes que muestran el paso estudiado. | Filtros editables, selección de celdas, cuentas, escenas 3D y esquemas. | Destacar visualmente qué entrada interviene y qué salida cambia; revelar fórmulas después de la intuición y de la selección. |
| [Seeing Theory, Brown University](https://seeing-theory.brown.edu/) | Seis capítulos con secciones visuales acotadas alrededor de conceptos. | Dos asignaturas con encuentros y temas definidos. | Una pregunta principal por pantalla de práctica y menos elementos simultáneos. El sitio de referencia declara estar archivado; se usa como referencia de diseño. |
| [fast.ai: primera lección](https://course.fast.ai/Lessons/lesson1.html) | En una lección reúne instrucciones de trabajo, cuadernos, lectura y ayuda. | Accesos a cuadernos, copia personal, pasos y comprobaciones. | Un bloque consistente que lleve del ejemplo al tramo exacto del cuaderno, al resultado observable y a una ayuda breve si falla. |

No se trasladan automáticamente los temarios, exigencias de programación ni extensiones de esos cursos. Nuestra finalidad sigue siendo apoyar las clases de Cristian y sus 32 horas totales.

## Lo que conviene conservar
- Las definiciones antes del uso, los ejemplos resueltos y la lectura de gráficos ya incorporados.
- Las imágenes pertinentes y el modelo visual como complemento de la explicación.
- Los ocho exploradores con tres casos, comparación y reinicio. No hace falta inventar otro taller.
- Las copias personales de los ocho cuadernos; el progreso individual y su exportación privada.
- Generalidades 2 enlazada a la presentación viva, en su ventana de bienvenida.
- El modo claro y el oscuro neutral; alternativas 2D, foco de teclado y respeto por movimiento reducido.
- Las fechas vigentes, la ausencia de bloqueos por completar temas y las comprobaciones opcionales sin nota.

## Hallazgos concretos

### 1. La portada tiene dos centros de atención
El aviso del próximo encuentro está arriba, pero después aparecen saludo, presentación gráfica y nueve tarjetas de herramientas antes de las tarjetas de asignatura. El catálogo cuenta con búsqueda, filtros y expansión: funciona, pero ocupa mucho espacio en el camino a los materiales.

Propuesta: después del contexto y saludo, presentar las asignaturas; conservar el catálogo en inicio, más abajo y con acceso compacto. La ilustración se conserva, ajustando su peso y altura. No volver a convertir la portada en un manual de instrucciones.

### 2. La práctica se entiende mejor dentro de una clase
La navegación distingue “Explora una idea”, “Laboratorio visual” y el laboratorio guiado de cada tema. La ayuda opcional explica sus diferencias. El refinamiento pendiente es mostrar la relación concreta: qué ejemplo sirve para este concepto y a qué tema se regresa.

Propuesta: enlaces directos con asunto y propósito, por ejemplo “Comparar umbrales: qué cambia y qué permanece fijo”. Unificar los nombres de acciones, sin fusionar a la fuerza experiencias con objetivos distintos.

### 3. Hay cambios de contexto que exigen traducir demasiado
Las guías son honestas sobre las diferencias, pero el estudiante todavía debe conectarlas:
- La primera predicción usa lluvia en un caso pequeño; el explorador general de regresión usa fertilizante; el cuaderno usa tres entradas y 240 fincas.
- La guía de clasificación habla de plagas; el cuaderno de clasificación comienza con alto rendimiento e incluye Iris.
- La red inicial remite al bloque 09 del cuaderno DL; el entrenamiento simplificado remite al bloque 01.
- YOLO sirve para inferencia y filtrado; no demuestra ajuste fino ni evaluación mAP con anotaciones.

No son equivalencias falsas en el texto actual: están advertidas. Son fricciones de continuidad. Primero conectar con una ficha “misma idea / datos distintos / resultado que debes mirar”; luego adaptar algunos ejemplos para compartir datos. No forzar que tareas diferentes utilicen una sola tabla.

### 4. Las guías son completas, pero su entrada puede ser pesada
Los 24 temas usan un esquema consistente: objetivo, concepto, vocabulario, caso, conexiones y práctica. Por ejemplo, el primer tema define nueve términos y el de entrenamiento DL otros nueve. Son términos pertinentes; el problema a comprobar es cuántos necesita el estudiante antes de actuar.

Propuesta: mostrar inicialmente los términos indispensables para el paso actual y ofrecer el resto como consulta. Mantener una definición canónica por concepto; repetir una aplicación o recordar brevemente un término sí puede ser útil. No eliminar todas las recurrencias pedagógicas.

### 5. Hay buena interacción; falta hacerla más reproducible en clase
El explorador permite fijar A y cambiar B, reiniciar y proyectar. En el montaje revisado no aparece un botón para compartir la configuración ni un retorno a la lección asociada.

Propuesta: enlaces con tema, caso y controles de demostración. Al abrirlos, reproducir valores y resultado; nunca incluir nombres, notas ni progreso. Conservar reinicio y límites de valores.

### 6. El temario necesita profundidad diferenciada
ML 3 combina agrupación, PCA y ensambles; ML 4 incorpora series, refuerzo e integración. DL 3 reúne secuencias, atención y Transformers. Cuatro horas por encuentro requieren decidir qué se explicará, qué se manipulará y qué quedará para consulta. No se afirma que el temario sea incorrecto: falta hacer operativa esa selección.

## Derrotero priorizado
Esfuerzos de trabajo estimados, no promesas de entrega; incluyen edición y verificación focalizada. P1 es alta prioridad, P2 es posterior. Cristian valida el énfasis docente; las pruebas con estudiantes dependen de su disponibilidad.

| Orden | Prioridad / momento | Cambio concreto | Estimación | Criterio para darlo por terminado |
|---|---|---|---|---|
| 1 | P1 · antes de ML, 23 oct | Reordenar portada: contexto, saludo, acceso a asignaturas, presentación y catálogo conservado. | 2–3 h | En móvil se llega a la asignatura sin atravesar tarjetas de herramientas; próximo encuentro sigue visible; ambos modos conservan legibilidad. |
| 2 | P1 · antes de ML | Ensayar el recorrido completo del encuentro 1 y preparar la ficha visual → cuaderno: datos, sección, acción y salida. | 2–4 h | Abrir copia propia, ejecutar en orden y explicar el resultado sin confundir las 5 filas del ejemplo con las 240 del cuaderno. Probar con identidad sintética o copia privada, sin registros reales. |
| 3 | P1 · antes de ML | Marcar ruta esencial y ampliación del primer encuentro; acordar tiempos orientativos. | 2–3 h | Todo bloque tiene propósito y profundidad prevista; el guion cabe en 240 min con pausa y dudas, comprobado mediante ensayo. |
| 4 | P1 · antes de ML 2, 24 oct | Conectar plagas, alto rendimiento e Iris; priorizar un caso para la explicación y dejar los demás como transferencia. | 3–5 h | La transición explicita entrada, respuesta, clase positiva y origen de datos; nadie necesita asumir que las cifras pertenecen al mismo problema. |
| 5 | P1 · 26–29 oct | Aplicar jerarquía esencial/ampliación a ML 3 y ML 4; mejorar enlaces de ida y vuelta entre tema, ejemplo y cuaderno. | 4–6 h | Cada encuentro tiene un recorrido principal y todos sus enlaces abren el recurso apropiado sin buscarlo en un catálogo. |
| 6 | P1 · antes de DL, 6 nov | Reorganizar entrada a DL 1 y DL 3: intuición, dibujo, dato, operación, resultado; agregar índice de ejecución al cuaderno. | 5–8 h | Se puede seguir la red y la atención con palabras e imágenes antes de abrir la fórmula; los bloques 01/09 no obligan a adivinar el orden. |
| 7 | P2 · tras estabilizar las rutas | Compartir configuración de exploradores y acceder a un caso específico desde cada tema. | 4–6 h | El mismo enlace reproduce valores y resultados en otro navegador; no contiene información personal; una configuración inválida vuelve a un estado seguro. |
| 8 | P2 · antes de DL 4, 14 nov | Hacer más visible qué demuestra cada recurso de visión, transferencia y YOLO. | 2–3 h | Se distingue clasificar/localizar/segmentar, inferir/ajustar y filtrar/evaluar; no se presenta mAP como una medición ejecutada. |
| 9 | P1 · prueba corta inicial y repetición tras cambios | Observar 3–5 estudiantes en cinco tareas; corregir los obstáculos observados. | 2–3 h por ronda, más correcciones | Registrar tarea, tiempo aproximado, ayuda necesaria y confusión. Repetir tareas afectadas y mostrar evidencia del cambio. No convertir la muestra en estadística del grupo. |

Primer paquete realista antes del 23: filas 1–3, unas 6–10 horas estimadas más una prueba breve si hay disponibilidad. Si el tiempo es menor, priorizar el ensayo de la clase y la continuidad con Colab. Evitar un rediseño total antes del primer encuentro.

## Dosificación propuesta de los ocho encuentros
Esta selección es un punto de partida para Cristian; no cambia el programa ni elimina materiales.

| Encuentro | Comprensión esencial en clase | Consulta o extensión según avance | Comprobación opcional, sin nota |
|---|---|---|---|
| ML 1 · 23 oct | Pregunta, filas y variables; separar; preparar con entrenamiento; predicción y error con unidades. | Detalles de pipeline y comparación adicional de ajustes. | Explicar qué se conoce al predecir y por qué la respuesta de prueba no entra al ajuste. |
| ML 2 · 24 oct | Puntuación, clase positiva, umbral y cuatro resultados de una alerta. | Calibración y más indicadores. | Explicar cómo cambia la revisión al mover el umbral y qué error importa. |
| ML 3 · 30 oct | Diferenciar agrupar filas, resumir variables y combinar modelos; una demostración clara por propósito. | Comparación detallada de algoritmos y variantes de ensambles. | Elegir la herramienta adecuada para tres preguntas diferentes y justificarla. |
| ML 4 · 31 oct | Respetar el tiempo al pronosticar; comparar referencia; distinguir decidir por interacción de predecir. | Implementación detallada de Q-learning. | Explicar qué datos estaban disponibles al pronosticar y qué evidencia sostiene el cierre. |
| DL 1 · 6 nov | Entrada → pesos → activación → salida; pérdida y actualización; entrenamiento frente a inferencia. | Derivación del gradiente y variaciones de optimizador. | Señalar qué se aprende y qué configuración se elige. |
| DL 2 · 7 nov | Píxeles/canales; filtro y mapa; tarea visual; reutilizar pesos. | Variantes de padding/stride y ajuste fino detallado. | Explicar cómo una ventana produce una celda y qué salida necesita el trabajo. |
| DL 3 · 13 nov | Importancia del orden; representación; mezcla por atención; lugar de atención dentro del Transformer. | Dimensiones matriciales y arquitectura completa. | Explicar qué información recibe más peso y por qué el ejemplo no es un chatbot. |
| DL 4 · 14 nov | Caja/puntuación; referencia; error; política de revisión y límites. | Desarrollo completo de AP/mAP. | Distinguir una caja conservada de una detección comprobada y justificar la revisión. |

## Ejemplo del acabado buscado
Tema: elegir un umbral.
1. Pregunta visible: “Con capacidad para revisar cuatro plantas, ¿qué alertas revisarías?”
2. Antes del control: definir puntuación, clase positiva y umbral con las diez plantas del ejemplo.
3. Interacción: cambiar solo el umbral; mantener fijas las plantas, realidades y puntuaciones.
4. Resultado junto al gráfico: cuántas alertas, falsas alertas y plagas sin alerta; explicar los denominadores.
5. Comparación: fijar A, mover B y explicar el coste o capacidad que cambia la decisión.
6. Puente a Colab: aclarar que su sección 2 reproduce decisiones fijas de 0,50, mientras la comparación de umbrales ocurre en el explorador.
7. Cierre: una pregunta de interpretación con respuesta desplegable. Nada que entregar ni calificar.

## Prueba breve de usabilidad
Pedir a 3–5 participantes, con permiso para observar, que:
- Encuentren el próximo encuentro y distingan apertura de materiales de hora de clase.
- Abran un ejemplo de su tema e interpreten un punto, eje y unidad.
- Cambien un control y expliquen qué cambió y qué quedó fijo.
- Creen su copia de Colab, encuentren la sección y regresen al tema.
- Marquen un tema visto e identifiquen si su avance está local o sincronizado.

Registrar notas mínimas sin nombres ni analítica personal nueva. Antes de la prueba, hacer ensayo propio de teclado y móvil. Si un paso necesita explicación del observador, anotarlo como fricción. Estos resultados decidirán el siguiente ajuste, no una cifra de “usabilidad” inventada.

## Criterio de calidad editorial para próximos cambios
Un tema está listo cuando el estudiante puede identificar la pregunta, definir los términos necesarios, leer el gráfico con unidades, reproducir una operación con datos visibles, interpretar el resultado y decir qué todavía no demuestra. Un cambio visual está listo cuando conserva esas funciones en claro/oscuro, teclado, móvil y proyección, sin depender solo del color.

No priorizar ahora nuevos temas, más herramientas, premios, certificados, calificaciones o un asistente conversacional. El acabado pendiente se consigue conectando y dosificando lo existente.

## Evidencia interna para mantenimiento
- docs/app.js: orden de portada, tarjetas, rutas y acceso.
- docs/learning-layout.js y docs/learning-guides.js: estructura y contenido de los 24 temas.
- docs/idea-studio.js: lectura, controles, comparación, reinicio y proyección.
- pedagogia/revision-conceptual-2026-10-19.md: definiciones, conexiones y retiro de repeticiones.
- pedagogia/revision-colab-2026-10-20.md: ejecución y límites de cuadernos.
- pedagogia/modo-oscuro-lectura-2026-10-20.md: paleta aprobada, contraste y comprobaciones.

Los cambios del derrotero deben publicarse en commits acotados y comprobarse antes de pasar al siguiente bloque.
