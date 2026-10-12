# Aula UTP: instrucciones de mantenimiento

- La web de este proyecto se publica en GitHub Pages: kthyon/diplomado-utp-aula.
- Mantener dos asignaturas y generalidades, clases con desbloqueo manual y progreso individual.
- Generalidades se muestra como ventana con Generalidades 2 de Google Slides, una sola vez por navegador al entrar a una asignatura. No duplicar su contenido en una página de texto; conservar el enlace vivo para que los cambios de la PPT aparezcan al abrir o actualizar el visor.
- Cada cambio de contenido acordado en el hilo debe reflejarse aquí y publicarse con un commit. Sincronizar snapshots de notebooks cuando cambien en Drive. Actualizar también la presentación si sus fragmentos dejan de coincidir.
- Conservar docs/releases.json salvo solicitud de habilitar/cerrar temas. No abrir temas automáticamente por fechas.
- Nunca incrustar tokens, contraseñas o una falsa contraseña de docente. El desbloqueo global se publica por GitHub Actions con permisos de la cuenta.
- Todos los cuadernos deben abrir desde GitHub en Colab y guiar a guardar una copia personal. Retirar outputs antes de versionarlos.
- Explicar contexto, datos simulados, unidades, gráficos, resultados y límites. No inventar datos agrícolas reales, evaluaciones ni aplicaciones desplegadas.
- Comprobaciones opcionales sin entregas, rúbricas o calificaciones.
- Probar cálculos y acceso, revisar escritorio/móvil, crear commit y verificar despliegue.
- Los sources del proyecto ChatGPT superior son referencias de solo lectura.

- Prioridad de producto: herramienta gráfica de apoyo a las clases de Cristian. Mantener el taller isométrico como acceso principal, escenarios comparables, lectura de colores/objetos y vista de proyección. Los dibujos deben cambiar con cálculos explicados; no presentar una metáfora como un modelo real.

- Base relacional: backend/ se aloja como Site privado solo propietario. No ampliar su audiencia: el panel permite al docente ver y editar todos los registros. Los datos y exportaciones personales nunca se suben a GitHub. La integración docs/database-config.js se retira con enabled:false. GitHub Pages no aloja la base. El registro/importación es docente, sin sincronización automática desde los navegadores de los alumnos.
