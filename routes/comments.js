const express    = require('express');
const router     = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comment    = require('../models/comment');


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

// New comment route
router.get('/new', isLoggedIn, (req, res) => {
  const campgroundId = req.params.id;
  Campground.findById(campgroundId, (err, campground) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// Important association/ Create new comment route
router.post('/', isLoggedIn, (req, res) => {
  const campgroundId = req.params.id;
  Campground.findById(campgroundId, (err, campground) => {
    if (err) {
      console.log('Error: ', err);
      res.redirect('/campgrounds');
    } else {
      // Posting and assocciation.
      Comment.create(req.body.comment, (error, comment) => {
        if (err) {
          console.log('Error: ', error);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campgroundId}`);
        }
      });
    }
  });
});

module.exports = router;
