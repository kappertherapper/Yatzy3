import express from "express";
import session from "express-session";
import { logEveryoneOut, readLoggedIn, initPlayersJSON } from "./playerDB.js";
import { apiRouter, getGameStarted } from "./routes/api.js";
import { loginRouter, getQueue } from "./routes/login.js";

const app = express();
app.set("view engine", "pug");


app.use(express.urlencoded({ extended: true }));
app.use(express.static("./assets"));
app.use(express.json());
app.use(
  session({
    secret: "2EFA4E9B-26FE-4D2A-94FA-D51827DA2F8B",
    saveUninitialized: true,
    resave: true,
  })
);

function checkLogin(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    if (req.path !== "/login" && req.path !== "/auth") {
      res.redirect("/login");
    } else {
      next();
    }
  }
}

async function controlAccess(req, res, next) {
  const users1 = await readLoggedIn();
  let queue = getQueue();
  let gameStarted = getGameStarted();
  const playersInGame = users1.filter((e) => !queue.includes(e.name));
  const playersInQueue = queue;
  
  const userInGame = playersInGame.some(
    (player) => player.name === req.session.name
  );
  const userInQueue = playersInQueue.includes(req.session.name);

  if (
    userInGame &&
    gameStarted &&
    req.path !== "/" &&
    !req.path.startsWith("/api")
  ) {
    return res.redirect("/");
  } else if (
    userInQueue &&
    gameStarted &&
    req.path !== "/waitinglobby" &&
    !req.path.startsWith("/api")
  ) {
    return res.redirect("/waitinglobby");
  } else if (
    req.session.loggedIn &&
    !gameStarted &&
    req.path !== `/lobby/${req.session.name}` &&
    !req.path.startsWith("/api")
  ) {
    return res.redirect(`/lobby/${req.session.name}`);
  } else {
    next();
  }
}

app.use(checkLogin);
app.use(controlAccess);
app.use(apiRouter);
app.use(loginRouter);

app.get("/", (req, res) => {
  res.render("yatzy");
});

app.get("/waitinglobby", async (req, res) => {
  const name = req.session.name;
  const users1 = await readLoggedIn();
  let queue = getQueue();
  let playersInGame = users1;
  playersInGame = playersInGame.filter((e) => !queue.includes(e.name));

  res.render("waitinglobby", {
    name: name,
    playersInGame: playersInGame,
    playersInQueue: queue,
  });
});

app.get("/lobby/:name", async (req, res) => {
  const name = req.session.name;
  const users = await readLoggedIn();
  res.render("lobby", { name: name, users: users });
});

app.get("/gameover", async (req, res) => {
  let players = await fetch("http://localhost:6969/api/getPlayers");
  players = await players.json();

  const winner = "winner";
  const playerScores = players.scoreVals;

  res.render("yatzy", { winner, playerScores });
});

async function tempFunc() {
  await initPlayersJSON();
  setTimeout(async () => {
    await logEveryoneOut();
  }, 1000);
}

app.listen(6969, tempFunc(), () => {
  console.log("Lytter på port 6969.. ");
});
