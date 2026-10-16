export const normalizeSearch=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es').replace(/[^a-z0-9]+/g,' ').trim();
export function searchCatalog(term,lessons,glossary,courses){
 const aliases={ml:'machine learning',dl:'deep learning',ia:'inteligencia artificial'};
 const query=normalizeSearch(term).split(/\s+/).map(t=>aliases[t]||t).join(' '),tokens=query.split(/\s+/).filter(Boolean);
 const matches=text=>{const normalized=normalizeSearch(text);return tokens.length>0&&tokens.every(t=>normalized.includes(t));};
 return {lessons:lessons.filter(l=>matches([l.title,l.summary,l.concept,l.example,...(l.steps||[]),courses[l.id.split('-')[0]]?.title||''].join(' '))),glossary:glossary.filter(entry=>matches(entry.join(' ')))};
}
