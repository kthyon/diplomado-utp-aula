# Colab: correspondencia con los encuentros y explicación para principiantes

Revisión del 27 de octubre de 2026 sobre la base publicada `88500e72473b98bb70dbbac10a11291002451af2`. Participaron tres revisores: ML, DL y correspondencia/ejecución independiente.

## Qué se conserva

No se modificaron los encuentros globales 1 y 2. Los archivos completos de regresión y clasificación conservan su hash original; también las primeras 22 celdas y el cierre del laboratorio ML. Se mantienen sus guías del aula y agendas. No cambian fechas, horarios, roles, apertura ni progreso.

Se revisaron los ocho cuadernos publicados y se mejoraron seis. Las copias de referencia sincronizadas en `sources/` permanecen intactas. Todos abren desde GitHub en Colab, indican guardar una copia personal y se publican sin salidas ni contadores de ejecución.

## Ruta de cada encuentro

| Encuentro | Cuaderno y parte que corresponde |
|---|---|
| ML 1, protegido | Laboratorio ML: preparación y bloque 1; regresión como apoyo. |
| ML 2, protegido | Clasificación: logística/umbral; laboratorio ML: bloque 2, conteos y métricas. |
| ML 3 | Laboratorio ML 4: DBSCAN; PCA completo; laboratorio ML 3: ensambles, tras recuperar los datos del bloque 1. Clustering de K-Means/Mean-Shift se identifica como ampliación. |
| ML 4 | Laboratorio ML 5: series; refuerzo: Q-learning; laboratorio ML 1.6 para integrar referencia, candidata y prueba. |
| DL 1 | Preparación 1–2; 01A/01B y 09A/09B: neurona, activaciones, corrección y entrenamiento. |
| DL 2 | Preparación; 10A/10B: CNN y tipos de salida. YOLO 2–6 y 9: reutilizar pesos y verificar categorías. |
| DL 3 | Preparación; 11A: LSTM; 12A: atención; 12B: Transformer. Textos no son requisito. |
| DL 4 | YOLO: propuestas, registro, filtros y sección 13 de evaluación sintética; laboratorio DL 14A: consecuencias de revisar o aceptar. |

Los 18 temas pendientes del aula muestran cuaderno principal, preparación necesaria, encabezado visible en Colab, qué observar y un tip concreto. Los identificadores internos se reservan para las pruebas. Una comprobación automática verifica que cada celda referida existe en el archivo enlazado.

## Problemas encontrados y corregidos

- DBSCAN abría primero un cuaderno de otros algoritmos. Ahora su recurso principal es el laboratorio ML, sección 4; K-Means y Mean-Shift son ampliación explícita.
- DBSCAN y series dependían de un generador aleatorio compartido. Ahora cada bloque conserva sus datos al repetirse o cambiar una configuración: la comparación deja de depender del camino seguido por el cuaderno.
- Las explicaciones de PCA, agrupación y refuerzo suponían términos previos. Se añadieron significado de cada dato, definiciones sencillas, lectura de figuras y pruebas pequeñas con una sola modificación.
- La ruta DL sugería recorrer bloques ajenos al encuentro. Repaso ML, textos y generación quedan desactivados por defecto; ejecutar todo no los activa ni instala sus bibliotecas adicionales.
- Atención del cuaderno y aula usaban ejemplos diferentes. Ahora ambos reconstruyen A=10/B=20 y las mismas tres consultas. El Transformer muestra los cuatro casos del aula, con respuesta esperada y respuesta calculada separadas.
- La evaluación de clasificación no servía para comprobar cajas. YOLO incorpora una referencia sintética conocida para IoU y TP/FP/FN. Las fotos de demostración siguen sin anotaciones: no se les atribuye mAP.
- El catálogo inicial de YOLO solo mostraba un fragmento. Ahora se puede consultar entre sus categorías completas antes de concluir si una tarea está disponible.
- Se explica que la LSTM pronostica un paso cada vez usando las doce observaciones reales anteriores, no sesenta pasos sin nuevas lecturas.

## Tips que se pueden comprobar

Cambiar solo `eps` y mantener los mismos puntos; separar coordenada negativa de mala calidad en PCA; comparar errores sobre la misma prueba; distinguir episodio de recompensa; usar consulta nula para obtener mezcla 15 en atención; probar una IoU mínima mayor con las mismas cajas; cambiar el coste de un defecto de 8 a 1 sin alterar las puntuaciones. Los tips explican qué conservar, qué cambiar y qué observar, sin introducir una tarea nueva ni una entrega.

## Verificación

- 144 pruebas del aula aprobadas, incluidas protección de los primeros encuentros y correspondencia tema → archivo → celdas.
- Sintaxis y publicación correctas en 61 celdas de código de ocho cuadernos: IDs únicos, sin outputs ni ejecución guardada.
- 16 rutas ejecutadas desde espacios independientes; 4 comprobaciones adicionales tras los últimos cambios. En total, 113 ejecuciones de celdas contando preparación repetida, sin errores.
- La comprobación adicional ejecuta las 23 celdas del laboratorio DL con sus tres ampliaciones desactivadas y confirma que no aparecen dependencias indefinidas ni importaciones de XGBoost, LightGBM o SHAP.
- Ejecución local en CPU con bibliotecas y pesos ya disponibles: cero intentos de red y cero instalaciones. Ninguna API, GPU o servicio de pago.
- DBSCAN: 123 puntos, grupos de 60 y 58, cinco sin grupo con la configuración fijada. PCA: coordenada manual igual a PC1. Refuerzo: meta en cinco pasos, retorno 6.
- Atención: mezclas aproximadas 13,302; 16,698; 15 y pesos que suman uno. Evaluación independiente, sin cargar modelo ni foto: IoU 0,60 y 1/7; conteos 1/0/0, 0/1/1 y 0/0/1 según las tres configuraciones.
- Las 18 rutas se revisaron en navegador a 390 px sin desbordamiento; se comprobaron recurso principal, tip y enlace de apertura de Colab. Lectura revisada en claro y oscuro.

Entorno local: Python 3.12.14, NumPy 2.5.4, pandas 3.0.6, scikit-learn 1.9.1, Matplotlib 3.11.2, PyTorch 2.14.1+cpu y Ultralytics 8.4.175. La ejecución local verifica estos archivos y rutas; no certifica cada sesión futura de Colab ni garantiza métricas idénticas entre versiones. Los datos simulados y las fotos de demostración no validan una aplicación agrícola real.
