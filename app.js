import express from 'express';
import session from 'express-session';
import {addPlayer, loginAllowed, doesPlayerExist, logPlayerIn} from 'playerDB.js'


const app = express();
app.set("view engine", "pug");

app.use(express.urlencoded({extended: true}))
app.use(express.static('./assets')) //ændring maybe? ;)


app.use(session({
  secret: '2EFA4E9B-26FE-4D2A-94FA-D51827DA2F8B',
  saveUninitialized: true,
  resave: true
}));

app.post("/auth", (req, res) => {
  const name = req.body.name;
  if(!doesPlayerExist(name)){
    addPlayer({name: name, loggedIn: true})
      req.session.loggedIn = true,
      req.session.name = name;
      res.redirect('/');
      res.end();
  }else{
    if(loginAllowed(name)){
      req.session.loggedIn = true,
      req.session.name = name;
      logPlayerIn(name);
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


app.listen(6969, () => {
  console.log("Lytter på port 6969.. ");
});
