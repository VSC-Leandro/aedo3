import { store } from '../../state/store';
import { DEFS, CATS, TYPE_LABEL, Field } from '../../data/definitions';
import { TOOLBOX_CATS } from '../../data/definitions';
import { cloneFields, dateISOtoBR, fmtDur, minutesBetween, toast, updateCounts } from '../../core/utils';
import { renderCardEl } from './card';
import { buildToolbox } from './toolbox';
import { addAct } from '../layout/rightPanel';
import { drawConns } from '../../core/connections';
import { placeCard } from '../../core/dragAndDrop';

export function openInfo(type: string): void {
  const d = DEFS[type];
  if (!d) return;
  const color = CATS[d.cat]?.color || '#1D9E75';
  
  const ic = document.getElementById('infoIcon');
  if (ic) {
    ic.style.background = color + '22';
    ic.innerHTML = `<i class="ti ${d.icon}" style="color:${color}" aria-hidden="true"></i>`;
  }
  
  const nameEl = document.getElementById('infoName');
  if (nameEl) nameEl.textContent = d.label;
  
  const catEl = document.getElementById('infoCat');
  if (catEl) catEl.textContent = d.cat;
  
  const whatEl = document.getElementById('infoWhat');
  if (whatEl) whatEl.textContent = d.what || 'Carta personalizada.';
  
  const howEl = document.getElementById('infoHow');
  if (howEl) howEl.textContent = d.how || 'Arraste para o canvas e preencha.';
  
  const fieldsEl = document.getElementById('infoFields');
  if (fieldsEl) {
    fieldsEl.innerHTML = d.fields.map(f => `<span class="info-field-tag">${f.k || 'campo'} · ${TYPE_LABEL[f.t] || f.t}</span>`).join('');
  }
  
  const useBtn = document.getElementById('infoUse');
  if (useBtn) {
    // Programmatic click handler removal/re-binding
    const newBtn = useBtn.cloneNode(true) as HTMLElement;
    useBtn.parentNode?.replaceChild(newBtn, useBtn);
    newBtn.addEventListener('click', () => {
      closeInfo();
      const x = 120 + Math.random() * 180;
      const y = 100 + Math.random() * 100;
      placeCard(type, x, y);
      toast(`Carta "${d.label}" adicionada`);
    });
  }
  
  const infoOv = document.getElementById('infoOv');
  if (infoOv) infoOv.style.display = 'flex';
}

export function closeInfo(): void {
  const infoOv = document.getElementById('infoOv');
  if (infoOv) infoOv.style.display = 'none';
}

export function openEdit(id: string): void {
  const card = store.cards.find(c => c.id === id);
  if (!card) return;
  const def = DEFS[card.type];
  if (!def) return;
  
  store.mState = {
    mode: 'edit',
    editId: id,
    cat: def.cat,
    name: def.label,
    icon: def.icon,
    color: CATS[def.cat]?.color || '#534AB7',
    fields: cloneFields(card.fields)
  };
  
  renderModal('Preencha os valores, edite os títulos ou adicione campos.', false);
}

export function openCreate(presetName?: string): void {
  store.mState = {
    mode: 'create',
    editId: null,
    cat: 'Atividades',
    name: presetName || '',
    icon: 'ti-cards',
    color: CATS['Atividades']?.color || '#534AB7',
    fields: [{ k: '', v: '', t: 'text' }]
  };
  
  renderModal('Monte os campos da carta e já preencha se quiser.', true);
}

