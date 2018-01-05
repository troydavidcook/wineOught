const express = require('express');
const middleware = require('../middleware');
const Campground = require('../models/campground');

const router = express.Router();


router.get('/', (req, res) => {
  Campground.find({}, (err, campgrounds) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('campgrounds/index', { campgrounds });
    }
  });
});


// New form route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// Create new campground route
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
  const campId = req.params.id;
  Campground.findById(campId, (err, fetchedGround) => {
    res.render('campgrounds/edit', { campground: fetchedGround });
  });
});

// Update route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  const campId = req.params.id;
  Campground.findByIdAndUpdate(campId, req.body.campground, (err, updatedCampground) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.redirect(`/campgrounds/${campId}`);
    }
  });
});

// Destroy route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
  const campId = req.params.id;
  Campground.findByIdAndRemove(campId, (err) => {
    if (err) {
      res.redirect(`/${campId}`);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
