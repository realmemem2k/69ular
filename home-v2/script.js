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

const about = document.querySelector('.about');
const story = document.querySelector('.story');
const cards = [...document.querySelectorAll('.story-card')];
const growth = document.querySelector('.growth');
const growthStage = document.querySelector('.growth__stage');
const growthStats = document.querySelector('[data-growth-stats]');
const growthBars = [...document.querySelectorAll('.growth__bars i')];

function animateAbout() {
  if (!about || !story || reducedMotion.matches) return;
  const rect = about.getBoundingClientRect();
  const travel = Math.max(1, about.offsetHeight - window.innerHeight);
  const progress = clamp(-rect.top / travel);
  const maxShift = Math.max(0, story.scrollHeight - window.innerHeight + 120);
  story.style.transform = `translate3d(0, ${-progress * maxShift}px, 0)`;
  cards.forEach((card, index) => {
    const local = clamp(progress * cards.length - index + 0.8);
    card.style.opacity = String(0.55 + local * 0.45);
    card.style.transform = `scale(${0.975 + local * 0.025})`;
  });
}

function animateGrowth() {
  if (!growth || !growthStage || !growthStats) return;
  const rect = growth.getBoundingClientRect();
  const travel = Math.max(1, growth.offsetHeight - growthStage.offsetHeight);
  const progress = reducedMotion.matches ? 1 : clamp(-rect.top / travel);
  const startY = growthStage.offsetHeight * 0.725;
  const endY = growthStage.offsetHeight * -0.422;
  growthStats.style.transform = `translate3d(0, ${startY + (endY - startY) * progress}px, 0)`;
  growthBars.forEach((bar, index) => {
    const barProgress = index === 0 ? 1 : clamp((progress - (index - 1) * 0.135) / 0.32);
    bar.style.transform = `translate3d(0, ${(1 - barProgress) * 100}%, 0)`;
  });
}

let ticking = false;
function updateScrollScenes() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    animateAbout();
    animateGrowth();
    ticking = false;
  });
}
window.addEventListener('scroll', updateScrollScenes, { passive: true });
window.addEventListener('resize', updateScrollScenes);
reducedMotion.addEventListener?.('change', updateScrollScenes);

const divisionStates = [
  { image: './assets/block3-auto.png' },
  { image: './assets/divisions-logistics.png' },
  { image: './assets/worker.png' },
  { image: './assets/logistics-card.png' },
  { image: './assets/industry.png' },
  { image: './assets/transport.png' },
  { image: './assets/block3-agro.png' }
];
const divisionButtons = [...document.querySelectorAll('[data-division]')];
const divisionBackgrounds = [document.querySelector('[data-division-bg-a]'), document.querySelector('[data-division-bg-b]')];
const divisionDetails = document.querySelector('.divisions__details');
let activeDivision = 1;
let activeDivisionBackground = 0;

function setDivision(index) {
  if (index === activeDivision || !divisionStates[index]) return;
  activeDivision = index;
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

updateScrollScenes();
document.querySelector('.contact__form')?.addEventListener('submit', (event) => event.preventDefault());