export function openImport(): void {
  store.mState = {
    mode: 'import',
    editId: null,
    cat: 'Atividades',
    name: '',
    icon: 'ti-cards',
    color: '#534AB7',
    fields: []
  };
  
  const ov = document.getElementById('ov');
  if (ov) ov.style.display = 'flex';
  
  const suggest = document.getElementById('suggest');
  if (suggest) suggest.classList.remove('show');
  
  const mIcon = document.getElementById('mIcon');
  if (mIcon) {
    mIcon.style.background = '#F1EFE8';
    mIcon.innerHTML = `<i class="ti ti-upload" style="color:#5F5E5A" aria-hidden="true"></i>`;
  }
  
  const mName = document.getElementById('mName') as HTMLInputElement;
  if (mName) {
    mName.value = '';
    mName.placeholder = 'Título do arquivo';
  }
  
  const mSub = document.getElementById('mSub');
  if (mSub) mSub.textContent = 'O arquivo vira uma carta reutilizável na planta.';
  
  const mCat = document.getElementById('mCat');
  if (mCat) mCat.style.display = 'none';
  
  const mBody = document.getElementById('mBody');
  if (mBody) {
    mBody.innerHTML = `
      <div class="drop-zone" id="dropZoneBtn">
        <i class="ti ti-cloud-upload" aria-hidden="true"></i>
        <p>Clique para escolher um arquivo</p>
        <small>PDF, XLSX, CSV, DOCX</small>
      </div>
      <div class="imp-field">
        <span class="imp-label">Descrição do arquivo</span>
        <textarea class="imp-area" id="impDesc" rows="3" placeholder="O que este arquivo representa?"></textarea>
      </div>
    `;
    
    const dz = document.getElementById('dropZoneBtn');
    if (dz) {
      dz.addEventListener('click', () => {
        toast('Selecionador de arquivo em breve!');
      });
    }
  }
  
  const mConfirm = document.getElementById('mConfirm');
  if (mConfirm) mConfirm.textContent = 'Importar carta';
}

export function renderModal(sub: string, isCreate: boolean): void {
  const ov = document.getElementById('ov');
  if (ov) ov.style.display = 'flex';
  
  const suggest = document.getElementById('suggest');
  if (suggest) suggest.classList.remove('show');
  
  const mIcon = document.getElementById('mIcon');
  if (mIcon) {
    mIcon.style.background = store.mState.color + '22';
    mIcon.innerHTML = `<i class="ti ${store.mState.icon}" style="color:${store.mState.color}" aria-hidden="true"></i>`;
  }
  
  const mName = document.getElementById('mName') as HTMLInputElement;
  if (mName) {
    mName.value = store.mState.name;
    mName.placeholder = 'Nome da carta';
  }
  
  const mSub = document.getElementById('mSub');
  if (mSub) mSub.textContent = sub;
  
  const catSel = document.getElementById('mCat') as HTMLSelectElement;
  if (isCreate && catSel) {
    catSel.style.display = 'inline-block';
    catSel.innerHTML = TOOLBOX_CATS.filter(c => c !== 'Importadas')
      .map(c => `<option value="${c}" ${c === store.mState.cat ? 'selected' : ''}>${c}</option>`)
      .join('');
    
    catSel.onchange = () => {
      store.mState.cat = catSel.value;
      store.mState.color = CATS[catSel.value]?.color || '#1D9E75';
      if (mIcon) {
        mIcon.style.background = store.mState.color + '22';
        const iEl = mIcon.querySelector('i');
        if (iEl) iEl.style.color = store.mState.color;
      }
    };
  } else if (catSel) {
    catSel.style.display = 'none';
  }
  
  const mConfirm = document.getElementById('mConfirm');
  if (mConfirm) {
    mConfirm.textContent = isCreate ? 'Criar e adicionar' : 'Salvar carta';
  }
  renderFields();
}

