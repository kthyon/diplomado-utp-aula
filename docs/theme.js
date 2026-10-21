// Load before styles so a saved preference is applied without a light flash.
(() => {
  const root=document.documentElement,key='utp-color-theme';
  let theme='light';
  try { const saved=localStorage.getItem(key); if(saved==='dark'||saved==='light')theme=saved; } catch {}
  function apply(value){
    theme=value;root.dataset.theme=value;root.style.colorScheme=value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',value==='dark'?'#191a1d':'#fafbf6');
    const button=document.querySelector('#theme-toggle');
    if(button){const dark=value==='dark';button.setAttribute('aria-pressed',String(dark));button.setAttribute('aria-label',dark?'Cambiar a modo claro':'Cambiar a modo oscuro');button.title=dark?'Cambiar a modo claro':'Cambiar a modo oscuro';button.querySelector('[data-theme-label]').textContent=dark?'Modo claro':'Modo oscuro';}
  }
  apply(theme);
  document.addEventListener('DOMContentLoaded',()=>{
    const button=document.querySelector('#theme-toggle');if(!button)return;
    apply(theme);button.addEventListener('click',()=>{apply(theme==='dark'?'light':'dark');try{localStorage.setItem(key,theme);}catch{}});
  },{once:true});
  window.addEventListener('storage',event=>{if(event.key===key)apply(event.newValue==='dark'?'dark':'light');});
})();
