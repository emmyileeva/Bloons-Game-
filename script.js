// variable to store game state
let currentScore = 0;
let balloonsPopped = 0;
const targetBalloons = 50; //update this if I want to adjust the target goal

// function to start game
function startGame() {
  // resetting the score count and balloons popped count
  currentScore = 0;
  balloonsPopped = 0;
  updateCurrentScore();
}

// function for shooting darts
function darts() {
  // go up score by 1 for each balloon popped
  currentScore++;
  balloonsPopped++;

  updateCurrentScore();
  updateBalloonsPopped();
  checkLevelComplete();
}

// function to update current score
function updateCurrentScore() {
  document.querySelector(".current-score").textContent =
    "Current Score: " + currentScore + "balloons";
}

// function to update the balloons popped
function updateBalloonsPopped() {
  document.querySelector(".balloons").textContent =
    "Balloons Popped: " + balloonsPopped + "/" + targetBalloons;
}

// function to reset game
function resetGame() {
  startGame();
}

// function for back to main menu button
function backToMainMenu() {
  // redirection to main menu
  window.location.href = "index.html";
}

// function to check if level was completed
function checkLevelComplete() {
  if (balloonsPopped >= targetBalloons) {
    alert("Level Complete!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // monkey element and dart element
  const monkey = document.getElementById("monkey");
  const dart = document.getElementById("dart");
  // variables
  let dartIsVisible = false;
  let dartPower = 0;
  let dartInterval;
  // variables to track darts already used
  let dartsShot = 0;
  const maxDarts = 5;

  // Get the trajectory preview element
  const trajectoryPreview = document.getElementById("trajectoryPreview");

  // Event listener for mouse hover on the monkey
  monkey.addEventListener("mouseover", () => {
    // Show the trajectory preview line
    trajectoryPreview.style.display = "block";
  });

  // Event listener for mouse move on the monkey
  monkey.addEventListener("mousemove", (event) => {
    // Calculate the position of the monkey relative to the viewport
    const monkeyPosition = monkey.getBoundingClientRect();

    // Calculate the position of the mouse relative to the monkey
    const mouseX =
      event.clientX - monkeyPosition.left - monkeyPosition.width / 2;
    const mouseY =
      event.clientY - monkeyPosition.top - monkeyPosition.height / 2;

    // Calculate the angle between the monkey and the mouse cursor
    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    // Set the trajectory preview line's position and rotation relative to the monkey
    trajectoryPreview.style.left =
      monkeyPosition.left + monkeyPosition.width / 2 + "px";
    trajectoryPreview.style.top =
      monkeyPosition.top + monkeyPosition.height / 2 + "px";
    trajectoryPreview.style.transform = `rotate(${angle}deg)`;
  });

  // Event listener for mouse leaving the monkey
  monkey.addEventListener("mouseleave", () => {
    // Hide the trajectory preview line
    trajectoryPreview.style.display = "none";
  });

  // Function to shoot dart
  function shootDart(angle) {
    dartPower = 0; // reset the dart power
    if (!dartIsVisible) {
      // check if dart is visible
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

      const moveDart = () => {
        dartPower += 10; //adjust the dart power
        const radianAngle = angle * (Math.PI / 180); // Convert angle to radians
        const deltaX = dartPower * Math.cos(radianAngle); // Calculate horizontal distance
        const deltaY = dartPower * Math.sin(radianAngle); // vertical 
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

        // if (dartPower >= monkeyPosition.top) {
        if (
          dartPower >=
          Math.max(monkeyPosition.width, monkeyPosition.height) / 2
        ) {
          clearInterval(dartInterval);
          dartIsVisible = false; // reset
          dart.style.visibility = "hidden"; // hide dart
        }
      };
      moveDart();
      dartInterval = setInterval(moveDart, 30);
    }
  }

  // Event listener for shooting dart when clicking on monkey
  monkey.addEventListener("click", (e) => {
    if (dartsShot < maxDarts && !dartIsVisible) {
      // calculates the position and size of monkey relative to vp
      const monkeyPosition = monkey.getBoundingClientRect();
      // calculates the angle between the mouse pointer and the center of monkey
      const mouseX = e.clientX - monkeyPosition.left - monkeyPosition.width / 2;
      const mouseY = e.clientY - monkeyPosition.top - monkeyPosition.height / 2;
      const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

      shootDart(angle);
      dartsShot++; // Increment the number of darts shot
    }
  });

  // Event listener for shooting dart when holding down the mouse button
  monkey.addEventListener("mousedown", (mouseEvent) => {
    if (dartsShot < maxDarts && !dartIsVisible) {
      // Calculate the angle between the monkey and the mouse cursor
      const monkeyPosition = monkey.getBoundingClientRect();
      const mouseX = mouseEvent.clientX - monkeyPosition.left;
      const mouseY = mouseEvent.clientY - monkeyPosition.top;
      const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
      // shoot the dart right away
      shootDart(angle);
      dartsShot++; // Increment the number of darts shot

      dartInterval = setInterval(() => {
        if (dartsShot < maxDarts) {
          shootDart(angle);
          dartsShot++; // Increment the number of darts shot
        } else {
          clearInterval(dartInterval); // Stop dart throw loop if max darts reached
        }
      }, 100); // Start dart throw loop
    }
  });

  monkey.addEventListener("mouseup", () => {
    clearInterval(dartInterval);
  });
});
