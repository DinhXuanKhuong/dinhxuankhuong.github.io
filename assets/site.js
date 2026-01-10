(function () {
  // Highlight current nav link
  try {
    var path = location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav a');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href === path) a.setAttribute('aria-current', 'page');
    });
  } catch (_) {}

  // Footer year
  try {
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
  } catch (_) {}
})();
