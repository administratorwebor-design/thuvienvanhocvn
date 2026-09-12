import { PageFlip } from 'page-flip';
import './reader.css';
const icons = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  zoom: '<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 6 6M7 10.5h7M10.5 7v7"/>',
  fullscreen: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  sound: '<path d="M11 4 6 8H3v8h3l5 4zM15 8a7 7 0 0 1 0 8m3-11a11 11 0 0 1 0 14"/>',
  mute: '<path d="M11 4 6 8H3v8h3l5 4zM16 9l5 6m0-6-5 6"/>',
  turn: '<path d="M14 3v5C5 8 3 14 3 21c3-6 6-8 11-8v5l8-8z"/>',
  play: '<path d="m7 3 15 9L7 21z"/>', pause: '<path d="M5 3h5v18H5zm9 0h5v18h-5z"/>',
};
const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name]}</svg>`;
const pages = window.READER_PAGES || [
  { image: 'story-cover.jpg', title: 'Bìa truyện Ba lưỡi rìu', text: '' },
  { image: 'story-intro.jpg', title: 'Người tiều phu', text: 'Ngày xưa có một anh tiều phu rất nghèo. Gia tài của anh chỉ có một chiếc rìu sắt. Sáng ấy, như thường lệ, anh vác rìu vào rừng kiếm củi.' },
  { image: 'story-falling.jpg', title: 'Chiếc rìu rơi xuống sông', text: 'Vừa chặt được vài thì gãy cán, lưỡi rìu văng xuống sông. Anh tiều phu buồn rầu: “Ta chỉ có một chiếc rìu để kiếm sống, giờ đã mất. Ta biết sống sao đây!”' },
  { image: 'story-meeting.jpg', title: 'Ông cụ hiện lên', text: 'Nghe lời than của anh tiều phu, tiên ông biến thành một cụ già, hiện lên an ủi:\n– Con đừng buồn! Ta sẽ giúp con.' },
  { image: 'story-silver.jpg', title: 'Chiếc rìu bằng bạc', text: 'Nói rồi, cụ già lặn xuống sông. Lần thứ nhất, cụ vớt lên một lưỡi rìu bằng bạc. Cụ già hỏi:\n– Lưỡi rìu này là của con phải không?\n– Thưa cụ, lưỡi rìu này không phải của con.' },
  { image: 'story-meeting.jpg', title: 'Lòng trung thực', text: 'Anh cũng không nhận chiếc rìu vàng, chỉ nhận lại rìu sắt của mình. Ông cụ khen anh thật thà và tặng anh cả ba chiếc rìu.\nCâu chuyện nhắc chúng ta sống trung thực, không tham những thứ không thuộc về mình.' },
];
const $ = id => document.getElementById(id);
const book = $('book');
pages.forEach((page, index) => {
  const article = document.createElement('section'); article.className = `story-page ${page.fullImage ? 'story-scan' : index === 0 ? 'story-cover' : ''}`;
  article.setAttribute('aria-label', page.title);
  const inner = document.createElement('div'); inner.className = 'story-page-inner';
  const image = document.createElement('img'); image.className = 'story-image'; image.src = page.image; image.alt = page.title; image.draggable = false; inner.append(image);
  if (page.text) {
    const play = document.createElement('button'); play.className = 'read-page'; play.dataset.page = index; play.setAttribute('aria-label', 'Đọc trang truyện'); play.innerHTML = svg('play'); inner.append(play);
    const copy = document.createElement('p'); copy.className = 'story-copy'; copy.textContent = page.text; inner.append(copy);
  }
  article.append(inner); book.append(article);
  const thumb = document.createElement('button'); thumb.innerHTML = `<img src="${page.image}" alt=""><span>${index + 1}</span>`; thumb.setAttribute('aria-label', `Trang ${index + 1}: ${page.title}`);
  thumb.onclick = () => { go(index); $('thumbnails').hidden = true; $('overview').setAttribute('aria-expanded', 'false'); }; $('thumbnails').append(thumb);
});
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const flip = new PageFlip(book, { width: 420, height: 609, size: 'stretch', minWidth: 320, maxWidth: 620, minHeight: 260, maxHeight: 900, usePortrait: true, autoSize: false, drawShadow: true, maxShadowOpacity: .38, flippingTime: reduced.matches ? 1 : 850, showCover: false, mobileScrollSupport: true, disableFlipByClick: true, showPageCorners: true });
let current = 0, busy = false, muted = false, speech = null;
function stopReading() {
  speech = null; window.speechSynthesis?.cancel();
  document.querySelectorAll('.read-page').forEach(b => { b.innerHTML = svg('play'); b.setAttribute('aria-label', 'Đọc trang truyện'); });
}
function sync() {
  $('counter').textContent = `${current + 1} / ${pages.length}`; $('progress').value = current;
  $('previous').disabled = current === 0; $('next').disabled = current === pages.length - 1;
  [...$('thumbnails').children].forEach((b, i) => b.setAttribute('aria-current', String(i === current)));
}
function go(index) {
  if (busy || index < 0 || index >= pages.length || index === current) return;
  stopReading(); if (reduced.matches) flip.turnToPage(index); else flip.flip(index, 'bottom');
}
flip.on('flip', event => { current = event.data; stopReading(); sync(); });
flip.on('changeState', event => { busy = event.data === 'flipping' || event.data === 'user_fold'; book.dataset.turning = String(busy); });
flip.loadFromHTML(document.querySelectorAll('.story-page'));
$('previous').innerHTML = $('next').innerHTML = svg('turn');
$('previous').onclick = () => go(current - 1); $('next').onclick = () => go(current + 1);
$('progress').max = pages.length - 1; $('progress').onchange = event => { go(Number(event.target.value)); sync(); };
$('overview').innerHTML = svg('grid'); $('overview').onclick = () => { $('thumbnails').hidden = !$('thumbnails').hidden; $('overview').setAttribute('aria-expanded', String(!$('thumbnails').hidden)); };
$('zoom').innerHTML = svg('zoom'); $('zoom').onclick = () => { const zoomed = document.body.classList.toggle('zoomed'); $('zoom').setAttribute('aria-pressed', String(zoomed)); requestAnimationFrame(() => flip.update()); };
$('fullscreen').innerHTML = svg('fullscreen'); $('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('reader-status').textContent = 'Trình duyệt chưa cho phép toàn màn hình.'; } };
$('sound').innerHTML = svg('sound'); $('sound').onclick = () => { muted = !muted; stopReading(); $('sound').innerHTML = svg(muted ? 'mute' : 'sound'); $('sound').setAttribute('aria-pressed', String(muted)); $('sound').setAttribute('aria-label', muted ? 'Bật tiếng đọc' : 'Tắt tiếng đọc'); };
book.addEventListener('click', event => {
  const button = event.target.closest('.read-page'); if (!button || busy) return;
  if (speech) { stopReading(); return; }
  if (muted) { $('reader-status').textContent = 'Bật tiếng đọc để nghe trang truyện.'; return; }
  if (!window.speechSynthesis) { $('reader-status').textContent = 'Trình duyệt này chưa hỗ trợ đọc văn bản.'; return; }
  const voice = new SpeechSynthesisUtterance(pages[current].text); voice.lang = 'vi-VN'; voice.rate = .9;
  const vietnamese = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('vi')); if (vietnamese) voice.voice = vietnamese;
  speech = voice; button.innerHTML = svg('pause'); button.setAttribute('aria-label', 'Dừng đọc');
  voice.onend = () => { if (speech === voice) stopReading(); }; voice.onerror = () => { if (speech === voice) { stopReading(); $('reader-status').textContent = 'Không phát được giọng đọc. Hãy kiểm tra giọng tiếng Việt trên thiết bị.'; } };
  speechSynthesis.speak(voice);
});
document.addEventListener('keydown', event => {
  if (event.target.matches('input')) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(current + (event.key === 'ArrowRight' ? 1 : -1)); }
  if (event.key === 'Escape') { $('thumbnails').hidden = true; $('overview').setAttribute('aria-expanded', 'false'); stopReading(); }
});
if (pages.every(page => !page.text)) $('sound').style.display = 'none';
window.addEventListener('pagehide', stopReading); sync();
