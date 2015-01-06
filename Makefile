debug:
	tessel push index.js -l -a debug -a port=5001 -a interval=1000 -a host=173.255.220.33

deploy:
	tessel push index.js -a port=5001 -a interval=60000 -a host=173.255.220.33

wifi:
	tessel wifi -n HOME-BBC2 -p 3E053A65BCAAE15D
