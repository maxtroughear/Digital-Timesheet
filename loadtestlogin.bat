CALL go-wrk.exe -M POST -T 5000 -c 80 -d 30 -H "Content-Type: application/json" -body @testlogin.json "http://localhost/api/"
PAUSE