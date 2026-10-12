// Independent enhancement: does not alter navigation, lessons or saved progress.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const animations = new Set();
const revealed = new WeakSet();
const easing = 'cubic-bezier(.22,1,.36,1)';
const main = document.querySelector('#main');
const dialog = document.querySelector('#modal');

function animate(element, frames, options) {
  if (reducedMotion.matches || !element?.isConnected || !element.animate) return;
  const animation = element.animate(frames, {duration: 380, easing, ...options});
  animations.add(animation);
  const release = () => animations.delete(animation);
  animation.addEventListener('finish', release, {once: true});
  animation.addEventListener('cancel', release, {once: true});
  return animation;
}

const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  let order = 0;
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    observer.unobserve(entry.target);
    if (revealed.has(entry.target)) continue;
    revealed.add(entry.target);
    const opacity = Number(getComputedStyle(entry.target).opacity);
    animate(entry.target, [
      {opacity: opacity * .25, transform: 'translateY(14px)'},
      {opacity, transform: 'translateY(0)'}
    ], {duration: 460, delay: Math.min(order++ * 45, 180)});
    // Animate the bar itself, preserving the actual stored progress and width.
    entry.target.querySelectorAll('.track>span').forEach(bar => animate(bar,
      [{transform: 'scaleX(0)', transformOrigin: 'left'}, {transform: 'scaleX(1)', transformOrigin: 'left'}],
      {duration: 650, delay: 100}));
  }
}, {threshold: .08}) : null;

function revealPage() {
  observer?.disconnect();
  if (!main || reducedMotion.matches) return;
  const selector = '.welcome,.page-intro,.hero,.stat,.course-card,.panel,.class-block,.simulator,.badge,.empty-state,.glossary details,.iso-studio';
  for (const element of main.querySelectorAll(selector)) {
    // Avoid layering parent and child entrance animations.
    if (element.parentElement.closest(selector)) continue;
    if (observer) observer.observe(element);
  }
}
if (main) {
  new MutationObserver(revealPage).observe(main, {childList: true});
  revealPage();
}

if (dialog) new MutationObserver(() => {
  if (dialog.open) animate(dialog,
    [{opacity: 0, transform: 'translateY(12px) scale(.98)'}, {opacity: 1, transform: 'translateY(0) scale(1)'}],
    {duration: 260});
}).observe(dialog, {attributes: true, attributeFilter: ['open']});

document.addEventListener('click', event => {
  if (reducedMotion.matches || !(event.target instanceof Element)) return;
  const button = event.target.closest('.button,.iso-tabs button,.iso-preset,.quiz button');
  if (!button || button.matches(':disabled') || button.getAttribute('aria-disabled') === 'true') return;
  // One ripple per control, with a centered ripple for keyboard activation.
  button.querySelector('.motion-ripple')?.remove();
  const rect = button.getBoundingClientRect();
  const size = Math.hypot(rect.width, rect.height) * 2;
  const ripple = document.createElement('span');
  ripple.className = 'motion-ripple';
  ripple.setAttribute('aria-hidden', 'true');
  Object.assign(ripple.style, {
    width: `${size}px`, height: `${size}px`,
    left: `${(event.detail ? event.clientX - rect.left : rect.width / 2) - size / 2}px`,
    top: `${(event.detail ? event.clientY - rect.top : rect.height / 2) - size / 2}px`
  });
  button.append(ripple);
  const animation = animate(ripple, [
    {transform: 'scale(0)', opacity: .16},
    {transform: 'scale(1)', opacity: 0}
  ], {duration: 480});
  if (animation) {
    animation.addEventListener('finish', () => ripple.remove(), {once: true});
    animation.addEventListener('cancel', () => ripple.remove(), {once: true});
  } else ripple.remove();
});

// Feedback for simulator changes; one frame at a time and no numerical changes.
let feedbackFrame = 0;
let pendingControl;
document.addEventListener('input', event => {
  if (reducedMotion.matches || !(event.target instanceof Element) || !event.target.matches('input[type=range],select')) return;
  pendingControl = event.target;
  if (feedbackFrame) return;
  feedbackFrame = requestAnimationFrame(() => {
    feedbackFrame = 0;
    const container = pendingControl.closest('.simulator,.iso-studio');
    if (!container) return;
    container.querySelectorAll('.metric,.iso-metric').forEach(metric => {
      const previous = metric.getAnimations().filter(a => animations.has(a));
      previous.forEach(a => a.cancel());
      animate(metric, [{backgroundColor: '#e0eccf'}, {backgroundColor: getComputedStyle(metric).backgroundColor}], {duration: 350});
    });
  });
});

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    observer?.disconnect();
    animations.forEach(animation => animation.cancel());
    if (feedbackFrame) cancelAnimationFrame(feedbackFrame);
    feedbackFrame = 0;
  } else revealPage();
});
