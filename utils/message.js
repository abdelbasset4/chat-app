const moment = require('moment');
function messageFormat(username, message) {
    return {
        username,
        message,
        time: moment().format('h:mm:ss a'),
    }
}
module.exports = messageFormat