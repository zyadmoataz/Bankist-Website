'use strict';
////////////////////////////////////////////////////////////   SELECTING ELEMENTS   ////////////////////////////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollBtn = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tab = document.querySelectorAll('.operations__tab'); //3 buttons
const tabContent = document.querySelectorAll('.operations__content'); //3 texts
const tabContainer = document.querySelector('.operations__tab-container'); //container include them
const header = document.querySelector('.header');
const linksContainer = document.querySelector('.nav');
const links = document.querySelectorAll('.nav__link');
const allSections = document.querySelectorAll('.section');
const allSlides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

////////////////////////////////////////////////////////////   MODAL WINDOW   ////////////////////////////////////////////////////////////////
const openModal = function (e) {
  e.preventDefault(); //if we click button from anywhere it will prevent jumping to top
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal)); //cause we have morethan one btn

btnCloseModal.addEventListener('click', closeModal); //when i click on x button close modal
overlay.addEventListener('click', closeModal); //when i click on overlay close modal

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////////////////////////////////   COOKIE   ////////////////////////////////////////////////////////////////
//1-Create a Cookie:
//i) Creating and Insterting Cookie:
const cookie = document.createElement('div');
cookie.classList.add('cookie-message');
cookie.innerHTML =
  'We are using cookies to improve our website and to get a better performance <button class="btn btn--close-cookie cookie--btn"> Got it! </button>';
header.append(cookie);

//ii) Delete Cookie:
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    cookie.remove();
  });

////////////////////////////////////////////////////////////   STYLE   ////////////////////////////////////////////////////////////////
//2-Style Webpage:
//i) Style Cookie:
cookie.style.backgroundColor = '#37383d';
document.querySelector('.cookie--btn').style.color = 'white';
cookie.style.width = '104%';
cookie.style.height =
  Number.parseFloat(getComputedStyle(cookie).height, 10) + 30 + 'px';

//ii) Style Primary Color:
document.documentElement.style.setProperty('--color-primary', '#1DB954');
btnsOpenModal.forEach(function (e) {
  e.style.color = 'white';
});

////////////////////////////////////////////////////////////   SMOTH SCROLL   ////////////////////////////////////////////////////////////////
//3-Smooth scrolling in Modern School
scrollBtn.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

////////////////////////////////////////////////////////////   PAGE NAVIGATION  ////////////////////////////////////////////////////////////////
//4-Smooth page navigation: Using Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////////////////////////////   DOM TRAVERSING  ////////////////////////////////////////////////////////////////
//5- Selecting Children and Parents
//i) Going downwards: Children
const h1 = document.querySelector('h1');
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'white';

//ii) Going upwards: Parents
h1.closest('h1').style.transform = 'scale(1.1)'; //it will be thee all h1 itself

////////////////////////////////////////////////////////////   TABBED COMPONENT  ////////////////////////////////////////////////////////////////
//6-Tabbed Component
tabContainer.addEventListener('click', function (e) {
  e.preventDefault();
  //1-Determine which tab first
  const clicked = e.target.closest('.operations__tab');
  //2-Guard Clause
  if (!clicked) return;
  //3-Active Tab
  tab.forEach(val => val.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  //4-Active Content
  tabContent.forEach(val =>
    val.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

/////////////////////////////////////////////////   PASSING ARGUMENTS TO EVENT HANDLERS  /////////////////////////////////////////////////////
//7-Menu Fade Animation:
const handleHover = function (e) {
  const clicked = e.target; //current link
  const allLinks = clicked.closest('nav').querySelectorAll('.nav__link'); //all links
  const logo = clicked.closest('nav').querySelector('img'); //for any image

  allLinks.forEach(val => {
    if (val !== clicked) val.style.opacity = this;
  });

  logo.style.opacity = this;
};

linksContainer.addEventListener('mouseover', handleHover.bind(0.5)); //bind return a new function
linksContainer.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////////////////////////   STICKY NAVIGATION  ///////////////////////////////////////////////////////////////
//8- Sticky Navigation starts from section 1:
const navHeight = linksContainer.getBoundingClientRect().height;

const headCallback = function (entries) {
  const [entry] = entries; //cause threshold has one value so destruct it
  if (!entry.isIntersecting) linksContainer.classList.add('sticky');
  else linksContainer.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(headCallback, {
  root: null,
  threshold: 0, //value between 0 and 1
  rootMargin: `-${navHeight}px`, //navigation appear 90 pixel before the threshold
});
headerObserver.observe(header);

//////////////////////////////////////////////////////   REVEALING ELEMENTS ON SCROLL //////////////////////////////////////////////////////////
//9- Animation to the section:
const sectionCallBack = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObs = new IntersectionObserver(sectionCallBack, {
  root: null,
  threshold: 0.15, //appear when 15% visible
});

allSections.forEach(function (val) {
  sectionObs.observe(val);
  val.classList.add('section--hidden');
});

/////////////////////////////////////////////////////////   LAZY LOADING /////////////////////////////////////////////////////////////
//10-Make Images Blur: [To speed up performance and when hover let them appear]
const blurImages = document.querySelectorAll('img[data-src]');
const imgCallBack = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};
const imgObs = new IntersectionObserver(imgCallBack, {
  root: null,
  threshold: 0,
  rootMargin: '-200px',
});
blurImages.forEach(val => imgObs.observe(val));

/////////////////////////////////////////////////////////   SLIDER   /////////////////////////////////////////////////////////////
//11-Slider
const sliderFunction = function () {
  let currentSlide = 0;
  let maxSlide = allSlides.length;

  //1-Functions
  const slideCalculate = function (num) {
    allSlides.forEach(
      (val, i) => (val.style.transform = `translateX(${100 * (i - num)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    slideCalculate(currentSlide);
    activeDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    slideCalculate(currentSlide);
    activeDot(currentSlide);
  };

  const createDots = function () {
    allSlides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(val => val.classList.remove('dots__dot--active')); //deactivate all first
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () //inialization of th page
  {
    slideCalculate(0);
    createDots();
    activeDot(0); //when we refersh we want it to activate the first slide
  };
  init();

  //2-Event Handlers:
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); //short circuiting
  });
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      slideCalculate(slide);
      activeDot(slide);
    }
  });
};
sliderFunction(); //we can pass in object
