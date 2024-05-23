document.addEventListener("DOMContentLoaded", function() {
  const timerElement = document.getElementById('timer');
  let countdownInterval;

  // Formater tiden til mm:ss
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }


  function updateTimer(remainingTime) {
    remainingTime--;
    timerElement.textContent = formatTime(remainingTime);

    // Et check om countdown er færdig
    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      window.location.href = '/'; // Redirect '/' fordi yatzy er på endpoint '/'
    }

    return remainingTime;
  }


  function startCountdown() {
    fetch('/api/remainingTime')
      .then(response => response.json())
      .then(data => {
        let remainingTime = data.remainingTime;

        if (remainingTime > 0 && !countdownInterval) {
          // Opdaterer timeren hvert sekundt
          countdownInterval = setInterval(() => {
            remainingTime = updateTimer(remainingTime);
          }, 1000);
          // starter timer display
          timerElement.textContent = formatTime(remainingTime);
        }
      });
  }

  function checkPlayerCount() {
    fetch('/api/playerCount')
      .then(response => response.json())
      .then(data => {
        if (data.playerCount >= 2) {
          // Sørger for at countdownen er startet, hvis den ikke er startet
          fetch('/api/startCountdown', { method: 'POST' });
          startCountdown();
        }
      });
  }

  function checkGameStatus() {
    fetch('/api/gameStatus')
      .then(response => response.json())
      .then(data => {
        if (data.gameStarted) {
          window.location.href = '/';
        }
      });
  }

  // Tjekker spiller antallet hvert 5. sekundt
  setInterval(checkPlayerCount, 5000);
  checkPlayerCount();
  setInterval(checkGameStatus, 5000);
  checkGameStatus();

 
});
