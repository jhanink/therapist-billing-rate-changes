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

## Sample run output

``` sh
→ Combining 133 files
→ Sorting combined file (2816853 records)

real  2m58.698s
user  2m56.113s
sys  0m2.264s

→ Adding column headers

real  1m6.874s
user  0m57.510s
sys  0m11.393s

→ Processing 2816853 records
............................................................
............................................................
............................................................
.........................
real  3m25.178s
user  3m21.467s
sys  0m4.473s

→ Results
    "numRecords": 1862011,
    "numRecordsWithoutSfId": 80578,
    "numTherapists": 879,
    "numTherapistsWithRateChanges": 496

Done.
```
