# therapist-billing-rate-changes

### install
``` sh
npm install
cat samples/2016/May.csv > combined.csv && cat samples/2016/June.csv >> combined.csv
```

### run
``` sh
# save results
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

### How to get source files (timesheets)
* get access to s3 (ask aaron)
* login via creds to the `presencelearning-uploads-dev` bucket
* download learning_timesheets.zip
* crop the list to the "final" versions for each month (ask sandy)
* export the sessionLog sheet from each month's .xlsx as .csv
* concat in time order the month files → combined.csv (see install section above)
* run script (see run section above)
* view output (see view section above)
