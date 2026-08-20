const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

// Desktop-only visual refinement: center the full execution flow in the page
// without changing the swipeable mobile/tablet behavior.
const siteStyle = document.createElement('style');
siteStyle.textContent = `
  @media (min-width: 981px) {
    .execution-flow {
      justify-content: center;
      width: 100%;
    }
  }

  .legal-footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
  }

  .legal-footer-links a {
    color: inherit;
    font-weight: 700;
  }

  .cookie-notice {
    position: fixed;
    z-index: 5000;
    left: 16px;
    right: 16px;
    bottom: 16px;
    max-width: 760px;
    margin: 0 auto;
    padding: 18px 20px;
    background: #141E23;
    color: #fff;
    border: 1px solid rgba(255,255,255,.14);
    box-shadow: 0 20px 55px rgba(0,0,0,.28);
    display: none;
    gap: 18px;
    align-items: center;
    justify-content: space-between;
  }

  .cookie-notice.is-visible { display: flex; }
  .cookie-notice__copy { min-width: 0; }
  .cookie-notice__copy strong { display: block; margin-bottom: 5px; font-size: 14px; }
  .cookie-notice__copy p { margin: 0; color: rgba(255,255,255,.72); font-size: 12px; line-height: 1.55; }
  .cookie-notice__copy a { color: #fff; text-decoration: underline; text-underline-offset: 3px; font-weight: 700; }
  .cookie-notice__button {
    flex: 0 0 auto;
    border: 0;
    border-radius: 25px;
    background: #E80000;
    color: #fff;
    min-height: 44px;
    padding: 0 18px;
    font: inherit;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .cookie-notice {
      align-items: stretch;
      flex-direction: column;
      padding: 17px;
    }
    .cookie-notice__button { width: 100%; }
  }
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

document.getElementById('contactForm')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  const original = button.textContent;
  button.textContent = 'Merci — demande enregistrée';
  button.disabled = true;
  setTimeout(() => {
    button.textContent = original;
    button.disabled = false;
    event.currentTarget.reset();
  }, 2600);
});

// Add legal navigation without disturbing the existing footer composition.
const footerRight = document.querySelector('.footer-right');
if (footerRight) {
  const legalLinks = document.createElement('div');
  legalLinks.className = 'legal-footer-links';
  legalLinks.innerHTML = `
    <a href="mentions-legales.html">Mentions légales</a>
    <a href="politique-cookies.html">Cookies & confidentialité</a>
  `;
  footerRight.prepend(legalLinks);
}

// Privacy-friendly notice: the current site does not install analytics or advertising cookies.
// localStorage is used only to remember that the visitor has read this information.
const COOKIE_NOTICE_KEY = 'gs_cookie_notice_seen_v1';
const notice = document.createElement('aside');
notice.className = 'cookie-notice';
notice.setAttribute('role', 'dialog');
notice.setAttribute('aria-label', 'Information sur les cookies');
notice.innerHTML = `
  <div class="cookie-notice__copy">
    <strong>Respect de votre vie privée</strong>
    <p>Ce site n’utilise actuellement aucun cookie publicitaire ni outil de mesure d’audience. Un stockage local sert uniquement à mémoriser votre choix. <a href="politique-cookies.html">En savoir plus</a>.</p>
  </div>
  <button class="cookie-notice__button" type="button">J’ai compris</button>
`;
document.body.appendChild(notice);

try {
  if (!localStorage.getItem(COOKIE_NOTICE_KEY)) {
    requestAnimationFrame(() => notice.classList.add('is-visible'));
  }
} catch (error) {
  notice.classList.add('is-visible');
}

notice.querySelector('.cookie-notice__button')?.addEventListener('click', () => {
  try { localStorage.setItem(COOKIE_NOTICE_KEY, '1'); } catch (error) {}
  notice.classList.remove('is-visible');
});
