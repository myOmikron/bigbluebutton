#!/bin/bash

if [ $(whoami) == "root" ]
then
	if [ ! $0 == "-k" ]
	then
		if [ -f "apply_config.py" ]
		then
			echo "Remove old apply_config.py"
			rm apply_config.py
		fi
		echo "Wget new apply_config.py"
		wget "https://raw.githubusercontent.com/myOmikron/bigbluebutton/scripts/bigbluebutton-html5/apply_config.py" 
		chmod +x apply_config.py

		if [ -f "bigbluebutton-html5.tar.gz" ]
		then
			echo "Remove old tar.gz"
			rm bigbluebutton-html5.tar.gz
		fi
		echo "Wget new tar.gz"
		wget "https://github.com/myOmikron/bigbluebutton/releases/latest/download/bigbluebutton-html5.tar.gz"
	fi

	echo "Backup current bundle to bundle.bkp"
	cp -R /usr/share/meteor/bundle /usr/share/meteor/bundle.bkp

	echo "Overwrite html5 module with custom build"
	tar -xf bigbluebutton-html5.tar.gz -C /usr/share/meteor

	echo "Adjust config"
	./apply_config.py /usr/share/meteor/bundle/programs/server/assets/app/config/settings.yml

	echo "Ensure correct ownership"
	chown meteor:meteor /usr/share/meteor/bundle -R

	echo "Restart bbb-html5 service"
	systemctl restart bbb-html5
else
	echo "Please call me as root"
fi
