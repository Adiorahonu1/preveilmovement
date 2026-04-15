/* ═══════════════════════════════════════════════════════════════
   PREVAIL MOVEMENT — AGENT AUTH
   Powered by Supabase  ·  https://supabase.com

   SETUP (one-time, takes 2 minutes):
   1. Go to https://supabase.com  →  New project
   2. Project Settings  →  API
   3. Copy "Project URL"  →  paste into SUPABASE_URL below
   4. Copy "anon public" key  →  paste into SUPABASE_ANON_KEY below
   5. In Supabase: Authentication  →  Users  →  Invite agents by email
   ═══════════════════════════════════════════════════════════════ */

const SUPABASE_URL      = 'https://dhhcmgdtzkvszecbxfoo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LMhMG720X2viwkyjqbsX5w_72poNt1d';

/* ── Init ─────────────────────────────────────────────────────── */
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
let _isProtected = false;

/* ── Styles ───────────────────────────────────────────────────── */
const _style = document.createElement('style');
_style.textContent = `
  /* ── Nav button ── */
  .auth-nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.65);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 100px;
    padding: 7px 16px;
    cursor: pointer;
    transition: background 0.22s, color 0.22s, border-color 0.22s;
    margin-right: 10px;
    font-family: inherit;
  }
  .auth-nav-btn:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-color: rgba(255,255,255,0.26);
  }
  .auth-nav-btn svg {
    width: 13px; height: 13px;
    stroke: currentColor; fill: none;
    stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    flex-shrink: 0;
  }
  .auth-nav-btn.is-signed-in {
    color: var(--gold, #c9a84c);
    border-color: rgba(201,168,76,0.28);
    background: rgba(201,168,76,0.06);
  }
  .auth-nav-btn.is-signed-in:hover {
    background: rgba(201,168,76,0.12);
    border-color: rgba(201,168,76,0.5);
  }

  /* ── Overlay ── */
  .auth-overlay {
    position: fixed;
    inset: 0;
    background: rgba(6, 1, 3, 0.9);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.28s ease;
    padding: 20px;
  }
  .auth-overlay.open {
    opacity: 1;
    pointer-events: all;
  }

  /* ── Card ── */
  .auth-card {
    background: linear-gradient(155deg, #1c0408 0%, #0e0203 100%);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 20px;
    padding: 44px 42px 40px;
    width: 100%;
    max-width: 410px;
    position: relative;
    box-shadow:
      0 48px 96px rgba(0,0,0,0.65),
      0 0 0 1px rgba(224,31,56,0.06),
      inset 0 1px 0 rgba(255,255,255,0.05);
    transform: translateY(18px) scale(0.96);
    transition: transform 0.38s cubic-bezier(0.22,1,0.36,1);
  }
  .auth-overlay.open .auth-card {
    transform: none;
  }

  /* ── Close ── */
  .auth-close {
    position: absolute;
    top: 16px; right: 18px;
    background: none; border: none;
    color: rgba(255,255,255,0.28);
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
    padding: 4px 6px;
    border-radius: 4px;
    transition: color 0.2s, background 0.2s;
    display: none;
  }
  .auth-close:hover { color: #fff; background: rgba(255,255,255,0.07); }
  .auth-close.show { display: block; }

  /* ── Logo ── */
  .auth-logo {
    display: block;
    width: 48px; height: 48px;
    margin: 0 auto 22px;
    object-fit: contain;
    opacity: 0.9;
  }

  /* ── Checking state ── */
  .auth-checking {
    text-align: center;
    padding: 20px 0 10px;
  }
  .auth-checking__dot {
    display: inline-block;
    width: 8px; height: 8px;
    background: var(--crimson, #e01f38);
    border-radius: 50%;
    animation: auth-pulse 1.1s ease-in-out infinite;
  }
  .auth-checking__dot:nth-child(2) { animation-delay: 0.18s; margin: 0 6px; }
  .auth-checking__dot:nth-child(3) { animation-delay: 0.36s; }
  @keyframes auth-pulse {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40%            { transform: scale(1);   opacity: 1; }
  }

  /* ── Headings ── */
  .auth-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 30px;
    letter-spacing: 0.1em;
    color: #fff;
    text-align: center;
    margin: 0 0 5px;
    line-height: 1;
  }
  .auth-subtitle {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.32);
    text-align: center;
    margin-bottom: 32px;
  }

  /* ── Divider ── */
  .auth-divider {
    width: 36px;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(224,31,56,0.5), transparent);
    margin: 0 auto 28px;
  }

  /* ── Fields ── */
  .auth-field { margin-bottom: 16px; }
  .auth-field label {
    display: block;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    margin-bottom: 8px;
  }
  .auth-field input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px;
    padding: 12px 15px;
    font-size: 14px;
    color: #fff;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .auth-field input:focus {
    border-color: rgba(224,31,56,0.55);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(224,31,56,0.1);
  }
  .auth-field input::placeholder { color: rgba(255,255,255,0.2); }

  /* ── Error ── */
  .auth-error {
    font-size: 12px;
    color: #ff7070;
    background: rgba(255,60,60,0.08);
    border: 1px solid rgba(255,60,60,0.18);
    border-radius: 7px;
    padding: 10px 13px;
    margin-bottom: 16px;
    text-align: center;
    display: none;
    line-height: 1.5;
  }
  .auth-error.show { display: block; }

  /* ── Submit ── */
  .auth-submit {
    width: 100%;
    background: linear-gradient(135deg, #e01f38 0%, #b8102a 100%);
    border: none;
    border-radius: 9px;
    padding: 13px 20px;
    font-family: 'Bebas Neue', cursive;
    font-size: 17px;
    letter-spacing: 0.14em;
    color: #fff;
    cursor: pointer;
    margin-top: 6px;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 6px 24px rgba(224,31,56,0.28);
  }
  .auth-submit:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 10px 32px rgba(224,31,56,0.38);
  }
  .auth-submit:active:not(:disabled) { transform: translateY(0); }
  .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* ── Spinner ── */
  .auth-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: auth-spin 0.65s linear infinite;
    display: none;
  }
  .auth-submit.loading .auth-spinner { display: block; }
  .auth-submit.loading .auth-btn-text { display: none; }
  @keyframes auth-spin { to { transform: rotate(360deg); } }

  /* ── Signed-in view ── */
  .auth-portal {
    text-align: center;
    display: none;
  }
  .auth-portal.show { display: block; }
  .auth-portal__name {
    font-family: 'Bebas Neue', cursive;
    font-size: 20px;
    letter-spacing: 0.08em;
    color: var(--gold, #c9a84c);
    margin-bottom: 4px;
  }
  .auth-portal__label {
    font-size: 11px;
    color: rgba(255,255,255,0.36);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 28px;
  }
  .auth-signout {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    color: rgba(255,255,255,0.55);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 11px 28px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
  }
  .auth-signout:hover {
    background: rgba(255,255,255,0.09);
    color: #fff;
    border-color: rgba(255,255,255,0.24);
  }

  /* ── Footer note ── */
  .auth-note {
    text-align: center;
    font-size: 10.5px;
    color: rgba(255,255,255,0.18);
    margin-top: 22px;
    letter-spacing: 0.06em;
    line-height: 1.6;
  }

  /* ── Views toggle ── */
  .auth-form-wrap { display: block; }
  .auth-form-wrap.hide { display: none; }

  /* ── Page lock — hide all content until auth confirmed ── */
  body.auth-locked > *:not(#authOverlay) {
    visibility: hidden !important;
    pointer-events: none !important;
  }

  @media (max-width: 480px) {
    .auth-card { padding: 36px 22px 32px; }
    .auth-title { font-size: 26px; }
  }
`;
document.head.appendChild(_style);

