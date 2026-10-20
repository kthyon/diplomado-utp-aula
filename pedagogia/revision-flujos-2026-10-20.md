# Revisión del recorrido del estudiante · 20 de octubre de 2026

Se revisó ingreso → asignatura → encuentro → concepto → ejemplo → práctica → Colab → bitácora → tema visto → progreso → regreso, junto con apertura de materiales, registro conectado y recuperación ante fallos. Tres agentes revisaron orientación pedagógica, calendario y registro; los cambios se integraron y comprobaron conjuntamente.

## Calendario conservado

Machine Learning: 23, 24, 30 y 31 de octubre de 2026. Deep Learning: 6, 7, 13 y 14 de noviembre de 2026. Viernes de 18:00 a 22:00; sábados de 08:00 a 12:00, hora de Colombia. Cuatro horas por encuentro, 16 por asignatura y 32 entre ambas. Se comparó la estructura completa de COURSES con la copia anterior: idéntica.

Los materiales abren a las 00:00 de cada fecha y permanecen disponibles. Esa apertura no es la hora de clase. Ningún tema exige completar otro. No se agregó enlace de conexión: está pendiente de que el docente lo proporcione.

## Inconsistencias corregidas

- Inicio: antes mostraba el último encuentro abierto, aunque hubiera temas anteriores pendientes. Ahora separa «retomar» del siguiente encuentro por fecha y hora; contempla antes de iniciar, horario en curso y final del calendario.
- Temporización: cambiar de día sin apertura de temas ya no produce un aviso de nueva clase. La actualización se alinea con medianoche e inicio/cierre de horarios, sin borrar la bitácora que se está editando. Una consulta breve de hora de referencia mejora el reloj; si falla, el aula continúa con el reloj disponible.
- Orientación: se explican cinco pasos y la diferencia entre práctica del tema, Explora una idea y Laboratorio visual. Cada tema identifica asignatura, encuentro y posición.
- Cierre: marcar únicamente el último tema ya no anuncia una asignatura completa. Se comprueban los 12 temas de la asignatura y los 24 del recorrido; volver a marcar no suma dos veces. El siguiente encuentro futuro conserva su cierre por fecha.
- Progreso: queda explícito que registra temas marcados como vistos, no asistencia ni ejecución comprobada de Colab. Un tema pendiente puede recuperarse cuando sus materiales estén abiertos.
- Colab: instrucciones para reutilizar la misma copia personal entre temas, ejecutar el bloque indicado y regresar al aula. Colab no marca avance automáticamente. Los ejercicios no requieren un entorno de pago.
- Registro: la navegación de regreso se consume una vez y conserva encuentro o tema. Los errores de correo duplicado se explican sin mostrar detalles internos. El avance permanece pendiente hasta la confirmación del servidor; los fallos permiten reintento.
- Traslado entre sitios: el registro conectado no puede leer el almacenamiento del sitio público. Ahora se guía descarga privada → conexión → importación, explicando que la importación reemplaza temas y notas y conserva la cuenta abierta.
- Laboratorio: se valida el destino de regreso y se reutiliza el nombre ya registrado. La verificación de sesión tiene tiempo límite y una pantalla para reintentar si el servicio falla.

## Validación

- 124 pruebas automáticas de interfaz, cálculos, calendario, registro y backend, incluido aislamiento entre cuentas con SQLite real: aprobadas.
- Recorrido en navegador de los 24 temas con identidad sintética local: ML termina en 12/24 (50 %) y ambas asignaturas en 24/24 (100 %), sin errores de consola. No se modificaron cuentas ni avances del servicio publicado.
- Comprobados modal de Colab, guía de traslado con continuación deshabilitada antes de descargar, cancelación y reanudación en DL, acceso directo al encuentro y vista móvil de 390 px sin desbordamiento general.
- Pruebas de límites: medianoche en Colombia, inicio y fin del horario, temas futuros, llegada directa al último tema, guardado fallido y ausencia de sesión.

## Límites que siguen siendo relevantes

El guardado conectado usa la última versión enviada: editar simultáneamente en dos dispositivos no fusiona sus cambios. Se indica esperar «Avance sincronizado» antes de cambiar de dispositivo. No se alteró el modelo de datos ni se fusionaron identidades o registros manuales del docente. La asistencia real requiere una fuente o procedimiento independiente; el porcentaje no la acredita. La prueba sintética de recorrido no reemplaza una verificación de conexión o asistencia a los encuentros.
