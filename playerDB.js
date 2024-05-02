import fs from 'fs';

async function readFile() {
    let fileContent = await fs.promises.readFile("players.json", {encoding: 'utf-8'});
    return JSON.parse(fileContent);
}

async function addPlayer(playerObject) {
    let existingPlayer = await readFile();
    existingPlayer.push(playerObject);
    existingPlayer = JSON.stringify(existingPlayer);
    await fs.promises.writeFile("players.json", existingPlayer, {encoding: "utf-8"})
}

function doesPlayerExist(name) {
    let players = readFile()
    for(let player of players) {
        if(player.name == name) {
            return true;
        }
    }
    return false;
}

function loginAllowed(name) {
    let players = readFile();
    for(let player of players) {
        if(player.name == name && !player.loggedIn) {
            return true;
        }
    }
    return false;
}

//Assumes login allowed
async function logPlayerIn(name){
    let players = readFile();
    for (let player of players) {
      if (player.name == name) player.loggedIn=true;
    }
    existingPlayer = JSON.stringify(players);
    await fs.promises.writeFile("players.json", existingPlayer, {
      encoding: "utf-8",
    });


}

export {readFile, addPlayer, loginAllowed, doesPlayerExist,logPlayerIn}