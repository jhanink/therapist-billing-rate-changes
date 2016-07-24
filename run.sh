_PWD=$(pwd);
_DIR=$1;

_HEADER='Date,StartTime,EndTime,Duration,TherapistId,TherapistSalesforceId,TherapistFirst,TherapistLast,TherapyType,ClientId,ClientSalesforceId,ClientCustomerId,ClientPeakId,ClientFirst,ClientLast,ClientName,IsPilot,SessionType,BillableGroupSize,PayableGroupSize,Type,ProductType,SchoolId,SchoolSalesforceId,School,SchoolSite,SchoolRate,SchoolMileageRate,TherapistRate,TherapistMileageRate,Mileage,TherapistHours,SchoolHours,PayableToTherapist,BillableToSchool,SchoolBillingTotal,TherapistBillingTotal,BillingType,SCC'

echo ""
cd $_DIR
_NUM_FILES=$(ls *.csv | wc -l)
echo "→ Combining ${_NUM_FILES//[[:blank:]]/} files"
find . -name '*.csv' -exec cat {} > $_PWD/combined.csv \;
cd $_PWD

_NUM_ROWS=$(wc -l < combined.csv)

# sort date format YYYY-MM-DD HH:MM:SS
echo "→ Sorting combined file and removing duplicates (${_NUM_ROWS//[[:blank:]]/} records)"
time sort -u --field-separator=',' --key=1 combined.csv -o combined.csv

_NUM_ROWS=$(wc -l < combined.csv)

echo "" && echo "→ Processing data (${_NUM_ROWS//[[:blank:]]/} rows)"
_COUNT=0
while :;
do
  if [ $_COUNT -ne 0 ]  && [ $(( _COUNT % 60)) ==  0 ]
    then
      echo ""
  fi;
  echo -n .;sleep 1;
  _COUNT=$((_COUNT + 1));
done &
trap "kill $!" EXIT  #Die with parent if we die prematurely
time node --max-old-space-size=4096 index.js | python -m json.tool > rates.json
echo "" && echo "→ Results" && head -17 rates.json | tail -14 && echo "" && echo "Done."
kill $! && trap " " EXIT

