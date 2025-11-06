const moment = require("moment-timezone");

const addTimeToDate = (baseDate, str) => {
    const regex = /^(\d+)([smhdyM])$/; // M = months, y = years
    const match = str.match(regex);

    if (!match) {
        return { error: "Invalid format, use like '10m', '5h', '2d', '3M', '1y'", result: null };
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (isNaN(value) || value < 0) {
        return { error: "Invalid time value, must be a positive number.", result: null };
    }

    if (!['s', 'm', 'h', 'd', 'M', 'y'].includes(unit)) {
        return { error: "Invalid time unit, must be one of: s, m, h, d, M, y.", result: null };
    }

    const newDate = moment(baseDate).tz("Africa/Cairo");

    switch (unit) {
        case 's': newDate.add(value, 'seconds'); break;
        case 'm': newDate.add(value, 'minutes'); break;
        case 'h': newDate.add(value, 'hours'); break;
        case 'd': newDate.add(value, 'days'); break;
        case 'M': newDate.add(value, 'months'); // months
        case 'y': newDate.add(value, 'years'); break; // years
    }

    const formateDate = newDate.format('YYYY-MM-DD');
    const formateTime = newDate.format('HH:mm A');

    return {
        error: null,
        result: `${formateDate} ${formateTime}`
    };
};


module.exports = addTimeToDate;