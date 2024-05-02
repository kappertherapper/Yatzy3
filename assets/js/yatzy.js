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
  temp.src = `Dices/blankDice.png`;
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
