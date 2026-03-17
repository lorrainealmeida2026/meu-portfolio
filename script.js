'use strict';

/* ══ CONSTANTS ══ */
var CONTACT_EMAIL = ['lorraine','.a.a','@icloud','.com'].join('');

var BACK_MAP = {
  pageProjects: 'pageHome',
  pageAbout:    'pageHome',
  pageContact:  'pageHome',
  pageStack:    'pageAbout',
  pageForlex:   'pageProjects',
  pageAvivah:   'pageProjects',
  pagePortal:   'pageProjects',
  pageBora:     'pageProjects'
};

/* ══ PAGE NAVIGATION ══ */
var currentPage = 'pageHome';
function goTo(id) {
  if (!id || id === currentPage) return;
  var from = document.getElementById(currentPage);
  var to   = document.getElementById(id);
  if (!to) return;
  from.classList.remove('active');
  to.classList.add('active');
  currentPage = id;
  to.querySelectorAll('.scroll-area').forEach(function(el) { el.scrollTop = 0; });
  if (id === 'pageAbout') setTimeout(animateSkillBars, 300);
}

/* ── HOME + CARD NAVIGATION via data attribute ── */
document.addEventListener('click', function(e) {
  var target = e.target.closest('[data-goto]');
  if (target) { goTo(target.getAttribute('data-goto')); return; }
  // close lang dropdowns on outside click
  document.querySelectorAll('.lang-wrap.open').forEach(function(w) { w.classList.remove('open'); });
});

/* ── PROJECT CARDS: keyboard support ── */
document.querySelectorAll('.project-card').forEach(function(card) {
  card.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});

/* ── CASE STUDY SLIDERS ── */
var NEXT_PROJECT = {
  forlex: { page: 'pageAvivah',   label: 'Avivah' },
  avivah: { page: 'pagePortal',   label: 'Portal do Beneficiário' },
  portal: { page: 'pageBora',     label: 'Bora' },
  bora:   { page: 'pageForlex', label: 'Forlex' }
};
var PREV_PROJECT = {
  forlex: { page: 'pageBora',   label: 'Bora' },
  avivah: { page: 'pageForlex', label: 'Forlex' },
  portal: { page: 'pageAvivah', label: 'Avivah' },
  bora:   { page: 'pagePortal', label: 'Portal do Beneficiário' }
};
var SVG_PREV = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3L5 8l5 5"/></svg>';
var SVG_NEXT = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg>';

function initSlider(prefix) {
  var track       = document.getElementById(prefix + 'Track');
  if (!track) return;
  var dotsEl      = document.getElementById(prefix + 'Dots');
  var arrowPrev   = document.getElementById(prefix + 'Prev');
  var arrowNext   = document.getElementById(prefix + 'Next');
  var ctrlPrev    = document.getElementById(prefix + 'CtrlPrev');
  var ctrlNext    = document.getElementById(prefix + 'CtrlNext');
  var counter     = document.getElementById(prefix + 'Counter');
  var total       = track.children.length;
  var idx         = 0;
  var np          = NEXT_PROJECT[prefix];
  var pp          = PREV_PROJECT[prefix];

  function go(n) {
    idx = Math.max(0, Math.min(total - 1, n));
    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
    if (dotsEl) dotsEl.querySelectorAll('.cs-dot').forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    if (counter) counter.textContent = (idx + 1) + ' / ' + total;
    if (arrowPrev) arrowPrev.disabled = (idx === 0);
    if (arrowNext) arrowNext.disabled = (idx === total - 1);
  }

  /* Setas laterais — navegam slides, no primeiro slide sem projeto anterior fica desabilitado */
  if (arrowPrev) arrowPrev.addEventListener('click', function() {
    if (idx === 0 && pp) goTo(pp.page); else go(idx - 1);
  });
  if (arrowNext) arrowNext.addEventListener('click', function() {
    go(idx + 1);
  });

  /* Botões do rodapé — SEMPRE navegam para o projeto, nunca passam slides */
  if (ctrlPrev && pp) {
    ctrlPrev.style.visibility = 'visible';
    ctrlPrev.innerHTML = SVG_PREV + '<span>' + pp.label + '</span>';
    ctrlPrev.addEventListener('click', function() { goTo(pp.page); });
  }
  if (ctrlNext) {
    ctrlNext.innerHTML = '<span>' + np.label + '</span>' + SVG_NEXT;
    ctrlNext.addEventListener('click', function() { goTo(np.page); });
  }

  if (dotsEl) dotsEl.querySelectorAll('.cs-dot').forEach(function(d) {
    d.addEventListener('click', function() { go(parseInt(d.getAttribute('data-idx'))); });
  });

  var sx = 0;
  track.addEventListener('touchstart', function(e) { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   function(e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) {
      if (dx < 0) go(idx + 1);
      else { if (idx === 0 && pp) goTo(pp.page); else go(idx - 1); }
    }
  }, { passive: true });

  go(0);
}
['forlex','avivah','portal','bora'].forEach(initSlider);