/* ── Inject modal HTML ────────────────────────────────────────── */
const _modal = document.createElement('div');
_modal.className = 'auth-overlay';
_modal.id = 'authOverlay';
_modal.innerHTML = `
  <div class="auth-card">

    <button class="auth-close" id="authCloseBtn" aria-label="Close">&#x2715;</button>
    <img class="auth-logo" src="99.png" alt="Prevail Movement" onerror="this.style.display='none'">

    <!-- Checking session… -->
    <div id="authCheckingView" style="text-align:center;padding:10px 0 20px;">
      <div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:8px;">
        <span class="auth-checking__dot"></span>
        <span class="auth-checking__dot"></span>
        <span class="auth-checking__dot"></span>
      </div>
    </div>

    <!-- Login form -->
    <div class="auth-form-wrap hide" id="authFormWrap">
      <h2 class="auth-title">AGENT PORTAL</h2>
      <p class="auth-subtitle">Prevail Movement · Internal Access</p>
      <div class="auth-divider"></div>
      <div class="auth-error" id="authError"></div>
      <form id="authForm" autocomplete="on" novalidate>
        <div class="auth-field">
          <label for="authEmailInput">Email Address</label>
          <input type="email" id="authEmailInput" name="email"
            placeholder="agent@prevailmovement.com" required autocomplete="email">
        </div>
        <div class="auth-field">
          <label for="authPassInput">Password</label>
          <input type="password" id="authPassInput" name="password"
            placeholder="••••••••" required autocomplete="current-password">
        </div>
        <button type="submit" class="auth-submit" id="authSubmitBtn">
          <span class="auth-btn-text">Sign In</span>
          <span class="auth-spinner"></span>
        </button>
      </form>
      <p class="auth-note">Restricted to licensed Prevail Movement agents.<br>Contact your director for access.</p>
    </div>

    <!-- Already signed in -->
    <div class="auth-portal" id="authPortalView">
      <h2 class="auth-title">AGENT PORTAL</h2>
      <p class="auth-subtitle">You are signed in</p>
      <div class="auth-divider"></div>
      <p class="auth-portal__name" id="authUserDisplay"></p>
      <p class="auth-portal__label">Licensed Agent</p>
      <button class="auth-signout" id="authSignOutBtn">Sign Out</button>
    </div>

  </div>
`;
document.body.appendChild(_modal);

