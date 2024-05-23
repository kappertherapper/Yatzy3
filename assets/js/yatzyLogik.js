
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
   toBeRolled[index] = !dice.classList.contains("held");
  });
  //displayScores();

  const sendData = {list1: toBeRolled};
  //console.log("TSET: " + JSON.stringify(sendData));
  //console.log("TEST2: " + sendData.list1);

  const scoresRaw = await fetch('http://localhost:6969/api/roll', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sendData)
  });
  const userState = await scoresRaw.json();

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
      dice.src = `images/Dice-${diceValues[index]}.png`;
    }
  });
}

function updateScoresOnAlloc(userState){
    let scoreServer = Object.values(userState);

    document.querySelectorAll(".inputs").forEach((input1, index)=>{
          let newVal = scoreServer[index+1];
          input1.value = newVal==-1? 0: newVal;  //plus 2 er fra scorCalc's userState
          
          if(newVal!=-1) {
            input1.disabled=true;
            input1.style.backgroundColor="lightgrey";
          }
    });

    let totalInput = document.querySelector("#totalInput");
    totalInput.value = scoreServer[16];


}

function updateScores(userState){
  let scoreServer = Object.values(userState);

  document.querySelectorAll(".inputs").forEach((input1, index)=>{
        if(!input1.disabled){
          input1.value = scoreServer[index+1];
        }
  });
}

function resetScores(){
  document.querySelectorAll(".inputs").forEach((input1, index)=>{
    if(!input1.disabled) input1.value= 0;
});
}

function totalReset(){
  document.querySelectorAll(".inputs").forEach((input1, index)=>{
    input1.disabled ="";
    input1.value=0;
    input1.style.backgroundColor="white";
  })

  let totalInput = document.querySelector("#totalInput");
  totalInput.value = 0;
}

const input = document.querySelectorAll(".inputs");
input.forEach((element, index) => {
  element.addEventListener("click", async () => {
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

      let translationTable = ["ones",
        "twos",
        "threes",
        "fours",
        "fives",
        "sixes",
        "onePair",
        "twoPairs",
        "threeSame",
        "fourSame",
        "fullHouse",
        "smallStraight",
        "largeStraight",
        "chance",
        "yatzy"];

        let totalVal = document.getElementById("totalInput").value;

        //console.log("Test45; " + index + " " + translationTable[index]);

      let tempCrap = await fetch(`http://localhost:6969/api/allocPoints/${element.value}-${translationTable[index]}-${totalVal}`);

      let nextPlayerScores = await tempCrap.json();

      console.log("HELT NY TEST: " + JSON.stringify(nextPlayerScores));
      totalReset();
      updateScoresOnAlloc(nextPlayerScores);

      

      //resetScores();
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
    dice.src = `images/blankDice.png`;
  });
}

function unholdAllDice() {
  let dice = document.querySelectorAll(".diceImg");
  for (let die of dice) {
    die.classList.remove("held");
  }
}
