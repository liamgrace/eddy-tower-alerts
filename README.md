# Eddy Tower Alerts
### AWS Lambda function for daily notification/summaries for LI-COR Smartflux3 (LI-7500DS) towers
Daily summaries for multiple sites can be uploaded into an S3 bucket, checks defined and then Email alerts sent to recipients.

## Example Setup.json
```json
{
  "masterBucket": "flux-data-master",
  "utcOffset": 10,
  "toAddresses": [
    "liam.grace@qut.edu.au"
  ],
  "Sites": [
    {
      "name": "some-site-name",
      "smartfluxID": "00xxx"
    }
  ],
  "Checks": [
    {
      "type": "rangeCheck",
      "param": "SWC_1_1_1",
      "desc": "Soil Water Content Probe 1 outside range of 0 and 100%",
      "max": 1.00,
      "min": 0.00,
      "warningLevel": "WARNING"
    },
    {
      "type": "sumCheckMin",
      "param": "P_RAIN_1_1_1",
      "desc": "Precipitation exceeds 1mm",
      "min": 1.00,
      "warningLevel": "INFORMATION"
    },
    {
      "type": "rangeCheckAdvanced",
      "param": "RG_1_1_1",
      "desc": "Global radiation outside range of -10.00 and 10.00 W/m2 between 9pm and 11pm",
      "min": -10.00,
      "max": 10.00,
      "timeStart": 75600,
      "timeEnd": 82800,
      "warningLevel": "WARNING"
    }
  ]
}
    

```