
function incrementTurn() {
  if (turnCounter < 3) {
    turnCounter++;
  } else {
    turnCounter = 0;
    resetHeldDices(); //=> nulstille holdte terninger
  }

  paragraphTurn.innerText = "Turn: " + turnCounter;
}

document.querySelectorAll(".diceImg").forEach((dice) => {
  dice.addEventListener("click", function () {
    // Skifter "held" klassen for at markere terningen som holdt/frigivet
    this.classList.toggle("held");
  });
});

// Opdater din btnRoll event listener
btnRoll.addEventListener("click", async () => {
  if (turnCounter == 0) unholdAllDice(); // Hvis en person har valgt at holde de blanke dice, så unholdes de her
  // Opdaterer kun terninger, der ikke er holdt

  const toBeRolled = [];

  document.querySelectorAll(".diceImg").forEach((dice, index) => {
    //toBeRolled.push[!dice.classList.contains("held")];
    if (!dice.classList.contains("held")) {
      toBeRolled.push(true);
    }else toBeRolled.push(false);
  });
  //displayScores();

  const sendData = {list1: toBeRolled};
  console.log("TSET: " + JSON.stringify(sendData));
  console.log("TEST2: " + sendData.list1);

  const scoresRaw = await fetch('http://localhost:6969/api/roll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sendData)
  });
  const userState = await scoresRaw.json();

  console.log("TEST: " + JSON.stringify(userState));

  updateDiceImgs(userState.dicevals);

  updateScores(userState);

  if (turnCounter == 2) {
    //Tillad kast, hvis turnCounter er mindre end 3
    btnRoll.disabled = "true";
  }
  incrementTurn();
});

function updateDiceImgs(diceValues){
  document.querySelectorAll(".diceImg").forEach((dice, index) => {
    if (!dice.classList.contains("held")) {
      dice.src = `Dices/Dice-${diceValues[index]}.png`;
    }
  });
}

function updateScores(userState){
    let scoreServer = Object.values(userState);

    document.querySelectorAll(".inputs").forEach((input1, index)=>{
        if(!input1.disabled) input1.value= scoreServer[index+1]; //plus 2 er fra scorCalc's userState
    });
}

function resetScores(){
  document.querySelectorAll(".inputs").forEach((input1, index)=>{
    if(!input1.disabled) input1.value= 0;
});
}

const input = document.querySelectorAll("input");
input.forEach((element) => {
  element.addEventListener("click", () => {
    if (
      element.id != "totalInput" &&
      element.id != "sumInput" &&
      element.id != "bonusInput"
    ) {
      let numbertemp = document.getElementById("totalInput").value;
      if (Number(element.value) == 0) {
        //Hvis brugeren IKKE vil have nul, point, man kan blive nødt til, senere...
        if (!confirm("Dette felt er nul point, er du sikker på dit valg?"))
          return;
      }
      document.getElementById("totalInput").value =
        Number(element.value) + Number(numbertemp);
      element.disabled = true;
      element.style.backgroundColor = "lightgrey";
      //btnRoll.click();
      btnRoll.disabled = "";
      turnCounter = 0;
      paragraphTurn.innerText = "Turn: " + turnCounter;
      resetScores();
      blankDiceDisplay();
      unholdAllDice();
      gameDone();
    }
  });
});

function updateSum() {
  let inputSums = document.querySelectorAll("input");

  let summen = 0;

  for (let i = 0; i <= 5; i++) {
    if (inputSums[i].disabled) summen += Number(inputSums[i].value);
  }
  document.getElementById("sumInput").value = summen;

  updateBonus();
}

function updateBonus() {
  let sumTal = document.getElementById("sumInput").value;

  let bonusValue = document.getElementById("bonusInput").value;

  if (sumTal >= 63 && bonusValue == 0) {
    //Ideen er at hvis bonussen forekommer lægges den kun til total én gang
    document.getElementById("bonusInput").value = 50;
    let temp12312 = Number(document.getElementById("totalInput").value);
    document.getElementById("totalInput").value = 50 + temp12312;
  }
}

function blankDiceDisplay() {
  document.querySelectorAll(".diceImg").forEach((dice) => {
    dice.src = `Dices/blankDice.jpg`;
  });
}

function gameDone() {
  let inputs = document.querySelectorAll("input");

  let isDone = true;

  for (let input of inputs) {
    if (
      input.id != "totalInput" &&
      input.id != "bonusInput" &&
      input.id != "sumInput"
    ) {
      if (!input.disabled) isDone = false; //Hvis ét input ikke er disabled, så er spillet ikke færdig
    }
  }

  let gameResult = document.getElementById("totalInput").value;
  let newGame = false;
  if (isDone) {
    newGame = confirm(
      "Spillet er færdig! Du fik " +
        gameResult +
        " point! \n" +
        "Tryk på OK for at starte et nyt spil, Cancel for at lukke Yatzy."
    );

    if (!newGame) close();
    else location.reload();
  }
}

function unholdAllDice() {
  let dice = document.querySelectorAll(".diceImg");
  for (let die of dice) {
    die.classList.remove("held");
  }
}