/* ── DOM refs ─────────────────────────────────────────────────── */
const _overlay      = document.getElementById('authOverlay');
const _closeBtn     = document.getElementById('authCloseBtn');
const _checkView    = document.getElementById('authCheckingView');
const _formWrap     = document.getElementById('authFormWrap');
const _portalView   = document.getElementById('authPortalView');
const _form         = document.getElementById('authForm');
const _emailInput   = document.getElementById('authEmailInput');
const _passInput    = document.getElementById('authPassInput');
const _submitBtn    = document.getElementById('authSubmitBtn');
const _errorEl      = document.getElementById('authError');
const _userDisplay  = document.getElementById('authUserDisplay');
const _signOutBtn   = document.getElementById('authSignOutBtn');

/* ── Show / hide views ────────────────────────────────────────── */
function _showCheckingView() {
  _checkView.style.display = 'block';
  _formWrap.classList.add('hide');
  _portalView.classList.remove('show');
}
function _showFormView() {
  _checkView.style.display = 'none';
  _formWrap.classList.remove('hide');
  _portalView.classList.remove('show');
  setTimeout(() => _emailInput.focus(), 80);
}
function _showPortalView(email) {
  _checkView.style.display = 'none';
  _formWrap.classList.add('hide');
  _portalView.classList.add('show');
  _userDisplay.textContent = email || 'Agent';
}

