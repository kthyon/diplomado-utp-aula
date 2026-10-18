# Registro privado de Diplomado UTP IA

Servicio relacional Cloudflare D1 (SQLite) alojado por Sites, separado del aula de GitHub Pages. El código y las migraciones se versionan en GitHub; los registros, notas y exportaciones personales no se guardan en el repositorio.

## Acceso y alcance

El Site permite el ingreso de estudiantes autenticados con ChatGPT. La identidad estable de Sites se vincula mediante students.auth_subject. Cada estudiante solo consulta y escribe su propia fila y avance por /api/me; los identificadores que envíe el navegador nunca definen el propietario. Las rutas de administración exigen además el correo verificado ADMIN_EMAIL configurado como secreto en Sites. No hay contraseñas ni claves en GitHub ni en el navegador. Todas las escrituras exigen el mismo origen.

Los estudiantes se registran con nombre completo obligatorio y correo opcional de cualquier proveedor desde su perfil. El acceso requiere iniciar sesión con ChatGPT. Conectar mi registro abre /aula/, una vista autenticada del taller servida desde el mismo origen que /api/me. Los materiales y código públicos se consultan desde GitHub Pages; los datos personales solo viajan a la API de la base. Allí se guardan el avance y las notas automáticamente. Si se pierde la conexión, los cambios permanecen en el navegador y pueden reintentarse desde Mi progreso o al recuperar la conexión. Las notas privadas del docente se conservan separadas de las notas del estudiante, incluso al importar o reiniciar su avance. El docente puede consultar el grupo, importar avances, exportar y vaciar registros. Cada encuentro abre automáticamente a las 00:00 de su fecha en Colombia y permanece disponible; el rol docente verificado tiene acceso completo.

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

`node build.mjs` genera `dist/server/index.js` con el catálogo incrustado. Sites aplica las migraciones de `drizzle/` al D1 del proyecto antes de publicar. Usar el flujo de publicación de Sites conservando la audiencia actual y `.openai/hosting.json`. La copia del código en GitHub no despliega automáticamente este servicio: publicar los cambios de backend también en Sites.

Pruebas: `node --test tests/*.test.mjs` y `python tests/relations.py`. La integración usa SQLite real en memoria con ambas migraciones y cuentas ficticias; no escribe registros de producción. Si Python no está en PATH, indicar su ejecutable mediante `AULA_TEST_PYTHON`.
