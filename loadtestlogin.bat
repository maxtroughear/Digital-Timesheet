@ECHO off
CALL go-wrk.exe -M POST -T 10000 -c 20 -d 60 -H "Content-Type: application/json" -body @testlogin.json "http://localhost/api/"
PAUSE