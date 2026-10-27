// Apoyo de lectura: vocabulario ya presente en el aula y sus cuadernos.
export const SUPPORT_DEFINITIONS = [
  {
    id: 'ml', term: 'ML', expansion: 'Machine Learning', translation: 'Aprendizaje automático',
    meaning: 'Métodos que ajustan una regla con ejemplos para predecir, agrupar o elegir acciones.',
    reading: 'Es parte de la inteligencia artificial. Aprender una regla y usarla para responder son momentos diferentes.',
    example: 'Aprender con lluvias y cosechas conocidas; después estimar otra cosecha.',
    source: 'https://developers.google.com/machine-learning/glossary/#machine-learning',
    aliases: ['Machine Learning', 'aprendizaje automático']
  },
  {
    id: 'dl', term: 'DL', expansion: 'Deep Learning', translation: 'Aprendizaje profundo',
    meaning: 'Parte del aprendizaje automático que usa redes neuronales con varias capas para transformar información y aprender representaciones.',
    reading: 'Una capa transforma números y entrega otros a la siguiente. Más capas no garantizan mejores resultados.',
    example: 'Una red transforma los números de una imagen hasta calcular una respuesta.',
    source: 'https://cloud.google.com/discover/what-is-deep-learning',
    aliases: ['Deep Learning', 'aprendizaje profundo']
  },
  {
    id: 'ia', term: 'IA', expansion: 'Artificial Intelligence', translation: 'Inteligencia artificial',
    meaning: 'Campo que desarrolla sistemas capaces de resolver tareas como reconocer imágenes o producir predicciones.',
    reading: 'IA es la sigla en español; en inglés se usa AI. ML es una parte de IA y DL es una parte de ML.',
    example: 'Usar YOLO para detectar objetos es una aplicación de IA; no todas usan el mismo método.',
    source: 'https://developers.google.com/machine-learning/glossary/#artificial-intelligence',
    aliases: ['AI', 'Artificial Intelligence', 'inteligencia artificial']
  },
  {
    id: 'cpu', term: 'CPU', expansion: 'Central Processing Unit', translation: 'Unidad central de procesamiento',
    meaning: 'Procesador que ejecuta las instrucciones generales de un programa.',
    reading: 'En los cuadernos, cpu identifica el dispositivo que realiza los cálculos. No es una categoría aprendida ni una medida de calidad.',
    example: 'device="cpu" pide ejecutar la detección con el procesador.',
    source: 'https://www.intel.com/content/www/us/en/products/docs/processors/cpu-vs-gpu.html',
    aliases: ['Central Processing Unit', 'procesador', 'procesamiento en CPU']
  },
  {
    id: 'gpu', term: 'GPU', expansion: 'Graphics Processing Unit', translation: 'Unidad de procesamiento gráfico',
    meaning: 'Procesador preparado para realizar muchas operaciones similares en paralelo; puede acelerar cálculos de redes.',
    reading: 'Cambia dónde se ejecutan los cálculos, no qué significa una clase. Las prácticas del aula están planteadas para CPU.',
    example: 'Reconocer la categoría «persona» depende del entrenamiento, no de activar una GPU.',
    source: 'https://www.intel.com/content/www/us/en/products/docs/processors/cpu-vs-gpu.html',
    aliases: ['Graphics Processing Unit', 'acelerador GPU']
  },
  {
    id: 'csv', term: 'CSV', expansion: 'Comma-Separated Values', translation: 'Valores separados por comas',
    meaning: 'Formato de texto que organiza registros con campos separados por comas. Los campos que contienen comas o saltos de línea pueden escribirse entre comillas; por eso un registro no siempre ocupa una sola línea visible.',
    reading: 'Puede incluir encabezados con nombres de columnas. Abrirlo como tabla no comprueba si sus datos o predicciones son correctos.',
    example: 'detecciones.csv guarda una fila por propuesta conservada del detector.',
    source: 'https://www.rfc-editor.org/rfc/rfc4180',
    aliases: ['Comma-Separated Values', 'archivo CSV', 'valores separados por comas']
  },
  {
    id: 'json', term: 'JSON', expansion: 'JavaScript Object Notation', translation: 'Notación de objetos de JavaScript',
    meaning: 'Formato de texto que guarda datos estructurados con nombres, valores y listas.',
    reading: 'Aunque su nombre menciona JavaScript, otros lenguajes también pueden leerlo. Guardar la configuración ayuda a reconstruir una ejecución.',
    example: '{"umbral":0.5,"dispositivo":"cpu"} registra dos opciones; no entrena un modelo.',
    source: 'https://www.rfc-editor.org/rfc/rfc8259',
    aliases: ['JavaScript Object Notation', 'archivo JSON', 'configuración JSON']
  },
  {
    id: 'api', term: 'API', expansion: 'Application Programming Interface', translation: 'Interfaz de programación de aplicaciones',
    meaning: 'Funciones y reglas que permiten que un programa use capacidades de otro componente o programa.',
    reading: 'Una API puede pertenecer a una biblioteca local o a un servicio web; la sigla no implica por sí sola una conexión a internet.',
    example: 'Usar una función de NumPy es distinto de enviar datos a un servicio de predicción externo.',
    source: 'https://developer.mozilla.org/en-US/docs/Glossary/API',
    aliases: ['Application Programming Interface', 'interfaz de programación', 'API de predicción']
  },
  {
    id: 'nan', term: 'NaN', expansion: 'Not a Number', translation: 'No es un número',
    meaning: 'Marca especial de las bibliotecas numéricas para un resultado que no es un número válido; también se usa para señalar datos ausentes.',
    reading: 'En la tabla de lluvia indica ausencia. No equivale a cero ni a infinito; hay que distinguir la ausencia de una medición válida.',
    example: 'Lluvia sin registrar → NaN. Lluvia medida de 0 mm → 0.',
    source: 'https://numpy.org/doc/stable/reference/constants.html#numpy.nan',
    aliases: ['Not a Number', 'dato ausente', 'valor NaN', 'np.nan']
  }
];