/* ── Open / close overlay ─────────────────────────────────────── */
function _openOverlay(closeable) {
  _overlay.classList.add('open');
  _closeBtn.classList.toggle('show', !!closeable);
  if (closeable) {
    _overlay.addEventListener('click', _bgClick);
  } else {
    _overlay.removeEventListener('click', _bgClick);
  }
}
function _closeOverlay() {
  _overlay.classList.remove('open');
  _errorEl.classList.remove('show');
  _errorEl.textContent = '';
  _form.reset();
}
function _bgClick(e) { if (e.target === _overlay) _closeOverlay(); }

_closeBtn.addEventListener('click', _closeOverlay);

/* ── Nav button ───────────────────────────────────────────────── */
function _injectNavBtn() {
  if (document.getElementById('authNavBtn')) return;
  const anchor = document.querySelector('.nav__cta.desktop');
  if (!anchor) return;
  const btn = document.createElement('button');
  btn.id = 'authNavBtn';
  btn.className = 'auth-nav-btn desktop';
  btn.setAttribute('aria-label', 'Agent login');
  btn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/>
      <line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
    Agent Login`;
  btn.addEventListener('click', async () => {
    _showCheckingView();
    _openOverlay(true);
    const { data: { session } } = await _sb.auth.getSession();
    if (session) {
      _showPortalView(session.user.email);
    } else {
      _showFormView();
    }
  });
  anchor.parentNode.insertBefore(btn, anchor);
}

function _updateNavBtn(session) {
  const btn = document.getElementById('authNavBtn');
  if (!btn) return;
  if (session) {
    btn.classList.add('is-signed-in');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
      My Portal`;
  } else {
    btn.classList.remove('is-signed-in');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
        <polyline points="10 17 15 12 10 7"/>
        <line x1="15" y1="12" x2="3" y2="12"/>
      </svg>
      Agent Login`;
  }
}

/* ── Loading state ────────────────────────────────────────────── */
function _setLoading(on) {
  _submitBtn.disabled = on;
  _submitBtn.classList.toggle('loading', on);
}

/* ── Form submit ──────────────────────────────────────────────── */
_form.addEventListener('submit', async (e) => {
  e.preventDefault();
  _errorEl.classList.remove('show');
  _setLoading(true);

  const { data, error } = await _sb.auth.signInWithPassword({
    email:    _emailInput.value.trim(),
    password: _passInput.value,
  });

  _setLoading(false);

  if (error) {
    const msg = error.message.includes('Invalid login')
      ? 'Incorrect email or password. Try again.'
      : error.message;
    _errorEl.textContent = msg;
    _errorEl.classList.add('show');
    return;
  }

  document.body.classList.remove('auth-locked');
  _closeOverlay();
});

/* ── Sign out ─────────────────────────────────────────────────── */
_signOutBtn.addEventListener('click', async () => {
  await _sb.auth.signOut();
  _closeOverlay();
  if (_isProtected) {
    window.location.href = 'index.html';
  }
});

/* ── requireAuth — call on protected pages ────────────────────── */
async function requireAuth() {
  _isProtected = true;

  // Lock page content immediately — no flash of protected content
  document.body.classList.add('auth-locked');

  _showCheckingView();
  _openOverlay(false); // blocking — not closeable

  const { data: { session } } = await _sb.auth.getSession();

  if (session) {
    document.body.classList.remove('auth-locked'); // reveal page
    _closeOverlay();
  } else {
    document.body.classList.remove('auth-locked'); // overlay covers it anyway
    _showFormView();
  }
}

/* ── Auth state listener ──────────────────────────────────────── */
_sb.auth.onAuthStateChange((_event, session) => {
  _updateNavBtn(session);
  if (_isProtected && !session) {
    _showFormView();
    _openOverlay(false);
  }
});

/* ── Boot ─────────────────────────────────────────────────────── */
(async () => {
  _injectNavBtn();
  const { data: { session } } = await _sb.auth.getSession();
  _updateNavBtn(session);
})();
