#!/bin/bash
commit_hash=$(git log -1 --pretty=%h)
commit_date=$(git log -1 --pretty=%cd --date=format:'%Y/%m/%d %H:%M:%S')

# Create a JSON object 
json='{
  "commit": "'$commit_hash'",
  "date": "'$commit_date'"
}'

# Save the JSON object to a file
echo $json > src/lastcommit.json
echo created src/lastcommit.json