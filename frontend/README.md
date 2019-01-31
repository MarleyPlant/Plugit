# Plan
In this folder we will setup a web server using expressjs and handlebars that connects to our Heroku Postgres database and allows an admin user to login using the default credentials for the app.
The user will be able to change the administrator password and then configure aspects about the discord.js bot (/bin/index.js).

From the web interface they will be able to monitor uptime aswell as eventually modules being able to add their own functionality, for example a chat moderation plugin could have a graph on the homescreen that shows the amount of mutes in a day.


# Technologies
* [node.js](https://nodejs.org/) - evented I/O for the backend
* [express](https://github.com/expressjs/express) - Fast, unopinionated, minimalist web framework for node.
* [express-handlebars](https://github.com/ericf/express-handlebars) - A Handlebars view engine for Express which doesn't suck.


# Alright so lets talk handlebars.

- The layouts folder contains the 'main' template which will be filled as the server.

- Everything in the 'partials' folder will replace the corresponding '{{> name}}' placeholder.
example: If head.handlebars is in the partials. I can add it anywhere in any view file by doing this: '{{> head}}'

- Everything inside the views folder and outside any other dir(inside the views folder) will replace the '{{{body}}}' placeholder depending upon the GET request.

- Everything in these '{{name}}' are just placeholders which you can fill by passing in an object with the page in the 'render' function.

This might seem confusing at first, but trust me, you'll get a hang of it :D
