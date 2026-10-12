const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const revealNodes = document.querySelectorAll('.news-card, .contact__info, .contact__form');
revealNodes.forEach((node) => node.classList.add('reveal'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
revealNodes.forEach((node) => observer.observe(node));

const divisionStates = [
  { image: './assets/company-auto.png', subtitle: 'В продуктовых и розничных направлениях применяется гибкая модель: часть решений сохраняет связь с Ular, а часть развивается как самостоятельные бренды.' },
  { image: './assets/company-logostic.png', subtitle: 'Логистическое направление объединяет маршруты, инфраструктуру и команды, которые обеспечивают движение товаров между предприятиями и рынками.' },
  { image: './assets/company-tech.png', subtitle: 'Технологическое направление разрабатывает цифровые решения для производства, управления и взаимодействия компаний группы.' },
  { image: './assets/company-recycling.png', subtitle: 'Направление переработки исследует способы повторного использования материалов и помогает снижать потери ресурсов.' },
  { image: './assets/company-construction.png', subtitle: 'Строительное направление соединяет инженерные компетенции и опыт реализации объектов для развития инфраструктуры.' },
  { image: './assets/company-retail.png', subtitle: 'Розничное направление представляет продукты группы покупателям через разные бренды, форматы и каналы продаж.' },
  { image: './assets/company-agro.png', subtitle: 'Агронаправление работает с производством, хранением и доставкой сельскохозяйственной продукции.' }
];
const divisionButtons = [...document.querySelectorAll('[data-division]')];
const divisionBackgrounds = [document.querySelector('[data-division-bg-a]'), document.querySelector('[data-division-bg-b]')];
const divisionDetails = document.querySelector('.divisions__details');
let activeDivision = 1;
let activeDivisionBackground = 0;

function setDivision(index) {
  if (index === activeDivision || !divisionStates[index]) return;
  activeDivision = index;
  divisionDetails.querySelector('p').textContent = divisionStates[index].subtitle;
  divisionButtons.forEach((button, buttonIndex) => {
    const selected = buttonIndex === index;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  const nextIndex = 1 - activeDivisionBackground;
  const nextBackground = divisionBackgrounds[nextIndex];
  const currentBackground = divisionBackgrounds[activeDivisionBackground];
  nextBackground.src = divisionStates[index].image;
  nextBackground.classList.add('is-active');
  currentBackground.classList.remove('is-active');
  activeDivisionBackground = nextIndex;
  divisionDetails?.classList.remove('is-changing');
  void divisionDetails?.offsetWidth;
  divisionDetails?.classList.add('is-changing');
}

divisionButtons.forEach((button) => {
  const index = Number(button.dataset.division);
  button.addEventListener('mouseenter', () => setDivision(index));
  button.addEventListener('focus', () => setDivision(index));
  button.addEventListener('click', () => setDivision(index));
});
divisionStates.forEach(({ image }) => { const preload = new Image(); preload.src = image; });


document.querySelector('.contact__form')?.addEventListener('submit', (event) => event.preventDefault());

// Complete tab semantics while preserving v2 hover, focus and click switching.
divisionButtons.forEach((button, index) => {
  button.id = `division-tab-${index}`;
  button.setAttribute('aria-controls', 'division-panel');
  button.setAttribute('aria-selected', String(index === activeDivision));
  button.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % divisionButtons.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + divisionButtons.length - 1) % divisionButtons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = divisionButtons.length - 1;
    if (next !== undefined) { event.preventDefault(); divisionButtons[next].focus(); }
  });
});
divisionDetails.id = 'division-panel';
