const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const revealNodes = document.querySelectorAll('.news-card, .contact__info, .contact__form');
revealNodes.forEach((node) => node.classList.add('reveal'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
revealNodes.forEach((node) => observer.observe(node));

const about = document.querySelector('.about');
const story = document.querySelector('.story');
const storyCards = [...document.querySelectorAll('.story-card')];
function animateAbout() {
  if (!about || !story || reducedMotion.matches) return;
  const rect = about.getBoundingClientRect();
  const travel = Math.max(1, about.offsetHeight - window.innerHeight);
  const progress = clamp(-rect.top / travel);
  const maxShift = Math.max(0, story.scrollHeight - window.innerHeight + 120);
  story.style.transform = `translate3d(0, ${-progress * maxShift}px, 0)`;
  storyCards.forEach((card, index) => {
    const local = clamp(progress * storyCards.length - index + 0.8);
    card.style.opacity = String(0.55 + local * 0.45);
    card.style.transform = `scale(${0.975 + local * 0.025})`;
  });
}

const timeline = document.querySelector('.timeline-v3');
const timelineStage = document.querySelector('.timeline-v3__stage');
const timelineTabs = [...document.querySelectorAll('[data-timeline-tab]')];
const timelinePanels = [...document.querySelectorAll('[data-timeline-panel]')];
let timelineIndex = 0;

function setTimeline(index) {
  const nextIndex = clamp(index, 0, timelinePanels.length - 1);
  if (nextIndex === timelineIndex && timelinePanels[nextIndex]?.classList.contains('is-active')) return;
  timelineIndex = nextIndex;
  timelineTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === nextIndex;
    tab.classList.toggle('is-active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  timelinePanels.forEach((panel, panelIndex) => {
    panel.classList.toggle('is-active', panelIndex === nextIndex);
    panel.classList.toggle('is-before', panelIndex < nextIndex);
    panel.classList.toggle('is-after', panelIndex > nextIndex);
  });
}

function animateTimeline() {
  if (!timeline || !timelineStage) return;
  const rect = timeline.getBoundingClientRect();
  const travel = Math.max(1, timeline.offsetHeight - timelineStage.offsetHeight);
  const progress = clamp(-rect.top / travel);
  setTimeline(Math.min(2, Math.floor(progress * 3)));
}

timelineTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    if (!timeline || !timelineStage) return;
    const travel = timeline.offsetHeight - timelineStage.offsetHeight;
    const target = timeline.offsetTop + travel * (index / Math.max(1, timelineTabs.length - 1));
    window.scrollTo({ top: target, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });
});

const accordionItems = [...document.querySelectorAll('[data-accordion-item]')];
const accordionImage = document.querySelector('[data-accordion-image]');
const accordionImages = [
  './assets/division-auto.png',
  './assets/division-logistics.png',
  './assets/worker.png',
  './assets/logistics-card.png',
  './assets/industry.png',
  './assets/transport.png',
  './assets/block3-agro.png'
];
let openAccordion = -1;

function setAccordion(index) {
  const nextIndex = index === openAccordion ? -1 : index;
  openAccordion = nextIndex;
  accordionItems.forEach((item, itemIndex) => {
    const open = itemIndex === nextIndex;
    item.classList.toggle('is-open', open);
    item.querySelector('button')?.setAttribute('aria-expanded', String(open));
  });
  if (!accordionImage) return;
  if (nextIndex < 0) {
    accordionImage.hidden = true;
    accordionImage.removeAttribute('alt');
    return;
  }
  accordionImage.src = accordionImages[nextIndex];
  accordionImage.alt = accordionItems[nextIndex].querySelector('button span')?.textContent || '';
  accordionImage.hidden = false;
}

accordionItems.forEach((item, index) => item.querySelector('button')?.addEventListener('click', () => setAccordion(index)));
accordionImages.forEach((src) => { const preload = new Image(); preload.src = src; });

let ticking = false;
function updateScrollScenes() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    animateAbout();
    animateTimeline();
    ticking = false;
  });
}
window.addEventListener('scroll', updateScrollScenes, { passive: true });
window.addEventListener('resize', updateScrollScenes);
reducedMotion.addEventListener?.('change', updateScrollScenes);
updateScrollScenes();

document.querySelector('.contact__form')?.addEventListener('submit', (event) => event.preventDefault());
