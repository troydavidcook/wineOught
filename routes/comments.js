const express    = require('express');
const router     = express.Router();
const Campground = require('./campgrounds');
const Comment    = require('./comments');


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

router.get('/campgrounds/:id/comments/new', isLoggedIn, (req, res) => {
  const campgroundId = req.params.id;
  Campground.findById(campgroundId, (err, campground) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('comments/new', { campground });
    }
  });
});

// Important association
router.post('/campgrounds/:id/comments', isLoggedIn, (req, res) => {
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
