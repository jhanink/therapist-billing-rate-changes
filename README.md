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

## view
``` sh
# install a json viewer
#   https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc?hl=en)
# open in chrome
open -a /Applications/Google\ Chrome.app ./combined.json

# pretty print results
cat combined.json | python -m json.tool | more
```
