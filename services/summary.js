const {GetObjectCommand} = require("@aws-sdk/client-s3");



module.exports.getObjectAsString = async (s3,bucket,key) => {

        const data = await s3.send(new GetObjectCommand({Bucket:bucket,Key:key}));
        const bodyString = await new Promise((resolve, reject) => {
            const chunks = [];
            data.Body.on("data", (chunk) => chunks.push(chunk));
            data.Body.on("error", resolve);
            data.Body.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });
        return bodyString;
}

module.exports.formatSummary = (bodyString) => {
    const headerStr = bodyString.split('\n')[0].split('\t');
    var summaryData = {};
    headerStr.map((p,i) => {
       if(i > 7) summaryData[p] = [];
    });
    bodyString.split('\n').map((l,i) => {
       if(i > 1 && l.length > 0){
           let time = l.split('\t')[3];
           const timeSec = timeToSecs(time)
           l.split('\t').map((p,y) => {
               if(y > 7) {
                   summaryData[headerStr[y]].push({time: time, val: p, timeSec:timeSec})
               }
           })
       }
    });
    return summaryData;
}

const timeToSecs = (timeStr) => {
    let timeSplit = timeStr.split(':');
    let timeSec = (parseInt(timeSplit[0]) * 3600) + (parseInt(timeSplit[1]) * 60) + parseInt(timeSplit[2]);
    return timeSec;
}

