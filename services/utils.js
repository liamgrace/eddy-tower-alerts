
/* Converts a HH:mm:ss timestring to seconds since midnight.  */
module.exports.timeStrToSec =  async (timeStr) =>{
    const sp = timeStr.split(':');
    return (parseInt(sp[0]) * 3600) + (parseInt(sp[1]) * 60) + parseInt(sp[2]);
}

module.exports.formatYesterday = (utcOffset) => {
    const today = new Date()
    today.setHours(today.getHours() + utcOffset);
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
}
