const fs = require('fs'), csv = require('fast-csv'), moment = require('moment');
const stream = fs.createReadStream("combined.csv");
let therapists={},therapistsWithRateChanges={}, numRecords=0, numRecordsWithoutSfId=0;
csv.fromStream(stream, {headers: false})
  .on("data", function(data) {
    let date = data[0]; /*Date*/
    let sf_id = data[5]; /*TherapistSalesforceId*/
    let name = `${data[6]} ${data[7]}`; /*TherapisFirst, TherapistLast*/
    let therapistRate = data[28]; /*TherapistRate*/
    let therapist = therapists[sf_id];
    if (!sf_id) { numRecordsWithoutSfId++; return; } /*unusable records*/

    numRecords++;
    let rates = therapists[sf_id] = therapist?therapist:[];
    let prevRate = rates.slice(-1)[0];
    if (!rates.length || (prevRate && prevRate.rate !== therapistRate)) {
      const dateNormalized = moment(date, 'YYYY-MM-DD').subtract(1,'months').endOf('month').format('YYYY-MM-DD');
      rates.push({start:dateNormalized, end:null, rate:therapistRate});
      if (prevRate) {
        prevRate.end = dateNormalized;
        therapistsWithRateChanges[`${name} - ${sf_id}`] = rates;
      }
    }
  })
  .on("end", function(data) {
    console.log(JSON.stringify({
      results: {
        summary: {
          numTherapistsWithRateChanges: Object.keys(therapistsWithRateChanges).length,
          numTherapists: Object.keys(therapists).length,
          numRecords: numRecords,
          numRecordsWithoutSfId: numRecordsWithoutSfId,
        },
        values: {
          therapistsWithRateChanges: therapistsWithRateChanges,
          allTherapists: therapists,
        }
      }
    }));
  });

