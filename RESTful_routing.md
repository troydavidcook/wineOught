## RESTful Routing - Takeaways
___
#### A way of mapping our route architecutre in our CRUD (Create, Read, Update, Destroy) applications.
###### There can be serveral pages, but this is a way to make it clean and easier to understand and read the way our routes are handinling our HTTP requests. 

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /photos/         | GET       | index  
| /photos/new         | GET       | new   
| /photos          | POST      | create   
| /photos/:id      | GET       | show       
| /photos/:id/edit | GET       | edit       
| /photos/:id      | PATCH/PUT | update    