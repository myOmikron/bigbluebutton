#!/usr/bin/env python3

import sys, socket, re


if __name__ == "__main__":
	file_ = sys.argv[1]
	hostname = socket.getfqdn()
	
	with open(file_) as f:
		content = f.read()

	content = re.sub(
                r"  note:\n"
                r"    enabled: (true|false)\n"
                r"    url: [a-zA-Z_\.:/]+",
	        r"  note:\n"
                r"    enabled: true\n"
                r"    url: https://{}/pad".format(hostname),
		content
	)

	with open(file_, "w") as f:
		f.write(content)

