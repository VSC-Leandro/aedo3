import { drawConns } from '../../core/connections';

export function toggleRP(): void {
  const rp = document.getElementById('rp');
  if (rp) {
    rp.classList.toggle('open');
  }
  setTimeout(drawConns, 220);
}

export function addAct(txt: string, color: string): void {
  const feed = document.getElementById('actFeed');
  if (!feed) return;
  const now = new Date();
  const t = 'Hoje, ' + String(now.getHours()).padStart(2, '0') + 'h' + String(now.getMinutes()).padStart(2, '0');
  
  const div = document.createElement('div');
  div.className = 'act-item';
  div.innerHTML = `
    <div class="act-dot" style="background:${color}; margin-top:4px; flex-shrink:0;"></div>
    <div>
      <p class="act-txt">${txt}</p>
      <p class="act-time">${t}</p>
    </div>
  `;
  feed.insertBefore(div, feed.firstChild);
}
