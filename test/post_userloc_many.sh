#!/bin/sh

./post_userloc.js `pwd`/latlng/lv-johnson.latlng myGroup joe_user &
sleep 10
./post_userloc.js `pwd`/latlng/lv-johnson.latlng myGroup bill_bonney &
sleep 10
./post_userloc.js `pwd`/latlng/lv-johnson.latlng myGroup john_smith &

