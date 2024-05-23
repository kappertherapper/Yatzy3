import express from 'express';
import {addPlayer, loginAllowed, doesPlayerExist, logPlayerIn, createPlayerObject, playerCount}  from '../playerDB.js'
import {getGameStarted} from './api.js'

const loginRouter = express.Router();



let queue = [];

loginRouter.post("/auth", async (req, res) => {
    const name = req.body.name;
    const count = await playerCount();
  
    let gameStarted = getGameStarted();
  
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
            res.redirect('/lobby/' + name)
          }
        } else {
          res.redirect('/login');
        }
      }
    } else if (count >= 5){
      res.redirect('/waitinglobby')
      queue.push(name)
      
    }
  });

  loginRouter.get("/login", (req, res) => {
    res.render('login');
  });

  loginRouter.post("/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Fejl ved logud:', err);
      } else {
        console.log('Bruger logget ud');
        res.redirect('/login');
      }
    });
  });

  function getQueue(){
    return queue;
  }

  export{loginRouter, getQueue}