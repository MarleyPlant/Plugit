Alright so lets talk handlebars.

- The layouts folder contains the 'main' template which will be filled as the server.

- Everything in the 'partials' folder will replace the corresponding '{{> name}}' placeholder.
example: If head.handlebars is in the partials. I can add it anywhere in my 'main.handlebars' file by doing this: '{{> head}}'

- Everything inside the views folder and outside any other dir(inside the views folder) will replace the '{{{body}}}' placeholder depending upon the GET request.
 
- Everything in these '{{name}}' are just placeholders which you can fill by passing in an object with the page in the 'render' function.

This might seem confusing at first, but trust me, you'll get a hand of it :D