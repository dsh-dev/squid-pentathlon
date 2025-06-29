// Game state
let gameWins = [false, false, false, false, false];
let doorSelections = [null, null, null];
const winningDoors = [
    Math.floor(Math.random() * 3) + 1,
    Math.floor(Math.random() * 3) + 1,
    Math.floor(Math.random() * 3) + 1
];

// Start screen
document.getElementById('start-game').addEventListener('click', function() {
    document.getElementById('game-intro').style.display = 'none';
    document.getElementById('game1').style.display = 'block';
});

// Game 1: Code Cracker
const targetNumber = Math.floor(Math.random() * 90) + 10;
let attemptsLeft = 5;
const guessButton = document.getElementById('guess-button');
const guessInput = document.getElementById('guess-input');
const hintElement = document.getElementById('hint');
const attemptsElement = document.getElementById('attempts');
const game1Result = document.getElementById('game1-result');

guessButton.addEventListener('click', function() {
    const guess = parseInt(guessInput.value);
    
    if (isNaN(guess) || guess < 10 || guess > 99) {
        hintElement.textContent = 'Please enter a valid 2-digit number';
        return;
    }
    
    attemptsLeft--;
    attemptsElement.textContent = `ATTEMPTS: ${attemptsLeft}`;
    
    if (guess === targetNumber) {
        game1Result.textContent = '🎉 CORRECT! CODE CRACKED!';
        game1Result.style.color = '#4cd137';
        guessButton.disabled = true;
        guessInput.disabled = true;
        gameWins[0] = true;
        document.getElementById('next1').style.display = 'block';
    } else if (attemptsLeft <= 0) {
        game1Result.textContent = `☠️ GAME OVER! NUMBER WAS ${targetNumber}`;
        game1Result.style.color = '#e84118';
        guessButton.disabled = true;
        guessInput.disabled = true;
        document.getElementById('next1').style.display = 'block';
    } else {
        hintElement.textContent = guess < targetNumber ? 'HIGHER!' : 'LOWER!';
        guessInput.value = '';
        guessInput.focus();
    }
});

// Navigation between games
document.getElementById('next1').addEventListener('click', function() {
    document.getElementById('game1').style.display = 'none';
    document.getElementById('game2').style.display = 'block';
    setupMemoryGame();
});

// Game 2: Memory Flip
function setupMemoryGame() {
    const symbols = ['🔺', '⭕', '◼', '⭐'];
    let cards = [...symbols, ...symbols];
    cards = shuffleArray(cards);
    
    const memoryBoard = document.getElementById('memory-board');
    memoryBoard.innerHTML = '';
    
    let flippedCards = [];
    let matchedPairs = 0;
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.textContent = '?';
        
        card.addEventListener('click', function() {
            if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
                card.classList.add('flipped');
                card.textContent = card.dataset.symbol;
                flippedCards.push(card);
                
                if (flippedCards.length === 2) {
                    if (flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol) {
                        // Match found
                        flippedCards.forEach(c => c.classList.add('matched'));
                        matchedPairs++;
                        flippedCards = [];
                        
                        if (matchedPairs === symbols.length) {
                            document.getElementById('game2-result').textContent = '🎉 ALL PAIRS MATCHED!';
                            document.getElementById('game2-result').style.color = '#4cd137';
                            gameWins[1] = true;
                            document.getElementById('next2').style.display = 'block';
                        }
                    } else {
                        // No match
                        setTimeout(() => {
                            flippedCards.forEach(c => {
                                c.classList.remove('flipped');
                                c.textContent = '?';
                            });
                            flippedCards = [];
                        }, 1000);
                    }
                }
            }
        });
        
        memoryBoard.appendChild(card);
    });
}

document.getElementById('next2').addEventListener('click', function() {
    document.getElementById('game2').style.display = 'none';
    document.getElementById('game3').style.display = 'block';
    setupTargetTap();
});

// Game 3: Target Tap (Fixed version)
function setupTargetTap() {
    const target = document.getElementById('target');
    const targetCounter = document.getElementById('target-counter');
    const game3Result = document.getElementById('game3-result');
    let hits = 0;
    let gameActive = false;
    
    target.style.display = 'block';
    targetCounter.textContent = `HITS: ${hits}/3`;
    
    function moveTarget() {
        const gameContainer = document.getElementById('game3');
        const containerRect = gameContainer.getBoundingClientRect();
        
        // Calculate available space within the game container
        const containerLeft = containerRect.left + 20;
        const containerTop = containerRect.top + 20;
        const containerRight = containerRect.right - 100;
        const containerBottom = containerRect.bottom - 100;
        
        // Generate random position within container boundaries
        const randomX = Math.floor(Math.random() * (containerRight - containerLeft)) + containerLeft;
        const randomY = Math.floor(Math.random() * (containerBottom - containerTop)) + containerTop;
        
        target.style.left = `${randomX}px`;
        target.style.top = `${randomY}px`;
    }
    
    function startGame() {
        if (!gameActive) {
            gameActive = true;
            hits = 0;
            targetCounter.textContent = `HITS: ${hits}/3`;
            game3Result.textContent = '';
            moveTarget();
        }
    }
    
    target.addEventListener('click', function() {
        if (!gameActive) {
            startGame();
            return;
        }
        
        hits++;
        targetCounter.textContent = `HITS: ${hits}/3`;
        
        if (hits >= 3) {
            game3Result.textContent = '🎉 TARGET ELIMINATED!';
            game3Result.style.color = '#4cd137';
            target.style.display = 'none';
            gameWins[2] = true;
            document.getElementById('next3').style.display = 'block';
            gameActive = false;
            return;
        }
        
        moveTarget();
    });
    
    // Handle misclicks
    document.body.addEventListener('click', function(e) {
        if (gameActive && e.target !== target) {
            const miss = document.createElement('div');
            miss.className = 'miss';
            miss.textContent = '✖';
            miss.style.left = `${e.clientX - 30}px`;
            miss.style.top = `${e.clientY - 30}px`;
            document.body.appendChild(miss);
            setTimeout(() => miss.remove(), 500);
        }
    });
    
    // Initial target position
    moveTarget();
}

