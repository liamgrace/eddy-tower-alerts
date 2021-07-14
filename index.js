const { S3Client} = require("@aws-sdk/client-s3");
const {CheckCollection, Check, sumCheckMin, rangeCheck, rangeCheckAdvanced} = require("./models/checks.js")
const {formatSummary, getObjectAsString} = require("./services/summary.js")
const { sendEmail } = require("./services/email.js");
const { formatYesterday } = require("./services/utils.js");
const { SESv2Client } = require("@aws-sdk/client-sesv2")

exports.handler = async function(event) {
    const ses = new SESv2Client({region: "us-east-1"});
    const s3 = new S3Client({region: "ap-southeast-2"});

    const allSiteChecks = []

    const setup = JSON.parse(await getObjectAsString(s3, "eddy-alerts", "setup.json"));

    const getChecks = (site) => {
        const checkCollection = new CheckCollection(site)
        setup.Checks.map(function (check, index) {
            switch (check.type) {
                case("rangeCheck"):
                    checkCollection.checks.push(new rangeCheck(check))
                    break
                case("sumCheckMin"):
                    checkCollection.checks.push(new sumCheckMin(check))
                    break;
                case("rangeCheckAdvanced"):
                    checkCollection.checks.push(new rangeCheckAdvanced(check))
                    break;
            }
        });
        return checkCollection;
    }

    await Promise.all(setup.Sites.map(async (site) => {
        let siteChecks = getChecks(site.name)
        try {
            let summaryRaw = await getObjectAsString(s3, setup.masterBucket, site.name + "/" + formatYesterday(setup.utcOffset) + "_smart3-" + site.smartfluxID + '_EP-Summary.txt');
            siteChecks.performCheck(formatSummary(summaryRaw));
            allSiteChecks.push(siteChecks);
        } catch (err) {
            siteChecks.deadman = true; //Can't retrieve eddy summary from S3, deadman check flag true disregard rest of checks.
            allSiteChecks.push(siteChecks);
        }
    }));

    const response = await sendEmail(ses, setup.toAddresses, setup.fromAddress,allSiteChecks);
    return response;
}


