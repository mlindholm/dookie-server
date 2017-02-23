#! /usr/local/bin/fish

echo "Insert dates into json"
set today (date "+%Y-%m-%d")
set yesterday (date -v -1d "+%Y-%m-%d")
sed -i ".bak" "s/TODAY/$today/g;s/YESTERDAY/$yesterday/g" screenshot.data.json
echo "Push to firebase"
firebase database:set "/-KdbklMPTqReQ-OFr-v7" screenshot.data.json -y
mv screenshot.data.json.bak screenshot.data.json
echo "Done!"