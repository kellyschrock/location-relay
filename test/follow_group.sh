#!/bin/sh

if [ $# -lt 1 ]; 
then
    echo $0: groupId required
    exit 1
fi

groupId=$1

wget -q -O- http://localhost:3000/follow/group/$groupId


