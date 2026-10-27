# Claridad de Machine Learning y Deep Learning

Evaluación final: 27 de octubre de 2026. Base comparada: `3e8196b8410c31996ab00e31abb19bf9390e9d2a`.

## Alcance y protección

Se revisaron los 18 temas existentes de los seis encuentros restantes. No se añadieron asignaturas, temas, entregas ni calificaciones. El cronograma de las demás asignaturas se usó únicamente como contexto; no se incorporaron nombres ni registros personales.

Los encuentros globales 1 y 2, correspondientes a ML del 23 y 24 de octubre, conservan sus seis guías, datos de temas, vocabulario, ejemplos, prácticas y agendas. Una comparación SHA-256 verifica esa protección contra la base publicada, incluida la presentación de las agendas para el docente. Por solicitud posterior, la distribución orientativa de minutos se muestra únicamente al docente en los ocho encuentros; el estudiante conserva fechas, horarios, temas y orientación de estudio. Los ocho cuadernos se mantienen idénticos. No cambian fechas, horarios, apertura, roles ni reglas de progreso.

## Cambios evaluados

Cada tema revisado contiene pregunta, información disponible, decisión, definición de conceptos, ejemplo resuelto e interpretación. La práctica distingue los datos del ejemplo pequeño, los del explorador y los del cuaderno. Los conceptos esenciales permanecen visibles; el vocabulario adicional y los casos documentados se pueden desplegar.

| Encuentro | Temas existentes | Qué puede reconstruir y explicar el estudiante |
|---|---|---|
| ML 3 | Clustering, PCA, ensambles | Indicadores de centros de acopio; escala, distancia y vecindarios; centrado y proyección; comparación de predicciones con MAE. |
| ML 4 | Series, refuerzo, integración | Corte temporal y horizonte; pronóstico frente a decisión; estado, acción, recompensa y retorno; candidata, referencia y evidencia. |
| DL 1 | Redes, activaciones, entrenamiento | Productos, sesgo, suma y salida; activaciones; pérdida, gradiente, retropropagación y actualización; entrenamiento y validación. |
| DL 2 | Visión, CNN, transferencia | Etiqueta, caja y máscara; operación local y pesos compartidos; compatibilidad de categorías; inferencia y adaptación. |
| DL 3 | Secuencias, atención, Transformers | Orden y estado recurrente; consultas, claves, valores y mezcla ponderada; posición, bloques y prueba de una tarea. |
| DL 4 | YOLO, evaluación, integración | Propuesta frente a objeto confirmado; puntuación e IoU; aciertos, falsas propuestas y omisiones; AP/mAP y políticas de revisión. |

Se comprobaron distancia A–B = 2; media 50 y sumas de cuadrados 10+10; rendimiento y toneladas para 10 ha; MAE temporal; retorno de cinco movimientos; pérdida 25→16 o 36; memoria 21,25 frente a 13,75; mezcla de atención; IoU 0,60 frente a 1/7; costes de revisión. Las explicaciones identifican valores inventados, reglas elegidas y parámetros que requerirían aprendizaje.

## Fuentes y límites

Se contrastaron fuentes primarias de UCI Dry Bean, un estudio de pronóstico de precios con Agmarknet, gym-DSSAT, PlantVillage, pronóstico de caudales con LSTM y la descripción comercial de See & Spray. Cada referencia explica su alcance. Un conjunto de clasificación no valida clustering; un simulador no demuestra resultados de campo; una descripción comercial no acredita la arquitectura de nuestro cuaderno. Los ejemplos construidos no se presentan como modelos agrícolas validados.

## Verificación

- 140 pruebas automáticas aprobadas, sin fallos: cálculos, navegación, fechas, progreso, protección de los primeros encuentros y agenda solo para el docente, entre otras.
- Revisión en navegador de los 18 temas modificados: pregunta, contexto y resultado renderizados; seis contextos de encuentro presentes y primeros dos excluidos.
- Vocabulario desplegable y fuente documentada comprobados; sin errores de consola en el recorrido revisado.
- Lectura revisada en claro y oscuro. Entrenamiento comprobado a 320, 390, 768, 1024 y 1440 px sin desbordamiento horizontal; revisión visual adicional en móvil y escritorio.
- Página temporal exclusivamente local con reloj de revisión para inspeccionar futuros materiales; se excluye de la publicación y no altera el calendario real.

Esta evaluación comprueba consistencia conceptual, numérica y funcional. La comprensión del grupo deberá observarse durante la clase; no se infiere de las pruebas de software. Los cuadernos no se modificaron ni se volvieron a ejecutar. No se contrataron servicios ni recursos de pago.
