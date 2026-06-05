import './styles/main.css';

import { store } from './state/store';
import { buildToolbox, buildPlans } from './ui/components/toolbox';
import { switchTab, onSearch } from './ui/layout/sidebar';
import { openCreate, openImport, closeModal, confirmModal, closeInfo } from './ui/components/modals';
import { onDrop } from './core/dragAndDrop';
import { cancelConn, drawConns } from './core/connections';
import { toggleRP, addAct } from './ui/layout/rightPanel';
import { updateCounts, toast } from './core/utils';

// Core Actions
export function editTitle(): void {
  const el = document.getElementById('projName');
  if (!el) return;
  const cur = el.textContent || 'Nova planta';
  
  const inp = document.createElement('input');
  inp.value = cur;
  inp.style.cssText = 'font-size:13px; font-weight:500; border:none; background:transparent; color:var(--color-text-primary); outline:none; width:300px; border-bottom:1px solid #1D9E75;';
  
  el.replaceWith(inp);
  inp.focus();
  inp.select();
  
  inp.onblur = () => {
    const span = document.createElement('span');
    span.className = 'proj-name';
    span.id = 'projName';
    span.textContent = inp.value || cur;
    span.addEventListener('click', editTitle);
    
    inp.replaceWith(span);
    
    const rpTitle = document.getElementById('rpTitle');
    if (rpTitle) rpTitle.textContent = inp.value || cur;
  };
  
  inp.onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') inp.blur();
  };
}

export function clearAll(): void {
  if (!store.cards.length) {
    toast('O canvas já está vazio.');
    return;
  }
  
  store.cards = [];
  store.conns = [];
  
  document.getElementById('ci')?.querySelectorAll('.card').forEach(e => e.remove());
  document.getElementById('connSvg')?.querySelectorAll('path.cl').forEach(p => p.remove());
  
  const hint = document.getElementById('hint');
  if (hint) hint.style.opacity = '1';
  
  addAct('Canvas limpo', '#E24B4A');
  updateCounts(0, 0);
}

export function doZoom(d: number): void {
  store.zoom = Math.min(150, Math.max(50, store.zoom + d));
  const zmVal = document.getElementById('zmVal');
  if (zmVal) zmVal.textContent = store.zoom + '%';
  
  const ci = document.getElementById('ci');
  if (ci) {
    ci.style.transform = `scale(${store.zoom / 100})`;
    ci.style.transformOrigin = 'top left';
  }
  setTimeout(drawConns, 50);
}

// Binds all dynamic events procedurally on DOM load
function initEvents(): void {
  // Title and header
  document.getElementById('projName')?.addEventListener('click', editTitle);
  document.getElementById('clearAllBtn')?.addEventListener('click', clearAll);
  document.getElementById('historyBtn')?.addEventListener('click', () => toast('Histórico completo em breve!'));
  document.getElementById('publishBtn')?.addEventListener('click', () => toast('Planta publicada!'));
  
  // Sidebar tab control
  document.getElementById('tabTools')?.addEventListener('click', () => switchTab('tools'));
  document.getElementById('tabPlans')?.addEventListener('click', () => switchTab('plans'));
  
  // Sidebar searches
  const searchInput = document.getElementById('sbSearch') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('input', () => onSearch(searchInput.value));
    searchInput.addEventListener('focus', () => onSearch(searchInput.value));
  }
  
  // Sidebar triggers
  document.getElementById('createCardBtn')?.addEventListener('click', () => openCreate());
  document.getElementById('openImportBtn')?.addEventListener('click', () => openImport());
  
  // Drag over target scroll panel
  const canvasArea = document.getElementById('canvasArea');
  if (canvasArea) {
    canvasArea.addEventListener('dragover', (e) => e.preventDefault());
    canvasArea.addEventListener('drop', (e) => onDrop(e));
  }
  
  // Connections cancelling bar
  document.getElementById('cancelConnBtn')?.addEventListener('click', cancelConn);
  
  // Right panel toggle drawer and links
  document.getElementById('rpToggleBtn')?.addEventListener('click', toggleRP);
  document.getElementById('addOrgBtn')?.addEventListener('click', () => toast('Adicionar organização em breve!'));
  
  // Bottom toolbar zoom
  document.getElementById('zoomInBtn')?.addEventListener('click', () => doZoom(10));
  document.getElementById('zoomOutBtn')?.addEventListener('click', () => doZoom(-10));
  
  // Dialog cancelers
  document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
  document.getElementById('closeInfoBtn')?.addEventListener('click', closeInfo);
  
  // Dialog saving click confirm
  document.getElementById('mConfirm')?.addEventListener('click', confirmModal);
  
  // Global canvas listeners dismissing suggest panels or cancellations
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.sb-top')) {
      const suggest = document.getElementById('suggest');
      if (suggest) suggest.classList.remove('show');
    }
  });
  
  // Window keyboard escape hooks
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (store.connMode) cancelConn();
      closeInfo();
    }
  });
}

// Initial triggers
document.addEventListener('DOMContentLoaded', () => {
  buildToolbox();
  buildPlans();
  updateCounts(0, 0);
  initEvents();
});

// Fallback if DOM already loaded (Vite dev environment refresh)
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  buildToolbox();
  buildPlans();
  updateCounts(0, 0);
  initEvents();
}
