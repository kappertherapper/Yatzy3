import fs, { read } from 'fs';

async function readFile() {
    let fileContent = await fs.promises.readFile("players.json", {encoding: 'utf-8'});
    //console.log(fileContent);
    return JSON.parse(fileContent);
}

function createPlayerObject(name){
    return {name: name, loggedIn: false,
        scoreVals: {
            dicevals: [6, 6, 6, 6, 6],
            ones: -1,
            twos:  -1,
            threes:  -1,
            fours:  -1,
            fives:  -1,
            sixes:  -1,
            onePair:  -1,
            twoPairs:  -1,
            threeSame:  -1,
            fourSame:  -1,
            fullHouse:  -1,
            smallStraight:  -1,
            largeStraight:  -1,
            chance:  -1,
            yatzy:  -1,
            total: 0
            }
    };
}

async function updatePlayerScore(name, field, point, total){
    let currentDB = await readFile();

    let playerIndex = -1;

    for(let i = 0 ; i<currentDB.length ; i++){
        if(currentDB[i].name==name) playerIndex = i;
    }

    if(playerIndex==-1){
        console.log("EROOR player not found");
        return undefined;
    }

    console.log("Test204: " + field + " " + point);

    Object.defineProperty(currentDB[playerIndex].scoreVals, field, {value: point, writable: true});
    Object.defineProperty(currentDB[playerIndex].scoreVals, "total", {value: total, writable: true});

    let existingPlayer = JSON.stringify(currentDB);
    await fs.promises.writeFile("players.json", existingPlayer, {encoding: "utf-8"});
}

async function addPlayer(playerObject) {
    let existingPlayer = await readFile();
    existingPlayer.push(playerObject);
    existingPlayer = JSON.stringify(existingPlayer);
    await fs.promises.writeFile("players.json", existingPlayer, {encoding: "utf-8"})
}

async function doesPlayerExist(name) {
    let players = await readFile()
    for(let player of players) {
        if(player.name == name) {
            return true;
        }
    }
    return false;
}

async function loginAllowed(name) {
    let players = await readFile();
    for(let player of players) {
        if(player.name == name && !player.loggedIn) {
            return true;
        }
    }
    return false;
}

//Assumes login allowed
async function logPlayerIn(name){
    let players = await readFile();
    for (let player of players) {
      if (player.name == name) player.loggedIn=true;
    }
    let existingPlayer = JSON.stringify(players);
    await fs.promises.writeFile("players.json", existingPlayer, {
      encoding: "utf-8",
    });
}

async function logEveryoneOut(){
    let players = await readFile();

    for(let player of players){
        player.loggedIn = false;
    }

   let existingPlayer = JSON.stringify(players);
    await fs.promises.writeFile("players.json", existingPlayer, {
      encoding: "utf-8",
    });
}

async function readLoggedIn() {
    const jsonData = await readFile();
    let loggedInUsers = jsonData.filter(user => user.loggedIn)
    return loggedInUsers;
}


async function initPlayersJSON(){
   await fs.promises.readFile("players.json", {encoding: 'utf-8'})
    .then((...args)=>{
        console.log("players.json already initialized.");
    })
    .catch((...args)=>{
        let defaultPlayers = [createPlayerObject("Player One"), createPlayerObject("Player Two")]

        fs.writeFile("players.json", JSON.stringify(defaultPlayers), (err)=>{
            if(err) console.log(err);
            else console.log("players.json initialized");
        })
    })
}


async function playerCount() {
    const users = await readLoggedIn();
    let playerCount = users.length;

    return playerCount;
}


export {readFile, addPlayer, loginAllowed, doesPlayerExist,logPlayerIn, logEveryoneOut, readLoggedIn, initPlayersJSON, createPlayerObject, playerCount, updatePlayerScore}