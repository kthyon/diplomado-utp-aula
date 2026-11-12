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

## Segunda pasada (11 de noviembre)

- **Títulos:** los seis temas nombran el concepto antes de la frase original (por ejemplo, «Transformer: atención más información de orden»).
- **Sin repetición:** en Secuencias, Atención, YOLO, Evaluación e Integración el ejercicio de predicción queda plegado como reto opcional; la figura es el ejemplo principal. Transformer conserva su ejercicio abierto porque no repite la figura.
- **Menos preámbulo:** el contexto de industria pasa a un desplegable. La galería de imágenes del encuentro 3 queda abierta.
- **Retos con meta:** cada figura propone uno o dos retos que se marcan solos al cumplirse (por ejemplo, «deja 4 cajas y que las 4 sean correctas»). Sin nota.
- **Apertura y cierre:** pregunta para abrir la clase en el primer tema de cada encuentro; en el tercero, seis tarjetas de repaso, glosario y bibliografía del encuentro.
- **Términos y definiciones:** glosario del encuentro con 22 términos en orden alfabético, disponible en cada tema y completo en el cierre. Se conservan las tarjetas por tema y el vocabulario formal.

### Bibliografía revisada

Criterio: artículo original, libro de texto de acceso abierto y documentación de la biblioteca usada en el cuaderno. Datos de autores, año, medio, páginas y DOI contrastados con registros bibliográficos el 11 de noviembre de 2026.

| Tema | Fuentes |
|---|---|
| RNN y LSTM | Hochreiter y Schmidhuber (1997), Neural Computation 9(8), 1735–1780; Bengio, Simard y Frasconi (1994), IEEE TNN 5(2), 157–166; Goodfellow, Bengio y Courville (2016), cap. 10; Dive into Deep Learning, sec. 10.1; documentación de torch.nn.LSTM |
| Atención | Bahdanau, Cho y Bengio (2015), ICLR; Vaswani et al. (2017), NeurIPS; Dive into Deep Learning, cap. 11 |
| Transformer | Vaswani et al. (2017); Bahdanau et al. (2015); Dive into Deep Learning, sec. 11.6 |
| YOLO | Redmon, Divvala, Girshick y Farhadi (2016), CVPR, 779–788; documentación de predicción de Ultralytics |
| Evaluación | Everingham et al. (2010), IJCV 88(2), 303–338; Padilla, Netto y da Silva (2020), IWSSIP, 237–242; Lin et al. (2014), ECCV, 740–755; documentación de validación de Ultralytics |
| Integración | Elkan (2001), IJCAI, 973–978; guía de scikit-learn sobre el corte de decisión |

Pendiente: el catálogo del backend (títulos en el panel docente) se actualiza al redesplegar el servicio. El encuentro 4 sigue sin fotografía real en la web.

## Tercera pasada (11 de noviembre): definiciones y ruta de la clase

- **Definiciones:** cada tema pasa de 7 u 8 tarjetas a entre 11 y 15, en dos grupos: conceptos del tema y términos de la práctica de Colab (por ejemplo paso de tiempo, estado de celda, tanh, línea base, MAE, época y pérdida en RNN y LSTM; YOLO, propuesta, modelo preentrenado, COCO e inferencia en detección; AP, mAP50 y mAP50-95 en evaluación). El glosario queda en 39 términos para el encuentro 3 y 38 para el 4.
- **Ruta de la clase:** siete pasos por encuentro, iguales a los bloques de la agenda. Aparece completa en el bloque del encuentro, con horas solo para el docente, y como franja compacta al inicio de cada tema con el paso actual.
- **Comprobaciones:** 267 pruebas; dos nuevas fijan que la ruta coincide con la agenda y que cada tema define los términos de sus figuras y de su práctica.

## Cuarta pasada (12 de noviembre): teoría de cierre

Revisión de la teoría de los dos últimos encuentros. Todo se ajusta en tarjetas, lecturas de figura y repasos que ya existían.

| Tema | Hueco | Ajuste |
|---|---|---|
| RNN y LSTM | «Desvanecimiento» describía solo el olvido de la memoria al leer; la fuente citada (Bengio et al., 1994) trata del gradiente al entrenar. No se decía por qué la LSTM lo evita. | La tarjeta distingue los dos efectos; la tarjeta de LSTM y la lectura de la figura 2 señalan que la memoria se actualiza sumando. |
| Transformer | No aparecían los modelos de lenguaje, el decoder ni la máscara causal; tampoco por qué el Transformer desplazó a la RNN. | Tres tarjetas: «Paralelo y coste», «Decoder y máscara causal» y «LLM · modelo de lenguaje grande». La etapa 6 de la figura y el repaso lo enlazan. |
| YOLO | La figura enseña NMS y el cuaderno usa YOLO26, que no lo necesita. Faltaba el puente con el encuentro 2. | La tarjeta de NMS nombra el modelo del cuaderno; tarjeta «Extractor y cabeza de detección». |
| Evaluación | No se explicaba por qué no se usa la exactitud. | Tarjeta «TN · verdadero negativo» y repaso. |
| Integración | Se citaba a Elkan (2001) sin usar su resultado. | Tarjetas «Calibración» y «Corte teórico»; la lectura de la figura calcula 1 ÷ coste del defecto y lo compara con el corte empírico (0,125 cuesta 8; el más barato, 0,35, cuesta 5). |
| Cierre | La agenda anuncia el cierre del diplomado y solo había repaso de DL. | «Qué modelo para qué dato»: ocho filas que recorren las dos asignaturas, dentro del cierre del encuentro 4. |

Comprobaciones: 268 pruebas, una nueva. Revisión en navegador de los seis temas a 1280 y 390 px con perfil local sintético: sin errores de página ni desbordamiento. Cuadernos, calendario, agenda y backend sin cambios.
