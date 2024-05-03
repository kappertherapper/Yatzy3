import fs, { read } from 'fs';

async function readFile() {
    let fileContent = await fs.promises.readFile("players.json", {encoding: 'utf-8'});
    //console.log(fileContent);
    return JSON.parse(fileContent);
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

async function initPlayersJSON2(){
    let wasCreated = false;

    await fs.promises.readFile("players.json", {encoding: 'utf-8'}, (err, data)=>{
        if(err){
            console.log("The error" + err);

            wasCreated = true;

            fs.open('mynewfile2.txt', 'w', function (err2, file) {
                if (err2) throw err;
                if(file){
                    
                }
              }); 

            console.log("Initialized players.json");
        }else {
            console.log("players.json found");
        }
    });

    if(wasCreated){
        addPlayer({name: "Player One", loggedIn: false});
        addPlayer({name: "Player Two", loggedIn: false});
    }
}

async function initPlayersJSON(){
    await fs.promises.readFile("players.json", {encoding: 'utf-8'})
    .then((...args)=>{
        console.log("players.json already initialized.");
    })
    .catch((...args)=>{
        fs.write("players.json", '[{name: "Player One", loggedIn: false}, {name: "Player Two", loggedIn: false}]', (err)=>{
            if(err) console.log(err);
            console.log("players.json");
        })
        
    })

    
}

export {readFile, addPlayer, loginAllowed, doesPlayerExist,logPlayerIn, logEveryoneOut, readLoggedIn, initPlayersJSON}