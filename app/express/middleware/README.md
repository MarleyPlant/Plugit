# Middleware

This contains all the code for router middleware each middleware must be imported before the controllers in order for the controllers to be able to use the middleware

Each middleware most be included into the middleware/index.js file they are then automatically included into the main express file.


# Middleware Example
```javascript
module.exports = function isLoggedIn(req, res, next) {
    // if condition is met allow user through
    if (condition)
        return next();

    // otherwise redirect to homepage
    res.redirect('/');
}
```
