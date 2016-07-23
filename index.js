const fs = require('fs'), csv = require('fast-csv'), moment = require('moment');
const stream = fs.createReadStream("combined.csv");
let therapists={},therapistsWithRateChanges={};
let numRecords=0, numRecordsProcessed=0, numRecordsWithoutSfId=0, numRecordsInvalidRateValue=0;numInvalidRateChanges=0;
let badData = {missingSfId:[],invalidRates:[],rateChangeWithinBillingPeriod:[]};
csv.fromStream(stream, {headers: false})
  .on("data", function(data) {
    let date = data[0]; /*Date*/
    let sf_id = data[5]; /*TherapistSalesforceId*/
    let name = `${data[6]} ${data[7]}`; /*TherapistFirst, TherapistLast*/
    let therapistRate = data[28]; /*TherapistRate*/
    let therapist = therapists[sf_id];
    numRecords++;

    // Validate
    if (!sf_id) { /*missing salesforce id*/
      numRecordsWithoutSfId++;
      badData.missingSfId.push(`${date} row:${numRecords}`);
      return;
    }

    function validRate(value) {
      return value.charAt(0) === '$' && value !== '$0.00';
    }

    if (!validRate(therapistRate)){
      numRecordsInvalidRateValue++;
      badData.invalidRates.push(`${date} row:${numRecords}`);
      return;
    }

    // Process
    let rates = therapists[sf_id] = therapist?therapist:[];
    let prevRate = rates.slice(-1)[0];
    if (!rates.length || (prevRate && prevRate.rate !== therapistRate)) {
      const dateNormalized = moment(date, 'YYYY-MM-DD').subtract(1,'months').endOf('month').format('YYYY-MM-DD');
      if (prevRate && dateNormalized === prevRate.start) {
        // unexpected rate change within billing period
        badData.rateChangeWithinBillingPeriod.push(`${date} sf_id:${sf_id} CUR - row:${numRecords} rate:${therapistRate} PREV - row:${prevRate.row} rate:${prevRate.rate}` );
        numInvalidRateChanges++;
        return;
      }
      rates.push({start:dateNormalized, end:null, rate:therapistRate, row: numRecords});
      if (prevRate) {
        prevRate.end = dateNormalized;
        therapistsWithRateChanges[`${sf_id}`] = rates;
      }
    }
    numRecordsProcessed++;
  })

  // Output
  .on("end", function(data) {
    console.log(JSON.stringify({
      results: {
        summary: {
          therapists: {
            numTherapistsWithRateChanges: Object.keys(therapistsWithRateChanges).length,
            numTherapists: Object.keys(therapists).length,
          },
          records: {
            recordsTotal: numRecords.toLocaleString(),
            recordsIncluded: numRecordsProcessed.toLocaleString(),
            recordsDiscarded: (numRecords - numRecordsProcessed).toLocaleString(),
          },
          recordsDiscardedDetail: {
            numRecordsWithoutSfId: numRecordsWithoutSfId.toLocaleString(),
            numRecordsInvalidRateValue: numRecordsInvalidRateValue.toLocaleString(),
            numInvalidRateChanges: numInvalidRateChanges.toLocaleString(),
          }
        },
        values: {
          allTherapists: therapists,
          therapistsWithRateChanges,
          badData,
        },
      }
    }));
  });

