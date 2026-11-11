# Explicación visual de los encuentros 3 y 4 de Deep Learning

## Motivo

En los seis temas (secuencias, atención, Transformer, YOLO, evaluación, integración) el ejercicio visible era una versión reducida y el concepto central quedaba en un párrafo o en un desplegable cerrado. La web y el cuaderno usaban datos distintos, el preámbulo ocupaba unas 1.300 px antes de la primera interacción y la única acción era elegir una opción y revelar.

## Cambio

Las mejoras se insertan en las secciones que ya existían; no hay bloque ni sección añadida.

- **1. Sigamos el caso de la cooperativa:** dentro del caso se añaden la idea en una frase y una comparación cotidiana. Industria y mapa de tres temas siguen donde estaban.
- **2. Míralo funcionar; después predice y comprueba:** una o dos figuras manipulables, que recalculan con los valores visibles, preceden al ejercicio de predicción existente. El desplegable «Ahora ponle nombre…» pasa a ser vocabulario visible en tarjetas de color, cada una con definición y ejemplo tomado de la figura; la definición formal y el vocabulario completo quedan en un desplegable debajo.
- **4. Compruébalo con código en Colab:** abre con una frase que dice qué hace el cuaderno.
- Se retira el párrafo «¿Qué aprendería una LSTM?», cubierto por la figura de compuertas y las tarjetas.

| Tema | Figuras |
|---|---|
| Secuencias | Memoria que se actualiza al leer 12 entregas y peso de cada día; celda LSTM con tres compuertas |
| Atención | Consulta sobre cuatro registros con claves, valores y temperatura; matriz de autoatención |
| Transformer | Recorrido en seis etapas sobre 6, 2, 5, 3; experimento con y sin señal de posición |
| YOLO | Canastilla con 12 propuestas, corte de confianza, rejilla y supresión de repetidas |
| Evaluación | IoU con caja arrastrable; precisión, recall y curva sobre la misma canastilla |
| Integración | Diez granos sobre el eje de puntuación, corte, coste del defecto y curva de coste total |

## Coincidencia con los cuadernos

- Atención: los días 1 y 2 son los registros A = 10 y B = 20, con Q·K ÷ √2 y softmax; Q = [1, 0] da 66,98 % y 13,30.
- Evaluación: referencia [10, 20, 50, 60]; desplazar 10 px da IoU 0,60 y 30 px da 0,14.
- Integración: mismas puntuaciones y referencias; cortes 0,30, 0,50, 0,70 y 0,90 dan costes 6, 12, 11 y 25.
- Detección conserva puntuación > corte; revisión usa ≥.

## Límites declarados

La canastilla es un dibujo con propuestas dadas; no es la salida de un detector. Las compuertas de la figura se mueven a mano; en una LSTM se calculan. El experimento de posición resume por promedio; el Transformer del cuaderno conserva además el orden en su capa final. Las puntuaciones de defecto son un dato del ejercicio.

## Comprobaciones

- 262 pruebas locales aprobadas, 10 nuevas en `tests/dl-visual-explainers.test.mjs`.
- Navegador sin errores de consola en los seis temas; sin desbordamiento global a 320, 390, 768, 1280 y 1440 px; revisión en claro y oscuro.
- Interacción probada: deslizadores, casillas, preajustes, reproducción de la lectura y arrastre de la caja.
- Cuadernos, calendario, roles, registro y backend sin cambios.
