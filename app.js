/* ── INTRO ── */
const SECS = 5;
const CIRC = 100.53;
let remaining = SECS;
let iv = null;

function startIntro() {
  const ring = document.getElementById('timerRing');
  const num  = document.getElementById('timerDisp');
  const lbl  = document.getElementById('timerNum');
  const bar  = document.getElementById('progFill');

  bar.style.transition = 'width ' + SECS + 's linear';
  requestAnimationFrame(() => { bar.style.width = '100%'; });

  iv = setInterval(() => {
    remaining--;
    num.textContent = remaining;
    lbl.textContent = remaining;
    const progress = (SECS - remaining) / SECS;
    ring.style.transition = 'stroke-dashoffset 1s linear';
    ring.style.strokeDashoffset = CIRC * progress;
    if (remaining <= 0) { clearInterval(iv); skipIntro(); }
  }, 1000);
}

function skipIntro() {
  clearInterval(iv);
  document.getElementById('intro').classList.add('hidden');
  document.getElementById('app').classList.add('visible');
}

window.addEventListener('load', startIntro);

/* ── NAVIGATION ── */
const PAGES = ['home','community','meet','profile'];

function goTo(p) {
  PAGES.forEach(x => {
    document.getElementById('page-' + x).classList.remove('active');
    const n = document.getElementById('nav-' + x);
    if (n) n.classList.remove('active');
  });
  document.getElementById('page-' + p).classList.add('active');
  const nav = document.getElementById('nav-' + p);
  if (nav) nav.classList.add('active');

  const ava = document.getElementById('nav-profile');
  ava.classList.toggle('active-page', p === 'profile');
}

/* ── HOME: LIKE ── */
function toggleLike(btn) {
  const on = btn.classList.contains('liked');
  btn.classList.toggle('liked');
  btn.textContent = btn.textContent.replace(on ? '♥' : '♡', on ? '♡' : '♥');
}


/* ── COMMUNITY: GROUP DATA ── */
const GROUP_DATA = {
  'Diseñadores MX':   { icon:'🎨', handle:'diseñadores-mx', members:'48', online:'12', desc:'' },
  'Startup Founders': { icon:'🚀', handle:'startup-founders', members:'34', online:'5',  desc:'' },
  'Tech Latam':       { icon:'💻', handle:'tech-latam',       members:'91', online:'23', desc:'' },
  'Foto & Visual':    { icon:'📸', handle:'foto-visual',      members:'27', online:'3',  desc:'' },
  'Música & Cultura': { icon:'🎵', handle:'musica-cultura',   members:'19', online:'2',  desc:'' },
};

