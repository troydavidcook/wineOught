const express    = require('express');
const middleware = require('../middleware');
const geocoder   = require('geocoder');
const Wine       = require('../models/wine');

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
  geocoder.geocode(req.body.location, (err, data) => {
    let lat = data.results[0].geometry.location.lat;
    let lng = data.results[0].geometry.location.lng;
    let location = data.results[0].formatted_address;
    // OBJECT DESTRUCTURING. Airbnb preferred for some reason.
    const reqBody =
    {
      id: req.body._id,
      name: req.body.name,
      location: location,
      lat: lat,
      lng: lng,
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
router.put('/:id', (req, res) => {
  const wineId = req.params.id;
  geocoder.geocode(req.body.wine.location, (err, data) => {
    let lat = data.results[0].geometry.location.lat;
    let lng = data.results[0].geometry.location.lng;
    let location = data.results[0].formatted_address;
    const latLng = { lat, lng };
    const newData =
     {
       name: req.body.wine.name,
       image: req.body.wine.image,
       description: req.body.wine.description,
       location: req.body.wine.location,
       latLng,
     };
    Wine.findByIdAndUpdate(req.params.id, newData, (err, wine) => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('back');
      } else {
        req.flash('success', 'Successfully Updated!');
        res.redirect(`/wines/${wineId}`);
      }
    });
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
 