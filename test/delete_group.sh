#!/bin/sh

groupId=$1

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

curl -X DELETE http://$hostname:$port/follow/group/$groupId

