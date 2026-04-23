/* ── Auth Guard (Code-Based) ──
   Include on protected pages. Shows branded overlay
   with a simple access code input. No database required.
   Code is checked against sessionStorage.
*/
(function () {
  var ACCESS_CODE = 'PVBC';
  var STORAGE_KEY = 'prevail_access';

  /* ── Already authenticated? ── */
  if (sessionStorage.getItem(STORAGE_KEY) === ACCESS_CODE) return;

  /* ── Lock body immediately ── */
  document.body.classList.add('auth-locked');

  /* ── Inject styles ── */
  var css = document.createElement('style');
  css.textContent = [
    'body.auth-locked > *:not(.auth-gate) { visibility:hidden !important; pointer-events:none !important; }',
    '.auth-gate { position:fixed; inset:0; z-index:99999; background:#07010a; display:flex; align-items:center; justify-content:center; padding:20px; }',
    '.auth-gate--reveal { animation:gateOut .35s ease forwards; }',
    '@keyframes gateOut { to { opacity:0; pointer-events:none; } }',
    '.ag-card { width:100%; max-width:410px; background:linear-gradient(155deg,#1c0408,#0e0203); border:1px solid rgba(255,255,255,.09); border-radius:20px; padding:44px 42px 40px; box-shadow:0 48px 96px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.05); }',
    '.ag-logo { display:block; width:56px; height:56px; margin:0 auto 24px; object-fit:contain; opacity:.9; }',
    '.ag-title { font-family:"Bebas Neue",cursive; font-size:30px; letter-spacing:.1em; color:#fff; text-align:center; margin:0 0 5px; line-height:1; }',
    '.ag-sub { font-size:10.5px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.32); text-align:center; margin-bottom:28px; }',
    '.ag-divider { width:36px; height:1px; background:linear-gradient(to right,transparent,rgba(224,31,56,.5),transparent); margin:0 auto 28px; }',
    '.ag-error { font-size:12px; color:#ff7070; background:rgba(255,60,60,.08); border:1px solid rgba(255,60,60,.18); border-radius:7px; padding:10px 13px; margin-bottom:16px; text-align:center; display:none; line-height:1.5; }',
    '.ag-error.show { display:block; }',
    '.ag-field { margin-bottom:16px; }',
    '.ag-field label { display:block; font-size:9.5px; font-weight:700; letter-spacing:.26em; text-transform:uppercase; color:rgba(255,255,255,.4); margin-bottom:8px; }',
    '.ag-field input { width:100%; box-sizing:border-box; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:9px; padding:12px 15px; font-size:14px; color:#fff; font-family:inherit; outline:none; transition:border-color .2s,background .2s,box-shadow .2s; text-transform:uppercase; letter-spacing:.1em; text-align:center; }',
    '.ag-field input:focus { border-color:rgba(224,31,56,.55); background:rgba(255,255,255,.06); box-shadow:0 0 0 3px rgba(224,31,56,.1); }',
    '.ag-field input::placeholder { color:rgba(255,255,255,.2); text-transform:none; letter-spacing:normal; }',
    '.ag-btn { width:100%; background:linear-gradient(135deg,#e01f38,#b8102a); border:none; border-radius:9px; padding:13px 20px; font-family:"Bebas Neue",cursive; font-size:17px; letter-spacing:.14em; color:#fff; cursor:pointer; margin-top:6px; transition:opacity .2s,transform .15s,box-shadow .2s; box-shadow:0 6px 24px rgba(224,31,56,.28); }',
    '.ag-btn:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); box-shadow:0 10px 32px rgba(224,31,56,.38); }',
    '.ag-btn:disabled { opacity:.5; cursor:not-allowed; }',
    '.ag-note { text-align:center; font-size:10.5px; color:rgba(255,255,255,.18); margin-top:22px; letter-spacing:.06em; line-height:1.6; }',
    '@media (max-width:480px) { .ag-card { padding:36px 22px 32px; } .ag-title { font-size:26px; } }'
  ].join('\n');
  document.head.appendChild(css);

  /* ── Inject gate HTML ── */
  var gate = document.createElement('div');
  gate.className = 'auth-gate';
  gate.id = 'authGate';
  gate.innerHTML =
    '<div class="ag-card">' +
      '<img class="ag-logo" src="99.png" alt="Prevail Movement" onerror="this.style.display=\'none\'">' +
      '<h2 class="ag-title">AGENT PORTAL</h2>' +
      '<p class="ag-sub">Prevail Movement &middot; Internal Access</p>' +
      '<div class="ag-divider"></div>' +
      '<div class="ag-error" id="agError"></div>' +
      '<form id="agLoginForm" onsubmit="return false">' +
        '<div class="ag-field"><label>Access Code</label>' +
          '<input type="text" id="agCode" placeholder="Enter your code" required autocomplete="off">' +
        '</div>' +
        '<button type="submit" class="ag-btn" id="agBtn">Enter</button>' +
      '</form>' +
      '<p class="ag-note">Contact your director for the access code.</p>' +
    '</div>';
  document.body.appendChild(gate);

  setTimeout(function () { document.getElementById('agCode').focus(); }, 80);

  /* ── Reveal page ── */
  function reveal() {
    document.body.classList.remove('auth-locked');
    gate.classList.add('auth-gate--reveal');
    setTimeout(function () { gate.remove(); }, 350);
  }

  /* ── Login handler ── */
  document.getElementById('agLoginForm').addEventListener('submit', function () {
    var code  = document.getElementById('agCode').value.trim().toUpperCase();
    var errEl = document.getElementById('agError');

    if (code === ACCESS_CODE) {
      sessionStorage.setItem(STORAGE_KEY, ACCESS_CODE);
      reveal();
    } else {
      errEl.textContent = 'Incorrect code. Please try again.';
      errEl.classList.add('show');
      document.getElementById('agCode').value = '';
      document.getElementById('agCode').focus();
    }
  });
})();
