_PWD=$(pwd);
_DIR=$1;

cd $_DIR
cat $(ls -a | grep -E '^\d') > ../../combined.csv
cd $_PWD

_NUM_ROWS=$(wc -l < combined.csv)
_ETA=$(( _NUM_ROWS / 18700 ))
echo "" && echo "Processing ${_NUM_ROWS//[[:blank:]]/} records"
echo "Estimated run time: Less than ${_ETA} seconds"
while :;do echo -n .;sleep 1;done &
trap "kill $!" EXIT  #Die with parent if we die prematurely
time node index.js | python -m json.tool > combined.json
open -a /Applications/Google\ Chrome.app ./combined.json
kill $! && trap " " EXIT

