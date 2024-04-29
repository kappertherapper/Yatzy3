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


app.listen(6969, () => {
  console.log("Lytter på port 6969.. ");
});
