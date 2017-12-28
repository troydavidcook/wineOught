const express    = require('express');
const router     = express.Router();
const Campground = require('../models/campground');

router.get('/campgrounds', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/login');
}

router.get('/campgrounds/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

router.post('/campgrounds', isLoggedIn, (req, res) => {
  // OBJECT DESTRUCTURING. Airbnb preferred for some reason.
  const reqBody =
    {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
    };

  Campground.create(reqBody, (err) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      // Redirect goes back to certain route, not a view name.
      res.redirect('/campgrounds');
    }
  });
});

// SHOW
router.get('/campgrounds/:id', (req, res) => {
  const campId = req.params.id;
  // Associating different objects by populating different model into the campground,
  // then executing the callback. Important association line here. IMPORTANT.
  Campground.findById(campId).populate('comments').exec((err, fetchedGround) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      // Setting the object 'campgrounds' to what we retrieved by 'findById()';
      res.render('campgrounds/show', { campgrounds: fetchedGround });
    }
  });
});

module.exports = router;