export function renderFields(): void {
  const body = document.getElementById('mBody');
  if (!body) return;
  body.innerHTML = '';
  
  store.mState.fields.forEach((f, i) => {
    const block = document.createElement('div');
    block.className = 'field-block';
    
    const top = document.createElement('div');
    top.className = 'fb-top';
    
    const dragIcon = document.createElement('i');
    dragIcon.className = 'ti ti-grip-vertical fb-drag';
    dragIcon.setAttribute('aria-hidden', 'true');
    
    const titleInput = document.createElement('input');
    titleInput.className = 'fb-title';
    titleInput.value = f.k || '';
    titleInput.placeholder = 'Título do campo';
    titleInput.addEventListener('input', () => {
      f.k = titleInput.value;
    });
    
    const typeWrap = document.createElement('div');
    typeWrap.className = 'fb-type-wrap';
    
    const typeSelect = document.createElement('select');
    typeSelect.className = 'fb-type';
    Object.keys(TYPE_LABEL).forEach(tk => {
      const opt = document.createElement('option');
      opt.value = tk;
      opt.textContent = TYPE_LABEL[tk];
      opt.selected = f.t === tk;
      typeSelect.appendChild(opt);
    });
    
    typeSelect.addEventListener('change', () => {
      f.t = typeSelect.value;
      if ((f.t === 'select' || f.t === 'multi') && !f.opts) {
        f.opts = [''];
      }
      if (f.t === 'multi') {
        f.v = [];
      } else if (Array.isArray(f.v)) {
        f.v = '';
      }
      if (f.t === 'timerange') f.v = '';
      if (f.t === 'number' && isNaN(parseFloat(f.v))) f.v = '';
      renderFields();
    });
    
    const delBtn = document.createElement('button');
    delBtn.className = 'fb-del';
    delBtn.title = 'Remover campo';
    delBtn.innerHTML = `<i class="ti ti-trash" aria-hidden="true"></i>`;
    delBtn.addEventListener('click', () => {
      store.mState.fields.splice(i, 1);
      renderFields();
    });
    
    typeWrap.appendChild(typeSelect);
    typeWrap.appendChild(delBtn);
    
    top.appendChild(dragIcon);
    top.appendChild(titleInput);
    top.appendChild(typeWrap);
    block.appendChild(top);
    
    // Rent input controls
    const inputWidget = createValInputWidget(f, i);
    block.appendChild(inputWidget);
    
    body.appendChild(block);
  });
  
  // Footer Add Field layout
  const addBar = document.createElement('div');
  addBar.className = 'add-field-bar';
  
  const addBtn = document.createElement('button');
  addBtn.className = 'add-field-btn';
  addBtn.innerHTML = `<i class="ti ti-plus" aria-hidden="true"></i>Adicionar campo`;
  addBtn.addEventListener('click', () => {
    store.mState.fields.push({ k: '', v: '', t: 'text' });
    renderFields();
  });
  
  addBar.appendChild(addBtn);
  body.appendChild(addBar);
}

