const diceMap = new Map();

for (let i = 1; i <= 5; i++) {
  let temp = document.createElement("img");
  temp.id = "diceImg" + i;
  temp.className = "diceImg";
  //temp.src= `https://www.media4math.com/sites/default/files/library_asset/images/MathClipArt--Single-Die-with-${i}-Showing.png`
  temp.src = `Dices/blankDice.jpg`;
  diceMap.set(temp, i);
  diceDiv.appendChild(temp);
}

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
btnRoll.addEventListener("click", () => {
  if (turnCounter == 0) unholdAllDice(); // Hvis en person har valgt at holde de blanke dice, så unholdes de her
  // Opdaterer kun terninger, der ikke er holdt
  document.querySelectorAll(".diceImg").forEach((dice, index) => {
    if (!dice.classList.contains("held")) {
      // Hvis terningen ikke er holdt
      let randomNum = Math.ceil(Math.random() * 6);
      dice.src = `Dices/Dice-${randomNum}.png`; // Opdater terningens billede
      diceMap.set(dice, randomNum);
    }
  });
  displayScores();

  if (turnCounter == 2) {
    //Tillad kast, hvis turnCounter er mindre end 3
    btnRoll.disabled = "true";
  }
  incrementTurn();
});

let diceSum = [0, 0, 0, 0, 0, 0];

function sumDice() {
  //Tæller frekvensen af terninge øjne
  let values = diceMap.values();
  for (i of values) {
    diceSum[i - 1]++;
  }
}

function onePair() {
  const opInput = document.getElementById("One pair");
  if (opInput.disabled) return;

  let maxPair = 0;
  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 1) maxPair = i + 1;
  }
  opInput.value = maxPair * 2;
}

function twoPair() {
  const tpInput = document.getElementById("Two pairs");
  if (tpInput.disabled) return;

  let maxPair1 = 0;
  let maxPair2 = 0;

  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 1 && maxPair1 == 0) maxPair1 = i + 1;
    else if (diceSum[i] > 1 && maxPair2 == 0) maxPair2 = i + 1;
    else if (diceSum[i] > 3) {
      maxPair1 = i + 1;
      maxPair2 = i + 1;
    }
  }

  tpInput.value = maxPair1 * 2 + maxPair2 * 2;
}

function threeSame() {
  const tsInput = document.getElementById("Three same");
  if (tsInput.disabled) return;

  tsInput.value = 0;
  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 2) tsInput.value = (i + 1) * 3;
  }
}

function fourSame() {
  const fsInput = document.getElementById("Four same");
  if (fsInput.disabled) return;

  fsInput.value = 0;
  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 3) fsInput.value = (i + 1) * 4;
  }
}

function yatzy() {
  const yInput = document.getElementById("Yatzy");
  if (yInput.disabled) return;

  yInput.value = 0;
  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 4) yInput.value = (i + 1) * 5;
  }
}

function taxEvasion() {
  for (let i = 1; i <= 6; i++) {
    let tempInput = document.getElementById(`${i}-s`);
    if (tempInput.disabled) continue;

    tempInput.value = diceSum[i - 1] * i;
  }
}

function chance() {
  const cInput = document.getElementById("Chance");
  if (cInput.disabled) return;

  let sumChance = 0;
  for (let i = 0; i < 6; i++) {
    sumChance += diceSum[i] * (i + 1);
  }

  cInput.value = sumChance;
}

function fullHouse() {
  const fhInput = document.getElementById("Full house");
  if (fhInput.disabled) return;

  let onePair = 0;
  let threeSame = 0;

  for (let i = 0; i < 6; i++) {
    if (diceSum[i] == 3) {
      threeSame = i + 1;
    }
    if (diceSum[i] == 2) {
      onePair = i + 1;
    }
  }

  fhInput.value = 0;
  if (threeSame != 0 && onePair != 0) {
    fhInput.value = onePair * 2 + threeSame * 3;
  }
}

function smallStraight() {
  const ssInput = document.getElementById("Small straight");
  if (ssInput.disabled) return;

  let temp = true;

  for (let i = 0; i < 5; i++) {
    if (diceSum[i] != 1) {
      temp = false;
    }
  }

  ssInput.value = 0;
  if (temp) {
    ssInput.value = 15;
  }
}

function largeStraight() {
  const lsInput = document.getElementById("Large straight");
  if (lsInput.disabled) return;

  let temp = true;

  for (let i = 1; i < 6; i++) {
    if (diceSum[i] != 1) {
      temp = false;
    }
  }

  lsInput.value = 0;
  if (temp) {
    lsInput.value = 20;
  }
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
      btnRoll.click();
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

function displayScores() {
  sumDice();
  onePair();
  twoPair();
  taxEvasion();
  threeSame();
  fourSame();
  yatzy();
  chance();
  fullHouse();
  smallStraight();
  largeStraight();
  updateSum();

  diceSum = [0, 0, 0, 0, 0, 0];
}

function resetScores() {
  diceSum = [0, 0, 0, 0, 0, 0];

  onePair();
  twoPair();
  taxEvasion();
  threeSame();
  fourSame();
  yatzy();
  chance();
  fullHouse();
  smallStraight();
  largeStraight();
  updateSum();
}

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
