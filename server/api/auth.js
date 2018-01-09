const router = require('express').Router();
const User = require('../db/models/User')

router.post('/login', (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) res.status(401).send('User not found');
      else if (!user.isCorrectPassword(req.body.password)) res.status(401).send('Incorrect password')
      else {
        req.login(user, err => {
          if (err) next(err);
          else res.json(user);
        });
      }
    })
    .catch(console.error);
})


router.post('/signup', (req, res, next) => {
  User.create({
    email: req.body.email,
    password: req.body.password
  })
    .then(user => {
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
    })
  })
})

router.delete('logout', (req, res, next) => {
  req.logout();
  res.sendStatus(200);
})

router.get('/me', (req, res, next) => {
  res.json(req.user);
});

module.exports = router;
