import { store } from '../state/store';
import { drawConns } from './connections';
import { renderCardEl } from '../ui/components/card';
import { DEFS, CATS } from '../data/definitions';
import { cloneFields, updateCounts } from './utils';
import { addAct } from '../ui/layout/rightPanel';

export function ds(e: DragEvent): void {
  const target = e.currentTarget as HTMLElement;
  store.dragType = target.dataset.type || null;
}

export function onDrop(e: DragEvent): void {
  e.preventDefault();
  if (!store.dragType) return;
  const ci = document.getElementById('ci')?.getBoundingClientRect();
  if (!ci) return;
  
  const sc = store.zoom / 100;
  const x = (e.clientX - ci.left) / sc - 93;
  const y = (e.clientY - ci.top) / sc - 50;
  
  placeCard(store.dragType, x, y);
  store.dragType = null;
}

export function placeCard(type: string, x: number, y: number): void {
  const def = DEFS[type];
  if (!def) return;
  const id = 'k' + Date.now() + Math.random().toString(36).slice(2, 5);
  
  store.cards.push({
    id,
    type,
    x: Math.max(8, x),
    y: Math.max(8, y),
    fields: cloneFields(def.fields)
  });
  
  renderCardEl(id);
  
  const hint = document.getElementById('hint');
  if (hint) hint.style.opacity = '0';
  
  addAct(`Carta <strong>${def.label}</strong> adicionada`, CATS[def.cat]?.color || '#1D9E75');
  updateCounts(store.cards.length, store.conns.length);
}

export function startDrag(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  if (
    target.closest('.conn-btn') || 
    target.closest('.card-ft-edit') || 
    target.closest('.card-del') || 
    target.classList.contains('cf-val')
  ) return;
  
  const currentTarget = e.currentTarget as HTMLElement;
  store.dragId = currentTarget.id;
  
  const r = currentTarget.getBoundingClientRect();
  const sc = store.zoom / 100;
  
  store.dragOX = (e.clientX - r.left) / sc;
  store.dragOY = (e.clientY - r.top) / sc;
  currentTarget.style.zIndex = '20';
  
  document.addEventListener('mousemove', onDm);
  document.addEventListener('mouseup', onDu);
  e.preventDefault();
}

function onDm(e: MouseEvent): void {
  if (!store.dragId) return;
  
  const ci = document.getElementById('ci')?.getBoundingClientRect();
  const el = document.getElementById(store.dragId);
  if (!ci || !el) return;
  
  const sc = store.zoom / 100;
  const x = Math.max(0, (e.clientX - ci.left) / sc - store.dragOX);
  const y = Math.max(0, (e.clientY - ci.top) / sc - store.dragOY);
  
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  
  const c = store.cards.find(c => c.id === store.dragId);
  if (c) {
    c.x = x;
    c.y = y;
  }
  
  drawConns();
}

function onDu(): void {
  if (store.dragId) {
    const el = document.getElementById(store.dragId);
    if (el) el.style.zIndex = '';
  }
  store.dragId = null;
  document.removeEventListener('mousemove', onDm);
  document.removeEventListener('mouseup', onDu);
}
