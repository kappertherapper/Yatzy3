import express from 'express';
import session from 'express-session';
import {logEveryoneOut, readLoggedIn, initPlayersJSON} from './playerDB.js'
import {apiRouter, getGameStarted} from './routes/api.js'
import {loginRouter, getQueue} from './routes/login.js'

const app = express();
app.set("view engine", "pug");

app.use(express.urlencoded({extended: true}))
app.use(express.static('./assets')) 
app.use(express.json());

app.use(apiRouter);
app.use(loginRouter);

app.use(session({
  secret: '2EFA4E9B-26FE-4D2A-94FA-D51827DA2F8B',
  saveUninitialized: true,
  resave: true
}));

app.get("/", (req, res) => {
  res.render('yatzy');
});

app.get("/waitinglobby", async (req, res) => {
  const name = req.session.name;
  const users1 = await readLoggedIn();

  let queue = getQueue();

  let playersInGame = users1;
  playersInGame = playersInGame.filter((e) => !queue.includes(e.name))
  
  res.render('waitinglobby', { name: name, playersInGame: playersInGame, playersInQueue: queue });
})

app.get("/lobby/:name", async (req, res) => {
  const name = req.session.name;
  const users = await readLoggedIn();
  res.render('lobby', { name: name, users: users });
});




app.get('/gameover', async (req, res) => {
  let players = await fetch("http://localhost:6969/api/getPlayers"); //Man kan ikke bruge fetch på server side?
  players = await players.json();

  const winner = "winner"; // Function to determine the winner
  const playerScores = players.scoreVals; 
  
  res.render('yatzy', { winner, playerScores });
});


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