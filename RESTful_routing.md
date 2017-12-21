## RESTful Routing - Takeaways

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



###### This is a conventional pattern among developing. May people are looking for this and adagin, is pretty conventional.


