// Variable to store game state
let currentScore = 0;
let balloonsPopped = 0;
const targetBalloons = 12; // Update this if you want to adjust the target goal

// Function to start game
function startGame() {
  currentScore = 0;
  balloonsPopped = 0;
  updateCurrentScore();
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

document.addEventListener("DOMContentLoaded", function () {
  const monkey = document.getElementById("monkey");
  const dart = document.getElementById("dart");
  const trajectoryPreview = document.getElementById("trajectoryPreview");

  let dartIsVisible = false;
  let dartInterval;
  let dartsShot = 0;
  const maxDarts = 5;

  monkey.addEventListener("mouseover", () => {
    trajectoryPreview.style.display = "block";
  });

  monkey.addEventListener("mousemove", (event) => {
    const monkeyPosition = monkey.getBoundingClientRect();
    const mouseX =
      event.clientX - monkeyPosition.left - monkeyPosition.width / 2;
    const mouseY =
      event.clientY - monkeyPosition.top - monkeyPosition.height / 2;
    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    trajectoryPreview.style.left =
      monkeyPosition.left + monkeyPosition.width / 2 + "px";
    trajectoryPreview.style.top =
      monkeyPosition.top + monkeyPosition.height / 2 + "px";
    trajectoryPreview.style.transform = `rotate(${angle}deg)`;
  });

  monkey.addEventListener("mouseleave", () => {
    trajectoryPreview.style.display = "none";
  });

  function shootDart(angle) {
    if (!dartIsVisible && dartsShot < maxDarts) {
      dartIsVisible = true;
      dart.style.visibility = "visible";
      const monkeyPosition = monkey.getBoundingClientRect();
      const dartPosition = dart.getBoundingClientRect();
      dart.style.left =
        monkeyPosition.left +
        monkeyPosition.width / 2 -
        dartPosition.width / 2 +
        "px";
      dart.style.top = monkeyPosition.top + "px";

      let dartPower = 0;
      const radianAngle = angle * (Math.PI / 180);

      dartInterval = setInterval(() => {
        dartPower += 4;
        const deltaX = dartPower * Math.cos(radianAngle);
        const deltaY = dartPower * Math.sin(radianAngle);
        dart.style.left =
          monkeyPosition.left +
          monkeyPosition.width / 2 +
          deltaX -
          dartPosition.width / 2 +
          "px";
        dart.style.top =
          monkeyPosition.top +
          monkeyPosition.height / 2 +
          deltaY -
          dartPosition.height / 2 +
          "px";

        if (
          dartPower >=
          Math.max(monkeyPosition.width, monkeyPosition.height) / 2
        ) {
          clearInterval(dartInterval);
          dartIsVisible = false;
          dart.style.visibility = "hidden";
          dartsShot++;
        }
      }, 30);
    }
  }

  monkey.addEventListener("click", (e) => {
    const monkeyPosition = monkey.getBoundingClientRect();
    const mouseX = e.clientX - monkeyPosition.left;
    const mouseY = e.clientY - monkeyPosition.top;
    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    shootDart(angle);
  });

  monkey.addEventListener("mousedown", (mouseEvent) => {
    const monkeyPosition = monkey.getBoundingClientRect();
    const mouseX = mouseEvent.clientX - monkeyPosition.left;
    const mouseY = mouseEvent.clientY - monkeyPosition.top;
    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    shootDart(angle);
  });

  monkey.addEventListener("mouseup", () => {
    clearInterval(dartInterval);
  });

  startGame();
});
