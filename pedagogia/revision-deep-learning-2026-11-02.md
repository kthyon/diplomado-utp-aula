# Revisión de Deep Learning · 2 de noviembre de 2026

## Diagnóstico antes de editar

La base separaba correctamente inferencia, entrenamiento y evaluación. Las dificultades principales eran los saltos entre una neurona y varias capas, el motivo de introducir no linealidades, vocabulario necesario oculto en desplegables y el paso de operaciones pequeñas a conclusiones sobre modelos. Los controles funcionaban, pero neurona y convolución comenzaban su explicación interactiva con tablas. Faltaba comprobar transferencia de comprensión sin limitarse a repetir una cuenta.

## Cambios acotados a DL

- Los doce temas incorporan tres definiciones previas visibles, una explicación del porqué, un recorrido gráfico numerado con valores y una pregunta de transferencia con respuesta razonada opcional. La fuente acompaña cada fundamento.
- Redes: conexión explícita de una salida oculta con la capa siguiente; parámetros dados y significado de representación.
- Activaciones: equivalencia de capas afines sin no linealidad y experimento ejecutable ReLU(x)+ReLU(−x)=|x| frente a x+(−x)=0. Conserva parámetros al cambiar la activación.
- Entrenamiento: signo del gradiente, tasa, retropropagación frente a actualización, lote, época y separación validación/prueba.
- Visión y CNN: canales, forma de tensor, etiquetas/cajas/máscaras, instancias, compartición de filtros, tamaño de mapa y diferencia entre respuesta y objeto.
- Transferencia: extractor, cabeza, congelación y ajuste fino; distingue el esquema de adaptación de la inferencia efectivamente ejecutada en Colab.
- Secuencias, atención y Transformer: desarrolla RNN/LSTM, explica estado y orden, separa parámetros aprendidos y participaciones de atención; aclara productos escalares, escalado, softmax, posición y arquitectura completa.
- Detección: separa corte de puntuación, IoU de evaluación e IoU de NMS; explicita emparejamiento uno a uno y FP/FN simultáneos. Conserva la distinción entre ≥ didáctico y > conf en la inferencia de Ultralytics.
- Integración: cuenta completa de costes, supuestos de revisión y elección de política con validación.
- Neurona y CNN tienen gráficos que se recalculan con los controles existentes; incluyen ampliación y desplazamiento local accesible.
- Explora una idea: solo se amplían Activaciones, Aprendizaje, Visión y Filtros de imagen.
- Laboratorio visual: solo se amplía la red. El nuevo gráfico compara puntuación inicial y actual de los ocho mensajes y muestra su pérdida calculada. No lo presenta como prueba de generalización.
- Los cuatro cuadernos principales DL reciben las mismas definiciones, razones y preguntas. Sus 50 celdas de código conservan exactamente IDs y código de la versión publicada; sin outputs.

## Alcance y comprobación

Base publicada: f545631fee2923b434ea9a699e08955273e835a2; árbol 626d1cda0fefb3aebaf9f1d87001f5e8d6aa779e.

194 pruebas aprobadas. Regeneración de los ocho principales verificada con --check. Los cuatro principales ML conservan su hash Git publicado; las fuentes originales de apoyo permanecen intactas. Los renderizadores adicionales devuelven vacío para ML. Sin cambios en calendario, apertura, registro, API, roles, notas ni progreso.

Revisión en navegador con sesión docente sintética local: 12 temas × 5 anchos (320, 390, 768, 1024 y 1440) × 2 temas de color, sin desbordamiento de página. Verificados cambio de activación, cuenta actual y conservación de ampliación al mover x, selección de ventana de CNN, ampliación con desplazamiento local y ciclo predicción/error/ajuste de la red con comparación de ocho casos. Sin errores de consola en esas comprobaciones.

No se repitió la ejecución CPU de Colab: el código es idéntico al ya auditado; esta revisión cambia exclusivamente su explicación. Los gráficos de la web sí ejecutan sus propias cuentas y se verifican con los modelos y controles reales.

La página /aula/ del servicio Sites sirve los recursos de GitHub Pages. Estos cambios se publican en ese repositorio; no requieren modificar ni desplegar el backend de registros.
