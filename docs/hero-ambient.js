// Scroll moves only decorative light, never text or controls.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const main = document.querySelector('#main');
let hero;
let frame = 0;
function updateLight() {
  frame = 0;
  if (reduced.matches || !hero?.isConnected || document.hidden) return;
  const rect = hero.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > innerHeight) return;
  const documentTop = rect.top + scrollY;
  const progress = Math.max(0,Math.min(1,scrollY / Math.max(1,documentTop + rect.height * .8)));
  hero.style.setProperty('--hero-light-x',`${(progress * 105).toFixed(1)}px`);
  hero.style.setProperty('--hero-light-y',`${(progress * 85).toFixed(1)}px`);
  hero.style.setProperty('--hero-glow-x',`${(progress * -90).toFixed(1)}px`);
  hero.style.setProperty('--hero-glow-y',`${(progress * -65).toFixed(1)}px`);
  hero.style.setProperty('--hero-light-opacity',(.78 + progress * .2).toFixed(2));
  hero.style.setProperty('--hero-glow-opacity',(.7 + progress * .2).toFixed(2));
}
function scheduleLight() {
  if (!frame && !reduced.matches && hero?.isConnected) frame=requestAnimationFrame(updateLight);
}
function findHero() {
  hero=main?.querySelector('.visual-home .hero');
  scheduleLight();
}
addEventListener('scroll',scheduleLight,{passive:true});
addEventListener('resize',scheduleLight,{passive:true});
if (main) new MutationObserver(findHero).observe(main,{childList:true});
reduced.addEventListener('change',()=>{
  if(frame)cancelAnimationFrame(frame);
  frame=0;
  if(reduced.matches && hero) {
    for(const property of ['--hero-light-x','--hero-light-y','--hero-glow-x','--hero-glow-y','--hero-light-opacity','--hero-glow-opacity'])hero.style.removeProperty(property);
  } else scheduleLight();
});
findHero();
