const fs = require('fs'), csv = require('fast-csv'), moment = require('moment');
const stream = fs.createReadStream("combined.csv");
let therapists={},therapistsWithRateChanges={}, numRecords=0;
csv.fromStream(stream, {headers:true})
  .on("data", function(data) {
    let sf_id = data.TherapistSalesforceId, therapist = therapists[data.TherapistSalesforceId];
    let name = `${data.TherapistFirst} ${data.TherapistLast}`;
    if (sf_id === 'TherapistSalesforceId') return; // header row;
    numRecords ++;
    let rates = therapists[sf_id] = therapist?therapist:[];
    let prevRate = rates.slice(-1)[0];
    if (!rates.length || (prevRate && prevRate.rate !== data.TherapistRate)) {
      const dateNormalized = moment(data.Date, 'MMM DD, YYYY').subtract(1,'months').endOf('month').format('YYYY-MM-DD');
      rates.push({name: name, start:dateNormalized, end:null, rate:data.TherapistRate});
      if (prevRate) {
        prevDate.end = dateNormalized;
        therapistsWithRateChanges[`${name} - ${sf_id}`] = rates;
      }
    }
  })
  .on("end", function(data) {
    console.log(JSON.stringify({
      results: {
        numTherapistsWithRateChanges: Object.keys(therapistsWithRateChanges).length,
        numTherapists: Object.keys(therapists).length,
        numRecords: numRecords,
        therapistsWithRateChanges: therapistsWithRateChanges,
        allTherapists: therapists,
      }
    }));
  });

