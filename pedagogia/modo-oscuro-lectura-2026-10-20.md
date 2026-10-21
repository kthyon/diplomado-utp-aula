# Modo oscuro de lectura · 20 de octubre de 2026

## Cambio de diseño
Se sustituye la dominante verde de las superficies por carbón neutro: fondo #191A1D, tarjetas #232529 y superficies elevadas #2D3036. El texto principal es marfil #E5E2DC; el secundario, gris #B7B7BD. El oliva #B8C88C se limita a enlaces, acciones y marcas de selección. La marca conserva su hoja oliva. Los datos mantienen las diferencias verde/observado, naranja/predicho o alerta y azul/otras series según la leyenda de cada ejemplo.

El tema se aplica al aula, los materiales, el buscador, las tablas, el perfil, los ejercicios y el laboratorio. Se elimina el tinte verde de tarjetas y fondos decorativos. La vista 3D ajusta fondo y base al tema y responde al cambio claro/oscuro sin cambiar datos ni cálculos. El tema claro sigue disponible.

## Evidencia y alcance
- While y Sarvghad (IEEE VIS 2024): el efecto de la polaridad sobre el análisis visual varía entre personas y no siempre coincide con la preferencia declarada. Apoya conservar la elección de tema, no imponer un modo universal. https://arxiv.org/html/2409.10841v2
- Fan et al. (Sensors 2024, 24, 3516): en sus condiciones de lectura nocturna, el color del texto y la iluminación ambiental interactuaron con las medidas de fatiga. El estudio no demuestra que una paleta hexadecimal concreta sea óptima para esta aula. https://www.mdpi.com/1424-8220/24/11/3516
- Piepenbrock et al. (Ergonomics 2014): encontró ventaja de polaridad positiva en su tarea de corrección de textos. Se conserva el modo claro para quienes lo prefieran. https://doi.org/10.1080/00140139.2014.948496
- WCAG 2.2 exige al menos 4,5:1 para texto normal y 3:1 para texto grande, con excepciones definidas. Las decisiones de contraste de esta paleta se contrastan con ese umbral. https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

La paleta es una decisión de diseño informada por evidencia, la preferencia de Cristian y comprobaciones de legibilidad; no una garantía clínica de reducción de fatiga. Las pruebas de tokens no constituyen una certificación completa de accesibilidad.

## Contrastes calculados
| Uso | Texto o marca | Fondo | Relación |
|---|---|---|---|
| Texto principal | #e5e2dc | #232529 | 11.87:1 |
| Texto secundario | #b7b7bd | #232529 | 7.69:1 |
| Texto secundario sobre panel elevado | #b7b7bd | #2d3036 | 6.63:1 |
| Enlaces oliva | #b8c88c | #232529 | 8.54:1 |
| Botón principal | #21251c | #b8c88c | 8.68:1 |
| Foco | #bac8e4 | #232529 | 9.11:1 |
| Borde de control | #747d8a | #232529 | 3.69:1 |
| Serie observada | #b2bf8c | #191a1d | 8.89:1 |
| Serie predicha | #dfb493 | #191a1d | 9.19:1 |

## Verificación
Las pruebas tests/theme-contrast.test.mjs comprueban texto, enlaces, botones, foco, controles y series frente a las superficies del tema. También comprueban que el tema se carga después de los estilos de componentes, incluido el laboratorio. La revisión visual comprueba inicio, asignaturas, biblioteca, ejemplos y laboratorio en escritorio y tamaños estrechos. No se publican datos personales ni se modifica el acceso a contenidos.
