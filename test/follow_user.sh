#!/bin/sh

if [ $# -lt 2 ]; 
then
    echo $0: groupId and userId required
    exit 1
fi

groupId=$1
userId=$2

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

wget -q -O- http://$hostname:$port/follow/user/$groupId/$userId


