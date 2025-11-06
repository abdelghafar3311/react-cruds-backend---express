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
        case 's': newDate.setSeconds(newDate.getSeconds() + value); break;
        case 'm': newDate.setMinutes(newDate.getMinutes() + value); break;
        case 'h': newDate.setHours(newDate.getHours() + value); break;
        case 'd': newDate.setDate(newDate.getDate() + value); break;
        case 'M': newDate.setMonth(newDate.getMonth() + value); break; // months
        case 'y': newDate.setFullYear(newDate.getFullYear() + value); break; // years
    }

    const day = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const year = newDate.getFullYear();

    let hours = newDate.getHours();
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const seconds = String(newDate.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // 0 → 12

    return {
        error: null,
        result: `${day}/${month}/${year} ${hours}:${seconds > 1 ? +minutes + 1 : minutes}:00 ${ampm}`
    };
};


module.exports = addTimeToDate;