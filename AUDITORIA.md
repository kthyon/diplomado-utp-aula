# Revisión del aula · 17 de octubre de 2026

Se revisaron contenido, cálculos, navegación, calendario, identidad, almacenamiento, accesibilidad y recursos enlazados. Los errores demostrados se corrigieron. Esta revisión distingue las pruebas completas de las comprobaciones parciales; no garantiza ausencia de errores futuros ni disponibilidad permanente de servicios externos.

## Cobertura y evidencia

| Área | Revisión realizada |
|---|---|
| Recorrido | 2 módulos, 8 encuentros, 24 lecciones, sus preguntas y respuestas. Apertura exacta a medianoche de Colombia, permanencia y acceso docente sin requisitos de avance. |
| Flujos | Nombre obligatorio, correo opcional de cualquier proveedor, búsqueda, rutas inválidas, perfil único, notas, progreso, exportación, importación, reinicio y copias personales en Colab. |
| Identidad y datos | SQLite real en memoria con todas las migraciones: autorregistro, cuentas aisladas, rechazo del identificador de otra cuenta, administración restringida y separación de notas del estudiante/docente. Sin escrituras de prueba en producción. |
| Simulaciones | Métricas, mediana, OLS, MAE, DBSCAN, PCA, gradiente; seis escenas con escenarios independientes y tres historias del laboratorio. |
| Machine Learning | Seis notebooks completos, 22 celdas ejecutadas sin errores ni advertencias. Métricas publicadas reproducidas. |
| Deep Learning | Dos notebooks, 35 celdas compiladas y comprobaciones de datos/fórmulas. La nueva separación de secuencias tiene 513 patrones únicos y ninguna coincidencia entre entrenamiento y prueba. Ver límites abajo. |
| Fuentes vivas | 61 diapositivas de Generalidades, 30 de ML y tres Docs. Revisión conceptual de historia, definiciones y ejemplos numéricos. Control visual de las páginas modificadas. |
| Sincronización | Ocho notebooks de Drive y del aula iguales por bytes y SHA-256, con outputs vacíos. Enlaces de ML/DL actualizados a Colab desde GitHub, conservando diseño y texto visible. |
| Recursos | 32 plataformas, 172 URLs únicas. Cero 404: 168 respuestas 200 y cuatro restricciones de cliente 403 comprobadas por otra vía oficial. Logos locales originales y procedencia verificada. |
| Interfaz | Escritorio y móvil; navegación por teclado, controles etiquetados y preferencia de movimiento reducido. Identidad Diplomado UTP IA y acabado inspirado en Material 3 Expressive, conservando el logo verde inclinado y el orbe original y los colores informativos de gráficos. |

La batería automatizada contiene 59 pruebas aprobadas. Se guardó evidencia detallada de ejecución y revisión en el espacio de trabajo del proyecto, fuera del repositorio público.

## Correcciones principales

- Las rutas de búsqueda mal codificadas y los estados locales dañados ya no dejan la aplicación vacía. Se descartan valores inválidos y duplicados del progreso.
- Importar valida el archivo antes de reemplazar notas/temas y conserva nombre, correo e identidad de la cuenta actual.
- Un guardado fallido conserva los cambios locales y ofrece reintento desde Mi progreso; las solicitudes tienen un tiempo de espera acotado.
- Importar desde el panel docente conserva las notas privadas del docente y guarda las notas del estudiante en su ámbito correcto. Reiniciar el avance del estudiante no borra notas privadas.
- Los controles del laboratorio tienen nombre accesible; el salto a la demostración conserva historia y parámetros. El relato KNN describe correctamente los tres vecinos del ejemplo.
- Se retiraron etiquetas de datos reales y recomendaciones causales/agronómicas que no estaban respaldadas por las simulaciones.
- Se corrigieron MeanShift, comparación SVM, reentrenamiento involuntario de KNN al dibujar, interpretación de PCA y la etiqueta de política óptima en Q-learning.
- PCA usa la misma escala geométrica en ambos ejes. Se explican máxima varianza, ortogonalidad, bagging, boosting y stacking, y las diferencias entre los ejemplos web/cuaderno.
- Las explicaciones DL señalan qué operación muestra realmente cada explorador. Se aclararon la neurona manual, atención ilustrativa y el papel de flatten/posición en el Transformer.
- Se completaron imports compartidos, verificación de versión YOLO y separación de secuencias antes de entrenar/probar; no se afirma una exactitud nueva.
- Se corrigieron una referencia NIST de intervalos, dos errores puntuales en la guía DL y el título del mapa de respuesta CNN.

## Límites de verificación

Los entrenamientos PyTorch y la inferencia real de Ultralytics no se reejecutaron en este entorno, que no incluye esos frameworks. Las comprobaciones DL de esta revisión son sintácticas, matemáticas y de separación de datos; no certifican resultados de entrenamiento ni rendimiento en datos agrícolas reales. La ejecución local ML confirma los resultados con las versiones registradas, sin garantizar que Colab conserve siempre el mismo entorno.

Los flujos de escritura del registro se probaron con cuentas ficticias en SQLite y en una vista local del aula. La autenticación externa depende de una sesión real de ChatGPT; las pruebas locales no sustituyen esa verificación. No se crearon ni borraron registros reales para auditar.

La revisión conceptual de fuentes abarcó su texto nativo. No es una inspección visual exhaustiva de cada detalle de las 91 diapositivas y todas las páginas de los Docs. Las cuatro respuestas 403 son restricciones al cliente de auditoría, no pruebas de enlaces rotos.

## Fuentes de contraste

[Prácticas de scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html), [PCA](https://scikit-learn.org/stable/modules/decomposition.html#pca), [ensambles](https://scikit-learn.org/stable/modules/ensemble.html), [MeanShift](https://scikit-learn.org/stable/modules/generated/sklearn.cluster.MeanShift.html), [evaluación](https://scikit-learn.org/stable/modules/model_evaluation.html), [aprendizaje PyTorch](https://docs.pytorch.org/tutorials/beginner/basics/optimization_tutorial.html), [Transformer original](https://arxiv.org/abs/1706.03762), [NIST: confianza](https://itl.nist.gov/div898/handbook/pmd/section5/pmd511.htm), [NIST: predicción](https://itl.nist.gov/div898/handbook/pmd/section5/pmd512.htm), [Material 3 Expressive](https://m3.material.io/get-started), [movimiento](https://m3.material.io/styles/motion/overview/how-it-works).
