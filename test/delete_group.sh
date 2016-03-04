#!/bin/sh

groupId=$1

curl -X DELETE http://localhost:3000/follow/group/$groupId

