// Variables
const gameGrid = document.querySelector('.game-grid');
const movesCounter = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');

let moves = 0;
let timer;
let seconds = 0;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;

// Card images (simple emojis for now)
const cardImages = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍓', '🍍', '🍑'];

// Double the array and shuffle it
const shuffledCards = [...cardImages, ...cardImages].sort(() => Math.random() - 0.5);

// Create card elements
function createCards() {
    shuffledCards.forEach(image => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${image}</div>
                <div class="card-back">?</div>
            </div>
        `;
        gameGrid.appendChild(card);
        card.addEventListener('click', flipCard);
    });
}

// Flip card
function flipCard() {
    if (lockBoard || this === firstCard) return;

    this.classList.add('flipped');
    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkMatch();
}

// Check for match
function checkMatch() {
    if (firstCard.innerHTML === secondCard.innerHTML) {
        disableCards();
        matchedPairs++;
        if (matchedPairs === cardImages.length) {
            clearInterval(timer);
            alert(`You won in ${moves} moves and ${seconds} seconds!`);
        }
    } else {
        unflipCards();
    }

    moves++;
    movesCounter.textContent = moves;
}

// Disable cards if they match
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

// Unflip cards if they don't match
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset board state
function resetBoard() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Start timer
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;
    }, 1000);
}

// Restart game
function restartGame() {
    clearInterval(timer);
    seconds = 0;
    moves = 0;
    matchedPairs = 0;
    movesCounter.textContent = moves;
    timerDisplay.textContent = seconds;
    gameGrid.innerHTML = '';
    shuffledCards.sort(() => Math.random() - 0.5);
    createCards();
    startTimer();
}

// Initialize game
createCards();
startTimer();
restartBtn.addEventListener('click', restartGame);
