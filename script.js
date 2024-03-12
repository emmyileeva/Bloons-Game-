// Initialize game
document.addEventListener("DOMContentLoaded", function () {
  // Variables to store game state
  let currentScore = 0;
  let balloonsPopped = 0;
  const targetBalloons = 12;

  // cached DOM element
  const monkey = document.getElementById("monkey");
  const dart = document.getElementById("dart");
  const trajectoryPreview = document.getElementById("trajectoryPreview");
  const resetGameButton = document.getElementById("resetGame");

  // dart variables
  let dartIsVisible = false;
  let dartInterval;
  let dartsShot = 0;
  const maxDarts = 10;
  let dartPower = 0;

  // function to start game
  function startGame() {
    currentScore = 0;
    balloonsPopped = 0;
    updateCurrentScore();
  }

  // function for shooting darts
  function darts() {
    if (!dartIsVisible) {
      balloonsPopped++;
      checkLevelComplete();
    }
  }

  //   function to update current score
  function updateCurrentScore() {
    document.querySelector(".current-score").textContent =
      "Current Score: " + currentScore + " balloons";
  }

  //   function to update the balloons popped
  function updateBalloonsPopped() {
    document.querySelector(".balloons").textContent =
      "Balloons Popped: " + balloonsPopped + "/" + targetBalloons;
  }

  // event listener for the button
  resetGameButton.addEventListener("click", resetGame);

  // function to reset game
  function resetGame() {
    currentScore = 0;
    balloonsPopped = 0;
    dartsShot = 0;
    updateCurrentScore();
    updateBalloonsPopped();
    startGame();
    // Show all balloons again
    const balloons = document.querySelectorAll(".balloon");
    balloons.forEach((balloon) => {
      balloon.style.visibility = "visible";
    });
    // hide the balloons popped message
    document.querySelector(".balloons").textContent = "";
  }

  // function to check if level was completed
  function checkLevelComplete() {
    if (balloonsPopped === targetBalloons) {
      alert("Level Complete!");
      resetGame();
    }
  }

  // Function to shoot dart
  function shootDart() {
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
        const trajectoryPreviewPosition =
          trajectoryPreview.getBoundingClientRect();
        // Calculate the angle between the monkey and the trajectory preview
        const angle =
          Math.atan2(
            trajectoryPreviewPosition.top - monkeyPosition.top,
            trajectoryPreviewPosition.left - monkeyPosition.left
          ) *
          (180 / Math.PI);
        const radianAngle = angle * (Math.PI / 180); // Convert angle to radians
        const deltaXActual = dartPower * Math.cos(radianAngle); // calculate horizontal
        const deltaYActual = dartPower * Math.sin(radianAngle); // vertical
        dart.style.left = parseFloat(dart.style.left) + deltaXActual + "px";
        dart.style.top = parseFloat(dart.style.top) + deltaYActual + "px";
        checkCollision(); // Check for collision with balloons
        // check to see if dart has reached the max distance
        if (
          dartPower >=
          Math.max(monkeyPosition.width, monkeyPosition.height) / 2
        ) {
          clearInterval(dartInterval);
          dartIsVisible = false; // reset
          dart.style.visibility = "hidden"; // hide dart
        }
        dartPower += 2; //adjust the dart power
      };
      moveDart();
      dartInterval = setInterval(moveDart, 80);
      darts();
    }
  }
  // function to detect collision of dart and balloon
  function checkCollision() {
    const dartPosition = dart.getBoundingClientRect();
    const balloons = document.querySelectorAll(".balloon");

    balloons.forEach((balloon) => {
      if (balloon.style.visibility !== "hidden") {
        const balloonPosition = balloon.getBoundingClientRect();
        if (isColliding(dartPosition, balloonPosition)) {
          balloon.style.visibility = "hidden"; // Hide the balloon
          currentScore++; // Increment the score
          updateCurrentScore(); // Update the score display
          clearInterval(dartInterval); // Stop the dart movement
          dartIsVisible = false; // Reset dart visibility
        }
      }
    });
  }

  // check for collision
  function isColliding(dart1, balloon1) {
    return !(
      dart1.right < balloon1.left ||
      dart1.left > balloon1.right ||
      dart1.bottom < balloon1.top ||
      dart1.top > balloon1.bottom
    );
  }

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
      event.clientX - (monkeyPosition.left + monkeyPosition.width / 2);
    const mouseY =
      event.clientY - (monkeyPosition.top + monkeyPosition.height / 2);
    // Calculate the angle between the monkey and the mouse cursor
    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
    // Calculate the angle between the trajectory preview and the horizontal axis
    const trajectoryAngle = angle + 180;
    // Set the trajectory preview line's position and rotation relative to the monkey
    trajectoryPreview.style.left =
      monkeyPosition.left + monkeyPosition.width / 2 + "px";
    trajectoryPreview.style.top =
      monkeyPosition.top + monkeyPosition.height / 2 + "px";
    trajectoryPreview.style.transform = `rotate(${angle}deg)`;
    // Set the rotation of the dart to be perpendicular to the trajectory preview
    dart.style.transform = `rotate(${trajectoryAngle}deg)`;
  });

  // Event listener for mouse leaving the monkey
  monkey.addEventListener("mouseleave", () => {
    // Hide the trajectory preview line
    trajectoryPreview.style.display = "none";
  });

  // Event listener for shooting dart when clicking on monkey
  monkey.addEventListener("click", (event) => {
    if (dartsShot < maxDarts && !dartIsVisible) {
      // calculates the position and size of monkey relative to vp
      const monkeyPosition = monkey.getBoundingClientRect();
      // Calculates the position of the trajectory preview relative to the vp
      const mouseX =
        event.clientX - (monkeyPosition.left + monkeyPosition.width / 2);
      const mouseY =
        event.clientY - (monkeyPosition.top + monkeyPosition.height / 2);
      const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
      shootDart(angle);
      dartsShot++; // Increment the number of darts shot
    }
  });

  // Event listener for shooting dart when holding down the mouse button
  monkey.addEventListener("mousedown", (event) => {
    if (dartsShot < maxDarts && !dartIsVisible) {
      // calculates the position and size of monkey relative to vp
      const monkeyPosition = monkey.getBoundingClientRect();
      // Calculates the position of the trajectory preview relative to the vp
      const mouseX =
        event.clientX - (monkeyPosition.left + monkeyPosition.width / 2);
      const mouseY =
        event.clientY - (monkeyPosition.top + monkeyPosition.height / 2);
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
          dartInterval = undefined; // reset the dart interval
        }
      }, 1000); // Start dart throw loop
    }
  });

  // event listen for mouse up
  monkey.addEventListener("mouseup", () => {
    if (dartInterval) {
      clearInterval(dartInterval);
    }
  });
});
