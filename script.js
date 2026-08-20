const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

// Desktop-only visual refinement: center the full execution flow in the page
// without changing the swipeable mobile/tablet behavior.
const desktopFlowStyle = document.createElement('style');
desktopFlowStyle.textContent = `
  @media (min-width: 981px) {
    .execution-flow {
      justify-content: center;
      width: 100%;
    }
  }
`;
document.head.appendChild(desktopFlowStyle);

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
