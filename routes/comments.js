const express    = require('express');
const Comment    = require('../models/comment');
const Campground = require('../models/campground');
const router     = express.Router({ mergeParams: true });


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

function checkCommentOwnership(req, res, next) {
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
          // add username and id to comment, then save.
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          // save comment
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect(`/campgrounds/${campgroundId}`);
        }
      });
    }
  });
});

router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
  const commentId = req.params.comment_id;
  Comment.findById(commentId, (err, fetchedComment) => {
    if (err) {
      console.log('Error: ', err);
      res.redirect('back');
    } else {
      res.render('comments/edit', { campground_id: req.params.id, comment: fetchedComment });
      // Comment edit route
    }
  });
});

// Comment UPDATE route
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
  const commentId = req.params.comment_id;
  const campId = req.params.id;
  Comment.findByIdAndUpdate(commentId, req.body.comment, (err, updatedComment) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${campId}`);
    }
  });
});

// Comment destroy
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
  const commentId = req.params.comment_id;
  const campId = req.params.id;
  Comment.findByIdAndRemove(commentId, (err) => {
    if (err) {
      res.redirect('back');
    } else {
      res.redirect(`/campgrounds/${campId}`);
    }
  });
});

module.exports = router;
