# therapist-billing-rate-changes

### install
``` sh
npm install
cat samples/2016_May.csv > combined.csv && cat samples/2016_June.csv >> combined.csv
```

### run
``` sh
# save results
time node index.js > output.json

# pretty print results
node index.js | python -m json.tool | more
```
