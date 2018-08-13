#!/bin/bash
#Change to home directory
cd
#Add node 10 to the apt list
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
#Update apt cache
sudo apt update
sudo apt -y dist-upgrade
#Install git, vlc, node, espeak
sudo apt -y install nodejs git espeak mplayer python-pip vlc
#Install youtube-dl
sudo pip install youtube-dl
#Setup time correctly
sudo timedatectl set-timezone America/Detroit
sudo timedatectl set-ntp true
#Clone the projects repo to home directory
git clone https://github.com/nametable/rpi-alarm-system.git
cd rpi-alarm-system
npm install .
sudo npm install pm2@latest -g
pm2 start index.js --name rpi-alarm-system
pm2 save
pm2 stop 0
echo "You will need to place your download your auth key as 'serviceaccountkey.js'"
echo "You will also need to configure 'config.json'. Use config.json.sample to help"
echo "More detailed instructions are at https://github.com/nametable/rpi-alarm-system/blob/master/docs/setup.md"
pm2 startup