/* ── SKILL BARS ── */
function animateSkillBars() {
  document.querySelectorAll('.cv-skill-fill').forEach(function(bar) {
    bar.style.width = (bar.getAttribute('data-w') || 0) + '%';
  });
}

/* ── LANGUAGE ── */
var T = {
  pt: { welcome:'Boas vindas ao meu portfólio', subtitle:'Desenvolvo soluções digitais conectando necessidades dos usuários, estratégia de negócios e tecnologia com IA.', projects:'Projetos', about:'Sobre mim', contact:'Contato', contact_eyebrow:'Vamos trabalhar juntos?' },
  es: { welcome:'Bienvenida a mi portafolio', subtitle:'Desarrollo soluciones digitales conectando necesidades de usuarios, estrategia de negocio y tecnología con IA.', projects:'Proyectos', about:'Sobre mí', contact:'Contacto', contact_eyebrow:'¿Trabajamos juntos?' }
};
function applyLang(lang) {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'es';
  var t = T[lang];
  document.querySelectorAll('[data-i18n]').forEach(function(el) { var k = el.getAttribute('data-i18n'); if (t[k]) el.textContent = t[k]; });
  document.querySelectorAll('.lang-option').forEach(function(opt) { opt.classList.toggle('active', opt.getAttribute('data-lang') === lang); });
}
document.querySelectorAll('.lang-wrap').forEach(function(wrap) {
  wrap.querySelector('.lang-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelectorAll('.lang-wrap').forEach(function(w) { if (w !== wrap) w.classList.remove('open'); });
    wrap.classList.toggle('open');
  });
  wrap.querySelectorAll('.lang-option').forEach(function(opt) {
    opt.addEventListener('click', function(e) { e.stopPropagation(); applyLang(opt.getAttribute('data-lang')); wrap.classList.remove('open'); });
  });
});

/* ── FIGMA CURSOR LABEL ── */
(function() {
  var el = document.getElementById('figmaCursor');
  if (!el) return;
  document.addEventListener('mousemove', function(e) {
    el.style.transform = 'translate(' + (e.clientX + 14) + 'px,' + (e.clientY - 2) + 'px)';
  }, { passive: true });
})();

/* ── EMAIL BUTTONS ── */
['contactEmailBtn','aboutEmailBtn'].forEach(function(id) {
  var el = document.getElementById(id);
  if (el) el.href = 'mailto:' + CONTACT_EMAIL;
});

/* ── CONTACT FORM — mailto ── */
function handleContactSubmit(e) {
  e.preventDefault();
  var name    = document.getElementById('cName').value    || '';
  var email   = document.getElementById('cEmail').value   || '';
  var subject = document.getElementById('cSubject').value || 'Contato pelo portfólio';
  var msg     = document.getElementById('cMsg').value     || '';
  var body    = 'Olá Lorraine,\n\n' + msg + '\n\n---\nNome: ' + name + '\nE-mail: ' + email;
  window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  var btn = document.getElementById('contactSubmitBtn');
  if (btn) {
    btn.textContent = 'Abrindo seu e-mail... ✓';
    btn.classList.add('sent');
    setTimeout(function() { btn.textContent = 'Enviar mensagem →'; btn.classList.remove('sent'); }, 3000);
  }
}

/* ── ESCAPE + ARROW KEYS ── */
var SLIDER_PAGES = { pageForlex:'forlex', pageAvivah:'avivah', pagePortal:'portal', pageBora:'bora' };
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && BACK_MAP[currentPage]) { goTo(BACK_MAP[currentPage]); return; }
  var prefix = SLIDER_PAGES[currentPage];
  if (!prefix) return;
  if (e.key === 'ArrowRight') { var btn = document.getElementById(prefix + 'Next'); if (btn) btn.click(); }
  if (e.key === 'ArrowLeft')  { var btn = document.getElementById(prefix + 'Prev'); if (btn && !btn.disabled) btn.click(); }
});
/* ── LIGHTBOX ── */
(function() {
  var overlay = document.getElementById('lbOverlay');
  var lbImg   = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');

  function openLb(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
  }
  function closeLb() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
    setTimeout(function(){ lbImg.src = ''; }, 250);
  }

  document.addEventListener('click', function(e) {
    var thumb = e.target.closest('.cs-img-thumb');
    if (thumb) { openLb(thumb.getAttribute('data-src'), thumb.querySelector('img').alt); return; }
    if (e.target === overlay || e.target === lbClose) closeLb();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeLb();
  });

  // Hover preview — show on mouseenter, keep open on click
  document.querySelectorAll('.cs-img-thumb').forEach(function(thumb) {
    thumb.addEventListener('mouseenter', function() {
      thumb.querySelector('.cs-img-thumb-label').textContent = '🔍 Clique para ampliar';
    });
    thumb.addEventListener('mouseleave', function() {
      thumb.querySelector('.cs-img-thumb-label').textContent = '🔍 Ver imagem';
    });
  });
})();