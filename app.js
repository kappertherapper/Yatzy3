import express from 'express';
import session from 'express-session';
import {addPlayer, loginAllowed, doesPlayerExist, logPlayerIn, logEveryoneOut, readLoggedIn} from './playerDB.js'
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


app.post("/auth", async (req, res) => {
  const name = req.body.name;
  if(! await doesPlayerExist(name)){
    await addPlayer({name: name, loggedIn: true})
      req.session.loggedIn = true,
      req.session.name = name;
      res.redirect('/lobby/' + name);
      res.end();
  }else{
    if(await loginAllowed(name)){
      req.session.loggedIn = true,
      req.session.name = name;
      await logPlayerIn(name);
      res.redirect('/lobby/' + name);
      res.end();
    }else {
      res.redirect('/login')
    }
  }
})

app.post("/api/roll", (req, res)=>{
  let toBeRolled =  req.body.list1; //noget med f.eks. [true, false, true, false, false]
  console.log("REQ BODY: " + req.body.list1);
  
  let userState = roll(toBeRolled);

  res.send(userState); //håber den konverter userState objektet til JSON :D
});

app.get("/api/alc/fieldPoint:", (req, res)=>{
  //let params = req.params.fieldPoint;
  //split params på mellem

  //isPlayerOneTurn = !isPlayerOneTurn; //flip til den anden spillers tur
});



app.get("/", (req, res) => {
    res.render('yatzy')
});

app.get("/login", (req, res) => {
  res.render('login')
})

/*
app.get("/lobby", (req, res) => {
  res.render('lobby')
}) 
*/

app.get("/lobby/:name", async(req, res) => {
  const name = req.session.name
  const users = await readLoggedIn();
  res.render('lobby', {name: name, users: users})
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

app.listen(6969, await logEveryoneOut(), () => {
  console.log("Lytter på port 6969.. ");
});
