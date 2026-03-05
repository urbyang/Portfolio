// Memory Card Game

const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎸', '🎺'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;
let timerInterval = null;
let seconds = 0;

const gameBoard = document.getElementById('gameBoard');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const matchesDisplay = document.getElementById('matches');
const restartBtn = document.getElementById('restartBtn');
const winModal = document.getElementById('winModal');
const playAgainBtn = document.getElementById('playAgainBtn');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="card-face card-back"></div>
        <div class="card-face card-front">${emoji}</div>
    `;
    
    card.addEventListener('click', () => flipCard(card));
    return card;
}

function initGame() {
    // Reset state
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    seconds = 0;
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Update displays
    movesDisplay.textContent = '0';
    timerDisplay.textContent = '0:00';
    matchesDisplay.textContent = '0/8';
    
    // Hide modal
    winModal.classList.remove('show');
    
    // Create card pairs and shuffle
    const cardPairs = [...emojis, ...emojis];
    const shuffledCards = shuffleArray(cardPairs);
    
    // Clear and populate game board
    gameBoard.innerHTML = '';
    shuffledCards.forEach((emoji, index) => {
        const card = createCard(emoji, index);
        cards.push(card);
        gameBoard.appendChild(card);
    });
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timerInterval = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }
}

function flipCard(card) {
    // Start timer on first click
    startTimer();
    
    // Ignore if already flipped, matched, or two cards are being checked
    if (card.classList.contains('flipped') || 
        card.classList.contains('matched') || 
        flippedCards.length >= 2) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Check for match when two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.emoji === card2.dataset.emoji;
    
    if (match) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        matchesDisplay.textContent = `${matchedPairs}/8`;
        flippedCards = [];
        
        // Check for win
        if (matchedPairs === 8) {
            endGame();
        }
    } else {
        // No match - flip back after delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function endGame() {
    clearInterval(timerInterval);
    
    // Show win modal
    setTimeout(() => {
        finalMoves.textContent = moves;
        finalTime.textContent = timerDisplay.textContent;
        winModal.classList.add('show');
    }, 500);
}

// Event listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Initialize game on load
initGame();
