import express from 'express';
import roll from '../api/rollAndCalc.js'
import { readLoggedIn, updatePlayerScore, readFile} from '../playerDB.js'
import fs from 'fs';


const apiRouter = express.Router();


let currentPlayerIndex = 0;
let gameStarted = false;

/*KODE TIL STARTKNAP*/
apiRouter.post("/api/startGame", (req, res) => {
    gameStarted = true;
    res.json({ success: true });
  });
  
  apiRouter.get("/api/gameStatus", (req, res) => {
    res.json({ gameStarted });
  });
  /*KODE TIL STARTKNAP SLUTTER HER*/ 
   
  /**Kode til timer START */
  let countdownStartTime;
  const countdownDuration = 120; // 2 minutter
  
  apiRouter.post("/api/startCountdown", (req, res) => {
    if (!countdownStartTime) {
      countdownStartTime = Date.now();
    }
    res.json({ success: true });
  });
  
  apiRouter.get("/api/remainingTime", (req, res) => {
    if (!countdownStartTime) {
      return res.json({ remainingTime: countdownDuration });
    }
    const elapsedTime = Math.floor((Date.now() - countdownStartTime) / 1000);
    const remainingTime = countdownDuration - elapsedTime;
    res.json({ remainingTime: remainingTime > 0 ? remainingTime : 0 });
  });
  /**SLUTTER HER */

  apiRouter.post("/api/roll", (req, res) => {
    let toBeRolled = req.body.list1;
    let userState = roll(toBeRolled);
    res.send(userState);
  });
  
  apiRouter.get("/api/allocPoints/:data", async (req, res)=>{
    let splitData = req.params.data.split("-"); //tænker tre data med '-' imellem, point, felt, total
    let points = Number(splitData[0]);
    let field = splitData[1];
    let total = Number(splitData[2]);
  
    let allPlayer = await readFile();
  
    let currentPlayerName = allPlayer[currentPlayerIndex].name;
    
  
    currentPlayerIndex++;
    if(currentPlayerIndex>=allPlayer.length) currentPlayerIndex = 0;
  
    let nextPlayerScores = allPlayer[currentPlayerIndex].scoreVals;
    console.log("NY TEST 4 : " + JSON.stringify(nextPlayerScores));
  
    await updatePlayerScore(currentPlayerName, field, points, total); //req.session.name???
  
    res.send(nextPlayerScores);
  });

  apiRouter.get("/api/playerCount", async (req, res) => {
    const users = await readLoggedIn();
     res.json({ playerCount: users.length });
  });
  
  apiRouter.get("/api/getPlayers", async (req, res)=>{
    const players = await readFile();
    res.send(players);
  });
  
  apiRouter.get("/api/getLoggedIn", async (req, res)=>{
    let temp = await readLoggedIn();
    res.send(temp);
  })
  
  apiRouter.get('/api/getCurrentPlayer', async (req,res) => {
    let currentPlayer = await readFile();
    currentPlayer = currentPlayer[currentPlayerIndex];
    res.send(currentPlayer);
  })

  apiRouter.post("/api/endGame", (req, res) => {
    gameStarted = false;
  
  const filePath = 'players.json';
  
  try {
    fs.writeFileSync(filePath, '[]', 'utf8');
    console.log('Players vanished');
    res.json({ success: true });
  } catch (err) {
    console.error('Error clearing file:', err);
    res.status(500).json({ success: false, message: 'Player still there :(' });
  }
  });

  function getGameStarted(){
    return gameStarted;
  }

export{apiRouter, getGameStarted}