# Therapist monthly billing timesheet report

### install
``` sh
npm install
```

## Run the script

### run the sample script
``` sh
#(equivalent of prepare, run, view sections below)
./run.sh samples/2016
```

## Manual steps

### prepare
``` sh
cd samples/2016
cat $(ls -a | grep -E '^\d') > ../../combined.csv
cd ../../
```

### run
``` sh
# in the project root directory, check that combined.csv is present
# then run the script
time node index.js | python -m json.tool > combined.json
```

### view
``` sh
# install a json viewer
#   https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en)
# open in chrome
open -a /Applications/Google\ Chrome.app ./combined.json

# pretty print results
cat combined.json | python -m json.tool | more
```

## How to get and prepare source files (timesheets) for the script above
* get access to s3 (ask aaron)
* login via creds to the `presencelearning-uploads-dev` bucket
* download learning_timesheets.zip
* crop the list to the "final" versions for each month (ask sandy)
* export the sessionLog sheet from each month's .xlsx as .csv
* name the files with a number sequence prefix that matches chronological order (001-, 002-, etc);
* concat in time order the month files → combined.csv (see install section above)
* run script (see run section above)
* view output (see view section above)
