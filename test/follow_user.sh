#!/bin/sh

if [ $# -lt 2 ]; 
then
    echo $0: groupId and userId required
    exit 1
fi

groupId=$1
userId=$2

wget -q -O- http://localhost:3000/follow/user/$groupId/$userId


