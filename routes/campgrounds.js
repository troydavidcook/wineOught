const express          = require('express');
const mongoose         = require('mongoose');
const router           = express.Router({ mergeparams: true });
const Campground       = require('../models/campground');

router.get('/', (req, res) => {
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

// New form route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// Create new campground route
router.post('/', isLoggedIn, (req, res) => {
  // OBJECT DESTRUCTURING. Airbnb preferred for some reason.
  const reqBody =
    {
      id: req.body._id,
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
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

// SHOW specific campground route
router.get('/:id', (req, res) => {
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

// Get UPDATE form

router.get('/:id/edit', (req, res) => {
  const campId = req.params.id;
  Campground.findById(campId, (err, fetchedGround) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('campgrounds/edit', { campground: fetchedGround });
    }
  });
});

// Update route
router.put('/:id', (req, res) => {
  const campId = req.params.id;
  Campground.findByIdAndUpdate(campId, req.body.campground, (err, updatedCampground) => { 
    console.log(req.body.campground);
    if (err) {
      console.log('Error: ', err);
    } else {
      res.redirect(`/campgrounds/${campId}`);
    }
  });
});

module.exports = router;
