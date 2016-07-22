_PWD=$(pwd);
_DIR=$1;

cd $_DIR
cat $(ls -a | grep -E '^\d') > ../../combined.csv
cd $_PWD

_NUM_ROWS=$(wc -l < combined.csv)
_ETA=$(( _NUM_ROWS / 18700 ))
echo "" && echo "Processing ${_NUM_ROWS//[[:blank:]]/} records"
echo "Estimated run time: Less than ${_ETA} seconds"
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
time node index.js | python -m json.tool > combined.json
open -a /Applications/Google\ Chrome.app ./combined.json
kill $! && trap " " EXIT

