// Geometría propia sobre una retícula común de 24 unidades.
const paths={
 rain:'<path d="M6 14a4 4 0 1 1 .8-7.9 5 5 0 0 1 9.4 0A4 4 0 1 1 18 14M8 17l-1 3m6-3-1 3m6-3-1 3"/>',
 soil:'<path d="M3 6c3-3 6 3 9 0s6 3 9 0M3 12c3-3 6 3 9 0s6 3 9 0M3 18c3-3 6 3 9 0s6 3 9 0"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 5 5 3-3 4 4"/>',
 alert:'<path d="m12 3 10 18H2L12 3Zm0 6v5m0 3v.2"/>',
 detect:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"/><rect x="7" y="7" width="10" height="10" rx="1"/>',
 
 first:'<path d="M7 4h10v16H7zM10 8h4M10 12h4M10 16h2"/>',
 chart:'<path d="M4 4v16h16M7 15l4-5 4 2 5-7"/><circle cx="11" cy="10" r="1"/>',
 network:'<rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/><rect x="9.5" y="16" width="5" height="5" rx="1"/><path d="M5.5 8v3h13V8M12 11v5"/>',
 layers:'<path d="m3 8 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M7 14h3m4 0h3m-10 4h3"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 reset:'<path d="M4 10a8 8 0 1 1 1 7M4 4v6h6"/>'
};
export function icon(name){return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]||paths.first}</svg>`}
