const cardsData = [
  'image1', 'image1', 'image2', 'image2', 'image3', 'image3', 
  'image4', 'image4', 'image5', 'image5', 'image6', 'image6', 
  'image7', 'image7', 'image8', 'image8', 'image9', 'image9', 
  'image10', 'image10'
];

const cardBacks = [
  'back1.png', 'back2.png', 'back3.png', 'back4.png', 'back5.png'
];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let score = 0;
let selectedCards = [];
let isProcessing = false;

const cardsGrid = document.querySelector('.cards-grid');
const scoreElement = document.getElementById('score');
const winMessage = document.getElementById('win-message');

function handleResize() {
  const container = document.querySelector('.game-container');
  const grid = document.querySelector('.cards-grid');
  const cards = document.querySelectorAll('.card');
  
  // Update match effects positions when cards move
  const updateEffectPositions = () => {
    document.querySelectorAll('.match-effect').forEach(effect => {
      const cardId = effect.dataset.cardId;
      const card = document.querySelector(`[data-card-id="${cardId}"]`);
      if (card) {
        const rect = card.getBoundingClientRect();
        effect.style.left = `${rect.left}px`;
        effect.style.top = `${rect.top}px`;
      }
    });
  };

  // Debounced resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateEffectPositions, 250);
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomCardBack() {
  return `../assets/images/cards/${cardBacks[Math.floor(Math.random() * cardBacks.length)]}`;
}

function createCards() {
  shuffle(cardsData);
  cardsData.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.card = card;
    
    const front = document.createElement('div');
    front.classList.add('front');
    const img = document.createElement('img');
    img.src = `../assets/images/cards/${card}.jpg`;
    front.appendChild(img);
    
    const back = document.createElement('div');
    back.classList.add('back');
    back.style.backgroundImage = `url(${getRandomCardBack()})`;
    
    cardElement.appendChild(front);
    cardElement.appendChild(back);
    
    cardElement.addEventListener('click', () => flipCard(cardElement));
    cardsGrid.appendChild(cardElement);
  });
}

function flipCard(card) {
  if (lockBoard || card.classList.contains('flip')) return;
  
  card.classList.add('flip');
  
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = card;
  } else {
    secondCard = card;
    checkForMatch();
  }
}

function checkForMatch() {
  lockBoard = true;
  
  const isMatch = firstCard.dataset.card === secondCard.dataset.card;
  
  if (isMatch) {
    score += 10;
    scoreElement.textContent = score;
    handleMatch(firstCard, secondCard);
    checkWin();
  } else {
    setTimeout(() => {
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetBoard();
    }, 1000);
  }
}

function handleMatch(card1, card2) {
  const effect1 = createMatchEffect(card1);
  const effect2 = createMatchEffect(card2);
  
  setTimeout(() => {
    card1.classList.add('matched');
    card2.classList.add('matched');
    effect1.remove();
    effect2.remove();
    resetBoard();
    checkWin();
  }, 2000);
}

function createMatchEffect(card) {
  const rect = card.getBoundingClientRect();
  const effect = document.createElement('div');
  effect.classList.add('match-effect');
  const cardId = Date.now() + Math.random(); // Generate unique ID for tracking
  
  effect.dataset.cardId = cardId;
  card.dataset.cardId = cardId;
  
  effect.style.left = `${rect.left}px`;
  effect.style.top = `${rect.top}px`;
  effect.style.background = `url('../assets/images/cards/transparent-dance.gif') no-repeat center/cover`;
  
  document.body.appendChild(effect);
  return effect;
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function checkWin() {
  const matchedCards = document.querySelectorAll('.card.matched');
  if (matchedCards.length === cardsData.length) {
    // Aseguramos que el winMessage exista
    const winMessage = document.getElementById('win-message');
    if (winMessage) {
      // Añadimos la clase show en lugar de modificar el style directamente
      winMessage.classList.add('show');
      // Opcional: Añadir un log para debugging
      console.log('Win condition met! Showing win message');
    }
  }
}

// También modificamos la función restartGame para ocultar el mensaje correctamente
function restartGame() {
  cardsGrid.innerHTML = '';
  score = 0;
  scoreElement.textContent = score;
  const winMessage = document.getElementById('win-message');
  if (winMessage) {
    winMessage.classList.remove('show');
  }
  createCards();
}

// Initialize game and event handlers
createCards();
handleResize();

// Improve scroll handling for mobile
document.querySelector('.cards-container').addEventListener('touchstart', function(e) {
  if (e.touches.length === 1) {
    e.stopPropagation();
  }
}, { passive: true });

// Handle window resize
window.addEventListener('resize', handleResize);