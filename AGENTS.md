# Aula UTP: instrucciones de mantenimiento

- La web de este proyecto se publica en GitHub Pages: kthyon/diplomado-utp-aula.
- Mantener dos asignaturas y generalidades, clases con apertura automática por fecha en Colombia y progreso individual.
- Generalidades se muestra como ventana con Generalidades 2 de Google Slides, una sola vez por navegador al entrar a una asignatura. No duplicar su contenido en una página de texto; conservar el enlace vivo para que los cambios de la PPT aparezcan al abrir o actualizar el visor.
- Cada cambio de contenido acordado en el hilo debe reflejarse aquí y publicarse con un commit. Sincronizar snapshots de notebooks cuando cambien en Drive. Actualizar también la presentación si sus fragmentos dejan de coincidir.
- Cada encuentro abre a las 00:00 America/Bogota de su fecha en content.js:COURSES y permanece disponible. No condicionar el acceso a completar temas anteriores. Nombre completo obligatorio antes de entrar; correo opcional de cualquier dominio.
- Nunca incrustar tokens, contraseñas o una falsa contraseña de docente. La vista docente accede a todos los materiales mediante el rol verificado por /api/session; no usar nombres, hashes ni localStorage para conceder ese rol.
- Todos los cuadernos deben abrir desde GitHub en Colab y guiar a guardar una copia personal. Retirar outputs antes de versionarlos.
- Explicar contexto, datos simulados, unidades, gráficos, resultados y límites. No inventar datos agrícolas reales, evaluaciones ni aplicaciones desplegadas.
- Comprobaciones opcionales sin entregas, rúbricas o calificaciones.
- Probar cálculos y acceso, revisar escritorio/móvil, crear commit y verificar despliegue.
- Los sources del proyecto ChatGPT superior son referencias de solo lectura.

- Prioridad de producto: herramienta gráfica de apoyo a las clases de Cristian. La portada incluye herramientas y catálogos de n8n, Hugging Face y proveedores de IA sin modelos concretos ni versiones. Evitar duplicar el taller y sus llamadas a la acción en inicio. Conservar el taller como sección propia, escenarios comparables, lectura de colores/objetos y vista de proyección. Los dibujos deben cambiar con cálculos explicados; no presentar una metáfora como un modelo real.

- Base relacional: backend/ se aloja en Sites con autorregistro autenticado por ChatGPT, nombre completo obligatorio y correo opcional de cualquier proveedor. Administración restringida al ADMIN_EMAIL verificado del docente; cada estudiante solo usa /api/me por auth_subject. Nunca exponer registros del grupo ni notas del docente a estudiantes. Las exportaciones personales nunca se suben a GitHub. docs/database-config.js se retira con enabled:false. El guardado ocurre en la vista autenticada /aula/ del servicio, con su API en el mismo origen; conservar localmente los cambios pendientes.

- Cristian solicita Three.js como motor para animaciones de escenas cuando sean necesarias. Mantener controles, cifras y explicaciones coherentes; ofrecer esquema estático si WebGL no está disponible. No mostrar el texto sobre protección con cuenta de ChatGPT en el formulario. Conservar la autenticación y autorización reales.
