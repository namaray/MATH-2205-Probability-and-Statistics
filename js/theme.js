/* Light / dark theme switcher.
 *
 * Loaded synchronously in <head> so the theme is set before the page paints
 * (no flash of the wrong theme). Follows the system setting until the reader
 * picks a theme with the navbar button; that choice is then remembered.
 */
(function () {
  var KEY = 'math2205-theme';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function system() {
    return mq && mq.matches ? 'light' : 'dark';
  }

  function current() {
    return root.getAttribute('data-theme');
  }

  function sync() {
    var b = document.querySelector('.theme-toggle');
    if (!b) return;
    var light = current() === 'light';
    var label = light ? 'Switch to dark theme' : 'Switch to light theme';
    b.textContent = light ? '🌙' : '☀️';
    b.setAttribute('aria-label', label);
    b.title = label;
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    sync();
  }

  apply(stored() || system());

  // Track the system setting only while the reader hasn't chosen a theme.
  if (mq) {
    var follow = function () { if (!stored()) apply(system()); };
    if (mq.addEventListener) mq.addEventListener('change', follow);
    else if (mq.addListener) mq.addListener(follow);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Sit beside the link row, not inside it, so the button stays visible
    // when the links scroll sideways on narrow screens.
    var links = document.querySelector('.nav-links') || document.querySelector('.navbar .links');
    var bar = document.querySelector('.navbar');
    if (!links && !bar) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'theme-toggle';
    b.addEventListener('click', function () {
      var next = current() === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(KEY, next); } catch (e) { /* private mode: still switch for this page */ }
      apply(next);
    });
    if (links) links.parentNode.insertBefore(b, links.nextSibling);
    else bar.appendChild(b);
    sync();
  });
})();
