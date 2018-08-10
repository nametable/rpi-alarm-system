#!/bin/bash
#Change to home directory
cd
#Update apt cache
sudo apt update
#Add node 10 to the apt list
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
#Install git, vlc, node
sudo apy install -y nodejs git vlc
#Clone the projects repo to home directory
git clone https://github.com/nametable/rpi-alarm-system.git
cd rpi-alarm-system
npm install .
pm2 start index.js --name rpi-alarm-system
`pm2 startup`
pm2 save
pm2 stop 0
echo "You will need to place your download your auth key as 'serviceaccountkey.js'"
echo "You will also need to configure 'config.json'. Use config.json.sample to help"