import fs, { read } from 'fs';

async function readFile() {
    let fileContent = await fs.promises.readFile("players.json", {encoding: 'utf-8'});
    //console.log(fileContent);
    return JSON.parse(fileContent);
}

function createPlayerObject(name){
    return {name: name, loggedIn: false};
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

export {readFile, addPlayer, loginAllowed, doesPlayerExist,logPlayerIn, logEveryoneOut, readLoggedIn, initPlayersJSON, createPlayerObject}