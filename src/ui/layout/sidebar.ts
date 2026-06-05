import { DEFS, CATS } from '../../data/definitions';
import { openCreate } from '../components/modals';
import { placeCard } from '../../core/dragAndDrop';
import { toast } from '../../core/utils';

export function switchTab(tab: 'tools' | 'plans'): void {
  const tabTools = document.getElementById('tabTools');
  const tabPlans = document.getElementById('tabPlans');
  const paneTools = document.getElementById('paneTools');
  const panePlans = document.getElementById('panePlans');
  
  if (tabTools && tabPlans && paneTools && panePlans) {
    tabTools.classList.toggle('on', tab === 'tools');
    tabPlans.classList.toggle('on', tab === 'plans');
    paneTools.classList.toggle('hidden', tab !== 'tools');
    panePlans.classList.toggle('hidden', tab !== 'plans');
  }
}

export function onSearch(q: string): void {
  const sug = document.getElementById('suggest');
  if (!sug) return;
  
  q = q.trim().toLowerCase();
  if (!q) {
    sug.classList.remove('show');
    return;
  }
  
  const matches = Object.keys(DEFS).filter(t => DEFS[t].cat !== 'FIB16' && DEFS[t].label.toLowerCase().includes(q));
  sug.innerHTML = '';
  
  if (!matches.length) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'sug-empty';
    emptyDiv.innerHTML = `Nenhuma carta encontrada.<br>`;
    
    const createSpan = document.createElement('span');
    createSpan.style.cssText = 'color:#1D9E75; cursor:pointer; font-weight:500; margin-top: 4px; display: inline-block;';
    createSpan.textContent = `Criar "${q}"`;
    createSpan.addEventListener('click', () => {
      sug.classList.remove('show');
      openCreate(q);
    });
    
    emptyDiv.appendChild(createSpan);
    sug.appendChild(emptyDiv);
    sug.classList.add('show');
    return;
  }
  
  matches.forEach(t => {
    const d = DEFS[t];
    const item = document.createElement('div');
    item.className = 'sug-item';
    
    const color = CATS[d.cat]?.color || '#1D9E75';
    item.innerHTML = `
      <span class="chip-dot" style="background:${color}"></span>
      <i class="ti ${d.icon}" style="font-size:13px; color:${color}" aria-hidden="true"></i>
      ${d.label}
      <span class="sug-cat">${d.cat}</span>
    `;
    
    item.addEventListener('click', () => {
      sug.classList.remove('show');
      const searchInput = document.getElementById('sbSearch') as HTMLInputElement;
      if (searchInput) searchInput.value = '';
      
      const x = 120 + Math.random() * 200;
      const y = 100 + Math.random() * 120;
      placeCard(t, x, y);
      toast(`Carta "${d.label}" adicionada`);
    });
    
    sug.appendChild(item);
  });
  
  sug.classList.add('show');
}
