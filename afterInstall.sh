#!/bin/bash
pwd
ls
cd /home/ubuntu/webapp
printenv
sudo npm install --unsafe-perm=true --allow-root
cd services
node createSchema.js