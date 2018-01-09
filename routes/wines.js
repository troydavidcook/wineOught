const express = require('express');
const middleware = require('../middleware');
const Wine = require('../models/wine');

const router = express.Router();


router.get('/', (req, res) => {
  Wine.find({}, (err, wines) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('wines/index', { wines });
    }
  });
});


// New form route
router.get('/new', middleware.isLoggedIn, (req, res) => {
  res.render('wines/new');
});

// Create new campground route
router.post('/', middleware.isLoggedIn, (req, res) => {
  // OBJECT DESTRUCTURING. Airbnb preferred for some reason.
  const reqBody =
    {
      id: req.body._id,
      name: req.body.name,
      region: req.body.region,
      image: req.body.image,
      description: req.body.description,
      created: req.body.created,
      author: {
        id: req.user._id,
        username: req.user.username,
      },
    };

  Wine.create(reqBody, (err) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      // Redirect goes back to certain route, not a view name.
      res.redirect('/wines');
    }
  });
});

// SHOW specific wine route
router.get('/:id', (req, res) => {
  const wineId = req.params.id;
  // Associating different objects by populating different model into the wine,
  // then executing the callback. Important association line here. IMPORTANT.
  Wine.findById(wineId).populate('comments').exec((err, fetchedWine) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      // Setting the object 'wines' to what we retrieved by 'findById()';
      res.render('wines/show', { wines: fetchedWine });
    }
  });
});

// Get UPDATE form
router.get('/:id/edit', middleware.checkWineOwnership, (req, res) => {
  const wineId = req.params.id;
  Wine.findById(wineId, (err, fetchedWine) => {
    res.render('wines/edit', { wine: fetchedWine });
  });
});

// Update route
router.put('/:id', middleware.checkWineOwnership, (req, res) => {
  const wineId = req.params.id;
  Wine.findByIdAndUpdate(wineId, req.body.wine, (err, updatedWine) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.redirect(`/wines/${wineId}`);
    }
  });
});

// Destroy route
router.delete('/:id', middleware.checkWineOwnership, (req, res) => {
  const wineId = req.params.id;
  Wine.findByIdAndRemove(wineId, (err) => {
    if (err) {
      res.redirect(`/${wineId}`);
    } else {
      res.redirect('/');
    }
  });
});

module.exports = router;
 