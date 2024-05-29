let diceSum = [0, 0, 0, 0, 0, 0];

let scoreVals = {
  dicevals: [6, 6, 6, 6, 6],
  ones: -1,
  twos: -1,
  threes: -1,
  fours: -1,
  fives: -1,
  sixes: -1,
  onePair: -1,
  twoPairs: -1,
  threeSame: -1,
  fourSame: -1,
  fullHouse: -1,
  smallStraight: -1,
  largeStraight: -1,
  chance: -1,
  yatzy: -1,
};

//holder styr på held terninger hos client
function roll(toBeRolled) {
  for (let i = 0; i < 5; i++) {
    if (toBeRolled[i]) scoreVals.dicevals[i] = Math.ceil(Math.random() * 6);
  }

  sumDice();
  taxEvasion();
  onePair();
  twoPair();
  threeSame();
  fourSame();
  fullHouse();
  smallStraight();
  largeStraight();
  chance();
  yatzy();

  diceSum = [0, 0, 0, 0, 0, 0];

  return scoreVals;
}

function sumDice() {
  let values = scoreVals.dicevals; //Tæller frekvensen af terninge øjne
  for (let i of values) {
    diceSum[i - 1]++;
  }
}

function onePair() {
  let maxPair = 0;
  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 1) maxPair = i + 1;
  }
  scoreVals.onePair = maxPair * 2;
}

function twoPair() {
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

  scoreVals.twoPairs = 0;
  if (maxPair1 != 0 && maxPair2 != 0)
    scoreVals.twoPairs = maxPair1 * 2 + maxPair2 * 2;
}

function threeSame() {
  scoreVals.threeSame = 0;
  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 2) scoreVals.threeSame = (i + 1) * 3;
  }
}

function fourSame() {
  scoreVals.fourSame = 0;
  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 3) scoreVals.fourSame = (i + 1) * 4;
  }
}

function yatzy() {
  scoreVals.yatzy = 0;
  for (let i = 0; i < 6; i++) {
    if (diceSum[i] > 4) scoreVals.yatzy = (i + 1) * 5;
  }
}

function taxEvasion() {
  scoreVals.ones = diceSum[0] * 1;
  scoreVals.twos = diceSum[1] * 2;
  scoreVals.threes = diceSum[2] * 3;
  scoreVals.fours = diceSum[3] * 4;
  scoreVals.fives = diceSum[4] * 5;
  scoreVals.sixes = diceSum[5] * 6;
}

function chance() {
  let sumChance = 0;
  for (let i = 0; i < 6; i++) {
    sumChance += diceSum[i] * (i + 1);
  }

  scoreVals.chance = sumChance;
}

function fullHouse() {
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

  scoreVals.fullHouse = 0;
  if (threeSame != 0 && onePair != 0) {
    scoreVals.fullHouse = onePair * 2 + threeSame * 3;
  }
}

function smallStraight() {
  let temp = true;

  for (let i = 0; i < 5; i++) {
    if (diceSum[i] != 1) {
      temp = false;
    }
  }

  scoreVals.smallStraight = 0;
  if (temp) {
    scoreVals.smallStraight = 15;
  }
}

function largeStraight() {
  let temp = true;

  for (let i = 1; i < 6; i++) {
    if (diceSum[i] != 1) {
      temp = false;
    }
  }

  scoreVals.largeStraight = 0;
  if (temp) {
    scoreVals.largeStraight = 20;
  }
}

export default roll;
