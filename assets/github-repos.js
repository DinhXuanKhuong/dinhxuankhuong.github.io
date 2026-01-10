(function () {
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (children && children.length) {
      children.forEach(function (c) {
        if (typeof c === 'string') node.appendChild(document.createTextNode(c));
        else if (c) node.appendChild(c);
      });
    }
    return node;
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      var d = new Date(iso);
      return d.toISOString().slice(0, 10);
    } catch (_) {
      return '';
    }
  }

  function byRecent(a, b) {
    return String(b.pushed_at || '').localeCompare(String(a.pushed_at || ''));
  }

  function byStarsThenRecent(a, b) {
    var as = typeof a.stargazers_count === 'number' ? a.stargazers_count : 0;
    var bs = typeof b.stargazers_count === 'number' ? b.stargazers_count : 0;
    if (bs !== as) return bs - as;
    return byRecent(a, b);
  }

  function parseFeaturedList(raw) {
    if (!raw) return [];
    return raw
      .split(',')
      .map(function (s) { return String(s || '').trim(); })
      .filter(Boolean);
  }

  function renderRepoGrid(repos, ariaLabel) {
    var grid = el('div', { class: 'grid', 'aria-label': ariaLabel || 'Repositories' });

    repos.forEach(function (r) {
      var metaBits = [];
      if (r.language) metaBits.push(r.language);
      if (typeof r.stargazers_count === 'number') metaBits.push('★ ' + r.stargazers_count);
      var updated = formatDate(r.pushed_at);
      if (updated) metaBits.push('Updated ' + updated);

      grid.appendChild(el('article', { class: 'card repo-card' }, [
        el('div', { class: 'kicker', text: metaBits.join(' · ') || 'Repository' }),
        el('h2', null, [
          el('a', { href: r.html_url, target: '_blank', rel: 'noopener noreferrer' }, [r.name || 'Untitled'])
        ]),
        el('p', { text: (r.description || 'No description yet.') })
      ]));
    });

    return grid;
  }

  async function fetchAllRepos(user) {
    var url = 'https://api.github.com/users/' + encodeURIComponent(user) + '/repos?per_page=100&sort=pushed';
    var res = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (!res.ok) throw new Error('GitHub API error: ' + res.status);
    var repos = await res.json();
    if (!Array.isArray(repos)) repos = [];
    return repos;
  }

  function normalizeRepoName(name) {
    return String(name || '').trim().toLowerCase();
  }

  function pickFeatured(repos, names, count) {
    var wanted = (names || []).map(normalizeRepoName);
    var map = new Map();
    repos.forEach(function (r) {
      map.set(normalizeRepoName(r.name), r);
    });

    var featured = [];
    if (wanted.length) {
      wanted.forEach(function (n) {
        var r = map.get(n);
        if (r) featured.push(r);
      });
      return featured;
    }

    var sorted = repos.slice().sort(byStarsThenRecent);
    return sorted.slice(0, count);
  }

  async function loadRepos(container) {
    var user = container.getAttribute('data-github-user');
    var max = parseInt(container.getAttribute('data-max') || '12', 10);
    var hideForks = container.getAttribute('data-hide-forks') !== 'false';

    if (!user) {
      container.textContent = 'Missing GitHub username.';
      return;
    }

    var status = document.getElementById('repo-status');
    if (status) status.textContent = 'Loading repos…';

    try {
      var repos = await fetchAllRepos(user);

      if (hideForks) {
        repos = repos.filter(function (r) { return !r.fork; });
      }

      repos.sort(byRecent);
      repos = repos.slice(0, max);

      container.innerHTML = '';

      if (repos.length === 0) {
        container.appendChild(el('div', { class: 'card' }, [
          el('h2', { text: 'No repos found' }),
          el('p', { class: 'kicker', text: 'Nothing public yet (or API limited).' })
        ]));
        if (status) status.textContent = '';
        return;
      }

      container.appendChild(renderRepoGrid(repos, 'GitHub repositories'));
      if (status) status.textContent = '';
    } catch (err) {
      container.innerHTML = '';
      container.appendChild(el('div', { class: 'card' }, [
        el('h2', { text: 'Could not load repos' }),
        el('p', { class: 'kicker', text: 'GitHub API may be rate-limited in the browser.' }),
        el('p', null, [
          'You can still view my GitHub profile: ',
          el('a', { href: 'https://github.com/' + user, target: '_blank', rel: 'noopener noreferrer' }, ['github.com/' + user]),
          '.'
        ])
      ]));
      if (status) status.textContent = '';
      try { console.warn(err); } catch (_) {}
    }
  }

  function boot() {
    // Featured section (optional)
    var featured = document.getElementById('featured-repos');
    if (featured) {
      (async function () {
        var user = featured.getAttribute('data-github-user');
        var hideForks = featured.getAttribute('data-hide-forks') !== 'false';
        var count = parseInt(featured.getAttribute('data-count') || '3', 10);
        var featuredNames = parseFeaturedList(featured.getAttribute('data-featured'));
        if (!user) return;

        try {
          var repos = await fetchAllRepos(user);
          if (hideForks) repos = repos.filter(function (r) { return !r.fork; });
          var picked = pickFeatured(repos, featuredNames, count);

          featured.innerHTML = '';
          if (!picked.length) {
            featured.appendChild(el('div', { class: 'card' }, [
              el('h2', { text: 'No featured repos' }),
              el('p', { class: 'kicker', text: 'Add repo names in data-featured to pin favorites.' })
            ]));
            return;
          }
          featured.appendChild(renderRepoGrid(picked, 'Featured repositories'));
        } catch (err) {
          featured.innerHTML = '';
          featured.appendChild(el('div', { class: 'card' }, [
            el('h2', { text: 'Could not load featured repos' }),
            el('p', { class: 'kicker', text: 'GitHub API may be rate-limited in the browser.' })
          ]));
          try { console.warn(err); } catch (_) {}
        }
      })();
    }

    var container = document.getElementById('github-repos');
    if (!container) return;
    loadRepos(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
