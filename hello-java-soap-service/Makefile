all:
	javac -d . *.java

soap.pid:
	java wsserver/ServiceStarter & echo $$! > $@
	echo give process a few seconds to get started
	sleep 2

wsdl: soap.pid
	wsimport -d . -p wsclient -keep http://localhost:1212/hello?wsdl
	wget http://localhost:1212/hello?wsdl -q -O hello.wsdl

stop: soap.pid
	-kill `cat soap.pid`
	-rm soap.pid
