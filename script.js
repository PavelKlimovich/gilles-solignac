const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

// Make the editorial voice personal: the visitor should feel that Gilles is speaking.
const copyReplacements = [
  ['Pourquoi Gilles ?', 'Qui suis-je ?'],
  ['Pourquoi Gilles', 'Qui suis-je ?'],
  ['Gilles d’abord.', 'Je m’implique personnellement.'],
  ['Gilles apporte l’expérience, le terrain, la proximité, la méthode, l’exécution, le management et le pilotage.', 'J’apporte mon expérience, ma présence sur le terrain, ma proximité, ma méthode, l’exécution, le management et le pilotage.'],
  ['Les preuves disponibles aujourd’hui sont l’expérience de Gilles, son parcours de Direction Commerciale, sa présence terrain et son rattachement à un réseau national.', 'Mes preuves aujourd’hui reposent sur mon expérience, mon parcours en Direction Commerciale, ma présence sur le terrain et mon appartenance à un réseau national.'],
  ['Gilles intervient à Tours, Joué-lès-Tours et plus largement en Indre-et-Loire.', 'J’interviens à Tours, Joué-lès-Tours et plus largement en Indre-et-Loire.'],
  ['Son ancrage local nourrit sa connaissance des entreprises, des dirigeants et des réalités commerciales du territoire.', 'Mon ancrage local nourrit ma connaissance des entreprises, des dirigeants et des réalités commerciales du territoire.'],
  ['Voir la fiche officielle de Gilles', 'Voir ma fiche officielle'],
  ['Voir le profil LinkedIn de Gilles', 'Me retrouver sur LinkedIn']
];

document.querySelectorAll('.nav a').forEach(link => {
  if (['Pourquoi Gilles', 'Qui je suis'].includes(link.textContent.trim())) link.textContent = 'Qui suis-je ?';
});

// Remove the internal editorial note from the public site.
document.querySelector('.verification-note')?.remove();

const editorialRoot = document.querySelector('main');
if (editorialRoot) {
  const walker = document.createTreeWalker(editorialRoot, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    let value = node.nodeValue;
    copyReplacements.forEach(([from, to]) => {
      value = value.split(from).join(to);
    });
    node.nodeValue = value;
  });
}

const siteStyle = document.createElement('style');
siteStyle.textContent = `
  @media (min-width: 981px) {
    .execution-flow { justify-content: center; width: 100%; }
  }
  .linkedin-button { background: #0A66C2 !important; border-color: #0A66C2 !important; color: #fff !important; }
  .linkedin-button:hover, .linkedin-button:focus-visible { background: #004182 !important; border-color: #004182 !important; color: #fff !important; }
  .legal-footer-links { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; }
  .legal-footer-links a { color: inherit; font-weight: 700; }
  .cookie-notice { position: fixed; z-index: 5000; left: 16px; right: 16px; bottom: 16px; max-width: 760px; margin: 0 auto; padding: 18px 20px; background: #141E23; color: #fff; border: 1px solid rgba(255,255,255,.14); box-shadow: 0 20px 55px rgba(0,0,0,.28); display: none; gap: 18px; align-items: center; justify-content: space-between; }
  .cookie-notice.is-visible { display: flex; }
  .cookie-notice__copy { min-width: 0; }
  .cookie-notice__copy strong { display: block; margin-bottom: 5px; font-size: 14px; }
  .cookie-notice__copy p { margin: 0; color: rgba(255,255,255,.72); font-size: 12px; line-height: 1.55; }
  .cookie-notice__copy a { color: #fff; text-decoration: underline; text-underline-offset: 3px; font-weight: 700; }
  .cookie-notice__button { flex: 0 0 auto; border: 0; border-radius: 25px; background: #E80000; color: #fff; min-height: 44px; padding: 0 18px; font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; }
  @media (max-width: 640px) { .cookie-notice { align-items: stretch; flex-direction: column; padding: 17px; } .cookie-notice__button { width: 100%; } }
`;
document.head.appendChild(siteStyle);

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? '✕' : '☰';
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = '☰';
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const footerRight = document.querySelector('.footer-right');
if (footerRight) {
  const legalLinks = document.createElement('div');
  legalLinks.className = 'legal-footer-links';
  legalLinks.innerHTML = `<a href="mentions-legales.html">Mentions légales</a><a href="politique-cookies.html">Cookies & confidentialité</a>`;
  footerRight.prepend(legalLinks);
}

const COOKIE_NOTICE_KEY = 'gs_cookie_notice_seen_v1';
const notice = document.createElement('aside');
notice.className = 'cookie-notice';
notice.setAttribute('role', 'dialog');
notice.setAttribute('aria-label', 'Information sur les cookies');
notice.innerHTML = `<div class="cookie-notice__copy"><strong>Respect de votre vie privée</strong><p>Ce site n’utilise actuellement aucun cookie publicitaire ni outil de mesure d’audience. Un stockage local sert uniquement à mémoriser votre choix. <a href="politique-cookies.html">En savoir plus</a>.</p></div><button class="cookie-notice__button" type="button">J’ai compris</button>`;
document.body.appendChild(notice);

try {
  if (!localStorage.getItem(COOKIE_NOTICE_KEY)) requestAnimationFrame(() => notice.classList.add('is-visible'));
} catch (error) { notice.classList.add('is-visible'); }

notice.querySelector('.cookie-notice__button')?.addEventListener('click', () => {
  try { localStorage.setItem(COOKIE_NOTICE_KEY, '1'); } catch (error) {}
  notice.classList.remove('is-visible');
});
