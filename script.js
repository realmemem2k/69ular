const revealNodes = document.querySelectorAll('.timeline article, .news-card, .contact__info, .contact__form');
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

const about = document.querySelector('.about');
const story = document.querySelector('.story');
const cards = [...document.querySelectorAll('.story-card')];

function animateStory() {
  if (!about || !story || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = about.getBoundingClientRect();
  const viewport = window.innerHeight;
  const travel = Math.max(0, about.offsetHeight - viewport);
  const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, travel)));
  const maxShift = Math.max(0, story.scrollHeight - viewport + 120);
  story.style.transform = `translate3d(0, ${-progress * maxShift}px, 0)`;
  cards.forEach((card, index) => {
    const local = Math.min(1, Math.max(0, progress * cards.length - index + 0.8));
    card.style.opacity = String(0.55 + local * 0.45);
    card.style.transform = `scale(${0.975 + local * 0.025})`;
  });
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { animateStory(); ticking = false; });
}, { passive: true });
window.addEventListener('resize', animateStory);
animateStory();

const brandStory = document.querySelector('.brand-story');
const storyStage = document.querySelector('.brand-story__stage');
const storyLabel = document.querySelector('[data-story-label]');
const storySubtitle = document.querySelector('[data-story-subtitle]');
const storyCompanies = document.querySelector('[data-story-companies]');
const storyProgress = document.querySelector('[data-story-progress]');
const storyBackgrounds = [document.querySelector('[data-story-bg-a]'), document.querySelector('[data-story-bg-b]')];

const brandStoryStates = [
  { label: 'Auto', image: './assets/block3-auto.png', companies: 3 },
  { label: 'Logostic', image: './assets/block3-logostic.png', companies: 2 },
  { label: 'Tech', image: './assets/worker.png', companies: 1 },
  { label: 'Agro', image: './assets/block3-agro.png', companies: 3 },
  { label: 'Recycling', image: './assets/logistics-card.png', companies: 2 },
  { label: 'Retail', image: './assets/transport.png', companies: 3 },
  { label: 'Construction', image: './assets/industry.png', companies: 1 }
];

const companyMarkup = () => `
  <article class="brand-story__company">
    <div><b>Компания</b><img src="./assets/external-link.svg" alt="" /></div>
    <p>В продуктовых и розничных направлениях</p>
  </article>`;

let brandStoryIndex = -1;
let activeBackground = 0;

function setBrandStoryState(index, immediate = false) {
  if (index === brandStoryIndex || !storyStage) return;
  const state = brandStoryStates[index];
  brandStoryIndex = index;
  const nextBackground = immediate ? activeBackground : 1 - activeBackground;
  const nextImage = storyBackgrounds[nextBackground];
  const currentImage = storyBackgrounds[activeBackground];

  nextImage.src = state.image;
  nextImage.classList.add('is-active');
  currentImage.classList.toggle('is-active', immediate);
  activeBackground = nextBackground;

  storyStage.classList.remove('is-changing');
  void storyStage.offsetWidth;
  storyLabel.textContent = state.label;
  storySubtitle.innerHTML = 'В продуктовых и розничных направлениях применяется гибкая модель: часть решений сохраняет связь с Ular,<br />а часть развивается как самостоятельные бренды.';
  storyCompanies.innerHTML = Array.from({ length: state.companies }, companyMarkup).join('');
  storyStage.classList.add('is-changing');
  storyProgress.style.transform = `scaleX(${(index + 1) / brandStoryStates.length})`;
}

function animateBrandStory() {
  if (!brandStory) return;
  const rect = brandStory.getBoundingClientRect();
  const travel = Math.max(1, brandStory.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / travel));
  const index = Math.min(brandStoryStates.length - 1, Math.floor(progress * brandStoryStates.length));
  setBrandStoryState(index, brandStoryIndex < 0);
}

window.addEventListener('scroll', animateBrandStory, { passive: true });
window.addEventListener('resize', animateBrandStory);
brandStoryStates.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
setBrandStoryState(0, true);
animateBrandStory();

const locations = document.querySelector('.locations');
const locationsStage = document.querySelector('.locations__stage');
const mapTitle = document.querySelector('[data-map-title]');
const mapMetric = document.querySelector('[data-map-metric]');
const mapDescription = document.querySelector('[data-map-description]');
const mapOffice = document.querySelector('[data-map-office]');
const mapLayers = [document.querySelector('[data-map-layer-a]'), document.querySelector('[data-map-layer-b]')];

const mapStates = [
  {
    title: 'Распределение',
    metric: '6 Регионов',
    description: 'Мы непрерывно растем и включаем в работу все больше регионов',
    image: './assets/map-regions.png',
    office: false
  },
  {
    title: 'Наш рост',
    metric: '30+ компаний',
    description: 'Мы непрерывно растем и включаем в работу все больше регионов',
    image: './assets/map-growth.png',
    office: true
  },
  {
    title: 'Наши перспективы',
    metric: '30% больше',
    description: 'В ближайшие 5 лет планирубем расширение минимум на 30 процентов',
    image: './assets/map-future.png',
    office: false
  }
];

let mapStateIndex = -1;
let activeMapLayer = 0;

function setMapState(index, immediate = false) {
  if (index === mapStateIndex || !locationsStage) return;
  const state = mapStates[index];
  mapStateIndex = index;
  const nextLayerIndex = immediate ? activeMapLayer : 1 - activeMapLayer;
  const nextLayer = mapLayers[nextLayerIndex];
  const currentLayer = mapLayers[activeMapLayer];

  nextLayer.src = state.image;
  nextLayer.classList.add('is-active');
  currentLayer.classList.toggle('is-active', immediate);
  activeMapLayer = nextLayerIndex;

  locationsStage.classList.remove('is-changing');
  void locationsStage.offsetWidth;
  mapTitle.textContent = state.title;
  mapMetric.textContent = state.metric;
  mapDescription.textContent = state.description;
  mapOffice.hidden = !state.office;
  locationsStage.classList.add('is-changing');
}

function animateLocations() {
  if (!locations) return;
  const rect = locations.getBoundingClientRect();
  const travel = Math.max(1, locations.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / travel));
  const index = Math.min(mapStates.length - 1, Math.floor(progress * mapStates.length));
  setMapState(index, mapStateIndex < 0);
}

window.addEventListener('scroll', animateLocations, { passive: true });
window.addEventListener('resize', animateLocations);
mapStates.forEach(({ image }) => { const preload = new Image(); preload.src = image; });
setMapState(0, true);
animateLocations();

document.querySelector('.contact__form')?.addEventListener('submit', (event) => event.preventDefault());