function createValInputWidget(f: Field, i: number): HTMLElement {
  const container = document.createElement('div');
  
  if (f.t === 'longtext') {
    const area = document.createElement('textarea');
    area.className = 'fb-value-area';
    area.rows = 2;
    area.placeholder = 'Escreva aqui...';
    area.value = f.v || '';
    area.addEventListener('input', () => {
      f.v = area.value;
    });
    container.appendChild(area);
    return container;
  }
  
  if (f.t === 'number') {
    const input = document.createElement('input');
    input.className = 'fb-value';
    input.type = 'number';
    input.value = f.v || '';
    const isMin = (f.k || '').toLowerCase().includes('minuto');
    input.placeholder = isMin ? 'minutos' : '0';
    input.addEventListener('input', () => {
      f.v = input.value;
    });
    container.appendChild(input);
    return container;
  }
  
  if (f.t === 'date') {
    const input = document.createElement('input');
    input.className = 'fb-value';
    input.type = 'text';
    input.placeholder = 'dd/mm/aaaa';
    input.maxLength = 10;
    input.value = f.v ? dateISOtoBR(f.v) : '';
    
    input.addEventListener('input', () => {
      let raw = input.value.replace(/\D/g, '').slice(0, 8);
      let out = raw;
      if (raw.length > 4) {
        out = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4);
      } else if (raw.length > 2) {
        out = raw.slice(0, 2) + '/' + raw.slice(2);
      }
      input.value = out;
      
      if (out.length === 10) {
        const parts = out.split('/');
        f.v = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        f.v = out || '';
      }
    });
    container.appendChild(input);
    return container;
  }
  
  if (f.t === 'timerange') {
    const wrap = document.createElement('div');
    wrap.className = 'range-wrap';
    
    const [a, b] = (f.v && f.v.includes('-')) ? f.v.split('-') : ['', ''];
    
    const inpA = document.createElement('input');
    inpA.className = 'fb-value';
    inpA.type = 'text';
    inpA.placeholder = 'hh:mm';
    inpA.maxLength = 5;
    inpA.value = a.trim();
    
    const sep = document.createElement('span');
    sep.className = 'range-sep';
    sep.textContent = 'até';
    
    const inpB = document.createElement('input');
    inpB.className = 'fb-value';
    inpB.type = 'text';
    inpB.placeholder = 'hh:mm';
    inpB.maxLength = 5;
    inpB.value = b.trim();
    
    const durIndicator = document.createElement('div');
    durIndicator.className = 'range-dur';
    durIndicator.style.display = 'none';
    
    function maskTime(raw: string): string {
      let d = raw.replace(/\D/g, '').slice(0, 4);
      if (d.length > 2) return d.slice(0, 2) + ':' + d.slice(2);
      return d;
    }
    
    function updateRangeState() {
      f.v = `${inpA.value.trim()}-${inpB.value.trim()}`;
      const m = minutesBetween(f.v);
      if (m !== null) {
        durIndicator.style.display = 'flex';
        durIndicator.innerHTML = `<i class="ti ti-hourglass-low" style="font-size:11px" aria-hidden="true"></i> ${fmtDur(m)} de duração`;
      } else {
        durIndicator.style.display = 'none';
      }
    }
    
    inpA.addEventListener('input', () => {
      inpA.value = maskTime(inpA.value);
      updateRangeState();
    });
    inpB.addEventListener('input', () => {
      inpB.value = maskTime(inpB.value);
      updateRangeState();
    });
    
    wrap.appendChild(inpA);
    wrap.appendChild(sep);
    wrap.appendChild(inpB);
    container.appendChild(wrap);
    container.appendChild(durIndicator);
    
    updateRangeState();
    return container;
  }
  
  if (f.t === 'select' || f.t === 'multi') {
    const multi = f.t === 'multi';
    const optBuilder = document.createElement('div');
    optBuilder.className = 'opt-builder';
    
    if (!f.opts) f.opts = [''];
    if (multi && !Array.isArray(f.v)) f.v = [];
    
    f.opts.forEach((o, oi) => {
      const row = document.createElement('div');
      row.className = 'opt-row';
      
      let sel = false;
      if (multi) sel = Array.isArray(f.v) && f.v.includes(o) && o !== '';
      else sel = f.v === o && o !== '';
      
      const ctrl = document.createElement('div');
      if (multi) {
        ctrl.className = `opt-check ${sel ? 'on' : ''}`;
        ctrl.innerHTML = sel ? '<i class="ti ti-check" aria-hidden="true"></i>' : '';
        ctrl.addEventListener('click', () => {
          if (!Array.isArray(f.v)) f.v = [];
          if (!o) return;
          const idx = f.v.indexOf(o);
          if (idx >= 0) f.v.splice(idx, 1);
          else f.v.push(o);
          renderFields();
        });
      } else {
        ctrl.className = `opt-radio ${sel ? 'on' : ''}`;
        ctrl.addEventListener('click', () => {
          f.v = (f.v === o) ? '' : o;
          renderFields();
        });
      }
      
      const optInput = document.createElement('input');
      optInput.className = 'opt-input';
      optInput.placeholder = `Opção ${oi + 1}`;
      optInput.value = o || '';
      optInput.addEventListener('input', () => {
        const oldVal = f.opts![oi];
        f.opts![oi] = optInput.value;
        if (!multi && f.v === oldVal) f.v = optInput.value;
        if (multi && Array.isArray(f.v)) {
          const idx = f.v.indexOf(oldVal);
          if (idx >= 0) f.v[idx] = optInput.value;
        }
      });
      
      const optDel = document.createElement('button');
      optDel.className = 'opt-del';
      optDel.innerHTML = `<i class="ti ti-x" aria-hidden="true"></i>`;
      optDel.addEventListener('click', () => {
        const val = f.opts![oi];
        if (multi && Array.isArray(f.v)) {
          f.v = f.v.filter(x => x !== val);
        } else if (f.v === val) {
          f.v = '';
        }
        f.opts!.splice(oi, 1);
        if (!f.opts!.length) f.opts = [''];
        renderFields();
      });
      
      row.appendChild(ctrl);
      row.appendChild(optInput);
      row.appendChild(optDel);
      optBuilder.appendChild(row);
    });
    
    const optAdd = document.createElement('span');
    optAdd.className = 'opt-add';
    optAdd.innerHTML = `<i class="ti ti-plus" style="font-size:12px" aria-hidden="true"></i>Adicionar opção`;
    optAdd.addEventListener('click', () => {
      f.opts!.push('');
      renderFields();
    });
    
    optBuilder.appendChild(optAdd);
    container.appendChild(optBuilder);
    return container;
  }
  
  const defaultInput = document.createElement('input');
  defaultInput.className = 'fb-value';
  defaultInput.value = f.v || '';
  defaultInput.placeholder = 'Resposta...';
  defaultInput.addEventListener('input', () => {
    f.v = defaultInput.value;
  });
  container.appendChild(defaultInput);
  return container;
}

