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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomCardBack() {
  return `./assets/cards/${cardBacks[Math.floor(Math.random() * cardBacks.length)]}`;
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
    img.src = `./assets/cards/${card}.jpg`;
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
    card1.remove();
    card2.remove();
    effect1.remove();
    effect2.remove();
    resetBoard();
  }, 2000);
}

function createMatchEffect(card) {
  const rect = card.getBoundingClientRect();
  const effect = document.createElement('div');
  effect.classList.add('match-effect');
  effect.style.position = 'absolute';
  effect.style.width = `${rect.width}px`;
  effect.style.height = `${rect.height}px`;
  effect.style.left = `${rect.left}px`;
  effect.style.top = `${rect.top}px`;
  effect.style.background = `url('./assets/cards/transparent-dance.gif') no-repeat center/cover`;
  document.body.appendChild(effect);
  return effect;
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function checkWin() {
  const visibleCards = document.querySelectorAll('.card:not(.matched)');
  if (visibleCards.length === 0) {
    winMessage.style.display = 'block';
  }
}

function restartGame() {
  cardsGrid.innerHTML = '';
  score = 0;
  scoreElement.textContent = score;
  winMessage.style.display = 'none';
  createCards();
}

createCards();
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => flipCard(card));
});