// mongodb_notes seeds

const mongoose   = require('mongoose');
const Wine       = require('./models/wine');
const Comment    = require('./models/comment');

const seedData = [
  {
    name: 'Hobbiton',
    image: 'http://www.thelandofshadow.com/wp-content/uploads/2013/04/mordor_by_edli-d2yrha5.jpg',
    description: 'A great place to see some old school races trouncing about near some pretty dark mountains. Besides the lava and Uruakai, twas a really cool place to visit.',
  },
  {
    name: 'Mos Eisley',
    image: 'https://www.dailydot.com/wp-content/uploads/016/1e/MosEisleystreet_UE4.jpg',
    description: 'From a distance, the spaceport looks like a haphazard collage of low-grade concrete, stone and plastoid structures that spread outward from a central power-and-water distribution plant like the spokes of a wheel. Also, at a distance, the smooth circular depressions of launch stations look like craters pockmarking the landscape. The town is really larger than it appears, as a good portion of it lies underground. In fact, the town has a population of around 40,000 to 60,000, varying seasonally. It was built from the beginning with commerce in mind. Even the oldest of the town\'s buildings was designed to provide protection from Tatooine\'s twin suns. The buildings appear primitive from the outside and most of them actually are. The Mos Eisley Cantina was one of the spaceport\'s original blockhouses. The first view of Mos Eisley in Star Wars is actually a shot of Death Valley in California from the Dante\'s View lookout, with a matte painting added in the distance. The actual filming on location took place on the Tunisian island of Djerba.',
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
  Wine.remove({}, (err) => {
    if (err) {
      console.log('Error: ', err);
    }
    console.log('Wine removed.');
    seedData.forEach((seed) => {
      Wine.create(seed, (error, wine) => {
        if (error) {
          console.log('Error: ', error);
        } else {
          console.log('Wine added.');
          Comment.create(
            {
              text: 'This place was scary...',
              author: 'Troy',
            }, (error1, comment) => {
              if (error1) {
                console.log('Error: ', err)
              } else {
                wine.comments.push(comment);
                wine.save();
                console.log('Created new comment');
              }
            });
        }
      });
    });
  });
};

module.exports = seedDb;