document.getElementById('next3').addEventListener('click', function() {
    document.getElementById('game3').style.display = 'none';
    document.getElementById('game4').style.display = 'block';
    setupLuckyDoor();
});

// Game 4: Lucky Door
function setupLuckyDoor() {
    const doors = document.querySelectorAll('.door');
    const doorResults = document.getElementById('door-results');
    const game4Result = document.getElementById('game4-result');
    
    doors.forEach(door => {
        door.textContent = '🚪';
        door.style.backgroundColor = '#e84118';
        door.addEventListener('click', function() {
            const setNum = parseInt(this.dataset.set) - 1;
            const doorNum = parseInt(this.dataset.door);
            
            // If this set already has a selection, ignore
            if (doorSelections[setNum] !== null) return;
            
            // Mark this door as selected
            doorSelections[setNum] = doorNum;
            
            // Reveal all doors in this set
            document.querySelectorAll(`.door[data-set="${this.dataset.set}"]`).forEach(d => {
                if (parseInt(d.dataset.door) === winningDoors[setNum]) {
                    d.textContent = '💰';
                    d.style.backgroundColor = '#4cd137';
                } else {
                    d.textContent = '☠️';
                    d.style.backgroundColor = '#2f3640';
                }
            });
            
            // Update results display
            updateDoorResults();
            
            // Check if game is complete
            const correctCount = doorSelections.filter((sel, i) => sel === winningDoors[i]).length;
            const selectedCount = doorSelections.filter(sel => sel !== null).length;
            
            if (selectedCount === 3) {
                if (correctCount >= 2) {
                    game4Result.textContent = '🎉 YOU WON 2/3 SETS!';
                    game4Result.style.color = '#4cd137';
                    gameWins[3] = true;
                } else {
                    game4Result.textContent = '☠️ NEED 2/3 TO WIN!';
                    game4Result.style.color = '#e84118';
                }
                document.getElementById('next4').style.display = 'block';
            }
        });
    });
    
    function updateDoorResults() {
        let resultsText = '';
        doorSelections.forEach((sel, i) => {
            if (sel !== null) {
                const isCorrect = sel === winningDoors[i];
                resultsText += `Set ${i+1}: ${isCorrect ? '✅' : '❌'} | `;
            }
        });
        doorResults.textContent = resultsText.slice(0, -3);
    }
}

document.getElementById('next4').addEventListener('click', function() {
    document.getElementById('game4').style.display = 'none';
    document.getElementById('game5').style.display = 'block';
    setupQuiz();
});

// Game 5: Quick Quiz
function setupQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    const submitButton = document.getElementById('submit-quiz');
    const game5Result = document.getElementById('game5-result');
    
    const correctAnswers = {
        1: 'b', // Triangle
        2: 'c', // Green
        3: 'c', // 45.6 billion won
        4: 'b', // Red Light, Green Light
        5: 'b'  // 456
    };
    
    const userAnswers = {};
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            const question = this.dataset.question;
            userAnswers[question] = this.dataset.answer;
            
            // Remove selected class from all options for this question
            document.querySelectorAll(`.quiz-option[data-question="${question}"]`).forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
    
    submitButton.addEventListener('click', function() {
        let score = 0;
        
        for (const question in userAnswers) {
            if (userAnswers[question] === correctAnswers[question]) {
                score++;
            }
        }
        
        if (score >= 3) {
            game5Result.textContent = `🎉 YOU PASSED! (${score}/5 CORRECT)`;
            game5Result.style.color = '#4cd137';
            gameWins[4] = true;
        } else {
            game5Result.textContent = `☠️ YOU FAILED! (${score}/5 CORRECT)`;
            game5Result.style.color = '#e84118';
        }
        
        submitButton.disabled = true;
        quizOptions.forEach(option => {
            option.style.cursor = 'default';
            option.onclick = null;
        });
        
        document.getElementById('next5').style.display = 'block';
    });
}

document.getElementById('next5').addEventListener('click', function() {
    const totalWins = gameWins.filter(win => win).length;
    if (totalWins === 5) {
        alert('CONGRATULATIONS! YOU WON ALL 5 GAMES! 🎉');
    } else {
        alert(`GAME OVER! You won ${totalWins} out of 5 games. ☠️`);
    }
});

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}