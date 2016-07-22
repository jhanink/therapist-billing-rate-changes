# Therapist monthly billing timesheet report

### install
``` sh
npm install
```

## Run the script

### specify the directory holding the csv files 
``` sh
./run.sh work/learning_timesheets
```


## How to get and prepare source files (timesheets) for the script above
* get access to s3 (ask aaron)
* login via creds to the `presencelearning-uploads-dev` bucket
* download and unzip learning_timesheets.zip
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
* adds column header names as a row to the beginning of combined.csv
* runs the node script to process the rates and rate changes
* outputs combined.json and prints a summary
