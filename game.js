const canvas = document.getElementById('pingpong');
const ctx = canvas.getContext('2d');

// Set the canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7
};

let userPaddle = {
  x: 0, // left side of canvas
  y: (canvas.height - 100) / 2, // -100 is the paddle height
  width: 10,
  height: 100
};

let aiPaddle = {
  x: canvas.width - 10, // -10 is the paddle width
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100
};

function drawPaddle(x, y, width, height) {
  ctx.fillStyle = '#0095DD';
  ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI*2, false);
  ctx.closePath();
  ctx.fill();
}

// Mouse movement handler
canvas.addEventListener("mousemove", (evt) => {
  userPaddle.y = evt.clientY - userPaddle.height / 2;
});

function collisionDetection(ball, paddle) {
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  paddle.top = paddle.y;
  paddle.bottom = paddle.y + paddle.height;
  paddle.left = paddle.x;
  paddle.right = paddle.x + paddle.width;

  return ball.right > paddle.left && ball.bottom > paddle.top && ball.left < paddle.right && ball.top < paddle.bottom;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 7;
}

function update() {
  // Move the ball
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // AI Paddle Movement
  aiPaddle.y += ((ball.y - (aiPaddle.y + aiPaddle.height / 2))) * 0.1;

  // Collision detection on top and bottom walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  // Collision with user paddle
  if (collisionDetection(ball, userPaddle)) {
    // Calculate where the ball hit the paddle
    let collidePoint = (ball.y - (userPaddle.y + userPaddle.height / 2));
    collidePoint = collidePoint / (userPaddle.height / 2);

    // Calculate angle in Radian
    let angleRad = collidePoint * Math.PI/4;
    
    let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    // Increase ball speed
    ball.speed += 0.1;
  }

  // Collision with ai paddle
  if (collisionDetection(ball, aiPaddle)) {
    let collidePoint = (ball.y - (aiPaddle.y + aiPaddle.height / 2));
    collidePoint = collidePoint / (aiPaddle.height / 2);
    
    let angleRad = collidePoint * Math.PI/4;
    let direction = (ball.x > canvas.width / 2) ? -1 : 1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
    
    ball.speed += 0.1;
  }

  // Reset ball when it goes out of the canvas
  if (ball.x + ball.radius < 0 || ball.x - ball.radius > canvas.width) {
    resetBall();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height);
  drawPaddle(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
  drawBall(ball.x, ball.y, ball.radius);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
