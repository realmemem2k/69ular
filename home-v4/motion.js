const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobileLayout = window.matchMedia('(max-width: 1000px)');

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

const brandStory = document.querySelector('.brand-story');
const storyStage = document.querySelector('.brand-story__stage');
const storyLabel = document.querySelector('[data-story-label]');
const storySubtitle = document.querySelector('[data-story-subtitle]');
const storyCompanies = document.querySelector('[data-story-companies]');
const storyProgress = document.querySelector('[data-story-progress]');
const storyBackgrounds = [document.querySelector('[data-story-bg-a]'), document.querySelector('[data-story-bg-b]')];

const brandStoryStates = [
  { label: 'Auto', image: './assets/block3-auto.png', companies: 3, subtitle: 'Автомобильное направление объединяет проекты, связанные с транспортом, сервисом и развитием мобильности.' },
  { label: 'Logostic', image: './assets/block3-logostic.png', companies: 2, subtitle: 'Логистика связывает производственные площадки, маршруты поставок и партнёров в единую систему.' },
  { label: 'Tech', image: './assets/worker.png', companies: 1, subtitle: 'Технологическое направление создаёт цифровые инструменты для производственных и управленческих процессов группы.' },
  { label: 'Agro', image: './assets/block3-agro.png', companies: 3, subtitle: 'Агронаправление развивает проекты по производству, хранению и доставке сельскохозяйственной продукции.' },
  { label: 'Recycling', image: './assets/logistics-card.png', companies: 2, subtitle: 'Переработка помогает эффективнее использовать сырьё и возвращать материалы в производственный цикл.' },
  { label: 'Retail', image: './assets/transport.png', companies: 3, subtitle: 'Розничное направление соединяет продукты группы с покупателями через сеть брендов и торговых точек.' },
  { label: 'Construction', image: './assets/industry.png', companies: 1, subtitle: 'Строительное направление объединяет инженерные компетенции для развития объектов и инфраструктуры.' }
];

const companyMarkup = () => `
  <article class="brand-story__company">
    <div><b>Компания</b><img src="./assets/external-link.svg" alt="" /></div>
    <p>В продуктовых и розничных направлениях</p>
  </article>`;

let brandStoryIndex = 0;
let activeBackground = 0;

function restartTransition(stage) {
  if (reducedMotion.matches) return;
  stage.classList.remove('is-changing');
  void stage.offsetWidth;
  stage.classList.add('is-changing');
}

function setBrandStoryState(index) {
  if (index === brandStoryIndex || !storyStage) return;
  const state = brandStoryStates[index];
  const nextBackground = 1 - activeBackground;
  storyBackgrounds[nextBackground].src = state.image;
  storyBackgrounds[nextBackground].classList.add('is-active');
  storyBackgrounds[activeBackground].classList.remove('is-active');
  activeBackground = nextBackground;
  brandStoryIndex = index;
  storyLabel.textContent = state.label;
  storySubtitle.textContent = state.subtitle;
  storyCompanies.innerHTML = Array.from({ length: state.companies }, companyMarkup).join('');
  storyProgress.style.transform = `scaleX(${(index + 1) / brandStoryStates.length})`;
  restartTransition(storyStage);
}

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
  if (index === mapStateIndex || !locationsStage) return;
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
  const rect = section.getBoundingClientRect();
  return clamp(-rect.top / Math.max(1, section.offsetHeight - stageHeight));
}

let aboutProgress = 0;
let growthProgress = 0;
let frame = 0;
const visibleScenes = new Set();

function renderScenes() {
  frame = 0;

  if (about && visibleScenes.has(about) && !mobileLayout.matches && !reducedMotion.matches) {
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

  if (growth && visibleScenes.has(growth) && !reducedMotion.matches) {
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

  if (brandStory && visibleScenes.has(brandStory)) {
    const index = Math.min(brandStoryStates.length - 1, Math.floor(sectionProgress(brandStory) * brandStoryStates.length));
    setBrandStoryState(index);
  }

  if (locations && visibleScenes.has(locations)) {
    const index = Math.min(mapStates.length - 1, Math.floor(sectionProgress(locations) * mapStates.length));
    setMapState(index);
  }

  if (visibleScenes.size) frame = requestAnimationFrame(renderScenes);
}

const sceneObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) visibleScenes.add(entry.target);
    else visibleScenes.delete(entry.target);
  });
  if (visibleScenes.size && !frame) frame = requestAnimationFrame(renderScenes);
}, { threshold: 0 });

[about, growth, brandStory, locations].filter(Boolean).forEach((section) => sceneObserver.observe(section));

function resetLayout() {
  if (mobileLayout.matches || reducedMotion.matches) {
    story?.style.removeProperty('transform');
    cards.forEach((card) => { card.style.removeProperty('opacity'); card.style.removeProperty('transform'); });
  }
  if (reducedMotion.matches) {
    growthStats?.style.removeProperty('transform');
    growthBars.forEach((bar) => bar.style.removeProperty('transform'));
  }
  if (visibleScenes.size && !frame) frame = requestAnimationFrame(renderScenes);
}

window.addEventListener('resize', resetLayout);
mobileLayout.addEventListener?.('change', resetLayout);
reducedMotion.addEventListener?.('change', resetLayout);

brandStoryStates.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
mapStates.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
storyCompanies.innerHTML = Array.from({ length: brandStoryStates[0].companies }, companyMarkup).join('');
storyProgress.style.transform = `scaleX(${1 / brandStoryStates.length})`;
resetLayout();

document.querySelector('.contact__form')?.addEventListener('submit', (event) => event.preventDefault());
