const moment = require('moment');
function toLocalTime (time) {
    let gmtDateTime = moment.utc(time, 'YYYY-MM-DD HH:mm:ss');
    let local = gmtDateTime.local().format('YYYY-MM-DD HH:mm:ss');
    return local;
};

module.exports = toLocalTime;