const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const snakeSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = { x: 200, y: 200 };
let direction = { x: 1, y: 0 };
let isGameRunning = true;
let mathQuestionElement = document.getElementById("mathQuestion");
let gameOverElement = document.getElementById("gameOver");
let questionElement = document.getElementById("question");
let currentAnswer = 0;

// Game loop
function gameLoop() {
    if (isGameRunning) {
        moveSnake();
        checkCollision();
        drawGame();
        setTimeout(gameLoop, 100);
    }
}

// Draw snake, food, and background
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach(part => {
        ctx.fillStyle = "#00ff00";
        ctx.fillRect(part.x, part.y, snakeSize, snakeSize);
        ctx.strokeStyle = "#003300";
        ctx.strokeRect(part.x, part.y, snakeSize, snakeSize);
    });

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
    ctx.strokeStyle = "#990000";
    ctx.strokeRect(food.x, food.y, snakeSize, snakeSize);
}

// Move the snake
function moveSnake() {
    const head = { x: snake[0].x + direction.x * snakeSize, y: snake[0].y + direction.y * snakeSize };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
}

// Place food randomly
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    food.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
}

// Handle direction change
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Check for collisions
function checkCollision() {
    const head = snake[0];

    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        isGameRunning = false;
        askMathQuestion();
    }

    // Check self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            isGameRunning = false;
            askMathQuestion();
        }
    }
}

// Generate and ask a math question
function askMathQuestion() {
    mathQuestionElement.classList.remove("hidden");
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let questionText;
    let correctAnswer;

    switch (operation) {
        case '+':
            correctAnswer = num1 + num2;
            questionText = `What is ${num1} + ${num2}?`;
            break;
        case '-':
            correctAnswer = num1 - num2;
            questionText = `What is ${num1} - ${num2}?`;
            break;
        case '*':
            correctAnswer = num1 * num2;
            questionText = `What is ${num1} × ${num2}?`;
            break;
        case '/':
            // Ensure division by zero doesn't occur
            if (num2 !== 0) {
                correctAnswer = num1 / num2;
                questionText = `What is ${num1} ÷ ${num2}?`;
            } else {
                askMathQuestion(); // Recursively call to generate a new question
            }
            break;
    }

    currentAnswer = correctAnswer;
    questionElement.textContent = questionText;
}

// Check

// Check the user's answer
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById("answer").value, 10);
    if (userAnswer === currentAnswer) {
        restartGame();
    } else {
        gameOverElement.classList.remove("hidden");
        mathQuestionElement.classList.add("hidden");
    }
}

// Restart the game if the answer is correct
function restartGame() {
    snake = [{ x: 100, y: 100 }];
    direction = { x: 1, y: 0 };
    isGameRunning = true;
    mathQuestionElement.classList.add("hidden");
    document.getElementById("answer").value = "";
    gameLoop();
}

// Start a new game from game over
function startNewGame() {
    gameOverElement.classList.add("hidden");
    restartGame();
}

// Start the game
placeFood();
gameLoop();