import express from 'express';
import session from 'express-session';
import {addPlayer, loginAllowed, doesPlayerExist, logPlayerIn, logEveryoneOut, readLoggedIn, initPlayersJSON, createPlayerObject, updatePlayerScore} from './playerDB.js'
import roll from './api/rollAndCalc.js'


const app = express();
app.set("view engine", "pug");

app.use(express.urlencoded({extended: true}))
app.use(express.static('./assets')) //ændring maybe? ;)
app.use(express.json());


app.use(session({
  secret: '2EFA4E9B-26FE-4D2A-94FA-D51827DA2F8B',
  saveUninitialized: true,
  resave: true
}));


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
  if (!await doesPlayerExist(name)) {
    await addPlayer(createPlayerObject(name));
    req.session.loggedIn = true;
    req.session.name = name;
    await logPlayerIn(name);
    res.redirect('/lobby/' + name);
  } else {
    if (await loginAllowed(name)) {
      req.session.loggedIn = true;
      req.session.name = name;
      await logPlayerIn(name);
      res.redirect('/lobby/' + name);
    } else {
      res.redirect('/login');
    }
  }
});

app.post("/api/roll", (req, res) => {
  let toBeRolled = req.body.list1;
  let userState = roll(toBeRolled);
  res.send(userState);
});

app.get("/api/allocPoints/data:", async (req, res)=>{
  let splitData = req.data.split(" "); //tænker tre data med mellemrum imellem, point, felt, total
  let points = splitData[0];
  let field = splitData[1];
  let total = splitData[2];

  await updatePlayerScore(req.session.name, field, points, total);
});



app.get("/", (req, res) => {
  res.render('yatzy');
});

app.get("/login", (req, res) => {
  res.render('login');
});

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

app.listen(6969, await initPlayersJSON(), await logEveryoneOut(), () => {
  console.log("Lytter på port 6969.. ");
});