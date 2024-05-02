import express from 'express';
import session from 'express-session';
import {addPlayer, loginAllowed, doesPlayerExist, logPlayerIn, logEveryoneOut} from './playerDB.js'

logEveryoneOut(); //Serveren starter, alle logges ud...

const app = express();
app.set("view engine", "pug");

app.use(express.urlencoded({extended: true}))
app.use(express.static('./assets')) //ændring maybe? ;)


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
      res.redirect('/');
      res.end();
  }else{
    if(await loginAllowed(name)){
      req.session.loggedIn = true,
      req.session.name = name;
      await logPlayerIn(name);
      res.redirect('/');
      res.end();
    }else {
      res.redirect('/login')
    }
  }
})


app.get("/", (req, res) => {
    res.render('yatzy')
});

app.get("/login", (req, res) => {
  res.render('login')
})

app.get("/lobby", (req, res) => {
  res.render('lobby')
}) 

// app.post("/login)", (reg, res) => {
//   const {username} = reg.body;

// if (username == 'test') {
//     req.session.username = username
//     response.status(201).send(['login ok!']); //måske?
// }

// })


app.listen(6969, () => {
  console.log("Lytter på port 6969.. ");
});
