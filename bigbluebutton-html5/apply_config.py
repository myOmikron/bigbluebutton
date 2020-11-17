#!/usr/bin/env python3

import sys, socket, re


if __name__ == "__main__":
	file_ = sys.argv[1]
	hostname = socket.getfqdn()
	
	with open(file_) as f:
		content = f.read()

	content = re.sub(
		r"        raiseHandAudioAlerts: (true|false)\n"
		r"        raiseHandPushAlerts: (true|false)",
		r"        raiseHandAudioAlerts: true\n"
		r"        raiseHandPushAlerts: true",
		content
	)

	content = re.sub(
                r"  note:\n"
                r"    enabled: (true|false)\n"
                r"    url: [a-zA-Z_\.:/]+",
	        r"  note:\n"
                r"    enabled: true\n"
                r"    url: https://{}/pad".format(hostname),
		content
	)

	with open("/usr/share/etherpad-lite/APIKEY.txt") as f:
		api_key = f.read()
	content = re.sub(
		r"  etherpad:\n"
		r"    apikey: ETHERPAD_APIKEY",
		r"  etherpad:\n"
		r"    apikey: {}".format(api_key),
		content
	)

	with open(file_, "w") as f:
		f.write(content)

