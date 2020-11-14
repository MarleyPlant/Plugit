var getSettings = require("../helpers/getSettings");

function getPrefix() {
    getSettings((data) => {
        return data['prefix'];
    });
}

module.exports = getPrefix;