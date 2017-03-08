#! /usr/local/bin/fish

set now (date "+%Y-%m-%d-%H%.%M.%S")
mkdir backup 2> /dev/null
firebase database:get "/" --pretty >> backup/backup-$now.json
