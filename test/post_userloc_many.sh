#!/bin/sh

hostname=$LR_HOST
port=$LR_PORT

if [ -z $hostname ]; 
then
    hostname=localhost
fi

if [ -z $port ]; 
then
    port=3000
fi

echo hostname=$hostname
echo port=$port

./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=stan &
sleep 4
./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=butters &
sleep 4
./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=cartman &
sleep 4
./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=timmy &
sleep 4
./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=kyle &

