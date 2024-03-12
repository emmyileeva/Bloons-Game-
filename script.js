// Variable to store game state
let currentScore = 0;
let balloonsPopped = 0;
const targetBalloons = 12; // Update this if you want to adjust the target goal

// cached DOM element
const monkey = document.getElementById("monkey");
const dart = document.getElementById("dart");
const trajectoryPreview = document.getElementById("trajectoryPreview");

// Initialize game
document.addEventListener("DOMContentLoaded", startGame);

// Event listener for mouse over the monkey
monkey.addEventListener("mouseover", () => {
  trajectoryPreview.style.display = "block";
});

// Event listener for mouse move over the monkey
monkey.addEventListener("mousemove", (event) => {
  const monkeyPosition = monkey.getBoundingClientRect();
  const angle =
    Math.atan2(
      event.clientY - monkeyPosition.top - monkeyPosition.height / 2,
      event.clientX - monkeyPosition.left - monkeyPosition.width / 2
    ) *
    (180 / Math.PI);
  trajectoryPreview.style.transform = `rotate(${angle}deg)`;
});

// Event listener for mouse leave the monkey
monkey.addEventListener("mouseleave", () => {
  trajectoryPreview.style.display = "none";
});

// Event listener for shooting the dart on mouse click
monkey.addEventListener("click", (event) => {
  const angle =
    Math.atan2(
      event.clientY -
        monkey.getBoundingClientRect().top -
        monkey.getBoundingClientRect().height / 2,
      event.clientX -
        monkey.getBoundingClientRect().left -
        monkey.getBoundingClientRect().width / 2
    ) *
    (180 / Math.PI);
  shootDart(angle);
});

// Event listener for shooting the dart on mouse down
monkey.addEventListener("mousedown", (event) => {
  const angle =
    Math.atan2(
      event.clientY -
        monkey.getBoundingClientRect().top -
        monkey.getBoundingClientRect().height / 2,
      event.clientX -
        monkey.getBoundingClientRect().left -
        monkey.getBoundingClientRect().width / 2
    ) *
    (180 / Math.PI);
  shootDart(angle);
});

// Event listener for mouse up to stop shooting the dart
monkey.addEventListener("mouseup", () => {
  clearInterval(dartInterval);
});

// Function to start game
function startGame() {
  currentScore = 0;
  balloonsPopped = 0;
  updateScoreDisplays();
}

// Function to update score displays
function updateScoreDisplays() {
  document.querySelector(".current-score").textContent =
    "Current Score: " + currentScore + " balloons";
  document.querySelector(".balloons").textContent =
    "Balloons Popped: " + balloonsPopped + "/" + targetBalloons;
}

// Function to reset game
function resetGame() {
  startGame();
}

// function for back to main menu button
function backToMainMenu() {
  // redirection to main menu
  window.location.href = "index.html";
}

// Function to check if level was completed
function checkLevelComplete() {
  if (balloonsPopped >= targetBalloons) {
    alert("Level Complete!");
  }
}

// Function to shoot the dart
function shootDart(angle) {
  if (!dartIsVisible && dartsShot < maxDarts) {
    dartIsVisible = true;
    dart.style.visibility = "visible";
    const dartPosition = dart.getBoundingClientRect();
    const trajectoryPreviewPosition = trajectoryPreview.getBoundingClientRect();
    const offsetLeft = trajectoryPreview.offsetLeft;
    const offsetTop = trajectoryPreview.offsetTop;
    const radianAngle = angle * (Math.PI / 180);

    dart.style.left =
      offsetLeft +
      trajectoryPreviewPosition.width / 2 -
      dartPosition.width / 2 +
      "px";
    dart.style.top =
      offsetTop +
      trajectoryPreviewPosition.height / 2 -
      dartPosition.height / 2 +
      "px";

    let dartPower = 0;
    dartInterval = setInterval(() => {
      dartPower += 4;
      const deltaX = dartPower * Math.cos(radianAngle);
      const deltaY = dartPower * Math.sin(radianAngle);
      dart.style.left =
        offsetLeft +
        trajectoryPreviewPosition.width / 2 +
        deltaX -
        dartPosition.width / 2 +
        "px";
      dart.style.top =
        offsetTop +
        trajectoryPreviewPosition.height / 2 +
        deltaY -
        dartPosition.height / 2 +
        "px";
      if (
        dartPower >=
        Math.max(
          trajectoryPreviewPosition.width,
          trajectoryPreviewPosition.height
        ) /
          2
      ) {
        clearInterval(dartInterval);
        dartIsVisible = false;
        dart.style.visibility = "hidden";
        dartsShot++;
      }
    }, 30);
  }
}


