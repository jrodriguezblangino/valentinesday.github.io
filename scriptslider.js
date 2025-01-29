let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const comicSlides = document.getElementById('comic-slides');
const startScreen = document.getElementById('start-screen');
const endScreen = document.getElementById('end-screen');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

// Start the story
startButton.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  comicSlides.style.transform = 'translateX(0)';
});

// Navigate slides
prevBtn.addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlidePosition();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlidePosition();
  } else {
    endScreen.classList.remove('hidden');
  }
});

// Restart the story
restartButton.addEventListener('click', () => {
  endScreen.classList.add('hidden');
  currentSlide = 0;
  updateSlidePosition();
});

// Update slide position
function updateSlidePosition() {
  // Añadir efecto de voltear página
  const currentSlideElement = slides[currentSlide];
  const previousSlideElement = slides[currentSlide - 1];
  
  // Resetear todas las transformaciones
  slides.forEach(slide => {
    slide.style.zIndex = "1";
    slide.classList.remove('turning');
  });
  
  if (previousSlideElement) {
    previousSlideElement.classList.add('turning');
    previousSlideElement.style.zIndex = "2";
  }
  
  currentSlideElement.style.zIndex = "3";
  
  // Mover el contenedor después de un pequeño retraso
  setTimeout(() => {
    comicSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
  }, 300);
}