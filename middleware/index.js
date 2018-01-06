const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Must be logged in.');
  return res.redirect('/login');
};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
  const campId = req.params.id;
  if (req.isAuthenticated()) {
    Campground.findById(campId, (err, fetchedGround) => {
      if (err) {
        req.flash('error', 'Campground not found');
        res.redirect('back');
      } else if (fetchedGround.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', 'Sorry, permission denied.');
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'Must be logged in.');
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
  const campId = req.params.id;
  const commentId = req.params.comment_id;
  if (req.isAuthenticated()) {
    Comment.findById(commentId, (err, fetchedComment) => {
      if (err) {
        req.flash('error', 'Comment not found');
        res.redirect('back');
      } else if (fetchedComment.author.id.equals(req.user._id)) {
        next();
      } else {
        req.flash('error', 'Sorry, permission denied.');
        res.redirect('back');
      }
    });
  } else {
    req.flash('error', 'Must be logged in.');
    res.redirect('back');
  }
};

module.exports = middlewareObj;
