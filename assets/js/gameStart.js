document.addEventListener("DOMContentLoaded", function() {
  const startButton = document.getElementById('startButton');

  if (startButton) {
    startButton.addEventListener('click', () => {
      fetch('/api/startGame', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            window.location.href = '/';
          }
        });
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

  setInterval(checkGameStatus, 5000);
  checkGameStatus();
});