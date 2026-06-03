/* ============================================================
   STRATEX GROUP — shared chrome, i18n, motion
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Hexagon geometry ---------- */
  function flatHex(cx, cy, r) {
    var s = 0.8660254 * r;
    return [
      [cx + r, cy], [cx + r / 2, cy + s], [cx - r / 2, cy + s],
      [cx - r, cy], [cx - r / 2, cy - s], [cx + r / 2, cy - s]
    ].map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' ');
  }

  // STRATEX logo — 4 flat-top hexagons in a diagonal cascade (orange→green→blue, yellow below)
  function logoMark(cls) {
    var hexes = [
      { cx: 78, cy: 22, r: 22,   fill: 'var(--blue)' },
      { cx: 43, cy: 48, r: 17.3, fill: 'var(--green)' },
      { cx: 13.5, cy: 70, r: 12.7, fill: 'var(--orange)' },
      { cx: 43, cy: 84, r: 16.7, fill: 'var(--yellow)' }
    ];
    var polys = hexes.map(function (h) {
      return '<polygon points="' + flatHex(h.cx, h.cy, h.r) + '" fill="' + h.fill + '"/>';
    }).join('');
    return '<svg class="' + (cls || '') + '" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + polys + '</svg>';
  }

  // single small pointy-top hexagon (decor / bullets)
  function hexIcon(fill, cls) {
    return '<svg class="hex ' + (cls || '') + '" viewBox="0 0 24 28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<polygon points="12,1 23,7.5 23,20.5 12,27 1,20.5 1,7.5" fill="' + (fill || 'currentColor') + '"/></svg>';
  }

  // honeycomb pattern (subtle background / placeholders)
  function honeycomb(color, opacity) {
    color = color || '%231C2530';
    opacity = opacity == null ? 0.06 : opacity;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="64" viewBox="0 0 56 64">' +
      '<g fill="none" stroke="' + color.replace('#', '%23') + '" stroke-opacity="' + opacity + '" stroke-width="1.4">' +
      '<polygon points="28,1 42,9 42,25 28,33 14,25 14,9"/>' +
      '<polygon points="28,33 42,41 42,57 28,65 14,57 14,41"/>' +
      '<polygon points="0,17 14,25 14,41 0,49"/>' +
      '<polygon points="56,17 42,25 42,41 56,49"/>' +
      '</g></svg>';
    return "url(\"data:image/svg+xml," + svg.replace(/#/g, '%23').replace(/"/g, "'") + "\")";
  }

  var ARR = '<svg class="arr" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h9M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Hero honeycomb composition — a flower of flat-top hexagons
  function heroComposition() {
    var cx = 200, cy = 200, r = 56, D = 1.7320508 * r;
    function at(angle) { var a = angle * Math.PI / 180; return [cx + D * Math.cos(a), cy + D * Math.sin(a)]; }
    var ring = [
      { a: 270, fill: 'var(--blue)',   solid: true },
      { a: 330, fill: 'var(--yellow)', solid: true },
      { a: 30,  fill: 'var(--orange)', solid: true },
      { a: 90,  fill: 'var(--green)',  solid: true },
      { a: 150, fill: 'rgb(177, 90, 21)', solid: true },
      { a: 210, fill: 'rgba(79, 215, 130, 0.925)', solid: true }
    ];
    var parts = [];
    // soft shadow base
    parts.push('<polygon points="' + flatHex(cx, cy + 8, r * 2.55) + '" fill="var(--mist)" opacity="0"/>');
    ring.forEach(function (h, i) {
      var p = at(h.a);
      parts.push('<polygon class="hx-pop" style="--i:' + i + '" points="' + flatHex(p[0], p[1], r * 0.96) + '" fill="' + h.fill + '"/>');
    });
    // center hex = white tile echoing the logo
    parts.push('<polygon class="hx-pop" style="--i:6" points="' + flatHex(cx, cy, r * 0.99) + '" fill="rgb(0, 26, 107)" stroke="var(--line)" stroke-width="1.5"/>');
    // small floating accents
    parts.push('<polygon class="hx-float-a" points="' + flatHex(cx + 150, cy + 120, 16) + '" fill="var(--orange)" opacity=".9"/>');
    parts.push('<polygon class="hx-float-b" points="' + flatHex(cx - 150, cy - 118, 13) + '" fill="var(--blue)" opacity=".85"/>');
    parts.push('<polygon class="hx-float-b" points="' + flatHex(cx + 150, cy - 130, 10) + '" fill="none" stroke="var(--line-2)" stroke-width="2"/>');
    parts.push('<polygon class="hx-float-a" points="' + flatHex(cx - 158, cy + 122, 9) + '" fill="none" stroke="var(--line-2)" stroke-width="2"/>');
    return '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + parts.join('') + '</svg>';
  }

  function ic(name) {
    var p = {
      phone: '<path d="M5 3h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2z"/>',
      mail: '<path d="M3 5h18v14H3z"/><path d="M3 6l9 7 9-7"/>',
      pin: '<path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'
    }[name];
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
  }

  /* ---------- Navigation model ---------- */
  var NAV = [
    { id: 'groupe',   href: 'le-groupe.html',  key: 'nav.group' },
    { id: 'poles',    href: 'nos-poles.html',  key: 'nav.poles' },
    { id: 'filiales', href: 'index.html#filiales', key: 'nav.subs' },
    { id: 'academy',  href: 'academy.html',    key: 'nav.academy' },
    { id: 'contact',  href: 'contact.html',    key: 'nav.contact' }
  ];

  var FILIALES = [
    { slug: 'stratex-pharma',     name: 'Stratex Pharma',     pole: 'blue',   color: '#7AC143' },
    { slug: 'stratex-medical',    name: 'Stratex Médical',    pole: 'blue',   color: '#6FC2EC' },
    { slug: 'stratex-academy',    name: 'Stratex Academy',    pole: 'blue',   color: '#F2843C' },
    { slug: 'stratex-immobilier', name: 'Stratex Immo',       pole: 'green',  color: '#8DC63F' },
    { slug: 'stratex-service',    name: 'Stratex Services',   pole: 'green',  color: '#2A6FB5' },
    { slug: 'stratex-bureautique',name: 'Stratex Bureautique',pole: 'orange', color: '#9B2D2D' },
    { slug: 'stratex-finance',    name: 'Stratex Finances',   pole: 'orange', color: '#F5B400' }
  ];

  // lighten a hex toward white (amt 0..1)
  function tint(hex, amt) {
    var c = _rgb(hex);
    return 'rgb(' + Math.round(c[0] + (255 - c[0]) * amt) + ',' + Math.round(c[1] + (255 - c[1]) * amt) + ',' + Math.round(c[2] + (255 - c[2]) * amt) + ')';
  }
  function filBySlug(slug) { for (var i = 0; i < FILIALES.length; i++) if (FILIALES[i].slug === slug) return FILIALES[i]; return null; }

  // ---- WCAG-aware contrast helpers ----
  function _rgb(hex) { var h = hex.replace('#', ''); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; }
  function _lin(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function relLum(hex) { var c = _rgb(hex); return 0.2126 * _lin(c[0]) + 0.7152 * _lin(c[1]) + 0.0722 * _lin(c[2]); }
  function contrast(a, b) { var L1 = relLum(a), L2 = relLum(b), hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05); }
  function shadeHex(hex, amt) { var c = _rgb(hex), ink = [28, 37, 48]; function h2(n) { return ('0' + Math.round(n).toString(16)).slice(-2); } return '#' + h2(c[0] + (ink[0] - c[0]) * amt) + h2(c[1] + (ink[1] - c[1]) * amt) + h2(c[2] + (ink[2] - c[2]) * amt); }
  function onColor(hex) { return contrast(hex, '#FFFFFF') >= contrast(hex, '#1C2530') ? '#fff' : '#1C2530'; } // best text on solid color
  function accentText(hex) { var amt = 0, col = hex; while (contrast(col, '#FFFFFF') < 4.0 && amt < 0.8) { amt += 0.08; col = shadeHex(hex, amt); } return col; } // readable on white
  function isLight(hex) { return relLum(hex) > 0.4; }

  function t(key) {
    var dict = window.STRATEX_I18N || {};
    var lang = STRATEX.lang;
    var e = dict[key];
    if (!e) return '';
    return e[lang] != null ? e[lang] : e.fr;
  }

  function di(key) { return ' data-i18n="' + key + '" '; }

  /* ---------- Header ---------- */
  function buildHeader(active, base) {
    base = base || '';
    var navLinks = NAV.map(function (n) {
      var cls = n.id === active ? ' class="is-active"' : '';
      return '<a href="' + base + n.href + '"' + cls + di(n.key) + '>' + t(n.key) + '</a>';
    }).join('');

    var langToggle =
      '<div class="lang" role="group" aria-label="Language">' +
        '<button data-lang="fr">FR</button>' +
        '<button data-lang="en">EN</button>' +
      '</div>';

    return '' +
    '<header class="site-header" id="siteHeader">' +
      '<div class="wrap header-inner">' +
        '<a class="brand" href="' + base + 'index.html" aria-label="STRATEX Group International">' +
          logoMark('brand__mark') +
          '<span class="brand__type">' +
            '<span class="brand__name">STRATEX</span>' +
            '<span class="brand__sub">Group International</span>' +
          '</span>' +
        '</a>' +
        '<nav class="nav" aria-label="Principal">' + navLinks + '</nav>' +
        '<div class="header-actions">' +
          '<span class="desktop-only">' + langToggle + '</span>' +
          '<a class="btn btn--ink desktop-only" href="' + base + 'contact.html"' + di('cta.contactUs') + '>' + t('cta.contactUs') + '</a>' +
          '<button class="hamburger" id="hamburger" aria-label="Menu" aria-expanded="false"><span></span></button>' +
        '</div>' +
      '</div>' +
    '</header>' +
    '<div class="mobile-nav" id="mobileNav">' +
      NAV.map(function (n) { return '<a href="' + base + n.href + '"' + di(n.key) + '>' + t(n.key) + '</a>'; }).join('') +
      '<a class="btn btn--ink btn--block mobile-cta" href="' + base + 'contact.html"' + di('cta.contactUs') + '>' + t('cta.contactUs') + '</a>' +
      langToggle +
    '</div>';
  }

  /* ---------- Footer ---------- */
  function buildFooter(base) {
    base = base || '';
    var filLinks = FILIALES.map(function (f) {
      return '<li><a href="' + base + 'filiales/' + f.slug + '.html">' + f.name + '</a></li>';
    }).join('');

    var siteLinks = NAV.map(function (n) {
      var href = n.id === 'filiales' ? base + 'index.html#filiales' : base + n.href;
      return '<li><a href="' + href + '"' + di(n.key) + '>' + t(n.key) + '</a></li>';
    }).join('');

    return '' +
    '<footer class="site-footer">' +
      '<div class="wrap footer-top">' +
        '<div class="footer-brand">' +
          '<a class="brand" href="' + base + 'index.html">' + logoMark('brand__mark') +
            '<span class="brand__type"><span class="brand__name">STRATEX</span><span class="brand__sub">Group International</span></span>' +
          '</a>' +
          '<p' + di('footer.blurb') + '>' + t('footer.blurb') + '</p>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4' + di('footer.sitemap') + '>' + t('footer.sitemap') + '</h4>' +
          '<ul>' + siteLinks + '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4' + di('footer.subs') + '>' + t('footer.subs') + '</h4>' +
          '<ul>' + filLinks + '</ul>' +
        '</div>' +
        '<div class="footer-col">' +
          '<h4' + di('footer.contact') + '>' + t('footer.contact') + '</h4>' +
          '<ul class="footer-contact">' +
            '<li><span class="ic">' + ic('pin') + '</span><span>Lot 299 M/Lalokoun Abdoul-Kader,<br>Agbalilamé, Akpakpa, Cotonou, BÉNIN</span></li>' +
            '<li><span class="ic">' + ic('phone') + '</span><span>+229 01 41 76 76 41<br>+229 01 96 00 08 82</span></li>' +
            '<li><span class="ic">' + ic('mail') + '</span><span>info.stratexgroup@gmail.com</span></li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="wrap footer-bottom">' +
        '<span>© ' + new Date().getFullYear() + ' STRATEX Group International. ' + '<span' + di('footer.rights') + '>' + t('footer.rights') + '</span></span>' +
        '<div class="socials">' +
          '<a href="https://www.facebook.com/profile.php?id=61572018505692" target="_blank" rel="noopener" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-2.2 0-3.5 1.3-3.5 3.6V12H8v3h2.5v7h3v-7H16l.5-3h-3v-2c0-.7.3-1 1-1z"/></svg></a>' +
          '<a href="https://www.tiktok.com/@stratexgroupintl" target="_blank" rel="noopener" aria-label="TikTok"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.6c-1.2.1-2.4-.2-3.5-.8v5.9c0 3.4-2.6 5.6-5.6 5.4-2.8-.2-4.9-2.5-4.8-5.3.1-2.7 2.4-4.9 5.1-4.8.3 0 .5 0 .8.1v2.7c-.3-.1-.6-.2-.9-.2-1.2 0-2.2 1-2.2 2.3 0 1.3 1 2.3 2.3 2.3 1.3 0 2.3-1 2.3-2.4V3h2.5z"/></svg></a>' +
          '<a href="https://share.google/Ax6dsZ9I2FYFrS2nc" target="_blank" rel="noopener" aria-label="Google"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6C4.7 19.8 8.1 22 12 22z"/><path d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.5H3.1C2.4 8.8 2 10.3 2 12s.4 3.2 1.1 4.5l3.3-2.6z"/><path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 3.1 14.7 2 12 2 8.1 2 4.7 4.2 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6z"/></svg></a>' +
        '</div>' +
      '</div>' +
    '</footer>';
  }

  /* ---------- i18n apply ---------- */
  function applyLang(lang) {
    STRATEX.lang = lang;
    try { localStorage.setItem('stratex-lang', lang); } catch (e) {}
    document.documentElement.lang = lang;
    var dict = window.STRATEX_I18N || {};
    document.querySelectorAll('[data-i18n],[data-i18n-html]').forEach(function (el) {
      var html = el.getAttribute('data-i18n-html');
      var key = html || el.getAttribute('data-i18n');
      var e = dict[key];
      if (!e) return;
      var val = e[lang] != null ? e[lang] : e.fr;
      if (html) el.innerHTML = val;
      else el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var e = dict[el.getAttribute('data-i18n-ph')];
      if (e) el.setAttribute('placeholder', e[lang] != null ? e[lang] : e.fr);
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('is-on', b.getAttribute('data-lang') === lang);
    });
  }

  /* ---------- Interactions ---------- */
  function wireInteractions() {
    var header = document.getElementById('siteHeader');
    var onScroll = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

    var burger = document.getElementById('hamburger');
    if (burger) burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('#mobileNav a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    });

    document.addEventListener('click', function (ev) {
      var b = ev.target.closest('.lang button');
      if (b) applyLang(b.getAttribute('data-lang'));
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // auto eyebrow hex bullets
    document.querySelectorAll('.eyebrow').forEach(function (e) {
      if (!e.querySelector('svg')) e.insertAdjacentHTML('afterbegin', hexIcon(e.getAttribute('data-hex') || 'var(--blue)'));
    });

    // Robustness: reveal anything already in view, and a safety net if IO is inert
    function revealInView() {
      var vh = window.innerHeight || 800;
      document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('in');
      });
    }
    revealInView();
    window.addEventListener('scroll', revealInView, { passive: true });
    window.addEventListener('load', revealInView);

    // count-up stats
    function countUp(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return;
      var dur = 1100, t0 = null, done = false;
      function finish() { if (!done) { done = true; el.textContent = target; } }
      function step(t) { if (t0 == null) t0 = t; var p = Math.min((t - t0) / dur, 1); el.textContent = Math.round(p * target); if (p < 1) requestAnimationFrame(step); else finish(); }
      requestAnimationFrame(step);
      setTimeout(finish, dur + 400); // safety for throttled rAF
    }
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Public API ---------- */
  window.STRATEX = {
    lang: 'fr',
    logoMark: logoMark,
    hexIcon: hexIcon,
    honeycomb: honeycomb,
    heroComposition: heroComposition,
    tint: tint,
    shade: shadeHex,
    accentText: accentText,
    onColor: onColor,
    isLight: isLight,
    filBySlug: filBySlug,
    arrow: ARR,
    ic: ic,
    filiales: FILIALES,
    t: t,
    filCard: function (f, base) {
      base = base || '';
      var pk = { blue: 'pole.blue.name', green: 'pole.green.name', orange: 'pole.orange.name' };
      return '<a class="fil-card reveal" href="' + base + 'filiales/' + f.slug + '.html" style="--c:' + f.color + ';--ct:' + accentText(f.color) + ';--wash:' + tint(f.color, 0.86) + '">' +
        '<div class="fil-card__hex hex-tile" style="background:' + f.color + '">' + hexIcon(onColor(f.color)) + '</div>' +
        '<div><div class="fil-card__name">' + f.name + '</div>' +
        '<div class="fil-card__sector" data-i18n="sector.' + f.slug + '">' + t('sector.' + f.slug) + '</div></div>' +
        '<span class="fil-card__pole"><span class="dot"></span><span data-i18n="' + pk[f.pole] + '">' + t(pk[f.pole]) + '</span></span>' +
        '</a>';
    },
    mount: function (opts) {
      opts = opts || {};
      var base = opts.base || '';
      try { STRATEX.lang = localStorage.getItem('stratex-lang') || 'fr'; } catch (e) {}
      var h = document.getElementById('header-slot');
      if (h) h.outerHTML = buildHeader(opts.active, base);
      var f = document.getElementById('footer-slot');
      if (f) f.outerHTML = buildFooter(base);
      applyLang(STRATEX.lang);
      wireInteractions();
    }
  };
})();
