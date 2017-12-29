## RESTful Routing - Takeaways - method-override notes

##### A way of mapping our route architecutre in our CRUD (Create, Read, Update, Destroy) applications.
###### There can be serveral pages, but this is a way to make it clean and easier to understand and read the way our routes are handinling our HTTP requests. Get ready for some 'method-override' npm!

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /campgrounds/         | GET       | index  
| /campgrounds/new         | GET       | new   
| /campgrounds          | POST      | create   
| /campgrounds/:id      | GET       | show       
| /campgrounds/:id/edit | GET       | edit       
| /campgrounds/:id      | PATCH/PUT | update 
___
#### Important notes on method-override module. Keep this code in server file, after requiring it.
```js
app.use(methodOverride('_method'));
```
##### Implement in 
```html
<form action="/campgrounds/ <%= campground._id %>?_method=PUT" method="POST">
```
##### When using in route like
```js
router.put('/:id', (req, res) => {
  const campId = req.params.id;
  let newData = { name: req.body.name, image: req.body.image, description: req.body.description };
  newData = req.sanitize(newdata);
  Campground.findByIdAndUpdate(campId, newData, (err, updatedCamp) => { 
    if (err) {
      console.log('Error: ', err);
    } else {
      res.redirect(`/campgrounds/${campId}`);
    }
  });
});
```


###### This is a conventional pattern among developing. May people are looking for this and adagin, is pretty conventional.
___

###### Important notes when Extracting routes into separate directory.


###### You can import the routes into the server file first, giving them names.
###### 'routes', of course being the name of that directory in this (most likely every) case: 
 ```js
const campgroundRoutes      = require('./routes/campgrounds');
const commentRoutes         = require('./routes/comments');
const indexRoutes           = require('./routes/index');
```
___
###### This code can be added near the bottom to shorten up the routes in the routing files.
######  These 'strings' can now be eliminated from the route names themselves.
```js
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
```
###### Example
```js
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});
```
__
###### Url Parameters like /:id won't carry over to different routing files.
```js
const router     = express.Router({ mergeparams: true });
```
###### This simple line of code with your 'require' statements will transfer all over

#### Important association model structure. 
```js
const mongoose = require('mongoose');

// This schema shows the 'ref'erence to different model, like a key would in pSQL.
const campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = mongoose.model('Campground', campgroundSchema);
```

