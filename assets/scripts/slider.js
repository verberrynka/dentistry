document.addEventListener("DOMContentLoaded", function() {
  const sliderViewport = document.querySelector('.slider__viewport');
  const sliderList = document.querySelector('.slider__list');
  const slides = document.querySelectorAll('.slider__item');

  const prevButton = document.querySelector('.slider__button--prev');
  const nextButton = document.querySelector('.slider__button--next');

  let currentIndex = 0;

  let slideWidth;

  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;

  function getVisibleSlidesCount() {
    return Math.floor(sliderViewport.offsetWidth / slideWidth);
  }

  function calculateSlideWidth() {
    slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(sliderList).columnGap);
  }

  function setSliderPosition() {
    sliderList.style.transform = `translateX(${currentTranslate}px)`;
  }

  function updateSliderPosition() {
    currentTranslate = -currentIndex * slideWidth;
    setSliderPosition();
  }

  function updateButtonStates() {
    const visibleSlides = getVisibleSlidesCount();
    const maxIndex = Math.max(0, slides.length - visibleSlides);

    prevButton.disabled = (currentIndex === 0) ? true : false;
    nextButton.disabled = (currentIndex >= maxIndex) ? true : false;

    if (prevButton.disabled) {
      prevButton.classList.add('slider__button--disabled');
    } else {
      prevButton.classList.remove('slider__button--disabled');
    }

    if (nextButton.disabled) {
      nextButton.classList.add('slider__button--disabled');
    } else {
      nextButton.classList.remove('slider__button--disabled');
    }
  }

  //mouse
  sliderList.addEventListener('mousedown', dragStart);
  sliderList.addEventListener('mouseup', dragEnd);
  sliderList.addEventListener('mouseleave', dragEnd);
  sliderList.addEventListener('mousemove', drag);

  //touch
  sliderList.addEventListener('touchstart', dragStart);
  sliderList.addEventListener('touchend', dragEnd);
  sliderList.addEventListener('touchcancel', dragEnd);
  sliderList.addEventListener('touchmove', drag);

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function dragStart(event) {
    event.preventDefault();

    isDragging = true;
    startPos = getPositionX(event);
    sliderList.classList.add('dragging');
    cancelAnimationFrame(animationID);
  }

  function drag(event) {
    if (!isDragging) return;

    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
    requestAnimationFrame(setSliderPosition);
  }

  function dragEnd() {
    if (!isDragging) return;

    isDragging = false;
    sliderList.classList.remove('dragging');

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -30 && currentIndex < slides.length - getVisibleSlidesCount()) {
      currentIndex++;
    } else if (movedBy > 30 && currentIndex > 0) {
      currentIndex--;
    }

    updateSliderPosition();
    updateButtonStates();

    prevTranslate = currentTranslate;
  }

  //buttons
  nextButton.addEventListener('click', () => {
    const visibleSlides = getVisibleSlidesCount();
    const maxIndex = slides.length - visibleSlides;

    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSliderPosition();
      updateButtonStates();
      prevTranslate = currentTranslate;
    }
  });

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSliderPosition();
      updateButtonStates();
      prevTranslate = currentTranslate;
    }
  });

  //resize
  window.addEventListener('resize', () => {
    calculateSlideWidth();
    updateButtonStates();
    updateSliderPosition();
    prevTranslate = currentTranslate;
  });

  calculateSlideWidth();
  updateSliderPosition();
  updateButtonStates();
  prevTranslate = currentTranslate;
});