#!/bin/sh

hostname=$LR_HOST
port=$LR_PORT
interval=$LR_INTERVAL

if [ -z $hostname ]; 
then
    hostname=localhost
fi

if [ -z $port ]; 
then
    port=3000
fi

if [ -z $interval ]; 
then
    interval=1000
fi

echo hostname=$hostname
echo port=$port

./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=stan --interval=$interval &
sleep 4
./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=butters --interval=$interval &
sleep 4
./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=cartman --interval=$interval &
sleep 4
./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=timmy --interval=$interval &
sleep 4
./post_userloc.js --host=$hostname --port=$port --input=`pwd`/latlng/lv-johnson.latlng --group=myGroup --user=kyle --interval=$interval &

