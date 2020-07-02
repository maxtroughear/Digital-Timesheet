@ECHO off
CALL go-wrk.exe -M POST -T 5000 -c 80 -d 30 -H "Content-Type: application/json;Authorization: Bearer eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwRDNhUDBhbHhHIiwiaWF0IjoxNTkyMDU1Mjg2LCJpc3MiOiJkdHMiLCJzdWIiOiJTQS9zZXJ2aWNlYWRtaW4ifQ.vC69xCmYFmFOSOG_OdNbHAmHNT1f8j_8HTT19iu3L8Zhku2QoIlO7UqRmdi5zBKU" -body @testcompanylookup.json "http://localhost/api/"
PAUSE