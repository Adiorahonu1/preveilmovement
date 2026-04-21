/* ── Auth Guard ──
   Include this script on any page that requires authentication.
   Redirects unauthenticated users to login.html with a return URL.
*/
(async function () {
  /* Wait for Supabase to be ready */
  if (typeof _supabase === 'undefined') return;

  var result = await _supabase.auth.getSession();
  var session = result.data && result.data.session;

  if (!session) {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    window.location.href = 'login.html?redirect=' + encodeURIComponent(page);
  }
})();
