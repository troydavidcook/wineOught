// mongodb_notes seeds

const mongoose   = require('mongoose');
const Campground = require('./models/campground');
const Comment    = require('./models/comment');

const seedData = [
  {
    name: 'Orc Park',
    image: 'http://www.thelandofshadow.com/wp-content/uploads/2013/04/mordor_by_edli-d2yrha5.jpg',
    description: 'A great place to see some old school races trouncing about near some pretty dark mountains. Besides the lava and Uruakai, twas a really cool place to visit.',
  },
  {
    name: 'Mos Eisley',
    image: 'https://www.dailydot.com/wp-content/uploads/016/1e/MosEisleystreet_UE4.jpg',
    description: 'Great little, mostly desolate town. Great bar scene, but the music\'s a little repetative.',
  },
  {
    name: 'Isham Park',
    image: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/isham-park-graffiti-cole-thompson.jpg',
    description: 'A nice park in Inwood Manhattan, way up at the top. There\'s places for baseball, basketball, and tennis. You could also get mugged.',
  },
];

// This will all be run in the server file every time refreshed.
const seedDb = () => {
  // Removes all data.
  Campground.remove({}, (err) => {
    if (err) {
      console.log('Error: ', err);
    }
    console.log('Campground removed.');
    seedData.forEach((seed) => {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log('Error: ', err);
        } else {
          console.log('Campground added.');
          Comment.create(
            {
              text: 'This place was scary...',
              author: 'Troy',
            }, (err, comment) => {
              if (err) {
                console.log('Error: ', err)
              } else {
                campground.comments.push(comment);
                campground.save();
                console.log('Created new comment');
              }
            });
        }
      });
    });
  });
};

module.exports = seedDb;