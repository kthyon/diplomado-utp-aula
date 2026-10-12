# Registro privado de Nexo IA

Servicio relacional Cloudflare D1 (SQLite) alojado por Sites, separado del aula de GitHub Pages. El código y las migraciones se versionan en GitHub; los registros, notas y exportaciones personales no se guardan en el repositorio.

## Acceso y alcance

Mantener el Site **privado, solo propietario**. El servicio depende de esa frontera de acceso: no cambiar su audiencia a pública ni compartirlo con alumnos sin implementar antes autorización por rol y por registro. Las API también rechazan visitantes sin identidad de Sites y las escrituras desde otro origen. No hay contraseñas ni claves en el navegador.

El docente registra y edita estudiantes, consulta y marca temas vistos e importa los JSON de progreso compartidos por los alumnos. El progreso del taller continúa siendo local y **no se sincroniza automáticamente**. El panel no envía invitaciones ni correos y no modifica el desbloqueo manual de las clases.

## Tablas

- `students`: identificador aleatorio, nombre, correo opcional y fechas.
- `courses`: las dos asignaturas.
- `topics`: los 24 temas con su asignatura y orden.
- `enrollments`: relación estudiante–asignatura.
- `progress`: temas vistos; referencias compuestas evitan registrar un tema en otra asignatura.
- `notes`: nota de seguimiento o nota importada asociada a estudiante, asignatura y tema opcional.

`catalog.json` es una copia de la estructura del aula. `/api/setup` siembra el catálogo fuera de las migraciones, una vez autenticado. Nunca se crean tablas durante solicitudes. Las migraciones ya aplicadas son inmutables.

## Limpiar o retirar

1. En el panel, **Exportar todos los registros** si necesitas una copia privada. El archivo contiene información personal.
2. **Limpiar los registros → Vaciar registros** exige escribir `VACIAR REGISTROS`. Borra estudiantes, inscripciones, avances y notas en cascada; mantiene el catálogo. La eliminación no tiene papelera.
3. Para borrar solo un estudiante, abre su registro y pulsa **Borrar estudiante**. Exige escribir `BORRAR`.
4. Para retirar la conexión del aula, cambia `enabled` a `false` en `docs/database-config.js` y publica el commit. El taller sigue funcionando y los datos del servicio permanecen privados.
5. Para retirar también la base alojada, elimina el Site desde su administración después de exportar si corresponde. No subir la exportación ni copias SQLite a GitHub.

## Publicación

`node build.mjs` genera `dist/server/index.js` con el catálogo incrustado. Sites aplica `drizzle/0000_registros.sql` al D1 del proyecto antes de publicar. Usar el flujo de publicación privada de la skill Sites, preservando `.openai/hosting.json`. La copia del código en GitHub no despliega automáticamente este servicio: publicar los cambios de backend también en Sites.

Pruebas: `node --test tests/*.test.mjs` y `python tests/relations.py`. La prueba SQLite usa únicamente registros ficticios en memoria.
