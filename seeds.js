// mongodb_notes seeds

const mongoose = require('mongoose');
const Campground = require('./models/campground');

const seedData = [
        {
            name: 'Orc Park',
            image: "http://www.thelandofshadow.com/wp-content/uploads/2013/04/mordor_by_edli-d2yrha5.jpg",
            description: "A great place to see some old school races trouncing about near some pretty dark mountains. Besides the lava and Uruakai, twas a really cool place to visit.",
        },
        {
            name: 'Mos Eisley',
            image: "https://www.dailydot.com/wp-content/uploads/016/1e/MosEisleystreet_UE4.jpg",
            description: "Great little, mostly desolate town. Great bar scene, but the music's a little repetative.",
        },
        {
            name: 'Isham Park',
            image: "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/isham-park-graffiti-cole-thompson.jpg",
            description: "A nice park in Inwood Manhattan, way up at the top. There's places for baseball, basketball, and tennis. You could also get mugged.",
        },
];

var seedDb = () => {
    Campground.remove({}, (err) => {
        if (err) {
            console.log("Error: ", err); 
        } else {
            console.log("Campgrounds Removed");
            seedData.forEach((park) => {
                Campground.create(park, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Added a campground!');
                    }
                });
            });
        }
    });
};

module.exports = seedDb;

