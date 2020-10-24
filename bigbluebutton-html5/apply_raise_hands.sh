#!/bin/bash

if [ $(whoami) == "root" ]
then
	echo "Backup current bundle to bundle.bkp"
	cp -R /usr/share/meteor/bundle /usr/share/meteor/bundle.bkp

	echo "Overwrite html5 module with custom build"
	tar -xf bigbluebutton-html5.tar.gz -C /usr/share/meteor

	echo "Ensure correct ownership"
	chown meteor:meteor /usr/share/meteor/bundle -R

	echo "Restart bbb-html5 service"
	systemctl restart bbb-html5
else
	echo "Please call me as root"
fi
