const Wine = require('../models/wine');
const Comment = require('../models/comment');

const middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Must be logged in.');
  return res.redirect('/login');
};

middlewareObj.checkWineOwnership = function checkWineOwnership(req, res, next) {
  const wineId = req.params.id;
  if (req.isAuthenticated()) {
    Wine.findById(wineId, (err, fetchedWine) => {
      if (err) {
        req.flash('error', 'Wine not found');
        res.redirect('back');
      } else if (fetchedWine.author.id.equals(req.user._id)) {
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
  const wineId = req.params.id;
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
