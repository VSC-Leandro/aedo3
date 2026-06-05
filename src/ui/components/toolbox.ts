import { TOOLBOX_CATS, DEFS, CATS } from '../../data/definitions';
import { TEMPLATES } from '../../data/templates';
import { store } from '../../state/store';
import { ds } from '../../core/dragAndDrop';
import { cloneFields, updateCounts, toast } from '../../core/utils';
import { addAct } from '../layout/rightPanel';
import { renderCardEl } from './card';
import { openInfo } from './modals';
import { switchTab } from '../layout/sidebar';

export function buildToolbox(): void {
  const cont = document.getElementById('catContainer');
  if (!cont) return;
  cont.innerHTML = '';
  
  TOOLBOX_CATS.forEach((cat, ci) => {
    const types = Object.keys(DEFS).filter(t => DEFS[t].cat === cat);
    if (cat === 'Importadas' && types.length === 0) return;
    
    const isOpen = ci < 2;
    
    const catGroup = document.createElement('div');
    
    const header = document.createElement('div');
    header.className = `cat-hd ${isOpen ? 'open' : ''}`;
    header.innerHTML = `<span>${cat}</span><i class="ti ti-chevron-right" aria-hidden="true"></i>`;
    
    const list = document.createElement('div');
    list.className = 'card-list';
    list.style.display = isOpen ? 'flex' : 'none';
    
    header.addEventListener('click', () => {
      const currentlyOpen = header.classList.contains('open');
      header.classList.toggle('open', !currentlyOpen);
      list.style.display = currentlyOpen ? 'none' : 'flex';
    });
    
    types.forEach(t => {
      const d = DEFS[t];
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.draggable = true;
      chip.dataset.type = t;
      chip.title = 'Duplo clique para detalhes';
      
      const dotColor = CATS[cat]?.color || '#1D9E75';
      chip.innerHTML = `
        <span class="chip-dot" style="background:${dotColor}"></span>
        <i class="ti ${d.icon}" style="font-size:12px; color:${dotColor}" aria-hidden="true"></i>
        ${d.label}
      `;
      
      chip.addEventListener('dragstart', (e) => ds(e));
      chip.addEventListener('dblclick', () => openInfo(t));
      
      list.appendChild(chip);
    });
    
    catGroup.appendChild(header);
    catGroup.appendChild(list);
    cont.appendChild(catGroup);
  });
}

export function buildPlans(): void {
  const cont = document.getElementById('plansContainer');
  if (!cont) return;
  cont.innerHTML = '';
  
  Object.keys(TEMPLATES).forEach(k => {
    const t = TEMPLATES[k];
    const item = document.createElement('div');
    item.className = 'plan-item';
    
    item.innerHTML = `
      <div class="plan-top">
        <div class="plan-icon" style="background:${t.color}22"><i class="ti ${t.icon}" style="color:${t.color}" aria-hidden="true"></i></div>
        <div class="plan-name">${t.name}</div>
      </div>
      <div class="plan-desc">${t.desc}</div>
      <div class="plan-meta"><i class="ti ti-stack-2" style="font-size:11px" aria-hidden="true"></i>${t.meta}</div>
    `;
    
    const loadBtn = document.createElement('button');
    loadBtn.className = 'plan-load';
    loadBtn.innerHTML = `<i class="ti ti-download" style="font-size:12px" aria-hidden="true"></i>Carregar plano`;
    
    const loadHandler = (e: MouseEvent) => {
      e.stopPropagation();
      loadTemplate(k);
    };
    
    loadBtn.addEventListener('click', loadHandler);
    item.addEventListener('click', () => loadTemplate(k));
    
    item.appendChild(loadBtn);
    cont.appendChild(item);
  });
}

export function loadTemplate(key: string): void {
  const t = TEMPLATES[key];
  if (!t) return;
  
  store.cards = [];
  store.conns = [];
  
  // Clear layout cards and connections
  document.getElementById('ci')?.querySelectorAll('.card').forEach(e => e.remove());
  document.getElementById('connSvg')?.querySelectorAll('path.cl').forEach(p => p.remove());
  
  t.cards.forEach(c => {
    DEFS[c.key] = {
      label: c.label,
      cat: 'FIB16',
      icon: c.icon,
      what: c.what,
      how: c.how,
      fields: cloneFields(c.fields)
    };
    const id = 'k' + Date.now() + Math.random().toString(36).slice(2, 6);
    store.cards.push({
      id,
      type: c.key,
      x: c.x,
      y: c.y,
      fields: cloneFields(c.fields)
    });
  });
  
  store.cards.forEach(c => renderCardEl(c.id));
  
  const hint = document.getElementById('hint');
  if (hint) hint.style.opacity = '0';
  
  const projName = document.getElementById('projName');
  if (projName) projName.textContent = t.project.title;
  
  const rpTitle = document.getElementById('rpTitle');
  if (rpTitle) rpTitle.textContent = t.project.title;
  
  const rpDesc = document.getElementById('rpDesc');
  if (rpDesc) rpDesc.textContent = t.project.desc;
  
  addAct(`Plano <strong>${t.name}</strong> carregado`, '#2F4E9E');
  updateCounts(store.cards.length, store.conns.length);
  switchTab('tools');
  toast(`Plano "${t.name}" carregado — preencha as cartas!`);
}
