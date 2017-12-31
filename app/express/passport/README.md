# Passport

Handling all the routing to other sign-ins strategies.

# "routes"

Containing code that redirects users to Auth pages of different APIs.

# "config"

Containing setup code that sets passport up. This code needs to be required in the main(express.js) file. No need to do ```module.exports``` for the setup code as the code runs upon execution of ```require()```.