const passport = require('passport');
const authenticate = require('../database/authenticate');
const User = require('../database/models/user');

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
      },
      (err) => next(err),
    )
    .catch((err) => next(err));
};

const signup = (req, res) => {
  User.register(
    new User({ username: req.body.username, enrollmentID: req.body.enrollmentID }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    },
  );
};

const login = (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token: token,
    status: 'You are successfully logged in!'
  });
};

module.exports = {
  getUserById,
  signup,
  login,
};