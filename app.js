const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}]; // position in the board as the game board is 20x20 it position is 10,10 in the middle
let food = generateFood();
let direction = 'right';
let gameInterval;
let gamespeedDelay = 200;
let gameStarted = false;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

highScoreText.textContent = highScore.toString().padStart(3, '0');
highScoreText.style.display = 'block';

// Draw the map
function draw() {
    board.innerHTML = '';
    drawSnake();
    drawFood();
    updateScore();
}

// Draw the snake
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement); // append the snake element to the board
    });
}

// Create a snake, food and game element
function createGameElement(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

// Set the position of the snake or food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw the food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement); // append the food element to the board
    }
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * gridSize) + 1,
        y: Math.floor(Math.random() * gridSize) + 1
    };
}

// Move the snake
function moveSnake() {
    const head = {...snake[0]}; // copy the head of the snake
    switch (direction) {
        case 'right':
            head.x += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
    }
    snake.unshift(head); // add the head to the snake
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); // clear the interval
        gameInterval = setInterval(() => {
            moveSnake();
            checkCollision();
            draw();
        }, gamespeedDelay);
    } else {
        snake.pop();
    }
}

// Start game function
function startGame() {
    gameStarted = true; // keep track of the game state
    instructionText.style.display = 'none'; // hide the instruction text
    logo.style.display = 'none'; // hide the logo
    gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
        draw();
    }, gamespeedDelay);
}

// Key press event listener
function handleKeyPress(event) {
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) {
        return startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
    if (gamespeedDelay > 150) {
        gamespeedDelay -= 5;
    } else if (gamespeedDelay > 100) {
        gamespeedDelay -= 3;
    } else if (gamespeedDelay > 50) {
        gamespeedDelay -= 2;
    } else if (gamespeedDelay > 20) {
        gamespeedDelay -= 1;
    }
} // increase the speed of the game

function checkCollision() {
    const head = snake[0];
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        gameOver();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gamespeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currScore = snake.length - 1;
    score.textContent = currScore.toString().padStart(3, '0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currScore = snake.length - 1;
    if (currScore > highScore) {
        highScore = currScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
        localStorage.setItem('highScore', highScore); // Save high score to localStorage
    }
    highScoreText.style.display = 'block';
}
