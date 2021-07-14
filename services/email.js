const { SendEmailCommand } = require("@aws-sdk/client-sesv2")

module.exports.sendEmail =  async (ses,toAddresses,fromAddress,siteChecks) => {
    let emailSubj = "Daily Eddy Tower Warnings for - " + new Date().toDateString();

    let emailBody = formatBody(siteChecks);

    const params = {
        Destination: {
            CCAddress: [],
            ToAddresses: toAddresses
        },
        Content: {
            Simple : {
                Subject:{
                    Data:emailSubj
                },
                Body:{
                    Text:{
                        Data:emailBody
                    }
                }
            }
        },
        FromEmailAddress:fromAddress
    }
    try {
        const response = await ses.send(new SendEmailCommand(params))
         return response;
    } catch (err){
          return err;
    }
}

const formatBody = (siteChecks) => {
    let bodyRaw = "Summary warnings for yesterday by site\n"
    siteChecks.map((item) => {
        bodyRaw += "***********************\n"
        bodyRaw += "Site:" + item.site + "\n"
        let hasWarningsFlag = false;
        if(item.deadman) {
        bodyRaw += "CRITICAL: No data was available to check, check site connection\n"
            hasWarningsFlag = true;
        } else {
           item.checks.map((check) => {
                if(!check.passing){
                    bodyRaw += check.warningLevel + ": " + check.desc +"\n";
                    hasWarningsFlag = true;
                }
            })
        }
        if(!hasWarningsFlag) bodyRaw += "No warnings for site triggered.\n"
    });
    return bodyRaw;
}