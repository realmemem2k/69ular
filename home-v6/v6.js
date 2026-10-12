const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const narrowLayout = window.matchMedia('(max-width: 1000px)');

const revealNodes = document.querySelectorAll('.news-card, .contact__info, .contact__form');
if (!reducedMotion.matches) {
  revealNodes.forEach((node) => node.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
  revealNodes.forEach((node) => revealObserver.observe(node));
}

const about = document.querySelector('.about');
const story = document.querySelector('.story');
const cards = [...document.querySelectorAll('.story-card')];
const growth = document.querySelector('.growth');
const growthStage = document.querySelector('.growth__stage');
const growthStats = document.querySelector('[data-growth-stats]');
const growthBars = [...document.querySelectorAll('.growth__bars i')];

const structureFlow = document.querySelector('.structure-flow');
const structureStage = document.querySelector('.structure-flow__stage');
const treePanel = document.querySelector('[data-tree-panel]');
const companiesPanel = document.querySelector('[data-companies-panel]');
const storyLabel = document.querySelector('[data-story-label]');
const storySubtitle = document.querySelector('[data-story-subtitle]');
const storyCompanies = document.querySelector('[data-story-companies]');
const storyProgress = document.querySelector('[data-story-progress]');
const storyBackgrounds = [document.querySelector('[data-story-bg-a]'), document.querySelector('[data-story-bg-b]')];

const directionStates = [
  { label: 'Auto', image: './assets/company-auto.png', companies: 2, subtitle: 'В продуктовых и розничных направлениях применяется гибкая модель: часть решений сохраняет связь с Ular, а часть развивается как самостоятельные бренды.' },
  { label: 'Logistics', image: './assets/company-logostic.png', companies: 2, subtitle: 'Логистическое направление объединяет маршруты, инфраструктуру и команды, которые обеспечивают движение товаров между предприятиями и рынками.' },
  { label: 'Tech', image: './assets/company-tech.png', companies: 1, subtitle: 'Технологическое направление разрабатывает цифровые решения для производства, управления и взаимодействия компаний группы.' },
  { label: 'Recycling', image: './assets/company-recycling.png', companies: 2, subtitle: 'Направление переработки исследует способы повторного использования материалов и помогает снижать потери ресурсов.' },
  { label: 'Construction', image: './assets/company-construction.png', companies: 1, subtitle: 'Строительное направление соединяет инженерные компетенции и опыт реализации объектов для развития инфраструктуры.' },
  { label: 'Retail', image: './assets/company-retail.png', companies: 3, subtitle: 'Розничное направление представляет продукты группы покупателям через разные бренды, форматы и каналы продаж.' },
  { label: 'Agro', image: './assets/company-agro.png', companies: 3, subtitle: 'Агронаправление работает с производством, хранением и доставкой сельскохозяйственной продукции.' }
];

const companyMarkup = () => `
  <article class="brand-story__company">
    <div><b>Компания</b><img src="./assets/company-external-figma.svg" alt="" /></div>
    <p>В продуктовых и розничных направлениях</p>
  </article>`;

let directionIndex = 0;
let activeBackground = 0;

function restartTransition(stage) {
  if (reducedMotion.matches) return;
  stage.classList.remove('is-changing');
  void stage.offsetWidth;
  stage.classList.add('is-changing');
}

function setDirection(index) {
  if (index === directionIndex || !directionStates[index]) return;
  const state = directionStates[index];
  const nextBackground = 1 - activeBackground;
  storyBackgrounds[nextBackground].src = state.image;
  storyBackgrounds[nextBackground].classList.add('is-active');
  storyBackgrounds[activeBackground].classList.remove('is-active');
  activeBackground = nextBackground;
  directionIndex = index;
  storyLabel.textContent = state.label;
  storySubtitle.textContent = state.subtitle;
  storyCompanies.innerHTML = Array.from({ length: state.companies }, companyMarkup).join('');
  storyProgress.style.transform = `scaleX(${(index + 1) / directionStates.length})`;
  restartTransition(companiesPanel);
}

document.querySelectorAll('[data-tree-direction]').forEach((button) => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.treeDirection);
    if (reducedMotion.matches) {
      setDirection(index);
      companiesPanel.scrollIntoView({ behavior: 'auto' });
      return;
    }
    const travel = Math.max(0, structureFlow.offsetHeight - structureStage.offsetHeight);
    const start = structureFlow.getBoundingClientRect().top + window.scrollY;
    const progress = 0.18 + (index + 0.5) / directionStates.length * 0.82;
    window.scrollTo({ top: start + travel * progress, behavior: 'smooth' });
  });
});

const locations = document.querySelector('.locations');
const locationsStage = document.querySelector('.locations__stage');
const mapTitle = document.querySelector('[data-map-title]');
const mapMetric = document.querySelector('[data-map-metric]');
const mapDescription = document.querySelector('[data-map-description]');
const mapOffice = document.querySelector('[data-map-office]');
const mapLayers = [document.querySelector('[data-map-layer-a]'), document.querySelector('[data-map-layer-b]')];

const mapStates = [
  { title: 'Распределение', metric: '6 Регионов', description: 'Мы непрерывно растем и включаем в работу все больше регионов', image: './assets/map-regions.png', office: false },
  { title: 'Наш рост', metric: '30+ компаний', description: 'Мы непрерывно растем и включаем в работу все больше регионов', image: './assets/map-growth.png', office: true },
  { title: 'Наши перспективы', metric: '30% больше', description: 'В ближайшие 5 лет планируем расширение минимум на 30 процентов', image: './assets/map-future.png', office: false }
];
let mapStateIndex = 0;
let activeMapLayer = 0;

