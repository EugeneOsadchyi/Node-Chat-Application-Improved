const User = require('../models/user');

const authenticate = (req, res, next) => {
  res.locals.user = null;

  if (req.session && req.session.user) {
    User.findOne({ _id: req.session.user._id }).then((user) => {
      if (!user) {
        return Promise.reject();
      }

      req.session.currentUser = user;
      res.locals.currentUser = user;

      return next();
    }).catch(() => {
      res.flash('error', 'You are not authenticated. Please login.');
      res.redirect('/login');
    });
  } else {
    res.flash('error', 'User not found. Please login again');
    res.redirect('/login');
  }
};

module.exports = authenticate;
