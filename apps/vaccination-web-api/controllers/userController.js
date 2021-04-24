const passport = require('passport');
const authenticate = require('../database/authenticate');
const User = require('../database/models/user');
const { addUserToWallet } = require('../utils/walletHelper');

const getUsers = (req, res, next) => {
  User.find({organization: req.user.organization})
    .then(
      (users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      },
      (err) => next(err),
    )
    .catch((err) => next(err));
};

const signupUser = async (req, res) => {
  const userInfo = {
    username: req.body.username
  }
  const enrollmentInfo = await addUserToWallet(userInfo, req.user);

  User.register(
    new User({ username: userInfo.username, organization: enrollmentInfo.organization, enrollmentID: enrollmentInfo.enrollmentID }),
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
  const { username, enrollmentID, organization, admin, _id } = req.user;
  res.json({
    token: token,
    user: {
      username,
      enrollmentID,
      organization,
      admin,
      _id
    }
  });
};

module.exports = {
  getUsers,
  signupUser,
  login,
};