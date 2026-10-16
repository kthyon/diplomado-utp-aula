// Official platform catalogs, not specific model names or versions.
export const TOOL_GROUPS={ia:'IA y modelos',automation:'Automatización',data:'Datos y búsqueda',code:'Programar y probar',study:'Estudiar',content:'Crear contenido'};
const T=(id,name,group,description,url,guide,keywords='',guideLabel='Guía oficial')=>({id,name,group,description,url,guide,keywords,guideLabel});
export const TOOLS=[
 T('hugging-face','Hugging Face','ia','Explora modelos, conjuntos de datos y aplicaciones de la comunidad.','https://huggingface.co/','https://n8n.io/integrations/hugging-face/','repositorio datasets demos espacios spaces','Ver en n8n'),
 T('n8n','n8n','automation','Conecta aplicaciones, datos e IA mediante flujos de trabajo visuales.','https://n8n.io/','https://n8n.io/integrations/','automatizar agentes nodos procesos conectar','Ver integraciones'),
 T('openai','OpenAI','ia','Explora servicios de IA para trabajar con información y crear asistentes.','https://platform.openai.com/','https://n8n.io/integrations/openai/','texto imágenes chatgpt asistentes resumir','Ver en n8n'),
 T('google-ai','Google AI Studio','ia','Prueba ideas con la IA de Google y prepara su uso en aplicaciones.','https://aistudio.google.com/','https://n8n.io/integrations/google-gemini/','gemini multimodal texto imágenes asistentes','Ver en n8n'),
 T('anthropic','Anthropic','ia','Consulta su plataforma para desarrollar asistentes y soluciones con IA.','https://platform.claude.com/','https://n8n.io/integrations/anthropic/','claude texto documentos resumir asistentes','Ver en n8n'),
 T('colab','Google Colab','code','Ejecuta cuadernos de Python y analiza datos desde el navegador.','https://colab.research.google.com/','https://research.google.com/colaboratory/faq.html','notebooks entrenar experimentar código machine learning'),
 T('notebook','Gemini Notebook','study','Estudia documentos y organiza ideas a partir de tus propias fuentes.','https://notebooklm.google/','https://support.google.com/notebooklm/','notebooklm apuntes resúmenes investigar estudiar fuentes'),
 T('supabase','Supabase','data','Guarda y consulta datos con una plataforma basada en PostgreSQL.','https://supabase.com/','https://supabase.com/docs','base de datos sql postgres vectores aplicaciones'),
 T('canva','Canva','content','Diseña presentaciones, piezas gráficas y materiales para comunicar ideas.','https://www.canva.com/','https://www.canva.com/help/','diseño imágenes diapositivas documentos visuales'),
 T('groq','Groq','ia','Explora su plataforma de inferencia para incorporar IA a aplicaciones.','https://groq.com/','https://console.groq.com/docs/overview','api texto asistentes inferencia'),
 T('make','Make','automation','Organiza tareas y conecta servicios con escenarios de automatización.','https://www.make.com/','https://help.make.com/','automatizar procesos aplicaciones conectar'),
 T('ollama','Ollama','ia','Ejecuta y administra modelos de IA en tu equipo y explora su catálogo.','https://ollama.com/','https://docs.ollama.com/','local equipo ordenador offline inferencia'),
 T('mistral','Mistral AI','ia','Explora su plataforma y herramientas para desarrollar soluciones con IA.','https://mistral.ai/','https://docs.mistral.ai/','api texto documentos asistentes'),
 T('cohere','Cohere','ia','Trabaja con lenguaje y búsqueda semántica para recuperar información.','https://cohere.com/','https://docs.cohere.com/','embeddings rerank búsqueda semántica textos documentos'),
 T('deepseek','DeepSeek','ia','Consulta sus servicios de IA y la documentación para integrar su API.','https://www.deepseek.com/','https://api-docs.deepseek.com/','texto asistentes programación razonamiento api'),
 T('zapier','Zapier','automation','Automatiza tareas entre aplicaciones a partir de eventos y acciones.','https://zapier.com/','https://help.zapier.com/','automatizar procesos conectar formularios correo'),
 T('flowise','Flowise','automation','Construye flujos y agentes de IA mediante un editor visual.','https://flowiseai.com/','https://docs.flowiseai.com/','automatizar agentes asistentes rag flujos'),
 T('qdrant','Qdrant','data','Almacena vectores y encuentra información por semejanza semántica.','https://qdrant.tech/','https://qdrant.tech/documentation/','búsqueda semántica embeddings recuperación rag'),
 T('pinecone','Pinecone','data','Organiza búsquedas vectoriales para recuperar información relevante.','https://www.pinecone.io/','https://docs.pinecone.io/','búsqueda semántica vectores embeddings rag'),
 T('tavily','Tavily','data','Incorpora búsqueda de información web a asistentes y agentes.','https://www.tavily.com/','https://docs.tavily.com/','buscar internet investigación fuentes web'),
 T('firecrawl','Firecrawl','data','Convierte contenido de sitios web en datos que puedes procesar.','https://www.firecrawl.dev/','https://docs.firecrawl.dev/','extraer páginas web scraping documentos datos'),
 T('kaggle','Kaggle','code','Explora conjuntos de datos y cuadernos para practicar ciencia de datos.','https://www.kaggle.com/','https://www.kaggle.com/docs','datasets notebooks aprendizaje ejercicios entrenar'),
 T('github','GitHub','code','Consulta proyectos, guarda versiones y colabora con código y cuadernos.','https://github.com/','https://docs.github.com/','repositorio git notebooks colaboración código'),
 T('replit','Replit','code','Desarrolla y prueba aplicaciones desde un entorno en el navegador.','https://replit.com/','https://docs.replit.com/','programar código prototipos aplicaciones'),
 T('streamlit','Streamlit','code','Convierte scripts de Python en aplicaciones interactivas de datos.','https://streamlit.io/','https://docs.streamlit.io/','dashboard interfaz prototipos gráficas python'),
 T('gradio','Gradio','code','Crea interfaces para probar modelos y compartir demostraciones.','https://www.gradio.app/','https://www.gradio.app/docs','interfaz demos prototipos python modelos'),
 T('perplexity','Perplexity','study','Explora preguntas y consulta fuentes para apoyar una investigación.','https://www.perplexity.ai/','https://www.perplexity.ai/help-center','buscar web investigar referencias estudiar'),
 T('copilot','Microsoft Copilot','study','Explora un asistente para desarrollar ideas y trabajar con información.','https://copilot.microsoft.com/','https://support.microsoft.com/copilot','asistente estudiar redactar investigar'),
 T('teachable','Teachable Machine','study','Experimenta con clasificación de imágenes, sonidos y poses sin programar.','https://teachablemachine.withgoogle.com/','https://teachablemachine.withgoogle.com/faq','entrenar ejemplos aprendizaje machine learning principiantes'),
 T('gamma','Gamma','content','Organiza ideas y crea presentaciones, documentos y páginas visuales.','https://gamma.app/','https://help.gamma.app/','diapositivas presentar comunicar diseño'),
 T('firefly','Adobe Firefly','content','Explora herramientas de IA para generar y transformar contenido visual.','https://firefly.adobe.com/','https://helpx.adobe.com/firefly.html','imágenes video diseño generar editar'),
 T('elevenlabs','ElevenLabs','content','Explora herramientas de voz, audio y narración para tus proyectos.','https://elevenlabs.io/','https://elevenlabs.io/docs/','audio voz narración transcripción sonido')
];
const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function filterTools(query='',group='all'){
 const tokens=normalize(query).split(/\s+/).filter(Boolean);
 return TOOLS.filter(t=>(group==='all'||t.group===group)&&tokens.every(word=>normalize([t.name,t.description,t.keywords,TOOL_GROUPS[t.group]].join(' ')).includes(word)));
}
