#!/bin/bash

if [ $(whoami) == "root" ]
then
    if [ ! $1 == "-k" ]
    then
	    if [ -f "bigbluebutton-html5.tar.gz" ]
	    then
            rm bigbluebutton-html5.tar.gz
        fi
	    wget "https://github.com/myOmikron/bigbluebutton/releases/download/v2.2.28/bigbluebutton-html5.tar.gz"
    fi

	echo "Backup current bundle to bundle.bkp"
	cp -R /usr/share/meteor/bundle /usr/share/meteor/bundle.bkp

	echo "Overwrite html5 module with custom build"
	tar -xf bigbluebutton-html5.tar.gz -C /usr/share/meteor

	echo "Write hostname into setting.yml"
	host_name=$(hostname --fqdn)
	sed -i "s/bbb-dev.omikron.dev/$host_name/g" /usr/share/meteor/bundle/programs/server/assets/app/config/settings.yml

	echo "Ensure correct ownership"
	chown meteor:meteor /usr/share/meteor/bundle -R

	echo "Restart bbb-html5 service"
	systemctl restart bbb-html5
else
	echo "Please call me as root"
fi
