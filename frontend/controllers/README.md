# Controllers

This contains all the code regarding the requests made to the server.

# Example

'dashboard.js' would contain all the GET and POST requests made to and from the 'dashboard' view.

The code would look something like this:

```javascript
module.exports = function(app)
{
    app.get('/dashboard', function(req, res){
        res.render("dashboard", {title: "Dashboard"});
    });

    app.post('/dashboard', function(req, res){
        // Do whatever.
    });
}
```