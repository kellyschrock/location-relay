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

wget -q -O- http://$hostname:$port/follow/groups

