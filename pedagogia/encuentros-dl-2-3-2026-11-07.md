# Apoyo del encuentro 2 y continuidad del encuentro 3

Se incorpora a la web existente el apoyo adicional del Encuentro 2: recurso autocontenido en `recursos/dl-encuentro-2/`, botón visible en el encuentro y enlaces desde los apoyos de sus tres temas. «Volver al Encuentro 2» regresa al mismo origen y enfoca `#curso/dl/2`. Conserva el control de acceso por nombre o sesión ya utilizado por el laboratorio. No escribe registros.

El Encuentro 3 pasa a usar un diario compartido de cuatro entregas ficticias, con variantes creciente, inversa y con altibajos. El escenario y sus parámetros sobreviven al pasar entre secuencias, atención y Transformer. Cada tema recupera la limitación anterior y explica la siguiente pregunta.

La actualización recurrente tiene coeficientes dados y no implementa una LSTM ni un pronóstico. La atención calcula participaciones y aportes con representaciones manuales; Q=0 da el control uniforme. El esquema Transformer distingue representación, posición, atención, otras capas y salida; la referencia último<primero queda fuera de la predicción del modelo. Se explica explícitamente qué cambia al pasar a las prácticas de Colab.

Las definiciones, el vocabulario y los ejemplos anteriores quedan disponibles como ampliaciones cerradas con aviso de que sus datos son distintos. Se conserva un único gráfico principal por tema, los destinos de lectura, el cuaderno de cada tema, notas y avance manual. Calendario, roles, API y cuadernos originales no cambian.

## Comprobaciones

- 242 pruebas locales de frontend y backend aprobadas, incluyendo HTTP/SQLite con identidades sintéticas.
- Lectura recurrente completa y resultado30,625; variante inversa16,25; atención uniforme25 y normalización de participaciones.
- Estado compartido entre temas y controles sin reconstrucción al cambiar el ejemplo.
- Navegador: diario invertido conserva su elección al pasar de secuencias a atención; gráfico único; cálculo y lectura coherentes.
- Aula: botón del encuentro2 abre el recurso y el retorno enfoca encuentro-dl-2. Perfil local sintético, sin cuentas reales ni escrituras remotas.
- Revisión del aula en anchos320,390,768,1024 y1440, claro/oscuro, sin desbordamiento global; revisión móvil del nuevo relato y desplazamiento local del gráfico.

Publicación mediante el flujo habitual de GitHub Pages; el aula de Sites sirve estos mismos materiales a través de su proxy. No requiere cambios en el backend.