function setMapState(index) {
  if (index === mapStateIndex || !mapStates[index]) return;
  const state = mapStates[index];
  const nextLayer = 1 - activeMapLayer;
  mapLayers[nextLayer].src = state.image;
  mapLayers[nextLayer].classList.add('is-active');
  mapLayers[activeMapLayer].classList.remove('is-active');
  activeMapLayer = nextLayer;
  mapStateIndex = index;
  mapTitle.textContent = state.title;
  mapMetric.textContent = state.metric;
  mapDescription.textContent = state.description;
  mapOffice.hidden = !state.office;
  restartTransition(locationsStage);
}

function sectionProgress(section, stageHeight = window.innerHeight) {
  return clamp(-section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - stageHeight));
}

let aboutProgress = 0;
let growthProgress = 0;
let frame = 0;
const visibleScenes = new Set();

function hasActiveScene() {
  return (visibleScenes.has(about) && !narrowLayout.matches && !reducedMotion.matches)
    || (visibleScenes.has(growth) && !reducedMotion.matches)
    || visibleScenes.has(structureFlow)
    || visibleScenes.has(locations);
}

function renderScenes() {
  frame = 0;

  if (visibleScenes.has(about) && !narrowLayout.matches && !reducedMotion.matches) {
    const target = sectionProgress(about);
    aboutProgress += (target - aboutProgress) * 0.18;
    if (Math.abs(target - aboutProgress) < 0.0005) aboutProgress = target;
    const shift = Math.max(0, story.scrollHeight - window.innerHeight + 112);
    story.style.transform = `translate3d(0, ${-aboutProgress * shift}px, 0)`;
    cards.forEach((card, index) => {
      const local = clamp(aboutProgress * cards.length - index + 0.8);
      card.style.opacity = String(0.68 + local * 0.32);
      card.style.transform = `scale(${0.986 + local * 0.014})`;
    });
  }

  if (visibleScenes.has(growth) && !reducedMotion.matches) {
    const target = sectionProgress(growth, growthStage.offsetHeight);
    growthProgress += (target - growthProgress) * 0.14;
    if (Math.abs(target - growthProgress) < 0.0005) growthProgress = target;
    const startY = growthStage.offsetHeight * 0.58;
    const endY = growthStage.offsetHeight * -0.46;
    growthStats.style.transform = `translate3d(0, ${startY + (endY - startY) * growthProgress}px, 0)`;
    growthBars.forEach((bar, index) => {
      const barProgress = index === 0 ? 1 : clamp((growthProgress - (index - 1) * 0.12) / 0.36);
      bar.style.transform = `translate3d(0, ${(1 - barProgress) * 100}%, 0)`;
    });
  }

  if (visibleScenes.has(structureFlow)) {
    const progress = sectionProgress(structureFlow, structureStage.offsetHeight);
    const transition = reducedMotion.matches ? 1 : clamp((progress - 0.10) / 0.08);
    structureStage.style.setProperty('--tree-opacity', String(1 - transition));
    structureStage.style.setProperty('--companies-opacity', String(transition));
    structureStage.style.setProperty('--tree-events', transition < 0.5 ? 'auto' : 'none');
    structureStage.style.setProperty('--companies-events', transition >= 0.5 ? 'auto' : 'none');
    if (!reducedMotion.matches) {
      const companyProgress = clamp((progress - 0.18) / 0.82);
      const index = Math.min(directionStates.length - 1, Math.floor(companyProgress * directionStates.length));
      setDirection(index);
    }
  }

  if (visibleScenes.has(locations)) {
    const index = Math.min(mapStates.length - 1, Math.floor(sectionProgress(locations) * mapStates.length));
    setMapState(index);
  }

  if (hasActiveScene()) frame = requestAnimationFrame(renderScenes);
}

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) visibleScenes.add(entry.target);
    else visibleScenes.delete(entry.target);
  });
  if (hasActiveScene() && !frame) frame = requestAnimationFrame(renderScenes);
}, { threshold: 0 });
[about, growth, structureFlow, locations].forEach((section) => sceneObserver.observe(section));

function resetLayout() {
  if (narrowLayout.matches || reducedMotion.matches) {
    story.style.removeProperty('transform');
    cards.forEach((card) => { card.style.removeProperty('opacity'); card.style.removeProperty('transform'); });
  }
  if (reducedMotion.matches) {
    growthStats.style.removeProperty('transform');
    growthBars.forEach((bar) => bar.style.removeProperty('transform'));
  }
  if (hasActiveScene() && !frame) frame = requestAnimationFrame(renderScenes);
}
window.addEventListener('resize', resetLayout);
narrowLayout.addEventListener?.('change', resetLayout);
reducedMotion.addEventListener?.('change', resetLayout);

directionStates.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
mapStates.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
storyCompanies.innerHTML = Array.from({ length: directionStates[0].companies }, companyMarkup).join('');
storyProgress.style.transform = `scaleX(${1 / directionStates.length})`;
resetLayout();
document.querySelector('.contact__form')?.addEventListener('submit', (event) => event.preventDefault());
