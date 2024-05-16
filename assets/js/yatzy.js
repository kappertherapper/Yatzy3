let outerGrid = document.createElement("div");
outerGrid.id = "outer-grid";

let diceDiv = document.createElement("div");
diceDiv.id = "dice-div";

let scoreDiv = document.createElement("div");
scoreDiv.id = "score-div";

document.body.appendChild(outerGrid);
outerGrid.appendChild(diceDiv);
outerGrid.appendChild(scoreDiv);

let turnCounter = 0;

for (let i = 1; i <= 5; i++) {
  let temp = document.createElement("img");
  temp.id = "diceImg" + i;
  temp.className = "diceImg";
  //temp.src= `https://www.media4math.com/sites/default/files/library_asset/images/MathClipArt--Single-Die-with-${i}-Showing.png`
  temp.src = `images/blankDice.png`;
  diceDiv.appendChild(temp);
}

let paragraphTurn = document.createElement("p");
paragraphTurn.id = "para-turn";
paragraphTurn.innerText = "Turn: " + turnCounter;
diceDiv.appendChild(paragraphTurn);



for(let i = 0 ; i<3 ; i++){
  diceDiv.appendChild(document.createElement("p"))
}

let btnRoll = document.createElement("button");
btnRoll.innerText = "Roll";
btnRoll.id="btnRoll";
btnRoll.style.marginLeft = "70%";
diceDiv.appendChild(btnRoll);

let scoreList = [];

for (let i = 0; i < 18; i++) {
  scoreList[i] = 0;
}

let names = [
  "1-s",
  "2-s",
  "3-s",
  "4-s",
  "5-s",
  "6-s",
  "One pair",
  "Two pairs",
  "Three same",
  "Four same",
  "Full house",
  "Small straight",
  "Large straight",
  "Chance",
  "Yatzy",
];

for (let i = 1; i <= 15; i++) {
  let tempPara = document.createElement("p");
  tempPara.textContent = names[i - 1];
  tempPara.className = "paraDiv";

  let tempInput = document.createElement("input");
  tempInput.id = names[i - 1];
  tempInput.className = "inputs";
  tempInput.value = 0;

  scoreDiv.appendChild(tempPara);
  scoreDiv.appendChild(tempInput);

  if (i != 6 && i != 15) {
    scoreDiv.appendChild(document.createElement("p"));
    scoreDiv.appendChild(document.createElement("p"));
    scoreDiv.appendChild(document.createElement("p"));
    scoreDiv.appendChild(document.createElement("p"));
  } else if (i == 6) {
    let inputSum = document.createElement("input");
    let inputBonus = document.createElement("input");
    inputSum.id = "sumInput";
    inputBonus.id = "bonusInput";

    inputSum.value=0;
    inputBonus.value=0;

    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    p1.textContent = "Sum: ";
    p2.textContent = "Bonus: ";

    scoreDiv.appendChild(p1);
    scoreDiv.appendChild(inputSum);
    scoreDiv.appendChild(p2);
    scoreDiv.appendChild(inputBonus);
  } else if (i == 15) {
    let inputTotal = document.createElement("input");
    inputTotal.id = "totalInput";
    inputTotal.value="0";

    let p = document.createElement("p");
    p.textContent = "Total: ";

    scoreDiv.appendChild(document.createElement("p"));
    scoreDiv.appendChild(document.createElement("p"));
    scoreDiv.appendChild(p);
    scoreDiv.appendChild(inputTotal);
  }
}

document.querySelectorAll("input").forEach((e) => {
  e.readOnly = "true";
  e.setAttribute("tabindex", -1);
});

//Scoreboard
async function createScoreBoard(){
let scoreboardDiv = document.createElement("div");
scoreboardDiv.id = "scoreboard-div";

let scoreboardHeading = document.createElement("h2");
scoreboardHeading.id = "scoreboard-heading";
scoreboardHeading.textContent = "Scoreboard";
scoreboardDiv.appendChild(scoreboardHeading);

let players = await fetch("http://localhost:6969/api/getPlayers");
players = await players.json();

players.forEach((player) => {
    let playerScore = document.createElement("p");
    playerScore.id="playerParagraph";

    playerScore.textContent = player.name + ": " + player.scoreVals.total;
    scoreboardDiv.appendChild(playerScore);
    scoreboardDiv.appendChild(document.createElement("br"));
});

document.body.appendChild(scoreboardDiv);
}

async function updateScoreBoard(){
  let playerParas = document.querySelectorAll("#playerParagraph");
  

  let players = await fetch("http://localhost:6969/api/getPlayers");
  players = await players.json();

//console.log("TESt34234: " + JSON.stringify(players));

players.forEach((player, index) => {
    let temp = playerParas[index];
    //console.log("TSET NY: " + JSON.stringify(playerParas));
    temp.textContent = player.name + ": " + player.scoreVals.total;
});
}


document.addEventListener("DOMContentLoaded", async()=> await createScoreBoard());

setInterval(updateScoreBoard, 1000);


  //let div = document.createElement("div");
  //div.style.display ="inline";
  let h1 = document.createElement('h1');
  let h2 = document.createElement("h2");
  h1.className="playerTurnHeader";
  h1.textContent= "PLAYER TURN";
  h2.className="currentPlayerHeader";
 
  outerGrid.prepend(h2);
  outerGrid.prepend(h1);
  
  //div.appendChild(h1);


async function updatePlayerShown() {
  let h2Temp = document.querySelector(".currentPlayerHeader");
  let loggedInPlayers = await fetch("http://localhost:6969/api/getCurrentPlayer");
  loggedInPlayers = await loggedInPlayers.json();

  h2.innerHTML = loggedInPlayers.name;
}

setInterval(updatePlayerShown, 500);



function determineWinner(players) {
  if (players.length === 0) {
      return null; 
  }

  let maxScore = -Infinity;
  let winner = null;

  players.forEach(player => {
      if (player.scoreVals.total > maxScore) {
          maxScore = player.scoreVals.total;
          winner = player.name;
      } else if (player.scoreVals.total === maxScore) {
          winner = null; //Draw 
      }
  });

  return winner;
}

//Gameover button
document.addEventListener('DOMContentLoaded', function() {
  const gameOverBtn = document.createElement('gameOverBtn');
  gameOverBtn.id = 'gameOverBtn';
  gameOverBtn.textContent = 'Game Over';

  gameOverBtn.addEventListener('click', async function() {
    try {
        const response = await fetch("http://localhost:6969/api/getPlayers");
        const players = await response.json();

        const winner = determineWinner(players);
        const winnerMessage = winner ? `Winner: ${winner}` : "It's a draw!";
        const playerScores = players.map(player => `${player.name}: ${player.scoreVals.total}`).join('\n');
        const confirmMessage = `Game Over\n\n ${winnerMessage} \n\nFinal Scores:\n${playerScores}`;

        await showConfirmation(confirmMessage);
        
    } catch (error) {
        console.error("Error player data nun:", error);
    }
});

  function showConfirmation(message) {
    if (window.confirm(message)) {
        console.log('Gameover confirmed. Closing game over dialog.');
    } else {
        console.log('Gameover canceled. Game over dialog remains open.');
    }
}

  document.body.appendChild(gameOverBtn);
});





