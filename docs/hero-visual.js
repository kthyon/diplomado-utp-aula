// Original vector diagram; a conceptual illustration, not model results.
export function heroVisual() {
  const input = (y, label, detail, icon) => `<g><rect x="12" y="${y}" width="130" height="54" rx="12" fill="#ffffff0b" stroke="#ffffff20"/><g transform="translate(25 ${y+17})" fill="none" stroke="#cfe9a4" stroke-width="1.7" stroke-linecap="round">${icon}</g><text x="56" y="${y+23}" fill="#f0f6ed" font-size="14" font-weight="600">${label}</text><text x="56" y="${y+40}" fill="#9fb8ad" font-size="10">${detail}</text></g>`;
  const output = (y, label, detail, color) => `<g><rect x="382" y="${y}" width="126" height="54" rx="12" fill="#ffffff0b" stroke="#ffffff20"/><circle cx="398" cy="${y+21}" r="3" fill="${color}"/><text x="410" y="${y+25}" fill="#f0f6ed" font-size="12" font-weight="600">${label}</text><text x="396" y="${y+42}" fill="#9fb8ad" font-size="10">${detail}</text></g>`;
  const edges = [[220,108,260,150],[220,150,260,108],[220,150,260,195],[220,195,260,150],[260,108,300,150],[260,150,300,108],[260,150,300,195],[260,195,300,150],[220,108,260,108],[260,195,300,195]];
  return `<figure class="hero-art ai-diagram" aria-label="Esquema conceptual: datos agrícolas, aprendizaje de patrones y salidas de inteligencia artificial">
    <div class="ai-diagram-header"><span><i aria-hidden="true"></i> INTELIGENCIA EN CONTEXTO</span><span class="ai-diagram-tag">ML + DL</span></div>
    <svg viewBox="0 0 520 300" role="img" aria-labelledby="ai-diagram-title ai-diagram-desc">
      <title id="ai-diagram-title">De los datos a una decisión</title><desc id="ai-diagram-desc">Lluvia, suelo e imágenes entran en modelos de Machine Learning y Deep Learning. Según la tarea, sus salidas pueden ser predicciones, alertas o detecciones que requieren interpretación.</desc>
      <defs><radialGradient id="ai-core-glow"><stop stop-color="#90bd742b"/><stop offset="1" stop-color="#90bd7400"/></radialGradient></defs>
      <g font-family="DM Sans,Arial,sans-serif"><g fill="#9fb8ad" font-size="10" letter-spacing="1.7"><text x="77" y="27" text-anchor="middle">DATOS</text><text x="260" y="27" text-anchor="middle">PATRONES</text><text x="445" y="27" text-anchor="middle">SALIDAS</text></g>
      <circle cx="260" cy="151" r="110" fill="url(#ai-core-glow)"/><circle cx="260" cy="151" r="78" fill="#ffffff04" stroke="#cfe9a425"/><circle cx="260" cy="151" r="88" fill="none" stroke="#ffffff0c" stroke-dasharray="2 8"/>
      <g fill="none" stroke="#83a592" stroke-width="1.4">${[91,169,247].map((y,i)=>`<path d="M142 ${y}C175 ${y} 182 ${108+i*43.5} 210 ${108+i*43.5}"/><path d="M310 ${108+i*43.5}C344 ${108+i*43.5} 347 ${y} 382 ${y}"/>`).join('')}</g>
      <g class="ai-data-flow" fill="none" stroke="#d2eaa0" stroke-width="1.8">${[91,169,247].map((y,i)=>`<path style="animation-delay:${i*-.7}s" d="M142 ${y}C175 ${y} 182 ${108+i*43.5} 210 ${108+i*43.5}"/>`).join('')}</g>
      <g stroke="#cfe9a452" stroke-width="1.3">${edges.map(([x1,y1,x2,y2])=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`).join('')}</g>
      ${[220,260,300].map((x,i)=>[108,150,195].map((y,j)=>`<circle class="ai-neuron" style="animation-delay:${(i+j)*-.45}s" cx="${x}" cy="${y}" r="${i===1&&j===1?10:6}" fill="${i===1?'#d2eaa0':'#82b59c'}" stroke="#153d36" stroke-width="3"/>`).join('')).join('')}
      ${input(64,'Lluvia','Series de tiempo','<path d="M3 2c0 0-6 8-6 11a6 6 0 0012 0c0-3-6-11-6-11Z" transform="translate(7 0)"/>')}
      ${input(142,'Suelo','Medidas del campo','<path d="M0 3h17M0 9h17M0 15h17M5 3l3 6-3 6"/>')}
      ${input(220,'Imágenes','Información visual','<rect width="18" height="16" rx="3"/><circle cx="12" cy="5" r="2"/><path d="M2 13l5-5 5 5 3-3 2 3"/>')}
      ${output(64,'Predicción','Estimar un valor','#d2eaa0')}${output(142,'Alerta','Revisar un caso','#e7ae82')}${output(220,'Detección','Localizar un objeto','#8ab8ce')}
      <rect x="224" y="254" width="72" height="25" rx="12.5" fill="#d2eaa016" stroke="#d2eaa03a"/><text x="260" y="271" text-anchor="middle" fill="#d2eaa0" font-size="11" letter-spacing="1">ML · DL</text></g>
    </svg>
    <figcaption>Datos → modelo → interpretación <span>Esquema conceptual</span></figcaption>
  </figure>`;
}
