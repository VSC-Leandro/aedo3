import { Field } from '../data/definitions';

export function isFilled(f: Field): boolean {
  if (Array.isArray(f.v)) {
    return f.v.length > 0;
  }
  return f.v !== '' && f.v !== null && f.v !== undefined;
}

export function minutesBetween(range: string | null): number | null {
  if (!range || typeof range !== 'string' || !range.includes('-')) return null;
  const [a, b] = range.split('-');
  if (!a || !b) return null;
  
  const trimA = a.trim();
  const trimB = b.trim();
  
  if (!/^\d{2}:\d{2}$/.test(trimA) || !/^\d{2}:\d{2}$/.test(trimB)) return null;
  
  const [ah, am] = trimA.split(':').map(Number);
  const [bh, bm] = trimB.split(':').map(Number);
  
  let diff = (bh * 60 + bm) - (ah * 60 + am);
  if (diff < 0) diff += 1440; // Handles wrapping over midnight if applicable
  return diff;
}

export function fmtDur(min: number | null): string {
  if (min === null || isNaN(min)) return '';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h${String(m).padStart(2, '0')}`;
  if (h) return `${h}h`;
  return `${m}min`;
}

export function fmtVal(f: Field): string | null {
  if (Array.isArray(f.v)) {
    return f.v.length ? f.v.join(', ') : null;
  }
  if (f.v === '' || f.v === null || f.v === undefined) return null;
  
  if (f.t === 'date') {
    const d = new Date(f.v + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('pt-BR');
    }
  }
  
  if (f.t === 'timerange') {
    if (!f.v.includes('-')) return null;
    const [a, b] = f.v.split('-');
    if (!a || !b) return null;
    return `${a.trim()} às ${b.trim()}`;
  }
  
  if (f.t === 'number' && (f.k || '').toLowerCase().includes('minuto')) {
    return fmtDur(parseInt(f.v, 10));
  }
  
  return f.v;
}

export function cloneFields(fields: Field[]): Field[] {
  return fields.map(f => ({
    ...f,
    v: Array.isArray(f.v) ? [...f.v] : f.v,
    opts: f.opts ? [...f.opts] : undefined
  }));
}

export function dateISOtoBR(iso: string): string {
  if (!iso) return '';
  if (iso.includes('/')) return iso;
  const p = iso.split('-');
  if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
  return iso;
}
export function toast(msg: string): void {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  
  // Clear any existing timeout
  const currentTimer = (window as any).toastTimer;
  if (currentTimer) clearTimeout(currentTimer);
  
  (window as any).toastTimer = setTimeout(() => {
    el.classList.remove('show');
  }, 2600);
}
export function updateCounts(cardsLength: number, connsLength: number): void {
  const cCount = document.getElementById('cCount');
  const cnCount = document.getElementById('cnCount');
  if (cCount) {
    cCount.textContent = cardsLength + (cardsLength === 1 ? ' carta' : ' cartas');
  }
  if (cnCount) {
    cnCount.textContent = connsLength + (connsLength === 1 ? ' conexão' : ' conexões');
  }
}
