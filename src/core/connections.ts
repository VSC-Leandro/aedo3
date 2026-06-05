import { store } from '../state/store';
import { CATS, DEFS } from '../data/definitions';
import { updateCounts } from './utils';
import { addAct } from '../ui/layout/rightPanel';

export function cancelConn(): void {
  store.connMode = false;
  store.connFrom = null;
  const connBar = document.getElementById('connBar');
  if (connBar) connBar.classList.remove('show');
  document.querySelectorAll('.card').forEach(c => c.classList.remove('conn-src', 'conn-hover'));
}

export function startConn(e: MouseEvent, id: string): void {
  e.stopPropagation();
  if (store.connMode && store.connFrom === id) {
    cancelConn();
    return;
  }
  store.connMode = true;
  store.connFrom = id;
  const connBar = document.getElementById('connBar');
  if (connBar) connBar.classList.add('show');
  document.querySelectorAll('.card').forEach(c => c.classList.remove('conn-src', 'sel'));
  const el = document.getElementById(id);
  if (el) el.classList.add('conn-src');
}

export function finishConn(toId: string): void {
  const fromId = store.connFrom;
  if (!fromId) return;
  const exists = store.conns.find(c => (c.f === fromId && c.t === toId) || (c.f === toId && c.t === fromId));
  if (!exists) {
    store.conns.push({ f: fromId, t: toId });
    const cardF = store.cards.find(c => c.id === fromId);
    const cardT = store.cards.find(c => c.id === toId);
    if (cardF && cardT) {
      const defF = DEFS[cardF.type];
      const defT = DEFS[cardT.type];
      const labelF = defF ? defF.label : cardF.type;
      const labelT = defT ? defT.label : cardT.type;
      addAct(`<strong>${labelF}</strong> → <strong>${labelT}</strong> conectadas`, '#534AB7');
    }
    updateCounts(store.cards.length, store.conns.length);
    drawConns();
  }
  cancelConn();
}

export function drawConns(): void {
  const svg = document.getElementById('connSvg');
  if (!svg) return;
  
  svg.querySelectorAll('path.cl').forEach(p => p.remove());
  
  const cr = document.getElementById('ci')?.getBoundingClientRect();
  if (!cr) return;
  
  const sc = store.zoom / 100;
  
  store.conns.forEach(conn => {
    const a = document.getElementById(conn.f);
    const b = document.getElementById(conn.t);
    if (!a || !b) return;
    
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    
    const x1 = (ar.left - cr.left) / sc + ar.width / sc / 2;
    const y1 = (ar.top - cr.top) / sc + ar.height / sc - 4;
    const x2 = (br.left - cr.left) / sc + br.width / sc / 2;
    const y2 = (br.top - cr.top) / sc + 4;
    const my = (y1 + y2) / 2;
    
    const cardF = store.cards.find(c => c.id === conn.f);
    const cardT = store.cards.find(c => c.id === conn.t);
    if (!cardF || !cardT) return;
    
    const defF = DEFS[cardF.type];
    const defT = DEFS[cardT.type];
    if (!defF || !defT) return;
    
    const c1 = CATS[defF.cat]?.color || '#1D9E75';
    const c2 = CATS[defT.cat]?.color || '#1D9E75';
    const col = c1 === c2 ? c1 : '#1D9E75';
    
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`);
    p.setAttribute('class', 'cl');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', col);
    p.setAttribute('stroke-width', '2');
    p.setAttribute('opacity', '.65');
    p.setAttribute('marker-end', `url(#${col === '#534AB7' ? 'arrP' : 'arr'})`);
    svg.appendChild(p);
  });
}
