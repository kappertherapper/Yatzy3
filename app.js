import express from 'express';
import session from 'express-session';

const app = express();
app.set("view engine", "pug");

app.use(express.urlencoded({extended: true}))
app.use(express.static('./assets')) //ændring maybe? ;)
app.use(express.static("filer"));


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
