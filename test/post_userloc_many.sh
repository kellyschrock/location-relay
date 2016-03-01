#!/bin/sh

./post_userloc.js `pwd`/latlng/lv-johnson.latlng myGroup joe_user &
sleep 5
./post_userloc.js `pwd`/latlng/lv-johnson.latlng myGroup bill_bonney &
sleep 5
./post_userloc.js `pwd`/latlng/lv-johnson.latlng myGroup john_smith &

