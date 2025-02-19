# Therapist monthly billing timesheet report

### install
``` sh
npm install
```

## Run the script

### specify the directory holding the csv files
``` sh
$ ./run.sh work/learning_timesheets
```

## How to get and prepare source files (timesheets) for the script above
* get access to s3 (ask aaron)
* login via creds to the `presencelearning-uploads-dev` bucket
* download and unzip learning_timesheets.zip to a local work folder in the project root
* for each .xlsx file
   * open and select the SessionLog tab
   * delete the first row (column headers)
   * format the first column (date format: YYYY-MM-DD HH:MM:SS)
   * save/export as .csv file
* only export files with proper date-time data in the Date column
   * some old (early 2013) data is not usable

## How does the run script work
* concatenates the csv files into combined.csv at the project root
* sorts combined.csv on the first column (date-time)
   * and removes duplicates
* adds column header names as a row to the beginning of combined.csv
* runs the node script to process the rates and rate changes
* outputs rates.json and prints a summary

## Sample run progress and summary

``` sh
→ Combining 118 files
→ Sorting combined file and removing duplicates (2463782 records)

  real  2m17.927s
  user  2m16.838s
   sys  0m1.049s

→ Processing data (1543936 rows)
............................................................
................

  real  1m15.857s
  user  1m15.688s
   sys  0m0.818s

→ Results
  "records": {
    "numAccepted": "1,289,325",
    "numDiscarded": "254,611",
    "numTotal": "1,543,936"
  },
  "recordsDiscardedDetail": {
    "numInvalidRateChanges": "6,026",
    "numInvalidRateValue": "197,308",
    "numMissingSfId": "51,277"
  },
  "therapists": {
    "numRateChanges": 115,
    "numTotal": 851
  }

Done.

```