export function confirmModal(): void {
  if (store.mState.mode === 'import') {
    const mName = document.getElementById('mName') as HTMLInputElement;
    const title = (mName ? mName.value : '').trim() || 'Arquivo importado';
    
    const impDesc = document.getElementById('impDesc') as HTMLTextAreaElement;
    const desc = impDesc ? impDesc.value.trim() : '';
    
    const nt = 'imp_' + Date.now();
    DEFS[nt] = {
      label: title,
      cat: 'Importadas',
      icon: 'ti-file',
      what: desc || 'Arquivo importado.',
      how: 'Use como insumo de referência.',
      fields: [
        { k: 'Arquivo', v: title, t: 'text' },
        { k: 'Descrição', v: desc, t: 'longtext' }
      ]
    };
    buildToolbox();
    addAct(`Arquivo <strong>${title}</strong> importado`, '#BA7517');
    toast(`Carta "${title}" no menu!`);
    closeModal();
    return;
  }
  
  const mName = document.getElementById('mName') as HTMLInputElement;
  const name = (mName ? mName.value : '').trim();
  if (!name) {
    toast('Dê um nome à carta!');
    return;
  }
  
  const fields = store.mState.fields.filter(f => (f.k || '').trim()).map(f => {
    const nf: Field = {
      k: f.k.trim(),
      v: Array.isArray(f.v) ? [...f.v] : (f.v || ''),
      t: f.t || 'text'
    };
    if (f.t === 'select' || f.t === 'multi') {
      nf.opts = (f.opts || []).filter(o => o.trim());
    }
    return nf;
  });
  
  if (!fields.length) {
    toast('Adicione ao menos um campo!');
    return;
  }
  
  if (store.mState.mode === 'edit' && store.mState.editId) {
    const card = store.cards.find(c => c.id === store.mState.editId);
    if (card) {
      DEFS[card.type].label = name;
      card.fields = fields;
      if (DEFS[card.type].cat !== 'FIB16') {
        buildToolbox();
      }
      renderCardEl(store.mState.editId);
      addAct(`Carta <strong>${name}</strong> atualizada`, '#1D9E75');
      drawConns();
    }
  } else if (store.mState.mode === 'create') {
    const nt = 'custom_' + Date.now();
    DEFS[nt] = {
      label: name,
      cat: store.mState.cat,
      icon: 'ti-cards',
      what: 'Carta personalizada.',
      how: 'Preencha os campos definidos.',
      fields: cloneFields(fields)
    };
    buildToolbox();
    
    const id = 'k' + Date.now() + Math.random().toString(36).slice(2, 5);
    store.cards.push({
      id,
      type: nt,
      x: 100 + Math.random() * 180,
      y: 90 + Math.random() * 100,
      fields: cloneFields(fields)
    });
    
    renderCardEl(id);
    const hint = document.getElementById('hint');
    if (hint) hint.style.opacity = '0';
    addAct(`Carta <strong>${name}</strong> criada`, '#1D9E75');
    updateCounts(store.cards.length, store.conns.length);
    toast(`Carta "${name}" criada!`);
  }
  
  const mNameInput = document.getElementById('mName') as HTMLInputElement;
  if (mNameInput) mNameInput.value = '';
  closeModal();
}

export function closeModal(): void {
  const ov = document.getElementById('ov');
  if (ov) ov.style.display = 'none';
}
