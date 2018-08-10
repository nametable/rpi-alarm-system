# Hardware and software setup
## Hardware

### Materials
- Raspberry pi 3
- Relay
- Dupont connectors

## Software
- Install the following
nodejs, npm, pm2, git

1. Download the repository
```bash
git clone github.com/nametable/rpi-alarm-system.git
```
2. Install nodejs modules (make sure you are in the downloaded git repo folder)
```bash
npm install .
```
3. Create a Project @ console.cloud.google.com
4. Create a Google Service account @  https://console.cloud.google.com/iam-admin/serviceaccounts
5. Create and download a service account key to use on the pi - don't lose this @ https://console.cloud.google.com/apis/credentials
.. Copy service account key to your the repo folder as **serviceaccountkey.json**