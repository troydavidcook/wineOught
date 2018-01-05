const Campground = require('../models/campground');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
};

middlewareObj.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
  const campId = req.params.id;
  if (req.isAuthenticated()) {
    Campground.findById(campId, (err, fetchedGround) => {
      if (err) {
        res.redirect('back');
      } else if (fetchedGround.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
};

middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
  const campId = req.params.id;
  const commentId = req.params.comment_id;
  if (req.isAuthenticated()) {
    Comment.findById(commentId, (err, fetchedComment) => {
      if (err) {
        res.redirect('back');
      } else if (fetchedComment.author.id.equals(req.user._id)) {
        next();
      } else {
        res.redirect('back');
      }
    });
  } else {
    res.redirect('back');
  }
};

module.exports = middlewareObj;
