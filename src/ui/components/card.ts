import { store } from '../../state/store';
import { DEFS, CATS } from '../../data/definitions';
import { isFilled, fmtVal, minutesBetween, fmtDur, updateCounts } from '../../core/utils';
import { startConn, finishConn, drawConns } from '../../core/connections';
import { startDrag } from '../../core/dragAndDrop';
import { openEdit } from './modals';
import { addAct } from '../layout/rightPanel';

export function renderCardEl(id: string): void {
  const card = store.cards.find(c => c.id === id);
  if (!card) return;
  
  const def = DEFS[card.type];
  if (!def) return;
  const color = CATS[def.cat]?.color || '#1D9E75';
  
  const old = document.getElementById(id);
  if (old) old.remove();
  
  const el = document.createElement('div');
  el.className = 'card';
  el.id = id;
  el.style.left = card.x + 'px';
  el.style.top = card.y + 'px';
  
  const filled = card.fields.filter(isFilled).length;
  const total = card.fields.length;
  const done = filled === total && total > 0;
  
  // Header Component
  const header = document.createElement('div');
  header.className = 'card-hd';
  header.innerHTML = `
    <div class="card-hd-bar" style="background:${color}"></div>
    <i class="ti ${def.icon}" style="font-size:13px; color:${color}" aria-hidden="true"></i>
    <span class="card-hd-label">${def.label}</span>
    <span>${done ? '<i class="ti ti-circle-check" style="color:#1d9e75; font-size:13px;" aria-hidden="true"></i>' : ''}</span>
  `;
  
  // Body Component
  const body = document.createElement('div');
  body.className = 'card-bd';
  
  card.fields.slice(0, 2).forEach(f => {
    const fv = fmtVal(f);
    let durHtml = '';
    
    if (f.t === 'timerange') {
      const m = minutesBetween(f.v);
      if (m !== null) {
        durHtml = `<div class="cf-dur"><i class="ti ti-hourglass-low" style="font-size:9px" aria-hidden="true"></i> ${fmtDur(m)} de duração</div>`;
      }
    }
    
    const fieldSection = document.createElement('div');
    fieldSection.className = 'cf';
    
    const fieldLabel = document.createElement('div');
    fieldLabel.className = 'cf-label';
    fieldLabel.textContent = (f.k || '').toUpperCase();
    
    const valWidget = document.createElement('div');
    valWidget.className = `cf-val ${fv !== null ? '' : 'empty'}`;
    valWidget.textContent = fv !== null ? fv : 'Toque para preencher';
    valWidget.addEventListener('click', () => openEdit(id));
    
    fieldSection.appendChild(fieldLabel);
    fieldSection.appendChild(valWidget);
    
    if (durHtml) {
      const tempWrap = document.createElement('div');
      tempWrap.innerHTML = durHtml;
      if (tempWrap.firstElementChild) {
        fieldSection.appendChild(tempWrap.firstElementChild);
      }
    }
    
    body.appendChild(fieldSection);
  });
  
  if (total > 2) {
    const extraNotifier = document.createElement('div');
    extraNotifier.style.cssText = 'font-size:10px; color:var(--color-text-tertiary); margin-top:3px;';
    extraNotifier.innerHTML = `+${total - 2} campo${total - 2 > 1 ? 's' : ''} • `;
    
    const viewAllSpan = document.createElement('span');
    viewAllSpan.style.cssText = 'color:#1d9e75; cursor:pointer; font-weight: 500;';
    viewAllSpan.textContent = 'ver todos';
    viewAllSpan.addEventListener('click', () => openEdit(id));
    
    extraNotifier.appendChild(viewAllSpan);
    body.appendChild(extraNotifier);
  }
  
  // Footer Component
  const footer = document.createElement('div');
  footer.className = 'card-ft';
  
  const connBtn = document.createElement('div');
  connBtn.className = 'conn-btn';
  connBtn.title = 'Conectar';
  connBtn.innerHTML = `<i class="ti ti-plug" aria-hidden="true"></i>`;
  connBtn.addEventListener('click', (e) => startConn(e, id));
  
  const pctSpan = document.createElement('span');
  pctSpan.className = 'card-ft-pct';
  pctSpan.textContent = `${filled}/${total} campos`;
  
  const editSpan = document.createElement('span');
  editSpan.className = 'card-ft-edit';
  editSpan.textContent = 'Editar';
  editSpan.addEventListener('click', () => openEdit(id));
  
  const delSpan = document.createElement('span');
  delSpan.className = 'card-del';
  delSpan.title = 'Remover';
  delSpan.innerHTML = `<i class="ti ti-x" aria-hidden="true"></i>`;
  delSpan.addEventListener('click', () => removeCard(id));
  
  footer.appendChild(connBtn);
  footer.appendChild(pctSpan);
  footer.appendChild(editSpan);
  footer.appendChild(delSpan);
  
  el.appendChild(header);
  el.appendChild(body);
  el.appendChild(footer);
  
  // Pointer state listeners
  el.addEventListener('mousedown', startDrag);
  el.addEventListener('mouseenter', () => {
    if (store.connMode && store.connFrom !== id) {
      el.classList.add('conn-hover');
    }
  });
  el.addEventListener('mouseleave', () => {
    el.classList.remove('conn-hover');
  });
  
  el.addEventListener('click', () => {
    if (store.connMode && store.connFrom && store.connFrom !== id) {
      finishConn(id);
      return;
    }
    document.querySelectorAll('.card.sel').forEach(c => c.classList.remove('sel'));
    el.classList.add('sel');
  });
  
  const scroller = document.getElementById('ci');
  if (scroller) {
    scroller.appendChild(el);
  }
  drawConns();
}

export function removeCard(id: string): void {
  store.conns = store.conns.filter(c => c.f !== id && c.t !== id);
  const idx = store.cards.findIndex(c => c.id === id);
  if (idx >= 0) {
    const card = store.cards[idx];
    addAct(`Carta <strong>${DEFS[card.type]?.label || card.type}</strong> removida`, '#E24B4A');
    store.cards.splice(idx, 1);
  }
  
  const el = document.getElementById(id);
  if (el) el.remove();
  
  const hint = document.getElementById('hint');
  if (!store.cards.length && hint) {
    hint.style.opacity = '1';
  }
  
  updateCounts(store.cards.length, store.conns.length);
  drawConns();
}
