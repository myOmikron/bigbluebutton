#!/bin/bash

echo "Overwritting html5 module with custom build"
sudo tar -xf bigbluebutton-html5.tar.gz -C /usr/share/meteor

echo "Ensuring correct ownership"
chown meteor:meteor /usr/share/meteor/bundle -R

echo "Restarting bbb-html5 service"
sudo systemctl restart bbb-html5
