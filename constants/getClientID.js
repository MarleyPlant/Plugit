var getSettings = require("../helpers/getSettings");

function getClientID() {
    getSettings((data) => {
        return(data.clientid)
    });
}

module.exports = getClientID;