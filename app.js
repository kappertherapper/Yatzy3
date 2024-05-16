import express from 'express';
import session from 'express-session';
import {addPlayer, loginAllowed, doesPlayerExist, logPlayerIn, logEveryoneOut, readLoggedIn, initPlayersJSON, createPlayerObject, playerCount, updatePlayerScore, readFile} from './playerDB.js'
import roll from './api/rollAndCalc.js'


const app = express();
app.set("view engine", "pug");

app.use(express.urlencoded({extended: true}))
app.use(express.static('./assets')) //ændring maybe? ;)
app.use(express.json());

let currentPlayerIndex = 0;
let gameStarted = false;
let queue = [];
let playerInGame = [];



app.use(session({
  secret: '2EFA4E9B-26FE-4D2A-94FA-D51827DA2F8B',
  saveUninitialized: true,
  resave: true
}));

/*KODE TIL STARTKNAP*/


app.post("/api/startGame", (req, res) => {
  gameStarted = true;
  res.json({ success: true });
});

app.get("/api/gameStatus", (req, res) => {
  res.json({ gameStarted });
});
/*KODE TIL STARTKNAP SLUTTER HER*/ 
 

/**Kode til timer START */
let countdownStartTime;
const countdownDuration = 120; // 2 minutter

app.post("/api/startCountdown", (req, res) => {
  if (!countdownStartTime) {
    countdownStartTime = Date.now();
  }
  res.json({ success: true });
});

app.get("/api/remainingTime", (req, res) => {
  if (!countdownStartTime) {
    return res.json({ remainingTime: countdownDuration });
  }
  const elapsedTime = Math.floor((Date.now() - countdownStartTime) / 1000);
  const remainingTime = countdownDuration - elapsedTime;
  res.json({ remainingTime: remainingTime > 0 ? remainingTime : 0 });
});
/**SLUTTER HER */

app.post("/auth", async (req, res) => {
  const name = req.body.name;
  const count = await playerCount();


  if (count <= 4) {
    if (!await doesPlayerExist(name)) {
      await addPlayer(createPlayerObject(name));
      req.session.loggedIn = true;
      req.session.name = name;
      await logPlayerIn(name);
      if(gameStarted) {
        queue.push(name) // hvis spillet er startet, tilføjes spiller til en kø
        res.redirect('/waitinglobby');
      } else {
        playerInGame.push(name);
        res.redirect('/lobby/' + name)
      }
    } else {
      if (await loginAllowed(name)) {
        req.session.loggedIn = true;
        req.session.name = name;
        await logPlayerIn(name);
        if(gameStarted) {
          queue.push(name) // hvis spillet er startet, tilføjes spiller til en kø
          res.redirect('/waitinglobby');
        } else {
          playerInGame.push(name)
          res.redirect('/lobby/' + name)
        }
      } else {
        res.redirect('/login');
      }
    }
  } else if (count >= 5){
    res.redirect('/waitinglobby')
  }
});

app.post("/api/roll", (req, res) => {
  let toBeRolled = req.body.list1;
  let userState = roll(toBeRolled);
  res.send(userState);
});

app.get("/api/allocPoints/:data", async (req, res)=>{
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



app.get("/", (req, res) => {
  res.render('yatzy');
});

app.get("/login", (req, res) => {
  res.render('login');
});

app.get("/waitinglobby", async (req, res) => {
  const name = req.session.name;
  const users1 = playerInGame;
  
  
  let playersInGame = [];
  let playersInQueue = [];

  if(gameStarted) {
    playersInGame = users1;
    playersInQueue = queue;
  } else {
    playersInGame = users1.slice(0,5);
    playersInQueue = users1.slice(5);
  }
  res.render('waitinglobby', { name: name, playersInGame: playersInGame, playersInQueue: playersInQueue });
})
/*
app.get("/lobby", (req, res) => {
  res.render('lobby')
}) 
*/

app.get("/lobby/:name", async (req, res) => {
  const name = req.session.name;
  const users = await readLoggedIn();
  res.render('lobby', { name: name, users: users });
});

 app.get("/api/playerCount", async (req, res) => {
  const users = await readLoggedIn();
   res.json({ playerCount: users.length });
});

app.get("/api/getPlayers", async (req, res)=>{
  const players = await readFile();
  res.send(players);
});

app.get('/api/getCurrentPlayer', async (req,res) => {
  let currentPlayer = await readFile();
  currentPlayer = currentPlayer[currentPlayerIndex];
  res.send(currentPlayer);
})


app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Fejl ved logud:', err);
    } else {
      console.log('Bruger logget ud');
      res.redirect('/login');
    }
  });
});

// app.post("/login)", (reg, res) => {
//   const {username} = reg.body;

// if (username == 'test') {
//     req.session.username = username
//     response.status(201).send(['login ok!']); //måske?
// }

// })

//await logEveryoneOut(); //Serveren starter, alle logges ud...

async function tempFunc(){ //Giver 'Unexpected end of JSON input' en gang imellem
  await initPlayersJSON(); 
  setTimeout(async ()=>{
    await logEveryoneOut();
  }, 1000);
}

app.listen(
  6969, tempFunc(),
  () => {
    console.log("Lytter på port 6969.. ");
  }
);