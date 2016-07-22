_PWD=$(pwd);
_DIR=$1;

cd $_DIR
cat $(ls -a | grep -E '^\d') > ../../combined.csv
cd $_PWD

while :;do echo -n .;sleep 1;done &
trap "kill $!" EXIT  #Die with parent if we die prematurely
time node index.js | python -m json.tool > combined.json
open -a /Applications/Google\ Chrome.app ./combined.json
kill $! && trap " " EXIT