/* ── COMMUNITY PROFILE PANEL ── */
function openCommProfile() {
  const name = document.getElementById('chat-name').textContent;
  const data = GROUP_DATA[name] || { icon:'👥', handle: name.toLowerCase().replace(/\s+/g,'-'), members:'?', online:'?', desc:'' };

  document.getElementById('cpp-name').textContent      = name;
  document.getElementById('cpp-handle').textContent    = data.handle;
  document.getElementById('cpp-icon').textContent      = data.icon;
  document.getElementById('cpp-cover-icon').textContent = data.icon;
  document.getElementById('cpp-members').textContent   = data.members;
  document.getElementById('cpp-online').textContent    = data.online;

  // Description
  const descEl = document.getElementById('cpp-desc');
  if (data.desc) {
    descEl.innerHTML = data.desc;
    document.getElementById('cpp-desc-edit-btn').textContent = 'Editar descripción';
  } else {
    descEl.innerHTML = '<span class="cpp-desc-placeholder">Sin descripción todavía.</span>';
    document.getElementById('cpp-desc-edit-btn').textContent = '+ Añadir descripción';
  }
  document.getElementById('cpp-desc-textarea').value = data.desc || '';
  document.getElementById('cpp-desc-textarea').classList.remove('open');
  document.getElementById('cpp-desc-save').classList.remove('open');

  document.getElementById('commProfileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCommProfile() {
  document.getElementById('commProfileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleCommOverlayClick(e) {
  if (e.target === document.getElementById('commProfileOverlay')) closeCommProfile();
}

function toggleCommJoin(btn) {
  if (btn.classList.contains('joined')) {
    btn.classList.remove('joined');
    btn.textContent = 'Unirse';
  } else {
    btn.classList.add('joined');
    btn.textContent = '✓ Unido';
  }
}

function toggleCommDescEdit() {
  const ta   = document.getElementById('cpp-desc-textarea');
  const save = document.getElementById('cpp-desc-save');
  ta.classList.toggle('open');
  save.classList.toggle('open');
  if (ta.classList.contains('open')) ta.focus();
}

function saveCommDesc() {
  const name = document.getElementById('cpp-name').textContent;
  const ta   = document.getElementById('cpp-desc-textarea');
  const val  = ta.value.trim();
  const descEl = document.getElementById('cpp-desc');

  if (GROUP_DATA[name]) GROUP_DATA[name].desc = val;

  if (val) {
    descEl.textContent = val;
    document.getElementById('cpp-desc-edit-btn').textContent = 'Editar descripción';
  } else {
    descEl.innerHTML = '<span class="cpp-desc-placeholder">Sin descripción todavía.</span>';
    document.getElementById('cpp-desc-edit-btn').textContent = '+ Añadir descripción';
  }

  ta.classList.remove('open');
  document.getElementById('cpp-desc-save').classList.remove('open');
}

/* ── COMMUNITY: SELECT GROUP ── */
function pickGroup(el, name, icon, sub) {
  document.querySelectorAll('.g-item').forEach(g => g.classList.remove('sel'));
  el.classList.add('sel');
  document.getElementById('chat-name').textContent = name;
  document.getElementById('chat-icon').textContent = icon;
  document.getElementById('chat-sub').textContent  = sub;
  // Sync post composer
  document.getElementById('cpc-comm-name').textContent = name;
  document.getElementById('cpc-icon').textContent = icon;
  // Reset to posts view when switching group
  commTab('posts');
}

/* ── COMMUNITY: SWITCH POSTS / CHAT ── */
function commTab(tab) {
  const postsView = document.getElementById('comm-posts-view');
  const chatView  = document.getElementById('comm-chat-view');
  const tabPosts  = document.getElementById('tab-posts');
  const tabChat   = document.getElementById('tab-chat');

  if (tab === 'posts') {
    postsView.style.display = 'flex';
    chatView.style.display  = 'none';
    tabPosts.classList.add('active');
    tabChat.classList.remove('active');
  } else {
    postsView.style.display = 'none';
    chatView.style.display  = 'flex';
    tabPosts.classList.remove('active');
    tabChat.classList.add('active');
    // scroll chat to bottom
    const msgs = document.getElementById('chat-msgs');
    msgs.scrollTop = msgs.scrollHeight;
  }
}

/* ── COMMUNITY: PUBLISH POST ── */
function publishCommPost() {
  const field   = document.getElementById('cpc-field');
  const text    = field.value.trim();
  if (!text) return;

  const commName = document.getElementById('cpc-comm-name').textContent;
  const commIcon = document.getElementById('cpc-icon').textContent;
  const feed     = document.getElementById('comm-posts-feed');

  const el = document.createElement('div');
  el.className = 'comm-post';
  el.style.animationDelay = '0s';
  el.innerHTML = `
    <div class="cp-head">
      <div class="cp-icon">${commIcon}</div>
      <div class="cp-meta">
        <div class="cp-comm">${commName}</div>
        <div class="cp-author">Publicado por Ti · ahora</div>
      </div>
      <div class="cp-more">···</div>
    </div>
    <div class="cp-body">${text.replace(/</g,'&lt;')}</div>
    <div class="cp-acts">
      <button class="cp-btn" onclick="toggleCommLike(this)">♡ 0</button>
      <button class="cp-btn">💬 0</button>
      <button class="cp-btn">↺ 0</button>
      <button class="cp-btn cp-end">↗ Compartir</button>
    </div>`;

  // Insert at top (after separator if any)
  feed.insertBefore(el, feed.firstChild);
  field.value = '';
}

/* ── COMMUNITY: LIKE POST ── */
function toggleCommLike(btn) {
  const on = btn.classList.contains('liked');
  btn.classList.toggle('liked');
  const parts = btn.textContent.trim().split(' ');
  const sym   = on ? '♡' : '♥';
  const cnt   = parseInt(parts[1] || '0') + (on ? -1 : 1);
  btn.textContent = sym + ' ' + Math.max(0, cnt);
}

/* ── COMMUNITY: SEND CHAT MESSAGE ── */
function sendMsg(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsgBtn(); }
}
function sendMsgBtn() {
  const f = document.getElementById('ci-inp');
  const t = f.value.trim();
  if (!t) return;
  const msgs = document.getElementById('chat-msgs');
  const el = document.createElement('div');
  el.className = 'msg mine';
  el.innerHTML = `
    <div class="m-ava">A</div>
    <div>
      <div class="m-bubble">${t.replace(/</g,'&lt;')}</div>
      <div class="m-time">Ahora</div>
    </div>`;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  f.value = '';
}

/* ── MEET ── */
function tTag(btn) { btn.classList.toggle('on'); }
function searchPosts(query) {
  const feed = document.getElementById('v-posts');
  const cards = feed.querySelectorAll('.post-card');
  const q = query.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const match = !q || text.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  let empty = document.getElementById('search-empty-msg');
  if (!empty) {
    empty = document.createElement('div');
    empty.id = 'search-empty-msg';
    empty.style.cssText = 'text-align:center;padding:40px 24px;color:var(--gray4);font-size:14px;font-weight:500;display:none;';
    empty.textContent = 'No se encontraron publicaciones.';
    feed.parentNode.insertBefore(empty, feed.nextSibling);
  }
  empty.style.display = (q && visible === 0) ? 'block' : 'none';
}
function doSearch() {
  const r = document.getElementById('meet-res');
  r.style.display = 'block';
  r.scrollIntoView({ behavior:'smooth', block:'start' });
}
function sendConn(btn) {
  if (btn.classList.contains('sent')) return;
  btn.classList.add('sent');
  btn.textContent = '✓ Mensaje enviado';
}

/* ── PROFILE TABS ── */
function pfTab(btn) {
  document.querySelectorAll('.pt').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
}

/* ── EDIT PROFILE ── */
let _profData = {
  name: 'Tu Nombre',
  handle: '@tu_usuario',
  bio: 'Aquí aparecerá tu bio — cuenta quién eres, qué haces, qué te apasiona.',
  location: 'Ciudad de México'
};

function toggleEditProfile() {
  // Open modal and populate with current values
  document.getElementById('ep-name').value = _profData.name;
  document.getElementById('ep-handle').value = _profData.handle;
  document.getElementById('ep-bio').value = _profData.bio;
  document.getElementById('ep-location').value = _profData.location;
  document.getElementById('editProfileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('ep-name').focus(), 50);
}

function closeEditProfile() {
  document.getElementById('editProfileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function saveEditProfile() {
  const newName    = document.getElementById('ep-name').value.trim()     || _profData.name;
  const newHandle  = document.getElementById('ep-handle').value.trim()   || _profData.handle;
  const newBio     = document.getElementById('ep-bio').value.trim()      || _profData.bio;
  const newLoc     = document.getElementById('ep-location').value.trim() || _profData.location;

  _profData = { name: newName, handle: newHandle, bio: newBio, location: newLoc };

  document.getElementById('prof-name-display').textContent    = newName;
  document.getElementById('prof-handle-display').textContent  = newHandle;
  document.getElementById('prof-bio-display').textContent     = newBio;
  document.getElementById('prof-location-display').textContent = '📍 ' + newLoc;

  closeEditProfile();
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('editProfileOverlay')) closeEditProfile();
}