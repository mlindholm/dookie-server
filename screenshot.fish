#! /usr/local/bin/fish

echo "Insert current date to json"
set d (date "+%Y-%m-%d")
sed -i ".bak" "s/YYYY-MM-DD/$d/g" screenshot.data.json
echo "Push to firebase"
firebase database:set "/-KdbklMPTqReQ-OFr-v7" screenshot.data.json -y
mv screenshot.data.json.bak screenshot.data.json
echo "Done"